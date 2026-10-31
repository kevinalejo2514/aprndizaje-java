/**
 * Java Lab — Aplicación (enrutado, navegación y progreso global)
 * -------------------------------------------------------------
 * Conecta currículo + motor de progreso + renderizador. No contiene
 * contenido educativo ni reglas de dominio.
 */
(function (global) {
  "use strict";

  var CURRICULUM = global.CURRICULUM;
  var Renderer = global.JavaLabRenderer;
  var el = Renderer.el;

  var $ = function (selector) { return document.querySelector(selector); };

  var store = global.JavaLabProgress.createProgressStore(
    (function () {
      try {
        localStorage.setItem("__javaLabProbe", "1");
        localStorage.removeItem("__javaLabProbe");
        return localStorage;
      } catch (err) {
        // Almacén falso: la app sigue funcionando en sesión, sin persistir.
        var memory = {};
        return {
          getItem: function (k) { return k in memory ? memory[k] : null; },
          setItem: function (k, v) { memory[k] = String(v); },
          removeItem: function (k) { delete memory[k]; }
        };
      }
    })(),
    { legacyIdMap: CURRICULUM.legacyIdMap }
  );

  var modules = CURRICULUM.modules;
  var currentLessonId = null;
  var activeCleanup = null;

  // ---------- avisos de recuperación / límites ----------
  function showNotices() {
    var root = $("#notice-root");
    if (!root) return;
    root.innerHTML = "";

    var notice = store.lastNotice && store.lastNotice();
    if (notice) {
      root.appendChild(
        el("div", { class: "notice notice-" + (notice.type || "info") }, [
          el("span", { html: notice.type === "warning" ? "⚠" : "ℹ" }),
          el("p", { text: notice.message }),
          el("button", {
            class: "notice-close",
            type: "button",
            text: "Entendido",
            onclick: function () {
              store.clearNotice();
              root.innerHTML = "";
            }
          })
        ])
      );
    }
  }

  // ---------- progreso global ----------
  function refreshGlobalProgress() {
    var overall = store.overallProgress(modules);
    var fill = $("#progress-fill");
    var percent = $("#progress-percent");
    var detail = $("#progress-detail");

    if (fill) fill.style.width = overall.percent + "%";
    if (percent) percent.textContent = overall.percent + "%";
    if (detail) {
      detail.textContent =
        overall.total === 0
          ? "Ruta en construcción"
          : overall.done + " de " + overall.total + " lecciones dominadas";
    }
    renderSidebar();
    if (!currentLessonId) renderOverview();
  }

  // ---------- barra lateral ----------
  function lessonState(module, lesson, moduleIndex) {
    if (store.isCompleted(lesson.id)) return "done";
    if (currentLessonId === lesson.id) return "active";
    if (!store.isModuleUnlocked(moduleIndex, modules, CURRICULUM.unlockPercent)) return "locked";
    if (store.lessonHasActivity(lesson.id)) return "progress";
    return "todo";
  }

  function renderSidebar() {
    var nav = $("#module-nav");
    if (!nav) return;
    nav.innerHTML = "";

    modules.forEach(function (module, moduleIndex) {
      var stats = store.moduleStats(module);
      var unlocked = store.isModuleUnlocked(moduleIndex, modules, CURRICULUM.unlockPercent);
      var activeModule = currentLessonId
        ? module.lessons.some(function (l) { return l.id === currentLessonId; })
        : moduleIndex === 0;

      var moduleWrap = el("div", { class: "nav-module" + (activeModule ? " open" : "") });

      var head = el("button", {
        class: "nav-item nav-module-head",
        type: "button",
        "aria-expanded": activeModule ? "true" : "false"
      }, [
        el("span", { class: "nav-number", text: String(module.number).padStart(2, "0") }),
        el("span", {}, [
          el("strong", { text: module.title }),
          el("small", {
            text:
              stats.total === 0
                ? "Contenido en preparación"
                : stats.done + "/" + stats.total + " lecciones · " + stats.percent + "%"
          })
        ]),
        el("span", {
          class:
            "nav-state " +
            (stats.status === "completed"
              ? "is-done"
              : stats.status === "preparing"
              ? "is-preparing"
              : unlocked
              ? "is-open"
              : "is-locked"),
          text:
            stats.status === "completed"
              ? "✓"
              : stats.status === "preparing"
              ? "···"
              : unlocked
              ? stats.percent + "%"
              : "🔒"
        })
      ]);

      head.addEventListener("click", function () {
        var open = moduleWrap.classList.toggle("open");
        head.setAttribute("aria-expanded", String(open));
      });

      moduleWrap.appendChild(head);

      var list = el("div", { class: "nav-lessons" });

      if (stats.total === 0) {
        list.appendChild(
          el("p", { class: "nav-empty", text: "Este módulo se publicará con lecciones completas. No hay nada que simular todavía." })
        );
      } else {
        module.lessons.forEach(function (lesson) {
          var state = lessonState(module, lesson, moduleIndex);
          var btn = el("button", {
            class: "nav-item nav-lesson " + (state === "active" ? "active" : "") + (state === "locked" ? " locked" : ""),
            type: "button",
            "data-lesson": lesson.id,
            title: state === "locked"
              ? "Completa al menos el " + Math.round(CURRICULUM.unlockPercent * 100) + "% del módulo anterior para abrirlo."
              : lesson.title
          }, [
            el("span", { class: "lesson-mark", text: state === "done" ? "✓" : state === "progress" ? "◐" : state === "locked" ? "🔒" : "○" }),
            el("span", {}, [
              el("strong", { text: lesson.title }),
              el("small", {
                text:
                  state === "done"
                    ? "Dominada"
                    : state === "progress"
                    ? "En curso"
                    : state === "locked"
                    ? "Bloqueada"
                    : lesson.duration || ""
              })
            ])
          ]);

          if (state !== "locked") {
            btn.addEventListener("click", function () { go(lesson.id); });
          } else {
            btn.addEventListener("click", function () {
              showRouteNotice(
                "Módulo bloqueado: completa al menos el " +
                  Math.round(CURRICULUM.unlockPercent * 100) +
                  "% del módulo anterior (" +
                  modules[moduleIndex - 1].title +
                  ") para abrir este."
              );
            });
          }
          list.appendChild(btn);
        });
      }

      moduleWrap.appendChild(list);
      nav.appendChild(moduleWrap);
    });
  }

  function showRouteNotice(message) {
    var root = $("#notice-root");
    if (!root) return;
    root.innerHTML = "";
    root.appendChild(
      el("div", { class: "notice notice-info" }, [
        el("span", { html: "ℹ" }),
        el("p", { text: message }),
        el("button", { class: "notice-close", type: "button", text: "Cerrar", onclick: function () { root.innerHTML = ""; } })
      ])
    );
  }

  // ---------- vista: ruta completa ----------
  function renderOverview() {
    var mount = $("#roadmap");
    if (!mount) return;
    mount.innerHTML = "";

    modules.forEach(function (module, moduleIndex) {
      var stats = store.moduleStats(module);
      var unlocked = store.isModuleUnlocked(moduleIndex, modules, CURRICULUM.unlockPercent);

      var chipClass =
        stats.status === "completed"
          ? "chip-done"
          : stats.status === "preparing"
          ? "chip-preparing"
          : !unlocked
          ? "chip-locked"
          : stats.status === "active"
          ? "chip-active"
          : "chip-available";

      var chipText =
        stats.status === "completed"
          ? "Completado"
          : stats.status === "preparing"
          ? "En preparación"
          : !unlocked
          ? "Bloqueado"
          : stats.status === "active"
          ? "En curso"
          : "Disponible";

      var card = el("article", { class: "module-card " + chipClass }, [
        el("figure", { class: "module-figure" }, [
          el("img", {
            class: "module-figure-img",
            src: "assets/img/mod-" + String(module.number).padStart(2, "0") + ".svg",
            alt: "",
            "aria-hidden": "true",
            loading: "lazy"
          })
        ]),
        el("div", { class: "module-card-head" }, [
          el("span", { class: "module-number", text: String(module.number).padStart(2, "0") }),
          el("div", {}, [
            el("h3", { text: module.title }),
            el("p", { class: "module-subtitle", text: module.subtitle })
          ]),
          el("span", { class: "module-chip " + chipClass, text: chipText })
        ]),
        el("p", { class: "module-description", text: module.description }),
        el("div", { class: "module-progress" }, [
          el("div", { class: "progress-track" }, [
            el("div", { class: "progress-fill", style: "width:" + stats.percent + "%" })
          ]),
          el("small", {
            text:
              stats.total === 0
                ? "0 lecciones publicadas"
                : stats.done + " de " + stats.total + " lecciones dominadas (" + stats.percent + "%)"
          })
        ])
      ]);

      if (stats.total === 0) {
        card.appendChild(
          el("p", { class: "module-empty", text: "Contenido en preparación: este módulo se abrirá con lecciones completas, sin tarjetas de relleno." })
        );
      } else if (!unlocked) {
        card.appendChild(
          el("p", {
            class: "module-empty",
            text:
              "Completa al menos el " +
              Math.round(CURRICULUM.unlockPercent * 100) +
              "% de «" +
              modules[moduleIndex - 1].title +
              "» para desbloquear este módulo."
          })
        );
      } else {
        var lessonList = el("div", { class: "module-lessons" });
        module.lessons.forEach(function (lesson) {
          var done = store.isCompleted(lesson.id);
          lessonList.appendChild(
            el("button", {
              class: "module-lesson " + (done ? "done" : ""),
              type: "button",
              onclick: function () { go(lesson.id); }
            }, [
              el("span", { text: done ? "✓" : "○" }),
              el("span", { text: lesson.title }),
              el("small", { text: lesson.duration || "" })
            ])
          );
        });
        card.appendChild(lessonList);
      }

      mount.appendChild(card);
    });
  }

  // ---------- vista: lección ----------
  function renderLessonView(lesson, module) {
    var view = $("#lesson-view");
    var overview = $("#overview-view");
    if (activeCleanup && typeof activeCleanup === "function") activeCleanup();
    activeCleanup = null;

    if (overview) overview.hidden = true;
    view.hidden = false;
    view.innerHTML = "";

    var breadcrumb = $("#breadcrumb");
    if (breadcrumb) {
      breadcrumb.innerHTML =
        "Ruta <span>/</span> Módulo " + String(module.number).padStart(2, "0") +
        " <span>/</span> " + lesson.title;
    }

    var mount = Renderer.render(lesson, module, store, {
      goTo: go,
      home: function () { go(null); },
      prev: function (id) { return neighbour(id, -1); },
      next: function (id) { return neighbour(id, 1); },
      reload: function () { renderLessonView(lesson, module); }
    });

    activeCleanup = mount._cleanup || null;
    view.appendChild(mount);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function neighbour(lessonId, direction) {
    var flat = [];
    modules.forEach(function (m, i) {
      m.lessons.forEach(function (l) { flat.push({ lesson: l, module: m, moduleIndex: i }); });
    });
    var index = flat.findIndex(function (x) { return x.lesson.id === lessonId; });
    var target = flat[index + direction];
    if (!target) return null;
    if (direction > 0 && !store.isModuleUnlocked(target.moduleIndex, modules, CURRICULUM.unlockPercent)) return null;
    return target.lesson;
  }

  function renderOverviewView() {
    var view = $("#lesson-view");
    var overview = $("#overview-view");
    if (activeCleanup && typeof activeCleanup === "function") activeCleanup();
    activeCleanup = null;
    currentLessonId = null;

    if (view) { view.hidden = true; view.innerHTML = ""; }
    if (overview) overview.hidden = false;

    var breadcrumb = $("#breadcrumb");
    if (breadcrumb) breadcrumb.innerHTML = 'Ruta <span>/</span> Java desde cero';

    renderOverview();
    refreshGlobalProgress();
  }

  // ---------- enrutado por hash ----------
  function go(lessonId) {
    location.hash = lessonId ? "#/leccion/" + lessonId : "#/ruta";
  }

  function route() {
    var hash = location.hash || "";
    var match = hash.match(/^#\/leccion\/([\w-]+)$/);

    if (match) {
      var found = store.findLesson(modules, match[1]);
      if (!found) {
        showRouteNotice("Esa lección no existe (puede que el progreso guarde una referencia antigua). Te llevamos a la ruta.");
        go(null);
        return;
      }
      var moduleIndex = found.moduleIndex;
      if (moduleIndex > 0 && !store.isModuleUnlocked(moduleIndex, modules, CURRICULUM.unlockPercent)) {
        showRouteNotice(
          "Este módulo está bloqueado: completa al menos el " +
            Math.round(CURRICULUM.unlockPercent * 100) +
            "% del módulo anterior para abrirlo."
        );
        go(null);
        return;
      }
      currentLessonId = found.lesson.id;
      renderLessonView(found.lesson, found.module);
      renderSidebar();
      store.setUi({ lastLesson: found.lesson.id });
      return;
    }

    renderOverviewView();
    renderSidebar();
  }

  // ---------- arranque ----------
  function init() {
    if (!CURRICULUM || !modules) {
      document.body.innerHTML =
        '<p style="padding:40px;font-family:sans-serif">No se pudo cargar el currículo. Revisa que existan los archivos de content/.</p>';
      return;
    }

    showNotices();
    renderSidebar();
    route();

    window.addEventListener("hashchange", route);
    document.addEventListener("javaLab:progress", function () {
      refreshGlobalProgress();
      showNotices();
    });

    var brand = document.querySelector(".brand");
    if (brand) brand.addEventListener("click", function (e) { e.preventDefault(); go(null); });

    var resetBtn = document.getElementById("reset-progress");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        if (!window.confirm("Se eliminará TODO tu progreso guardado en este navegador. ¿Continuar?")) return;
        store.resetAll();
        go(null);
        route();
        refreshGlobalProgress();
        showNotices();
      });
    }

    refreshGlobalProgress();
    document.dispatchEvent(new CustomEvent("javaLab:ready"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  global.JavaLabApp = { store: store, init: init, go: go };
})(typeof window !== "undefined" ? window : globalThis);
