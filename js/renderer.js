/**
 * Java Lab — Renderizador de lecciones
 * ------------------------------------
 * Traduce los bloques educativos (content/) a interfaz. No contiene
 * contenido curricular ni reglas de persistencia: solo dibuja y conecta
 * los componentes con el motor de progreso (progress.js) y las reglas de
 * verificación (checkers.js).
 */
(function (global) {
  "use strict";

  var CHECK = global.JavaLabCheckers;

  // ---------- helpers de DOM ----------
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        if (key === "class") node.className = attrs[key];
        else if (key === "html") node.innerHTML = attrs[key];
        else if (key === "text") node.textContent = attrs[key];
        else if (key.slice(0, 2) === "on") node.addEventListener(key.slice(2), attrs[key]);
        else node.setAttribute(key, attrs[key]);
      });
    }
    (children || []).forEach(function (child) {
      if (child == null) return;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return node;
  }

  function feedbackNode(id) {
    return el("div", { class: "feedback", id: id, role: "status", "aria-live": "polite" });
  }

  function setFeedback(node, message, type) {
    node.textContent = message;
    node.className = "feedback" + (type ? " " + type : "");
  }

  function codeWindow(file, code) {
    var safeCode = CHECK.escapeHtml(code);
    return el("div", { class: "code-window" }, [
      el("div", { class: "code-toolbar" }, [
        el("div", { class: "window-dots" }, [el("i"), el("i"), el("i")]),
        el("span", { text: file || "Ejemplo.java" }),
        el("span", { class: "code-language", text: "JAVA" })
      ]),
      el("pre", { class: "code-block" }, [
        el("code", { html: CHECK.highlightJava(code) || "&nbsp;" })
      ])
    ]);
  }

  // ---------- bloques estáticos ----------
  function renderBlock(block, lesson) {
    switch (block.type) {
      case "lead":
        return el("p", { class: "lead", html: block.html });

      case "heading":
        return el("h3", { text: block.text });

      case "para":
        return el("p", { html: block.html });

      case "concept":
        return el("div", { class: "concept-card" }, [
          el("span", { class: "concept-icon", text: block.icon || "✳" }),
          el("div", {}, [
            el("strong", { text: block.title || "Concepto clave" }),
            el("p", { html: block.html })
          ])
        ]);

      case "analogy":
        return el("div", { class: "concept-card analogy-card" }, [
          el("span", { class: "concept-icon", text: "🧭" }),
          el("div", {}, [
            el("strong", { text: block.title || "Analogía de la vida cotidiana" }),
            el("p", { html: block.html })
          ])
        ]);

      case "tip":
        return el("div", { class: "tip-card" }, [
          el("span", { text: block.icon || "💡" }),
          el("p", { html: block.html })
        ]);

      case "list": {
        var items = (block.items || []).map(function (item) {
          return el("li", { html: item });
        });
        return el(block.ordered ? "ol" : "ul", { class: "list-block" }, items);
      }

      case "table": {
        var head = el("tr", {}, (block.headers || []).map(function (h) {
          return el("th", { html: h });
        }));
        var body = (block.rows || []).map(function (row) {
          return el("tr", {}, row.map(function (cell) { return el("td", { html: cell }); }));
        });
        return el("div", { class: "table-wrap" }, [
          el("table", { class: "data-table" }, [
            el("thead", {}, [head]),
            el("tbody", {}, body)
          ])
        ]);
      }

      case "code":
        return codeWindow(block.file, block.code);

      case "lines": {
        var wrap = el("div", { class: "explanation-list" });
        (block.items || []).forEach(function (item, index) {
          wrap.appendChild(
            el("div", {}, [
              el("span", { text: String(index + 1).padStart(2, "0") }),
              el("p", {
                html:
                  '<code>' + CHECK.escapeHtml(item.line) + "</code><br>" + item.why
              })
            ])
          );
        });
        return wrap;
      }

      case "output": {
        var out = el("div", { class: "output-card" }, [
          el("div", { class: "output-label" }, [el("span"), document.createTextNode("SALIDA ESPERADA")]),
          el("code", { text: (block.lines || []).join("\n") })
        ]);
        if (block.why) {
          return el("div", {}, [out, el("p", { class: "why-output", html: block.why })]);
        }
        return out;
      }

      case "errors": {
        var list = el("div", { class: "errors-block" });
        (block.items || []).forEach(function (item, index) {
          list.appendChild(
            el("div", { class: "error-item" }, [
              el("div", { class: "error-head" }, [
                el("span", { text: "Error " + (index + 1) }),
                el("code", { text: item.error })
              ]),
              el("p", { class: "error-cause", html: "<strong>Por qué ocurre:</strong> " + item.cause }),
              el("p", { class: "error-fix", html: "<strong>Cómo corregirlo:</strong> " + item.fix })
            ])
          );
        });
        return list;
      }

      case "application":
        var parts = [];
        if (block.title) parts.push(el("h3", { text: block.title }));
        if (block.html) parts.push(el("p", { html: block.html }));
        parts.push(codeWindow(block.file, block.code));
        if (block.output) {
          parts.push(
            el("div", { class: "output-card" }, [
              el("div", { class: "output-label" }, [el("span"), document.createTextNode("SALIDA DEL PROGRAMA")]),
              el("code", { text: block.output })
            ])
          );
        }
        if (block.why) parts.push(el("p", { class: "why-output", html: block.why }));
        return el("div", { class: "application-block" }, parts);

      default:
        return el("div", { class: "unknown-block" }, [
          el("p", { text: "Bloque no reconocido: " + block.type })
        ]);
    }
  }

  // ---------- traza de ejecución (paso a paso) ----------
  function renderTrace(block) {
    var steps = block.steps || [];
    var index = 0;

    var codeList = el("ol", { class: "trace-code" });
    (block.code || "").split("\n").forEach(function (line, i) {
      codeList.appendChild(
        el("li", { "data-line": String(i + 1), html: CHECK.highlightJava(line) || "&nbsp;" })
      );
    });

    var stateBody = el("tbody", {});
    var outputBox = el("pre", { class: "trace-output", text: "" });
    var noteBox = el("p", { class: "trace-note", html: "" });
    var stepLabel = el("strong", { text: "" });

    function paint() {
      var step = steps[index] || {};
      Array.prototype.forEach.call(codeList.children, function (li) {
        li.classList.toggle("active", li.getAttribute("data-line") === String(step.line || ""));
      });

      stateBody.innerHTML = "";
      var vars = step.vars || [];
      if (vars.length === 0) {
        stateBody.appendChild(
          el("tr", {}, [el("td", { colspan: "2", class: "trace-empty", text: "Todavía no existe ninguna variable." })])
        );
      } else {
        vars.forEach(function (pair) {
          stateBody.appendChild(
            el("tr", {}, [
              el("td", {}, [el("code", { text: pair[0] })]),
              el("td", { text: pair[1] })
            ])
          );
        });
      }

      outputBox.textContent = (step.out || []).join("\n") || "(sin salida todavía)";
      noteBox.innerHTML = step.note || "";
      stepLabel.textContent = "Paso " + (index + 1) + " de " + steps.length;
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === steps.length - 1;
    }

    var prevBtn = el("button", {
      class: "button-secondary",
      type: "button",
      text: "← Paso anterior",
      onclick: function () { if (index > 0) { index -= 1; paint(); } }
    });
    var nextBtn = el("button", {
      class: "button-primary",
      type: "button",
      text: "Siguiente paso →",
      onclick: function () { if (index < steps.length - 1) { index += 1; paint(); } }
    });
    var resetBtn = el("button", {
      class: "button-ghost",
      type: "button",
      text: "Reiniciar",
      onclick: function () { index = 0; paint(); }
    });

    var box = el("div", { class: "trace-box" }, [
      el("div", { class: "trace-head" }, [
        el("div", {}, [
          el("span", { class: "mini-label", text: "EJECUCIÓN PASO A PASO" }),
          el("h4", { text: block.title || "Seguimiento del estado" })
        ]),
        stepLabel
      ]),
      block.intro ? el("p", { class: "trace-intro", html: block.intro }) : null,
      el("div", { class: "trace-grid" }, [
        el("div", { class: "trace-pane" }, [
          el("span", { class: "mini-label", text: "INSTRUCCIONES" }),
          codeList
        ]),
        el("div", { class: "trace-pane" }, [
          el("span", { class: "mini-label", text: "VARIABLES" }),
          el("table", { class: "trace-table" }, [el("tbody", {}, [stateBody])]),
          el("span", { class: "mini-label", text: "SALIDA ACUMULADA" }),
          outputBox
        ])
      ]),
      noteBox,
      el("div", { class: "trace-actions" }, [prevBtn, nextBtn, resetBtn])
    ]);

    paint();
    return box;
  }

  // ---------- práctica guiada ----------
  function renderPractice(practice, lessonId, store) {
    if (!practice) return null;

    var attempts = 0;
    var passed = store.record(lessonId) && store.record(lessonId).practice.passed;

    var textarea = el("textarea", {
      rows: "8",
      spellcheck: "false",
      text: practice.startCode || ""
    });
    var feedback = feedbackNode("practice-feedback");
    var hintWrap = el("div", { class: "hint-ladder" });
    var hintButton = el("button", { class: "button-secondary", type: "button", text: "Necesito una pista" });
    var checkButton = el("button", { class: "button-primary", type: "button", html: 'Comprobar mi intento <span>→</span>' });
    var solutionDetails = el("details", { class: "solution" });
    solutionDetails.disabled = true;

    var hintIndex = 0;
    hintButton.addEventListener("click", function () {
      var hints = practice.hints || [];
      if (hintIndex >= hints.length) {
        setFeedback(feedback, "Ya usaste todas las pistas. Ahora intenta escribir el código y compruébalo.", "");
        return;
      }
      hintWrap.appendChild(el("div", { class: "hint-panel", html: hints[hintIndex] }));
      hintIndex += 1;
      hintButton.textContent =
        hintIndex < hints.length ? "Necesito otra pista (" + (hints.length - hintIndex) + " restantes)" : "No quedan más pistas";
    });

    function enableSolution() {
      if (solutionDetails.disabled && attempts > 0) {
        solutionDetails.disabled = false;
        solutionDetails.appendChild(
          el("summary", { text: "Ver solución comentada (ya intentaste por tu cuenta)" })
        );
        solutionDetails.appendChild(el("pre", {}, [
          el("code", { html: CHECK.highlightJava(practice.solution ? practice.solution.code : "") })
        ]));
        solutionDetails.appendChild(
          el("p", { html: practice.solution ? practice.solution.explanation : "" })
        );
      }
    }

    checkButton.addEventListener("click", function () {
      attempts += 1;
      var problems = CHECK.verifyCode(textarea.value, {
        must: practice.checks || [],
        mustNot: practice.forbidden || []
      });

      if (problems.length === 0) {
        var save = store.recordPractice(lessonId, true);
        if (!save.ok) {
          setFeedback(feedback, save.message, "error");
          return;
        }
        setFeedback(
          feedback,
          passed
            ? "Correcto: tu código cumple todas las reglas de esta práctica. (Recuerda: es una revisión estructural del texto, no una compilación de Java.)"
            : "¡Correcto! Cumple todas las reglas de la práctica. La práctica queda registrada como superada. (Es una revisión estructural del texto, no una compilación de Java.)",
          "success"
        );
        checkButton.disabled = true;
        textarea.disabled = true;
        if (typeof practice.onPass === "function") practice.onPass();
        document.dispatchEvent(new CustomEvent("javaLab:progress"));
        return;
      }

      var lines = problems.map(function (p, i) {
        return (i + 1) + ". " + p.message + (p.hint ? " — " + p.hint : "");
      });
      setFeedback(
        feedback,
        "Aún no está completo (" + problems.length + " observación" + (problems.length > 1 ? "es" : "") + "):\n" +
          lines.join("\n") +
          "\nCorrige y vuelve a intentarlo: puedes intentarlo las veces que necesites.",
        "error"
      );
      enableSolution();
    });

    if (passed) {
      textarea.disabled = true;
      checkButton.disabled = true;
    }

    return el("section", { class: "practice-box" }, [
      el("div", { class: "checkpoint-title" }, [
        el("span", { text: "✎" }),
        el("div", {}, [
          el("p", { class: "eyebrow", text: "PRÁCTICA GUIADA" }),
          el("h3", { text: practice.title || "Aplica lo aprendido" })
        ])
      ]),
      el("p", { class: "practice-prompt", html: practice.prompt }),
      el("label", { class: "field-label", text: practice.label || "Escribe aquí tu código:" }),
      textarea,
      el("div", { class: "challenge-actions" }, [hintButton, checkButton]),
      hintWrap,
      feedback,
      solutionDetails
    ]);
  }

  // ---------- ejercicios independientes ----------
  function renderExercises(exercises, lessonId, store) {
    if (!exercises || !exercises.length) return null;

    var wrap = el("section", { class: "exercises-box" }, [
      el("div", { class: "checkpoint-title" }, [
        el("span", { text: "⚙" }),
        el("div", {}, [
          el("p", { class: "eyebrow", text: "EJERCICIOS INDEPENDIENTES" }),
          el("h3", { text: "Practica sin mirar la solución" })
        ])
      ]),
      el("p", {
        class: "practice-prompt",
        html:
          "Resuelve primero por tu cuenta. Verifica tu código con los criterios de cada ejercicio: " +
          "marcar un ejercicio como verificado exige haber comprobado TODOS sus criterios."
      })
    ]);

    exercises.forEach(function (ex, index) {
      var rec = store.record(lessonId);
      var verified = !!(rec && rec.exercises && rec.exercises[ex.id]);
      var feedback = feedbackNode("ex-" + ex.id + "-feedback");
      var verifyButton = el("button", {
        class: verified ? "button-secondary" : "button-primary",
        type: "button",
        text: verified ? "Verificado ✓ (desmarcar)" : "He verificado mi solución"
      });

      var checks = (ex.criteria || []).map(function (criterion, i) {
        var box = el("input", { type: "checkbox", id: ex.id + "-c" + i });
        if (verified) box.checked = true;
        box.addEventListener("change", function () {
          var all = criteriaList.querySelectorAll("input[type=checkbox]");
          var allChecked = Array.prototype.every.call(all, function (b) { return b.checked; });
          verifyButton.disabled = false;
          if (!allChecked) {
            setFeedback(feedback, "Aún faltan criterios por comprobar en este ejercicio.", "");
          }
        });
        return el("li", {}, [box, el("label", { for: ex.id + "-c" + i, html: criterion })]);
      });

      var criteriaList = el("ul", { class: "criteria-list" }, checks);

      verifyButton.addEventListener("click", function () {
        var boxes = criteriaList.querySelectorAll("input[type=checkbox]");
        var allChecked = boxes.length > 0 && Array.prototype.every.call(boxes, function (b) { return b.checked; });

        if (verified) {
          store.recordExercise(lessonId, ex.id, false);
          Array.prototype.forEach.call(boxes, function (b) { b.checked = false; });
          verified = false;
          verifyButton.textContent = "He verificado mi solución";
          verifyButton.className = "button-primary";
          setFeedback(feedback, "Ejercicio desmarcado: puedes resolverlo de nuevo.", "");
          document.dispatchEvent(new CustomEvent("javaLab:progress"));
          return;
        }

        if (!allChecked) {
          setFeedback(
            feedback,
            "Antes de marcarlo como verificado, comprueba cada criterio de la lista. " +
              "Si no puedes comprobarlo, tu solución todavía no está completa.",
            "error"
          );
          return;
        }

        var save = store.recordExercise(lessonId, ex.id, true);
        if (!save.ok) {
          setFeedback(feedback, save.message, "error");
          return;
        }
        setFeedback(
          feedback,
          "Ejercicio verificado. Queda registrado como superado en este navegador.",
          "success"
        );
        verifyButton.textContent = "Verificado ✓ (desmarcar)";
        verifyButton.className = "button-secondary";
        document.dispatchEvent(new CustomEvent("javaLab:progress"));
      });

      var hintDetails = el("details", { class: "solution" });
      hintDetails.appendChild(el("summary", { text: "Ver pistas" }));
      (ex.hints || []).forEach(function (hint) {
        hintDetails.appendChild(el("p", { html: "• " + hint }));
      });

      var solutionDetails = el("details", { class: "solution" });
      solutionDetails.appendChild(el("summary", { text: "Ver solución comentada" }));
      solutionDetails.appendChild(el("pre", {}, [
        el("code", { html: CHECK.highlightJava(ex.solution ? ex.solution.code : "") })
      ]));
      solutionDetails.appendChild(
        el("p", { html: ex.solution ? ex.solution.explanation : "" })
      );

      var levelKey = (ex.level || "Básico")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      wrap.appendChild(
        el("article", { class: "exercise-card" }, [
          el("div", { class: "exercise-head" }, [
            el("span", { class: "exercise-number", text: "Ejercicio " + (index + 1) }),
            el("span", { class: "diff-chip diff-" + levelKey, text: ex.level || "Básico" }),
            verified ? el("span", { class: "exercise-state done", text: "Verificado ✓" }) : null
          ]),
          el("p", { class: "exercise-statement", html: ex.statement }),
          el("span", { class: "mini-label", text: "CASOS DE PRUEBA / CRITERIOS DE VERIFICACIÓN" }),
          criteriaList,
          el("div", { class: "challenge-actions" }, [hintDetails, solutionDetails, verifyButton]),
          feedback
        ])
      );
    });

    return wrap;
  }

  // ---------- evaluación ----------
  function renderQuiz(quiz, lessonId, store) {
    if (!quiz || !quiz.questions || !quiz.questions.length) return null;

    var feedback = feedbackNode("quiz-feedback");
    var resultBox = el("div", { class: "quiz-result" });
    var questionsWrap = el("div", { class: "quiz-questions" });
    var attemptsNote = el("p", { class: "quiz-attempts" });
    var answers = {};
    var corrected = false;

    var rec = store.record(lessonId);
    var attempts = rec ? rec.quiz.attempts : 0;

    function paintAttempts() {
      attemptsNote.textContent =
        attempts > 0
          ? "Intentos registrados: " + attempts + ". Puedes repetir la evaluación las veces que quieras."
          : "Todavía no has enviado esta evaluación.";
    }

    // Construible de nuevo: el botón "Reintentar" reconstruye las preguntas
    // sin recargar la página, para poder equivocarse cuantas veces haga falta.
    function buildQuestions() {
      questionsWrap.innerHTML = "";
      quiz.questions.forEach(function (q, index) {
        var optionsWrap = el("div", { class: "quiz-options" });
        q.options.forEach(function (opt) {
          var btn = el("button", {
            class: "quiz-option",
            type: "button",
            "data-q": q.id,
            "data-opt": opt.id,
            html: opt.id.toUpperCase() + ". " + opt.text
          });
          btn.addEventListener("click", function () {
            if (corrected) return;
            answers[q.id] = opt.id;
            Array.prototype.forEach.call(optionsWrap.children, function (b) {
              b.classList.toggle("selected", b === btn);
            });
          });
          optionsWrap.appendChild(btn);
        });

        questionsWrap.appendChild(
          el("div", { class: "quiz-question" }, [
            el("p", { class: "quiz-question-title", html: "<strong>" + (index + 1) + ".</strong> " + q.question }),
            optionsWrap
          ])
        );
      });
    }

    buildQuestions();

    function correct() {
      if (Object.keys(answers).length < quiz.questions.length) {
        setFeedback(
          feedback,
          "Faltan preguntas por responder: contesta todas antes de corregir. " +
            "No hay límite de intentos, pero cada intento se corrige completo.",
          "error"
        );
        return;
      }

      var result = CHECK.scoreQuiz(quiz.questions, answers);
      corrected = true;
      attempts += 1;

      var passScore = typeof quiz.passScore === "number" ? quiz.passScore : 0.75;
      var passed = result.score >= passScore;
      var save = store.recordQuiz(lessonId, result.score, passed);
      paintAttempts();

      if (!save.ok) {
        setFeedback(feedback, save.message, "error");
        return;
      }

      questionsWrap.querySelectorAll(".quiz-option").forEach(function (btn) {
        var qid = btn.getAttribute("data-q");
        var opt = btn.getAttribute("data-opt");
        var question = quiz.questions.find(function (x) { return x.id === qid; });
        btn.classList.remove("correct", "incorrect");
        if (answers[qid] === opt) {
          btn.classList.add(answers[qid] === question.answer ? "correct" : "incorrect");
        }
        if (opt === question.answer) btn.classList.add("is-answer");
      });

      questionsWrap.querySelectorAll(".quiz-question").forEach(function (node, i) {
        var why = result.results[i].why;
        node.appendChild(el("p", {
          class: "quiz-why " + (result.results[i].correct ? "ok" : "bad"),
          html: (result.results[i].correct ? "✓ " : "✕ ") + why
        }));
      });

      resultBox.innerHTML = "";
      resultBox.appendChild(
        el("strong", {
          text:
            "Resultado: " + result.hits + " de " + result.total +
            " (" + Math.round(result.score * 100) + "%) — " +
            (passed ? "requisito superado" : "aún no alcanzas " + Math.round(passScore * 100) + "%")
        })
      );
      setFeedback(
        feedback,
        passed
          ? "Has alcanzado el requisito de comprensión de esta lección. Ahora completa la práctica y los ejercicios para marcarla como dominada."
          : "Todavía no superas el requisito (" + Math.round(passScore * 100) + "%). Lee el por qué de cada respuesta y vuelve a intentarlo: repetir la evaluación está permitido.",
        passed ? "success" : "error"
      );

      var retry = el("button", { class: "button-secondary", type: "button", text: "Reintentar (limpia mis respuestas)" });
      retry.addEventListener("click", function () {
        answers = {};
        corrected = false;
        resultBox.innerHTML = "";
        setFeedback(feedback, "", "");
        buildQuestions();
        retry.remove();
        questionsWrap.scrollIntoView({ block: "nearest" });
      });
      resultBox.appendChild(retry);

      document.dispatchEvent(new CustomEvent("javaLab:progress"));
    }

    var submit = el("button", { class: "button-primary", type: "button", html: 'Corregir mis respuestas <span>→</span>' });
    submit.addEventListener("click", correct);
    paintAttempts();

    return el("section", { class: "checkpoint" }, [
      el("div", { class: "checkpoint-title" }, [
        el("span", { text: "✓" }),
        el("div", {}, [
          el("p", { class: "eyebrow", text: "EVALUACIÓN DE COMPRENSIÓN" }),
          el("h3", { text: quiz.title || "Comprueba lo entendido" })
        ])
      ]),
      el("p", { class: "practice-prompt", html: quiz.intro || "Responde todas las preguntas. Se te explica por qué cada opción es o no correcta." }),
      questionsWrap,
      el("div", { class: "challenge-actions" }, [submit]),
      resultBox,
      attemptsNote,
      feedback
    ]);
  }

  // ---------- componentes de la lección ----------
  function renderObjectives(objectives) {
    if (!objectives || !objectives.length) return null;
    return el("section", { class: "objectives-card" }, [
      el("span", { class: "mini-label", text: "OBJETIVOS DE APRENDIZAJE (VERIFICABLES)" }),
      el("ul", { class: "objectives-list" },
        objectives.map(function (o) { return el("li", { html: o }); }))
    ]);
  }

  function renderSummary(summary) {
    if (!summary || !summary.length) return null;
    return el("section", { class: "summary-card" }, [
      el("span", { class: "mini-label", text: "RESUMEN DE LA LECCIÓN" }),
      el("ul", { class: "list-block" },
        summary.map(function (s) { return el("li", { html: s }); }))
    ]);
  }

  // ---------- wizard por pasos ----------
  // Agrupa el contenido de la lección en pasos lógicos. Todos los pasos
  // quedan en el DOM (uno visible) para no perder accesibilidad ni
  // romper las pruebas que consultan los bloques de la lección.
  function buildSteps(lesson, store) {
    var steps = [];
    var buffer = [];
    var bufferTitle = "Introducción";

    function flush() {
      if (buffer.length) {
        steps.push({ title: bufferTitle, icon: "teoria", nodes: buffer });
        buffer = [];
      }
    }

    if (lesson.objectives && lesson.objectives.length) {
      steps.push({ title: "Objetivos", icon: "objetivos", nodes: [renderObjectives(lesson.objectives)] });
    }

    (lesson.blocks || []).forEach(function (block) {
      if (block.type === "heading") {
        flush();
        bufferTitle = block.text;
        return;
      }
      if (block.type === "trace") {
        flush();
        steps.push({ title: "Traza de ejecución", icon: "traza", nodes: [renderTrace(block)] });
        return;
      }
      if (block.type === "errors") {
        flush();
        steps.push({ title: "Errores frecuentes", icon: "errores", nodes: [renderBlock(block, lesson)] });
        return;
      }
      if (block.type === "application") {
        flush();
        steps.push({ title: "Aplicación práctica", icon: "aplicacion", nodes: [renderBlock(block, lesson)] });
        return;
      }
      buffer.push(renderBlock(block, lesson));
    });
    flush();

    var practice = renderPractice(lesson.practice, lesson.id, store);
    if (practice) steps.push({ title: "Práctica guiada", icon: "practica", nodes: [practice] });

    var exercises = renderExercises(lesson.exercises, lesson.id, store);
    if (exercises) steps.push({ title: "Ejercicios", icon: "ejercicios", nodes: [exercises] });

    var quiz = renderQuiz(quizData(lesson), lesson.id, store);
    if (quiz) steps.push({ title: "Evaluación", icon: "evaluacion", nodes: [quiz] });

    var summary = renderSummary(lesson.summary);
    if (summary) steps.push({ title: "Resumen", icon: "resumen", nodes: [summary] });

    return steps;
  }

  function renderWizard(steps) {
    var progress = el("div", { class: "wizard-progress", role: "tablist", "aria-label": "Pasos de la lección" });
    var stage = el("div", { class: "wizard-stage" });
    var sections = [];
    var current = 0;

    var prevBtn = el("button", { class: "button-secondary", type: "button", text: "← Anterior" });
    var nextBtn = el("button", { class: "button-primary", type: "button", text: "Siguiente →" });
    var counter = el("span", { class: "wizard-counter" });

    function show(index) {
      if (index < 0 || index >= steps.length) return;
      if (sections[current]) {
        sections[current].classList.remove("active");
        progress.children[current].classList.remove("active");
        progress.children[current].setAttribute("aria-selected", "false");
      }
      current = index;
      sections[current].classList.add("active");
      progress.children[current].classList.add("active");
      progress.children[current].setAttribute("aria-selected", "true");
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current === steps.length - 1;
      counter.textContent = "Paso " + (current + 1) + " de " + steps.length;
      if (stage.scrollIntoView) stage.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    steps.forEach(function (step, i) {
      var section = el("section", {
        class: "wizard-step" + (i === 0 ? " active" : ""),
        "data-step": String(i),
        role: "tabpanel"
      }, [
        el("div", { class: "wizard-step-head" }, [
          el("img", {
            class: "wizard-step-icon",
            src: "assets/img/step-" + step.icon + ".svg",
            alt: "",
            "aria-hidden": "true"
          }),
          el("span", { class: "wizard-step-index", text: String(i + 1) }),
          el("h3", { class: "wizard-step-title", text: step.title })
        ])
      ]);
      step.nodes.forEach(function (node) {
        if (node) section.appendChild(node);
      });
      stage.appendChild(section);
      sections.push(section);

      var dot = el("button", {
        class: "wizard-dot" + (i === 0 ? " active" : ""),
        type: "button",
        role: "tab",
        "aria-label": "Paso " + (i + 1) + ": " + step.title,
        "aria-selected": i === 0 ? "true" : "false",
        text: String(i + 1)
      });
      dot.addEventListener("click", function () { show(i); });
      progress.appendChild(dot);
    });

    prevBtn.addEventListener("click", function () { show(current - 1); });
    nextBtn.addEventListener("click", function () { show(current + 1); });

    show(0);

    return el("div", { class: "wizard" }, [
      progress,
      stage,
      el("div", { class: "wizard-controls" }, [prevBtn, counter, nextBtn])
    ]);
  }

  function render(lesson, module, store, nav) {
    var mount = el("div", {});

    mount.appendChild(
      el("div", { class: "lesson-meta" }, [
        el("div", {}, [
          el("span", { class: "meta-label", text: "MÓDULO " + String(module.number).padStart(2, "0") }),
          el("span", { class: "meta-separator", text: "·" }),
          el("span", { text: "Lección " + lesson.number + " de " + module.lessons.length }),
          el("span", { class: "meta-separator", text: "·" }),
          el("span", { text: lesson.duration || "20 minutos" })
        ]),
        el("span", { class: "lesson-status" }, [el("span"), document.createTextNode(store.isCompleted(lesson.id) ? "Completada" : "Lección guiada")])
      ])
    );

    var header = el("div", { class: "lesson-heading" }, [
      el("div", {}, [
        el("p", { class: "eyebrow", text: "LECCIÓN " + String(lesson.number).padStart(2, "0") + " · " + module.title.toUpperCase() }),
        el("h2", { text: lesson.title })
      ]),
      el("span", { class: "lesson-icon", text: String(lesson.number).padStart(2, "0") })
    ]);

    var body = el("div", { id: "lesson-content" });
    var steps = buildSteps(lesson, store);
    if (steps.length) body.appendChild(renderWizard(steps));

    // pie con requisitos y navegación
    var reqList = el("div", { class: "req-list" });
    var completeBtn = el("button", { class: "button-primary", type: "button", html: 'Marcar lección como dominada <span>✓</span>' });
    var footerFeedback = feedbackNode("footer-feedback");

    function refreshRequirements() {
      var status = store.requirementsStatus(lesson);
      reqList.innerHTML = "";
      status.items.forEach(function (item) {
        reqList.appendChild(
          el("div", { class: "req-item" + (item.met ? " met" : "") }, [
            el("span", { text: item.met ? "✓" : "○" }),
            el("span", { text: item.label })
          ])
        );
      });

      if (store.isCompleted(lesson.id)) {
        completeBtn.innerHTML = "Lección dominada ✓";
        completeBtn.disabled = true;
        completeBtn.classList.add("is-done");
      } else {
        completeBtn.disabled = !status.met;
        completeBtn.classList.remove("is-done");
      }
      return status;
    }

    completeBtn.addEventListener("click", function () {
      var status = refreshRequirements();
      if (!status.met) {
        setFeedback(footerFeedback, "Todavía no cumples todos los requisitos de la lección.", "error");
        return;
      }
      var result = store.completeLesson(lesson.id);
      if (!result.ok) {
        setFeedback(footerFeedback, result.message, "error");
        return;
      }
      refreshRequirements();
      setFeedback(
        footerFeedback,
        "Lección marcada como dominada. El progreso quedó guardado en este navegador.",
        "success"
      );
      document.dispatchEvent(new CustomEvent("javaLab:progress"));
    });

    var resetBtn = el("button", { class: "button-ghost", type: "button", text: "Repetir esta lección" });
    resetBtn.addEventListener("click", function () {
      if (!window.confirm("Se borrarán TU evaluación, práctica y ejercicios verificados de esta lección. ¿Continuar?")) return;
      store.resetLesson(lesson.id);
      document.dispatchEvent(new CustomEvent("javaLab:progress"));
      nav.reload();
    });

    var prev = nav.prev(lesson.id);
    var next = nav.next(lesson.id);

    var footer = el("footer", { class: "lesson-footer lesson-requirements" }, [
      el("div", { class: "req-panel" }, [
        el("span", { class: "mini-label", text: "REQUISITOS PARA DOMINAR ESTA LECCIÓN" }),
        reqList
      ]),
      el("div", { class: "footer-actions" }, [
        footerFeedback,
        resetBtn,
        completeBtn
      ])
    ]);

    var navBar = el("div", { class: "lesson-nav" }, [
      prev
        ? el("button", { class: "button-secondary", type: "button", text: "← " + prev.title, onclick: function () { nav.goTo(prev.id); } })
        : el("span", { class: "nav-spacer" }),
      el("button", { class: "button-ghost", type: "button", text: "Volver a la ruta", onclick: nav.home }),
      next
        ? el("button", { class: "button-primary", type: "button", html: next.title + " <span>→</span>", onclick: function () { nav.goTo(next.id); } })
        : el("button", { class: "button-primary", type: "button", text: "Siguiente módulo →", onclick: nav.home })
    ]);

    var card = el("article", { class: "lesson-card" }, [header, body, footer, navBar]);

    // Reevalúa requisitos cuando cambia el progreso (práctica/ejercicios/quiz).
    var onProgress = function () { refreshRequirements(); };
    document.addEventListener("javaLab:progress", onProgress);
    mount._cleanup = function () { document.removeEventListener("javaLab:progress", onProgress); };

    refreshRequirements();
    mount.appendChild(card);
    return mount;
  }

  function quizData(lesson) {
    if (lesson.quiz && Array.isArray(lesson.quiz.questions)) return lesson.quiz;
    if (Array.isArray(lesson.quiz) && lesson.quiz.length) {
      return { title: "Evaluación de comprensión", passScore: 0.75, questions: lesson.quiz };
    }
    return null;
  }

  global.JavaLabRenderer = {
    render: render,
    renderBlock: renderBlock,
    renderTrace: renderTrace,
    codeWindow: codeWindow,
    el: el
  };
})(typeof window !== "undefined" ? window : globalThis);
