/**
 * Java Lab — Utilidades puras: resaltado de sintaxis y verificación de código
 * --------------------------------------------------------------------------
 * Sin DOM: se puede ejecutar directamente en Node para las pruebas.
 *
 * IMPORTANTE (honestidad pedagógica): verifyCode() hace una revisión
 * estructural del TEXTO, no compila Java. La interfaz debe decirlo siempre.
 */
(function (global) {
  "use strict";

  var KEYWORDS = [
    "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char",
    "class", "const", "continue", "default", "do", "double", "else", "enum",
    "extends", "final", "finally", "float", "for", "goto", "if", "implements",
    "import", "instanceof", "int", "interface", "long", "native", "new",
    "package", "private", "protected", "public", "return", "short", "static",
    "strictfp", "super", "switch", "synchronized", "this", "throw", "throws",
    "transient", "try", "void", "volatile", "while", "var", "true", "false",
    "null", "record", "sealed", "permits", "yield"
  ];

  var TYPES = [
    "System", "String", "Math", "Scanner", "Object", "Integer", "Double",
    "Character", "Boolean", "ArrayList", "HashMap", "List", "Map", "Exception",
    "RuntimeException", "IOException", "Thread", "Runnable"
  ];

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /**
   * Resalta código Java de forma segura: primero se escapan los caracteres
   * HTML y después se envuelven los tokens. Un único recorrido evita que el
   * resaltado de una cadena destruya el de otro token.
   */
  function highlightJava(source) {
    var text = escapeHtml(source == null ? "" : String(source));
    var keywordGroup = KEYWORDS.join("|");
    var typeGroup = TYPES.join("|");

    var pattern = new RegExp(
      [
        "(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)", // 1 comentario
        "(\"(?:\\\\.|[^\"\\\\])*\")", // 2 cadena
        "('(?:\\\\.|[^'\\\\])*')", // 3 carácter
        "(@[A-Za-z]\\w*)", // 4 anotación
        "\\b(" + keywordGroup + ")\\b", // 5 palabra clave
        "\\b(" + typeGroup + ")\\b", // 6 tipo/clase conocida
        "\\b(\\d+\\.?\\d*)\\b" // 7 número
      ].join("|"),
      "g"
    );

    return text.replace(pattern, function (match, comment, str, ch, ann, kw, type, num) {
      if (comment) return '<span class="syntax-comment">' + comment + "</span>";
      if (str) return '<span class="syntax-green">' + str + "</span>";
      if (ch) return '<span class="syntax-green">' + ch + "</span>";
      if (ann) return '<span class="syntax-annotation">' + ann + "</span>";
      if (kw) return '<span class="syntax-purple">' + kw + "</span>";
      if (type) return '<span class="syntax-blue">' + type + "</span>";
      if (num) return '<span class="syntax-number">' + num + "</span>";
      return match;
    });
  }

  /** Cuenta coincidencias de un patrón (para exigir varias instrucciones). */
  function countMatches(text, pattern, flags) {
    var re;
    try {
      re = new RegExp(pattern, (flags || "") + (flags && flags.indexOf("g") >= 0 ? "" : "g"));
    } catch (err) {
      return 0;
    }
    var matches = text.match(re);
    return matches ? matches.length : 0;
  }

  /**
   * Normaliza un intento del estudiante: quita comentarios y espacios
   * redundantes para que un espacio de más no marque mal una respuesta.
   */
  function normalizeCode(code) {
    return String(code || "")
      .replace(/\/\*[\s\S]*?\*\//g, " ")
      .replace(/\/\/[^\n]*/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Reglas de verificación declarativas:
   *   must:    [{ pattern, flags?, min?, message, hint? }]
   *   mustNot: [{ pattern, flags?, message? }]
   * Devuelve una lista de problemas (vacía = sin observaciones).
   */
  function verifyCode(code, rules) {
    var problems = [];
    var raw = String(code || "");
    var normalized = normalizeCode(raw);
    rules = rules || {};

    if (!normalized) {
      problems.push({
        message: "Todavía no escribiste código. Intenta aunque no sea perfecto.",
        hint: "Empieza con la estructura que viste en el ejemplo."
      });
      return problems;
    }

    (rules.must || []).forEach(function (rule) {
      var flags = rule.flags || "";
      // Por defecto se evalúa sobre el código normalizado (sin comentarios ni
      // espacios redundantes): un espacio de más no debe marcar mal una
      // respuesta. Usa { raw:true } cuando la regla dependa del texto exacto.
      var haystack = rule.raw ? raw : normalized;
      var count = countMatches(haystack, rule.pattern, flags);
      var min = typeof rule.min === "number" ? rule.min : 1;
      if (count < min) {
        problems.push({
          message: rule.message || "Falta una estructura obligatoria.",
          hint: rule.hint || ""
        });
      }
    });

    (rules.mustNot || []).forEach(function (rule) {
      var flags = rule.flags || "";
      var haystack = rule.raw ? raw : normalized;
      if (countMatches(haystack, rule.pattern, flags) > 0) {
        problems.push({
          message: rule.message || "Hay una construcción que no corresponde a esta práctica.",
          hint: rule.hint || ""
        });
      }
    });

    return problems;
  }

  /**
   * Corrige la evaluación de una lección.
   * Devuelve { score, total, results:[{id, correct, why}] }.
   * Nunca devuelve "aprobado" sin haber comparado todas las preguntas.
   */
  function scoreQuiz(questions, answers) {
    var results = (questions || []).map(function (q) {
      var given = answers ? answers[q.id] : undefined;
      var correct = given === q.answer;
      var why;
      if (correct) {
        why = (q.why && q.why.correct) || "Respuesta correcta.";
      } else if (given && q.why && q.why.wrong && q.why.wrong[given]) {
        why = q.why.wrong[given];
      } else if (given) {
        why =
          "Revisa el contenido de esta lección: esa opción no es la correcta. " +
          "Compara cada alternativa con lo que hace el código.";
      } else {
        why = "Sin respuesta: elige una opción para poder corregirla.";
      }
      return { id: q.id, correct: correct, given: given || null, why: why };
    });

    var total = results.length;
    var hits = results.filter(function (r) { return r.correct; }).length;
    return { score: total ? hits / total : 0, hits: hits, total: total, results: results };
  }

  var api = {
    escapeHtml: escapeHtml,
    highlightJava: highlightJava,
    normalizeCode: normalizeCode,
    countMatches: countMatches,
    verifyCode: verifyCode,
    scoreQuiz: scoreQuiz,
    KEYWORDS: KEYWORDS
  };

  if (global) global.JavaLabCheckers = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
