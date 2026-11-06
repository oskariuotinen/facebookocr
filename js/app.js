/* Englannin oppimispeli alakouluun. Ei riippuvuuksia, ei palvelinta. */
(function () {
  "use strict";

  var DATA = window.GAME_DATA;
  var STORE_KEY = "englantipeli-v1";
  var ROUND_LEN = 8;

  var LEVELS = [
    { id: 1, name: "1.–2. luokka", icon: "🌱", desc: "Kuuntele, katso ja leiki" },
    { id: 2, name: "3.–4. luokka", icon: "🌿", desc: "Sanoja, kirjoittamista ja lauseita" },
    { id: 3, name: "5.–6. luokka", icon: "🌳", desc: "Lauseita ja keskusteluja" }
  ];

  var ACTIVITIES = [
    { id: "listen", name: "Kuuntele ja valitse", icon: "👂", minLevel: 1, themed: true,
      help: "Kuuntele sana ja valitse oikea kuva." },
    { id: "look", name: "Katso ja valitse", icon: "👀", minLevel: 1, themed: true,
      help: "Katso kuvaa ja valitse oikea englanninkielinen sana." },
    { id: "memory", name: "Muistipeli", icon: "🃏", minLevel: 1, themed: true,
      help: "Etsi parit: kuva ja sana." },
    { id: "dialogue", name: "Keskustelu", icon: "💬", minLevel: 1, themed: false,
      help: "Mitä vastaisit? Valitse sopiva vastaus." },
    { id: "spell", name: "Tavaa sana", icon: "🔤", minLevel: 2, themed: true,
      help: "Kuuntele ja kirjoita sana kirjaimista." },
    { id: "sentence", name: "Rakenna lause", icon: "🧩", minLevel: 2, themed: false,
      help: "Laita sanat oikeaan järjestykseen." }
  ];

  var PRAISE = ["Great!", "Well done!", "Super!", "Excellent!", "Good job!", "Awesome!"];

  // ---------- Tila ja tallennus ----------

  var store = load();
  var app = document.getElementById("app");
  var current = null; // käynnissä oleva peli

  function load() {
    var def = { level: 1, sound: true, slow: false, accent: "en-GB", best: {}, feelings: [] };
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return def;
      var s = JSON.parse(raw);
      for (var k in def) if (!(k in s)) s[k] = def[k];
      return s;
    } catch (e) { return def; }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* yksityinen tila */ }
  }

  // ---------- Apurit ----------

  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        var v = attrs[k];
        if (v == null || v === false) continue;
        if (k === "class") el.className = v;
        else if (k === "style") el.style.cssText = v;
        else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? "" : v);
      }
    }
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }
  function append(el, child) {
    if (child == null || child === false) return;
    if (Array.isArray(child)) { child.forEach(function (c) { append(el, c); }); return; }
    el.appendChild(typeof child === "object" ? child : document.createTextNode(String(child)));
  }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function render(node) {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    app.innerHTML = "";
    app.appendChild(node);
    var focusable = app.querySelector("[autofocus]") || app.querySelector("h1, h2");
    if (focusable) { focusable.setAttribute("tabindex", "-1"); focusable.focus({ preventScroll: true }); }
    window.scrollTo(0, 0);
  }

  // ---------- Puhe ----------

  var voices = [];
  function loadVoices() { if (window.speechSynthesis) voices = window.speechSynthesis.getVoices(); }
  if (window.speechSynthesis) {
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
  }
  function hasSpeech() { return !!window.speechSynthesis; }
  function speak(text) {
    if (!store.sound || !hasSpeech()) return;
    var clean = text.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}️]/gu, "").trim();
    if (!clean) return;
    var synth = window.speechSynthesis;
    synth.cancel();
    var u = new SpeechSynthesisUtterance(clean);
    u.lang = store.accent;
    u.rate = store.slow ? 0.65 : 0.9;
    var v = voices.filter(function (x) { return x.lang === store.accent; })[0] ||
            voices.filter(function (x) { return x.lang && x.lang.slice(0, 2) === "en"; })[0];
    if (v) u.voice = v;
    synth.speak(u);
  }
  function speakBtn(text, label, big) {
    return h("button", {
      class: "speak" + (big ? " speak-big" : ""), type: "button",
      "aria-label": label || "Kuuntele", title: label || "Kuuntele",
      onclick: function (e) { e.stopPropagation(); speak(text); }
    }, "🔊");
  }

  // ---------- Yhteiset näkymäpalat ----------

  function visual(word, small) {
    var cls = "visual" + (small ? " visual-small" : "");
    if (word.swatch) return h("span", { class: cls + " swatch", style: "background:" + word.swatch, "aria-label": word.fi });
    if (word.pic) return h("span", { class: cls + " emoji", role: "img", "aria-label": word.fi }, word.pic);
    if (word.txt) return h("span", { class: cls + " bigtext" }, word.txt);
    return h("span", { class: cls + " fitext" }, word.fi);
  }
  function fiLabel(word) {
    // Värinäytteen, emojin ja numeron alle suomenkielinen tuki. Pelkän tekstin alle ei tarvita.
    if (!word.pic && !word.swatch && !word.txt) return null;
    return h("span", { class: "fi-label" }, word.fi);
  }
  function topBar(title, onBack) {
    return h("header", { class: "topbar" },
      h("button", { class: "back", type: "button", onclick: onBack, "aria-label": "Takaisin" }, "←"),
      h("h1", null, title),
      h("button", {
        class: "sound-toggle", type: "button",
        "aria-label": store.sound ? "Ääni päällä" : "Ääni pois",
        onclick: function (e) {
          store.sound = !store.sound; save();
          e.currentTarget.textContent = store.sound ? "🔊" : "🔇";
          e.currentTarget.setAttribute("aria-label", store.sound ? "Ääni päällä" : "Ääni pois");
        }
      }, store.sound ? "🔊" : "🔇")
    );
  }
  function progressBar(done, total) {
    var pct = Math.round((done / total) * 100);
    return h("div", { class: "progress", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": total, "aria-valuenow": done },
      h("div", { class: "progress-fill", style: "width:" + pct + "%" }));
  }
  function stars(n) {
    var s = "";
    for (var i = 0; i < 3; i++) s += i < n ? "⭐" : "☆";
    return h("span", { class: "stars", "aria-label": n + " tähteä kolmesta" }, s);
  }
  function levelInfo(id) { return LEVELS.filter(function (l) { return l.id === id; })[0]; }
  function activityInfo(id) { return ACTIVITIES.filter(function (a) { return a.id === id; })[0]; }
  function themesForLevel(level) { return DATA.themes.filter(function (t) { return t.level <= level; }); }

  // ---------- Näkymät: valikot ----------

  function showHome() {
    current = null;
    render(h("main", { class: "screen home" },
      h("div", { class: "hero" },
        h("div", { class: "hero-icon", "aria-hidden": "true" }, "🦉"),
        h("h1", null, "Let's play English!"),
        h("p", { class: "lead" }, "Valitse luokka-aste")
      ),
      h("div", { class: "grid grid-3" }, LEVELS.map(function (l) {
        return h("button", {
          class: "card level-card" + (store.level === l.id ? " selected" : ""), type: "button",
          onclick: function () { store.level = l.id; save(); showActivities(); }
        },
          h("span", { class: "card-icon", "aria-hidden": "true" }, l.icon),
          h("span", { class: "card-title" }, l.name),
          h("span", { class: "card-desc" }, l.desc));
      })),
      h("nav", { class: "footer-links" },
        h("button", { class: "link", type: "button", onclick: showProgress }, "⭐ Edistyminen"),
        h("button", { class: "link", type: "button", onclick: showSettings }, "⚙️ Asetukset"),
        h("button", { class: "link", type: "button", onclick: showTeacher }, "📘 Opettajalle")
      ),
      !hasSpeech() ? h("p", { class: "notice" }, "Selaimesi ei tue puhetta. Peli toimii, mutta sanoja ei lueta ääneen.") : null
    ));
  }

  function showActivities() {
    var lvl = levelInfo(store.level);
    var list = ACTIVITIES.filter(function (a) { return a.minLevel <= store.level; });
    render(h("main", { class: "screen" },
      topBar(lvl.icon + " " + lvl.name, showHome),
      h("p", { class: "lead" }, "Mitä pelataan?"),
      h("div", { class: "grid" }, list.map(function (a) {
        return h("button", {
          class: "card", type: "button",
          onclick: function () { a.themed ? showThemes(a.id) : startGame(a.id, null); }
        },
          h("span", { class: "card-icon", "aria-hidden": "true" }, a.icon),
          h("span", { class: "card-title" }, a.name),
          h("span", { class: "card-desc" }, a.help));
      }))
    ));
  }

  function showThemes(activityId) {
    var act = activityInfo(activityId);
    var themes = themesForLevel(store.level);
    var cards = themes.map(function (t) {
      var b = store.best[activityId + ":" + t.id] || 0;
      return h("button", { class: "card theme-card", type: "button", onclick: function () { startGame(activityId, t.id); } },
        h("span", { class: "card-icon", "aria-hidden": "true" }, t.icon),
        h("span", { class: "card-title" }, t.name),
        stars(b));
    });
    cards.push(h("button", { class: "card theme-card mix", type: "button", onclick: function () { startGame(activityId, "mix"); } },
      h("span", { class: "card-icon", "aria-hidden": "true" }, "🎲"),
      h("span", { class: "card-title" }, "Sekoitus"),
      stars(store.best[activityId + ":mix"] || 0)));
    render(h("main", { class: "screen" },
      topBar(act.icon + " " + act.name, showActivities),
      h("p", { class: "lead" }, "Valitse aihe"),
      h("div", { class: "grid grid-themes" }, cards)
    ));
  }

  // ---------- Pelin käynnistys ----------

  function wordPool(themeId) {
    if (themeId === "mix") {
      var all = [];
      themesForLevel(store.level).forEach(function (t) { all = all.concat(t.words); });
      return all;
    }
    return DATA.themes.filter(function (t) { return t.id === themeId; })[0].words;
  }

  function startGame(activityId, themeId) {
    var key = activityId + ":" + (themeId || "all");
    current = { activity: activityId, theme: themeId, key: key, score: 0, total: 0, missed: [], step: 0 };
    if (activityId === "memory") return startMemory();
    var queue;
    if (activityId === "sentence") {
      queue = shuffle(DATA.sentences.filter(function (s) { return s.level <= store.level; }))
        .sort(function (a, b) { return b.level - a.level; }) // painota omaa tasoa
        .slice(0, ROUND_LEN);
      queue = shuffle(queue);
    } else if (activityId === "dialogue") {
      var pool = DATA.dialogues.filter(function (d) { return d.level <= store.level; });
      var own = shuffle(pool.filter(function (d) { return d.level === store.level; }));
      var older = shuffle(pool.filter(function (d) { return d.level < store.level; }));
      queue = shuffle(own.concat(older).slice(0, ROUND_LEN));
    } else {
      var words = wordPool(themeId);
      if (activityId === "spell") words = words.filter(spellable);
      queue = shuffle(words).slice(0, ROUND_LEN);
      current.pool = wordPool(themeId);
    }
    current.queue = queue;
    current.total = queue.length;
    current.retried = {};
    nextQuestion();
  }

  function spellable(word) {
    var limit = store.level >= 3 ? 11 : 8;
    return /^[A-Za-z ]+$/.test(word.en) && word.en.length <= limit;
  }

  function nextQuestion() {
    if (!current.queue.length) return showResults();
    var item = current.queue.shift();
    current.item = item;
    current.step++;
    var fns = { listen: qListen, look: qLook, spell: qSpell, sentence: qSentence, dialogue: qDialogue };
    fns[current.activity](item);
  }

  // Väärin mennyt kysymys tulee kierroksen loppuun uudelleen (kerran), mutta pisteitä ei anneta lisää.
  function recordAnswer(correct, missText) {
    var item = current.item;
    var id = JSON.stringify(item);
    if (current.retried[id]) return; // uusintakierros ei vaikuta pisteisiin
    if (correct) current.score++;
    else {
      current.missed.push(missText);
      current.retried[id] = true;
      current.queue.push(item);
      current.total++; // edistymispalkkia varten
    }
  }

  function gameScreen(prompt, body, footer) {
    var act = activityInfo(current.activity);
    return h("main", { class: "screen game" },
      topBar(act.icon + " " + act.name, function () { confirmQuit(); }),
      progressBar(current.step - 1, current.total),
      h("section", { class: "prompt" }, prompt),
      body,
      h("div", { class: "feedback", "aria-live": "polite", id: "feedback" }),
      footer || null
    );
  }
  function confirmQuit() {
    if (current && current.step > 1 && !window.confirm("Lopetetaanko peli?")) return;
    var act = activityInfo(current.activity);
    current = null;
    if (act.themed) showThemes(act.id); else showActivities();
  }
  function feedback(ok, text) {
    var fb = document.getElementById("feedback");
    fb.className = "feedback " + (ok ? "ok" : "bad");
    fb.textContent = text;
  }
  function showNext(delayMs) {
    var fb = document.getElementById("feedback");
    if (delayMs) {
      var g = current;
      setTimeout(function () { if (current === g) nextQuestion(); }, delayMs);
      return;
    }
    fb.appendChild(h("div", null,
      h("button", { class: "btn primary next", type: "button", autofocus: true, onclick: nextQuestion }, "Seuraava →")));
    fb.querySelector(".next").focus();
  }
  function lockAll(container) {
    container.querySelectorAll("button.option").forEach(function (b) { b.disabled = true; });
  }
  function distractors(item, n) {
    var others = current.pool.filter(function (w) { return w.en !== item.en; });
    return shuffle(others).slice(0, n);
  }

  // ---------- Kuuntele ja valitse ----------

  function qListen(item) {
    var opts = shuffle([item].concat(distractors(item, 3)));
    var grid = h("div", { class: "grid options options-pic" });
    opts.forEach(function (o) {
      grid.appendChild(h("button", {
        class: "option option-pic", type: "button", "aria-label": o.fi,
        onclick: function (e) {
          lockAll(grid);
          var ok = o.en === item.en;
          recordAnswer(ok, item);
          e.currentTarget.classList.add(ok ? "correct" : "wrong");
          if (ok) { feedback(true, pick(PRAISE) + " " + item.en); speak(item.en); showNext(1300); }
          else {
            grid.querySelectorAll(".option")[opts.indexOf(item)].classList.add("correct");
            feedback(false, "Oikea vastaus: " + item.en + " = " + item.fi);
            speak(item.en);
            showNext();
          }
        }
      }, visual(o), fiLabel(o)));
    });
    var prompt = h("div", null,
      speakBtn(item.en, "Kuuntele sana uudelleen", true),
      h("p", { class: "hint" }, hasSpeech() && store.sound ? "Paina kaiutinta kuullaksesi uudelleen" : "Sana: " + item.en));
    render(gameScreen(prompt, grid));
    setTimeout(function () { speak(item.en); }, 300);
  }

  // ---------- Katso ja valitse ----------

  function qLook(item) {
    var opts = shuffle([item].concat(distractors(item, 3)));
    var grid = h("div", { class: "grid options options-word" });
    opts.forEach(function (o, i) {
      grid.appendChild(h("button", {
        class: "option option-word", type: "button",
        onclick: function (e) {
          lockAll(grid);
          var ok = o.en === item.en;
          recordAnswer(ok, item);
          e.currentTarget.classList.add(ok ? "correct" : "wrong");
          speak(item.en);
          if (ok) { feedback(true, pick(PRAISE)); showNext(1300); }
          else {
            grid.children[opts.indexOf(item)].classList.add("correct");
            feedback(false, "Oikea vastaus: " + item.en);
            showNext();
          }
        }
      }, o.en));
    });
    var prompt = h("div", { class: "look-prompt" }, visual(item), fiLabel(item));
    render(gameScreen(prompt, grid));
  }

  // ---------- Tavaa sana ----------

  function qSpell(item) {
    var target = item.en;
    var letters = target.replace(/ /g, "").split("");
    var extra = [];
    if (store.level >= 3) {
      var abc = "abcdefghijklmnoprstuvwy";
      while (extra.length < 2) extra.push(pick(abc.split("")));
    }
    var tiles = shuffle(letters.concat(extra)).map(function (ch, i) { return { ch: ch, id: i, used: false }; });
    var slots = []; // { tile } tai null; välilyönnit kiinteitä
    var slotRow = h("div", { class: "slots", "aria-label": "Kirjoittamasi sana" });
    var tileRow = h("div", { class: "tiles" });
    var done = false;

    function draw() {
      slotRow.innerHTML = "";
      var si = 0;
      for (var i = 0; i < target.length; i++) {
        if (target[i] === " ") { slotRow.appendChild(h("span", { class: "slot-gap" })); continue; }
        (function (idx) {
          var s = slots[idx];
          slotRow.appendChild(h("button", {
            class: "slot" + (s ? " filled" : ""), type: "button", disabled: done || !s,
            "aria-label": s ? "Poista kirjain " + s.ch : "Tyhjä",
            onclick: function () { if (s) { s.used = false; slots[idx] = null; draw(); } }
          }, s ? s.ch : ""));
        })(si);
        si++;
      }
      tileRow.innerHTML = "";
      tiles.forEach(function (t) {
        tileRow.appendChild(h("button", {
          class: "tile", type: "button", disabled: done || t.used,
          onclick: function () {
            var free = -1;
            for (var k = 0; k < letters.length; k++) if (!slots[k]) { free = k; break; }
            if (free < 0) return;
            t.used = true; slots[free] = t; draw();
            if (slots.filter(Boolean).length === letters.length) check();
          }
        }, t.ch));
      });
    }
    function check() {
      var guess = slots.map(function (s) { return s.ch; }).join("");
      var ok = guess.toLowerCase() === letters.join("").toLowerCase();
      done = true;
      draw();
      recordAnswer(ok, item);
      slotRow.classList.add(ok ? "correct" : "wrong");
      speak(target);
      if (ok) { feedback(true, pick(PRAISE) + " " + target); showNext(1500); }
      else { feedback(false, "Oikein kirjoitettuna: " + target); showNext(); }
    }
    for (var k = 0; k < letters.length; k++) slots.push(null);
    draw();

    var prompt = h("div", { class: "look-prompt" }, visual(item), fiLabel(item),
      h("div", null, speakBtn(target, "Kuuntele sana")));
    var undo = h("button", {
      class: "btn", type: "button",
      onclick: function () {
        if (done) return;
        for (var k = slots.length - 1; k >= 0; k--) if (slots[k]) { slots[k].used = false; slots[k] = null; break; }
        draw();
      }
    }, "⌫ Pyyhi");
    render(gameScreen(prompt, h("div", { class: "spell" }, slotRow, tileRow, h("div", { class: "row" }, undo))));
    setTimeout(function () { speak(target); }, 300);
  }

  // ---------- Rakenna lause ----------

  function qSentence(item) {
    var words = item.en.split(" ");
    var tiles = shuffle(words.map(function (w, i) { return { w: w, id: i, used: false }; }));
    // Älä anna valmiiksi oikeaa järjestystä
    if (tiles.map(function (t) { return t.w; }).join(" ") === item.en && tiles.length > 1) tiles.push(tiles.shift());
    var placed = [];
    var done = false;
    var line = h("div", { class: "sentence-line", "aria-label": "Rakentamasi lause" });
    var pool = h("div", { class: "tiles word-tiles" });

    function draw() {
      line.innerHTML = "";
      if (!placed.length) line.appendChild(h("span", { class: "placeholder" }, "Napauta sanoja tähän järjestyksessä"));
      placed.forEach(function (t, i) {
        line.appendChild(h("button", {
          class: "tile word placed", type: "button", disabled: done,
          onclick: function () { t.used = false; placed.splice(i, 1); draw(); }
        }, t.w));
      });
      pool.innerHTML = "";
      tiles.forEach(function (t) {
        pool.appendChild(h("button", {
          class: "tile word", type: "button", disabled: done || t.used,
          onclick: function () {
            t.used = true; placed.push(t); draw();
            if (placed.length === tiles.length) check();
          }
        }, t.w));
      });
    }
    function check() {
      var guess = placed.map(function (t) { return t.w; }).join(" ");
      var ok = guess === item.en;
      done = true;
      draw();
      line.classList.add(ok ? "correct" : "wrong");
      recordAnswer(ok, { en: item.en, fi: item.fi });
      speak(item.en);
      if (ok) { feedback(true, pick(PRAISE)); showNext(1800); }
      else { feedback(false, "Oikea järjestys: " + item.en); showNext(); }
    }
    draw();
    var prompt = h("div", null,
      h("p", { class: "fi-sentence" }, item.fi),
      h("button", { class: "btn small", type: "button", onclick: function () { speak(item.en); } }, "🔊 Kuuntele vihje"));
    render(gameScreen(prompt, h("div", { class: "sentence" }, line, pool)));
  }

  // ---------- Keskustelu ----------

  function qDialogue(item) {
    var opts = shuffle([item.ok].concat(item.bad));
    var list = h("div", { class: "dialogue-options" });
    opts.forEach(function (o) {
      list.appendChild(h("div", { class: "dialogue-row" },
        speakBtn(o, "Kuuntele vastaus"),
        h("button", {
          class: "option option-reply", type: "button",
          onclick: function (e) {
            lockAll(list);
            var ok = o === item.ok;
            recordAnswer(ok, { en: item.say + " → " + item.ok, fi: "" });
            e.currentTarget.classList.add(ok ? "correct" : "wrong");
            speak(item.ok);
            if (ok) { feedback(true, pick(PRAISE)); showNext(1600); }
            else {
              list.querySelectorAll(".option")[opts.indexOf(item.ok)].classList.add("correct");
              feedback(false, "Sopiva vastaus: " + item.ok);
              showNext();
            }
          }
        }, o)));
    });
    var prompt = h("div", { class: "dialogue-prompt" },
      h("span", { class: "avatar", "aria-hidden": "true" }, item.who),
      h("div", { class: "bubble" }, item.say, " ", speakBtn(item.say, "Kuuntele")));
    render(gameScreen(prompt, list));
    setTimeout(function () { speak(item.say); }, 300);
  }

  // ---------- Muistipeli ----------

  function startMemory() {
    var pairs = store.level === 1 ? 4 : 6;
    var words = shuffle(wordPool(current.theme)).slice(0, pairs);
    var cards = [];
    words.forEach(function (w, i) {
      cards.push({ pair: i, kind: "pic", word: w });
      cards.push({ pair: i, kind: "word", word: w });
    });
    cards = shuffle(cards);
    var open = [], found = 0, moves = 0, busy = false;
    var grid = h("div", { class: "memory grid-mem-" + pairs });
    var info = h("p", { class: "hint" }, "Siirrot: 0");

    cards.forEach(function (c) {
      var face = c.kind === "pic"
        ? h("span", { class: "face" }, visual(c.word, true))
        : h("span", { class: "face face-word" }, c.word.en);
      c.el = h("button", {
        class: "mem-card", type: "button", "aria-label": "Kortti",
        onclick: function () {
          if (busy || c.open || c.done) return;
          c.open = true; c.el.classList.add("open"); c.el.setAttribute("aria-label", c.kind === "pic" ? c.word.fi : c.word.en);
          speak(c.word.en);
          open.push(c);
          if (open.length === 2) {
            moves++; info.textContent = "Siirrot: " + moves;
            var a = open[0], b = open[1];
            if (a.pair === b.pair) {
              a.done = b.done = true;
              a.el.classList.add("matched"); b.el.classList.add("matched");
              open = []; found++;
              if (found === pairs) {
                var ratio = moves / pairs;
                current.memoryStars = ratio <= 1.6 ? 3 : ratio <= 2.6 ? 2 : 1;
                current.score = pairs; current.total = pairs; current.moves = moves;
                var g = current;
                setTimeout(function () { if (current === g) showResults(); }, 900);
              }
            } else {
              busy = true;
              setTimeout(function () {
                a.open = b.open = false;
                a.el.classList.remove("open"); b.el.classList.remove("open");
                a.el.setAttribute("aria-label", "Kortti"); b.el.setAttribute("aria-label", "Kortti");
                open = []; busy = false;
              }, 1200);
            }
          }
        }
      }, h("span", { class: "back-face", "aria-hidden": "true" }, "❓"), face);
      grid.appendChild(c.el);
    });
    var act = activityInfo("memory");
    render(h("main", { class: "screen game" },
      topBar(act.icon + " " + act.name, function () { current = null; showThemes("memory"); }),
      h("p", { class: "lead" }, "Etsi kuva ja sana, jotka kuuluvat yhteen"),
      grid, info));
  }

  // ---------- Tulokset ----------

  function calcStars() {
    if (current.activity === "memory") return current.memoryStars;
    var base = current.total - current.missed.length; // alkuperäisten kysymysten määrä
    var pct = base ? current.score / base : 0;
    return pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : 1; // pelin läpäisystä aina vähintään yksi tähti
  }

  function showResults() {
    var n = calcStars();
    var key = current.activity + ":" + (current.theme || "all");
    if (!store.best[key] || store.best[key] < n) store.best[key] = n;
    save();
    var base = current.total - current.missed.length;
    var msg = n === 3 ? "Mahtavaa! You are a star!" : n === 2 ? "Hyvää työtä! Good job!" : "Hyvä yritys! Harjoitellaan lisää.";
    var act = activityInfo(current.activity);
    var g = current;

    var missedList = null;
    if (g.missed.length) {
      missedList = h("section", { class: "missed" },
        h("h2", null, "Harjoittele vielä näitä"),
        h("ul", null, g.missed.map(function (m) {
          return h("li", null, speakBtn(m.en.split(" → ").pop(), "Kuuntele"), " ", h("strong", null, m.en), m.fi ? " – " + m.fi : "");
        })));
    }

    var selfEval = h("section", { class: "self-eval" },
      h("h2", null, "Miltä pelaaminen tuntui?"),
      h("div", { class: "row" }, [["😀", "Helpolta"], ["🙂", "Sopivalta"], ["😕", "Vaikealta"]].map(function (f) {
        return h("button", {
          class: "face-btn", type: "button", "aria-label": f[1],
          onclick: function (e) {
            store.feelings.push({ key: key, level: store.level, f: f[1], at: new Date().toISOString().slice(0, 10) });
            if (store.feelings.length > 200) store.feelings = store.feelings.slice(-200);
            save();
            e.currentTarget.parentNode.querySelectorAll("button").forEach(function (b) { b.disabled = true; });
            e.currentTarget.classList.add("chosen");
            var tip = f[1] === "Vaikealta"
              ? "Hyvä että kerroit! Kokeile hitaampaa puhetta asetuksista tai pelaa sama aihe uudelleen."
              : f[1] === "Helpolta" ? "Kokeile seuraavaksi uutta aihetta tai pelimuotoa!" : "Hienoa, jatka samaan malliin!";
            e.currentTarget.parentNode.parentNode.appendChild(h("p", { class: "hint" }, tip));
          }
        }, h("span", { "aria-hidden": "true" }, f[0]), h("span", { class: "face-label" }, f[1]));
      })));

    render(h("main", { class: "screen results" },
      h("h1", null, msg),
      h("div", { class: "big-stars" }, stars(n)),
      g.activity === "memory"
        ? h("p", { class: "lead" }, "Löysit kaikki parit " + g.moves + " siirrolla.")
        : h("p", { class: "lead" }, "Oikein ensimmäisellä yrityksellä: " + g.score + " / " + base),
      missedList,
      selfEval,
      h("p", { class: "fact" }, "💡 Tiesitkö? " + pick(DATA.facts)),
      h("div", { class: "row" },
        h("button", { class: "btn primary", type: "button", onclick: function () { startGame(g.activity, g.theme); } }, "🔁 Pelaa uudelleen"),
        h("button", { class: "btn", type: "button", onclick: function () { act.themed ? showThemes(act.id) : showActivities(); } }, "Valikkoon"))
    ));
    speak(n === 3 ? "Fantastic!" : n === 2 ? "Good job!" : "Nice try!");
  }

  // ---------- Edistyminen ----------

  function showProgress() {
    var themed = ACTIVITIES.filter(function (a) { return a.themed; });
    var rows = DATA.themes.concat([{ id: "mix", name: "Sekoitus", icon: "🎲", level: 1 }]).map(function (t) {
      return h("tr", null,
        h("th", { scope: "row" }, t.icon + " " + t.name, t.id === "mix" ? null : h("span", { class: "lvl" }, " (" + levelInfo(t.level).name + ")")),
        themed.map(function (a) { return h("td", null, stars(store.best[a.id + ":" + t.id] || 0)); }));
    });
    var others = ACTIVITIES.filter(function (a) { return !a.themed; }).map(function (a) {
      return h("li", null, a.icon + " " + a.name + ": ", stars(store.best[a.id + ":all"] || 0));
    });
    render(h("main", { class: "screen" },
      topBar("⭐ Edistyminen", showHome),
      h("div", { class: "table-wrap" },
        h("table", { class: "progress-table" },
          h("thead", null, h("tr", null, h("th", null, "Aihe"), themed.map(function (a) { return h("th", { title: a.name }, a.icon); }))),
          h("tbody", null, rows))),
      h("ul", { class: "plain" }, others),
      h("p", { class: "hint" }, "Tähdet tallentuvat vain tälle laitteelle."),
      h("button", {
        class: "btn danger", type: "button",
        onclick: function () {
          if (!window.confirm("Poistetaanko kaikki tähdet ja tallennukset tältä laitteelta?")) return;
          store.best = {}; store.feelings = []; save(); showProgress();
        }
      }, "Nollaa edistyminen")
    ));
  }

  // ---------- Asetukset ----------

  function showSettings() {
    function toggle(label, key) {
      return h("label", { class: "setting" },
        h("input", { type: "checkbox", checked: store[key], onchange: function (e) { store[key] = e.target.checked; save(); } }),
        h("span", null, label));
    }
    render(h("main", { class: "screen" },
      topBar("⚙️ Asetukset", showHome),
      h("div", { class: "settings" },
        toggle("Ääni päällä", "sound"),
        toggle("Hidas puhe", "slow"),
        h("label", { class: "setting" },
          h("span", null, "Ääntämys"),
          h("select", { onchange: function (e) { store.accent = e.target.value; save(); } },
            h("option", { value: "en-GB", selected: store.accent === "en-GB" }, "Brittienglanti"),
            h("option", { value: "en-US", selected: store.accent === "en-US" }, "Amerikanenglanti"))),
        h("button", { class: "btn", type: "button", onclick: function () { speak("Hello! Let's learn English together."); } }, "🔊 Testaa ääni"),
        h("p", { class: "hint" }, "Äänen laatu riippuu laitteesta ja selaimesta. Jos ääntä ei kuulu, tarkista laitteen äänenvoimakkuus ja äänettömän tilan kytkin.")
      )
    ));
  }

  // ---------- Opettajalle ----------

  function showTeacher() {
    function sec(title) {
      var args = Array.prototype.slice.call(arguments, 1);
      return h("section", { class: "teacher-sec" }, h("h2", null, title), args);
    }
    render(h("main", { class: "screen teacher" },
      topBar("📘 Opettajalle", showHome),
      sec("Mikä peli on",
        h("p", null, "Harjoituspeli A1-englannin opiskeluun vuosiluokille 1–6. Peli tukee opetusta, mutta ei korvaa vuorovaikutusta luokassa. Sisältö on jaettu kolmeen tasoon perusopetuksen opetussuunnitelman perusteiden vuosiluokkakokonaisuuksien mukaan.")),
      sec("Yhteys opetussuunnitelmaan",
        h("ul", null,
          h("li", null, h("strong", null, "Taito toimia vuorovaikutuksessa: "), "Keskustelu-pelimuoto harjoittelee tervehdyksiä, kohteliaisuuksia ja arjen kysymyksiä sekä niihin vastaamista"),
          h("li", null, h("strong", null, "Taito tulkita tekstejä: "), "Kuuntele ja valitse sekä Katso ja valitse harjoittavat puheen ja kirjoitetun sanan ymmärtämistä"),
          h("li", null, h("strong", null, "Taito tuottaa tekstejä: "), "Tavaa sana ja Rakenna lause harjoittavat sanojen ja lauseiden kirjoittamista mallin avulla"),
          h("li", null, h("strong", null, "Kielenopiskelutaidot: "), "Itsearviointi pelin lopussa, väärin menneiden sanojen kertaus ja uusi yritys kierroksen lopussa"),
          h("li", null, h("strong", null, "Kulttuurinen moninaisuus ja kielitietoisuus: "), "Tiesitkö?-faktat englannin kielestä ja sen puhujista, brittiläinen ja amerikkalainen ääntämys")
        ),
        h("p", null, "1.–2. luokalla painottuu suullinen ja leikinomainen harjoittelu, joten tasolla 1 sanat kuullaan ja kuvat ohjaavat valintaa. Kirjoittaminen (Tavaa sana, Rakenna lause) alkaa tasolta 2. Tason 3 lauseet ja keskustelut tähtäävät 6. luokan loppuun mennessä tavoiteltavaan taitotasoon A1.3."),
        h("p", { class: "hint" }, "Tarkista ajantasaiset tavoitteet ja arviointikriteerit ePerusteista ja oman kuntasi opetussuunnitelmasta.")),
      sec("Aiheet tasoittain",
        h("ul", null, LEVELS.map(function (l) {
          return h("li", null, h("strong", null, l.name + ": "),
            DATA.themes.filter(function (t) { return t.level === l.id; }).map(function (t) { return t.name; }).join(", "));
        }))),
      sec("Tietosuoja",
        h("p", null, "Peli ei kerää, lähetä eikä tallenna tietoja palvelimelle. Tähdet ja itsearvioinnit tallentuvat vain laitteen selaimeen (localStorage). Peli ei vaadi kirjautumista. Puhesynteesi toimii selaimen omalla toiminnolla; osa selaimista voi käyttää puheeseen pilvipalvelua.")),
      sec("Vinkkejä käyttöön",
        h("ul", null,
          h("li", null, "Pelatkaa pareittain: toinen kuuntelee, toinen sanoo sanan ääneen ennen valintaa"),
          h("li", null, "Keskustelu-pelimuodon jälkeen harjoitelkaa samat repliikit ääneen parin kanssa"),
          h("li", null, "Hidas puhe -asetus auttaa alkuvaiheessa ja kuullun ymmärtämisen tuen tarpeessa")))
    ));
  }

  // ---------- Käynnistys ----------
  showHome();
})();
