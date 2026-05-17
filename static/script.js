(function () {
  "use strict";

  var root = document.documentElement;
  var toggle = document.getElementById("themeToggle");
  var stored = localStorage.getItem("robolab-theme");
  if (stored === "light") root.classList.add("light");
  if (toggle) {
    toggle.addEventListener("click", function () {
      root.classList.toggle("light");
      localStorage.setItem(
        "robolab-theme",
        root.classList.contains("light") ? "light" : "dark"
      );
    });
  }

  var slider = document.getElementById("typeSlider");
  var typeCard = document.getElementById("typeCard");
  var typesEl = document.getElementById("types-json");
  if (slider && typeCard && typesEl) {
    var types;
    try {
      types = JSON.parse(typesEl.textContent);
    } catch (e) {
      types = [];
    }
    function renderType(i) {
      var t = types[i] || { title: "", text: "" };
      typeCard.innerHTML =
        "<h3>" +
        escapeHtml(t.title) +
        "</h3><p>" +
        escapeHtml(t.text) +
        "</p>";
    }
    slider.addEventListener("input", function () {
      renderType(parseInt(slider.value, 10) || 0);
    });
    renderType(0);
  }

  var tabBtns = document.querySelectorAll(".tab[data-tab]");
  tabBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-tab");
      tabBtns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
      document.querySelectorAll(".tab-panel").forEach(function (p) {
        var show = p.id === "panel-" + id;
        p.hidden = !show;
        p.classList.toggle("active", show);
      });
    });
  });

  var chips = document.getElementById("appChips");
  var chipSummary = document.getElementById("chipSummary");
  if (chips && chipSummary) {
    var map = {
      vision: "зрение и сенсорный стек",
      control: "контуры управления и устойчивость",
      mech: "механика и приводы",
      sw: "ПО, симуляция и CI для роботов",
    };
    function updateChips() {
      var picked = [];
      chips.querySelectorAll("input[type=checkbox]").forEach(function (cb) {
        if (cb.checked) picked.push(map[cb.value] || cb.value);
      });
      chipSummary.textContent = picked.length ? picked.join(", ") : "";
    }
    chips.addEventListener("change", updateChips);
    updateChips();
  }

  var chain = document.getElementById("signalChain");
  var hint = document.getElementById("chainHint");
  if (chain && hint) {
    chain.addEventListener("click", function (e) {
      var node = e.target.closest(".chain-node");
      if (!node) return;
      chain.querySelectorAll(".chain-node").forEach(function (n) {
        n.classList.toggle("active", n === node);
      });
      hint.textContent = node.getAttribute("data-desc") || "";
      hint.classList.remove("muted");
    });
  }

  var learningForm = document.getElementById("learningForm");
  if (learningForm && document.body.getAttribute("data-deploy") === "static") {
    learningForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name =
        (learningForm.querySelector('[name="name"]').value || "").trim() ||
        "Гость";
      var focus = learningForm.querySelector('[name="focus"]').value;
      var level = learningForm.querySelector('[name="level"]').value;
      var labels = {
        manipulators: "манипуляторы и промышленная автоматизация",
        mobile: "мобильные и автономные роботы",
        humanoid: "гуманоидные и сервисные системы",
        research: "исследовательские платформы и ИИ",
        general: "робототехнику в целом",
      };
      var levels = {
        beginner: "с нуля, шаг за шагом",
        school: "в рамках школьного или кружкового уровня",
        hobby: "как увлечение с практикой на макетах",
        pro: "на уровне инженерных задач и прототипов",
      };
      var box = learningForm.parentElement.querySelector(".result-box");
      if (!box) {
        box = document.createElement("div");
        box.className = "result-box";
        box.setAttribute("role", "status");
        learningForm.insertAdjacentElement("afterend", box);
      }
      box.innerHTML =
        "<p><strong>Привет, " +
        escapeHtml(name) +
        "!</strong></p><p>Для изучения " +
        escapeHtml(labels[focus] || labels.general) +
        " логично двигаться " +
        escapeHtml(levels[level] || levels.beginner) +
        ": начните с простых схем и датчиков, затем добавляйте управление и обратную связь.</p>";
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
