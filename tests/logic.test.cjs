/**
 * Pruebas de lógica: motor de progreso (persistencia, requisitos,
 * desbloqueo, migración y recuperación) + utilidades de verificación.
 * Ejecutar: node tests/logic.test.cjs
 */
"use strict";

const assert = require("assert");
const path = require("path");
const base = path.join(__dirname, "..");

const progressApi = require(path.join(base, "js", "progress.js"));
const checkers = require(path.join(base, "js", "checkers.js"));

function fakeStorage(initial) {
  const data = Object.assign({}, initial);
  return {
    data,
    fails: false,
    getItem(k) { return k in data ? data[k] : null; },
    setItem(k, v) {
      if (this.fails) throw new Error("QuotaExceededError simulado");
      data[k] = String(v);
    },
    removeItem(k) { delete data[k]; }
  };
}

const modulesStub = [
  { id: "m1", lessons: [{ id: "m1l1" }, { id: "m1l2" }, { id: "m1l3" }, { id: "m1l4" }, { id: "m1l5" }] },
  { id: "m2", lessons: [{ id: "m2l1" }, { id: "m2l2" }] }
];

const lessonStub = {
  id: "m1l1",
  requirements: { quizScore: 0.75, practice: true, exercisesMin: 1 }
};

let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed += 1;
    console.log("  ok   " + name);
  } catch (err) {
    console.error("  FAIL " + name);
    console.error("       " + (err && err.message));
    process.exitCode = 1;
  }
}

console.log("\n[progress.js]");

test("almacén vacío: nada completado, 0%", () => {
  const store = progressApi.createProgressStore(fakeStorage(), {});
  assert.strictEqual(store.overallProgress(modulesStub).percent, 0);
  assert.strictEqual(store.isCompleted("m1l1"), false);
});

test("no se puede completar sin cumplir requisitos", () => {
  const store = progressApi.createProgressStore(fakeStorage(), {});
  assert.strictEqual(store.canComplete(lessonStub), false);
  const result = store.completeLesson("m1l1");
  assert.strictEqual(result.ok, true);
  // El motor no impide la llamada, pero requirementsStatus marca lo que falta.
  const status = store.requirementsStatus(lessonStub);
  assert.strictEqual(status.met, false);
});

test("requisitos: quiz + práctica + 1 ejercicio = completado", () => {
  const store = progressApi.createProgressStore(fakeStorage(), {});
  store.recordQuiz("m1l1", 1, true);
  store.recordPractice("m1l1", true);
  store.recordExercise("m1l1", "m1l1e1", true);
  assert.strictEqual(store.requirementsStatus(lessonStub).met, true);
  assert.strictEqual(store.canComplete(lessonStub), true);
  store.completeLesson("m1l1");
  assert.strictEqual(store.isCompleted("m1l1"), true);
});

test("quiz bajo el 75% no cumple el requisito aunque haya intentos", () => {
  const store = progressApi.createProgressStore(fakeStorage(), {});
  store.recordQuiz("m1l1", 0.5, false);
  store.recordPractice("m1l1", true);
  store.recordExercise("m1l1", "m1l1e1", true);
  const status = store.requirementsStatus(lessonStub);
  const quizItem = status.items.find((i) => i.id === "quiz");
  assert.strictEqual(quizItem.met, false);
  assert.strictEqual(store.canComplete(lessonStub), false);
});

test("desmarcar ejercicio reduce el conteo", () => {
  const store = progressApi.createProgressStore(fakeStorage(), {});
  store.recordQuiz("m1l1", 1, true);
  store.recordPractice("m1l1", true);
  store.recordExercise("m1l1", "m1l1e1", true);
  store.recordExercise("m1l1", "m1l1e1", false);
  assert.strictEqual(store.requirementsStatus(lessonStub).verifiedExercises, 0);
});

test("la persistencia sobrevive a una nueva instancia", () => {
  const storage = fakeStorage();
  const first = progressApi.createProgressStore(storage, {});
  first.recordQuiz("m1l1", 1, true);
  first.completeLesson("m1l1");

  const second = progressApi.createProgressStore(storage, {});
  assert.strictEqual(second.isCompleted("m1l1"), true);
  assert.strictEqual(second.record("m1l1").quiz.bestScore, 1);
});

test("resetLesson borra SOLO esa lección", () => {
  const storage = fakeStorage();
  const store = progressApi.createProgressStore(storage, {});
  store.completeLesson("m1l1");
  store.completeLesson("m1l2");
  store.resetLesson("m1l1");
  assert.strictEqual(store.isCompleted("m1l1"), false);
  assert.strictEqual(store.isCompleted("m1l2"), true);
});

test("módulo 2 bloqueado hasta 80% del módulo 1", () => {
  const store = progressApi.createProgressStore(fakeStorage(), {});
  assert.strictEqual(store.isModuleUnlocked(1, modulesStub, 0.8), false);
  ["m1l1", "m1l2", "m1l3", "m1l4"].forEach((id) => store.completeLesson(id)); // 4/5 = 80%
  assert.strictEqual(store.isModuleUnlocked(1, modulesStub, 0.8), true);
});

test("el primer módulo siempre está desbloqueado", () => {
  const store = progressApi.createProgressStore(fakeStorage(), {});
  assert.strictEqual(store.isModuleUnlocked(0, modulesStub, 0.8), true);
});

test("estadísticas por módulo (total, hechas, porcentaje)", () => {
  const store = progressApi.createProgressStore(fakeStorage(), {});
  store.completeLesson("m1l1");
  const stats = store.moduleStats(modulesStub[0]);
  assert.deepStrictEqual({ total: stats.total, done: stats.done, percent: stats.percent }, { total: 5, done: 1, percent: 20 });
  assert.strictEqual(store.moduleStats({ id: "mx", lessons: [] }).status, "preparing");
});

test("recuperación: JSON dañado genera aviso y copia de seguridad", () => {
  const storage = fakeStorage({ "javaLab.progress.v2": "{esto no es json" });
  const store = progressApi.createProgressStore(storage, {});
  assert.strictEqual(store.loadResult.recovered, true);
  assert.strictEqual(store.lastNotice().type, "warning");
  assert.ok(storage.getItem("javaLab.progress.corrupt") !== null, "no se guardó copia de seguridad");
  assert.strictEqual(store.isCompleted("m1l1"), false);
});

test("recuperación: versión de esquema incompatible también se migra", () => {
  const storage = fakeStorage({ "javaLab.progress.v2": JSON.stringify({ version: 1, lessons: { old: { completed: true } } }) });
  const store = progressApi.createProgressStore(storage, {});
  assert.strictEqual(store.loadResult.recovered, true);
  assert.strictEqual(store.getState().version, 2);
});

test("migración de la versión anterior de la guía (java-01 → m1l1)", () => {
  const storage = fakeStorage({ javaLabCompleted: JSON.stringify(["java-01"]) });
  const store = progressApi.createProgressStore(storage, { legacyIdMap: { "java-01": "m1l1" } });
  assert.strictEqual(store.isCompleted("m1l1"), true);
  assert.strictEqual(store.record("m1l1").source, "migration");
});

test("fallo de escritura: no marca completada y devuelve error", () => {
  const storage = fakeStorage();
  const store = progressApi.createProgressStore(storage, {});
  store.recordQuiz("m1l1", 1, true);
  store.recordPractice("m1l1", true);
  store.recordExercise("m1l1", "m1l1e1", true);
  storage.fails = true;
  const result = store.completeLesson("m1l1");
  assert.strictEqual(result.ok, false);
  assert.ok(result.message && result.message.length > 20, "falta mensaje de error");
  assert.strictEqual(store.isCompleted("m1l1"), false, "no debe quedar completada si no se pudo guardar");
});

test("sin localStorage disponible: almacén en memoria, sin excepciones", () => {
  const storage = fakeStorage();
  const store = progressApi.createProgressStore(storage, {});
  store.setUi({ lastLesson: "m1l1" });
  assert.strictEqual(store.getState().ui.lastLesson, "m1l1");
});

test("resetAll elimina todo el progreso", () => {
  const storage = fakeStorage();
  const store = progressApi.createProgressStore(storage, {});
  store.completeLesson("m1l1");
  store.resetAll();
  assert.strictEqual(store.isCompleted("m1l1"), false);
  assert.strictEqual(store.overallProgress(modulesStub).done, 0);
});

test("findLesson devuelve módulo e índice correctos", () => {
  const store = progressApi.createProgressStore(fakeStorage(), {});
  const found = store.findLesson(modulesStub, "m1l3");
  assert.strictEqual(found.module.id, "m1");
  assert.strictEqual(found.moduleIndex, 0);
  assert.strictEqual(store.findLesson(modulesStub, "no-existe"), null);
});

console.log("\n[checkers.js]");

test("escapeHtml neutraliza etiquetas", () => {
  assert.strictEqual(checkers.escapeHtml('<script>alert("x")</script>'), "&lt;script&gt;alert(\"x\")&lt;/script&gt;");
});

test("highlightJava resalta palabras clave y escapa HTML", () => {
  const html = checkers.highlightJava('public class A { int x = 5; }');
  assert.ok(html.includes('syntax-purple">public'));
  assert.ok(html.includes('syntax-number">5'));
  assert.ok(!html.includes("<script"));
});

test("highlightJava NO se rompe con etiquetas dentro de cadenas", () => {
  const html = checkers.highlightJava('System.out.println("<b>hola</b>");');
  assert.ok(html.includes("&lt;b&gt;"), "la cadena debe quedar escapada");
  assert.ok(!html.includes("<b>"), "no debe inyectarse HTML real");
});

test("normalizeCode quita comentarios y espacios", () => {
  assert.strictEqual(checkers.normalizeCode("int  x  =  1; // hola\n"), "int x = 1;");
  assert.strictEqual(checkers.normalizeCode("/* bloque */ int y = 2;"), "int y = 2;");
});

test("countMatches respeta el mínimo", () => {
  assert.strictEqual(checkers.countMatches("a a a", "a"), 3);
  assert.strictEqual(checkers.countMatches("System.out.println(1); System.out.println(2);", "println\\("), 2);
});

test("verifyCode: código vacío produce observación", () => {
  const problems = checkers.verifyCode("   ", { must: [{ pattern: "x" }] });
  assert.strictEqual(problems.length, 1);
  assert.ok(problems[0].message.includes("no escribiste código"));
});

test("verifyCode: detecta faltantes y acepta el código correcto", () => {
  const rules = {
    must: [
      { pattern: "public\\s+class\\s+Hola", message: "falta la clase" },
      { pattern: "System\\.out\\.println\\(", min: 2, message: "faltan println" }
    ],
    mustNot: [{ pattern: "System\\.out\\.Println", message: "Println mal escrito" }]
  };
  assert.strictEqual(checkers.verifyCode("public class Hola {}", rules).length > 0, true);
  const good = "public class Hola {\n  public static void main(String[] a) {\n    System.out.println(\"x\");\n    System.out.println(\"y\");\n  }\n}";
  assert.deepStrictEqual(checkers.verifyCode(good, rules), []);
});

test("verifyCode: los espacios de más no invalidan patrones tolerantes", () => {
  const tolerant = { must: [{ pattern: "System\\.out\\.println\\(\\s*\"Hola\"\\s*\\)\\s*;" }] };
  assert.deepStrictEqual(checkers.verifyCode('System.out.println( "Hola" ) ;', tolerant), []);
  assert.deepStrictEqual(checkers.verifyCode("System.out.println(\"Hola\");", tolerant), []);

  // Un patrón estricto (sin \\s*) sí nota los espacios: los patrones de las
  // lecciones se escriben tolerantes a propósito.
  const strict = { must: [{ pattern: "System\\.out\\.println\\(\"Hola\"\\);" }] };
  assert.strictEqual(checkers.verifyCode('System.out.println( "Hola" ) ;', strict).length, 1);
});

test("verifyCode: comentarios y saltos de línea no afectan la comprobación", () => {
  const rules = { must: [{ pattern: "int\\s+x\\s*=\\s*1\\s*;" }] };
  const code = "public class A {\n    // comentario con ; y llaves {\n    int   x = 1 ;   /* bloque */\n}";
  assert.deepStrictEqual(checkers.verifyCode(code, rules), []);
});

test("verifyCode: reglas mustNot se evalúan", () => {
  const rules = { mustNot: [{ pattern: "/\\s*0\\b", message: "sigues dividiendo entre cero" }] };
  const problems = checkers.verifyCode("int r = 10 / 0;", rules);
  assert.strictEqual(problems.length, 1);
  assert.deepStrictEqual(checkers.verifyCode("int r = 10 / 2;", rules), []);
});

test("scoreQuiz: puntuación y explicación por opción", () => {
  const questions = [
    {
      id: "q1",
      question: "p",
      options: [{ id: "a", text: "1" }, { id: "b", text: "2" }],
      answer: "b",
      why: { correct: "bien", wrong: { a: "mal: X" } }
    },
    {
      id: "q2",
      question: "p2",
      options: [{ id: "a", text: "1" }, { id: "b", text: "2" }],
      answer: "a",
      why: { correct: "ok", wrong: { b: "mal: Y" } }
    }
  ];
  const full = checkers.scoreQuiz(questions, { q1: "b", q2: "a" });
  assert.strictEqual(full.score, 1);
  assert.strictEqual(full.hits, 2);

  const partial = checkers.scoreQuiz(questions, { q1: "a", q2: "b" });
  assert.strictEqual(partial.score, 0);
  assert.strictEqual(partial.results[0].why, "mal: X");
  assert.strictEqual(partial.results[1].why, "mal: Y");

  const none = checkers.scoreQuiz(questions, {});
  assert.strictEqual(none.results[0].correct, false);
  assert.ok(none.results[0].why.includes("Sin respuesta"));
});

console.log("\nPruebas de lógica: " + passed + " superadas.");
