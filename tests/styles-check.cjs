/* Verificación cruzada (no es una prueba pedagógica): comprueba que las
 * clases de CSS que usan la interfaz están definidas en styles.css.
 * Ejecutar: node tests/styles-check.cjs */
"use strict";
const fs = require("fs");
const path = require("path");
const base = path.join(__dirname, "..");

const css = fs.readFileSync(path.join(base, "css", "styles.css"), "utf8");
const defined = new Set([...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]));

const src = ["js/renderer.js", "js/app.js", "index.html"]
  .map((f) => fs.readFileSync(path.join(base, f), "utf8"))
  .join("\n");

const used = new Set();
for (const m of src.matchAll(/class:\s*"([^"]+)"/g)) {
  m[1].split(/\s+/).forEach((c) => c && used.add(c));
}
for (const m of src.matchAll(/class="([^"]+)"/g)) {
  m[1].split(/\s+/).forEach((c) => c && used.add(c));
}

const missing = [...used].filter(
  (c) => !defined.has(c) && !c.endsWith("-") && !c.includes('"') && !c.includes("+")
);
if (missing.length) {
  console.error("Clases usadas SIN definir en styles.css: " + missing.join(", "));
  process.exitCode = 1;
} else {
  console.log("Clases usadas: " + used.size + " | definidas en CSS: " + defined.size + " -> todas existen.");
}
