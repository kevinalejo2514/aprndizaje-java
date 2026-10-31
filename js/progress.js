/**
 * Java Lab — Motor de progreso (persistencia, requisitos y desbloqueo)
 * --------------------------------------------------------------------
 * No depende del DOM: recibe el "storage" como parámetro, de modo que las
 * pruebas puedan ejecutarlo en Node con un almacén falso.
 *
 * Límites documentados (localStorage):
 *  - ~5 MB por origen, síncrono, visible/editable por el usuario.
 *  - Se guarda solo en este navegador y dispositivo; no hay backend.
 *  - Puede fallar (modo privado, cuota agotada): toda operación devuelve
 *    { ok:false } y la interfaz debe informarlo sin perder el estado en memoria.
 */
(function (global) {
  "use strict";

  var KEY = "javaLab.progress.v2";
  var LEGACY_KEY = "javaLabCompleted";
  var CORRUPT_KEY = "javaLab.progress.corrupt";
  var SCHEMA_VERSION = 2;

  function nowIso() {
    return new Date().toISOString();
  }

  function emptyState() {
    return {
      version: SCHEMA_VERSION,
      startedAt: nowIso(),
      updatedAt: null,
      lessons: {},
      ui: {}
    };
  }

  function createProgressStore(storage, options) {
    options = options || {};
    var legacyMap = options.legacyIdMap || {};
    var lastNotice = null;
    var state = emptyState();

    // ---------- persistencia interna ----------
    function write() {
      state.updatedAt = nowIso();
      try {
        storage.setItem(KEY, JSON.stringify(state));
        return { ok: true };
      } catch (err) {
        return {
          ok: false,
          reason: "write_failed",
          message:
            "El navegador no permitió guardar el progreso (modo privado, cuota llena o almacenamiento bloqueado). " +
            "Tu avance sigue visible durante esta sesión, pero no quedará guardado al cerrar."
        };
      }
    }

    function readRaw() {
      try {
        return storage.getItem(KEY);
      } catch (err) {
        return null;
      }
    }

    function migrateLegacy() {
      var legacy;
      try {
        legacy = JSON.parse(storage.getItem(LEGACY_KEY) || "[]");
      } catch (err) {
        legacy = [];
      }
      if (!Array.isArray(legacy) || legacy.length === 0) return;

      legacy.forEach(function (oldId) {
        var mapped = legacyMap[oldId];
        if (!mapped || state.lessons[mapped]) return;
        state.lessons[mapped] = {
          completed: true,
          completedAt: nowIso(),
          quiz: { attempts: 0, bestScore: 0, passed: true, lastScore: 0 },
          practice: { passed: true },
          exercises: {},
          source: "migration"
        };
      });
      write();
      lastNotice = {
        type: "info",
        message:
          "Se importó tu progreso de la versión anterior de la guía (" +
          legacy.length + " lección)."
      };
      try { storage.removeItem(LEGACY_KEY); } catch (err) { /* no bloquea */ }
    }

    function load() {
      var raw = readRaw();
      if (raw === null || raw === undefined || raw === "") {
        migrateLegacy();
        return { ok: true, recovered: false };
      }

      var parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (err) {
        parsed = null;
      }

      if (!parsed || parsed.version !== SCHEMA_VERSION || typeof parsed.lessons !== "object") {
        // Recuperación: nunca reescribimos datos corruptos encima sin avisar.
        try {
          storage.setItem(CORRUPT_KEY, String(raw).slice(0, 50000));
        } catch (err2) { /* si no hay espacio, seguimos con estado vacío */ }

        state = emptyState();
        migrateLegacy();

        lastNotice = parsed
          ? {
              type: "warning",
              message:
                "El progreso guardado estaba en un formato no compatible. Se guardó una copia de seguridad y " +
                "empezamos de cero. Puedes reiniciar el progreso desde Ajustes si prefieres eliminarlo."
            }
          : {
              type: "warning",
              message:
                "No se pudo leer el progreso guardado (datos dañados). Se conservó una copia de seguridad y " +
                "la ruta vuelve a comenzar. Revisa el almacenamiento del navegador si vuelve a ocurrir."
            };
        var saved = write();
        return { ok: saved.ok, recovered: true, notice: lastNotice };
      }

      state = parsed;
      migrateLegacy();
      return { ok: true, recovered: false };
    }

    // ---------- consultas ----------
    function record(id) {
      return state.lessons[id] || null;
    }

    function ensure(id) {
      if (!state.lessons[id]) {
        state.lessons[id] = {
          completed: false,
          completedAt: null,
          quiz: { attempts: 0, bestScore: 0, passed: false, lastScore: 0 },
          practice: { passed: false },
          exercises: {}
        };
      }
      return state.lessons[id];
    }

    function isCompleted(id) {
      var r = record(id);
      return !!(r && r.completed);
    }

    function lessonHasActivity(id) {
      var r = record(id);
      if (!r) return false;
      return (
        r.completed ||
        r.quiz.attempts > 0 ||
        r.practice.passed ||
        Object.keys(r.exercises || {}).some(function (k) { return r.exercises[k]; })
      );
    }

    /**
     * Reglas explícitas de dominio: una lección solo se marca completada si
     * cumple TODOS sus requisitos. Nunca se completa por haberla abierto.
     */
    function requirementsStatus(lesson, rec) {
      rec = rec || record(lesson.id) || ensure(lesson.id);
      var req = lesson.requirements || {};
      var neededScore = typeof req.quizScore === "number" ? req.quizScore : 0.75;
      var exercisesMin = typeof req.exercisesMin === "number" ? req.exercisesMin : 0;

      var verifiedExercises = Object.keys(rec.exercises || {}).filter(function (k) {
        return rec.exercises[k];
      }).length;

      var items = [
        {
          id: "quiz",
          label: "Evaluación de comprensión con al menos " + Math.round(neededScore * 100) + "%",
          met: rec.quiz.passed && rec.quiz.bestScore >= neededScore
        },
        {
          id: "practice",
          label: "Práctica guiada resuelta",
          met: !!rec.practice.passed
        },
        {
          id: "exercises",
          label:
            exercisesMin === 0
              ? "Ejercicios verificados"
              : exercisesMin + " ejercicio" + (exercisesMin > 1 ? "s" : "") + " independiente" + (exercisesMin > 1 ? "s" : "") + " verificado" + (exercisesMin > 1 ? "s" : ""),
          met: verifiedExercises >= exercisesMin
        }
      ];

      return {
        items: items,
        met: items.every(function (i) { return i.met; }),
        verifiedExercises: verifiedExercises,
        exercisesMin: exercisesMin
      };
    }

    function canComplete(lesson) {
      return requirementsStatus(lesson).met && !isCompleted(lesson.id);
    }

    function completeLesson(id) {
      var r = ensure(id);
      if (r.completed) return { ok: true, already: true };
      r.completed = true;
      r.completedAt = nowIso();
      var saved = write();
      if (!saved.ok) {
        r.completed = false;
        r.completedAt = null;
        return saved;
      }
      return { ok: true };
    }

    function resetLesson(id) {
      delete state.lessons[id];
      var saved = write();
      return saved.ok ? { ok: true } : saved;
    }

    function recordQuiz(id, score, passed) {
      var r = ensure(id);
      r.quiz.attempts += 1;
      r.quiz.lastScore = score;
      r.quiz.bestScore = Math.max(r.quiz.bestScore, score);
      r.quiz.passed = r.quiz.passed || passed;
      return write();
    }

    function recordPractice(id, passed) {
      var r = ensure(id);
      if (passed) r.practice.passed = true;
      return write();
    }

    function recordExercise(id, exerciseId, verified) {
      var r = ensure(id);
      r.exercises = r.exercises || {};
      if (verified) r.exercises[exerciseId] = true;
      else delete r.exercises[exerciseId];
      return write();
    }

    function setUi(patch) {
      state.ui = Object.assign({}, state.ui, patch);
      return write();
    }

    // ---------- módulos y desbloqueo ----------
    function moduleLessons(module) {
      return module.lessons || [];
    }

    function moduleStats(module) {
      var total = moduleLessons(module).length;
      var done = moduleLessons(module).filter(function (l) { return isCompleted(l.id); }).length;
      var inProgress = moduleLessons(module).filter(function (l) {
        return !isCompleted(l.id) && lessonHasActivity(l.id);
      }).length;

      if (total === 0) {
        return { total: 0, done: 0, inProgress: 0, percent: 0, status: "preparing" };
      }
      return {
        total: total,
        done: done,
        inProgress: inProgress,
        percent: Math.round((done / total) * 100),
        status: done === total ? "completed" : done > 0 || inProgress > 0 ? "active" : "available"
      };
    }

    function isModuleUnlocked(index, modules, unlockPercent) {
      if (index <= 0) return true;
      var threshold = typeof unlockPercent === "number" ? unlockPercent : 0.8;
      var prev = modules[index - 1];
      if (!prev || !moduleLessons(prev).length) return false;
      var stats = moduleStats(prev);
      return stats.percent >= threshold * 100;
    }

    function overallProgress(modules) {
      var total = 0;
      var done = 0;
      modules.forEach(function (m) {
        var s = moduleStats(m);
        total += s.total;
        done += s.done;
      });
      return {
        total: total,
        done: done,
        percent: total ? Math.round((done / total) * 100) : 0
      };
    }

    function findLesson(modules, lessonId) {
      for (var i = 0; i < modules.length; i++) {
        var lesson = modules[i].lessons.find(function (l) { return l.id === lessonId; });
        if (lesson) return { module: modules[i], lesson: lesson, moduleIndex: i };
      }
      return null;
    }

    function resetAll() {
      state = emptyState();
      try { storage.removeItem(LEGACY_KEY); } catch (err) { /* ok */ }
      return write();
    }

    function getNotice() { return lastNotice; }
    function clearNotice() { lastNotice = null; }
    function getState() { return state; }

    var loaded = load();

    return {
      loadResult: loaded,
      lastNotice: getNotice,
      clearNotice: clearNotice,
      getState: getState,
      record: record,
      isCompleted: isCompleted,
      lessonHasActivity: lessonHasActivity,
      requirementsStatus: requirementsStatus,
      canComplete: canComplete,
      completeLesson: completeLesson,
      resetLesson: resetLesson,
      recordQuiz: recordQuiz,
      recordPractice: recordPractice,
      recordExercise: recordExercise,
      setUi: setUi,
      moduleStats: moduleStats,
      isModuleUnlocked: isModuleUnlocked,
      overallProgress: overallProgress,
      findLesson: findLesson,
      resetAll: resetAll
    };
  }

  var api = { createProgressStore: createProgressStore, KEY: KEY, SCHEMA_VERSION: SCHEMA_VERSION };

  if (global) {
    global.JavaLabProgress = api;
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
