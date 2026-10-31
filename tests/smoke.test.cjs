/**
 * Prueba de humo de la interfaz: renderiza las lecciones reales con un stub
 * de DOM y recorre el flujo didáctico completo (práctica guiada → evaluación
 * → verificación de ejercicio → completar lección → progreso → navegación).
 * Ejecutar: node tests/smoke.test.cjs
 */
"use strict";

const assert = require("assert");
const path = require("path");
const base = path.join(__dirname, "..");

const stub = require("./dom-stub.cjs");

// --- entorno global simulado (antes de cargar la app) ---
stub.DOCUMENT.reset();
stub.createPage([
  "notice-root", "progress-fill", "progress-percent", "progress-detail",
  "module-nav", "roadmap", "lesson-view", "overview-view", "breadcrumb",
  "reset-progress"
]);
const brand = stub.DOCUMENT.createElement("a");
brand.className = "brand";
stub.DOCUMENT.body.appendChild(brand);

const memory = {};
global.window = stub.installEnvironment().window;
global.document = stub.DOCUMENT;
global.location = { _hash: "", get hash() { return this._hash; }, set hash(v) { this._hash = v; } };
global.CustomEvent = stub.CustomEventStub;
global.localStorage = {
  getItem: (k) => (k in memory ? memory[k] : null),
  setItem: (k, v) => { memory[k] = String(v); },
  removeItem: (k) => { delete memory[k]; }
};

// --- carga en el mismo orden que index.html (todos los módulos publicados) ---
const fs = require("fs");
const contentDir = path.join(base, "content");
fs.readdirSync(contentDir)
  .filter((f) => /^module-\d+\.js$/.test(f))
  .sort()
  .forEach((f) => require(path.join(contentDir, f)));
require(path.join(base, "content", "curriculum.js"));
require(path.join(base, "js", "progress.js"));
require(path.join(base, "js", "checkers.js"));
require(path.join(base, "js", "renderer.js"));
require(path.join(base, "js", "app.js"));

const CURRICULUM = global.window.CURRICULUM;
const store = global.window.JavaLabApp.store;
const app = global.window.JavaLabApp;
const doc = global.document;

let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed += 1;
    console.log("  ok   " + name);
  } catch (err) {
    console.error("  FAIL " + name);
    console.error("       " + (err && err.stack ? err.stack.split("\n").slice(0, 3).join(" | ") : err));
    process.exitCode = 1;
  }
}

function buttons(root) {
  return root.querySelectorAll("button");
}
function buttonByText(root, fragment) {
  return buttons(root).find((b) => String(b.innerHTML || b.textContent || "").includes(fragment));
}
function goTo(lessonId) {
  global.location.hash = lessonId ? "#/leccion/" + lessonId : "#/ruta";
  const handler = global.window._listeners && global.window._listeners["hashchange"];
  if (handler) handler(); else app.go(null);
}

console.log("\n[interfaz: arranque]");

test("la barra lateral muestra los 8 módulos", () => {
  const nav = doc.getElementById("module-nav");
  assert.ok(nav.children.length === 8, "módulos renderizados: " + nav.children.length);
});

test("el módulo 1 indica 0/5 lecciones y los demás 'en preparación'", () => {
  const nav = doc.getElementById("module-nav");
  const first = nav.children[0];
  assert.ok(first.textContent.includes("0/5"), "texto del módulo 1: " + first.textContent);
  const second = nav.children[1];
  assert.ok(second.textContent.includes("preparación"), "el módulo 2 debe indicar que está en preparación");
});

test("la vista de ruta (overview) lista módulos con estados", () => {
  goTo(null);
  const roadmap = doc.getElementById("roadmap");
  assert.strictEqual(roadmap.children.length, 8);
  assert.ok(roadmap.textContent.includes("En preparación"));
});

console.log("\n[interfaz: render de lecciones]");

const lessons = CURRICULUM.modules[0].lessons;

lessons.forEach((lesson) => {
  test("renderiza " + lesson.id + " sin excepciones", () => {
    goTo(lesson.id);
    const view = doc.getElementById("lesson-view");
    assert.strictEqual(view.hidden, false);
    assert.ok(view.children.length > 0, "la vista quedó vacía");
    assert.ok(view.textContent.includes(lesson.title), "no aparece el título");
    assert.ok(view.querySelectorAll(".trace-box").length >= 1, "falta la traza");
    assert.ok(view.querySelectorAll(".practice-box").length >= 1, "falta la práctica guiada");
    assert.ok(view.querySelectorAll(".exercise-card").length >= 3, "faltan ejercicios");
    assert.ok(view.querySelectorAll(".checkpoint").length >= 1, "falta la evaluación");
  });
});

test("la ruta desconocida muestra aviso y regresa al inicio", () => {
  goTo("no-existe");
  const notice = doc.getElementById("notice-root");
  assert.ok(notice.children.length >= 1, "no se mostró aviso");
  assert.ok(notice.textContent.includes("no existe"));
});

console.log("\n[interfaz: flujo didáctico completo en m1l1]");

test("el botón de completar arranca deshabilitado (requisitos sin cumplir)", () => {
  goTo("m1l1");
  const view = doc.getElementById("lesson-view");
  const complete = buttonByText(view, "Marcar lección");
  assert.ok(complete, "no existe el botón de completar");
  assert.strictEqual(complete.disabled, true, "no debe permitirse completar sin requisitos");
});

test("práctica guiada: la solución propia supera la verificación", () => {
  goTo("m1l1");
  const view = doc.getElementById("lesson-view");
  const practice = CURRICULUM.modules[0].lessons[0].practice;
  const textarea = view.querySelectorAll("textarea")[0];
  assert.ok(textarea, "no hay área de práctica");
  textarea.value = practice.solution.code;
  const check = buttonByText(view, "Comprobar");
  assert.ok(check, "no hay botón de comprobación");
  check.click();
  assert.strictEqual(store.record("m1l1").practice.passed, true, "la práctica no quedó registrada");
});

test("práctica guiada: un intento incompleto devuelve observaciones, no éxito", () => {
  goTo("m1l2");
  const view = doc.getElementById("lesson-view");
  const textarea = view.querySelectorAll("textarea")[0];
  textarea.value = "public class X { }";
  buttonByText(view, "Comprobar").click();
  assert.strictEqual(store.record("m1l2").practice.passed, false, "no debe aprobar código incompleto");
  const feedback = view.querySelectorAll(".practice-box .feedback")[0];
  assert.ok(feedback, "no hay mensaje de retroalimentación");
  assert.ok(
    /observaci\u00f3n/i.test(feedback.textContent),
    "el mensaje debe explicar qué falta; fue: " + feedback.textContent.slice(0, 60)
  );
});

test("evaluación: responder todo bien alcanza el 100%", () => {
  goTo("m1l1");
  const view = doc.getElementById("lesson-view");
  const quiz = CURRICULUM.modules[0].lessons[0].quiz;
  quiz.questions.forEach((q) => {
    const option = view.querySelectorAll(".quiz-option").find(
      (b) => b.getAttribute("data-q") === q.id && b.getAttribute("data-opt") === q.answer
    );
    assert.ok(option, "falta la opción correcta de " + q.id);
    option.click();
  });
  buttonByText(view, "Corregir mis respuestas").click();
  const record = store.record("m1l1");
  assert.strictEqual(record.quiz.bestScore, 1);
  assert.strictEqual(record.quiz.attempts, 1);
  assert.ok(view.querySelectorAll(".quiz-why").length === quiz.questions.length, "falta el por qué por pregunta");
});

test("evaluación: responder mal explica por qué y no aprueba", () => {
  goTo("m1l3");
  const view = doc.getElementById("lesson-view");
  const quiz = CURRICULUM.modules[0].lessons[2].quiz;
  quiz.questions.forEach((q) => {
    const wrong = q.options.find((o) => o.id !== q.answer);
    const option = view.querySelectorAll(".quiz-option").find(
      (b) => b.getAttribute("data-q") === q.id && b.getAttribute("data-opt") === wrong.id
    );
    option.click();
  });
  buttonByText(view, "Corregir mis respuestas").click();
  const record = store.record("m1l3");
  assert.strictEqual(record.quiz.passed, false);
  assert.ok(view.querySelectorAll(".quiz-why.bad").length === quiz.questions.length);
});

test("reintentar la evaluación limpia las respuestas y permite corregir de nuevo", () => {
  goTo("m1l3");
  const view = doc.getElementById("lesson-view");
  const quiz = CURRICULUM.modules[0].lessons[2].quiz;
  // Primero se corrige una evaluación para que exista la opción de reintentar.
  quiz.questions.forEach((q) => {
    const option = view.querySelectorAll(".quiz-option").find(
      (b) => b.getAttribute("data-q") === q.id && b.getAttribute("data-opt") === q.answer
    );
    option.click();
  });
  buttonByText(view, "Corregir mis respuestas").click();
  assert.ok(view.querySelectorAll(".quiz-option.correct").length >= 1, "no se marcaron las acertadas");

  const retry = buttonByText(view, "Reintentar");
  assert.ok(retry, "no aparece la opción de reintentar");
  retry.click();
  assert.strictEqual(view.querySelectorAll(".quiz-option.selected").length, 0, "quedaron respuestas seleccionadas");
  assert.strictEqual(view.querySelectorAll(".quiz-why").length, 0, "quedaron explicaciones antiguas");
  assert.ok(buttonByText(view, "Corregir mis respuestas"), "no se reconstruyó el botón de corregir");
});

test("ejercicio: exige comprobar todos los criterios antes de verificar", () => {
  goTo("m1l1");
  const view = doc.getElementById("lesson-view");
  const card = view.querySelectorAll(".exercise-card")[0];
  const verify = buttons(card).find((b) => b.textContent.includes("verificado") || b.innerHTML.includes("verificado"));
  verify.click();
  assert.strictEqual(store.requirementsStatus(CURRICULUM.modules[0].lessons[0]).verifiedExercises, 0,
    "no debe verificar sin marcar criterios");
});

test("ejercicio: con los criterios marcados se verifica y cuenta para el requisito", () => {
  goTo("m1l1");
  const view = doc.getElementById("lesson-view");
  const card = view.querySelectorAll(".exercise-card")[0];
  card.querySelectorAll("input[type=checkbox]").forEach((box) => {
    box.checked = true;
    box.dispatchEvent({ type: "change" });
  });
  const verify = buttons(card).find((b) => b.innerHTML.includes("verificado") || b.textContent.includes("verificado"));
  verify.click();
  assert.strictEqual(store.requirementsStatus(CURRICULUM.modules[0].lessons[0]).verifiedExercises, 1);
});

test("con los tres requisitos cumplidos, la lección se puede dominar y se guarda", () => {
  goTo("m1l1");
  const view = doc.getElementById("lesson-view");
  const complete = buttonByText(view, "Marcar lección");
  assert.strictEqual(complete.disabled, false, "debería estar habilitado con los requisitos cumplidos");
  complete.click();
  assert.strictEqual(store.isCompleted("m1l1"), true);
  assert.ok(memory["javaLab.progress.v2"], "no se persistió en localStorage");
});

test("el progreso global sube y la navegación refleja la lección dominada", () => {
  goTo(null);
  const percent = doc.getElementById("progress-percent");
  assert.strictEqual(percent.textContent, "20%", "porcentaje mostrado: " + percent.textContent);
  const nav = doc.getElementById("module-nav");
  assert.ok(nav.textContent.includes("Dominada"), "la lección completada debe aparecer como dominada");
});

test("tras recargar (nuevo store con el mismo storage) el progreso persiste", () => {
  const fresh = global.window.JavaLabProgress.createProgressStore(global.localStorage, { legacyIdMap: CURRICULUM.legacyIdMap });
  assert.strictEqual(fresh.isCompleted("m1l1"), true);
});

test("la navegación anterior/siguiente funciona entre lecciones", () => {
  goTo("m1l1");
  const view = doc.getElementById("lesson-view");
  const next = buttonByText(view, "Anatomía");
  assert.ok(next, "no hay botón de siguiente lección");
  next.click();
  assert.ok(global.location.hash.includes("m1l2"), "hash tras siguiente: " + global.location.hash);
  const back = buttonByText(doc.getElementById("lesson-view"), "Volver a la ruta");
  assert.ok(back, "no hay botón de volver");
  back.click();
  assert.strictEqual(global.location.hash, "#/ruta");
});

test("reiniciar progreso borra el aviso y la ruta vuelve a cero", () => {
  goTo(null);
  const reset = doc.getElementById("reset-progress");
  global.window.confirm = () => true;
  reset.click();
  assert.strictEqual(store.isCompleted("m1l1"), false);
  assert.strictEqual(doc.getElementById("progress-percent").textContent, "0%");
});

console.log("\nPruebas de interfaz: " + passed + " superadas.");
