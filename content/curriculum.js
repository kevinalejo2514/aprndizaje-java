/**
 * Java Lab — Currículo (modelo de datos educativo)
 * -------------------------------------------------
 * Este archivo NO contiene lógica de interfaz: solo describe la ruta de
 * aprendizaje. Las lecciones publicadas se registran desde content/module-XX.js.
 *
 * Reglas de publicación:
 *  - Un módulo solo puede recibir lecciones completas (estándar de 15 bloques).
 *  - Un módulo sin lecciones publicadas queda en estado "preparación" y nunca
 *    simula contenido que no existe.
 *  - El desbloqueo se calcula con porcentaje real de lecciones completadas.
 */
(function (global) {
  "use strict";

  var UNLOCK_PERCENT = 0.8; // 80% del módulo anterior para abrir el siguiente

  var MODULE_SHELLS = [
    {
      id: "m1",
      number: 1,
      title: "Fundamentos y entorno Java",
      subtitle: "Qué es Java, cómo se ejecuta y cómo escribe tu primer programa.",
      description:
        "Salidas, clases, método main, consola, compilación y errores de compilación. " +
        "Al terminar este módulo sabrás crear, compilar y ejecutar un programa Java y leer los errores que el compilador te devuelve.",
      lessons: []
    },
    {
      id: "m2",
      number: 2,
      title: "Variables, tipos de datos y operadores",
      subtitle: "Guardar, transformar y combinar información.",
      description:
        "Tipos primitivos, String, conversiones, operadores aritméticos, relacionales y lógicos, " +
        "y la división entera que tanto confunde al principio.",
      lessons: []
    },
    {
      id: "m3",
      number: 3,
      title: "Condicionales y lógica",
      subtitle: "Que el programa tome decisiones.",
      description:
        "Expresiones booleanas, if/else, else if, switch y lógica combinada, con trazas paso a paso " +
        "para que sepas exactamente qué rama se ejecuta y por qué.",
      lessons: []
    },
    {
      id: "m4",
      number: 4,
      title: "Ciclos y control de flujo",
      subtitle: "Repetir sin copiar y sacar partido a cada vuelta.",
      description:
        "for, while, do-while, break/continue, acumuladores, contadores y ciclos anidados, " +
        "con seguimiento del estado en cada iteración.",
      lessons: []
    },
    {
      id: "m5",
      number: 5,
      title: "Métodos y modularidad",
      subtitle: "Dividir el problema en piezas que se pueden probar por separado.",
      description:
        "Métodos, parámetros frente a argumentos, retorno, sobrecarga, static frente a instancia " +
        "y diseño de métodos pequeños y verificables.",
      lessons: []
    },
    {
      id: "m6",
      number: 6,
      title: "Arrays, cadenas y colecciones",
      subtitle: "Cuando un dato ya no basta: colecciones de valores.",
      description:
        "Arrays de tamaño fijo, recorridos y agregados, métodos de String, y las colecciones dinámicas " +
        "ArrayList y HashMap con sus errores más habituales.",
      lessons: []
    },
    {
      id: "m7",
      number: 7,
      title: "Programación orientada a objetos",
      subtitle: "Modelar el problema antes que escribir el código.",
      description:
        "Clases, objetos, encapsulamiento, constructores, referencias y memoria, herencia, polimorfismo, " +
        "abstracción, interfaces y composición, cerrando con un mini proyecto POO.",
      lessons: []
    },
    {
      id: "m8",
      number: 8,
      title: "Java profesional y preparación para backend",
      subtitle: "Del programa de consola al servicio real.",
      description:
        "Excepciones, genéricos y Collections, streams, archivos, JDBC, primera API con Spring Boot " +
        "y proyecto final integrador con contexto Corporal Fit.",
      lessons: []
    }
  ];

  var registered = Array.isArray(global.MODULES) ? global.MODULES : [];

  // Las lecciones publicadas se fusionan con su módulo (se registra primero
  // content/module-XX.js y después este archivo).
  var modules = MODULE_SHELLS.map(function (shell) {
    var published = registered.find(function (m) { return m.id === shell.id; });
    var lessons = published && Array.isArray(published.lessons) ? published.lessons : [];
    return Object.assign({}, shell, { lessons: lessons });
  });

  var unknown = registered.filter(function (m) {
    return !MODULE_SHELLS.some(function (shell) { return shell.id === m.id; });
  });
  if (unknown.length && console && console.warn) {
    console.warn("Currículo: módulos registrados sin ficha oficial:", unknown.map(function (m) { return m.id; }));
  }

  var CURRICULUM = {
    version: 2,
    unlockPercent: UNLOCK_PERCENT,
    modules: modules,
    // Migración del progreso de la primera versión de la guía (1 sola lección).
    legacyIdMap: { "java-01": "m1l1" },
    limits: {
      storage: "localStorage del navegador (por origen y dispositivo)",
      note:
        "El progreso se guarda en este navegador. Borrar los datos del sitio, usar otro navegador " +
        "o otro dispositivo lo elimina. No hay servidor: no se sincroniza."
    }
  };

  global.CURRICULUM = CURRICULUM;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = CURRICULUM;
  }
})(typeof window !== "undefined" ? window : globalThis);
