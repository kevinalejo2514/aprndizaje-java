/**
 * Stub mínimo de DOM para ejecutar la interfaz de Java Lab en Node.
 * No simula un navegador real: implementa SOLO las operaciones que usan
 * app.js y renderer.js, para poder detectar errores de ejecución reales
 * (nodos inexistentes, excepciones, estados incorrectos) sin dependencias.
 */
"use strict";

class ClassList {
  constructor(node) { this.node = node; this.set = new Set(); }
  add(...cls) { cls.forEach((c) => this.set.add(c)); this._sync(); }
  remove(...cls) { cls.forEach((c) => this.set.delete(c)); this._sync(); }
  contains(cls) { return this.set.has(cls); }
  toggle(cls, force) {
    const want = force === undefined ? !this.set.has(cls) : !!force;
    if (want) this.set.add(cls); else this.set.delete(cls);
    this._sync();
    return want;
  }
  _sync() { this.node.attrs.class = [...this.set].join(" "); }
  _load(value) { this.set = new Set(String(value || "").split(/\s+/).filter(Boolean)); }
}

class TextNode {
  constructor(text) { this.nodeType = 3; this._text = String(text); this.parentNode = null; }
  get textContent() { return this._text; }
}

class Element {
  constructor(tag) {
    this.nodeType = 1;
    this.tagName = String(tag).toUpperCase();
    this.children = [];
    this.attrs = {};
    this.classList = new ClassList(this);
    this.style = {};
    this.listeners = {};
    this.parentNode = null;
    this.disabled = false;
    this.checked = false;
    this.hidden = false;
    this.value = "";
    this._text = "";
  }

  get className() { return this.attrs.class || ""; }
  set className(v) { this.attrs.class = v; this.classList._load(v); }

  appendChild(child) {
    if (child.parentNode) child.parentNode.removeChild(child);
    child.parentNode = this;
    this.children.push(child);
    return child;
  }
  removeChild(child) {
    this.children = this.children.filter((c) => c !== child);
    child.parentNode = null;
    return child;
  }
  remove() { if (this.parentNode) this.parentNode.removeChild(this); }

  setAttribute(key, value) {
    this.attrs[key] = String(value);
    if (key === "class") this.classList._load(value);
    if (key === "id") DOCUMENT._byId[String(value)] = this;
    if (key === "value") this.value = String(value);
  }
  getAttribute(key) {
    if (key === "value") return this.value;
    return key in this.attrs ? this.attrs[key] : null;
  }
  removeAttribute(key) { delete this.attrs[key]; }

  addEventListener(type, fn) { (this.listeners[type] = this.listeners[type] || []).push(fn); }
  dispatchEvent(event) {
    (this.listeners[event.type] || []).slice().forEach((fn) => fn(event));
    return true;
  }
  click() { this.dispatchEvent({ type: "click", target: this, preventDefault() {} }); }

  set innerHTML(value) { this._html = String(value); if (String(value) === "") this.children = []; }
  get innerHTML() { return this._html || ""; }
  set textContent(value) { this._text = String(value); this.children = []; }
  get textContent() {
    if (this._text) return this._text;
    return this.children.map((c) => c.textContent || "").join("");
  }

  /** Selector simple: tag, #id, .clase.compuesta, tag[attr=val]. */
  matchesSimple(selector) {
    let rest = selector;
    const tagMatch = rest.match(/^[a-zA-Z][\w-]*/);
    if (tagMatch) {
      if (this.tagName !== tagMatch[0].toUpperCase()) return false;
      rest = rest.slice(tagMatch[0].length);
    }
    const idMatch = rest.match(/^#([\w-]+)/);
    if (idMatch) {
      if (this.getAttribute("id") !== idMatch[1]) return false;
      rest = rest.slice(idMatch[0].length);
    }
    const classes = [...rest.matchAll(/\.([\w-]+)/g)].map((m) => m[1]);
    if (classes.some((c) => !this.classList.contains(c))) return false;
    rest = rest.replace(/\.[\w-]+/g, "");
    const attrs = [...rest.matchAll(/\[([\w-]+)(?:=([^\]]*))?\]/g)];
    for (const match of attrs) {
      const actual = this.getAttribute(match[1]);
      if (actual === null || actual === undefined) return false;
      if (match[2] !== undefined) {
        const expected = match[2].replace(/^["']|["']$/g, "");
        if (actual !== expected) return false;
      }
    }
    const leftover = rest.replace(/\[[^\]]*\]/g, "").trim();
    return leftover.length === 0;
  }

  matches(selector) {
    return String(selector)
      .trim()
      .split(/\s+/)
      .every((part) => this.matchesSimple(part));
  }

  descendants() {
    const out = [];
    const walk = (node) => {
      (node.children || []).forEach((child) => {
        if (child.nodeType === 1) { out.push(child); walk(child); }
      });
    };
    walk(this);
    return out;
  }

  querySelectorAll(selector) {
    const parts = String(selector).trim().split(/\s+/);
    // Solo descendencia (igual que el navegador): un nodo no consigo a sí mismo.
    let candidates = this.descendants().filter((el) => el.matchesSimple(parts[0]));
    for (let i = 1; i < parts.length; i++) {
      const next = [];
      candidates.forEach((c) => {
        c.descendants().forEach((d) => {
          if (d.matchesSimple(parts[i]) && !next.includes(d)) next.push(d);
        });
      });
      candidates = next;
    }
    return candidates;
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }

  scrollIntoView() {}
  focus() {}
}

const DOCUMENT = {
  _byId: {},
  _roots: [],
  readyState: "complete",
  createElement(tag) { return new Element(tag); },
  createTextNode(text) { return new TextNode(text); },
  getElementById(id) { return this._byId[id] || null; },
  querySelector(selector) {
    if (selector.startsWith("#")) return this._byId[selector.slice(1)] || null;
    for (const root of this._roots) {
      if (root.matches(selector)) return root;
      const found = root.querySelector(selector);
      if (found) return found;
    }
    return null;
  },
  querySelectorAll(selector) {
    const out = [];
    this._roots.forEach((root) => {
      if (root.matches(selector)) out.push(root);
      out.push(...root.querySelectorAll(selector));
    });
    return out;
  },
  addEventListener(type, fn) {
    this._listeners = this._listeners || {};
    (this._listeners[type] = this._listeners[type] || []).push(fn);
  },
  removeEventListener(type, fn) {
    this._listeners = this._listeners || {};
    if (!this._listeners[type]) return;
    this._listeners[type] = this._listeners[type].filter((f) => f !== fn);
  },
  dispatchEvent(event) {
    this._listeners = this._listeners || {};
    ((this._listeners[event.type] || []).slice()).forEach((fn) => fn(event));
    return true;
  },
  body: null,
  reset() {
    this._byId = {};
    this._roots = [];
    this.body = new Element("body");
    this._roots.push(this.body);
  }
};
DOCUMENT.reset();

function createPage(ids) {
  ids.forEach((id) => {
    const node = DOCUMENT.createElement("div");
    node.setAttribute("id", id);
    DOCUMENT.body.appendChild(node);
  });
  return DOCUMENT;
}

class CustomEventStub {
  constructor(type, detail) { this.type = type; this.detail = detail || {}; }
}

function installEnvironment(options) {
  options = options || {};
  const windows = [];
  const env = {
    confirmCalls: 0,
    confirmResult: options.confirmResult !== false,
    scrollToCalls: 0
  };

  const windowStub = {
    addEventListener(type, fn) { (this._listeners = this._listeners || {})[type] = fn; },
    _listeners: {},
    confirm() { env.confirmCalls += 1; return env.confirmResult; },
    scrollTo() { env.scrollToCalls += 1; },
    CustomEvent: CustomEventStub
  };
  windows.push(windowStub);

  const locationStub = { _hash: "", get hash() { return this._hash; }, set hash(v) { this._hash = v; } };

  return { window: windowStub, document: DOCUMENT, location: locationStub, env };
}

module.exports = {
  Element,
  TextNode,
  DOCUMENT,
  createPage,
  installEnvironment,
  CustomEventStub
};
