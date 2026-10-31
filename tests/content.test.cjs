/**
 * Pruebas de contenido: valida que el currículo cumple el estándar
 * pedagógico obligatorio antes de publicarse.
 * Ejecutar: node tests/content.test.cjs
 */
"use strict";

const assert = require("assert");
const path = require("path");
const fs = require("fs");
const base = path.join(__dirname, "..");

// Carga TODOS los módulos publicados (content/module-XX.js) en orden numérico
// y después el currículo, que los fusiona con sus fichas oficiales.
const contentDir = path.join(base, "content");
fs.readdirSync(contentDir)
  .filter((f) => /^module-\d+\.js$/.test(f))
  .sort()
  .forEach((f) => require(path.join(contentDir, f)));

const CURRICULUM = require(path.join(contentDir, "curriculum.js"));
const checkers = require(path.join(base, "js", "checkers.js"));

const ALLOWED_BLOCKS = new Set([
  "lead", "heading", "para", "concept", "analogy", "tip", "list",
  "table", "code", "lines", "output", "errors", "application", "trace"
]);

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

const modules = CURRICULUM.modules;
const published = modules.filter((m) => m.lessons.length > 0);

console.log("\n[currículo]");

test("hay exactamente 8 módulos", () => {
  assert.strictEqual(modules.length, 8);
  assert.deepStrictEqual(modules.map((m) => m.number), [1, 2, 3, 4, 5, 6, 7, 8]);
});

test("los módulos sin lecciones están en estado 'preparación' (sin contenido simulado)", () => {
  const empty = modules.filter((m) => m.lessons.length === 0);
  empty.forEach((m) => {
    assert.ok(m.title && m.title.length > 5, m.id + " sin título");
    assert.ok(m.description && m.description.length > 30, m.id + " sin descripción");
  });
});

test("todos los módulos tienen metadatos completos", () => {
  modules.forEach((m) => {
    assert.ok(m.id && m.title && m.subtitle && m.description, "metadatos incompletos en " + m.id);
  });
});

const allLessons = modules.flatMap((m) => m.lessons.map((l) => ({ lesson: l, module: m })));

test("los identificadores de lección son únicos", () => {
  const ids = allLessons.map((x) => x.lesson.id);
  assert.strictEqual(new Set(ids).size, ids.length, "identificadores repetidos");
});

test("las lecciones publicadas están numeradas en orden desde 1", () => {
  published.forEach((m) => {
    assert.deepStrictEqual(m.lessons.map((l) => l.number), m.lessons.map((_, i) => i + 1), "numeración de " + m.id);
  });
});

allLessons.forEach(({ lesson, module }) => {
  const tag = module.id + "/" + lesson.id;

  test(tag + ": objetivos verificables (>= 3) y requisitos explícitos", () => {
    assert.ok(lesson.objectives && lesson.objectives.length >= 3, "objetivos insuficientes");
    assert.ok(lesson.requirements && typeof lesson.requirements.quizScore === "number", "sin requisitos");
    assert.ok(lesson.duration, "sin duración");
  });

  test(tag + ": estructura pedagógica completa", () => {
    const types = lesson.blocks.map((b) => b.type);
    types.forEach((t) => assert.ok(ALLOWED_BLOCKS.has(t), "tipo de bloque desconocido: " + t));
    assert.ok(types.includes("lead"), "falta explicación inicial");
    assert.ok(types.includes("analogy"), "falta analogía");
    assert.ok(types.includes("code"), "falta código Java");
    const hasOutput =
      types.includes("output") ||
      lesson.blocks.some((b) => b.type === "application" && b.output);
    assert.ok(hasOutput, "falta salida esperada (bloque output o salida en la aplicación)");
    assert.ok(types.includes("errors"), "faltan errores frecuentes");
    assert.ok(types.includes("application"), "falta aplicación práctica");
    assert.ok(lesson.blocks.length >= 8, "demasiados pocos bloques");
  });

  test(tag + ": código Java no vacío y con estructura balanceada", () => {
    const codeBlocks = lesson.blocks.filter((b) => b.type === "code" || b.type === "application");
    assert.ok(codeBlocks.length >= 1);
    codeBlocks.forEach((b) => {
      assert.ok(b.code && b.code.trim().length > 20, "código demasiado corto");
      const open = (b.code.match(/\{/g) || []).length;
      const close = (b.code.match(/\}/g) || []).length;
      assert.strictEqual(open, close, "llaves desbalanceadas en " + (b.file || b.type));
      const quotes = (b.code.match(/"/g) || []).length;
      assert.strictEqual(quotes % 2, 0, "comillas sin cerrar en " + (b.file || b.type));
    });
  });

  test(tag + ": la traza existe y sus pasos son coherentes con el código", () => {
    const traces = lesson.blocks.filter((b) => b.type === "trace");
    // La traza se declara como bloque o dentro de un ejemplo: se exige al menos una.
    assert.ok(traces.length >= 1, "falta bloque de traza paso a paso");
    traces.forEach((t) => {
      const lines = t.code.split("\n").length;
      assert.ok(t.steps.length >= 3, "traza con muy pocos pasos");
      t.steps.forEach((s) => {
        assert.ok(s.line >= 1 && s.line <= lines, "paso con línea fuera de rango: " + s.line);
        assert.ok(s.note && s.note.length > 20, "paso sin explicación");
        assert.ok(Array.isArray(s.out), "paso sin salida acumulada");
      });
    });
  });

  test(tag + ": práctica guiada con pistas progresivas y solución", () => {
    const p = lesson.practice;
    assert.ok(p, "sin práctica guiada");
    assert.ok(p.hints && p.hints.length >= 2, "menos de 2 pistas");
    assert.ok(p.checks && p.checks.length >= 3, "menos de 3 reglas de comprobación");
    assert.ok(p.solution && p.solution.code && p.solution.explanation, "sin solución comentada");
    assert.ok(p.prompt && p.prompt.length > 30, "enunciado demasiado corto");
    [...p.checks, ...(p.forbidden || [])].forEach((r) => {
      assert.ok(r.pattern, "regla sin patrón");
      assert.ok(r.message, "regla sin mensaje");
      assert.doesNotThrow(() => new RegExp(r.pattern), "patrón inválido: " + r.pattern);
    });
  });

  test(tag + ": ejercicios independientes progresivos con criterios", () => {
    const ex = lesson.exercises;
    assert.ok(ex && ex.length >= 3, "menos de 3 ejercicios");
    ex.forEach((e, i) => {
      assert.ok(e.id && e.id.startsWith(lesson.id), "id de ejercicio mal formado");
      assert.ok(e.statement && e.statement.length > 30, "enunciado corto");
      assert.ok(e.criteria && e.criteria.length >= 3, "menos de 3 criterios de prueba");
      assert.ok(e.solution && e.solution.code && e.solution.explanation, "sin solución");
      if (i === 0) assert.strictEqual(e.level, "Básico", "el primer ejercicio debe ser básico");
      if (i === ex.length - 1) assert.ok(e.level !== "Básico", "el último debe ser aplicado o intermedio");
    });
  });

  test(tag + ": evaluación con respuestas correctas y explicación por opción", () => {
    const q = lesson.quiz;
    assert.ok(q && q.questions && q.questions.length >= 4, "menos de 4 preguntas");
    assert.ok(typeof q.passScore === "number" && q.passScore > 0, "sin puntaje de aprobación");
    q.questions.forEach((question) => {
      assert.ok(question.options.length >= 3, "pocas opciones");
      assert.ok(question.options.some((o) => o.id === question.answer), "la respuesta no está entre las opciones");
      assert.ok(question.why && question.why.correct, "sin explicación de acierto");
      question.options
        .filter((o) => o.id !== question.answer)
        .forEach((o) => {
          assert.ok(question.why.wrong && question.why.wrong[o.id], "falta explicación de la opción " + o.id);
        });
    });
    // Si todas las respuestas son correctas, la puntuación debe ser 1.
    const answers = {};
    q.questions.forEach((question) => { answers[question.id] = question.answer; });
    assert.strictEqual(checkers.scoreQuiz(q.questions, answers).score, 1, "las respuestas marcadas no puntúan 1");
  });

  test(tag + ": resumen y requisito de la evaluación coherentes", () => {
    assert.ok(lesson.summary && lesson.summary.length >= 4, "resumen insuficiente");
    assert.strictEqual(
      lesson.requirements.quizScore,
      lesson.quiz.passScore,
      "el requisito de la lección debe coincidir con el passScore del quiz"
    );
  });

  test(tag + ": los patrones de la práctica aceptan su propia solución", () => {
    const problems = checkers.verifyCode(lesson.practice.solution.code, {
      must: lesson.practice.checks,
      mustNot: lesson.practice.forbidden || []
    });
    assert.deepStrictEqual(problems, [], "la solución de la práctica no pasa su propia verificación");
  });
});

test("los textos del contenido no arrastran marcadores internos", () => {
  const raw = JSON.stringify(CURRICULUM);
  assert.ok(!raw.includes("__MORE__"), "quedó un marcador de plantilla");
});

test("el módulo 1 tiene 5 lecciones publicadas", () => {
  assert.strictEqual(modules[0].lessons.length, 5);
});

console.log("\nPruebas de contenido: " + passed + " superadas.");
