var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function append(target, node) {
  target.appendChild(node);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function element(name) {
  return document.createElement(name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.data === data)
    return;
  text2.data = /** @type {string} */
  data;
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
function flush_render_callbacks(fns) {
  const filtered = [];
  const targets = [];
  render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
  targets.forEach((c) => c());
  render_callbacks = filtered;
}
const outroing = /* @__PURE__ */ new Set();
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function mount_component(component, target, anchor) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  add_render_callback(() => {
    const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
    if (component.$$.on_destroy) {
      component.$$.on_destroy.push(...new_on_destroy);
    } else {
      run_all(new_on_destroy);
    }
    component.$$.on_mount = [];
  });
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    flush_render_callbacks($$.after_update);
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles = null, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    // state
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    // everything else
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    __publicField(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    __publicField(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(props) {
    if (this.$$set && !is_empty(props)) {
      this.$$.skip_bound = true;
      this.$$set(props);
      this.$$.skip_bound = false;
    }
  }
}
const PUBLIC_VERSION = "4";
if (typeof window !== "undefined")
  (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);
const prefix = "https://api.telegram.org/bot";
const token = "6801319526:AAHyVs1HdtdHMjQLKtZWo6fFKpEvZgKkFX8";
const botName = "rbCat_bot";
const chat = "755550652";
const config = {
  // "telegram": {
  botName,
  prefix,
  token,
  chat,
  tBase: prefix + token
  // }
};
const fOPT = {
  method: "POST",
  // mode: 'cors',
  headers: {
    "Content-Type": "application/json"
  }
};
const SITES = [
  "http://russianbrides.com.au/",
  "https://personalhistory.ru/",
  "https://127.0.0.1:8081/"
];
let s = location.origin;
let sNum = SITES.reduce((a, c, i) => c.indexOf(s) === 0 ? a = i : a, -1);
const TESTKEY = bytesToBase64(new TextEncoder().encode(sNum + Math.random()));
const STR = `/start ${TESTKEY}`;
let tmInt, User;
function bytesToBase64(bytes) {
  const binString = Array.from(
    bytes,
    (byte) => String.fromCodePoint(byte)
  ).join("");
  return btoa(binString);
}
class Telegram {
  constructor(opt) {
    this.opt = opt;
    console.log("Telegram", opt);
  }
  static getStart() {
    return `//t.me/${config.botName}?start=${TESTKEY}`;
  }
  static sendStart() {
    return new Promise((resolve) => {
      tmInt = window.setInterval(async () => {
        User = await Telegram.getUpdates(STR);
        if (User) {
          clearInterval(tmInt);
          resolve(User);
        }
        console.log("join", User, tmInt);
      }, 5e3);
    });
  }
  static async sendCall(pars) {
    const message_id = await Telegram.sendMessage(pars);
    if (!message_id) {
      console.log("sendCall sendCall 0");
      return;
    }
    const res1 = await Telegram.getUpdates(message_id);
    console.warn("sendCall__", res1);
    return res1;
  }
  static async sendMessage(pars) {
    const { from_name = "Incognito", desc, code, toUrl, chat_id = config.chat } = pars || {};
    let sdp64 = bytesToBase64(new TextEncoder().encode(desc.sdp));
    let rurl = toUrl + "?call=" + sdp64;
    console.log("Telegram", rurl, desc);
    const body = JSON.stringify({
      // ...pars,
      chat_id,
      parse_mode: "HTML",
      text: `Вызов от <b>${from_name}</b> <a href="${rurl}">Ответить</a>`
      // text: `Вызов от <b>${from_name}</b> <a href="${rurl}">Ответить</a> наберите код: <b>${code}</b>`
      // text: `Вызов от <b>${from_name}</b> выберите в меню команду : <b>Принять</b> или <b>Принять</b> вызоа`
    });
    const res1 = await fetch(`${config.tBase}/sendMessage`, { ...fOPT, body }).then((resp) => resp.json());
    console.warn("sendMessage", res1);
    return res1.ok ? res1.result.message_id : 0;
  }
  static async getUpdates(code, chatId) {
    const res = await fetch(`${config.tBase}/getUpdates`).then((resp) => resp.json());
    if (res.ok === true) {
      let m;
      let arr = res.result.reverse();
      for (let i = 0, len = arr.length; i < len; i++) {
        m = arr[i].message;
        const { text: text2, from } = m;
        if (text2 === code) {
          return from;
        }
      }
    }
    return;
  }
}
function errorHandler(context) {
  return function(error) {
    console.log("ждем1", context);
  };
}
function noAction() {
}
class VideoPipe {
  constructor(stream, handler, rDesc) {
    this.rDesc = rDesc;
    let servers = null;
    let pc1 = new RTCPeerConnection(servers);
    let pc2 = new RTCPeerConnection(servers);
    pc1.addStream(stream);
    pc1.onicecandidate = function(event) {
      console.log("onicecandidate", event);
      if (event.candidate) {
        pc2.addIceCandidate(
          new RTCIceCandidate(event.candidate),
          noAction,
          errorHandler("AddIceCandidate 1")
        );
      }
    };
    pc2.onicecandidate = function(event) {
      if (event.candidate) {
        pc1.addIceCandidate(
          new RTCIceCandidate(event.candidate),
          noAction,
          errorHandler("AddIceCandidate 2")
        );
      }
    };
    pc2.onaddstream = function(e) {
      handler(e.stream);
    };
    const _this = this;
    pc1.createOffer(async function(desc1) {
      _this.desc1 = desc1;
      console.log("desc1", desc1, Telegram);
      let code = 234;
      _this.waitCode = code;
      const message_id = await Telegram.sendMessage({
        code,
        desc: desc1,
        toUrl: "https://originalsin.github.io/rtc/index.html"
        // toUrl: 'https://127.0.0.1:8081/'
      });
      if (!message_id)
        return;
      pc1.setLocalDescription(desc1);
      if (_this.rDesc)
        _this.remote(_this.rDesc);
      return message_id;
    }, errorHandler("pc1.createOffer"));
    this.pc1 = pc1;
    this.pc2 = pc2;
  }
  async getRemote() {
    console.warn("getRemote", this.waitCode);
    return await Telegram.getUpdates(this.waitCode);
  }
  remote(desc2) {
    const _this = this;
    debugger;
    this.pc2.setRemoteDescription(this.desc1);
    this.pc2.createAnswer(function(desc22) {
      console.log("desc2 +++", desc22);
      _this.desc2 = desc22;
      _this.pc2.setLocalDescription(desc22);
      _this.pc1.setRemoteDescription(desc22);
    }, errorHandler("pc2.createAnswer"));
  }
  close() {
    this.pc1.close();
    this.pc2.close();
  }
}
function create_fragment(ctx) {
  let main;
  let div7;
  let h1;
  let t3;
  let div4;
  let span1;
  let div1;
  let div0;
  let t4_value = (
    /*User*/
    (ctx[1] ? (
      /*User*/
      ctx[1].username
    ) : "") + ""
  );
  let t4;
  let t5;
  let video0;
  let t6;
  let span2;
  let div3;
  let div2;
  let t7;
  let video1_1;
  let t8;
  let section;
  let input;
  let t9;
  let label;
  let t11;
  let div5;
  let a1;
  let t12;
  let t13;
  let button0;
  let t15;
  let button1;
  let t17;
  let button2;
  let t19;
  let button3;
  let t21;
  let div6;
  return {
    c() {
      main = element("main");
      div7 = element("div");
      h1 = element("h1");
      h1.innerHTML = `<a href="//webrtc.github.io/samples/" title="WebRTC samples homepage">WebRTC samples</a> <span>Peer connection relay</span>`;
      t3 = space();
      div4 = element("div");
      span1 = element("span");
      div1 = element("div");
      div0 = element("div");
      t4 = text(t4_value);
      t5 = space();
      video0 = element("video");
      video0.innerHTML = `<track default="" kind="captions" srclang="en"/>`;
      t6 = space();
      span2 = element("span");
      div3 = element("div");
      div2 = element("div");
      t7 = space();
      video1_1 = element("video");
      video1_1.innerHTML = `<track default="" kind="captions" srclang="en" src="/media/examples/friday.vtt"/>`;
      t8 = space();
      section = element("section");
      input = element("input");
      t9 = space();
      label = element("label");
      label.textContent = "Include audio (supported in Chrome 49 and above)";
      t11 = space();
      div5 = element("div");
      a1 = element("a");
      t12 = text("Подключиться");
      t13 = space();
      button0 = element("button");
      button0.textContent = "Start";
      t15 = space();
      button1 = element("button");
      button1.textContent = "Call";
      t17 = space();
      button2 = element("button");
      button2.textContent = "Insert relay";
      t19 = space();
      button3 = element("button");
      button3.textContent = "Hang Up";
      t21 = space();
      div6 = element("div");
      attr(div0, "class", "you svelte-1sqiq7");
      video0.playsInline = true;
      video0.autoplay = true;
      video0.controls = true;
      attr(video0, "class", "svelte-1sqiq7");
      attr(div1, "class", "youCont svelte-1sqiq7");
      attr(span1, "class", "svelte-1sqiq7");
      attr(div2, "class", "video2Name svelte-1sqiq7");
      video1_1.playsInline = true;
      video1_1.autoplay = true;
      attr(video1_1, "class", "svelte-1sqiq7");
      attr(div3, "class", "video2Cont svelte-1sqiq7");
      attr(span2, "class", "svelte-1sqiq7");
      attr(div4, "class", "videos svelte-1sqiq7");
      attr(input, "type", "checkbox");
      attr(label, "for", "audio");
      attr(a1, "target", "_blank");
      attr(
        a1,
        "href",
        /*botUrl*/
        ctx[0]
      );
      button1.disabled = "";
      button2.disabled = "";
      button3.disabled = "";
      attr(div5, "id", "buttons");
      attr(div7, "id", "container");
    },
    m(target, anchor) {
      insert(target, main, anchor);
      append(main, div7);
      append(div7, h1);
      append(div7, t3);
      append(div7, div4);
      append(div4, span1);
      append(span1, div1);
      append(div1, div0);
      append(div0, t4);
      append(div1, t5);
      append(div1, video0);
      ctx[11](video0);
      append(div4, t6);
      append(div4, span2);
      append(span2, div3);
      append(div3, div2);
      append(div3, t7);
      append(div3, video1_1);
      ctx[12](video1_1);
      append(div7, t8);
      append(div7, section);
      append(section, input);
      ctx[13](input);
      append(section, t9);
      append(section, label);
      append(div7, t11);
      append(div7, div5);
      append(div5, a1);
      append(a1, t12);
      ctx[14](a1);
      append(div5, t13);
      append(div5, button0);
      ctx[15](button0);
      append(div5, t15);
      append(div5, button1);
      ctx[16](button1);
      append(div5, t17);
      append(div5, button2);
      ctx[17](button2);
      append(div5, t19);
      append(div5, button3);
      ctx[18](button3);
      append(div7, t21);
      append(div7, div6);
      ctx[19](div6);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*User*/
      2 && t4_value !== (t4_value = /*User*/
      (ctx2[1] ? (
        /*User*/
        ctx2[1].username
      ) : "") + ""))
        set_data(t4, t4_value);
      if (dirty[0] & /*botUrl*/
      1) {
        attr(
          a1,
          "href",
          /*botUrl*/
          ctx2[0]
        );
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(main);
      }
      ctx[11](null);
      ctx[12](null);
      ctx[13](null);
      ctx[14](null);
      ctx[15](null);
      ctx[16](null);
      ctx[17](null);
      ctx[18](null);
      ctx[19](null);
    }
  };
}
function base64ToBytes(base64) {
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => m.codePointAt(0));
}
function instance($$self, $$props, $$invalidate) {
  let pipe, tmInt2, botUrl, User2;
  let video1, video2, startJoin, startButton, callButton, insertRelayButton, hangupButton, statusDiv, audioCheckbox;
  const fUrl = new URL(location.href);
  const b64 = fUrl.searchParams.get("call");
  const sdp = b64 ? new TextDecoder().decode(base64ToBytes(b64)) : "";
  onMount(() => {
    $$invalidate(5, startButton.onclick = start, startButton);
    $$invalidate(6, callButton.onclick = call, callButton);
    $$invalidate(7, insertRelayButton.onclick = insertRelay, insertRelayButton);
    $$invalidate(8, hangupButton.onclick = hangup, hangupButton);
    $$invalidate(5, startButton.disabled = true, startButton);
    $$invalidate(6, callButton.disabled = true, callButton);
    $$invalidate(7, insertRelayButton.disabled = true, insertRelayButton);
    $$invalidate(8, hangupButton.disabled = true, hangupButton);
    $$invalidate(0, botUrl = Telegram.getStart());
    $$invalidate(4, startJoin.onclick = join, startJoin);
  });
  async function join() {
    $$invalidate(1, User2 = await Telegram.sendStart());
    console.log("join", User2);
    if (User2) {
      $$invalidate(5, startButton.disabled = false, startButton);
    }
  }
  const pipes = [];
  let localStream;
  let remoteStream;
  function gotremoteStream(stream) {
    remoteStream = stream;
    $$invalidate(3, video2.srcObject = stream, video2);
    debugger;
    console.log("Received remote stream");
    console.log(`${pipes.length} element(s) in chain`);
    $$invalidate(9, statusDiv.textContent = `${pipes.length} element(s) in chain`, statusDiv);
    $$invalidate(7, insertRelayButton.disabled = false, insertRelayButton);
  }
  async function start() {
    console.log("Requesting local stream");
    $$invalidate(5, startButton.disabled = true, startButton);
    const options = audioCheckbox.checked ? { audio: true, video: true } : { audio: false, video: true };
    const stream = await navigator.mediaDevices.getUserMedia(options);
    $$invalidate(2, video1.srcObject = stream, video1);
    localStream = stream;
    new VideoPipe(localStream, gotremoteStream, sdp);
    $$invalidate(6, callButton.disabled = false, callButton);
  }
  function call() {
    $$invalidate(6, callButton.disabled = true, callButton);
    $$invalidate(7, insertRelayButton.disabled = false, insertRelayButton);
    $$invalidate(8, hangupButton.disabled = false, hangupButton);
    console.log("Starting call");
    pipe = new VideoPipe(localStream, gotremoteStream);
    pipes.push(pipe);
    tmInt2 = window.setInterval(
      async () => {
        let ready = await pipe.getRemote();
        if (ready) {
          debugger;
          clearInterval(tmInt2);
          if (sdp) {
            debugger;
          }
        }
        console.log("setInterval", ready, tmInt2);
      },
      // console.log('setInterval', ready, tmInt, wProxy.closed);
      5e3
    );
  }
  function insertRelay() {
    pipes.push(new VideoPipe(remoteStream, gotremoteStream));
    $$invalidate(7, insertRelayButton.disabled = true, insertRelayButton);
  }
  function hangup() {
    console.log("Ending call");
    while (pipes.length > 0) {
      const pipe2 = pipes.pop();
      pipe2.close();
    }
    $$invalidate(9, statusDiv.textContent = `${pipes.length} element(s) in chain`, statusDiv);
    $$invalidate(7, insertRelayButton.disabled = true, insertRelayButton);
    $$invalidate(8, hangupButton.disabled = true, hangupButton);
    $$invalidate(6, callButton.disabled = false, callButton);
  }
  function video0_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      video1 = $$value;
      $$invalidate(2, video1);
    });
  }
  function video1_1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      video2 = $$value;
      $$invalidate(3, video2);
    });
  }
  function input_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      audioCheckbox = $$value;
      $$invalidate(10, audioCheckbox);
    });
  }
  function a1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      startJoin = $$value;
      $$invalidate(4, startJoin);
    });
  }
  function button0_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      startButton = $$value;
      $$invalidate(5, startButton);
    });
  }
  function button1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      callButton = $$value;
      $$invalidate(6, callButton);
    });
  }
  function button2_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      insertRelayButton = $$value;
      $$invalidate(7, insertRelayButton);
    });
  }
  function button3_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      hangupButton = $$value;
      $$invalidate(8, hangupButton);
    });
  }
  function div6_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      statusDiv = $$value;
      $$invalidate(9, statusDiv);
    });
  }
  return [
    botUrl,
    User2,
    video1,
    video2,
    startJoin,
    startButton,
    callButton,
    insertRelayButton,
    hangupButton,
    statusDiv,
    audioCheckbox,
    video0_binding,
    video1_1_binding,
    input_binding,
    a1_binding,
    button0_binding,
    button1_binding,
    button2_binding,
    button3_binding,
    div6_binding
  ];
}
class App extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1]);
  }
}
new App({
  target: document.getElementById("app")
});
