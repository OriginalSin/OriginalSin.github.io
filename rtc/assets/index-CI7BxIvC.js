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
function create_fragment(ctx) {
  let main;
  let div3;
  let div0;
  let button0;
  let t1;
  let button1;
  let t3;
  let div1;
  let label;
  let t4;
  let input;
  let t5;
  let button2;
  let t7;
  let div2;
  return {
    c() {
      main = element("main");
      div3 = element("div");
      div0 = element("div");
      button0 = element("button");
      button0.textContent = "Connect";
      t1 = space();
      button1 = element("button");
      button1.textContent = "Disconnect";
      t3 = space();
      div1 = element("div");
      label = element("label");
      t4 = text("Enter a message:\n      ");
      input = element("input");
      t5 = space();
      button2 = element("button");
      button2.textContent = "Send";
      t7 = space();
      div2 = element("div");
      div2.innerHTML = `<p>Messages received:</p>`;
      attr(button0, "name", "connectButton");
      attr(button0, "class", "buttonleft");
      attr(button1, "name", "disconnectButton");
      attr(button1, "class", "buttonright");
      button1.disabled = true;
      attr(div0, "class", "controlbox");
      attr(input, "type", "text");
      attr(input, "name", "message");
      attr(input, "placeholder", "Message text");
      attr(input, "inputmode", "latin");
      attr(input, "size", "60");
      attr(input, "maxlength", "120");
      input.disabled = true;
      attr(label, "for", "message");
      attr(button2, "name", "sendButton");
      attr(button2, "class", "buttonright");
      button2.disabled = true;
      attr(div1, "class", "messagebox");
      attr(div2, "class", "messagebox");
      attr(div3, "id", "container");
    },
    m(target, anchor) {
      insert(target, main, anchor);
      append(main, div3);
      append(div3, div0);
      append(div0, button0);
      ctx[5](button0);
      append(div0, t1);
      append(div0, button1);
      ctx[6](button1);
      append(div3, t3);
      append(div3, div1);
      append(div1, label);
      append(label, t4);
      append(label, input);
      ctx[7](input);
      append(div1, t5);
      append(div1, button2);
      ctx[8](button2);
      append(div3, t7);
      append(div3, div2);
      ctx[9](div2);
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(main);
      }
      ctx[5](null);
      ctx[6](null);
      ctx[7](null);
      ctx[8](null);
      ctx[9](null);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  const PC_CONFIG = {
    "iceServers": [{ "url": "stun:stun.l.google.com:19302" }]
  };
  const PC_CONSTRAINTS = {
    "optional": [{ "DtlsSrtpKeyAgreement": true }]
  };
  let connectButton, disconnectButton, sendButton;
  let messageInputBox, receiveBox;
  let sCh, rCh;
  let lCn, rCn;
  let lcAtempt = 1, rcAtempt = 1;
  onMount(() => {
    connectButton.addEventListener(
      "click",
      (ev) => {
        if (lCn)
          return;
        connectButton.classList.add("progress");
        connectPeers();
      },
      false
    );
    disconnectButton.addEventListener("click", disconnectPeers, false);
    sendButton.addEventListener("click", sendMessage, false);
  });
  const connectPeers = async () => {
    lCn = new RTCPeerConnection(PC_CONFIG, PC_CONSTRAINTS);
    sCh = lCn.createDataChannel("sendChannel");
    sCh.onopen = handleSendChannelStatusChange;
    sCh.onclose = handleSendChannelStatusChange;
    rCn = new RTCPeerConnection(PC_CONFIG, PC_CONSTRAINTS);
    rCn.ondatachannel = receiveChannelCallback;
    lCn.onicecandidate = async (e) => {
      const ec = e.candidate;
      if (!ec)
        return true;
      await rCn.addIceCandidate(ec).catch((err) => {
        if (!rCn.localDescription)
          return;
        if (lcAtempt < 10) {
          disconnectPeers();
          connectPeers();
        } else {
          handleAddCandidateError(err, "l", ec);
        }
      });
    };
    rCn.onicecandidate = async (e) => {
      const ec = e.candidate;
      if (!ec)
        return true;
      const { address, port, protocol, foundation, priority, component } = ec;
      await lCn.addIceCandidate(ec).catch((err) => {
        console.log("remote:", address, port, protocol, foundation, priority, component);
        if (rcAtempt < 10) {
          disconnectPeers();
          connectPeers();
        } else {
          handleAddCandidateError(err, "r", ec);
        }
      });
    };
    lCn.createOffer().then((offer) => {
      const ret = lCn.setLocalDescription(offer);
      return ret;
    }).then(
      () => {
        const ld = lCn.localDescription;
        const ret = rCn.setRemoteDescription(ld);
        return ret;
      }
    ).then(() => {
      const ret = rCn.createAnswer();
      return ret;
    }).then(
      (answer) => {
        const ret = rCn.setLocalDescription(answer);
        return ret;
      }
      // return rCn.setLocalDescription(answer);
    ).then(() => {
      const ld = rCn.localDescription;
      const ret = lCn.setRemoteDescription(ld);
      return ret;
    }).catch(
      handleCreateDescriptionError
    );
  };
  const receiveChannelCallback = (event) => {
    rCh = event.channel;
    rCh.onmessage = handleReceiveMessage;
    rCh.onopen = handleReceiveChannelStatusChange;
    rCh.onclose = handleReceiveChannelStatusChange;
  };
  const handleReceiveChannelStatusChange = (event) => {
    if (rCh) {
      console.warn("Receive channel's status has changed to ", rCh.readyState, "Atempts:", lcAtempt, rcAtempt);
      if (rCh.readyState === "open")
        rcAtempt = 1;
    }
  };
  const handleReceiveMessage = (event) => {
    var el = document.createElement("p");
    var txtNode = document.createTextNode(event.data);
    el.appendChild(txtNode);
    receiveBox.appendChild(el);
  };
  const handleSendChannelStatusChange = (event) => {
    if (sCh) {
      var state = sCh.readyState;
      if (state === "open") {
        $$invalidate(3, messageInputBox.disabled = false, messageInputBox);
        messageInputBox.focus();
        $$invalidate(2, sendButton.disabled = false, sendButton);
        $$invalidate(1, disconnectButton.disabled = false, disconnectButton);
        connectButton.classList.remove("progress");
        $$invalidate(0, connectButton.disabled = true, connectButton);
      } else {
        $$invalidate(3, messageInputBox.disabled = true, messageInputBox);
        $$invalidate(2, sendButton.disabled = true, sendButton);
        connectButton.classList.remove("progress");
        $$invalidate(0, connectButton.disabled = false, connectButton);
        $$invalidate(1, disconnectButton.disabled = true, disconnectButton);
      }
    }
  };
  const sendMessage = () => {
    var message = messageInputBox.value;
    sCh.send(message);
    $$invalidate(3, messageInputBox.value = "", messageInputBox);
    messageInputBox.focus();
  };
  const disconnectPeers = () => {
    sCh.close();
    if (rCh)
      rCh.close();
    lCn.close();
    rCn.close();
    sCh = null;
    rCh = null;
    lCn = null;
    rCn = null;
    connectButton.classList.remove("progress");
    $$invalidate(0, connectButton.disabled = false, connectButton);
    $$invalidate(1, disconnectButton.disabled = true, disconnectButton);
    $$invalidate(2, sendButton.disabled = true, sendButton);
    $$invalidate(3, messageInputBox.value = "", messageInputBox);
    $$invalidate(3, messageInputBox.disabled = true, messageInputBox);
  };
  const handleCreateDescriptionError = (error) => {
    console.log("Unable to create an offer: " + error.toString());
    lcAtempt++;
    rcAtempt++;
  };
  const handleAddCandidateError = (err, f, p) => {
    console.error("Oh noes! addICECandidate failed!", err, f, p);
  };
  function button0_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      connectButton = $$value;
      $$invalidate(0, connectButton);
    });
  }
  function button1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      disconnectButton = $$value;
      $$invalidate(1, disconnectButton);
    });
  }
  function input_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      messageInputBox = $$value;
      $$invalidate(3, messageInputBox);
    });
  }
  function button2_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      sendButton = $$value;
      $$invalidate(2, sendButton);
    });
  }
  function div2_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      receiveBox = $$value;
      $$invalidate(4, receiveBox);
    });
  }
  return [
    connectButton,
    disconnectButton,
    sendButton,
    messageInputBox,
    receiveBox,
    button0_binding,
    button1_binding,
    input_binding,
    button2_binding,
    div2_binding
  ];
}
class AppTC extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {});
  }
}
new AppTC({
  target: document.getElementById("app")
});
