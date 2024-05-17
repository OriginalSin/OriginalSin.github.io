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
let src_url_equal_anchor;
function src_url_equal(element_src, url) {
  if (element_src === url)
    return true;
  if (!src_url_equal_anchor) {
    src_url_equal_anchor = document.createElement("a");
  }
  src_url_equal_anchor.href = url;
  return element_src === src_url_equal_anchor.href;
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
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
  return function(event) {
    event.preventDefault();
    return fn.call(this, event);
  };
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
function set_input_value(input, value) {
  input.value = value == null ? "" : value;
}
let current_component;
function set_current_component(component) {
  current_component = component;
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
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var DetectRTC$1 = { exports: {} };
(function(module) {
  (function() {
    var browserFakeUserAgent = "Fake/5.0 (FakeOS) AppleWebKit/123 (KHTML, like Gecko) Fake/12.3.4567.89 Fake/123.45";
    var isNodejs = typeof process === "object" && typeof process.versions === "object" && process.versions.node && /*node-process*/
    !process.browser;
    if (isNodejs) {
      var version = process.versions.node.toString().replace("v", "");
      browserFakeUserAgent = "Nodejs/" + version + " (NodeOS) AppleWebKit/" + version + " (KHTML, like Gecko) Nodejs/" + version + " Nodejs/" + version;
    }
    (function(that) {
      if (typeof window !== "undefined") {
        return;
      }
      if (typeof window === "undefined" && typeof commonjsGlobal !== "undefined") {
        commonjsGlobal.navigator = {
          userAgent: browserFakeUserAgent,
          getUserMedia: function() {
          }
        };
        that.window = commonjsGlobal;
      }
      if (typeof location === "undefined") {
        that.location = {
          protocol: "file:",
          href: "",
          hash: ""
        };
      }
      if (typeof screen === "undefined") {
        that.screen = {
          width: 0,
          height: 0
        };
      }
    })(typeof commonjsGlobal !== "undefined" ? commonjsGlobal : window);
    var navigator2 = window.navigator;
    if (typeof navigator2 !== "undefined") {
      if (typeof navigator2.webkitGetUserMedia !== "undefined") {
        navigator2.getUserMedia = navigator2.webkitGetUserMedia;
      }
      if (typeof navigator2.mozGetUserMedia !== "undefined") {
        navigator2.getUserMedia = navigator2.mozGetUserMedia;
      }
    } else {
      navigator2 = {
        getUserMedia: function() {
        },
        userAgent: browserFakeUserAgent
      };
    }
    var isMobileDevice = !!/Android|webOS|iPhone|iPad|iPod|BB10|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(navigator2.userAgent || "");
    var isEdge = navigator2.userAgent.indexOf("Edge") !== -1 && (!!navigator2.msSaveOrOpenBlob || !!navigator2.msSaveBlob);
    var isOpera = !!window.opera || navigator2.userAgent.indexOf(" OPR/") >= 0;
    var isFirefox = navigator2.userAgent.toLowerCase().indexOf("firefox") > -1 && "netscape" in window && / rv:/.test(navigator2.userAgent);
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator2.userAgent);
    var isChrome = !!window.chrome && !isOpera;
    var isIE = typeof document !== "undefined" && !!document.documentMode && !isEdge;
    function getBrowserInfo() {
      navigator2.appVersion;
      var nAgt = navigator2.userAgent;
      var browserName = navigator2.appName;
      var fullVersion = "" + parseFloat(navigator2.appVersion);
      var majorVersion = parseInt(navigator2.appVersion, 10);
      var nameOffset, verOffset, ix;
      if (isOpera) {
        browserName = "Opera";
        try {
          fullVersion = navigator2.userAgent.split("OPR/")[1].split(" ")[0];
          majorVersion = fullVersion.split(".")[0];
        } catch (e) {
          fullVersion = "0.0.0.0";
          majorVersion = 0;
        }
      } else if (isIE) {
        verOffset = nAgt.indexOf("rv:");
        if (verOffset > 0) {
          fullVersion = nAgt.substring(verOffset + 3);
        } else {
          verOffset = nAgt.indexOf("MSIE");
          fullVersion = nAgt.substring(verOffset + 5);
        }
        browserName = "IE";
      } else if (isChrome) {
        verOffset = nAgt.indexOf("Chrome");
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset + 7);
      } else if (isSafari) {
        if (nAgt.indexOf("CriOS") !== -1) {
          verOffset = nAgt.indexOf("CriOS");
          browserName = "Chrome";
          fullVersion = nAgt.substring(verOffset + 6);
        } else if (nAgt.indexOf("FxiOS") !== -1) {
          verOffset = nAgt.indexOf("FxiOS");
          browserName = "Firefox";
          fullVersion = nAgt.substring(verOffset + 6);
        } else {
          verOffset = nAgt.indexOf("Safari");
          browserName = "Safari";
          fullVersion = nAgt.substring(verOffset + 7);
          if ((verOffset = nAgt.indexOf("Version")) !== -1) {
            fullVersion = nAgt.substring(verOffset + 8);
          }
          if (navigator2.userAgent.indexOf("Version/") !== -1) {
            fullVersion = navigator2.userAgent.split("Version/")[1].split(" ")[0];
          }
        }
      } else if (isFirefox) {
        verOffset = nAgt.indexOf("Firefox");
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset + 8);
      } else if ((nameOffset = nAgt.lastIndexOf(" ") + 1) < (verOffset = nAgt.lastIndexOf("/"))) {
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() === browserName.toUpperCase()) {
          browserName = navigator2.appName;
        }
      }
      if (isEdge) {
        browserName = "Edge";
        fullVersion = navigator2.userAgent.split("Edge/")[1];
      }
      if ((ix = fullVersion.search(/[; \)]/)) !== -1) {
        fullVersion = fullVersion.substring(0, ix);
      }
      majorVersion = parseInt("" + fullVersion, 10);
      if (isNaN(majorVersion)) {
        fullVersion = "" + parseFloat(navigator2.appVersion);
        majorVersion = parseInt(navigator2.appVersion, 10);
      }
      return {
        fullVersion,
        version: majorVersion,
        name: browserName,
        isPrivateBrowsing: false
      };
    }
    function retry(isDone, next) {
      var currentTrial = 0, maxRetry = 50, isTimeout = false;
      var id = window.setInterval(
        function() {
          if (isDone()) {
            window.clearInterval(id);
            next(isTimeout);
          }
          if (currentTrial++ > maxRetry) {
            window.clearInterval(id);
            isTimeout = true;
            next(isTimeout);
          }
        },
        10
      );
    }
    function isIE10OrLater(userAgent) {
      var ua = userAgent.toLowerCase();
      if (ua.indexOf("msie") === 0 && ua.indexOf("trident") === 0) {
        return false;
      }
      var match = /(?:msie|rv:)\s?([\d\.]+)/.exec(ua);
      if (match && parseInt(match[1], 10) >= 10) {
        return true;
      }
      return false;
    }
    function detectPrivateMode(callback) {
      var isPrivate;
      try {
        if (window.webkitRequestFileSystem) {
          window.webkitRequestFileSystem(
            window.TEMPORARY,
            1,
            function() {
              isPrivate = false;
            },
            function(e) {
              isPrivate = true;
            }
          );
        } else if (window.indexedDB && /Firefox/.test(window.navigator.userAgent)) {
          var db;
          try {
            db = window.indexedDB.open("test");
            db.onerror = function() {
              return true;
            };
          } catch (e) {
            isPrivate = true;
          }
          if (typeof isPrivate === "undefined") {
            retry(
              function isDone() {
                return db.readyState === "done" ? true : false;
              },
              function next(isTimeout) {
                if (!isTimeout) {
                  isPrivate = db.result ? false : true;
                }
              }
            );
          }
        } else if (isIE10OrLater(window.navigator.userAgent)) {
          isPrivate = false;
          try {
            if (!window.indexedDB) {
              isPrivate = true;
            }
          } catch (e) {
            isPrivate = true;
          }
        } else if (window.localStorage && /Safari/.test(window.navigator.userAgent)) {
          try {
            window.localStorage.setItem("test", 1);
          } catch (e) {
            isPrivate = true;
          }
          if (typeof isPrivate === "undefined") {
            isPrivate = false;
            window.localStorage.removeItem("test");
          }
        }
      } catch (e) {
        isPrivate = false;
      }
      retry(
        function isDone() {
          return typeof isPrivate !== "undefined" ? true : false;
        },
        function next(isTimeout) {
          callback(isPrivate);
        }
      );
    }
    var isMobile = {
      Android: function() {
        return navigator2.userAgent.match(/Android/i);
      },
      BlackBerry: function() {
        return navigator2.userAgent.match(/BlackBerry|BB10/i);
      },
      iOS: function() {
        return navigator2.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function() {
        return navigator2.userAgent.match(/Opera Mini/i);
      },
      Windows: function() {
        return navigator2.userAgent.match(/IEMobile/i);
      },
      any: function() {
        return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
      },
      getOsName: function() {
        var osName2 = "Unknown OS";
        if (isMobile.Android()) {
          osName2 = "Android";
        }
        if (isMobile.BlackBerry()) {
          osName2 = "BlackBerry";
        }
        if (isMobile.iOS()) {
          osName2 = "iOS";
        }
        if (isMobile.Opera()) {
          osName2 = "Opera Mini";
        }
        if (isMobile.Windows()) {
          osName2 = "Windows";
        }
        return osName2;
      }
    };
    function detectDesktopOS() {
      var unknown = "-";
      var nVer = navigator2.appVersion;
      var nAgt = navigator2.userAgent;
      var os = unknown;
      var clientStrings = [{
        s: "Chrome OS",
        r: /CrOS/
      }, {
        s: "Windows 10",
        r: /(Windows 10.0|Windows NT 10.0)/
      }, {
        s: "Windows 8.1",
        r: /(Windows 8.1|Windows NT 6.3)/
      }, {
        s: "Windows 8",
        r: /(Windows 8|Windows NT 6.2)/
      }, {
        s: "Windows 7",
        r: /(Windows 7|Windows NT 6.1)/
      }, {
        s: "Windows Vista",
        r: /Windows NT 6.0/
      }, {
        s: "Windows Server 2003",
        r: /Windows NT 5.2/
      }, {
        s: "Windows XP",
        r: /(Windows NT 5.1|Windows XP)/
      }, {
        s: "Windows 2000",
        r: /(Windows NT 5.0|Windows 2000)/
      }, {
        s: "Windows ME",
        r: /(Win 9x 4.90|Windows ME)/
      }, {
        s: "Windows 98",
        r: /(Windows 98|Win98)/
      }, {
        s: "Windows 95",
        r: /(Windows 95|Win95|Windows_95)/
      }, {
        s: "Windows NT 4.0",
        r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/
      }, {
        s: "Windows CE",
        r: /Windows CE/
      }, {
        s: "Windows 3.11",
        r: /Win16/
      }, {
        s: "Android",
        r: /Android/
      }, {
        s: "Open BSD",
        r: /OpenBSD/
      }, {
        s: "Sun OS",
        r: /SunOS/
      }, {
        s: "Linux",
        r: /(Linux|X11)/
      }, {
        s: "iOS",
        r: /(iPhone|iPad|iPod)/
      }, {
        s: "Mac OS X",
        r: /Mac OS X/
      }, {
        s: "Mac OS",
        r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
      }, {
        s: "QNX",
        r: /QNX/
      }, {
        s: "UNIX",
        r: /UNIX/
      }, {
        s: "BeOS",
        r: /BeOS/
      }, {
        s: "OS/2",
        r: /OS\/2/
      }, {
        s: "Search Bot",
        r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
      }];
      for (var i = 0, cs; cs = clientStrings[i]; i++) {
        if (cs.r.test(nAgt)) {
          os = cs.s;
          break;
        }
      }
      var osVersion2 = unknown;
      if (/Windows/.test(os)) {
        if (/Windows (.*)/.test(os)) {
          osVersion2 = /Windows (.*)/.exec(os)[1];
        }
        os = "Windows";
      }
      switch (os) {
        case "Mac OS X":
          if (/Mac OS X (10[\.\_\d]+)/.test(nAgt)) {
            osVersion2 = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
          }
          break;
        case "Android":
          if (/Android ([\.\_\d]+)/.test(nAgt)) {
            osVersion2 = /Android ([\.\_\d]+)/.exec(nAgt)[1];
          }
          break;
        case "iOS":
          if (/OS (\d+)_(\d+)_?(\d+)?/.test(nAgt)) {
            osVersion2 = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
            if (osVersion2 && osVersion2.length > 3) {
              osVersion2 = osVersion2[1] + "." + osVersion2[2] + "." + (osVersion2[3] | 0);
            }
          }
          break;
      }
      return {
        osName: os,
        osVersion: osVersion2
      };
    }
    var osName = "Unknown OS";
    var osVersion = "Unknown OS Version";
    function getAndroidVersion(ua) {
      ua = (ua || navigator2.userAgent).toLowerCase();
      var match = ua.match(/android\s([0-9\.]*)/);
      return match ? match[1] : false;
    }
    var osInfo = detectDesktopOS();
    if (osInfo && osInfo.osName && osInfo.osName != "-") {
      osName = osInfo.osName;
      osVersion = osInfo.osVersion;
    } else if (isMobile.any()) {
      osName = isMobile.getOsName();
      if (osName == "Android") {
        osVersion = getAndroidVersion();
      }
    }
    var isNodejs = typeof process === "object" && typeof process.versions === "object" && process.versions.node;
    if (osName === "Unknown OS" && isNodejs) {
      osName = "Nodejs";
      osVersion = process.versions.node.toString().replace("v", "");
    }
    var isCanvasSupportsStreamCapturing = false;
    var isVideoSupportsStreamCapturing = false;
    ["captureStream", "mozCaptureStream", "webkitCaptureStream"].forEach(function(item) {
      if (typeof document === "undefined" || typeof document.createElement !== "function") {
        return;
      }
      if (!isCanvasSupportsStreamCapturing && item in document.createElement("canvas")) {
        isCanvasSupportsStreamCapturing = true;
      }
      if (!isVideoSupportsStreamCapturing && item in document.createElement("video")) {
        isVideoSupportsStreamCapturing = true;
      }
    });
    var regexIpv4Local = /^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/, regexIpv4 = /([0-9]{1,3}(\.[0-9]{1,3}){3})/, regexIpv6 = /[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7}/;
    function DetectLocalIPAddress(callback, stream) {
      if (!DetectRTC2.isWebRTCSupported) {
        return;
      }
      var isPublic = true, isIpv4 = true;
      getIPs(function(ip) {
        if (!ip) {
          callback();
        } else if (ip.match(regexIpv4Local)) {
          isPublic = false;
          callback("Local: " + ip, isPublic, isIpv4);
        } else if (ip.match(regexIpv6)) {
          isIpv4 = false;
          callback("Public: " + ip, isPublic, isIpv4);
        } else {
          callback("Public: " + ip, isPublic, isIpv4);
        }
      }, stream);
    }
    function getIPs(callback, stream) {
      if (typeof document === "undefined" || typeof document.getElementById !== "function") {
        return;
      }
      var ipDuplicates = {};
      var RTCPeerConnection2 = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
      if (!RTCPeerConnection2) {
        var iframe = document.getElementById("iframe");
        if (!iframe) {
          return;
        }
        var win = iframe.contentWindow;
        RTCPeerConnection2 = win.RTCPeerConnection || win.mozRTCPeerConnection || win.webkitRTCPeerConnection;
      }
      if (!RTCPeerConnection2) {
        return;
      }
      var peerConfig = null;
      if (DetectRTC2.browser === "Chrome" && DetectRTC2.browser.version < 58) {
        peerConfig = {
          optional: [{
            RtpDataChannels: true
          }]
        };
      }
      var servers = {
        iceServers: [{
          urls: "stun:stun.l.google.com:19302"
        }]
      };
      var pc = new RTCPeerConnection2(servers, peerConfig);
      if (stream) {
        if (pc.addStream) {
          pc.addStream(stream);
        } else if (pc.addTrack && stream.getTracks()[0]) {
          pc.addTrack(stream.getTracks()[0], stream);
        }
      }
      function handleCandidate(candidate) {
        if (!candidate) {
          callback();
          return;
        }
        var match = regexIpv4.exec(candidate);
        if (!match) {
          return;
        }
        var ipAddress = match[1];
        var isPublic = candidate.match(regexIpv4Local), isIpv4 = true;
        if (ipDuplicates[ipAddress] === void 0) {
          callback(ipAddress, isPublic, isIpv4);
        }
        ipDuplicates[ipAddress] = true;
      }
      pc.onicecandidate = function(event) {
        if (event.candidate && event.candidate.candidate) {
          handleCandidate(event.candidate.candidate);
        } else {
          handleCandidate();
        }
      };
      if (!stream) {
        try {
          pc.createDataChannel("sctp", {});
        } catch (e) {
        }
      }
      if (DetectRTC2.isPromisesSupported) {
        pc.createOffer().then(function(result) {
          pc.setLocalDescription(result).then(afterCreateOffer);
        });
      } else {
        pc.createOffer(function(result) {
          pc.setLocalDescription(result, afterCreateOffer, function() {
          });
        }, function() {
        });
      }
      function afterCreateOffer() {
        var lines = pc.localDescription.sdp.split("\n");
        lines.forEach(function(line) {
          if (line && line.indexOf("a=candidate:") === 0) {
            handleCandidate(line);
          }
        });
      }
    }
    var MediaDevices = [];
    var audioInputDevices = [];
    var audioOutputDevices = [];
    var videoInputDevices = [];
    if (navigator2.mediaDevices && navigator2.mediaDevices.enumerateDevices) {
      navigator2.enumerateDevices = function(callback) {
        var enumerateDevices = navigator2.mediaDevices.enumerateDevices();
        if (enumerateDevices && enumerateDevices.then) {
          navigator2.mediaDevices.enumerateDevices().then(callback).catch(function() {
            callback([]);
          });
        } else {
          callback([]);
        }
      };
    }
    var canEnumerate = false;
    if (typeof MediaStreamTrack !== "undefined" && "getSources" in MediaStreamTrack) {
      canEnumerate = true;
    } else if (navigator2.mediaDevices && !!navigator2.mediaDevices.enumerateDevices) {
      canEnumerate = true;
    }
    var hasMicrophone = false;
    var hasSpeakers = false;
    var hasWebcam = false;
    var isWebsiteHasMicrophonePermissions = false;
    var isWebsiteHasWebcamPermissions = false;
    function checkDeviceSupport(callback) {
      if (!canEnumerate) {
        if (callback) {
          callback();
        }
        return;
      }
      if (!navigator2.enumerateDevices && window.MediaStreamTrack && window.MediaStreamTrack.getSources) {
        navigator2.enumerateDevices = window.MediaStreamTrack.getSources.bind(window.MediaStreamTrack);
      }
      if (!navigator2.enumerateDevices && navigator2.enumerateDevices) {
        navigator2.enumerateDevices = navigator2.enumerateDevices.bind(navigator2);
      }
      if (!navigator2.enumerateDevices) {
        if (callback) {
          callback();
        }
        return;
      }
      MediaDevices = [];
      audioInputDevices = [];
      audioOutputDevices = [];
      videoInputDevices = [];
      hasMicrophone = false;
      hasSpeakers = false;
      hasWebcam = false;
      isWebsiteHasMicrophonePermissions = false;
      isWebsiteHasWebcamPermissions = false;
      var alreadyUsedDevices = {};
      navigator2.enumerateDevices(function(devices) {
        MediaDevices = [];
        audioInputDevices = [];
        audioOutputDevices = [];
        videoInputDevices = [];
        devices.forEach(function(_device) {
          var device = {};
          for (var d in _device) {
            try {
              if (typeof _device[d] !== "function") {
                device[d] = _device[d];
              }
            } catch (e) {
            }
          }
          if (alreadyUsedDevices[device.deviceId + device.label + device.kind]) {
            return;
          }
          if (device.kind === "audio") {
            device.kind = "audioinput";
          }
          if (device.kind === "video") {
            device.kind = "videoinput";
          }
          if (!device.deviceId) {
            device.deviceId = device.id;
          }
          if (!device.id) {
            device.id = device.deviceId;
          }
          if (!device.label) {
            device.isCustomLabel = true;
            if (device.kind === "videoinput") {
              device.label = "Camera " + (videoInputDevices.length + 1);
            } else if (device.kind === "audioinput") {
              device.label = "Microphone " + (audioInputDevices.length + 1);
            } else if (device.kind === "audiooutput") {
              device.label = "Speaker " + (audioOutputDevices.length + 1);
            } else {
              device.label = "Please invoke getUserMedia once.";
            }
            if (typeof DetectRTC2 !== "undefined" && DetectRTC2.browser.isChrome && DetectRTC2.browser.version >= 46 && !/^(https:|chrome-extension:)$/g.test(location.protocol || "")) {
              if (typeof document !== "undefined" && typeof document.domain === "string" && document.domain.search && document.domain.search(/localhost|127.0./g) === -1) {
                device.label = "HTTPs is required to get label of this " + device.kind + " device.";
              }
            }
          } else {
            if (device.kind === "videoinput" && !isWebsiteHasWebcamPermissions) {
              isWebsiteHasWebcamPermissions = true;
            }
            if (device.kind === "audioinput" && !isWebsiteHasMicrophonePermissions) {
              isWebsiteHasMicrophonePermissions = true;
            }
          }
          if (device.kind === "audioinput") {
            hasMicrophone = true;
            if (audioInputDevices.indexOf(device) === -1) {
              audioInputDevices.push(device);
            }
          }
          if (device.kind === "audiooutput") {
            hasSpeakers = true;
            if (audioOutputDevices.indexOf(device) === -1) {
              audioOutputDevices.push(device);
            }
          }
          if (device.kind === "videoinput") {
            hasWebcam = true;
            if (videoInputDevices.indexOf(device) === -1) {
              videoInputDevices.push(device);
            }
          }
          MediaDevices.push(device);
          alreadyUsedDevices[device.deviceId + device.label + device.kind] = device;
        });
        if (typeof DetectRTC2 !== "undefined") {
          DetectRTC2.MediaDevices = MediaDevices;
          DetectRTC2.hasMicrophone = hasMicrophone;
          DetectRTC2.hasSpeakers = hasSpeakers;
          DetectRTC2.hasWebcam = hasWebcam;
          DetectRTC2.isWebsiteHasWebcamPermissions = isWebsiteHasWebcamPermissions;
          DetectRTC2.isWebsiteHasMicrophonePermissions = isWebsiteHasMicrophonePermissions;
          DetectRTC2.audioInputDevices = audioInputDevices;
          DetectRTC2.audioOutputDevices = audioOutputDevices;
          DetectRTC2.videoInputDevices = videoInputDevices;
        }
        if (callback) {
          callback();
        }
      });
    }
    var DetectRTC2 = window.DetectRTC || {};
    DetectRTC2.browser = getBrowserInfo();
    detectPrivateMode(function(isPrivateBrowsing) {
      DetectRTC2.browser.isPrivateBrowsing = !!isPrivateBrowsing;
    });
    DetectRTC2.browser["is" + DetectRTC2.browser.name] = true;
    DetectRTC2.osName = osName;
    DetectRTC2.osVersion = osVersion;
    typeof process === "object" && typeof process.versions === "object" && process.versions["node-webkit"];
    var isWebRTCSupported = false;
    ["RTCPeerConnection", "webkitRTCPeerConnection", "mozRTCPeerConnection", "RTCIceGatherer"].forEach(function(item) {
      if (isWebRTCSupported) {
        return;
      }
      if (item in window) {
        isWebRTCSupported = true;
      }
    });
    DetectRTC2.isWebRTCSupported = isWebRTCSupported;
    DetectRTC2.isORTCSupported = typeof RTCIceGatherer !== "undefined";
    var isScreenCapturingSupported = false;
    if (DetectRTC2.browser.isChrome && DetectRTC2.browser.version >= 35) {
      isScreenCapturingSupported = true;
    } else if (DetectRTC2.browser.isFirefox && DetectRTC2.browser.version >= 34) {
      isScreenCapturingSupported = true;
    } else if (DetectRTC2.browser.isEdge && DetectRTC2.browser.version >= 17) {
      isScreenCapturingSupported = true;
    } else if (DetectRTC2.osName === "Android" && DetectRTC2.browser.isChrome) {
      isScreenCapturingSupported = true;
    }
    if (!!navigator2.getDisplayMedia || navigator2.mediaDevices && navigator2.mediaDevices.getDisplayMedia) {
      isScreenCapturingSupported = true;
    }
    if (!/^(https:|chrome-extension:)$/g.test(location.protocol || "")) {
      var isNonLocalHost = typeof document !== "undefined" && typeof document.domain === "string" && document.domain.search && document.domain.search(/localhost|127.0./g) === -1;
      if (isNonLocalHost && (DetectRTC2.browser.isChrome || DetectRTC2.browser.isEdge || DetectRTC2.browser.isOpera)) {
        isScreenCapturingSupported = false;
      } else if (DetectRTC2.browser.isFirefox) {
        isScreenCapturingSupported = false;
      }
    }
    DetectRTC2.isScreenCapturingSupported = isScreenCapturingSupported;
    var webAudio = {
      isSupported: false,
      isCreateMediaStreamSourceSupported: false
    };
    ["AudioContext", "webkitAudioContext", "mozAudioContext", "msAudioContext"].forEach(function(item) {
      if (webAudio.isSupported) {
        return;
      }
      if (item in window) {
        webAudio.isSupported = true;
        if (window[item] && "createMediaStreamSource" in window[item].prototype) {
          webAudio.isCreateMediaStreamSourceSupported = true;
        }
      }
    });
    DetectRTC2.isAudioContextSupported = webAudio.isSupported;
    DetectRTC2.isCreateMediaStreamSourceSupported = webAudio.isCreateMediaStreamSourceSupported;
    var isRtpDataChannelsSupported = false;
    if (DetectRTC2.browser.isChrome && DetectRTC2.browser.version > 31) {
      isRtpDataChannelsSupported = true;
    }
    DetectRTC2.isRtpDataChannelsSupported = isRtpDataChannelsSupported;
    var isSCTPSupportd = false;
    if (DetectRTC2.browser.isFirefox && DetectRTC2.browser.version > 28) {
      isSCTPSupportd = true;
    } else if (DetectRTC2.browser.isChrome && DetectRTC2.browser.version > 25) {
      isSCTPSupportd = true;
    } else if (DetectRTC2.browser.isOpera && DetectRTC2.browser.version >= 11) {
      isSCTPSupportd = true;
    }
    DetectRTC2.isSctpDataChannelsSupported = isSCTPSupportd;
    DetectRTC2.isMobileDevice = isMobileDevice;
    var isGetUserMediaSupported = false;
    if (navigator2.getUserMedia) {
      isGetUserMediaSupported = true;
    } else if (navigator2.mediaDevices && navigator2.mediaDevices.getUserMedia) {
      isGetUserMediaSupported = true;
    }
    if (DetectRTC2.browser.isChrome && DetectRTC2.browser.version >= 46 && !/^(https:|chrome-extension:)$/g.test(location.protocol || "")) {
      if (typeof document !== "undefined" && typeof document.domain === "string" && document.domain.search && document.domain.search(/localhost|127.0./g) === -1) {
        isGetUserMediaSupported = "Requires HTTPs";
      }
    }
    if (DetectRTC2.osName === "Nodejs") {
      isGetUserMediaSupported = false;
    }
    DetectRTC2.isGetUserMediaSupported = isGetUserMediaSupported;
    var displayResolution = "";
    if (screen.width) {
      var width = screen.width ? screen.width : "";
      var height = screen.height ? screen.height : "";
      displayResolution += "" + width + " x " + height;
    }
    DetectRTC2.displayResolution = displayResolution;
    function getAspectRatio(w, h) {
      function gcd(a, b) {
        return b == 0 ? a : gcd(b, a % b);
      }
      var r = gcd(w, h);
      return w / r / (h / r);
    }
    DetectRTC2.displayAspectRatio = getAspectRatio(screen.width, screen.height).toFixed(2);
    DetectRTC2.isCanvasSupportsStreamCapturing = isCanvasSupportsStreamCapturing;
    DetectRTC2.isVideoSupportsStreamCapturing = isVideoSupportsStreamCapturing;
    if (DetectRTC2.browser.name == "Chrome" && DetectRTC2.browser.version >= 53) {
      if (!DetectRTC2.isCanvasSupportsStreamCapturing) {
        DetectRTC2.isCanvasSupportsStreamCapturing = "Requires chrome flag: enable-experimental-web-platform-features";
      }
      if (!DetectRTC2.isVideoSupportsStreamCapturing) {
        DetectRTC2.isVideoSupportsStreamCapturing = "Requires chrome flag: enable-experimental-web-platform-features";
      }
    }
    DetectRTC2.DetectLocalIPAddress = DetectLocalIPAddress;
    DetectRTC2.isWebSocketsSupported = "WebSocket" in window && 2 === window.WebSocket.CLOSING;
    DetectRTC2.isWebSocketsBlocked = !DetectRTC2.isWebSocketsSupported;
    if (DetectRTC2.osName === "Nodejs") {
      DetectRTC2.isWebSocketsSupported = true;
      DetectRTC2.isWebSocketsBlocked = false;
    }
    DetectRTC2.checkWebSocketsSupport = function(callback) {
      callback = callback || function() {
      };
      try {
        var starttime;
        var websocket = new WebSocket("wss://echo.websocket.org:443/");
        websocket.onopen = function() {
          DetectRTC2.isWebSocketsBlocked = false;
          starttime = (/* @__PURE__ */ new Date()).getTime();
          websocket.send("ping");
        };
        websocket.onmessage = function() {
          DetectRTC2.WebsocketLatency = (/* @__PURE__ */ new Date()).getTime() - starttime + "ms";
          callback();
          websocket.close();
          websocket = null;
        };
        websocket.onerror = function() {
          DetectRTC2.isWebSocketsBlocked = true;
          callback();
        };
      } catch (e) {
        DetectRTC2.isWebSocketsBlocked = true;
        callback();
      }
    };
    DetectRTC2.load = function(callback) {
      callback = callback || function() {
      };
      checkDeviceSupport(callback);
    };
    if (typeof MediaDevices !== "undefined") {
      DetectRTC2.MediaDevices = MediaDevices;
    } else {
      DetectRTC2.MediaDevices = [];
    }
    DetectRTC2.hasMicrophone = hasMicrophone;
    DetectRTC2.hasSpeakers = hasSpeakers;
    DetectRTC2.hasWebcam = hasWebcam;
    DetectRTC2.isWebsiteHasWebcamPermissions = isWebsiteHasWebcamPermissions;
    DetectRTC2.isWebsiteHasMicrophonePermissions = isWebsiteHasMicrophonePermissions;
    DetectRTC2.audioInputDevices = audioInputDevices;
    DetectRTC2.audioOutputDevices = audioOutputDevices;
    DetectRTC2.videoInputDevices = videoInputDevices;
    var isSetSinkIdSupported = false;
    if (typeof document !== "undefined" && typeof document.createElement === "function" && "setSinkId" in document.createElement("video")) {
      isSetSinkIdSupported = true;
    }
    DetectRTC2.isSetSinkIdSupported = isSetSinkIdSupported;
    var isRTPSenderReplaceTracksSupported = false;
    if (DetectRTC2.browser.isFirefox && typeof mozRTCPeerConnection !== "undefined") {
      if ("getSenders" in mozRTCPeerConnection.prototype) {
        isRTPSenderReplaceTracksSupported = true;
      }
    } else if (DetectRTC2.browser.isChrome && typeof webkitRTCPeerConnection !== "undefined") {
      if ("getSenders" in webkitRTCPeerConnection.prototype) {
        isRTPSenderReplaceTracksSupported = true;
      }
    }
    DetectRTC2.isRTPSenderReplaceTracksSupported = isRTPSenderReplaceTracksSupported;
    var isRemoteStreamProcessingSupported = false;
    if (DetectRTC2.browser.isFirefox && DetectRTC2.browser.version > 38) {
      isRemoteStreamProcessingSupported = true;
    }
    DetectRTC2.isRemoteStreamProcessingSupported = isRemoteStreamProcessingSupported;
    var isApplyConstraintsSupported = false;
    if (typeof MediaStreamTrack !== "undefined" && "applyConstraints" in MediaStreamTrack.prototype) {
      isApplyConstraintsSupported = true;
    }
    DetectRTC2.isApplyConstraintsSupported = isApplyConstraintsSupported;
    var isMultiMonitorScreenCapturingSupported = false;
    if (DetectRTC2.browser.isFirefox && DetectRTC2.browser.version >= 43) {
      isMultiMonitorScreenCapturingSupported = true;
    }
    DetectRTC2.isMultiMonitorScreenCapturingSupported = isMultiMonitorScreenCapturingSupported;
    DetectRTC2.isPromisesSupported = !!("Promise" in window);
    DetectRTC2.version = "1.4.1";
    if (typeof DetectRTC2 === "undefined") {
      window.DetectRTC = {};
    }
    var MediaStream2 = window.MediaStream;
    if (typeof MediaStream2 === "undefined" && typeof webkitMediaStream !== "undefined") {
      MediaStream2 = webkitMediaStream;
    }
    if (typeof MediaStream2 !== "undefined" && typeof MediaStream2 === "function") {
      DetectRTC2.MediaStream = Object.keys(MediaStream2.prototype);
    } else
      DetectRTC2.MediaStream = false;
    if (typeof MediaStreamTrack !== "undefined") {
      DetectRTC2.MediaStreamTrack = Object.keys(MediaStreamTrack.prototype);
    } else
      DetectRTC2.MediaStreamTrack = false;
    var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    if (typeof RTCPeerConnection !== "undefined") {
      DetectRTC2.RTCPeerConnection = Object.keys(RTCPeerConnection.prototype);
    } else
      DetectRTC2.RTCPeerConnection = false;
    window.DetectRTC = DetectRTC2;
    {
      module.exports = DetectRTC2;
    }
  })();
})(DetectRTC$1);
var DetectRTCExports = DetectRTC$1.exports;
const DetectRTC = /* @__PURE__ */ getDefaultExportFromCjs(DetectRTCExports);
const Utils = {
  base64ToString: (b64) => {
    return b64 ? new TextDecoder().decode(Utils.base64ToBytes(b64)) : "";
  },
  base64ToBytes: (b64) => {
    const bStr = atob(b64);
    return Uint8Array.from(bStr, (m) => m.codePointAt(0));
  },
  bytesToBase64: (bytes) => {
    const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");
    return btoa(binString);
  },
  getUrlEncoded: function(pars) {
    return Object.keys(pars).map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(pars[k])).join("&");
  },
  hms: (seconds, arr = [3600, 60]) => {
    return arr.reduceRight(
      (p, b) => (r) => [Math.floor(r / b)].concat(p(r % b)),
      (r) => [r]
    )(seconds).map((a) => a.toString().padStart(2, "0")).join(":");
  },
  createNode: (opt) => {
    const { tag = "div", id, innerHTML, title, className, parentNode: parentNode2, childNode, events, style } = opt || {};
    const el = document.createElement(tag);
    if (id)
      el.id = id;
    if (style)
      el.style = style;
    if (className)
      el.className = className;
    if (innerHTML)
      el.innerHTML = innerHTML;
    if (title)
      el.title = title;
    if (events) {
      events.forEach(({ type, handleEvent }) => {
        L.DomEvent.on(el, type, handleEvent);
      });
    }
    if (childNode)
      el.appendChild(childNode);
    if (parentNode2)
      parentNode2.appendChild(el);
    return el;
  },
  delay: (timeout) => new Promise((resolve) => {
    const id = window.setTimeout(() => {
      window.clearTimeout(id);
      resolve({});
    }, timeout || 1e3);
  }),
  log_error: (text2) => {
    const time = /* @__PURE__ */ new Date();
    console.trace("[" + time.toLocaleTimeString() + "] " + Utils.gTxt(text2));
  },
  _detectRTC: void 0,
  detectRTC: () => {
    return new Promise((resolve) => {
      DetectRTC.load(() => {
        resolve(DetectRTC);
        Utils._detectRTC = DetectRTC;
      });
    });
  },
  stopTracks: (stream) => {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
  }
  // _myStreem: undefined,
  // getMediaStream: (vtype, targetStream, deviceId) => {
  //     if (targetStream === true) Utils.stopTracks(targetStream);
  //     else if (Utils._myStreem) Utils.stopTracks(Utils._myStreem);
  //     return new Promise(async (resolve, reject) => {
  //         try {
  //             const mc = RTCConfig.mediaConstraints[vtype];
  //             if (mc.video && deviceId) mc.video = {...mc.video, deviceId};
  //             let stream = vtype === 'desktop' ? 
  //                 await navigator.mediaDevices.getDisplayMedia(mc) : // получить экран
  //                 await navigator.mediaDevices.getUserMedia(mc);  // Get access to the webcam stream and attach it to the
  //             if (!targetStream) Utils._myStreem = stream;
  //             resolve(stream);
  //         } catch (err) {
  //             // resolve();
  //             reject(err);
  //         }
  //     });
  // },
  // _stopRecorder: undefined,
  // getMp4Stream: async (opt =  {}) => {  // Камера Запись/Остановка 
  //     const {stream = Utils._myStreem} = opt;
  //     if (Utils._stopRecorder) {
  //         const file = await Utils._stopRecorder();
  //         console.warn('file', file);
  //     } else {
  //         // const stream = Utils._myStreem;
  //         if (!stream) {
  //             console.warn('Нет потока');
  //             return;
  //         }
  //         Utils._stopRecorder = await Recorder({stream, ...opt});
  //     }
  // }
};
new Promise((resolve) => {
  DetectRTC.load(() => {
    resolve(DetectRTC);
  });
});
function create_else_block$1(ctx) {
  let details;
  let summary;
  let t1;
  let fieldset;
  let p0;
  let input0;
  let t2;
  let p1;
  let input1;
  let t3;
  let p2;
  let input2;
  let t4;
  let label;
  let t6;
  let div3;
  let div1;
  let p3;
  let t8;
  let div0;
  let t10;
  let p5;
  let t12;
  let p6;
  let t13;
  let video0;
  let t14;
  let video1;
  let t15;
  let div2;
  let button0;
  let t17;
  let button1;
  let t19;
  let button2;
  let t21;
  let button3;
  let t23;
  let button4;
  let t25;
  let img;
  let img_src_value;
  let t26;
  let p7;
  let textarea;
  let t27;
  let p8;
  let button5;
  let mounted;
  let dispose;
  return {
    c() {
      details = element("details");
      summary = element("summary");
      summary.textContent = "Форма контакта";
      t1 = space();
      fieldset = element("fieldset");
      p0 = element("p");
      input0 = element("input");
      t2 = space();
      p1 = element("p");
      input1 = element("input");
      t3 = space();
      p2 = element("p");
      input2 = element("input");
      t4 = space();
      label = element("label");
      label.textContent = "Включить видео комментарий";
      t6 = space();
      div3 = element("div");
      div1 = element("div");
      p3 = element("p");
      p3.textContent = "Подготовка видео ролика";
      t8 = space();
      div0 = element("div");
      div0.innerHTML = `<p class="pausedHeader">Пауза</p>`;
      t10 = space();
      p5 = element("p");
      p5.textContent = "REC";
      t12 = space();
      p6 = element("p");
      t13 = space();
      video0 = element("video");
      video0.innerHTML = `<source type="video/webm"/><track kind="captions"/>`;
      t14 = space();
      video1 = element("video");
      video1.innerHTML = `<track kind="captions"/>`;
      t15 = space();
      div2 = element("div");
      button0 = element("button");
      button0.textContent = "Записать video";
      t17 = space();
      button1 = element("button");
      button1.textContent = "Пауза";
      t19 = space();
      button2 = element("button");
      button2.textContent = "Продолжить";
      t21 = space();
      button3 = element("button");
      button3.textContent = "Просмотр";
      t23 = space();
      button4 = element("button");
      button4.textContent = "Записать заново";
      t25 = space();
      img = element("img");
      t26 = space();
      p7 = element("p");
      textarea = element("textarea");
      t27 = space();
      p8 = element("p");
      button5 = element("button");
      button5.innerHTML = `Послать <span class="forward">▶</span>`;
      attr(input0, "name", "name");
      attr(input0, "tabindex", "0");
      attr(input0, "class", "textfield svelte-1qud8zg");
      attr(input0, "type", "text");
      attr(input0, "maxlength", "100");
      attr(input0, "size", "32");
      attr(input0, "placeholder", "Ваше имя");
      input0.required = true;
      attr(p0, "class", "req svelte-1qud8zg");
      attr(input1, "name", "email");
      attr(input1, "tabindex", "0");
      attr(input1, "class", "textfield svelte-1qud8zg");
      attr(input1, "type", "email");
      attr(input1, "maxlength", "42");
      attr(input1, "placeholder", "Ваш email");
      input1.required = true;
      attr(p1, "class", "req svelte-1qud8zg");
      attr(input2, "type", "checkbox");
      attr(input2, "name", "record");
      attr(input2, "class", "svelte-1qud8zg");
      attr(label, "for", "record");
      attr(p2, "class", "checkbox");
      attr(p3, "class", "prepareVideo svelte-1qud8zg");
      attr(div0, "class", "paused svelte-1qud8zg");
      attr(p5, "class", "recordNote svelte-1qud8zg");
      attr(p6, "class", "recordTimer svelte-1qud8zg");
      attr(video0, "class", "replayVideo svelte-1qud8zg");
      video0.autoplay = true;
      video0.playsInline = true;
      video0.controls = true;
      attr(video0, "preload", "auto");
      attr(video1, "class", "userMedia svelte-1qud8zg");
      video1.playsInline = true;
      attr(div1, "class", "visuals svelte-1qud8zg");
      attr(button0, "class", "record svelte-1qud8zg");
      attr(button1, "class", "pause svelte-1qud8zg");
      attr(button2, "class", "resume svelte-1qud8zg");
      attr(button3, "class", "preview svelte-1qud8zg");
      attr(button4, "class", "recordAgain svelte-1qud8zg");
      attr(div2, "class", "buttons svelte-1qud8zg");
      attr(div3, "class", "teleMail svelte-1qud8zg");
      if (!src_url_equal(img.src, img_src_value = src))
        attr(img, "src", img_src_value);
      attr(img, "class", "playButton svelte-1qud8zg");
      attr(img, "alt", "");
      attr(textarea, "class", "textfield svelte-1qud8zg");
      attr(textarea, "tabindex", "0");
      attr(textarea, "name", "message");
      attr(textarea, "rows", "8");
      textarea.required = true;
      attr(textarea, "placeholder", "Вы можете ввести свое сообщение здесь");
      attr(p7, "class", "req svelte-1qud8zg");
      attr(button5, "class", "submit active svelte-1qud8zg");
      attr(p8, "class", "req submit svelte-1qud8zg");
      attr(fieldset, "class", "svelte-1qud8zg");
      details.open = true;
    },
    m(target, anchor) {
      insert(target, details, anchor);
      append(details, summary);
      append(details, t1);
      append(details, fieldset);
      append(fieldset, p0);
      append(p0, input0);
      set_input_value(
        input0,
        /*username*/
        ctx[0]
      );
      append(fieldset, t2);
      append(fieldset, p1);
      append(p1, input1);
      set_input_value(
        input1,
        /*email*/
        ctx[1]
      );
      append(fieldset, t3);
      append(fieldset, p2);
      append(p2, input2);
      append(p2, t4);
      append(p2, label);
      append(fieldset, t6);
      append(fieldset, div3);
      append(div3, div1);
      append(div1, p3);
      append(div1, t8);
      append(div1, div0);
      append(div1, t10);
      append(div1, p5);
      append(div1, t12);
      append(div1, p6);
      ctx[15](p6);
      append(div1, t13);
      append(div1, video0);
      ctx[16](video0);
      append(div1, t14);
      append(div1, video1);
      ctx[17](video1);
      append(div3, t15);
      append(div3, div2);
      append(div2, button0);
      append(div2, t17);
      append(div2, button1);
      append(div2, t19);
      append(div2, button2);
      append(div2, t21);
      append(div2, button3);
      append(div2, t23);
      append(div2, button4);
      ctx[22](div3);
      append(fieldset, t25);
      append(fieldset, img);
      ctx[23](img);
      append(fieldset, t26);
      append(fieldset, p7);
      append(p7, textarea);
      set_input_value(
        textarea,
        /*message*/
        ctx[2]
      );
      append(fieldset, t27);
      append(fieldset, p8);
      append(p8, button5);
      if (!mounted) {
        dispose = [
          listen(
            input0,
            "input",
            /*input0_input_handler*/
            ctx[13]
          ),
          listen(
            input1,
            "input",
            /*input1_input_handler*/
            ctx[14]
          ),
          listen(
            input2,
            "click",
            /*setMedia*/
            ctx[11]
          ),
          listen(button0, "click", prevent_default(
            /*click_handler*/
            ctx[18]
          )),
          listen(button1, "click", prevent_default(
            /*click_handler_1*/
            ctx[19]
          )),
          listen(button2, "click", prevent_default(
            /*click_handler_2*/
            ctx[20]
          )),
          listen(button3, "click", prevent_default(
            /*click_handler_3*/
            ctx[21]
          )),
          listen(button4, "click", prevent_default(
            /*recordAgain*/
            ctx[10]
          )),
          listen(
            textarea,
            "input",
            /*textarea_input_handler*/
            ctx[24]
          ),
          listen(button5, "click", prevent_default(
            /*send*/
            ctx[12]
          ))
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*username*/
      1 && input0.value !== /*username*/
      ctx2[0]) {
        set_input_value(
          input0,
          /*username*/
          ctx2[0]
        );
      }
      if (dirty[0] & /*email*/
      2 && input1.value !== /*email*/
      ctx2[1]) {
        set_input_value(
          input1,
          /*email*/
          ctx2[1]
        );
      }
      if (dirty[0] & /*message*/
      4) {
        set_input_value(
          textarea,
          /*message*/
          ctx2[2]
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(details);
      }
      ctx[15](null);
      ctx[16](null);
      ctx[17](null);
      ctx[22](null);
      ctx[23](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block$1(ctx) {
  let p;
  return {
    c() {
      p = element("p");
      p.textContent = "Форма отправлена!";
      attr(p, "class", "req svelte-1qud8zg");
    },
    m(target, anchor) {
      insert(target, p, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(p);
      }
    }
  };
}
function create_fragment$1(ctx) {
  let section;
  function select_block_type(ctx2, dirty) {
    if (
      /*mailSended*/
      ctx2[4] === "ok"
    )
      return create_if_block$1;
    return create_else_block$1;
  }
  let current_block_type = select_block_type(ctx);
  let if_block = current_block_type(ctx);
  return {
    c() {
      section = element("section");
      if_block.c();
      attr(section, "class", "contact active svelte-1qud8zg");
    },
    m(target, anchor) {
      insert(target, section, anchor);
      if_block.m(section, null);
    },
    p(ctx2, dirty) {
      if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(section, null);
        }
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(section);
      }
      if_block.d();
    }
  };
}
const src = "/img/play.png";
const host = "//moretele.ru";
function instance$1($$self, $$props, $$invalidate) {
  const sendm = host + "/sendm";
  let username, email, message, linkMp4, fileName, avatar, playButton, mailSended;
  let mrecorder, recordTimer, teleMail, userMedia, replayVideo;
  const uuidKey = `uuidTele`;
  let uuid = localStorage.getItem(uuidKey);
  if (!uuid) {
    uuid = Date.now().toString();
    localStorage.setItem(uuidKey, uuid);
  }
  async function recordAgain() {
    clearState(["pause", "recording", "resume", "start", "dataavailable", "stop"]);
    await createRecorder();
  }
  function clearState(arr, skip) {
    const cls = teleMail.classList;
    arr.forEach((k) => {
      if (k !== skip)
        cls.remove(k);
    });
  }
  async function createRecorder() {
    if (mrecorder)
      mrecorder.stop();
    const timeLimit = 3 * 60;
    $$invalidate(5, mrecorder = await self.mtNs.Mrecorder({
      userMedia,
      timeLimit,
      url: `${host}/cvideo`,
      uuid: uuid || 4,
      nick: username || "guest",
      stateInfo: async (ev) => {
        const { type, timer = 0, link } = ev;
        fileName = ev.fileName;
        const classList = teleMail.classList;
        clearState(["pause", "recording", "resume"], type);
        const eTime = timeLimit - timer;
        $$invalidate(6, recordTimer.innerHTML = Utils.hms(eTime, [60]), recordTimer);
        if (type === "media" && userMedia) {
          $$invalidate(8, userMedia.srcObject = ev.stream.clone(), userMedia);
          $$invalidate(8, userMedia.volume = 0.2, userMedia);
          userMedia.play();
        } else if (type === "stop")
          ;
        else if (type === "dataavailable") {
          classList.add("prepareVideo");
          linkMp4 = `${host}${link}`;
          let source = replayVideo.getElementsByTagName("source")[0];
          if (source)
            source.remove();
          Utils.stopTracks(userMedia.srcObject);
          await Utils.delay(2e3);
          source = document.createElement("source");
          source.setAttribute("src", "https:" + linkMp4);
          source.setAttribute("type", "video/mp4");
          replayVideo.append(source);
          replayVideo.play();
          classList.remove("prepareVideo");
        } else if (type === "start") {
          classList.add("recording");
          getAvatar();
        } else if (type === "resume") {
          classList.add("recording");
        } else
          ;
        classList.add(type);
      }
    }));
  }
  function getAvatar() {
    const canvas = document.createElement("canvas");
    canvas.height = userMedia.videoHeight;
    canvas.width = userMedia.videoWidth;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(userMedia, 0, 0, canvas.width, canvas.height);
    const { width, height } = playButton;
    const c = [canvas.width / 2, canvas.height / 2];
    ctx.drawImage(playButton, 0, 0, width, height, c[0] - 40, c[1] - 40, 80, 120);
    avatar = canvas.toDataURL();
  }
  async function setMedia(ev) {
    const target = ev.target;
    const classList = teleMail.classList;
    if (target.checked) {
      await createRecorder();
      classList.add("active");
    } else {
      if (mrecorder) {
        Utils.stopTracks(userMedia.srcObject);
        mrecorder.stop();
      }
      classList.remove("start");
      classList.remove("active");
    }
  }
  async function send() {
    if (!username || !email || !message) {
      alert("Обязательные поля не заполнены!");
      return;
    }
    if (userMedia.srcObject)
      Utils.stopTracks(userMedia.srcObject);
    const data = {
      cmd: "sendmail",
      uuid,
      fileName,
      linkMp4,
      avatar,
      message,
      username,
      email
    };
    const body = new FormData();
    Object.keys(data).forEach((k) => {
      if (data[k])
        body.append(k, data[k]);
    });
    const res = await fetch("https:" + sendm, { method: "POST", body }).then((req) => req.json());
    if (res.status === "ok")
      $$invalidate(4, mailSended = res.status);
    else {
      debugger;
    }
    console.warn("avatar", res);
  }
  function input0_input_handler() {
    username = this.value;
    $$invalidate(0, username);
  }
  function input1_input_handler() {
    email = this.value;
    $$invalidate(1, email);
  }
  function p6_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      recordTimer = $$value;
      $$invalidate(6, recordTimer);
    });
  }
  function video0_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      replayVideo = $$value;
      $$invalidate(9, replayVideo);
    });
  }
  function video1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      userMedia = $$value;
      $$invalidate(8, userMedia);
    });
  }
  const click_handler = () => {
    if (mrecorder.state() === "inactive")
      mrecorder.start();
  };
  const click_handler_1 = () => {
    mrecorder.pause(true);
  };
  const click_handler_2 = () => {
    mrecorder.resume();
  };
  const click_handler_3 = () => {
    mrecorder.stop(true);
  };
  function div3_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      teleMail = $$value;
      $$invalidate(7, teleMail);
    });
  }
  function img_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      playButton = $$value;
      $$invalidate(3, playButton);
    });
  }
  function textarea_input_handler() {
    message = this.value;
    $$invalidate(2, message);
  }
  return [
    username,
    email,
    message,
    playButton,
    mailSended,
    mrecorder,
    recordTimer,
    teleMail,
    userMedia,
    replayVideo,
    recordAgain,
    setMedia,
    send,
    input0_input_handler,
    input1_input_handler,
    p6_binding,
    video0_binding,
    video1_binding,
    click_handler,
    click_handler_1,
    click_handler_2,
    click_handler_3,
    div3_binding,
    img_binding,
    textarea_input_handler
  ];
}
let App$1 = class App extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$1, safe_not_equal, {}, null, [-1, -1]);
  }
};
const parentNode$1 = document.getElementById("app");
new App$1({
  target: Utils.createNode({ className: "contactCont", parentNode: parentNode$1 })
});
function create_else_block(ctx) {
  let details;
  let summary;
  let t1;
  let fieldset;
  let p0;
  let a;
  let t2;
  let t3;
  let p1;
  let button;
  let mounted;
  let dispose;
  return {
    c() {
      details = element("details");
      summary = element("summary");
      summary.textContent = "Форма оплаты";
      t1 = space();
      fieldset = element("fieldset");
      p0 = element("p");
      a = element("a");
      t2 = text("Заплатить Toncoin(TON)");
      t3 = space();
      p1 = element("p");
      button = element("button");
      button.textContent = "Ордер";
      attr(a, "class", "toncoinLink");
      attr(a, "href", directTonLink + "/" + toncoinLink);
      attr(p0, "class", "req svelte-1qud8zg");
      attr(button, "class", "order svelte-1qud8zg");
      attr(p1, "class", "req svelte-1qud8zg");
      attr(fieldset, "class", "svelte-1qud8zg");
      details.open = true;
    },
    m(target, anchor) {
      insert(target, details, anchor);
      append(details, summary);
      append(details, t1);
      append(details, fieldset);
      append(fieldset, p0);
      append(p0, a);
      append(a, t2);
      append(fieldset, t3);
      append(fieldset, p1);
      append(p1, button);
      if (!mounted) {
        dispose = listen(button, "click", prevent_default(
          /*sendOrder*/
          ctx[1]
        ));
        mounted = true;
      }
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(details);
      }
      mounted = false;
      dispose();
    }
  };
}
function create_if_block(ctx) {
  let p;
  return {
    c() {
      p = element("p");
      p.textContent = "Форма отправлена!";
      attr(p, "class", "req svelte-1qud8zg");
    },
    m(target, anchor) {
      insert(target, p, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(p);
      }
    }
  };
}
function create_fragment(ctx) {
  let section;
  function select_block_type(ctx2, dirty) {
    if (
      /*mailSended*/
      ctx2[0] === "ok"
    )
      return create_if_block;
    return create_else_block;
  }
  let current_block_type = select_block_type(ctx);
  let if_block = current_block_type(ctx);
  return {
    c() {
      section = element("section");
      if_block.c();
      attr(section, "class", "toncoin active svelte-1qud8zg");
    },
    m(target, anchor) {
      insert(target, section, anchor);
      if_block.m(section, null);
    },
    p(ctx2, [dirty]) {
      if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(section, null);
        }
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(section);
      }
      if_block.d();
    }
  };
}
const storeKey = "YspTnVXqE5g8h4lMXdViPH19IIGzvtMGtHs5";
const toncoinLink = "UQBfuO_Le4AEaj53U3v0SuRpSg_VGLG1PjApiwZ9FsByvmqp";
const directTonLink = "//t.me/SergChatGroup_bot";
function instance($$self, $$props, $$invalidate) {
  let mailSended;
  const uuidKey = `uuidTele`;
  let uuid = localStorage.getItem(uuidKey);
  if (!uuid) {
    uuid = Date.now().toString();
    localStorage.setItem(uuidKey, uuid);
  }
  const order = {
    url: "//pay.wallet.tg/wpay/store-api/v1/order",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Wpay-Store-Api-Key": storeKey
    },
    pars: {
      "amount": { "currencyCode": "USD", "amount": "1.00" },
      "autoConversionCurrency": "USDT",
      "description": "VPN for 1 month",
      "returnUrl": "https://t.me/wallet",
      "failReturnUrl": "https://t.me/wallet",
      "customData": "client_ref=4E89",
      "externalId": "ORD-5023-4E89",
      "timeoutSeconds": 10800,
      "customerTelegramUserId": 0
    }
  };
  async function sendOrder() {
    const body = JSON.stringify({ ...order.pars });
    let res = await fetch("https:" + order.url, {
      headers: order.headers,
      method: "POST",
      body
    }).then((req) => {
      if (req.status === 200)
        return req.json();
      console.error(req.status, req);
    }).catch((err) => {
      console.warn("Интернет:", err.message);
    });
    console.warn(res);
    return res;
  }
  return [mailSended, sendOrder];
}
class App2 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {});
  }
}
const parentNode = document.getElementById("app");
new App2({
  target: Utils.createNode({ className: "oplataCont", parentNode })
});
const encodedJs = "dmFyIF9fYWNjZXNzQ2hlY2sgPSAob2JqLCBtZW1iZXIsIG1zZykgPT4gewogIGlmICghbWVtYmVyLmhhcyhvYmopKQogICAgdGhyb3cgVHlwZUVycm9yKCJDYW5ub3QgIiArIG1zZyk7Cn07CnZhciBfX3ByaXZhdGVHZXQgPSAob2JqLCBtZW1iZXIsIGdldHRlcikgPT4gewogIF9fYWNjZXNzQ2hlY2sob2JqLCBtZW1iZXIsICJyZWFkIGZyb20gcHJpdmF0ZSBmaWVsZCIpOwogIHJldHVybiBnZXR0ZXIgPyBnZXR0ZXIuY2FsbChvYmopIDogbWVtYmVyLmdldChvYmopOwp9Owp2YXIgX19wcml2YXRlQWRkID0gKG9iaiwgbWVtYmVyLCB2YWx1ZSkgPT4gewogIGlmIChtZW1iZXIuaGFzKG9iaikpCiAgICB0aHJvdyBUeXBlRXJyb3IoIkNhbm5vdCBhZGQgdGhlIHNhbWUgcHJpdmF0ZSBtZW1iZXIgbW9yZSB0aGFuIG9uY2UiKTsKICBtZW1iZXIgaW5zdGFuY2VvZiBXZWFrU2V0ID8gbWVtYmVyLmFkZChvYmopIDogbWVtYmVyLnNldChvYmosIHZhbHVlKTsKfTsKdmFyIF9fcHJpdmF0ZVNldCA9IChvYmosIG1lbWJlciwgdmFsdWUsIHNldHRlcikgPT4gewogIF9fYWNjZXNzQ2hlY2sob2JqLCBtZW1iZXIsICJ3cml0ZSB0byBwcml2YXRlIGZpZWxkIik7CiAgc2V0dGVyID8gc2V0dGVyLmNhbGwob2JqLCB2YWx1ZSkgOiBtZW1iZXIuc2V0KG9iaiwgdmFsdWUpOwogIHJldHVybiB2YWx1ZTsKfTsKKGZ1bmN0aW9uKCkgewogICJ1c2Ugc3RyaWN0IjsKICB2YXIgX3RtSW50LCBfb2Zmc2V0VGltZSwgX2xhc3RUaW1lLCBfZnJhbWVDbnQsIF9wYXVzZWQsIF9wYXVzZVRpbWU7CiAgdmFyIFZpID0gT2JqZWN0LmRlZmluZVByb3BlcnR5OwogIHZhciBZaSA9IChkLCBhLCBvKSA9PiBhIGluIGQgPyBWaShkLCBhLCB7IGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUsIHZhbHVlOiBvIH0pIDogZFthXSA9IG87CiAgdmFyIEYgPSAoZCwgYSwgbykgPT4gKFlpKGQsIHR5cGVvZiBhICE9ICJzeW1ib2wiID8gYSArICIiIDogYSwgbyksIG8pLCAkZSA9IChkLCBhLCBvKSA9PiB7CiAgICBpZiAoIWEuaGFzKGQpKQogICAgICB0aHJvdyBUeXBlRXJyb3IoIkNhbm5vdCAiICsgbyk7CiAgfTsKICB2YXIgZyA9IChkLCBhLCBvKSA9PiAoJGUoZCwgYSwgInJlYWQgZnJvbSBwcml2YXRlIGZpZWxkIiksIG8gPyBvLmNhbGwoZCkgOiBhLmdldChkKSksIFUgPSAoZCwgYSwgbykgPT4gewogICAgaWYgKGEuaGFzKGQpKQogICAgICB0aHJvdyBUeXBlRXJyb3IoIkNhbm5vdCBhZGQgdGhlIHNhbWUgcHJpdmF0ZSBtZW1iZXIgbW9yZSB0aGFuIG9uY2UiKTsKICAgIGEgaW5zdGFuY2VvZiBXZWFrU2V0ID8gYS5hZGQoZCkgOiBhLnNldChkLCBvKTsKICB9LCB4ID0gKGQsIGEsIG8sIG4pID0+ICgkZShkLCBhLCAid3JpdGUgdG8gcHJpdmF0ZSBmaWVsZCIpLCBhLnNldChkLCBvKSwgbyk7CiAgdmFyIEh0ID0gKGQsIGEsIG8pID0+ICgkZShkLCBhLCAiYWNjZXNzIHByaXZhdGUgbWV0aG9kIiksIG8pOwogIGxldCBuZSA9IDE7CiAgY29uc3QgZGkgPSB7CiAgICBkZWJ1ZzogKC4uLmQpID0+IHsKICAgICAgbmUgPD0gMCAmJiBjb25zb2xlLmRlYnVnKC4uLmQpOwogICAgfSwKICAgIGluZm86ICguLi5kKSA9PiB7CiAgICAgIG5lIDw9IDEgJiYgY29uc29sZS5pbmZvKC4uLmQpOwogICAgfSwKICAgIHdhcm46ICguLi5kKSA9PiB7CiAgICAgIG5lIDw9IDIgJiYgY29uc29sZS53YXJuKC4uLmQpOwogICAgfSwKICAgIGVycm9yOiAoLi4uZCkgPT4gewogICAgICBuZSA8PSAzICYmIGNvbnNvbGUuZXJyb3IoLi4uZCk7CiAgICB9CiAgfSwgSWUgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpLCBCID0gewogICAgc2V0TG9nTGV2ZWw6IChkKSA9PiB7CiAgICAgIG5lID0gSWUuZ2V0KGQpID8/IDE7CiAgICB9LAogICAgLi4uZGksCiAgICAvLyDnlJ/miJDkuIDkuKogbG9nIOWunuS+i++8jOaJgOaciei+k+WHuuWJjemDveS8mumZhOWKoCB0YWcKICAgIGNyZWF0ZTogKGQpID0+IE9iamVjdC5mcm9tRW50cmllcygKICAgICAgT2JqZWN0LmVudHJpZXMoZGkpLm1hcCgoW2EsIG9dKSA9PiBbCiAgICAgICAgYSwKICAgICAgICAoLi4ubikgPT4gbyhkLCAuLi5uKQogICAgICBdKQogICAgKQogIH07CiAgSWUuc2V0KEIuZGVidWcsIDApOwogIEllLnNldChCLmluZm8sIDEpOwogIEllLnNldChCLndhcm4sIDIpOwogIEllLnNldChCLmVycm9yLCAzKTsKICBjb25zdCAkaSA9ICgpID0+IHsKICAgIGxldCBkLCBhID0gMTYuNjsKICAgIHNlbGYub25tZXNzYWdlID0gKG8pID0+IHsKICAgICAgby5kYXRhLmV2ZW50ID09PSAic3RhcnQiICYmIChzZWxmLmNsZWFySW50ZXJ2YWwoZCksIGQgPSBzZWxmLnNldEludGVydmFsKCgpID0+IHsKICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHt9KTsKICAgICAgfSwgYSkpLCBvLmRhdGEuZXZlbnQgPT09ICJzdG9wIiAmJiBzZWxmLmNsZWFySW50ZXJ2YWwoZCk7CiAgICB9OwogIH0sIFdpID0gKCkgPT4gewogICAgY29uc3QgZCA9IG5ldyBCbG9iKFtgKCR7JGkudG9TdHJpbmcoKX0pKClgXSksIGEgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGQpOwogICAgcmV0dXJuIG5ldyBXb3JrZXIoYSk7CiAgfSwgVnQgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpOwogIGxldCBaZSA9IDE7CiAgY29uc3QgUWUgPSBXaSgpOwogIFFlLm9ubWVzc2FnZSA9ICgpID0+IHsKICAgIFplICs9IDE7CiAgICBmb3IgKGNvbnN0IFtkLCBhXSBvZiBWdC5lbnRyaWVzKCkpCiAgICAgIFplICUgZCA9PT0gMCAmJiBhLmZvckVhY2goKG8pID0+IG8oKSk7CiAgfTsKICBmdW5jdGlvbiBvaShkKSB7CiAgICByZXR1cm4gQXJyYXkoZC5udW1iZXJPZkNoYW5uZWxzKS5maWxsKDApLm1hcCgoYSwgbykgPT4gZC5nZXRDaGFubmVsRGF0YShvKSk7CiAgfQogIGZ1bmN0aW9uIHRpKGQsIGEsIG8pIHsKICAgIGNvbnN0IG4gPSBvIC0gYSwgdSA9IG5ldyBGbG9hdDMyQXJyYXkobik7CiAgICBsZXQgZiA9IDA7CiAgICBmb3IgKDsgZiA8IG47ICkKICAgICAgdVtmXSA9IGRbKGEgKyBmKSAlIGQubGVuZ3RoXSwgZiArPSAxOwogICAgcmV0dXJuIHU7CiAgfQogIGZ1bmN0aW9uIEhlKGQsIGEpIHsKICAgIGxldCBvID0gZmFsc2U7CiAgICBhc3luYyBmdW5jdGlvbiBuKCkgewogICAgICBjb25zdCB1ID0gZC5nZXRSZWFkZXIoKTsKICAgICAgZm9yICg7ICFvOyApIHsKICAgICAgICBjb25zdCB7IHZhbHVlOiBmLCBkb25lOiBjIH0gPSBhd2FpdCB1LnJlYWQoKTsKICAgICAgICBpZiAoYykgewogICAgICAgICAgYS5vbkRvbmUoKTsKICAgICAgICAgIHJldHVybjsKICAgICAgICB9CiAgICAgICAgYXdhaXQgYS5vbkNodW5rKGYpOwogICAgICB9CiAgICAgIHUucmVsZWFzZUxvY2soKSwgYXdhaXQgZC5jYW5jZWwoKTsKICAgIH0KICAgIHJldHVybiBuKCkuY2F0Y2goQi5lcnJvciksICgpID0+IHsKICAgICAgbyA9IHRydWU7CiAgICB9OwogIH0KICBmdW5jdGlvbiBVaShkKSB7CiAgICByZXR1cm4gZCAmJiBkLl9fZXNNb2R1bGUgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGQsICJkZWZhdWx0IikgPyBkLmRlZmF1bHQgOiBkOwogIH0KICB2YXIgVGkgPSB7fTsKICAoZnVuY3Rpb24oZCkgewogICAgdmFyIGEgPSAvKiBAX19QVVJFX18gKi8gZnVuY3Rpb24oKSB7CiAgICAgIHZhciB0ID0gLyogQF9fUFVSRV9fICovIG5ldyBEYXRlKCksIGUgPSA0LCBzID0gMywgaCA9IDIsIGwgPSAxLCBwID0gZSwgXyA9IHsKICAgICAgICBzZXRMb2dMZXZlbDogZnVuY3Rpb24obSkgewogICAgICAgICAgbSA9PSB0aGlzLmRlYnVnID8gcCA9IGwgOiBtID09IHRoaXMuaW5mbyA/IHAgPSBoIDogbSA9PSB0aGlzLndhcm4gPyBwID0gcyA6IChtID09IHRoaXMuZXJyb3IsIHAgPSBlKTsKICAgICAgICB9LAogICAgICAgIGRlYnVnOiBmdW5jdGlvbihtLCB3KSB7CiAgICAgICAgICBjb25zb2xlLmRlYnVnID09PSB2b2lkIDAgJiYgKGNvbnNvbGUuZGVidWcgPSBjb25zb2xlLmxvZyksIGwgPj0gcCAmJiBjb25zb2xlLmRlYnVnKCJbIiArIGEuZ2V0RHVyYXRpb25TdHJpbmcoLyogQF9fUFVSRV9fICovIG5ldyBEYXRlKCkgLSB0LCAxZTMpICsgIl0iLCAiWyIgKyBtICsgIl0iLCB3KTsKICAgICAgICB9LAogICAgICAgIGxvZzogZnVuY3Rpb24obSwgdykgewogICAgICAgICAgdGhpcy5kZWJ1ZyhtLm1zZyk7CiAgICAgICAgfSwKICAgICAgICBpbmZvOiBmdW5jdGlvbihtLCB3KSB7CiAgICAgICAgICBoID49IHAgJiYgY29uc29sZS5pbmZvKCJbIiArIGEuZ2V0RHVyYXRpb25TdHJpbmcoLyogQF9fUFVSRV9fICovIG5ldyBEYXRlKCkgLSB0LCAxZTMpICsgIl0iLCAiWyIgKyBtICsgIl0iLCB3KTsKICAgICAgICB9LAogICAgICAgIHdhcm46IGZ1bmN0aW9uKG0sIHcpIHsKICAgICAgICAgIHMgPj0gcCAmJiBjb25zb2xlLndhcm4oIlsiICsgYS5nZXREdXJhdGlvblN0cmluZygvKiBAX19QVVJFX18gKi8gbmV3IERhdGUoKSAtIHQsIDFlMykgKyAiXSIsICJbIiArIG0gKyAiXSIsIHcpOwogICAgICAgIH0sCiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKG0sIHcpIHsKICAgICAgICAgIGUgPj0gcCAmJiBjb25zb2xlLmVycm9yKCJbIiArIGEuZ2V0RHVyYXRpb25TdHJpbmcoLyogQF9fUFVSRV9fICovIG5ldyBEYXRlKCkgLSB0LCAxZTMpICsgIl0iLCAiWyIgKyBtICsgIl0iLCB3KTsKICAgICAgICB9CiAgICAgIH07CiAgICAgIHJldHVybiBfOwogICAgfSgpOwogICAgYS5nZXREdXJhdGlvblN0cmluZyA9IGZ1bmN0aW9uKHQsIGUpIHsKICAgICAgdmFyIHM7CiAgICAgIGZ1bmN0aW9uIGgoUywgRSkgewogICAgICAgIGZvciAodmFyIEkgPSAiIiArIFMsIFAgPSBJLnNwbGl0KCIuIik7IFBbMF0ubGVuZ3RoIDwgRTsgKQogICAgICAgICAgUFswXSA9ICIwIiArIFBbMF07CiAgICAgICAgcmV0dXJuIFAuam9pbigiLiIpOwogICAgICB9CiAgICAgIHQgPCAwID8gKHMgPSB0cnVlLCB0ID0gLXQpIDogcyA9IGZhbHNlOwogICAgICB2YXIgbCA9IGUgfHwgMSwgcCA9IHQgLyBsLCBfID0gTWF0aC5mbG9vcihwIC8gMzYwMCk7CiAgICAgIHAgLT0gXyAqIDM2MDA7CiAgICAgIHZhciBtID0gTWF0aC5mbG9vcihwIC8gNjApOwogICAgICBwIC09IG0gKiA2MDsKICAgICAgdmFyIHcgPSBwICogMWUzOwogICAgICByZXR1cm4gcCA9IE1hdGguZmxvb3IocCksIHcgLT0gcCAqIDFlMywgdyA9IE1hdGguZmxvb3IodyksIChzID8gIi0iIDogIiIpICsgXyArICI6IiArIGgobSwgMikgKyAiOiIgKyBoKHAsIDIpICsgIi4iICsgaCh3LCAzKTsKICAgIH0sIGEucHJpbnRSYW5nZXMgPSBmdW5jdGlvbih0KSB7CiAgICAgIHZhciBlID0gdC5sZW5ndGg7CiAgICAgIGlmIChlID4gMCkgewogICAgICAgIGZvciAodmFyIHMgPSAiIiwgaCA9IDA7IGggPCBlOyBoKyspCiAgICAgICAgICBoID4gMCAmJiAocyArPSAiLCIpLCBzICs9ICJbIiArIGEuZ2V0RHVyYXRpb25TdHJpbmcodC5zdGFydChoKSkgKyAiLCIgKyBhLmdldER1cmF0aW9uU3RyaW5nKHQuZW5kKGgpKSArICJdIjsKICAgICAgICByZXR1cm4gczsKICAgICAgfSBlbHNlCiAgICAgICAgcmV0dXJuICIoZW1wdHkpIjsKICAgIH0sIGQuTG9nID0gYTsKICAgIHZhciBvID0gZnVuY3Rpb24odCkgewogICAgICBpZiAodCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKQogICAgICAgIHRoaXMuYnVmZmVyID0gdCwgdGhpcy5kYXRhdmlldyA9IG5ldyBEYXRhVmlldyh0KTsKICAgICAgZWxzZQogICAgICAgIHRocm93ICJOZWVkcyBhbiBhcnJheSBidWZmZXIiOwogICAgICB0aGlzLnBvc2l0aW9uID0gMDsKICAgIH07CiAgICBvLnByb3RvdHlwZS5nZXRQb3NpdGlvbiA9IGZ1bmN0aW9uKCkgewogICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbjsKICAgIH0sIG8ucHJvdG90eXBlLmdldEVuZFBvc2l0aW9uID0gZnVuY3Rpb24oKSB7CiAgICAgIHJldHVybiB0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoOwogICAgfSwgby5wcm90b3R5cGUuZ2V0TGVuZ3RoID0gZnVuY3Rpb24oKSB7CiAgICAgIHJldHVybiB0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoOwogICAgfSwgby5wcm90b3R5cGUuc2VlayA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUgPSBNYXRoLm1heCgwLCBNYXRoLm1pbih0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoLCB0KSk7CiAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uID0gaXNOYU4oZSkgfHwgIWlzRmluaXRlKGUpID8gMCA6IGUsIHRydWU7CiAgICB9LCBvLnByb3RvdHlwZS5pc0VvcyA9IGZ1bmN0aW9uKCkgewogICAgICByZXR1cm4gdGhpcy5nZXRQb3NpdGlvbigpID49IHRoaXMuZ2V0RW5kUG9zaXRpb24oKTsKICAgIH0sIG8ucHJvdG90eXBlLnJlYWRBbnlJbnQgPSBmdW5jdGlvbih0LCBlKSB7CiAgICAgIHZhciBzID0gMDsKICAgICAgaWYgKHRoaXMucG9zaXRpb24gKyB0IDw9IHRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpIHsKICAgICAgICBzd2l0Y2ggKHQpIHsKICAgICAgICAgIGNhc2UgMToKICAgICAgICAgICAgZSA/IHMgPSB0aGlzLmRhdGF2aWV3LmdldEludDgodGhpcy5wb3NpdGlvbikgOiBzID0gdGhpcy5kYXRhdmlldy5nZXRVaW50OCh0aGlzLnBvc2l0aW9uKTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICBjYXNlIDI6CiAgICAgICAgICAgIGUgPyBzID0gdGhpcy5kYXRhdmlldy5nZXRJbnQxNih0aGlzLnBvc2l0aW9uKSA6IHMgPSB0aGlzLmRhdGF2aWV3LmdldFVpbnQxNih0aGlzLnBvc2l0aW9uKTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICBjYXNlIDM6CiAgICAgICAgICAgIGlmIChlKQogICAgICAgICAgICAgIHRocm93ICJObyBtZXRob2QgZm9yIHJlYWRpbmcgc2lnbmVkIDI0IGJpdHMgdmFsdWVzIjsKICAgICAgICAgICAgcyA9IHRoaXMuZGF0YXZpZXcuZ2V0VWludDgodGhpcy5wb3NpdGlvbikgPDwgMTYsIHMgfD0gdGhpcy5kYXRhdmlldy5nZXRVaW50OCh0aGlzLnBvc2l0aW9uICsgMSkgPDwgOCwgcyB8PSB0aGlzLmRhdGF2aWV3LmdldFVpbnQ4KHRoaXMucG9zaXRpb24gKyAyKTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICBjYXNlIDQ6CiAgICAgICAgICAgIGUgPyBzID0gdGhpcy5kYXRhdmlldy5nZXRJbnQzMih0aGlzLnBvc2l0aW9uKSA6IHMgPSB0aGlzLmRhdGF2aWV3LmdldFVpbnQzMih0aGlzLnBvc2l0aW9uKTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICBjYXNlIDg6CiAgICAgICAgICAgIGlmIChlKQogICAgICAgICAgICAgIHRocm93ICJObyBtZXRob2QgZm9yIHJlYWRpbmcgc2lnbmVkIDY0IGJpdHMgdmFsdWVzIjsKICAgICAgICAgICAgcyA9IHRoaXMuZGF0YXZpZXcuZ2V0VWludDMyKHRoaXMucG9zaXRpb24pIDw8IDMyLCBzIHw9IHRoaXMuZGF0YXZpZXcuZ2V0VWludDMyKHRoaXMucG9zaXRpb24gKyA0KTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICBkZWZhdWx0OgogICAgICAgICAgICB0aHJvdyAicmVhZEludCBtZXRob2Qgbm90IGltcGxlbWVudGVkIGZvciBzaXplOiAiICsgdDsKICAgICAgICB9CiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24gKz0gdCwgczsKICAgICAgfSBlbHNlCiAgICAgICAgdGhyb3cgIk5vdCBlbm91Z2ggYnl0ZXMgaW4gYnVmZmVyIjsKICAgIH0sIG8ucHJvdG90eXBlLnJlYWRVaW50OCA9IGZ1bmN0aW9uKCkgewogICAgICByZXR1cm4gdGhpcy5yZWFkQW55SW50KDEsIGZhbHNlKTsKICAgIH0sIG8ucHJvdG90eXBlLnJlYWRVaW50MTYgPSBmdW5jdGlvbigpIHsKICAgICAgcmV0dXJuIHRoaXMucmVhZEFueUludCgyLCBmYWxzZSk7CiAgICB9LCBvLnByb3RvdHlwZS5yZWFkVWludDI0ID0gZnVuY3Rpb24oKSB7CiAgICAgIHJldHVybiB0aGlzLnJlYWRBbnlJbnQoMywgZmFsc2UpOwogICAgfSwgby5wcm90b3R5cGUucmVhZFVpbnQzMiA9IGZ1bmN0aW9uKCkgewogICAgICByZXR1cm4gdGhpcy5yZWFkQW55SW50KDQsIGZhbHNlKTsKICAgIH0sIG8ucHJvdG90eXBlLnJlYWRVaW50NjQgPSBmdW5jdGlvbigpIHsKICAgICAgcmV0dXJuIHRoaXMucmVhZEFueUludCg4LCBmYWxzZSk7CiAgICB9LCBvLnByb3RvdHlwZS5yZWFkU3RyaW5nID0gZnVuY3Rpb24odCkgewogICAgICBpZiAodGhpcy5wb3NpdGlvbiArIHQgPD0gdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCkgewogICAgICAgIGZvciAodmFyIGUgPSAiIiwgcyA9IDA7IHMgPCB0OyBzKyspCiAgICAgICAgICBlICs9IFN0cmluZy5mcm9tQ2hhckNvZGUodGhpcy5yZWFkVWludDgoKSk7CiAgICAgICAgcmV0dXJuIGU7CiAgICAgIH0gZWxzZQogICAgICAgIHRocm93ICJOb3QgZW5vdWdoIGJ5dGVzIGluIGJ1ZmZlciI7CiAgICB9LCBvLnByb3RvdHlwZS5yZWFkQ1N0cmluZyA9IGZ1bmN0aW9uKCkgewogICAgICBmb3IgKHZhciB0ID0gW107IDsgKSB7CiAgICAgICAgdmFyIGUgPSB0aGlzLnJlYWRVaW50OCgpOwogICAgICAgIGlmIChlICE9PSAwKQogICAgICAgICAgdC5wdXNoKGUpOwogICAgICAgIGVsc2UKICAgICAgICAgIGJyZWFrOwogICAgICB9CiAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIHQpOwogICAgfSwgby5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbigpIHsKICAgICAgcmV0dXJuIHRoaXMucmVhZEFueUludCgxLCB0cnVlKTsKICAgIH0sIG8ucHJvdG90eXBlLnJlYWRJbnQxNiA9IGZ1bmN0aW9uKCkgewogICAgICByZXR1cm4gdGhpcy5yZWFkQW55SW50KDIsIHRydWUpOwogICAgfSwgby5wcm90b3R5cGUucmVhZEludDMyID0gZnVuY3Rpb24oKSB7CiAgICAgIHJldHVybiB0aGlzLnJlYWRBbnlJbnQoNCwgdHJ1ZSk7CiAgICB9LCBvLnByb3RvdHlwZS5yZWFkSW50NjQgPSBmdW5jdGlvbigpIHsKICAgICAgcmV0dXJuIHRoaXMucmVhZEFueUludCg4LCBmYWxzZSk7CiAgICB9LCBvLnByb3RvdHlwZS5yZWFkVWludDhBcnJheSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgZm9yICh2YXIgZSA9IG5ldyBVaW50OEFycmF5KHQpLCBzID0gMDsgcyA8IHQ7IHMrKykKICAgICAgICBlW3NdID0gdGhpcy5yZWFkVWludDgoKTsKICAgICAgcmV0dXJuIGU7CiAgICB9LCBvLnByb3RvdHlwZS5yZWFkSW50MTZBcnJheSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgZm9yICh2YXIgZSA9IG5ldyBJbnQxNkFycmF5KHQpLCBzID0gMDsgcyA8IHQ7IHMrKykKICAgICAgICBlW3NdID0gdGhpcy5yZWFkSW50MTYoKTsKICAgICAgcmV0dXJuIGU7CiAgICB9LCBvLnByb3RvdHlwZS5yZWFkVWludDE2QXJyYXkgPSBmdW5jdGlvbih0KSB7CiAgICAgIGZvciAodmFyIGUgPSBuZXcgSW50MTZBcnJheSh0KSwgcyA9IDA7IHMgPCB0OyBzKyspCiAgICAgICAgZVtzXSA9IHRoaXMucmVhZFVpbnQxNigpOwogICAgICByZXR1cm4gZTsKICAgIH0sIG8ucHJvdG90eXBlLnJlYWRVaW50MzJBcnJheSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgZm9yICh2YXIgZSA9IG5ldyBVaW50MzJBcnJheSh0KSwgcyA9IDA7IHMgPCB0OyBzKyspCiAgICAgICAgZVtzXSA9IHRoaXMucmVhZFVpbnQzMigpOwogICAgICByZXR1cm4gZTsKICAgIH0sIG8ucHJvdG90eXBlLnJlYWRJbnQzMkFycmF5ID0gZnVuY3Rpb24odCkgewogICAgICBmb3IgKHZhciBlID0gbmV3IEludDMyQXJyYXkodCksIHMgPSAwOyBzIDwgdDsgcysrKQogICAgICAgIGVbc10gPSB0aGlzLnJlYWRJbnQzMigpOwogICAgICByZXR1cm4gZTsKICAgIH0sIGQuTVA0Qm94U3RyZWFtID0gbzsKICAgIHZhciBuID0gZnVuY3Rpb24odCwgZSwgcykgewogICAgICB0aGlzLl9ieXRlT2Zmc2V0ID0gZSB8fCAwLCB0IGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgPyB0aGlzLmJ1ZmZlciA9IHQgOiB0eXBlb2YgdCA9PSAib2JqZWN0IiA/ICh0aGlzLmRhdGFWaWV3ID0gdCwgZSAmJiAodGhpcy5fYnl0ZU9mZnNldCArPSBlKSkgOiB0aGlzLmJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcih0IHx8IDApLCB0aGlzLnBvc2l0aW9uID0gMCwgdGhpcy5lbmRpYW5uZXNzID0gcyA/PyBuLkxJVFRMRV9FTkRJQU47CiAgICB9OwogICAgbi5wcm90b3R5cGUgPSB7fSwgbi5wcm90b3R5cGUuZ2V0UG9zaXRpb24gPSBmdW5jdGlvbigpIHsKICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb247CiAgICB9LCBuLnByb3RvdHlwZS5fcmVhbGxvYyA9IGZ1bmN0aW9uKHQpIHsKICAgICAgaWYgKHRoaXMuX2R5bmFtaWNTaXplKSB7CiAgICAgICAgdmFyIGUgPSB0aGlzLl9ieXRlT2Zmc2V0ICsgdGhpcy5wb3NpdGlvbiArIHQsIHMgPSB0aGlzLl9idWZmZXIuYnl0ZUxlbmd0aDsKICAgICAgICBpZiAoZSA8PSBzKSB7CiAgICAgICAgICBlID4gdGhpcy5fYnl0ZUxlbmd0aCAmJiAodGhpcy5fYnl0ZUxlbmd0aCA9IGUpOwogICAgICAgICAgcmV0dXJuOwogICAgICAgIH0KICAgICAgICBmb3IgKHMgPCAxICYmIChzID0gMSk7IGUgPiBzOyApCiAgICAgICAgICBzICo9IDI7CiAgICAgICAgdmFyIGggPSBuZXcgQXJyYXlCdWZmZXIocyksIGwgPSBuZXcgVWludDhBcnJheSh0aGlzLl9idWZmZXIpLCBwID0gbmV3IFVpbnQ4QXJyYXkoaCwgMCwgbC5sZW5ndGgpOwogICAgICAgIHAuc2V0KGwpLCB0aGlzLmJ1ZmZlciA9IGgsIHRoaXMuX2J5dGVMZW5ndGggPSBlOwogICAgICB9CiAgICB9LCBuLnByb3RvdHlwZS5fdHJpbUFsbG9jID0gZnVuY3Rpb24oKSB7CiAgICAgIGlmICh0aGlzLl9ieXRlTGVuZ3RoICE9IHRoaXMuX2J1ZmZlci5ieXRlTGVuZ3RoKSB7CiAgICAgICAgdmFyIHQgPSBuZXcgQXJyYXlCdWZmZXIodGhpcy5fYnl0ZUxlbmd0aCksIGUgPSBuZXcgVWludDhBcnJheSh0KSwgcyA9IG5ldyBVaW50OEFycmF5KHRoaXMuX2J1ZmZlciwgMCwgZS5sZW5ndGgpOwogICAgICAgIGUuc2V0KHMpLCB0aGlzLmJ1ZmZlciA9IHQ7CiAgICAgIH0KICAgIH0sIG4uQklHX0VORElBTiA9IGZhbHNlLCBuLkxJVFRMRV9FTkRJQU4gPSB0cnVlLCBuLnByb3RvdHlwZS5fYnl0ZUxlbmd0aCA9IDAsIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSgKICAgICAgbi5wcm90b3R5cGUsCiAgICAgICJieXRlTGVuZ3RoIiwKICAgICAgeyBnZXQ6IGZ1bmN0aW9uKCkgewogICAgICAgIHJldHVybiB0aGlzLl9ieXRlTGVuZ3RoIC0gdGhpcy5fYnl0ZU9mZnNldDsKICAgICAgfSB9CiAgICApLCBPYmplY3QuZGVmaW5lUHJvcGVydHkoCiAgICAgIG4ucHJvdG90eXBlLAogICAgICAiYnVmZmVyIiwKICAgICAgewogICAgICAgIGdldDogZnVuY3Rpb24oKSB7CiAgICAgICAgICByZXR1cm4gdGhpcy5fdHJpbUFsbG9jKCksIHRoaXMuX2J1ZmZlcjsKICAgICAgICB9LAogICAgICAgIHNldDogZnVuY3Rpb24odCkgewogICAgICAgICAgdGhpcy5fYnVmZmVyID0gdCwgdGhpcy5fZGF0YVZpZXcgPSBuZXcgRGF0YVZpZXcodGhpcy5fYnVmZmVyLCB0aGlzLl9ieXRlT2Zmc2V0KSwgdGhpcy5fYnl0ZUxlbmd0aCA9IHRoaXMuX2J1ZmZlci5ieXRlTGVuZ3RoOwogICAgICAgIH0KICAgICAgfQogICAgKSwgT2JqZWN0LmRlZmluZVByb3BlcnR5KAogICAgICBuLnByb3RvdHlwZSwKICAgICAgImJ5dGVPZmZzZXQiLAogICAgICB7CiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHsKICAgICAgICAgIHJldHVybiB0aGlzLl9ieXRlT2Zmc2V0OwogICAgICAgIH0sCiAgICAgICAgc2V0OiBmdW5jdGlvbih0KSB7CiAgICAgICAgICB0aGlzLl9ieXRlT2Zmc2V0ID0gdCwgdGhpcy5fZGF0YVZpZXcgPSBuZXcgRGF0YVZpZXcodGhpcy5fYnVmZmVyLCB0aGlzLl9ieXRlT2Zmc2V0KSwgdGhpcy5fYnl0ZUxlbmd0aCA9IHRoaXMuX2J1ZmZlci5ieXRlTGVuZ3RoOwogICAgICAgIH0KICAgICAgfQogICAgKSwgT2JqZWN0LmRlZmluZVByb3BlcnR5KAogICAgICBuLnByb3RvdHlwZSwKICAgICAgImRhdGFWaWV3IiwKICAgICAgewogICAgICAgIGdldDogZnVuY3Rpb24oKSB7CiAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVZpZXc7CiAgICAgICAgfSwKICAgICAgICBzZXQ6IGZ1bmN0aW9uKHQpIHsKICAgICAgICAgIHRoaXMuX2J5dGVPZmZzZXQgPSB0LmJ5dGVPZmZzZXQsIHRoaXMuX2J1ZmZlciA9IHQuYnVmZmVyLCB0aGlzLl9kYXRhVmlldyA9IG5ldyBEYXRhVmlldyh0aGlzLl9idWZmZXIsIHRoaXMuX2J5dGVPZmZzZXQpLCB0aGlzLl9ieXRlTGVuZ3RoID0gdGhpcy5fYnl0ZU9mZnNldCArIHQuYnl0ZUxlbmd0aDsKICAgICAgICB9CiAgICAgIH0KICAgICksIG4ucHJvdG90eXBlLnNlZWsgPSBmdW5jdGlvbih0KSB7CiAgICAgIHZhciBlID0gTWF0aC5tYXgoMCwgTWF0aC5taW4odGhpcy5ieXRlTGVuZ3RoLCB0KSk7CiAgICAgIHRoaXMucG9zaXRpb24gPSBpc05hTihlKSB8fCAhaXNGaW5pdGUoZSkgPyAwIDogZTsKICAgIH0sIG4ucHJvdG90eXBlLmlzRW9mID0gZnVuY3Rpb24oKSB7CiAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uID49IHRoaXMuX2J5dGVMZW5ndGg7CiAgICB9LCBuLnByb3RvdHlwZS5tYXBVaW50OEFycmF5ID0gZnVuY3Rpb24odCkgewogICAgICB0aGlzLl9yZWFsbG9jKHQgKiAxKTsKICAgICAgdmFyIGUgPSBuZXcgVWludDhBcnJheSh0aGlzLl9idWZmZXIsIHRoaXMuYnl0ZU9mZnNldCArIHRoaXMucG9zaXRpb24sIHQpOwogICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbiArPSB0ICogMSwgZTsKICAgIH0sIG4ucHJvdG90eXBlLnJlYWRJbnQzMkFycmF5ID0gZnVuY3Rpb24odCwgZSkgewogICAgICB0ID0gdCA/PyB0aGlzLmJ5dGVMZW5ndGggLSB0aGlzLnBvc2l0aW9uIC8gNDsKICAgICAgdmFyIHMgPSBuZXcgSW50MzJBcnJheSh0KTsKICAgICAgcmV0dXJuIG4ubWVtY3B5KAogICAgICAgIHMuYnVmZmVyLAogICAgICAgIDAsCiAgICAgICAgdGhpcy5idWZmZXIsCiAgICAgICAgdGhpcy5ieXRlT2Zmc2V0ICsgdGhpcy5wb3NpdGlvbiwKICAgICAgICB0ICogcy5CWVRFU19QRVJfRUxFTUVOVAogICAgICApLCBuLmFycmF5VG9OYXRpdmUocywgZSA/PyB0aGlzLmVuZGlhbm5lc3MpLCB0aGlzLnBvc2l0aW9uICs9IHMuYnl0ZUxlbmd0aCwgczsKICAgIH0sIG4ucHJvdG90eXBlLnJlYWRJbnQxNkFycmF5ID0gZnVuY3Rpb24odCwgZSkgewogICAgICB0ID0gdCA/PyB0aGlzLmJ5dGVMZW5ndGggLSB0aGlzLnBvc2l0aW9uIC8gMjsKICAgICAgdmFyIHMgPSBuZXcgSW50MTZBcnJheSh0KTsKICAgICAgcmV0dXJuIG4ubWVtY3B5KAogICAgICAgIHMuYnVmZmVyLAogICAgICAgIDAsCiAgICAgICAgdGhpcy5idWZmZXIsCiAgICAgICAgdGhpcy5ieXRlT2Zmc2V0ICsgdGhpcy5wb3NpdGlvbiwKICAgICAgICB0ICogcy5CWVRFU19QRVJfRUxFTUVOVAogICAgICApLCBuLmFycmF5VG9OYXRpdmUocywgZSA/PyB0aGlzLmVuZGlhbm5lc3MpLCB0aGlzLnBvc2l0aW9uICs9IHMuYnl0ZUxlbmd0aCwgczsKICAgIH0sIG4ucHJvdG90eXBlLnJlYWRJbnQ4QXJyYXkgPSBmdW5jdGlvbih0KSB7CiAgICAgIHQgPSB0ID8/IHRoaXMuYnl0ZUxlbmd0aCAtIHRoaXMucG9zaXRpb247CiAgICAgIHZhciBlID0gbmV3IEludDhBcnJheSh0KTsKICAgICAgcmV0dXJuIG4ubWVtY3B5KAogICAgICAgIGUuYnVmZmVyLAogICAgICAgIDAsCiAgICAgICAgdGhpcy5idWZmZXIsCiAgICAgICAgdGhpcy5ieXRlT2Zmc2V0ICsgdGhpcy5wb3NpdGlvbiwKICAgICAgICB0ICogZS5CWVRFU19QRVJfRUxFTUVOVAogICAgICApLCB0aGlzLnBvc2l0aW9uICs9IGUuYnl0ZUxlbmd0aCwgZTsKICAgIH0sIG4ucHJvdG90eXBlLnJlYWRVaW50MzJBcnJheSA9IGZ1bmN0aW9uKHQsIGUpIHsKICAgICAgdCA9IHQgPz8gdGhpcy5ieXRlTGVuZ3RoIC0gdGhpcy5wb3NpdGlvbiAvIDQ7CiAgICAgIHZhciBzID0gbmV3IFVpbnQzMkFycmF5KHQpOwogICAgICByZXR1cm4gbi5tZW1jcHkoCiAgICAgICAgcy5idWZmZXIsCiAgICAgICAgMCwKICAgICAgICB0aGlzLmJ1ZmZlciwKICAgICAgICB0aGlzLmJ5dGVPZmZzZXQgKyB0aGlzLnBvc2l0aW9uLAogICAgICAgIHQgKiBzLkJZVEVTX1BFUl9FTEVNRU5UCiAgICAgICksIG4uYXJyYXlUb05hdGl2ZShzLCBlID8/IHRoaXMuZW5kaWFubmVzcyksIHRoaXMucG9zaXRpb24gKz0gcy5ieXRlTGVuZ3RoLCBzOwogICAgfSwgbi5wcm90b3R5cGUucmVhZFVpbnQxNkFycmF5ID0gZnVuY3Rpb24odCwgZSkgewogICAgICB0ID0gdCA/PyB0aGlzLmJ5dGVMZW5ndGggLSB0aGlzLnBvc2l0aW9uIC8gMjsKICAgICAgdmFyIHMgPSBuZXcgVWludDE2QXJyYXkodCk7CiAgICAgIHJldHVybiBuLm1lbWNweSgKICAgICAgICBzLmJ1ZmZlciwKICAgICAgICAwLAogICAgICAgIHRoaXMuYnVmZmVyLAogICAgICAgIHRoaXMuYnl0ZU9mZnNldCArIHRoaXMucG9zaXRpb24sCiAgICAgICAgdCAqIHMuQllURVNfUEVSX0VMRU1FTlQKICAgICAgKSwgbi5hcnJheVRvTmF0aXZlKHMsIGUgPz8gdGhpcy5lbmRpYW5uZXNzKSwgdGhpcy5wb3NpdGlvbiArPSBzLmJ5dGVMZW5ndGgsIHM7CiAgICB9LCBuLnByb3RvdHlwZS5yZWFkVWludDhBcnJheSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdCA9IHQgPz8gdGhpcy5ieXRlTGVuZ3RoIC0gdGhpcy5wb3NpdGlvbjsKICAgICAgdmFyIGUgPSBuZXcgVWludDhBcnJheSh0KTsKICAgICAgcmV0dXJuIG4ubWVtY3B5KAogICAgICAgIGUuYnVmZmVyLAogICAgICAgIDAsCiAgICAgICAgdGhpcy5idWZmZXIsCiAgICAgICAgdGhpcy5ieXRlT2Zmc2V0ICsgdGhpcy5wb3NpdGlvbiwKICAgICAgICB0ICogZS5CWVRFU19QRVJfRUxFTUVOVAogICAgICApLCB0aGlzLnBvc2l0aW9uICs9IGUuYnl0ZUxlbmd0aCwgZTsKICAgIH0sIG4ucHJvdG90eXBlLnJlYWRGbG9hdDY0QXJyYXkgPSBmdW5jdGlvbih0LCBlKSB7CiAgICAgIHQgPSB0ID8/IHRoaXMuYnl0ZUxlbmd0aCAtIHRoaXMucG9zaXRpb24gLyA4OwogICAgICB2YXIgcyA9IG5ldyBGbG9hdDY0QXJyYXkodCk7CiAgICAgIHJldHVybiBuLm1lbWNweSgKICAgICAgICBzLmJ1ZmZlciwKICAgICAgICAwLAogICAgICAgIHRoaXMuYnVmZmVyLAogICAgICAgIHRoaXMuYnl0ZU9mZnNldCArIHRoaXMucG9zaXRpb24sCiAgICAgICAgdCAqIHMuQllURVNfUEVSX0VMRU1FTlQKICAgICAgKSwgbi5hcnJheVRvTmF0aXZlKHMsIGUgPz8gdGhpcy5lbmRpYW5uZXNzKSwgdGhpcy5wb3NpdGlvbiArPSBzLmJ5dGVMZW5ndGgsIHM7CiAgICB9LCBuLnByb3RvdHlwZS5yZWFkRmxvYXQzMkFycmF5ID0gZnVuY3Rpb24odCwgZSkgewogICAgICB0ID0gdCA/PyB0aGlzLmJ5dGVMZW5ndGggLSB0aGlzLnBvc2l0aW9uIC8gNDsKICAgICAgdmFyIHMgPSBuZXcgRmxvYXQzMkFycmF5KHQpOwogICAgICByZXR1cm4gbi5tZW1jcHkoCiAgICAgICAgcy5idWZmZXIsCiAgICAgICAgMCwKICAgICAgICB0aGlzLmJ1ZmZlciwKICAgICAgICB0aGlzLmJ5dGVPZmZzZXQgKyB0aGlzLnBvc2l0aW9uLAogICAgICAgIHQgKiBzLkJZVEVTX1BFUl9FTEVNRU5UCiAgICAgICksIG4uYXJyYXlUb05hdGl2ZShzLCBlID8/IHRoaXMuZW5kaWFubmVzcyksIHRoaXMucG9zaXRpb24gKz0gcy5ieXRlTGVuZ3RoLCBzOwogICAgfSwgbi5wcm90b3R5cGUucmVhZEludDMyID0gZnVuY3Rpb24odCkgewogICAgICB2YXIgZSA9IHRoaXMuX2RhdGFWaWV3LmdldEludDMyKHRoaXMucG9zaXRpb24sIHQgPz8gdGhpcy5lbmRpYW5uZXNzKTsKICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24gKz0gNCwgZTsKICAgIH0sIG4ucHJvdG90eXBlLnJlYWRJbnQxNiA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUgPSB0aGlzLl9kYXRhVmlldy5nZXRJbnQxNih0aGlzLnBvc2l0aW9uLCB0ID8/IHRoaXMuZW5kaWFubmVzcyk7CiAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uICs9IDIsIGU7CiAgICB9LCBuLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uKCkgewogICAgICB2YXIgdCA9IHRoaXMuX2RhdGFWaWV3LmdldEludDgodGhpcy5wb3NpdGlvbik7CiAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uICs9IDEsIHQ7CiAgICB9LCBuLnByb3RvdHlwZS5yZWFkVWludDMyID0gZnVuY3Rpb24odCkgewogICAgICB2YXIgZSA9IHRoaXMuX2RhdGFWaWV3LmdldFVpbnQzMih0aGlzLnBvc2l0aW9uLCB0ID8/IHRoaXMuZW5kaWFubmVzcyk7CiAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uICs9IDQsIGU7CiAgICB9LCBuLnByb3RvdHlwZS5yZWFkVWludDE2ID0gZnVuY3Rpb24odCkgewogICAgICB2YXIgZSA9IHRoaXMuX2RhdGFWaWV3LmdldFVpbnQxNih0aGlzLnBvc2l0aW9uLCB0ID8/IHRoaXMuZW5kaWFubmVzcyk7CiAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uICs9IDIsIGU7CiAgICB9LCBuLnByb3RvdHlwZS5yZWFkVWludDggPSBmdW5jdGlvbigpIHsKICAgICAgdmFyIHQgPSB0aGlzLl9kYXRhVmlldy5nZXRVaW50OCh0aGlzLnBvc2l0aW9uKTsKICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24gKz0gMSwgdDsKICAgIH0sIG4ucHJvdG90eXBlLnJlYWRGbG9hdDMyID0gZnVuY3Rpb24odCkgewogICAgICB2YXIgZSA9IHRoaXMuX2RhdGFWaWV3LmdldEZsb2F0MzIodGhpcy5wb3NpdGlvbiwgdCA/PyB0aGlzLmVuZGlhbm5lc3MpOwogICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbiArPSA0LCBlOwogICAgfSwgbi5wcm90b3R5cGUucmVhZEZsb2F0NjQgPSBmdW5jdGlvbih0KSB7CiAgICAgIHZhciBlID0gdGhpcy5fZGF0YVZpZXcuZ2V0RmxvYXQ2NCh0aGlzLnBvc2l0aW9uLCB0ID8/IHRoaXMuZW5kaWFubmVzcyk7CiAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uICs9IDgsIGU7CiAgICB9LCBuLmVuZGlhbm5lc3MgPSBuZXcgSW50OEFycmF5KG5ldyBJbnQxNkFycmF5KFsxXSkuYnVmZmVyKVswXSA+IDAsIG4ubWVtY3B5ID0gZnVuY3Rpb24odCwgZSwgcywgaCwgbCkgewogICAgICB2YXIgcCA9IG5ldyBVaW50OEFycmF5KHQsIGUsIGwpLCBfID0gbmV3IFVpbnQ4QXJyYXkocywgaCwgbCk7CiAgICAgIHAuc2V0KF8pOwogICAgfSwgbi5hcnJheVRvTmF0aXZlID0gZnVuY3Rpb24odCwgZSkgewogICAgICByZXR1cm4gZSA9PSB0aGlzLmVuZGlhbm5lc3MgPyB0IDogdGhpcy5mbGlwQXJyYXlFbmRpYW5uZXNzKHQpOwogICAgfSwgbi5uYXRpdmVUb0VuZGlhbiA9IGZ1bmN0aW9uKHQsIGUpIHsKICAgICAgcmV0dXJuIHRoaXMuZW5kaWFubmVzcyA9PSBlID8gdCA6IHRoaXMuZmxpcEFycmF5RW5kaWFubmVzcyh0KTsKICAgIH0sIG4uZmxpcEFycmF5RW5kaWFubmVzcyA9IGZ1bmN0aW9uKHQpIHsKICAgICAgZm9yICh2YXIgZSA9IG5ldyBVaW50OEFycmF5KHQuYnVmZmVyLCB0LmJ5dGVPZmZzZXQsIHQuYnl0ZUxlbmd0aCksIHMgPSAwOyBzIDwgdC5ieXRlTGVuZ3RoOyBzICs9IHQuQllURVNfUEVSX0VMRU1FTlQpCiAgICAgICAgZm9yICh2YXIgaCA9IHMgKyB0LkJZVEVTX1BFUl9FTEVNRU5UIC0gMSwgbCA9IHM7IGggPiBsOyBoLS0sIGwrKykgewogICAgICAgICAgdmFyIHAgPSBlW2xdOwogICAgICAgICAgZVtsXSA9IGVbaF0sIGVbaF0gPSBwOwogICAgICAgIH0KICAgICAgcmV0dXJuIHQ7CiAgICB9LCBuLnByb3RvdHlwZS5mYWlsdXJlUG9zaXRpb24gPSAwLCBTdHJpbmcuZnJvbUNoYXJDb2RlVWludDggPSBmdW5jdGlvbih0KSB7CiAgICAgIGZvciAodmFyIGUgPSBbXSwgcyA9IDA7IHMgPCB0Lmxlbmd0aDsgcysrKQogICAgICAgIGVbc10gPSB0W3NdOwogICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBlKTsKICAgIH0sIG4ucHJvdG90eXBlLnJlYWRTdHJpbmcgPSBmdW5jdGlvbih0LCBlKSB7CiAgICAgIHJldHVybiBlID09IG51bGwgfHwgZSA9PSAiQVNDSUkiID8gU3RyaW5nLmZyb21DaGFyQ29kZVVpbnQ4LmFwcGx5KG51bGwsIFt0aGlzLm1hcFVpbnQ4QXJyYXkodCA/PyB0aGlzLmJ5dGVMZW5ndGggLSB0aGlzLnBvc2l0aW9uKV0pIDogbmV3IFRleHREZWNvZGVyKGUpLmRlY29kZSh0aGlzLm1hcFVpbnQ4QXJyYXkodCkpOwogICAgfSwgbi5wcm90b3R5cGUucmVhZENTdHJpbmcgPSBmdW5jdGlvbih0KSB7CiAgICAgIHZhciBlID0gdGhpcy5ieXRlTGVuZ3RoIC0gdGhpcy5wb3NpdGlvbiwgcyA9IG5ldyBVaW50OEFycmF5KHRoaXMuX2J1ZmZlciwgdGhpcy5fYnl0ZU9mZnNldCArIHRoaXMucG9zaXRpb24pLCBoID0gZTsKICAgICAgdCAhPSBudWxsICYmIChoID0gTWF0aC5taW4odCwgZSkpOwogICAgICBmb3IgKHZhciBsID0gMDsgbCA8IGggJiYgc1tsXSAhPT0gMDsgbCsrKQogICAgICAgIDsKICAgICAgdmFyIHAgPSBTdHJpbmcuZnJvbUNoYXJDb2RlVWludDguYXBwbHkobnVsbCwgW3RoaXMubWFwVWludDhBcnJheShsKV0pOwogICAgICByZXR1cm4gdCAhPSBudWxsID8gdGhpcy5wb3NpdGlvbiArPSBoIC0gbCA6IGwgIT0gZSAmJiAodGhpcy5wb3NpdGlvbiArPSAxKSwgcDsKICAgIH07CiAgICB2YXIgdSA9IE1hdGgucG93KDIsIDMyKTsKICAgIG4ucHJvdG90eXBlLnJlYWRJbnQ2NCA9IGZ1bmN0aW9uKCkgewogICAgICByZXR1cm4gdGhpcy5yZWFkSW50MzIoKSAqIHUgKyB0aGlzLnJlYWRVaW50MzIoKTsKICAgIH0sIG4ucHJvdG90eXBlLnJlYWRVaW50NjQgPSBmdW5jdGlvbigpIHsKICAgICAgcmV0dXJuIHRoaXMucmVhZFVpbnQzMigpICogdSArIHRoaXMucmVhZFVpbnQzMigpOwogICAgfSwgbi5wcm90b3R5cGUucmVhZEludDY0ID0gZnVuY3Rpb24oKSB7CiAgICAgIHJldHVybiB0aGlzLnJlYWRVaW50MzIoKSAqIHUgKyB0aGlzLnJlYWRVaW50MzIoKTsKICAgIH0sIG4ucHJvdG90eXBlLnJlYWRVaW50MjQgPSBmdW5jdGlvbigpIHsKICAgICAgcmV0dXJuICh0aGlzLnJlYWRVaW50OCgpIDw8IDE2KSArICh0aGlzLnJlYWRVaW50OCgpIDw8IDgpICsgdGhpcy5yZWFkVWludDgoKTsKICAgIH0sIGQuRGF0YVN0cmVhbSA9IG4sIG4ucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbih0KSB7CiAgICAgIHZhciBlID0gbmV3IEJsb2IoW3RoaXMuYnVmZmVyXSk7CiAgICAgIGlmICh3aW5kb3cuVVJMICYmIFVSTC5jcmVhdGVPYmplY3RVUkwpIHsKICAgICAgICB2YXIgcyA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGUpLCBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgiYSIpOwogICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaCksIGguc2V0QXR0cmlidXRlKCJocmVmIiwgcyksIGguc2V0QXR0cmlidXRlKCJkb3dubG9hZCIsIHQpLCBoLnNldEF0dHJpYnV0ZSgidGFyZ2V0IiwgIl9zZWxmIiksIGguY2xpY2soKSwgd2luZG93LlVSTC5yZXZva2VPYmplY3RVUkwocyk7CiAgICAgIH0gZWxzZQogICAgICAgIHRocm93ICJEYXRhU3RyZWFtLnNhdmU6IENhbid0IGNyZWF0ZSBvYmplY3QgVVJMLiI7CiAgICB9LCBuLnByb3RvdHlwZS5fZHluYW1pY1NpemUgPSB0cnVlLCBPYmplY3QuZGVmaW5lUHJvcGVydHkoCiAgICAgIG4ucHJvdG90eXBlLAogICAgICAiZHluYW1pY1NpemUiLAogICAgICB7CiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHsKICAgICAgICAgIHJldHVybiB0aGlzLl9keW5hbWljU2l6ZTsKICAgICAgICB9LAogICAgICAgIHNldDogZnVuY3Rpb24odCkgewogICAgICAgICAgdCB8fCB0aGlzLl90cmltQWxsb2MoKSwgdGhpcy5fZHluYW1pY1NpemUgPSB0OwogICAgICAgIH0KICAgICAgfQogICAgKSwgbi5wcm90b3R5cGUuc2hpZnQgPSBmdW5jdGlvbih0KSB7CiAgICAgIHZhciBlID0gbmV3IEFycmF5QnVmZmVyKHRoaXMuX2J5dGVMZW5ndGggLSB0KSwgcyA9IG5ldyBVaW50OEFycmF5KGUpLCBoID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5fYnVmZmVyLCB0LCBzLmxlbmd0aCk7CiAgICAgIHMuc2V0KGgpLCB0aGlzLmJ1ZmZlciA9IGUsIHRoaXMucG9zaXRpb24gLT0gdDsKICAgIH0sIG4ucHJvdG90eXBlLndyaXRlSW50MzJBcnJheSA9IGZ1bmN0aW9uKHQsIGUpIHsKICAgICAgaWYgKHRoaXMuX3JlYWxsb2ModC5sZW5ndGggKiA0KSwgdCBpbnN0YW5jZW9mIEludDMyQXJyYXkgJiYgdGhpcy5ieXRlT2Zmc2V0ICsgdGhpcy5wb3NpdGlvbiAlIHQuQllURVNfUEVSX0VMRU1FTlQgPT09IDApCiAgICAgICAgbi5tZW1jcHkoCiAgICAgICAgICB0aGlzLl9idWZmZXIsCiAgICAgICAgICB0aGlzLmJ5dGVPZmZzZXQgKyB0aGlzLnBvc2l0aW9uLAogICAgICAgICAgdC5idWZmZXIsCiAgICAgICAgICAwLAogICAgICAgICAgdC5ieXRlTGVuZ3RoCiAgICAgICAgKSwgdGhpcy5tYXBJbnQzMkFycmF5KHQubGVuZ3RoLCBlKTsKICAgICAgZWxzZQogICAgICAgIGZvciAodmFyIHMgPSAwOyBzIDwgdC5sZW5ndGg7IHMrKykKICAgICAgICAgIHRoaXMud3JpdGVJbnQzMih0W3NdLCBlKTsKICAgIH0sIG4ucHJvdG90eXBlLndyaXRlSW50MTZBcnJheSA9IGZ1bmN0aW9uKHQsIGUpIHsKICAgICAgaWYgKHRoaXMuX3JlYWxsb2ModC5sZW5ndGggKiAyKSwgdCBpbnN0YW5jZW9mIEludDE2QXJyYXkgJiYgdGhpcy5ieXRlT2Zmc2V0ICsgdGhpcy5wb3NpdGlvbiAlIHQuQllURVNfUEVSX0VMRU1FTlQgPT09IDApCiAgICAgICAgbi5tZW1jcHkoCiAgICAgICAgICB0aGlzLl9idWZmZXIsCiAgICAgICAgICB0aGlzLmJ5dGVPZmZzZXQgKyB0aGlzLnBvc2l0aW9uLAogICAgICAgICAgdC5idWZmZXIsCiAgICAgICAgICAwLAogICAgICAgICAgdC5ieXRlTGVuZ3RoCiAgICAgICAgKSwgdGhpcy5tYXBJbnQxNkFycmF5KHQubGVuZ3RoLCBlKTsKICAgICAgZWxzZQogICAgICAgIGZvciAodmFyIHMgPSAwOyBzIDwgdC5sZW5ndGg7IHMrKykKICAgICAgICAgIHRoaXMud3JpdGVJbnQxNih0W3NdLCBlKTsKICAgIH0sIG4ucHJvdG90eXBlLndyaXRlSW50OEFycmF5ID0gZnVuY3Rpb24odCkgewogICAgICBpZiAodGhpcy5fcmVhbGxvYyh0Lmxlbmd0aCAqIDEpLCB0IGluc3RhbmNlb2YgSW50OEFycmF5ICYmIHRoaXMuYnl0ZU9mZnNldCArIHRoaXMucG9zaXRpb24gJSB0LkJZVEVTX1BFUl9FTEVNRU5UID09PSAwKQogICAgICAgIG4ubWVtY3B5KAogICAgICAgICAgdGhpcy5fYnVmZmVyLAogICAgICAgICAgdGhpcy5ieXRlT2Zmc2V0ICsgdGhpcy5wb3NpdGlvbiwKICAgICAgICAgIHQuYnVmZmVyLAogICAgICAgICAgMCwKICAgICAgICAgIHQuYnl0ZUxlbmd0aAogICAgICAgICksIHRoaXMubWFwSW50OEFycmF5KHQubGVuZ3RoKTsKICAgICAgZWxzZQogICAgICAgIGZvciAodmFyIGUgPSAwOyBlIDwgdC5sZW5ndGg7IGUrKykKICAgICAgICAgIHRoaXMud3JpdGVJbnQ4KHRbZV0pOwogICAgfSwgbi5wcm90b3R5cGUud3JpdGVVaW50MzJBcnJheSA9IGZ1bmN0aW9uKHQsIGUpIHsKICAgICAgaWYgKHRoaXMuX3JlYWxsb2ModC5sZW5ndGggKiA0KSwgdCBpbnN0YW5jZW9mIFVpbnQzMkFycmF5ICYmIHRoaXMuYnl0ZU9mZnNldCArIHRoaXMucG9zaXRpb24gJSB0LkJZVEVTX1BFUl9FTEVNRU5UID09PSAwKQogICAgICAgIG4ubWVtY3B5KAogICAgICAgICAgdGhpcy5fYnVmZmVyLAogICAgICAgICAgdGhpcy5ieXRlT2Zmc2V0ICsgdGhpcy5wb3NpdGlvbiwKICAgICAgICAgIHQuYnVmZmVyLAogICAgICAgICAgMCwKICAgICAgICAgIHQuYnl0ZUxlbmd0aAogICAgICAgICksIHRoaXMubWFwVWludDMyQXJyYXkodC5sZW5ndGgsIGUpOwogICAgICBlbHNlCiAgICAgICAgZm9yICh2YXIgcyA9IDA7IHMgPCB0Lmxlbmd0aDsgcysrKQogICAgICAgICAgdGhpcy53cml0ZVVpbnQzMih0W3NdLCBlKTsKICAgIH0sIG4ucHJvdG90eXBlLndyaXRlVWludDE2QXJyYXkgPSBmdW5jdGlvbih0LCBlKSB7CiAgICAgIGlmICh0aGlzLl9yZWFsbG9jKHQubGVuZ3RoICogMiksIHQgaW5zdGFuY2VvZiBVaW50MTZBcnJheSAmJiB0aGlzLmJ5dGVPZmZzZXQgKyB0aGlzLnBvc2l0aW9uICUgdC5CWVRFU19QRVJfRUxFTUVOVCA9PT0gMCkKICAgICAgICBuLm1lbWNweSgKICAgICAgICAgIHRoaXMuX2J1ZmZlciwKICAgICAgICAgIHRoaXMuYnl0ZU9mZnNldCArIHRoaXMucG9zaXRpb24sCiAgICAgICAgICB0LmJ1ZmZlciwKICAgICAgICAgIDAsCiAgICAgICAgICB0LmJ5dGVMZW5ndGgKICAgICAgICApLCB0aGlzLm1hcFVpbnQxNkFycmF5KHQubGVuZ3RoLCBlKTsKICAgICAgZWxzZQogICAgICAgIGZvciAodmFyIHMgPSAwOyBzIDwgdC5sZW5ndGg7IHMrKykKICAgICAgICAgIHRoaXMud3JpdGVVaW50MTYodFtzXSwgZSk7CiAgICB9LCBuLnByb3RvdHlwZS53cml0ZVVpbnQ4QXJyYXkgPSBmdW5jdGlvbih0KSB7CiAgICAgIGlmICh0aGlzLl9yZWFsbG9jKHQubGVuZ3RoICogMSksIHQgaW5zdGFuY2VvZiBVaW50OEFycmF5ICYmIHRoaXMuYnl0ZU9mZnNldCArIHRoaXMucG9zaXRpb24gJSB0LkJZVEVTX1BFUl9FTEVNRU5UID09PSAwKQogICAgICAgIG4ubWVtY3B5KAogICAgICAgICAgdGhpcy5fYnVmZmVyLAogICAgICAgICAgdGhpcy5ieXRlT2Zmc2V0ICsgdGhpcy5wb3NpdGlvbiwKICAgICAgICAgIHQuYnVmZmVyLAogICAgICAgICAgMCwKICAgICAgICAgIHQuYnl0ZUxlbmd0aAogICAgICAgICksIHRoaXMubWFwVWludDhBcnJheSh0Lmxlbmd0aCk7CiAgICAgIGVsc2UKICAgICAgICBmb3IgKHZhciBlID0gMDsgZSA8IHQubGVuZ3RoOyBlKyspCiAgICAgICAgICB0aGlzLndyaXRlVWludDgodFtlXSk7CiAgICB9LCBuLnByb3RvdHlwZS53cml0ZUZsb2F0NjRBcnJheSA9IGZ1bmN0aW9uKHQsIGUpIHsKICAgICAgaWYgKHRoaXMuX3JlYWxsb2ModC5sZW5ndGggKiA4KSwgdCBpbnN0YW5jZW9mIEZsb2F0NjRBcnJheSAmJiB0aGlzLmJ5dGVPZmZzZXQgKyB0aGlzLnBvc2l0aW9uICUgdC5CWVRFU19QRVJfRUxFTUVOVCA9PT0gMCkKICAgICAgICBuLm1lbWNweSgKICAgICAgICAgIHRoaXMuX2J1ZmZlciwKICAgICAgICAgIHRoaXMuYnl0ZU9mZnNldCArIHRoaXMucG9zaXRpb24sCiAgICAgICAgICB0LmJ1ZmZlciwKICAgICAgICAgIDAsCiAgICAgICAgICB0LmJ5dGVMZW5ndGgKICAgICAgICApLCB0aGlzLm1hcEZsb2F0NjRBcnJheSh0Lmxlbmd0aCwgZSk7CiAgICAgIGVsc2UKICAgICAgICBmb3IgKHZhciBzID0gMDsgcyA8IHQubGVuZ3RoOyBzKyspCiAgICAgICAgICB0aGlzLndyaXRlRmxvYXQ2NCh0W3NdLCBlKTsKICAgIH0sIG4ucHJvdG90eXBlLndyaXRlRmxvYXQzMkFycmF5ID0gZnVuY3Rpb24odCwgZSkgewogICAgICBpZiAodGhpcy5fcmVhbGxvYyh0Lmxlbmd0aCAqIDQpLCB0IGluc3RhbmNlb2YgRmxvYXQzMkFycmF5ICYmIHRoaXMuYnl0ZU9mZnNldCArIHRoaXMucG9zaXRpb24gJSB0LkJZVEVTX1BFUl9FTEVNRU5UID09PSAwKQogICAgICAgIG4ubWVtY3B5KAogICAgICAgICAgdGhpcy5fYnVmZmVyLAogICAgICAgICAgdGhpcy5ieXRlT2Zmc2V0ICsgdGhpcy5wb3NpdGlvbiwKICAgICAgICAgIHQuYnVmZmVyLAogICAgICAgICAgMCwKICAgICAgICAgIHQuYnl0ZUxlbmd0aAogICAgICAgICksIHRoaXMubWFwRmxvYXQzMkFycmF5KHQubGVuZ3RoLCBlKTsKICAgICAgZWxzZQogICAgICAgIGZvciAodmFyIHMgPSAwOyBzIDwgdC5sZW5ndGg7IHMrKykKICAgICAgICAgIHRoaXMud3JpdGVGbG9hdDMyKHRbc10sIGUpOwogICAgfSwgbi5wcm90b3R5cGUud3JpdGVJbnQzMiA9IGZ1bmN0aW9uKHQsIGUpIHsKICAgICAgdGhpcy5fcmVhbGxvYyg0KSwgdGhpcy5fZGF0YVZpZXcuc2V0SW50MzIodGhpcy5wb3NpdGlvbiwgdCwgZSA/PyB0aGlzLmVuZGlhbm5lc3MpLCB0aGlzLnBvc2l0aW9uICs9IDQ7CiAgICB9LCBuLnByb3RvdHlwZS53cml0ZUludDE2ID0gZnVuY3Rpb24odCwgZSkgewogICAgICB0aGlzLl9yZWFsbG9jKDIpLCB0aGlzLl9kYXRhVmlldy5zZXRJbnQxNih0aGlzLnBvc2l0aW9uLCB0LCBlID8/IHRoaXMuZW5kaWFubmVzcyksIHRoaXMucG9zaXRpb24gKz0gMjsKICAgIH0sIG4ucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5fcmVhbGxvYygxKSwgdGhpcy5fZGF0YVZpZXcuc2V0SW50OCh0aGlzLnBvc2l0aW9uLCB0KSwgdGhpcy5wb3NpdGlvbiArPSAxOwogICAgfSwgbi5wcm90b3R5cGUud3JpdGVVaW50MzIgPSBmdW5jdGlvbih0LCBlKSB7CiAgICAgIHRoaXMuX3JlYWxsb2MoNCksIHRoaXMuX2RhdGFWaWV3LnNldFVpbnQzMih0aGlzLnBvc2l0aW9uLCB0LCBlID8/IHRoaXMuZW5kaWFubmVzcyksIHRoaXMucG9zaXRpb24gKz0gNDsKICAgIH0sIG4ucHJvdG90eXBlLndyaXRlVWludDE2ID0gZnVuY3Rpb24odCwgZSkgewogICAgICB0aGlzLl9yZWFsbG9jKDIpLCB0aGlzLl9kYXRhVmlldy5zZXRVaW50MTYodGhpcy5wb3NpdGlvbiwgdCwgZSA/PyB0aGlzLmVuZGlhbm5lc3MpLCB0aGlzLnBvc2l0aW9uICs9IDI7CiAgICB9LCBuLnByb3RvdHlwZS53cml0ZVVpbnQ4ID0gZnVuY3Rpb24odCkgewogICAgICB0aGlzLl9yZWFsbG9jKDEpLCB0aGlzLl9kYXRhVmlldy5zZXRVaW50OCh0aGlzLnBvc2l0aW9uLCB0KSwgdGhpcy5wb3NpdGlvbiArPSAxOwogICAgfSwgbi5wcm90b3R5cGUud3JpdGVGbG9hdDMyID0gZnVuY3Rpb24odCwgZSkgewogICAgICB0aGlzLl9yZWFsbG9jKDQpLCB0aGlzLl9kYXRhVmlldy5zZXRGbG9hdDMyKHRoaXMucG9zaXRpb24sIHQsIGUgPz8gdGhpcy5lbmRpYW5uZXNzKSwgdGhpcy5wb3NpdGlvbiArPSA0OwogICAgfSwgbi5wcm90b3R5cGUud3JpdGVGbG9hdDY0ID0gZnVuY3Rpb24odCwgZSkgewogICAgICB0aGlzLl9yZWFsbG9jKDgpLCB0aGlzLl9kYXRhVmlldy5zZXRGbG9hdDY0KHRoaXMucG9zaXRpb24sIHQsIGUgPz8gdGhpcy5lbmRpYW5uZXNzKSwgdGhpcy5wb3NpdGlvbiArPSA4OwogICAgfSwgbi5wcm90b3R5cGUud3JpdGVVQ1MyU3RyaW5nID0gZnVuY3Rpb24odCwgZSwgcykgewogICAgICBzID09IG51bGwgJiYgKHMgPSB0Lmxlbmd0aCk7CiAgICAgIGZvciAodmFyIGggPSAwOyBoIDwgdC5sZW5ndGggJiYgaCA8IHM7IGgrKykKICAgICAgICB0aGlzLndyaXRlVWludDE2KHQuY2hhckNvZGVBdChoKSwgZSk7CiAgICAgIGZvciAoOyBoIDwgczsgaCsrKQogICAgICAgIHRoaXMud3JpdGVVaW50MTYoMCk7CiAgICB9LCBuLnByb3RvdHlwZS53cml0ZVN0cmluZyA9IGZ1bmN0aW9uKHQsIGUsIHMpIHsKICAgICAgdmFyIGggPSAwOwogICAgICBpZiAoZSA9PSBudWxsIHx8IGUgPT0gIkFTQ0lJIikKICAgICAgICBpZiAocyAhPSBudWxsKSB7CiAgICAgICAgICB2YXIgbCA9IE1hdGgubWluKHQubGVuZ3RoLCBzKTsKICAgICAgICAgIGZvciAoaCA9IDA7IGggPCBsOyBoKyspCiAgICAgICAgICAgIHRoaXMud3JpdGVVaW50OCh0LmNoYXJDb2RlQXQoaCkpOwogICAgICAgICAgZm9yICg7IGggPCBzOyBoKyspCiAgICAgICAgICAgIHRoaXMud3JpdGVVaW50OCgwKTsKICAgICAgICB9IGVsc2UKICAgICAgICAgIGZvciAoaCA9IDA7IGggPCB0Lmxlbmd0aDsgaCsrKQogICAgICAgICAgICB0aGlzLndyaXRlVWludDgodC5jaGFyQ29kZUF0KGgpKTsKICAgICAgZWxzZQogICAgICAgIHRoaXMud3JpdGVVaW50OEFycmF5KG5ldyBUZXh0RW5jb2RlcihlKS5lbmNvZGUodC5zdWJzdHJpbmcoMCwgcykpKTsKICAgIH0sIG4ucHJvdG90eXBlLndyaXRlQ1N0cmluZyA9IGZ1bmN0aW9uKHQsIGUpIHsKICAgICAgdmFyIHMgPSAwOwogICAgICBpZiAoZSAhPSBudWxsKSB7CiAgICAgICAgdmFyIGggPSBNYXRoLm1pbih0Lmxlbmd0aCwgZSk7CiAgICAgICAgZm9yIChzID0gMDsgcyA8IGg7IHMrKykKICAgICAgICAgIHRoaXMud3JpdGVVaW50OCh0LmNoYXJDb2RlQXQocykpOwogICAgICAgIGZvciAoOyBzIDwgZTsgcysrKQogICAgICAgICAgdGhpcy53cml0ZVVpbnQ4KDApOwogICAgICB9IGVsc2UgewogICAgICAgIGZvciAocyA9IDA7IHMgPCB0Lmxlbmd0aDsgcysrKQogICAgICAgICAgdGhpcy53cml0ZVVpbnQ4KHQuY2hhckNvZGVBdChzKSk7CiAgICAgICAgdGhpcy53cml0ZVVpbnQ4KDApOwogICAgICB9CiAgICB9LCBuLnByb3RvdHlwZS53cml0ZVN0cnVjdCA9IGZ1bmN0aW9uKHQsIGUpIHsKICAgICAgZm9yICh2YXIgcyA9IDA7IHMgPCB0Lmxlbmd0aDsgcyArPSAyKSB7CiAgICAgICAgdmFyIGggPSB0W3MgKyAxXTsKICAgICAgICB0aGlzLndyaXRlVHlwZShoLCBlW3Rbc11dLCBlKTsKICAgICAgfQogICAgfSwgbi5wcm90b3R5cGUud3JpdGVUeXBlID0gZnVuY3Rpb24odCwgZSwgcykgewogICAgICB2YXIgaDsKICAgICAgaWYgKHR5cGVvZiB0ID09ICJmdW5jdGlvbiIpCiAgICAgICAgcmV0dXJuIHQodGhpcywgZSk7CiAgICAgIGlmICh0eXBlb2YgdCA9PSAib2JqZWN0IiAmJiAhKHQgaW5zdGFuY2VvZiBBcnJheSkpCiAgICAgICAgcmV0dXJuIHQuc2V0KHRoaXMsIGUsIHMpOwogICAgICB2YXIgbCA9IG51bGwsIHAgPSAiQVNDSUkiLCBfID0gdGhpcy5wb3NpdGlvbjsKICAgICAgc3dpdGNoICh0eXBlb2YgdCA9PSAic3RyaW5nIiAmJiAvOi8udGVzdCh0KSAmJiAoaCA9IHQuc3BsaXQoIjoiKSwgdCA9IGhbMF0sIGwgPSBwYXJzZUludChoWzFdKSksIHR5cGVvZiB0ID09ICJzdHJpbmciICYmIC8sLy50ZXN0KHQpICYmIChoID0gdC5zcGxpdCgiLCIpLCB0ID0gaFswXSwgcCA9IHBhcnNlSW50KGhbMV0pKSwgdCkgewogICAgICAgIGNhc2UgInVpbnQ4IjoKICAgICAgICAgIHRoaXMud3JpdGVVaW50OChlKTsKICAgICAgICAgIGJyZWFrOwogICAgICAgIGNhc2UgImludDgiOgogICAgICAgICAgdGhpcy53cml0ZUludDgoZSk7CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlICJ1aW50MTYiOgogICAgICAgICAgdGhpcy53cml0ZVVpbnQxNihlLCB0aGlzLmVuZGlhbm5lc3MpOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgY2FzZSAiaW50MTYiOgogICAgICAgICAgdGhpcy53cml0ZUludDE2KGUsIHRoaXMuZW5kaWFubmVzcyk7CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlICJ1aW50MzIiOgogICAgICAgICAgdGhpcy53cml0ZVVpbnQzMihlLCB0aGlzLmVuZGlhbm5lc3MpOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgY2FzZSAiaW50MzIiOgogICAgICAgICAgdGhpcy53cml0ZUludDMyKGUsIHRoaXMuZW5kaWFubmVzcyk7CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlICJmbG9hdDMyIjoKICAgICAgICAgIHRoaXMud3JpdGVGbG9hdDMyKGUsIHRoaXMuZW5kaWFubmVzcyk7CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlICJmbG9hdDY0IjoKICAgICAgICAgIHRoaXMud3JpdGVGbG9hdDY0KGUsIHRoaXMuZW5kaWFubmVzcyk7CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlICJ1aW50MTZiZSI6CiAgICAgICAgICB0aGlzLndyaXRlVWludDE2KGUsIG4uQklHX0VORElBTik7CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlICJpbnQxNmJlIjoKICAgICAgICAgIHRoaXMud3JpdGVJbnQxNihlLCBuLkJJR19FTkRJQU4pOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgY2FzZSAidWludDMyYmUiOgogICAgICAgICAgdGhpcy53cml0ZVVpbnQzMihlLCBuLkJJR19FTkRJQU4pOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgY2FzZSAiaW50MzJiZSI6CiAgICAgICAgICB0aGlzLndyaXRlSW50MzIoZSwgbi5CSUdfRU5ESUFOKTsKICAgICAgICAgIGJyZWFrOwogICAgICAgIGNhc2UgImZsb2F0MzJiZSI6CiAgICAgICAgICB0aGlzLndyaXRlRmxvYXQzMihlLCBuLkJJR19FTkRJQU4pOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgY2FzZSAiZmxvYXQ2NGJlIjoKICAgICAgICAgIHRoaXMud3JpdGVGbG9hdDY0KGUsIG4uQklHX0VORElBTik7CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlICJ1aW50MTZsZSI6CiAgICAgICAgICB0aGlzLndyaXRlVWludDE2KGUsIG4uTElUVExFX0VORElBTik7CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlICJpbnQxNmxlIjoKICAgICAgICAgIHRoaXMud3JpdGVJbnQxNihlLCBuLkxJVFRMRV9FTkRJQU4pOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgY2FzZSAidWludDMybGUiOgogICAgICAgICAgdGhpcy53cml0ZVVpbnQzMihlLCBuLkxJVFRMRV9FTkRJQU4pOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgY2FzZSAiaW50MzJsZSI6CiAgICAgICAgICB0aGlzLndyaXRlSW50MzIoZSwgbi5MSVRUTEVfRU5ESUFOKTsKICAgICAgICAgIGJyZWFrOwogICAgICAgIGNhc2UgImZsb2F0MzJsZSI6CiAgICAgICAgICB0aGlzLndyaXRlRmxvYXQzMihlLCBuLkxJVFRMRV9FTkRJQU4pOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgY2FzZSAiZmxvYXQ2NGxlIjoKICAgICAgICAgIHRoaXMud3JpdGVGbG9hdDY0KGUsIG4uTElUVExFX0VORElBTik7CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlICJjc3RyaW5nIjoKICAgICAgICAgIHRoaXMud3JpdGVDU3RyaW5nKGUsIGwpOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgY2FzZSAic3RyaW5nIjoKICAgICAgICAgIHRoaXMud3JpdGVTdHJpbmcoZSwgcCwgbCk7CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlICJ1MTZzdHJpbmciOgogICAgICAgICAgdGhpcy53cml0ZVVDUzJTdHJpbmcoZSwgdGhpcy5lbmRpYW5uZXNzLCBsKTsKICAgICAgICAgIGJyZWFrOwogICAgICAgIGNhc2UgInUxNnN0cmluZ2xlIjoKICAgICAgICAgIHRoaXMud3JpdGVVQ1MyU3RyaW5nKGUsIG4uTElUVExFX0VORElBTiwgbCk7CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlICJ1MTZzdHJpbmdiZSI6CiAgICAgICAgICB0aGlzLndyaXRlVUNTMlN0cmluZyhlLCBuLkJJR19FTkRJQU4sIGwpOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgZGVmYXVsdDoKICAgICAgICAgIGlmICh0Lmxlbmd0aCA9PSAzKSB7CiAgICAgICAgICAgIGZvciAodmFyIG0gPSB0WzFdLCB3ID0gMDsgdyA8IGUubGVuZ3RoOyB3KyspCiAgICAgICAgICAgICAgdGhpcy53cml0ZVR5cGUobSwgZVt3XSk7CiAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgdGhpcy53cml0ZVN0cnVjdCh0LCBlKTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICB9CiAgICAgIH0KICAgICAgbCAhPSBudWxsICYmICh0aGlzLnBvc2l0aW9uID0gXywgdGhpcy5fcmVhbGxvYyhsKSwgdGhpcy5wb3NpdGlvbiA9IF8gKyBsKTsKICAgIH0sIG4ucHJvdG90eXBlLndyaXRlVWludDY0ID0gZnVuY3Rpb24odCkgewogICAgICB2YXIgZSA9IE1hdGguZmxvb3IodCAvIHUpOwogICAgICB0aGlzLndyaXRlVWludDMyKGUpLCB0aGlzLndyaXRlVWludDMyKHQgJiA0Mjk0OTY3Mjk1KTsKICAgIH0sIG4ucHJvdG90eXBlLndyaXRlVWludDI0ID0gZnVuY3Rpb24odCkgewogICAgICB0aGlzLndyaXRlVWludDgoKHQgJiAxNjcxMTY4MCkgPj4gMTYpLCB0aGlzLndyaXRlVWludDgoKHQgJiA2NTI4MCkgPj4gOCksIHRoaXMud3JpdGVVaW50OCh0ICYgMjU1KTsKICAgIH0sIG4ucHJvdG90eXBlLmFkanVzdFVpbnQzMiA9IGZ1bmN0aW9uKHQsIGUpIHsKICAgICAgdmFyIHMgPSB0aGlzLnBvc2l0aW9uOwogICAgICB0aGlzLnNlZWsodCksIHRoaXMud3JpdGVVaW50MzIoZSksIHRoaXMuc2VlayhzKTsKICAgIH0sIG4ucHJvdG90eXBlLm1hcEludDMyQXJyYXkgPSBmdW5jdGlvbih0LCBlKSB7CiAgICAgIHRoaXMuX3JlYWxsb2ModCAqIDQpOwogICAgICB2YXIgcyA9IG5ldyBJbnQzMkFycmF5KHRoaXMuX2J1ZmZlciwgdGhpcy5ieXRlT2Zmc2V0ICsgdGhpcy5wb3NpdGlvbiwgdCk7CiAgICAgIHJldHVybiBuLmFycmF5VG9OYXRpdmUocywgZSA/PyB0aGlzLmVuZGlhbm5lc3MpLCB0aGlzLnBvc2l0aW9uICs9IHQgKiA0LCBzOwogICAgfSwgbi5wcm90b3R5cGUubWFwSW50MTZBcnJheSA9IGZ1bmN0aW9uKHQsIGUpIHsKICAgICAgdGhpcy5fcmVhbGxvYyh0ICogMik7CiAgICAgIHZhciBzID0gbmV3IEludDE2QXJyYXkodGhpcy5fYnVmZmVyLCB0aGlzLmJ5dGVPZmZzZXQgKyB0aGlzLnBvc2l0aW9uLCB0KTsKICAgICAgcmV0dXJuIG4uYXJyYXlUb05hdGl2ZShzLCBlID8/IHRoaXMuZW5kaWFubmVzcyksIHRoaXMucG9zaXRpb24gKz0gdCAqIDIsIHM7CiAgICB9LCBuLnByb3RvdHlwZS5tYXBJbnQ4QXJyYXkgPSBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuX3JlYWxsb2ModCAqIDEpOwogICAgICB2YXIgZSA9IG5ldyBJbnQ4QXJyYXkodGhpcy5fYnVmZmVyLCB0aGlzLmJ5dGVPZmZzZXQgKyB0aGlzLnBvc2l0aW9uLCB0KTsKICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24gKz0gdCAqIDEsIGU7CiAgICB9LCBuLnByb3RvdHlwZS5tYXBVaW50MzJBcnJheSA9IGZ1bmN0aW9uKHQsIGUpIHsKICAgICAgdGhpcy5fcmVhbGxvYyh0ICogNCk7CiAgICAgIHZhciBzID0gbmV3IFVpbnQzMkFycmF5KHRoaXMuX2J1ZmZlciwgdGhpcy5ieXRlT2Zmc2V0ICsgdGhpcy5wb3NpdGlvbiwgdCk7CiAgICAgIHJldHVybiBuLmFycmF5VG9OYXRpdmUocywgZSA/PyB0aGlzLmVuZGlhbm5lc3MpLCB0aGlzLnBvc2l0aW9uICs9IHQgKiA0LCBzOwogICAgfSwgbi5wcm90b3R5cGUubWFwVWludDE2QXJyYXkgPSBmdW5jdGlvbih0LCBlKSB7CiAgICAgIHRoaXMuX3JlYWxsb2ModCAqIDIpOwogICAgICB2YXIgcyA9IG5ldyBVaW50MTZBcnJheSh0aGlzLl9idWZmZXIsIHRoaXMuYnl0ZU9mZnNldCArIHRoaXMucG9zaXRpb24sIHQpOwogICAgICByZXR1cm4gbi5hcnJheVRvTmF0aXZlKHMsIGUgPz8gdGhpcy5lbmRpYW5uZXNzKSwgdGhpcy5wb3NpdGlvbiArPSB0ICogMiwgczsKICAgIH0sIG4ucHJvdG90eXBlLm1hcEZsb2F0NjRBcnJheSA9IGZ1bmN0aW9uKHQsIGUpIHsKICAgICAgdGhpcy5fcmVhbGxvYyh0ICogOCk7CiAgICAgIHZhciBzID0gbmV3IEZsb2F0NjRBcnJheSh0aGlzLl9idWZmZXIsIHRoaXMuYnl0ZU9mZnNldCArIHRoaXMucG9zaXRpb24sIHQpOwogICAgICByZXR1cm4gbi5hcnJheVRvTmF0aXZlKHMsIGUgPz8gdGhpcy5lbmRpYW5uZXNzKSwgdGhpcy5wb3NpdGlvbiArPSB0ICogOCwgczsKICAgIH0sIG4ucHJvdG90eXBlLm1hcEZsb2F0MzJBcnJheSA9IGZ1bmN0aW9uKHQsIGUpIHsKICAgICAgdGhpcy5fcmVhbGxvYyh0ICogNCk7CiAgICAgIHZhciBzID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLl9idWZmZXIsIHRoaXMuYnl0ZU9mZnNldCArIHRoaXMucG9zaXRpb24sIHQpOwogICAgICByZXR1cm4gbi5hcnJheVRvTmF0aXZlKHMsIGUgPz8gdGhpcy5lbmRpYW5uZXNzKSwgdGhpcy5wb3NpdGlvbiArPSB0ICogNCwgczsKICAgIH07CiAgICB2YXIgZiA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5idWZmZXJzID0gW10sIHRoaXMuYnVmZmVySW5kZXggPSAtMSwgdCAmJiAodGhpcy5pbnNlcnRCdWZmZXIodCksIHRoaXMuYnVmZmVySW5kZXggPSAwKTsKICAgIH07CiAgICBmLnByb3RvdHlwZSA9IG5ldyBuKG5ldyBBcnJheUJ1ZmZlcigpLCAwLCBuLkJJR19FTkRJQU4pLCBmLnByb3RvdHlwZS5pbml0aWFsaXplZCA9IGZ1bmN0aW9uKCkgewogICAgICB2YXIgdDsKICAgICAgcmV0dXJuIHRoaXMuYnVmZmVySW5kZXggPiAtMSA/IHRydWUgOiB0aGlzLmJ1ZmZlcnMubGVuZ3RoID4gMCA/ICh0ID0gdGhpcy5idWZmZXJzWzBdLCB0LmZpbGVTdGFydCA9PT0gMCA/ICh0aGlzLmJ1ZmZlciA9IHQsIHRoaXMuYnVmZmVySW5kZXggPSAwLCBhLmRlYnVnKCJNdWx0aUJ1ZmZlclN0cmVhbSIsICJTdHJlYW0gcmVhZHkgZm9yIHBhcnNpbmciKSwgdHJ1ZSkgOiAoYS53YXJuKCJNdWx0aUJ1ZmZlclN0cmVhbSIsICJUaGUgZmlyc3QgYnVmZmVyIHNob3VsZCBoYXZlIGEgZmlsZVN0YXJ0IG9mIDAiKSwgdGhpcy5sb2dCdWZmZXJMZXZlbCgpLCBmYWxzZSkpIDogKGEud2FybigiTXVsdGlCdWZmZXJTdHJlYW0iLCAiTm8gYnVmZmVyIHRvIHN0YXJ0IHBhcnNpbmcgZnJvbSIpLCB0aGlzLmxvZ0J1ZmZlckxldmVsKCksIGZhbHNlKTsKICAgIH0sIEFycmF5QnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uKHQsIGUpIHsKICAgICAgYS5kZWJ1ZygiQXJyYXlCdWZmZXIiLCAiVHJ5aW5nIHRvIGNyZWF0ZSBhIG5ldyBidWZmZXIgb2Ygc2l6ZTogIiArICh0LmJ5dGVMZW5ndGggKyBlLmJ5dGVMZW5ndGgpKTsKICAgICAgdmFyIHMgPSBuZXcgVWludDhBcnJheSh0LmJ5dGVMZW5ndGggKyBlLmJ5dGVMZW5ndGgpOwogICAgICByZXR1cm4gcy5zZXQobmV3IFVpbnQ4QXJyYXkodCksIDApLCBzLnNldChuZXcgVWludDhBcnJheShlKSwgdC5ieXRlTGVuZ3RoKSwgcy5idWZmZXI7CiAgICB9LCBmLnByb3RvdHlwZS5yZWR1Y2VCdWZmZXIgPSBmdW5jdGlvbih0LCBlLCBzKSB7CiAgICAgIHZhciBoOwogICAgICByZXR1cm4gaCA9IG5ldyBVaW50OEFycmF5KHMpLCBoLnNldChuZXcgVWludDhBcnJheSh0LCBlLCBzKSksIGguYnVmZmVyLmZpbGVTdGFydCA9IHQuZmlsZVN0YXJ0ICsgZSwgaC5idWZmZXIudXNlZEJ5dGVzID0gMCwgaC5idWZmZXI7CiAgICB9LCBmLnByb3RvdHlwZS5pbnNlcnRCdWZmZXIgPSBmdW5jdGlvbih0KSB7CiAgICAgIGZvciAodmFyIGUgPSB0cnVlLCBzID0gMDsgcyA8IHRoaXMuYnVmZmVycy5sZW5ndGg7IHMrKykgewogICAgICAgIHZhciBoID0gdGhpcy5idWZmZXJzW3NdOwogICAgICAgIGlmICh0LmZpbGVTdGFydCA8PSBoLmZpbGVTdGFydCkgewogICAgICAgICAgaWYgKHQuZmlsZVN0YXJ0ID09PSBoLmZpbGVTdGFydCkKICAgICAgICAgICAgaWYgKHQuYnl0ZUxlbmd0aCA+IGguYnl0ZUxlbmd0aCkgewogICAgICAgICAgICAgIHRoaXMuYnVmZmVycy5zcGxpY2UocywgMSksIHMtLTsKICAgICAgICAgICAgICBjb250aW51ZTsKICAgICAgICAgICAgfSBlbHNlCiAgICAgICAgICAgICAgYS53YXJuKCJNdWx0aUJ1ZmZlclN0cmVhbSIsICJCdWZmZXIgKGZpbGVTdGFydDogIiArIHQuZmlsZVN0YXJ0ICsgIiAtIExlbmd0aDogIiArIHQuYnl0ZUxlbmd0aCArICIpIGFscmVhZHkgYXBwZW5kZWQsIGlnbm9yaW5nIik7CiAgICAgICAgICBlbHNlCiAgICAgICAgICAgIHQuZmlsZVN0YXJ0ICsgdC5ieXRlTGVuZ3RoIDw9IGguZmlsZVN0YXJ0IHx8ICh0ID0gdGhpcy5yZWR1Y2VCdWZmZXIodCwgMCwgaC5maWxlU3RhcnQgLSB0LmZpbGVTdGFydCkpLCBhLmRlYnVnKCJNdWx0aUJ1ZmZlclN0cmVhbSIsICJBcHBlbmRpbmcgbmV3IGJ1ZmZlciAoZmlsZVN0YXJ0OiAiICsgdC5maWxlU3RhcnQgKyAiIC0gTGVuZ3RoOiAiICsgdC5ieXRlTGVuZ3RoICsgIikiKSwgdGhpcy5idWZmZXJzLnNwbGljZShzLCAwLCB0KSwgcyA9PT0gMCAmJiAodGhpcy5idWZmZXIgPSB0KTsKICAgICAgICAgIGUgPSBmYWxzZTsKICAgICAgICAgIGJyZWFrOwogICAgICAgIH0gZWxzZSBpZiAodC5maWxlU3RhcnQgPCBoLmZpbGVTdGFydCArIGguYnl0ZUxlbmd0aCkgewogICAgICAgICAgdmFyIGwgPSBoLmZpbGVTdGFydCArIGguYnl0ZUxlbmd0aCAtIHQuZmlsZVN0YXJ0LCBwID0gdC5ieXRlTGVuZ3RoIC0gbDsKICAgICAgICAgIGlmIChwID4gMCkKICAgICAgICAgICAgdCA9IHRoaXMucmVkdWNlQnVmZmVyKHQsIGwsIHApOwogICAgICAgICAgZWxzZSB7CiAgICAgICAgICAgIGUgPSBmYWxzZTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9CiAgICAgIGUgJiYgKGEuZGVidWcoIk11bHRpQnVmZmVyU3RyZWFtIiwgIkFwcGVuZGluZyBuZXcgYnVmZmVyIChmaWxlU3RhcnQ6ICIgKyB0LmZpbGVTdGFydCArICIgLSBMZW5ndGg6ICIgKyB0LmJ5dGVMZW5ndGggKyAiKSIpLCB0aGlzLmJ1ZmZlcnMucHVzaCh0KSwgcyA9PT0gMCAmJiAodGhpcy5idWZmZXIgPSB0KSk7CiAgICB9LCBmLnByb3RvdHlwZS5sb2dCdWZmZXJMZXZlbCA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUsIHMsIGgsIGwsIHAgPSBbXSwgXywgbSA9ICIiOwogICAgICBmb3IgKGggPSAwLCBsID0gMCwgZSA9IDA7IGUgPCB0aGlzLmJ1ZmZlcnMubGVuZ3RoOyBlKyspCiAgICAgICAgcyA9IHRoaXMuYnVmZmVyc1tlXSwgZSA9PT0gMCA/IChfID0ge30sIHAucHVzaChfKSwgXy5zdGFydCA9IHMuZmlsZVN0YXJ0LCBfLmVuZCA9IHMuZmlsZVN0YXJ0ICsgcy5ieXRlTGVuZ3RoLCBtICs9ICJbIiArIF8uc3RhcnQgKyAiLSIpIDogXy5lbmQgPT09IHMuZmlsZVN0YXJ0ID8gXy5lbmQgPSBzLmZpbGVTdGFydCArIHMuYnl0ZUxlbmd0aCA6IChfID0ge30sIF8uc3RhcnQgPSBzLmZpbGVTdGFydCwgbSArPSBwW3AubGVuZ3RoIC0gMV0uZW5kIC0gMSArICJdLCBbIiArIF8uc3RhcnQgKyAiLSIsIF8uZW5kID0gcy5maWxlU3RhcnQgKyBzLmJ5dGVMZW5ndGgsIHAucHVzaChfKSksIGggKz0gcy51c2VkQnl0ZXMsIGwgKz0gcy5ieXRlTGVuZ3RoOwogICAgICBwLmxlbmd0aCA+IDAgJiYgKG0gKz0gXy5lbmQgLSAxICsgIl0iKTsKICAgICAgdmFyIHcgPSB0ID8gYS5pbmZvIDogYS5kZWJ1ZzsKICAgICAgdGhpcy5idWZmZXJzLmxlbmd0aCA9PT0gMCA/IHcoIk11bHRpQnVmZmVyU3RyZWFtIiwgIk5vIG1vcmUgYnVmZmVyIGluIG1lbW9yeSIpIDogdygiTXVsdGlCdWZmZXJTdHJlYW0iLCAiIiArIHRoaXMuYnVmZmVycy5sZW5ndGggKyAiIHN0b3JlZCBidWZmZXIocykgKCIgKyBoICsgIi8iICsgbCArICIgYnl0ZXMpLCBjb250aW51b3VzIHJhbmdlczogIiArIG0pOwogICAgfSwgZi5wcm90b3R5cGUuY2xlYW5CdWZmZXJzID0gZnVuY3Rpb24oKSB7CiAgICAgIHZhciB0LCBlOwogICAgICBmb3IgKHQgPSAwOyB0IDwgdGhpcy5idWZmZXJzLmxlbmd0aDsgdCsrKQogICAgICAgIGUgPSB0aGlzLmJ1ZmZlcnNbdF0sIGUudXNlZEJ5dGVzID09PSBlLmJ5dGVMZW5ndGggJiYgKGEuZGVidWcoIk11bHRpQnVmZmVyU3RyZWFtIiwgIlJlbW92aW5nIGJ1ZmZlciAjIiArIHQpLCB0aGlzLmJ1ZmZlcnMuc3BsaWNlKHQsIDEpLCB0LS0pOwogICAgfSwgZi5wcm90b3R5cGUubWVyZ2VOZXh0QnVmZmVyID0gZnVuY3Rpb24oKSB7CiAgICAgIHZhciB0OwogICAgICBpZiAodGhpcy5idWZmZXJJbmRleCArIDEgPCB0aGlzLmJ1ZmZlcnMubGVuZ3RoKQogICAgICAgIGlmICh0ID0gdGhpcy5idWZmZXJzW3RoaXMuYnVmZmVySW5kZXggKyAxXSwgdC5maWxlU3RhcnQgPT09IHRoaXMuYnVmZmVyLmZpbGVTdGFydCArIHRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpIHsKICAgICAgICAgIHZhciBlID0gdGhpcy5idWZmZXIuYnl0ZUxlbmd0aCwgcyA9IHRoaXMuYnVmZmVyLnVzZWRCeXRlcywgaCA9IHRoaXMuYnVmZmVyLmZpbGVTdGFydDsKICAgICAgICAgIHJldHVybiB0aGlzLmJ1ZmZlcnNbdGhpcy5idWZmZXJJbmRleF0gPSBBcnJheUJ1ZmZlci5jb25jYXQodGhpcy5idWZmZXIsIHQpLCB0aGlzLmJ1ZmZlciA9IHRoaXMuYnVmZmVyc1t0aGlzLmJ1ZmZlckluZGV4XSwgdGhpcy5idWZmZXJzLnNwbGljZSh0aGlzLmJ1ZmZlckluZGV4ICsgMSwgMSksIHRoaXMuYnVmZmVyLnVzZWRCeXRlcyA9IHMsIHRoaXMuYnVmZmVyLmZpbGVTdGFydCA9IGgsIGEuZGVidWcoIklTT0ZpbGUiLCAiQ29uY2F0ZW5hdGluZyBidWZmZXIgZm9yIGJveCBwYXJzaW5nIChsZW5ndGg6ICIgKyBlICsgIi0+IiArIHRoaXMuYnVmZmVyLmJ5dGVMZW5ndGggKyAiKSIpLCB0cnVlOwogICAgICAgIH0gZWxzZQogICAgICAgICAgcmV0dXJuIGZhbHNlOwogICAgICBlbHNlCiAgICAgICAgcmV0dXJuIGZhbHNlOwogICAgfSwgZi5wcm90b3R5cGUuZmluZFBvc2l0aW9uID0gZnVuY3Rpb24odCwgZSwgcykgewogICAgICB2YXIgaCwgbCA9IG51bGwsIHAgPSAtMTsKICAgICAgZm9yICh0ID09PSB0cnVlID8gaCA9IDAgOiBoID0gdGhpcy5idWZmZXJJbmRleDsgaCA8IHRoaXMuYnVmZmVycy5sZW5ndGggJiYgKGwgPSB0aGlzLmJ1ZmZlcnNbaF0sIGwuZmlsZVN0YXJ0IDw9IGUpOyApIHsKICAgICAgICBwID0gaCwgcyAmJiAobC5maWxlU3RhcnQgKyBsLmJ5dGVMZW5ndGggPD0gZSA/IGwudXNlZEJ5dGVzID0gbC5ieXRlTGVuZ3RoIDogbC51c2VkQnl0ZXMgPSBlIC0gbC5maWxlU3RhcnQsIHRoaXMubG9nQnVmZmVyTGV2ZWwoKSk7CiAgICAgICAgaCsrOwogICAgICB9CiAgICAgIHJldHVybiBwICE9PSAtMSA/IChsID0gdGhpcy5idWZmZXJzW3BdLCBsLmZpbGVTdGFydCArIGwuYnl0ZUxlbmd0aCA+PSBlID8gKGEuZGVidWcoIk11bHRpQnVmZmVyU3RyZWFtIiwgIkZvdW5kIHBvc2l0aW9uIGluIGV4aXN0aW5nIGJ1ZmZlciAjIiArIHApLCBwKSA6IC0xKSA6IC0xOwogICAgfSwgZi5wcm90b3R5cGUuZmluZEVuZENvbnRpZ3VvdXNCdWYgPSBmdW5jdGlvbih0KSB7CiAgICAgIHZhciBlLCBzLCBoLCBsID0gdCAhPT0gdm9pZCAwID8gdCA6IHRoaXMuYnVmZmVySW5kZXg7CiAgICAgIGlmIChzID0gdGhpcy5idWZmZXJzW2xdLCB0aGlzLmJ1ZmZlcnMubGVuZ3RoID4gbCArIDEpCiAgICAgICAgZm9yIChlID0gbCArIDE7IGUgPCB0aGlzLmJ1ZmZlcnMubGVuZ3RoICYmIChoID0gdGhpcy5idWZmZXJzW2VdLCBoLmZpbGVTdGFydCA9PT0gcy5maWxlU3RhcnQgKyBzLmJ5dGVMZW5ndGgpOyBlKyspCiAgICAgICAgICBzID0gaDsKICAgICAgcmV0dXJuIHMuZmlsZVN0YXJ0ICsgcy5ieXRlTGVuZ3RoOwogICAgfSwgZi5wcm90b3R5cGUuZ2V0RW5kRmlsZVBvc2l0aW9uQWZ0ZXIgPSBmdW5jdGlvbih0KSB7CiAgICAgIHZhciBlID0gdGhpcy5maW5kUG9zaXRpb24odHJ1ZSwgdCwgZmFsc2UpOwogICAgICByZXR1cm4gZSAhPT0gLTEgPyB0aGlzLmZpbmRFbmRDb250aWd1b3VzQnVmKGUpIDogdDsKICAgIH0sIGYucHJvdG90eXBlLmFkZFVzZWRCeXRlcyA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5idWZmZXIudXNlZEJ5dGVzICs9IHQsIHRoaXMubG9nQnVmZmVyTGV2ZWwoKTsKICAgIH0sIGYucHJvdG90eXBlLnNldEFsbFVzZWRCeXRlcyA9IGZ1bmN0aW9uKCkgewogICAgICB0aGlzLmJ1ZmZlci51c2VkQnl0ZXMgPSB0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoLCB0aGlzLmxvZ0J1ZmZlckxldmVsKCk7CiAgICB9LCBmLnByb3RvdHlwZS5zZWVrID0gZnVuY3Rpb24odCwgZSwgcykgewogICAgICB2YXIgaDsKICAgICAgcmV0dXJuIGggPSB0aGlzLmZpbmRQb3NpdGlvbihlLCB0LCBzKSwgaCAhPT0gLTEgPyAodGhpcy5idWZmZXIgPSB0aGlzLmJ1ZmZlcnNbaF0sIHRoaXMuYnVmZmVySW5kZXggPSBoLCB0aGlzLnBvc2l0aW9uID0gdCAtIHRoaXMuYnVmZmVyLmZpbGVTdGFydCwgYS5kZWJ1ZygiTXVsdGlCdWZmZXJTdHJlYW0iLCAiUmVwb3NpdGlvbmluZyBwYXJzZXIgYXQgYnVmZmVyIHBvc2l0aW9uOiAiICsgdGhpcy5wb3NpdGlvbiksIHRydWUpIDogKGEuZGVidWcoIk11bHRpQnVmZmVyU3RyZWFtIiwgIlBvc2l0aW9uICIgKyB0ICsgIiBub3QgZm91bmQgaW4gYnVmZmVyZWQgZGF0YSIpLCBmYWxzZSk7CiAgICB9LCBmLnByb3RvdHlwZS5nZXRQb3NpdGlvbiA9IGZ1bmN0aW9uKCkgewogICAgICBpZiAodGhpcy5idWZmZXJJbmRleCA9PT0gLTEgfHwgdGhpcy5idWZmZXJzW3RoaXMuYnVmZmVySW5kZXhdID09PSBudWxsKQogICAgICAgIHRocm93ICJFcnJvciBhY2Nlc3NpbmcgcG9zaXRpb24gaW4gdGhlIE11bHRpQnVmZmVyU3RyZWFtIjsKICAgICAgcmV0dXJuIHRoaXMuYnVmZmVyc1t0aGlzLmJ1ZmZlckluZGV4XS5maWxlU3RhcnQgKyB0aGlzLnBvc2l0aW9uOwogICAgfSwgZi5wcm90b3R5cGUuZ2V0TGVuZ3RoID0gZnVuY3Rpb24oKSB7CiAgICAgIHJldHVybiB0aGlzLmJ5dGVMZW5ndGg7CiAgICB9LCBmLnByb3RvdHlwZS5nZXRFbmRQb3NpdGlvbiA9IGZ1bmN0aW9uKCkgewogICAgICBpZiAodGhpcy5idWZmZXJJbmRleCA9PT0gLTEgfHwgdGhpcy5idWZmZXJzW3RoaXMuYnVmZmVySW5kZXhdID09PSBudWxsKQogICAgICAgIHRocm93ICJFcnJvciBhY2Nlc3NpbmcgcG9zaXRpb24gaW4gdGhlIE11bHRpQnVmZmVyU3RyZWFtIjsKICAgICAgcmV0dXJuIHRoaXMuYnVmZmVyc1t0aGlzLmJ1ZmZlckluZGV4XS5maWxlU3RhcnQgKyB0aGlzLmJ5dGVMZW5ndGg7CiAgICB9LCBkLk11bHRpQnVmZmVyU3RyZWFtID0gZjsKICAgIHZhciBjID0gZnVuY3Rpb24oKSB7CiAgICAgIHZhciB0ID0gMywgZSA9IDQsIHMgPSA1LCBoID0gNiwgbCA9IFtdOwogICAgICBsW3RdID0gIkVTX0Rlc2NyaXB0b3IiLCBsW2VdID0gIkRlY29kZXJDb25maWdEZXNjcmlwdG9yIiwgbFtzXSA9ICJEZWNvZGVyU3BlY2lmaWNJbmZvIiwgbFtoXSA9ICJTTENvbmZpZ0Rlc2NyaXB0b3IiLCB0aGlzLmdldERlc2NyaXB0b3JOYW1lID0gZnVuY3Rpb24obSkgewogICAgICAgIHJldHVybiBsW21dOwogICAgICB9OwogICAgICB2YXIgcCA9IHRoaXMsIF8gPSB7fTsKICAgICAgcmV0dXJuIHRoaXMucGFyc2VPbmVEZXNjcmlwdG9yID0gZnVuY3Rpb24obSkgewogICAgICAgIHZhciB3ID0gMCwgUywgRSwgSTsKICAgICAgICBmb3IgKFMgPSBtLnJlYWRVaW50OCgpLCBJID0gbS5yZWFkVWludDgoKTsgSSAmIDEyODsgKQogICAgICAgICAgdyA9IChJICYgMTI3KSA8PCA3LCBJID0gbS5yZWFkVWludDgoKTsKICAgICAgICByZXR1cm4gdyArPSBJICYgMTI3LCBhLmRlYnVnKCJNUEVHNERlc2NyaXB0b3JQYXJzZXIiLCAiRm91bmQgIiArIChsW1NdIHx8ICJEZXNjcmlwdG9yICIgKyBTKSArICIsIHNpemUgIiArIHcgKyAiIGF0IHBvc2l0aW9uICIgKyBtLmdldFBvc2l0aW9uKCkpLCBsW1NdID8gRSA9IG5ldyBfW2xbU11dKHcpIDogRSA9IG5ldyBfLkRlc2NyaXB0b3IodyksIEUucGFyc2UobSksIEU7CiAgICAgIH0sIF8uRGVzY3JpcHRvciA9IGZ1bmN0aW9uKG0sIHcpIHsKICAgICAgICB0aGlzLnRhZyA9IG0sIHRoaXMuc2l6ZSA9IHcsIHRoaXMuZGVzY3MgPSBbXTsKICAgICAgfSwgXy5EZXNjcmlwdG9yLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKG0pIHsKICAgICAgICB0aGlzLmRhdGEgPSBtLnJlYWRVaW50OEFycmF5KHRoaXMuc2l6ZSk7CiAgICAgIH0sIF8uRGVzY3JpcHRvci5wcm90b3R5cGUuZmluZERlc2NyaXB0b3IgPSBmdW5jdGlvbihtKSB7CiAgICAgICAgZm9yICh2YXIgdyA9IDA7IHcgPCB0aGlzLmRlc2NzLmxlbmd0aDsgdysrKQogICAgICAgICAgaWYgKHRoaXMuZGVzY3Nbd10udGFnID09IG0pCiAgICAgICAgICAgIHJldHVybiB0aGlzLmRlc2NzW3ddOwogICAgICAgIHJldHVybiBudWxsOwogICAgICB9LCBfLkRlc2NyaXB0b3IucHJvdG90eXBlLnBhcnNlUmVtYWluaW5nRGVzY3JpcHRvcnMgPSBmdW5jdGlvbihtKSB7CiAgICAgICAgZm9yICh2YXIgdyA9IG0ucG9zaXRpb247IG0ucG9zaXRpb24gPCB3ICsgdGhpcy5zaXplOyApIHsKICAgICAgICAgIHZhciBTID0gcC5wYXJzZU9uZURlc2NyaXB0b3IobSk7CiAgICAgICAgICB0aGlzLmRlc2NzLnB1c2goUyk7CiAgICAgICAgfQogICAgICB9LCBfLkVTX0Rlc2NyaXB0b3IgPSBmdW5jdGlvbihtKSB7CiAgICAgICAgXy5EZXNjcmlwdG9yLmNhbGwodGhpcywgdCwgbSk7CiAgICAgIH0sIF8uRVNfRGVzY3JpcHRvci5wcm90b3R5cGUgPSBuZXcgXy5EZXNjcmlwdG9yKCksIF8uRVNfRGVzY3JpcHRvci5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbihtKSB7CiAgICAgICAgaWYgKHRoaXMuRVNfSUQgPSBtLnJlYWRVaW50MTYoKSwgdGhpcy5mbGFncyA9IG0ucmVhZFVpbnQ4KCksIHRoaXMuc2l6ZSAtPSAzLCB0aGlzLmZsYWdzICYgMTI4ID8gKHRoaXMuZGVwZW5kc09uX0VTX0lEID0gbS5yZWFkVWludDE2KCksIHRoaXMuc2l6ZSAtPSAyKSA6IHRoaXMuZGVwZW5kc09uX0VTX0lEID0gMCwgdGhpcy5mbGFncyAmIDY0KSB7CiAgICAgICAgICB2YXIgdyA9IG0ucmVhZFVpbnQ4KCk7CiAgICAgICAgICB0aGlzLlVSTCA9IG0ucmVhZFN0cmluZyh3KSwgdGhpcy5zaXplIC09IHcgKyAxOwogICAgICAgIH0gZWxzZQogICAgICAgICAgdGhpcy5VUkwgPSAiIjsKICAgICAgICB0aGlzLmZsYWdzICYgMzIgPyAodGhpcy5PQ1JfRVNfSUQgPSBtLnJlYWRVaW50MTYoKSwgdGhpcy5zaXplIC09IDIpIDogdGhpcy5PQ1JfRVNfSUQgPSAwLCB0aGlzLnBhcnNlUmVtYWluaW5nRGVzY3JpcHRvcnMobSk7CiAgICAgIH0sIF8uRVNfRGVzY3JpcHRvci5wcm90b3R5cGUuZ2V0T1RJID0gZnVuY3Rpb24obSkgewogICAgICAgIHZhciB3ID0gdGhpcy5maW5kRGVzY3JpcHRvcihlKTsKICAgICAgICByZXR1cm4gdyA/IHcub3RpIDogMDsKICAgICAgfSwgXy5FU19EZXNjcmlwdG9yLnByb3RvdHlwZS5nZXRBdWRpb0NvbmZpZyA9IGZ1bmN0aW9uKG0pIHsKICAgICAgICB2YXIgdyA9IHRoaXMuZmluZERlc2NyaXB0b3IoZSk7CiAgICAgICAgaWYgKCF3KQogICAgICAgICAgcmV0dXJuIG51bGw7CiAgICAgICAgdmFyIFMgPSB3LmZpbmREZXNjcmlwdG9yKHMpOwogICAgICAgIGlmIChTICYmIFMuZGF0YSkgewogICAgICAgICAgdmFyIEUgPSAoUy5kYXRhWzBdICYgMjQ4KSA+PiAzOwogICAgICAgICAgcmV0dXJuIEUgPT09IDMxICYmIFMuZGF0YS5sZW5ndGggPj0gMiAmJiAoRSA9IDMyICsgKChTLmRhdGFbMF0gJiA3KSA8PCAzKSArICgoUy5kYXRhWzFdICYgMjI0KSA+PiA1KSksIEU7CiAgICAgICAgfSBlbHNlCiAgICAgICAgICByZXR1cm4gbnVsbDsKICAgICAgfSwgXy5EZWNvZGVyQ29uZmlnRGVzY3JpcHRvciA9IGZ1bmN0aW9uKG0pIHsKICAgICAgICBfLkRlc2NyaXB0b3IuY2FsbCh0aGlzLCBlLCBtKTsKICAgICAgfSwgXy5EZWNvZGVyQ29uZmlnRGVzY3JpcHRvci5wcm90b3R5cGUgPSBuZXcgXy5EZXNjcmlwdG9yKCksIF8uRGVjb2RlckNvbmZpZ0Rlc2NyaXB0b3IucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24obSkgewogICAgICAgIHRoaXMub3RpID0gbS5yZWFkVWludDgoKSwgdGhpcy5zdHJlYW1UeXBlID0gbS5yZWFkVWludDgoKSwgdGhpcy5idWZmZXJTaXplID0gbS5yZWFkVWludDI0KCksIHRoaXMubWF4Qml0cmF0ZSA9IG0ucmVhZFVpbnQzMigpLCB0aGlzLmF2Z0JpdHJhdGUgPSBtLnJlYWRVaW50MzIoKSwgdGhpcy5zaXplIC09IDEzLCB0aGlzLnBhcnNlUmVtYWluaW5nRGVzY3JpcHRvcnMobSk7CiAgICAgIH0sIF8uRGVjb2RlclNwZWNpZmljSW5mbyA9IGZ1bmN0aW9uKG0pIHsKICAgICAgICBfLkRlc2NyaXB0b3IuY2FsbCh0aGlzLCBzLCBtKTsKICAgICAgfSwgXy5EZWNvZGVyU3BlY2lmaWNJbmZvLnByb3RvdHlwZSA9IG5ldyBfLkRlc2NyaXB0b3IoKSwgXy5TTENvbmZpZ0Rlc2NyaXB0b3IgPSBmdW5jdGlvbihtKSB7CiAgICAgICAgXy5EZXNjcmlwdG9yLmNhbGwodGhpcywgaCwgbSk7CiAgICAgIH0sIF8uU0xDb25maWdEZXNjcmlwdG9yLnByb3RvdHlwZSA9IG5ldyBfLkRlc2NyaXB0b3IoKSwgdGhpczsKICAgIH07CiAgICBkLk1QRUc0RGVzY3JpcHRvclBhcnNlciA9IGM7CiAgICB2YXIgciA9IHsKICAgICAgRVJSX0lOVkFMSURfREFUQTogLTEsCiAgICAgIEVSUl9OT1RfRU5PVUdIX0RBVEE6IDAsCiAgICAgIE9LOiAxLAogICAgICAvLyBCb3hlcyB0byBiZSBjcmVhdGVkIHdpdGggZGVmYXVsdCBwYXJzaW5nCiAgICAgIEJBU0lDX0JPWEVTOiBbIm1kYXQiLCAiaWRhdCIsICJmcmVlIiwgInNraXAiLCAibWVjbyIsICJzdHJrIl0sCiAgICAgIEZVTExfQk9YRVM6IFsiaG1oZCIsICJubWhkIiwgImlvZHMiLCAieG1sICIsICJieG1sIiwgImlwcm8iLCAibWVyZSJdLAogICAgICBDT05UQUlORVJfQk9YRVM6IFsKICAgICAgICBbIm1vb3YiLCBbInRyYWsiLCAicHNzaCJdXSwKICAgICAgICBbInRyYWsiXSwKICAgICAgICBbImVkdHMiXSwKICAgICAgICBbIm1kaWEiXSwKICAgICAgICBbIm1pbmYiXSwKICAgICAgICBbImRpbmYiXSwKICAgICAgICBbInN0YmwiLCBbInNncGQiLCAic2JncCJdXSwKICAgICAgICBbIm12ZXgiLCBbInRyZXgiXV0sCiAgICAgICAgWyJtb29mIiwgWyJ0cmFmIl1dLAogICAgICAgIFsidHJhZiIsIFsidHJ1biIsICJzZ3BkIiwgInNiZ3AiXV0sCiAgICAgICAgWyJ2dHRjIl0sCiAgICAgICAgWyJ0cmVmIl0sCiAgICAgICAgWyJpcmVmIl0sCiAgICAgICAgWyJtZnJhIiwgWyJ0ZnJhIl1dLAogICAgICAgIFsibWVjbyJdLAogICAgICAgIFsiaG50aSJdLAogICAgICAgIFsiaGluZiJdLAogICAgICAgIFsic3RyayJdLAogICAgICAgIFsic3RyZCJdLAogICAgICAgIFsic2luZiJdLAogICAgICAgIFsicmluZiJdLAogICAgICAgIFsic2NoaSJdLAogICAgICAgIFsidHJnciJdLAogICAgICAgIFsidWR0YSIsIFsia2luZCJdXSwKICAgICAgICBbImlwcnAiLCBbImlwbWEiXV0sCiAgICAgICAgWyJpcGNvIl0sCiAgICAgICAgWyJncnBsIl0sCiAgICAgICAgWyJqMmtIIl0sCiAgICAgICAgWyJldHlwIiwgWyJ0eWNvIl1dCiAgICAgIF0sCiAgICAgIC8vIEJveGVzIGVmZmVjdGl2ZWx5IGNyZWF0ZWQKICAgICAgYm94Q29kZXM6IFtdLAogICAgICBmdWxsQm94Q29kZXM6IFtdLAogICAgICBjb250YWluZXJCb3hDb2RlczogW10sCiAgICAgIHNhbXBsZUVudHJ5Q29kZXM6IHt9LAogICAgICBzYW1wbGVHcm91cEVudHJ5Q29kZXM6IFtdLAogICAgICB0cmFja0dyb3VwVHlwZXM6IFtdLAogICAgICBVVUlEQm94ZXM6IHt9LAogICAgICBVVUlEczogW10sCiAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkgewogICAgICAgIHIuRnVsbEJveC5wcm90b3R5cGUgPSBuZXcgci5Cb3goKSwgci5Db250YWluZXJCb3gucHJvdG90eXBlID0gbmV3IHIuQm94KCksIHIuU2FtcGxlRW50cnkucHJvdG90eXBlID0gbmV3IHIuQm94KCksIHIuVHJhY2tHcm91cFR5cGVCb3gucHJvdG90eXBlID0gbmV3IHIuRnVsbEJveCgpLCByLkJBU0lDX0JPWEVTLmZvckVhY2goZnVuY3Rpb24odCkgewogICAgICAgICAgci5jcmVhdGVCb3hDdG9yKHQpOwogICAgICAgIH0pLCByLkZVTExfQk9YRVMuZm9yRWFjaChmdW5jdGlvbih0KSB7CiAgICAgICAgICByLmNyZWF0ZUZ1bGxCb3hDdG9yKHQpOwogICAgICAgIH0pLCByLkNPTlRBSU5FUl9CT1hFUy5mb3JFYWNoKGZ1bmN0aW9uKHQpIHsKICAgICAgICAgIHIuY3JlYXRlQ29udGFpbmVyQm94Q3Rvcih0WzBdLCBudWxsLCB0WzFdKTsKICAgICAgICB9KTsKICAgICAgfSwKICAgICAgQm94OiBmdW5jdGlvbih0LCBlLCBzKSB7CiAgICAgICAgdGhpcy50eXBlID0gdCwgdGhpcy5zaXplID0gZSwgdGhpcy51dWlkID0gczsKICAgICAgfSwKICAgICAgRnVsbEJveDogZnVuY3Rpb24odCwgZSwgcykgewogICAgICAgIHIuQm94LmNhbGwodGhpcywgdCwgZSwgcyksIHRoaXMuZmxhZ3MgPSAwLCB0aGlzLnZlcnNpb24gPSAwOwogICAgICB9LAogICAgICBDb250YWluZXJCb3g6IGZ1bmN0aW9uKHQsIGUsIHMpIHsKICAgICAgICByLkJveC5jYWxsKHRoaXMsIHQsIGUsIHMpLCB0aGlzLmJveGVzID0gW107CiAgICAgIH0sCiAgICAgIFNhbXBsZUVudHJ5OiBmdW5jdGlvbih0LCBlLCBzLCBoKSB7CiAgICAgICAgci5Db250YWluZXJCb3guY2FsbCh0aGlzLCB0LCBlKSwgdGhpcy5oZHJfc2l6ZSA9IHMsIHRoaXMuc3RhcnQgPSBoOwogICAgICB9LAogICAgICBTYW1wbGVHcm91cEVudHJ5OiBmdW5jdGlvbih0KSB7CiAgICAgICAgdGhpcy5ncm91cGluZ190eXBlID0gdDsKICAgICAgfSwKICAgICAgVHJhY2tHcm91cFR5cGVCb3g6IGZ1bmN0aW9uKHQsIGUpIHsKICAgICAgICByLkZ1bGxCb3guY2FsbCh0aGlzLCB0LCBlKTsKICAgICAgfSwKICAgICAgY3JlYXRlQm94Q3RvcjogZnVuY3Rpb24odCwgZSkgewogICAgICAgIHIuYm94Q29kZXMucHVzaCh0KSwgclt0ICsgIkJveCJdID0gZnVuY3Rpb24ocykgewogICAgICAgICAgci5Cb3guY2FsbCh0aGlzLCB0LCBzKTsKICAgICAgICB9LCByW3QgKyAiQm94Il0ucHJvdG90eXBlID0gbmV3IHIuQm94KCksIGUgJiYgKHJbdCArICJCb3giXS5wcm90b3R5cGUucGFyc2UgPSBlKTsKICAgICAgfSwKICAgICAgY3JlYXRlRnVsbEJveEN0b3I6IGZ1bmN0aW9uKHQsIGUpIHsKICAgICAgICByW3QgKyAiQm94Il0gPSBmdW5jdGlvbihzKSB7CiAgICAgICAgICByLkZ1bGxCb3guY2FsbCh0aGlzLCB0LCBzKTsKICAgICAgICB9LCByW3QgKyAiQm94Il0ucHJvdG90eXBlID0gbmV3IHIuRnVsbEJveCgpLCByW3QgKyAiQm94Il0ucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24ocykgewogICAgICAgICAgdGhpcy5wYXJzZUZ1bGxIZWFkZXIocyksIGUgJiYgZS5jYWxsKHRoaXMsIHMpOwogICAgICAgIH07CiAgICAgIH0sCiAgICAgIGFkZFN1YkJveEFycmF5czogZnVuY3Rpb24odCkgewogICAgICAgIGlmICh0KSB7CiAgICAgICAgICB0aGlzLnN1YkJveE5hbWVzID0gdDsKICAgICAgICAgIGZvciAodmFyIGUgPSB0Lmxlbmd0aCwgcyA9IDA7IHMgPCBlOyBzKyspCiAgICAgICAgICAgIHRoaXNbdFtzXSArICJzIl0gPSBbXTsKICAgICAgICB9CiAgICAgIH0sCiAgICAgIGNyZWF0ZUNvbnRhaW5lckJveEN0b3I6IGZ1bmN0aW9uKHQsIGUsIHMpIHsKICAgICAgICByW3QgKyAiQm94Il0gPSBmdW5jdGlvbihoKSB7CiAgICAgICAgICByLkNvbnRhaW5lckJveC5jYWxsKHRoaXMsIHQsIGgpLCByLmFkZFN1YkJveEFycmF5cy5jYWxsKHRoaXMsIHMpOwogICAgICAgIH0sIHJbdCArICJCb3giXS5wcm90b3R5cGUgPSBuZXcgci5Db250YWluZXJCb3goKSwgZSAmJiAoclt0ICsgIkJveCJdLnByb3RvdHlwZS5wYXJzZSA9IGUpOwogICAgICB9LAogICAgICBjcmVhdGVNZWRpYVNhbXBsZUVudHJ5Q3RvcjogZnVuY3Rpb24odCwgZSwgcykgewogICAgICAgIHIuc2FtcGxlRW50cnlDb2Rlc1t0XSA9IFtdLCByW3QgKyAiU2FtcGxlRW50cnkiXSA9IGZ1bmN0aW9uKGgsIGwpIHsKICAgICAgICAgIHIuU2FtcGxlRW50cnkuY2FsbCh0aGlzLCBoLCBsKSwgci5hZGRTdWJCb3hBcnJheXMuY2FsbCh0aGlzLCBzKTsKICAgICAgICB9LCByW3QgKyAiU2FtcGxlRW50cnkiXS5wcm90b3R5cGUgPSBuZXcgci5TYW1wbGVFbnRyeSgpLCBlICYmIChyW3QgKyAiU2FtcGxlRW50cnkiXS5wcm90b3R5cGUucGFyc2UgPSBlKTsKICAgICAgfSwKICAgICAgY3JlYXRlU2FtcGxlRW50cnlDdG9yOiBmdW5jdGlvbih0LCBlLCBzLCBoKSB7CiAgICAgICAgci5zYW1wbGVFbnRyeUNvZGVzW3RdLnB1c2goZSksIHJbZSArICJTYW1wbGVFbnRyeSJdID0gZnVuY3Rpb24obCkgewogICAgICAgICAgclt0ICsgIlNhbXBsZUVudHJ5Il0uY2FsbCh0aGlzLCBlLCBsKSwgci5hZGRTdWJCb3hBcnJheXMuY2FsbCh0aGlzLCBoKTsKICAgICAgICB9LCByW2UgKyAiU2FtcGxlRW50cnkiXS5wcm90b3R5cGUgPSBuZXcgclt0ICsgIlNhbXBsZUVudHJ5Il0oKSwgcyAmJiAocltlICsgIlNhbXBsZUVudHJ5Il0ucHJvdG90eXBlLnBhcnNlID0gcyk7CiAgICAgIH0sCiAgICAgIGNyZWF0ZUVuY3J5cHRlZFNhbXBsZUVudHJ5Q3RvcjogZnVuY3Rpb24odCwgZSwgcykgewogICAgICAgIHIuY3JlYXRlU2FtcGxlRW50cnlDdG9yLmNhbGwodGhpcywgdCwgZSwgcywgWyJzaW5mIl0pOwogICAgICB9LAogICAgICBjcmVhdGVTYW1wbGVHcm91cEN0b3I6IGZ1bmN0aW9uKHQsIGUpIHsKICAgICAgICByW3QgKyAiU2FtcGxlR3JvdXBFbnRyeSJdID0gZnVuY3Rpb24ocykgewogICAgICAgICAgci5TYW1wbGVHcm91cEVudHJ5LmNhbGwodGhpcywgdCwgcyk7CiAgICAgICAgfSwgclt0ICsgIlNhbXBsZUdyb3VwRW50cnkiXS5wcm90b3R5cGUgPSBuZXcgci5TYW1wbGVHcm91cEVudHJ5KCksIGUgJiYgKHJbdCArICJTYW1wbGVHcm91cEVudHJ5Il0ucHJvdG90eXBlLnBhcnNlID0gZSk7CiAgICAgIH0sCiAgICAgIGNyZWF0ZVRyYWNrR3JvdXBDdG9yOiBmdW5jdGlvbih0LCBlKSB7CiAgICAgICAgclt0ICsgIlRyYWNrR3JvdXBUeXBlQm94Il0gPSBmdW5jdGlvbihzKSB7CiAgICAgICAgICByLlRyYWNrR3JvdXBUeXBlQm94LmNhbGwodGhpcywgdCwgcyk7CiAgICAgICAgfSwgclt0ICsgIlRyYWNrR3JvdXBUeXBlQm94Il0ucHJvdG90eXBlID0gbmV3IHIuVHJhY2tHcm91cFR5cGVCb3goKSwgZSAmJiAoclt0ICsgIlRyYWNrR3JvdXBUeXBlQm94Il0ucHJvdG90eXBlLnBhcnNlID0gZSk7CiAgICAgIH0sCiAgICAgIGNyZWF0ZVVVSURCb3g6IGZ1bmN0aW9uKHQsIGUsIHMsIGgpIHsKICAgICAgICByLlVVSURzLnB1c2godCksIHIuVVVJREJveGVzW3RdID0gZnVuY3Rpb24obCkgewogICAgICAgICAgZSA/IHIuRnVsbEJveC5jYWxsKHRoaXMsICJ1dWlkIiwgbCwgdCkgOiBzID8gci5Db250YWluZXJCb3guY2FsbCh0aGlzLCAidXVpZCIsIGwsIHQpIDogci5Cb3guY2FsbCh0aGlzLCAidXVpZCIsIGwsIHQpOwogICAgICAgIH0sIHIuVVVJREJveGVzW3RdLnByb3RvdHlwZSA9IGUgPyBuZXcgci5GdWxsQm94KCkgOiBzID8gbmV3IHIuQ29udGFpbmVyQm94KCkgOiBuZXcgci5Cb3goKSwgaCAmJiAoZSA/IHIuVVVJREJveGVzW3RdLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKGwpIHsKICAgICAgICAgIHRoaXMucGFyc2VGdWxsSGVhZGVyKGwpLCBoICYmIGguY2FsbCh0aGlzLCBsKTsKICAgICAgICB9IDogci5VVUlEQm94ZXNbdF0ucHJvdG90eXBlLnBhcnNlID0gaCk7CiAgICAgIH0KICAgIH07CiAgICByLmluaXRpYWxpemUoKSwgci5US0hEX0ZMQUdfRU5BQkxFRCA9IDEsIHIuVEtIRF9GTEFHX0lOX01PVklFID0gMiwgci5US0hEX0ZMQUdfSU5fUFJFVklFVyA9IDQsIHIuVEZIRF9GTEFHX0JBU0VfREFUQV9PRkZTRVQgPSAxLCByLlRGSERfRkxBR19TQU1QTEVfREVTQyA9IDIsIHIuVEZIRF9GTEFHX1NBTVBMRV9EVVIgPSA4LCByLlRGSERfRkxBR19TQU1QTEVfU0laRSA9IDE2LCByLlRGSERfRkxBR19TQU1QTEVfRkxBR1MgPSAzMiwgci5URkhEX0ZMQUdfRFVSX0VNUFRZID0gNjU1MzYsIHIuVEZIRF9GTEFHX0RFRkFVTFRfQkFTRV9JU19NT09GID0gMTMxMDcyLCByLlRSVU5fRkxBR1NfREFUQV9PRkZTRVQgPSAxLCByLlRSVU5fRkxBR1NfRklSU1RfRkxBRyA9IDQsIHIuVFJVTl9GTEFHU19EVVJBVElPTiA9IDI1Niwgci5UUlVOX0ZMQUdTX1NJWkUgPSA1MTIsIHIuVFJVTl9GTEFHU19GTEFHUyA9IDEwMjQsIHIuVFJVTl9GTEFHU19DVFNfT0ZGU0VUID0gMjA0OCwgci5Cb3gucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHQpIHsKICAgICAgcmV0dXJuIHRoaXMuYWRkQm94KG5ldyByW3QgKyAiQm94Il0oKSk7CiAgICB9LCByLkJveC5wcm90b3R5cGUuYWRkQm94ID0gZnVuY3Rpb24odCkgewogICAgICByZXR1cm4gdGhpcy5ib3hlcy5wdXNoKHQpLCB0aGlzW3QudHlwZSArICJzIl0gPyB0aGlzW3QudHlwZSArICJzIl0ucHVzaCh0KSA6IHRoaXNbdC50eXBlXSA9IHQsIHQ7CiAgICB9LCByLkJveC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24odCwgZSkgewogICAgICByZXR1cm4gdGhpc1t0XSA9IGUsIHRoaXM7CiAgICB9LCByLkJveC5wcm90b3R5cGUuYWRkRW50cnkgPSBmdW5jdGlvbih0LCBlKSB7CiAgICAgIHZhciBzID0gZSB8fCAiZW50cmllcyI7CiAgICAgIHJldHVybiB0aGlzW3NdIHx8ICh0aGlzW3NdID0gW10pLCB0aGlzW3NdLnB1c2godCksIHRoaXM7CiAgICB9LCBkLkJveFBhcnNlciA9IHIsIHIucGFyc2VVVUlEID0gZnVuY3Rpb24odCkgewogICAgICByZXR1cm4gci5wYXJzZUhleDE2KHQpOwogICAgfSwgci5wYXJzZUhleDE2ID0gZnVuY3Rpb24odCkgewogICAgICBmb3IgKHZhciBlID0gIiIsIHMgPSAwOyBzIDwgMTY7IHMrKykgewogICAgICAgIHZhciBoID0gdC5yZWFkVWludDgoKS50b1N0cmluZygxNik7CiAgICAgICAgZSArPSBoLmxlbmd0aCA9PT0gMSA/ICIwIiArIGggOiBoOwogICAgICB9CiAgICAgIHJldHVybiBlOwogICAgfSwgci5wYXJzZU9uZUJveCA9IGZ1bmN0aW9uKHQsIGUsIHMpIHsKICAgICAgdmFyIGgsIGwgPSB0LmdldFBvc2l0aW9uKCksIHAgPSAwLCBfLCBtOwogICAgICBpZiAodC5nZXRFbmRQb3NpdGlvbigpIC0gbCA8IDgpCiAgICAgICAgcmV0dXJuIGEuZGVidWcoIkJveFBhcnNlciIsICJOb3QgZW5vdWdoIGRhdGEgaW4gc3RyZWFtIHRvIHBhcnNlIHRoZSB0eXBlIGFuZCBzaXplIG9mIHRoZSBib3giKSwgeyBjb2RlOiByLkVSUl9OT1RfRU5PVUdIX0RBVEEgfTsKICAgICAgaWYgKHMgJiYgcyA8IDgpCiAgICAgICAgcmV0dXJuIGEuZGVidWcoIkJveFBhcnNlciIsICJOb3QgZW5vdWdoIGJ5dGVzIGxlZnQgaW4gdGhlIHBhcmVudCBib3ggdG8gcGFyc2UgYSBuZXcgYm94IiksIHsgY29kZTogci5FUlJfTk9UX0VOT1VHSF9EQVRBIH07CiAgICAgIHZhciB3ID0gdC5yZWFkVWludDMyKCksIFMgPSB0LnJlYWRTdHJpbmcoNCksIEUgPSBTOwogICAgICBpZiAoYS5kZWJ1ZygiQm94UGFyc2VyIiwgIkZvdW5kIGJveCBvZiB0eXBlICciICsgUyArICInIGFuZCBzaXplICIgKyB3ICsgIiBhdCBwb3NpdGlvbiAiICsgbCksIHAgPSA4LCBTID09ICJ1dWlkIikgewogICAgICAgIGlmICh0LmdldEVuZFBvc2l0aW9uKCkgLSB0LmdldFBvc2l0aW9uKCkgPCAxNiB8fCBzIC0gcCA8IDE2KQogICAgICAgICAgcmV0dXJuIHQuc2VlayhsKSwgYS5kZWJ1ZygiQm94UGFyc2VyIiwgIk5vdCBlbm91Z2ggYnl0ZXMgbGVmdCBpbiB0aGUgcGFyZW50IGJveCB0byBwYXJzZSBhIFVVSUQgYm94IiksIHsgY29kZTogci5FUlJfTk9UX0VOT1VHSF9EQVRBIH07CiAgICAgICAgbSA9IHIucGFyc2VVVUlEKHQpLCBwICs9IDE2LCBFID0gbTsKICAgICAgfQogICAgICBpZiAodyA9PSAxKSB7CiAgICAgICAgaWYgKHQuZ2V0RW5kUG9zaXRpb24oKSAtIHQuZ2V0UG9zaXRpb24oKSA8IDggfHwgcyAmJiBzIC0gcCA8IDgpCiAgICAgICAgICByZXR1cm4gdC5zZWVrKGwpLCBhLndhcm4oIkJveFBhcnNlciIsICdOb3QgZW5vdWdoIGRhdGEgaW4gc3RyZWFtIHRvIHBhcnNlIHRoZSBleHRlbmRlZCBzaXplIG9mIHRoZSAiJyArIFMgKyAnIiBib3gnKSwgeyBjb2RlOiByLkVSUl9OT1RfRU5PVUdIX0RBVEEgfTsKICAgICAgICB3ID0gdC5yZWFkVWludDY0KCksIHAgKz0gODsKICAgICAgfSBlbHNlIGlmICh3ID09PSAwKSB7CiAgICAgICAgaWYgKHMpCiAgICAgICAgICB3ID0gczsKICAgICAgICBlbHNlIGlmIChTICE9PSAibWRhdCIpCiAgICAgICAgICByZXR1cm4gYS5lcnJvcigiQm94UGFyc2VyIiwgIlVubGltaXRlZCBib3ggc2l6ZSBub3Qgc3VwcG9ydGVkIGZvciB0eXBlOiAnIiArIFMgKyAiJyIpLCBoID0gbmV3IHIuQm94KFMsIHcpLCB7IGNvZGU6IHIuT0ssIGJveDogaCwgc2l6ZTogaC5zaXplIH07CiAgICAgIH0KICAgICAgcmV0dXJuIHcgIT09IDAgJiYgdyA8IHAgPyAoYS5lcnJvcigiQm94UGFyc2VyIiwgIkJveCBvZiB0eXBlICIgKyBTICsgIiBoYXMgYW4gaW52YWxpZCBzaXplICIgKyB3ICsgIiAodG9vIHNtYWxsIHRvIGJlIGEgYm94KSIpLCB7IGNvZGU6IHIuRVJSX05PVF9FTk9VR0hfREFUQSwgdHlwZTogUywgc2l6ZTogdywgaGRyX3NpemU6IHAsIHN0YXJ0OiBsIH0pIDogdyAhPT0gMCAmJiBzICYmIHcgPiBzID8gKGEuZXJyb3IoIkJveFBhcnNlciIsICJCb3ggb2YgdHlwZSAnIiArIFMgKyAiJyBoYXMgYSBzaXplICIgKyB3ICsgIiBncmVhdGVyIHRoYW4gaXRzIGNvbnRhaW5lciBzaXplICIgKyBzKSwgeyBjb2RlOiByLkVSUl9OT1RfRU5PVUdIX0RBVEEsIHR5cGU6IFMsIHNpemU6IHcsIGhkcl9zaXplOiBwLCBzdGFydDogbCB9KSA6IHcgIT09IDAgJiYgbCArIHcgPiB0LmdldEVuZFBvc2l0aW9uKCkgPyAodC5zZWVrKGwpLCBhLmluZm8oIkJveFBhcnNlciIsICJOb3QgZW5vdWdoIGRhdGEgaW4gc3RyZWFtIHRvIHBhcnNlIHRoZSBlbnRpcmUgJyIgKyBTICsgIicgYm94IiksIHsgY29kZTogci5FUlJfTk9UX0VOT1VHSF9EQVRBLCB0eXBlOiBTLCBzaXplOiB3LCBoZHJfc2l6ZTogcCwgc3RhcnQ6IGwgfSkgOiBlID8geyBjb2RlOiByLk9LLCB0eXBlOiBTLCBzaXplOiB3LCBoZHJfc2l6ZTogcCwgc3RhcnQ6IGwgfSA6IChyW1MgKyAiQm94Il0gPyBoID0gbmV3IHJbUyArICJCb3giXSh3KSA6IFMgIT09ICJ1dWlkIiA/IChhLndhcm4oIkJveFBhcnNlciIsICJVbmtub3duIGJveCB0eXBlOiAnIiArIFMgKyAiJyIpLCBoID0gbmV3IHIuQm94KFMsIHcpLCBoLmhhc191bnBhcnNlZF9kYXRhID0gdHJ1ZSkgOiByLlVVSURCb3hlc1ttXSA/IGggPSBuZXcgci5VVUlEQm94ZXNbbV0odykgOiAoYS53YXJuKCJCb3hQYXJzZXIiLCAiVW5rbm93biB1dWlkIHR5cGU6ICciICsgbSArICInIiksIGggPSBuZXcgci5Cb3goUywgdyksIGgudXVpZCA9IG0sIGguaGFzX3VucGFyc2VkX2RhdGEgPSB0cnVlKSwgaC5oZHJfc2l6ZSA9IHAsIGguc3RhcnQgPSBsLCBoLndyaXRlID09PSByLkJveC5wcm90b3R5cGUud3JpdGUgJiYgaC50eXBlICE9PSAibWRhdCIgJiYgKGEuaW5mbygiQm94UGFyc2VyIiwgIiciICsgRSArICInIGJveCB3cml0aW5nIG5vdCB5ZXQgaW1wbGVtZW50ZWQsIGtlZXBpbmcgdW5wYXJzZWQgZGF0YSBpbiBtZW1vcnkgZm9yIGxhdGVyIHdyaXRlIiksIGgucGFyc2VEYXRhQW5kUmV3aW5kKHQpKSwgaC5wYXJzZSh0KSwgXyA9IHQuZ2V0UG9zaXRpb24oKSAtIChoLnN0YXJ0ICsgaC5zaXplKSwgXyA8IDAgPyAoYS53YXJuKCJCb3hQYXJzZXIiLCAiUGFyc2luZyBvZiBib3ggJyIgKyBFICsgIicgZGlkIG5vdCByZWFkIHRoZSBlbnRpcmUgaW5kaWNhdGVkIGJveCBkYXRhIHNpemUgKG1pc3NpbmcgIiArIC1fICsgIiBieXRlcyksIHNlZWtpbmcgZm9yd2FyZCIpLCB0LnNlZWsoaC5zdGFydCArIGguc2l6ZSkpIDogXyA+IDAgJiYgKGEuZXJyb3IoIkJveFBhcnNlciIsICJQYXJzaW5nIG9mIGJveCAnIiArIEUgKyAiJyByZWFkICIgKyBfICsgIiBtb3JlIGJ5dGVzIHRoYW4gdGhlIGluZGljYXRlZCBib3ggZGF0YSBzaXplLCBzZWVraW5nIGJhY2t3YXJkcyIpLCBoLnNpemUgIT09IDAgJiYgdC5zZWVrKGguc3RhcnQgKyBoLnNpemUpKSwgeyBjb2RlOiByLk9LLCBib3g6IGgsIHNpemU6IGguc2l6ZSB9KTsKICAgIH0sIHIuQm94LnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy50eXBlICE9ICJtZGF0IiA/IHRoaXMuZGF0YSA9IHQucmVhZFVpbnQ4QXJyYXkodGhpcy5zaXplIC0gdGhpcy5oZHJfc2l6ZSkgOiB0aGlzLnNpemUgPT09IDAgPyB0LnNlZWsodC5nZXRFbmRQb3NpdGlvbigpKSA6IHQuc2Vlayh0aGlzLnN0YXJ0ICsgdGhpcy5zaXplKTsKICAgIH0sIHIuQm94LnByb3RvdHlwZS5wYXJzZURhdGFBbmRSZXdpbmQgPSBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuZGF0YSA9IHQucmVhZFVpbnQ4QXJyYXkodGhpcy5zaXplIC0gdGhpcy5oZHJfc2l6ZSksIHQucG9zaXRpb24gLT0gdGhpcy5zaXplIC0gdGhpcy5oZHJfc2l6ZTsKICAgIH0sIHIuRnVsbEJveC5wcm90b3R5cGUucGFyc2VEYXRhQW5kUmV3aW5kID0gZnVuY3Rpb24odCkgewogICAgICB0aGlzLnBhcnNlRnVsbEhlYWRlcih0KSwgdGhpcy5kYXRhID0gdC5yZWFkVWludDhBcnJheSh0aGlzLnNpemUgLSB0aGlzLmhkcl9zaXplKSwgdGhpcy5oZHJfc2l6ZSAtPSA0LCB0LnBvc2l0aW9uIC09IHRoaXMuc2l6ZSAtIHRoaXMuaGRyX3NpemU7CiAgICB9LCByLkZ1bGxCb3gucHJvdG90eXBlLnBhcnNlRnVsbEhlYWRlciA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy52ZXJzaW9uID0gdC5yZWFkVWludDgoKSwgdGhpcy5mbGFncyA9IHQucmVhZFVpbnQyNCgpLCB0aGlzLmhkcl9zaXplICs9IDQ7CiAgICB9LCByLkZ1bGxCb3gucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24odCkgewogICAgICB0aGlzLnBhcnNlRnVsbEhlYWRlcih0KSwgdGhpcy5kYXRhID0gdC5yZWFkVWludDhBcnJheSh0aGlzLnNpemUgLSB0aGlzLmhkcl9zaXplKTsKICAgIH0sIHIuQ29udGFpbmVyQm94LnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgZm9yICh2YXIgZSwgczsgdC5nZXRQb3NpdGlvbigpIDwgdGhpcy5zdGFydCArIHRoaXMuc2l6ZTsgKQogICAgICAgIGlmIChlID0gci5wYXJzZU9uZUJveCh0LCBmYWxzZSwgdGhpcy5zaXplIC0gKHQuZ2V0UG9zaXRpb24oKSAtIHRoaXMuc3RhcnQpKSwgZS5jb2RlID09PSByLk9LKQogICAgICAgICAgaWYgKHMgPSBlLmJveCwgdGhpcy5ib3hlcy5wdXNoKHMpLCB0aGlzLnN1YkJveE5hbWVzICYmIHRoaXMuc3ViQm94TmFtZXMuaW5kZXhPZihzLnR5cGUpICE9IC0xKQogICAgICAgICAgICB0aGlzW3RoaXMuc3ViQm94TmFtZXNbdGhpcy5zdWJCb3hOYW1lcy5pbmRleE9mKHMudHlwZSldICsgInMiXS5wdXNoKHMpOwogICAgICAgICAgZWxzZSB7CiAgICAgICAgICAgIHZhciBoID0gcy50eXBlICE9PSAidXVpZCIgPyBzLnR5cGUgOiBzLnV1aWQ7CiAgICAgICAgICAgIHRoaXNbaF0gPyBhLndhcm4oIkJveCBvZiB0eXBlICIgKyBoICsgIiBhbHJlYWR5IHN0b3JlZCBpbiBmaWVsZCBvZiB0aGlzIHR5cGUiKSA6IHRoaXNbaF0gPSBzOwogICAgICAgICAgfQogICAgICAgIGVsc2UKICAgICAgICAgIHJldHVybjsKICAgIH0sIHIuQm94LnByb3RvdHlwZS5wYXJzZUxhbmd1YWdlID0gZnVuY3Rpb24odCkgewogICAgICB0aGlzLmxhbmd1YWdlID0gdC5yZWFkVWludDE2KCk7CiAgICAgIHZhciBlID0gW107CiAgICAgIGVbMF0gPSB0aGlzLmxhbmd1YWdlID4+IDEwICYgMzEsIGVbMV0gPSB0aGlzLmxhbmd1YWdlID4+IDUgJiAzMSwgZVsyXSA9IHRoaXMubGFuZ3VhZ2UgJiAzMSwgdGhpcy5sYW5ndWFnZVN0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZVswXSArIDk2LCBlWzFdICsgOTYsIGVbMl0gKyA5Nik7CiAgICB9LCByLlNBTVBMRV9FTlRSWV9UWVBFX1ZJU1VBTCA9ICJWaXN1YWwiLCByLlNBTVBMRV9FTlRSWV9UWVBFX0FVRElPID0gIkF1ZGlvIiwgci5TQU1QTEVfRU5UUllfVFlQRV9ISU5UID0gIkhpbnQiLCByLlNBTVBMRV9FTlRSWV9UWVBFX01FVEFEQVRBID0gIk1ldGFkYXRhIiwgci5TQU1QTEVfRU5UUllfVFlQRV9TVUJUSVRMRSA9ICJTdWJ0aXRsZSIsIHIuU0FNUExFX0VOVFJZX1RZUEVfU1lTVEVNID0gIlN5c3RlbSIsIHIuU0FNUExFX0VOVFJZX1RZUEVfVEVYVCA9ICJUZXh0Iiwgci5TYW1wbGVFbnRyeS5wcm90b3R5cGUucGFyc2VIZWFkZXIgPSBmdW5jdGlvbih0KSB7CiAgICAgIHQucmVhZFVpbnQ4QXJyYXkoNiksIHRoaXMuZGF0YV9yZWZlcmVuY2VfaW5kZXggPSB0LnJlYWRVaW50MTYoKSwgdGhpcy5oZHJfc2l6ZSArPSA4OwogICAgfSwgci5TYW1wbGVFbnRyeS5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMucGFyc2VIZWFkZXIodCksIHRoaXMuZGF0YSA9IHQucmVhZFVpbnQ4QXJyYXkodGhpcy5zaXplIC0gdGhpcy5oZHJfc2l6ZSk7CiAgICB9LCByLlNhbXBsZUVudHJ5LnByb3RvdHlwZS5wYXJzZURhdGFBbmRSZXdpbmQgPSBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMucGFyc2VIZWFkZXIodCksIHRoaXMuZGF0YSA9IHQucmVhZFVpbnQ4QXJyYXkodGhpcy5zaXplIC0gdGhpcy5oZHJfc2l6ZSksIHRoaXMuaGRyX3NpemUgLT0gOCwgdC5wb3NpdGlvbiAtPSB0aGlzLnNpemUgLSB0aGlzLmhkcl9zaXplOwogICAgfSwgci5TYW1wbGVFbnRyeS5wcm90b3R5cGUucGFyc2VGb290ZXIgPSBmdW5jdGlvbih0KSB7CiAgICAgIHIuQ29udGFpbmVyQm94LnByb3RvdHlwZS5wYXJzZS5jYWxsKHRoaXMsIHQpOwogICAgfSwgci5jcmVhdGVNZWRpYVNhbXBsZUVudHJ5Q3RvcihyLlNBTVBMRV9FTlRSWV9UWVBFX0hJTlQpLCByLmNyZWF0ZU1lZGlhU2FtcGxlRW50cnlDdG9yKHIuU0FNUExFX0VOVFJZX1RZUEVfTUVUQURBVEEpLCByLmNyZWF0ZU1lZGlhU2FtcGxlRW50cnlDdG9yKHIuU0FNUExFX0VOVFJZX1RZUEVfU1VCVElUTEUpLCByLmNyZWF0ZU1lZGlhU2FtcGxlRW50cnlDdG9yKHIuU0FNUExFX0VOVFJZX1RZUEVfU1lTVEVNKSwgci5jcmVhdGVNZWRpYVNhbXBsZUVudHJ5Q3RvcihyLlNBTVBMRV9FTlRSWV9UWVBFX1RFWFQpLCByLmNyZWF0ZU1lZGlhU2FtcGxlRW50cnlDdG9yKHIuU0FNUExFX0VOVFJZX1RZUEVfVklTVUFMLCBmdW5jdGlvbih0KSB7CiAgICAgIHZhciBlOwogICAgICB0aGlzLnBhcnNlSGVhZGVyKHQpLCB0LnJlYWRVaW50MTYoKSwgdC5yZWFkVWludDE2KCksIHQucmVhZFVpbnQzMkFycmF5KDMpLCB0aGlzLndpZHRoID0gdC5yZWFkVWludDE2KCksIHRoaXMuaGVpZ2h0ID0gdC5yZWFkVWludDE2KCksIHRoaXMuaG9yaXpyZXNvbHV0aW9uID0gdC5yZWFkVWludDMyKCksIHRoaXMudmVydHJlc29sdXRpb24gPSB0LnJlYWRVaW50MzIoKSwgdC5yZWFkVWludDMyKCksIHRoaXMuZnJhbWVfY291bnQgPSB0LnJlYWRVaW50MTYoKSwgZSA9IE1hdGgubWluKDMxLCB0LnJlYWRVaW50OCgpKSwgdGhpcy5jb21wcmVzc29ybmFtZSA9IHQucmVhZFN0cmluZyhlKSwgZSA8IDMxICYmIHQucmVhZFN0cmluZygzMSAtIGUpLCB0aGlzLmRlcHRoID0gdC5yZWFkVWludDE2KCksIHQucmVhZFVpbnQxNigpLCB0aGlzLnBhcnNlRm9vdGVyKHQpOwogICAgfSksIHIuY3JlYXRlTWVkaWFTYW1wbGVFbnRyeUN0b3Ioci5TQU1QTEVfRU5UUllfVFlQRV9BVURJTywgZnVuY3Rpb24odCkgewogICAgICB0aGlzLnBhcnNlSGVhZGVyKHQpLCB0LnJlYWRVaW50MzJBcnJheSgyKSwgdGhpcy5jaGFubmVsX2NvdW50ID0gdC5yZWFkVWludDE2KCksIHRoaXMuc2FtcGxlc2l6ZSA9IHQucmVhZFVpbnQxNigpLCB0LnJlYWRVaW50MTYoKSwgdC5yZWFkVWludDE2KCksIHRoaXMuc2FtcGxlcmF0ZSA9IHQucmVhZFVpbnQzMigpIC8gNjU1MzYsIHRoaXMucGFyc2VGb290ZXIodCk7CiAgICB9KSwgci5jcmVhdGVTYW1wbGVFbnRyeUN0b3Ioci5TQU1QTEVfRU5UUllfVFlQRV9WSVNVQUwsICJhdmMxIiksIHIuY3JlYXRlU2FtcGxlRW50cnlDdG9yKHIuU0FNUExFX0VOVFJZX1RZUEVfVklTVUFMLCAiYXZjMiIpLCByLmNyZWF0ZVNhbXBsZUVudHJ5Q3RvcihyLlNBTVBMRV9FTlRSWV9UWVBFX1ZJU1VBTCwgImF2YzMiKSwgci5jcmVhdGVTYW1wbGVFbnRyeUN0b3Ioci5TQU1QTEVfRU5UUllfVFlQRV9WSVNVQUwsICJhdmM0IiksIHIuY3JlYXRlU2FtcGxlRW50cnlDdG9yKHIuU0FNUExFX0VOVFJZX1RZUEVfVklTVUFMLCAiYXYwMSIpLCByLmNyZWF0ZVNhbXBsZUVudHJ5Q3RvcihyLlNBTVBMRV9FTlRSWV9UWVBFX1ZJU1VBTCwgImRhdjEiKSwgci5jcmVhdGVTYW1wbGVFbnRyeUN0b3Ioci5TQU1QTEVfRU5UUllfVFlQRV9WSVNVQUwsICJodmMxIiksIHIuY3JlYXRlU2FtcGxlRW50cnlDdG9yKHIuU0FNUExFX0VOVFJZX1RZUEVfVklTVUFMLCAiaGV2MSIpLCByLmNyZWF0ZVNhbXBsZUVudHJ5Q3RvcihyLlNBTVBMRV9FTlRSWV9UWVBFX1ZJU1VBTCwgImh2dDEiKSwgci5jcmVhdGVTYW1wbGVFbnRyeUN0b3Ioci5TQU1QTEVfRU5UUllfVFlQRV9WSVNVQUwsICJsaGUxIiksIHIuY3JlYXRlU2FtcGxlRW50cnlDdG9yKHIuU0FNUExFX0VOVFJZX1RZUEVfVklTVUFMLCAiZHZoMSIpLCByLmNyZWF0ZVNhbXBsZUVudHJ5Q3RvcihyLlNBTVBMRV9FTlRSWV9UWVBFX1ZJU1VBTCwgImR2aGUiKSwgci5jcmVhdGVTYW1wbGVFbnRyeUN0b3Ioci5TQU1QTEVfRU5UUllfVFlQRV9WSVNVQUwsICJ2dmMxIiksIHIuY3JlYXRlU2FtcGxlRW50cnlDdG9yKHIuU0FNUExFX0VOVFJZX1RZUEVfVklTVUFMLCAidnZpMSIpLCByLmNyZWF0ZVNhbXBsZUVudHJ5Q3RvcihyLlNBTVBMRV9FTlRSWV9UWVBFX1ZJU1VBTCwgInZ2czEiKSwgci5jcmVhdGVTYW1wbGVFbnRyeUN0b3Ioci5TQU1QTEVfRU5UUllfVFlQRV9WSVNVQUwsICJ2dmNOIiksIHIuY3JlYXRlU2FtcGxlRW50cnlDdG9yKHIuU0FNUExFX0VOVFJZX1RZUEVfVklTVUFMLCAidnAwOCIpLCByLmNyZWF0ZVNhbXBsZUVudHJ5Q3RvcihyLlNBTVBMRV9FTlRSWV9UWVBFX1ZJU1VBTCwgInZwMDkiKSwgci5jcmVhdGVTYW1wbGVFbnRyeUN0b3Ioci5TQU1QTEVfRU5UUllfVFlQRV9WSVNVQUwsICJhdnMzIiksIHIuY3JlYXRlU2FtcGxlRW50cnlDdG9yKHIuU0FNUExFX0VOVFJZX1RZUEVfVklTVUFMLCAiajJraSIpLCByLmNyZWF0ZVNhbXBsZUVudHJ5Q3RvcihyLlNBTVBMRV9FTlRSWV9UWVBFX1ZJU1VBTCwgIm1qcDIiKSwgci5jcmVhdGVTYW1wbGVFbnRyeUN0b3Ioci5TQU1QTEVfRU5UUllfVFlQRV9WSVNVQUwsICJtanBnIiksIHIuY3JlYXRlU2FtcGxlRW50cnlDdG9yKHIuU0FNUExFX0VOVFJZX1RZUEVfVklTVUFMLCAidW5jdiIpLCByLmNyZWF0ZVNhbXBsZUVudHJ5Q3RvcihyLlNBTVBMRV9FTlRSWV9UWVBFX0FVRElPLCAibXA0YSIpLCByLmNyZWF0ZVNhbXBsZUVudHJ5Q3RvcihyLlNBTVBMRV9FTlRSWV9UWVBFX0FVRElPLCAiYWMtMyIpLCByLmNyZWF0ZVNhbXBsZUVudHJ5Q3RvcihyLlNBTVBMRV9FTlRSWV9UWVBFX0FVRElPLCAiYWMtNCIpLCByLmNyZWF0ZVNhbXBsZUVudHJ5Q3RvcihyLlNBTVBMRV9FTlRSWV9UWVBFX0FVRElPLCAiZWMtMyIpLCByLmNyZWF0ZVNhbXBsZUVudHJ5Q3RvcihyLlNBTVBMRV9FTlRSWV9UWVBFX0FVRElPLCAiT3B1cyIpLCByLmNyZWF0ZVNhbXBsZUVudHJ5Q3RvcihyLlNBTVBMRV9FTlRSWV9UWVBFX0FVRElPLCAibWhhMSIpLCByLmNyZWF0ZVNhbXBsZUVudHJ5Q3RvcihyLlNBTVBMRV9FTlRSWV9UWVBFX0FVRElPLCAibWhhMiIpLCByLmNyZWF0ZVNhbXBsZUVudHJ5Q3RvcihyLlNBTVBMRV9FTlRSWV9UWVBFX0FVRElPLCAibWhtMSIpLCByLmNyZWF0ZVNhbXBsZUVudHJ5Q3RvcihyLlNBTVBMRV9FTlRSWV9UWVBFX0FVRElPLCAibWhtMiIpLCByLmNyZWF0ZUVuY3J5cHRlZFNhbXBsZUVudHJ5Q3RvcihyLlNBTVBMRV9FTlRSWV9UWVBFX1ZJU1VBTCwgImVuY3YiKSwgci5jcmVhdGVFbmNyeXB0ZWRTYW1wbGVFbnRyeUN0b3Ioci5TQU1QTEVfRU5UUllfVFlQRV9BVURJTywgImVuY2EiKSwgci5jcmVhdGVFbmNyeXB0ZWRTYW1wbGVFbnRyeUN0b3Ioci5TQU1QTEVfRU5UUllfVFlQRV9TVUJUSVRMRSwgImVuY3UiKSwgci5jcmVhdGVFbmNyeXB0ZWRTYW1wbGVFbnRyeUN0b3Ioci5TQU1QTEVfRU5UUllfVFlQRV9TWVNURU0sICJlbmNzIiksIHIuY3JlYXRlRW5jcnlwdGVkU2FtcGxlRW50cnlDdG9yKHIuU0FNUExFX0VOVFJZX1RZUEVfVEVYVCwgImVuY3QiKSwgci5jcmVhdGVFbmNyeXB0ZWRTYW1wbGVFbnRyeUN0b3Ioci5TQU1QTEVfRU5UUllfVFlQRV9NRVRBREFUQSwgImVuY20iKSwgci5jcmVhdGVCb3hDdG9yKCJhMWx4IiwgZnVuY3Rpb24odCkgewogICAgICB2YXIgZSA9IHQucmVhZFVpbnQ4KCkgJiAxLCBzID0gKChlICYgMSkgKyAxKSAqIDE2OwogICAgICB0aGlzLmxheWVyX3NpemUgPSBbXTsKICAgICAgZm9yICh2YXIgaCA9IDA7IGggPCAzOyBoKyspCiAgICAgICAgcyA9PSAxNiA/IHRoaXMubGF5ZXJfc2l6ZVtoXSA9IHQucmVhZFVpbnQxNigpIDogdGhpcy5sYXllcl9zaXplW2hdID0gdC5yZWFkVWludDMyKCk7CiAgICB9KSwgci5jcmVhdGVCb3hDdG9yKCJhMW9wIiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLm9wX2luZGV4ID0gdC5yZWFkVWludDgoKTsKICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJhdXhDIiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLmF1eF90eXBlID0gdC5yZWFkQ1N0cmluZygpOwogICAgICB2YXIgZSA9IHRoaXMuc2l6ZSAtIHRoaXMuaGRyX3NpemUgLSAodGhpcy5hdXhfdHlwZS5sZW5ndGggKyAxKTsKICAgICAgdGhpcy5hdXhfc3VidHlwZSA9IHQucmVhZFVpbnQ4QXJyYXkoZSk7CiAgICB9KSwgci5jcmVhdGVCb3hDdG9yKCJhdjFDIiwgZnVuY3Rpb24odCkgewogICAgICB2YXIgZSA9IHQucmVhZFVpbnQ4KCk7CiAgICAgIGlmIChlID4+IDcgJiBmYWxzZSkgewogICAgICAgIGEuZXJyb3IoImF2MUMgbWFya2VyIHByb2JsZW0iKTsKICAgICAgICByZXR1cm47CiAgICAgIH0KICAgICAgaWYgKHRoaXMudmVyc2lvbiA9IGUgJiAxMjcsIHRoaXMudmVyc2lvbiAhPT0gMSkgewogICAgICAgIGEuZXJyb3IoImF2MUMgdmVyc2lvbiAiICsgdGhpcy52ZXJzaW9uICsgIiBub3Qgc3VwcG9ydGVkIik7CiAgICAgICAgcmV0dXJuOwogICAgICB9CiAgICAgIGlmIChlID0gdC5yZWFkVWludDgoKSwgdGhpcy5zZXFfcHJvZmlsZSA9IGUgPj4gNSAmIDcsIHRoaXMuc2VxX2xldmVsX2lkeF8wID0gZSAmIDMxLCBlID0gdC5yZWFkVWludDgoKSwgdGhpcy5zZXFfdGllcl8wID0gZSA+PiA3ICYgMSwgdGhpcy5oaWdoX2JpdGRlcHRoID0gZSA+PiA2ICYgMSwgdGhpcy50d2VsdmVfYml0ID0gZSA+PiA1ICYgMSwgdGhpcy5tb25vY2hyb21lID0gZSA+PiA0ICYgMSwgdGhpcy5jaHJvbWFfc3Vic2FtcGxpbmdfeCA9IGUgPj4gMyAmIDEsIHRoaXMuY2hyb21hX3N1YnNhbXBsaW5nX3kgPSBlID4+IDIgJiAxLCB0aGlzLmNocm9tYV9zYW1wbGVfcG9zaXRpb24gPSBlICYgMywgZSA9IHQucmVhZFVpbnQ4KCksIHRoaXMucmVzZXJ2ZWRfMSA9IGUgPj4gNSAmIDcsIHRoaXMucmVzZXJ2ZWRfMSAhPT0gMCkgewogICAgICAgIGEuZXJyb3IoImF2MUMgcmVzZXJ2ZWRfMSBwYXJzaW5nIHByb2JsZW0iKTsKICAgICAgICByZXR1cm47CiAgICAgIH0KICAgICAgaWYgKHRoaXMuaW5pdGlhbF9wcmVzZW50YXRpb25fZGVsYXlfcHJlc2VudCA9IGUgPj4gNCAmIDEsIHRoaXMuaW5pdGlhbF9wcmVzZW50YXRpb25fZGVsYXlfcHJlc2VudCA9PT0gMSkKICAgICAgICB0aGlzLmluaXRpYWxfcHJlc2VudGF0aW9uX2RlbGF5X21pbnVzX29uZSA9IGUgJiAxNTsKICAgICAgZWxzZSBpZiAodGhpcy5yZXNlcnZlZF8yID0gZSAmIDE1LCB0aGlzLnJlc2VydmVkXzIgIT09IDApIHsKICAgICAgICBhLmVycm9yKCJhdjFDIHJlc2VydmVkXzIgcGFyc2luZyBwcm9ibGVtIik7CiAgICAgICAgcmV0dXJuOwogICAgICB9CiAgICAgIHZhciBzID0gdGhpcy5zaXplIC0gdGhpcy5oZHJfc2l6ZSAtIDQ7CiAgICAgIHRoaXMuY29uZmlnT0JVcyA9IHQucmVhZFVpbnQ4QXJyYXkocyk7CiAgICB9KSwgci5jcmVhdGVCb3hDdG9yKCJhdmNDIiwgZnVuY3Rpb24odCkgewogICAgICB2YXIgZSwgczsKICAgICAgZm9yICh0aGlzLmNvbmZpZ3VyYXRpb25WZXJzaW9uID0gdC5yZWFkVWludDgoKSwgdGhpcy5BVkNQcm9maWxlSW5kaWNhdGlvbiA9IHQucmVhZFVpbnQ4KCksIHRoaXMucHJvZmlsZV9jb21wYXRpYmlsaXR5ID0gdC5yZWFkVWludDgoKSwgdGhpcy5BVkNMZXZlbEluZGljYXRpb24gPSB0LnJlYWRVaW50OCgpLCB0aGlzLmxlbmd0aFNpemVNaW51c09uZSA9IHQucmVhZFVpbnQ4KCkgJiAzLCB0aGlzLm5iX1NQU19uYWx1cyA9IHQucmVhZFVpbnQ4KCkgJiAzMSwgcyA9IHRoaXMuc2l6ZSAtIHRoaXMuaGRyX3NpemUgLSA2LCB0aGlzLlNQUyA9IFtdLCBlID0gMDsgZSA8IHRoaXMubmJfU1BTX25hbHVzOyBlKyspCiAgICAgICAgdGhpcy5TUFNbZV0gPSB7fSwgdGhpcy5TUFNbZV0ubGVuZ3RoID0gdC5yZWFkVWludDE2KCksIHRoaXMuU1BTW2VdLm5hbHUgPSB0LnJlYWRVaW50OEFycmF5KHRoaXMuU1BTW2VdLmxlbmd0aCksIHMgLT0gMiArIHRoaXMuU1BTW2VdLmxlbmd0aDsKICAgICAgZm9yICh0aGlzLm5iX1BQU19uYWx1cyA9IHQucmVhZFVpbnQ4KCksIHMtLSwgdGhpcy5QUFMgPSBbXSwgZSA9IDA7IGUgPCB0aGlzLm5iX1BQU19uYWx1czsgZSsrKQogICAgICAgIHRoaXMuUFBTW2VdID0ge30sIHRoaXMuUFBTW2VdLmxlbmd0aCA9IHQucmVhZFVpbnQxNigpLCB0aGlzLlBQU1tlXS5uYWx1ID0gdC5yZWFkVWludDhBcnJheSh0aGlzLlBQU1tlXS5sZW5ndGgpLCBzIC09IDIgKyB0aGlzLlBQU1tlXS5sZW5ndGg7CiAgICAgIHMgPiAwICYmICh0aGlzLmV4dCA9IHQucmVhZFVpbnQ4QXJyYXkocykpOwogICAgfSksIHIuY3JlYXRlQm94Q3RvcigiYnRydCIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5idWZmZXJTaXplREIgPSB0LnJlYWRVaW50MzIoKSwgdGhpcy5tYXhCaXRyYXRlID0gdC5yZWFkVWludDMyKCksIHRoaXMuYXZnQml0cmF0ZSA9IHQucmVhZFVpbnQzMigpOwogICAgfSksIHIuY3JlYXRlRnVsbEJveEN0b3IoImNjc3QiLCBmdW5jdGlvbih0KSB7CiAgICAgIHZhciBlID0gdC5yZWFkVWludDgoKTsKICAgICAgdGhpcy5hbGxfcmVmX3BpY3NfaW50cmEgPSAoZSAmIDEyOCkgPT0gMTI4LCB0aGlzLmludHJhX3ByZWRfdXNlZCA9IChlICYgNjQpID09IDY0LCB0aGlzLm1heF9yZWZfcGVyX3BpYyA9IChlICYgNjMpID4+IDIsIHQucmVhZFVpbnQyNCgpOwogICAgfSksIHIuY3JlYXRlQm94Q3RvcigiY2RlZiIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGU7CiAgICAgIGZvciAodGhpcy5jaGFubmVsX2NvdW50ID0gdC5yZWFkVWludDE2KCksIHRoaXMuY2hhbm5lbF9pbmRleGVzID0gW10sIHRoaXMuY2hhbm5lbF90eXBlcyA9IFtdLCB0aGlzLmNoYW5uZWxfYXNzb2NpYXRpb25zID0gW10sIGUgPSAwOyBlIDwgdGhpcy5jaGFubmVsX2NvdW50OyBlKyspCiAgICAgICAgdGhpcy5jaGFubmVsX2luZGV4ZXMucHVzaCh0LnJlYWRVaW50MTYoKSksIHRoaXMuY2hhbm5lbF90eXBlcy5wdXNoKHQucmVhZFVpbnQxNigpKSwgdGhpcy5jaGFubmVsX2Fzc29jaWF0aW9ucy5wdXNoKHQucmVhZFVpbnQxNigpKTsKICAgIH0pLCByLmNyZWF0ZUJveEN0b3IoImNsYXAiLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuY2xlYW5BcGVydHVyZVdpZHRoTiA9IHQucmVhZFVpbnQzMigpLCB0aGlzLmNsZWFuQXBlcnR1cmVXaWR0aEQgPSB0LnJlYWRVaW50MzIoKSwgdGhpcy5jbGVhbkFwZXJ0dXJlSGVpZ2h0TiA9IHQucmVhZFVpbnQzMigpLCB0aGlzLmNsZWFuQXBlcnR1cmVIZWlnaHREID0gdC5yZWFkVWludDMyKCksIHRoaXMuaG9yaXpPZmZOID0gdC5yZWFkVWludDMyKCksIHRoaXMuaG9yaXpPZmZEID0gdC5yZWFkVWludDMyKCksIHRoaXMudmVydE9mZk4gPSB0LnJlYWRVaW50MzIoKSwgdGhpcy52ZXJ0T2ZmRCA9IHQucmVhZFVpbnQzMigpOwogICAgfSksIHIuY3JlYXRlQm94Q3RvcigiY2xsaSIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5tYXhfY29udGVudF9saWdodF9sZXZlbCA9IHQucmVhZFVpbnQxNigpLCB0aGlzLm1heF9waWNfYXZlcmFnZV9saWdodF9sZXZlbCA9IHQucmVhZFVpbnQxNigpOwogICAgfSksIHIuY3JlYXRlRnVsbEJveEN0b3IoImNtZXgiLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuZmxhZ3MgJiAxICYmICh0aGlzLnBvc194ID0gdC5yZWFkSW50MzIoKSksIHRoaXMuZmxhZ3MgJiAyICYmICh0aGlzLnBvc195ID0gdC5yZWFkSW50MzIoKSksIHRoaXMuZmxhZ3MgJiA0ICYmICh0aGlzLnBvc196ID0gdC5yZWFkSW50MzIoKSksIHRoaXMuZmxhZ3MgJiA4ICYmICh0aGlzLnZlcnNpb24gPT0gMCA/IHRoaXMuZmxhZ3MgJiAxNiA/ICh0aGlzLnF1YXRfeCA9IHQucmVhZEludDMyKCksIHRoaXMucXVhdF95ID0gdC5yZWFkSW50MzIoKSwgdGhpcy5xdWF0X3ogPSB0LnJlYWRJbnQzMigpKSA6ICh0aGlzLnF1YXRfeCA9IHQucmVhZEludDE2KCksIHRoaXMucXVhdF95ID0gdC5yZWFkSW50MTYoKSwgdGhpcy5xdWF0X3ogPSB0LnJlYWRJbnQxNigpKSA6IHRoaXMudmVyc2lvbiA9PSAxKSwgdGhpcy5mbGFncyAmIDMyICYmICh0aGlzLmlkID0gdC5yZWFkVWludDMyKCkpOwogICAgfSksIHIuY3JlYXRlRnVsbEJveEN0b3IoImNtaW4iLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuZm9jYWxfbGVuZ3RoX3ggPSB0LnJlYWRJbnQzMigpLCB0aGlzLnByaW5jaXBhbF9wb2ludF94ID0gdC5yZWFkSW50MzIoKSwgdGhpcy5wcmluY2lwYWxfcG9pbnRfeSA9IHQucmVhZEludDMyKCksIHRoaXMuZmxhZ3MgJiAxICYmICh0aGlzLmZvY2FsX2xlbmd0aF95ID0gdC5yZWFkSW50MzIoKSwgdGhpcy5za2V3X2ZhY3RvciA9IHQucmVhZEludDMyKCkpOwogICAgfSksIHIuY3JlYXRlQm94Q3RvcigiY21wZCIsIGZ1bmN0aW9uKHQpIHsKICAgICAgZm9yICh0aGlzLmNvbXBvbmVudF9jb3VudCA9IHQucmVhZFVpbnQxNigpLCB0aGlzLmNvbXBvbmVudF90eXBlcyA9IFtdLCB0aGlzLmNvbXBvbmVudF90eXBlX3VybHMgPSBbXSwgaSA9IDA7IGkgPCB0aGlzLmNvbXBvbmVudF9jb3VudDsgaSsrKSB7CiAgICAgICAgdmFyIGUgPSB0LnJlYWRVaW50MTYoKTsKICAgICAgICB0aGlzLmNvbXBvbmVudF90eXBlcy5wdXNoKGUpLCBlID49IDMyNzY4ICYmIHRoaXMuY29tcG9uZW50X3R5cGVfdXJscy5wdXNoKHQucmVhZENTdHJpbmcoKSk7CiAgICAgIH0KICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJjbzY0IiwgZnVuY3Rpb24odCkgewogICAgICB2YXIgZSwgczsKICAgICAgaWYgKGUgPSB0LnJlYWRVaW50MzIoKSwgdGhpcy5jaHVua19vZmZzZXRzID0gW10sIHRoaXMudmVyc2lvbiA9PT0gMCkKICAgICAgICBmb3IgKHMgPSAwOyBzIDwgZTsgcysrKQogICAgICAgICAgdGhpcy5jaHVua19vZmZzZXRzLnB1c2godC5yZWFkVWludDY0KCkpOwogICAgfSksIHIuY3JlYXRlRnVsbEJveEN0b3IoIkNvTEwiLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMubWF4Q0xMID0gdC5yZWFkVWludDE2KCksIHRoaXMubWF4RkFMTCA9IHQucmVhZFVpbnQxNigpOwogICAgfSksIHIuY3JlYXRlQm94Q3RvcigiY29sciIsIGZ1bmN0aW9uKHQpIHsKICAgICAgaWYgKHRoaXMuY29sb3VyX3R5cGUgPSB0LnJlYWRTdHJpbmcoNCksIHRoaXMuY29sb3VyX3R5cGUgPT09ICJuY2x4IikgewogICAgICAgIHRoaXMuY29sb3VyX3ByaW1hcmllcyA9IHQucmVhZFVpbnQxNigpLCB0aGlzLnRyYW5zZmVyX2NoYXJhY3RlcmlzdGljcyA9IHQucmVhZFVpbnQxNigpLCB0aGlzLm1hdHJpeF9jb2VmZmljaWVudHMgPSB0LnJlYWRVaW50MTYoKTsKICAgICAgICB2YXIgZSA9IHQucmVhZFVpbnQ4KCk7CiAgICAgICAgdGhpcy5mdWxsX3JhbmdlX2ZsYWcgPSBlID4+IDc7CiAgICAgIH0gZWxzZQogICAgICAgIHRoaXMuY29sb3VyX3R5cGUgPT09ICJySUNDIiA/IHRoaXMuSUNDX3Byb2ZpbGUgPSB0LnJlYWRVaW50OEFycmF5KHRoaXMuc2l6ZSAtIDQpIDogdGhpcy5jb2xvdXJfdHlwZSA9PT0gInByb2YiICYmICh0aGlzLklDQ19wcm9maWxlID0gdC5yZWFkVWludDhBcnJheSh0aGlzLnNpemUgLSA0KSk7CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3RvcigiY3BydCIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5wYXJzZUxhbmd1YWdlKHQpLCB0aGlzLm5vdGljZSA9IHQucmVhZENTdHJpbmcoKTsKICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJjc2xnIiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLnZlcnNpb24gPT09IDAgJiYgKHRoaXMuY29tcG9zaXRpb25Ub0RUU1NoaWZ0ID0gdC5yZWFkSW50MzIoKSwgdGhpcy5sZWFzdERlY29kZVRvRGlzcGxheURlbHRhID0gdC5yZWFkSW50MzIoKSwgdGhpcy5ncmVhdGVzdERlY29kZVRvRGlzcGxheURlbHRhID0gdC5yZWFkSW50MzIoKSwgdGhpcy5jb21wb3NpdGlvblN0YXJ0VGltZSA9IHQucmVhZEludDMyKCksIHRoaXMuY29tcG9zaXRpb25FbmRUaW1lID0gdC5yZWFkSW50MzIoKSk7CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3RvcigiY3R0cyIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUsIHM7CiAgICAgIGlmIChlID0gdC5yZWFkVWludDMyKCksIHRoaXMuc2FtcGxlX2NvdW50cyA9IFtdLCB0aGlzLnNhbXBsZV9vZmZzZXRzID0gW10sIHRoaXMudmVyc2lvbiA9PT0gMCkKICAgICAgICBmb3IgKHMgPSAwOyBzIDwgZTsgcysrKSB7CiAgICAgICAgICB0aGlzLnNhbXBsZV9jb3VudHMucHVzaCh0LnJlYWRVaW50MzIoKSk7CiAgICAgICAgICB2YXIgaCA9IHQucmVhZEludDMyKCk7CiAgICAgICAgICBoIDwgMCAmJiBhLndhcm4oIkJveFBhcnNlciIsICJjdHRzIGJveCB1c2VzIG5lZ2F0aXZlIHZhbHVlcyB3aXRob3V0IHVzaW5nIHZlcnNpb24gMSIpLCB0aGlzLnNhbXBsZV9vZmZzZXRzLnB1c2goaCk7CiAgICAgICAgfQogICAgICBlbHNlIGlmICh0aGlzLnZlcnNpb24gPT0gMSkKICAgICAgICBmb3IgKHMgPSAwOyBzIDwgZTsgcysrKQogICAgICAgICAgdGhpcy5zYW1wbGVfY291bnRzLnB1c2godC5yZWFkVWludDMyKCkpLCB0aGlzLnNhbXBsZV9vZmZzZXRzLnB1c2godC5yZWFkSW50MzIoKSk7CiAgICB9KSwgci5jcmVhdGVCb3hDdG9yKCJkYWMzIiwgZnVuY3Rpb24odCkgewogICAgICB2YXIgZSA9IHQucmVhZFVpbnQ4KCksIHMgPSB0LnJlYWRVaW50OCgpLCBoID0gdC5yZWFkVWludDgoKTsKICAgICAgdGhpcy5mc2NvZCA9IGUgPj4gNiwgdGhpcy5ic2lkID0gZSA+PiAxICYgMzEsIHRoaXMuYnNtb2QgPSAoZSAmIDEpIDw8IDIgfCBzID4+IDYgJiAzLCB0aGlzLmFjbW9kID0gcyA+PiAzICYgNywgdGhpcy5sZmVvbiA9IHMgPj4gMiAmIDEsIHRoaXMuYml0X3JhdGVfY29kZSA9IHMgJiAzIHwgaCA+PiA1ICYgNzsKICAgIH0pLCByLmNyZWF0ZUJveEN0b3IoImRlYzMiLCBmdW5jdGlvbih0KSB7CiAgICAgIHZhciBlID0gdC5yZWFkVWludDE2KCk7CiAgICAgIHRoaXMuZGF0YV9yYXRlID0gZSA+PiAzLCB0aGlzLm51bV9pbmRfc3ViID0gZSAmIDcsIHRoaXMuaW5kX3N1YnMgPSBbXTsKICAgICAgZm9yICh2YXIgcyA9IDA7IHMgPCB0aGlzLm51bV9pbmRfc3ViICsgMTsgcysrKSB7CiAgICAgICAgdmFyIGggPSB7fTsKICAgICAgICB0aGlzLmluZF9zdWJzLnB1c2goaCk7CiAgICAgICAgdmFyIGwgPSB0LnJlYWRVaW50OCgpLCBwID0gdC5yZWFkVWludDgoKSwgXyA9IHQucmVhZFVpbnQ4KCk7CiAgICAgICAgaC5mc2NvZCA9IGwgPj4gNiwgaC5ic2lkID0gbCA+PiAxICYgMzEsIGguYnNtb2QgPSAobCAmIDEpIDw8IDQgfCBwID4+IDQgJiAxNSwgaC5hY21vZCA9IHAgPj4gMSAmIDcsIGgubGZlb24gPSBwICYgMSwgaC5udW1fZGVwX3N1YiA9IF8gPj4gMSAmIDE1LCBoLm51bV9kZXBfc3ViID4gMCAmJiAoaC5jaGFuX2xvYyA9IChfICYgMSkgPDwgOCB8IHQucmVhZFVpbnQ4KCkpOwogICAgICB9CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3RvcigiZGZMYSIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUgPSAxMjcsIHMgPSAxMjgsIGggPSBbXSwgbCA9IFsKICAgICAgICAiU1RSRUFNSU5GTyIsCiAgICAgICAgIlBBRERJTkciLAogICAgICAgICJBUFBMSUNBVElPTiIsCiAgICAgICAgIlNFRUtUQUJMRSIsCiAgICAgICAgIlZPUkJJU19DT01NRU5UIiwKICAgICAgICAiQ1VFU0hFRVQiLAogICAgICAgICJQSUNUVVJFIiwKICAgICAgICAiUkVTRVJWRUQiCiAgICAgIF07CiAgICAgIHRoaXMucGFyc2VGdWxsSGVhZGVyKHQpOwogICAgICBkbyB7CiAgICAgICAgdmFyIHAgPSB0LnJlYWRVaW50OCgpLCBfID0gTWF0aC5taW4oCiAgICAgICAgICBwICYgZSwKICAgICAgICAgIGwubGVuZ3RoIC0gMQogICAgICAgICk7CiAgICAgICAgaWYgKF8gPyB0LnJlYWRVaW50OEFycmF5KHQucmVhZFVpbnQyNCgpKSA6ICh0LnJlYWRVaW50OEFycmF5KDEzKSwgdGhpcy5zYW1wbGVyYXRlID0gdC5yZWFkVWludDMyKCkgPj4gMTIsIHQucmVhZFVpbnQ4QXJyYXkoMjApKSwgaC5wdXNoKGxbX10pLCBwICYgcykKICAgICAgICAgIGJyZWFrOwogICAgICB9IHdoaWxlICh0cnVlKTsKICAgICAgdGhpcy5udW1NZXRhZGF0YUJsb2NrcyA9IGgubGVuZ3RoICsgIiAoIiArIGguam9pbigiLCAiKSArICIpIjsKICAgIH0pLCByLmNyZWF0ZUJveEN0b3IoImRpbW0iLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuYnl0ZXNzZW50ID0gdC5yZWFkVWludDY0KCk7CiAgICB9KSwgci5jcmVhdGVCb3hDdG9yKCJkbWF4IiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLnRpbWUgPSB0LnJlYWRVaW50MzIoKTsKICAgIH0pLCByLmNyZWF0ZUJveEN0b3IoImRtZWQiLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuYnl0ZXNzZW50ID0gdC5yZWFkVWludDY0KCk7CiAgICB9KSwgci5jcmVhdGVCb3hDdG9yKCJkT3BzIiwgZnVuY3Rpb24odCkgewogICAgICBpZiAodGhpcy5WZXJzaW9uID0gdC5yZWFkVWludDgoKSwgdGhpcy5PdXRwdXRDaGFubmVsQ291bnQgPSB0LnJlYWRVaW50OCgpLCB0aGlzLlByZVNraXAgPSB0LnJlYWRVaW50MTYoKSwgdGhpcy5JbnB1dFNhbXBsZVJhdGUgPSB0LnJlYWRVaW50MzIoKSwgdGhpcy5PdXRwdXRHYWluID0gdC5yZWFkSW50MTYoKSwgdGhpcy5DaGFubmVsTWFwcGluZ0ZhbWlseSA9IHQucmVhZFVpbnQ4KCksIHRoaXMuQ2hhbm5lbE1hcHBpbmdGYW1pbHkgIT09IDApIHsKICAgICAgICB0aGlzLlN0cmVhbUNvdW50ID0gdC5yZWFkVWludDgoKSwgdGhpcy5Db3VwbGVkQ291bnQgPSB0LnJlYWRVaW50OCgpLCB0aGlzLkNoYW5uZWxNYXBwaW5nID0gW107CiAgICAgICAgZm9yICh2YXIgZSA9IDA7IGUgPCB0aGlzLk91dHB1dENoYW5uZWxDb3VudDsgZSsrKQogICAgICAgICAgdGhpcy5DaGFubmVsTWFwcGluZ1tlXSA9IHQucmVhZFVpbnQ4KCk7CiAgICAgIH0KICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJkcmVmIiwgZnVuY3Rpb24odCkgewogICAgICB2YXIgZSwgczsKICAgICAgdGhpcy5lbnRyaWVzID0gW107CiAgICAgIGZvciAodmFyIGggPSB0LnJlYWRVaW50MzIoKSwgbCA9IDA7IGwgPCBoOyBsKyspCiAgICAgICAgaWYgKGUgPSByLnBhcnNlT25lQm94KHQsIGZhbHNlLCB0aGlzLnNpemUgLSAodC5nZXRQb3NpdGlvbigpIC0gdGhpcy5zdGFydCkpLCBlLmNvZGUgPT09IHIuT0spCiAgICAgICAgICBzID0gZS5ib3gsIHRoaXMuZW50cmllcy5wdXNoKHMpOwogICAgICAgIGVsc2UKICAgICAgICAgIHJldHVybjsKICAgIH0pLCByLmNyZWF0ZUJveEN0b3IoImRyZXAiLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuYnl0ZXNzZW50ID0gdC5yZWFkVWludDY0KCk7CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3RvcigiZWxuZyIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5leHRlbmRlZF9sYW5ndWFnZSA9IHQucmVhZFN0cmluZyh0aGlzLnNpemUgLSB0aGlzLmhkcl9zaXplKTsKICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJlbHN0IiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLmVudHJpZXMgPSBbXTsKICAgICAgZm9yICh2YXIgZSA9IHQucmVhZFVpbnQzMigpLCBzID0gMDsgcyA8IGU7IHMrKykgewogICAgICAgIHZhciBoID0ge307CiAgICAgICAgdGhpcy5lbnRyaWVzLnB1c2goaCksIHRoaXMudmVyc2lvbiA9PT0gMSA/IChoLnNlZ21lbnRfZHVyYXRpb24gPSB0LnJlYWRVaW50NjQoKSwgaC5tZWRpYV90aW1lID0gdC5yZWFkSW50NjQoKSkgOiAoaC5zZWdtZW50X2R1cmF0aW9uID0gdC5yZWFkVWludDMyKCksIGgubWVkaWFfdGltZSA9IHQucmVhZEludDMyKCkpLCBoLm1lZGlhX3JhdGVfaW50ZWdlciA9IHQucmVhZEludDE2KCksIGgubWVkaWFfcmF0ZV9mcmFjdGlvbiA9IHQucmVhZEludDE2KCk7CiAgICAgIH0KICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJlbXNnIiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLnZlcnNpb24gPT0gMSA/ICh0aGlzLnRpbWVzY2FsZSA9IHQucmVhZFVpbnQzMigpLCB0aGlzLnByZXNlbnRhdGlvbl90aW1lID0gdC5yZWFkVWludDY0KCksIHRoaXMuZXZlbnRfZHVyYXRpb24gPSB0LnJlYWRVaW50MzIoKSwgdGhpcy5pZCA9IHQucmVhZFVpbnQzMigpLCB0aGlzLnNjaGVtZV9pZF91cmkgPSB0LnJlYWRDU3RyaW5nKCksIHRoaXMudmFsdWUgPSB0LnJlYWRDU3RyaW5nKCkpIDogKHRoaXMuc2NoZW1lX2lkX3VyaSA9IHQucmVhZENTdHJpbmcoKSwgdGhpcy52YWx1ZSA9IHQucmVhZENTdHJpbmcoKSwgdGhpcy50aW1lc2NhbGUgPSB0LnJlYWRVaW50MzIoKSwgdGhpcy5wcmVzZW50YXRpb25fdGltZV9kZWx0YSA9IHQucmVhZFVpbnQzMigpLCB0aGlzLmV2ZW50X2R1cmF0aW9uID0gdC5yZWFkVWludDMyKCksIHRoaXMuaWQgPSB0LnJlYWRVaW50MzIoKSk7CiAgICAgIHZhciBlID0gdGhpcy5zaXplIC0gdGhpcy5oZHJfc2l6ZSAtICg0ICogNCArICh0aGlzLnNjaGVtZV9pZF91cmkubGVuZ3RoICsgMSkgKyAodGhpcy52YWx1ZS5sZW5ndGggKyAxKSk7CiAgICAgIHRoaXMudmVyc2lvbiA9PSAxICYmIChlIC09IDQpLCB0aGlzLm1lc3NhZ2VfZGF0YSA9IHQucmVhZFVpbnQ4QXJyYXkoZSk7CiAgICB9KSwgci5jcmVhdGVFbnRpdHlUb0dyb3VwQ3RvciA9IGZ1bmN0aW9uKHQsIGUpIHsKICAgICAgclt0ICsgIkJveCJdID0gZnVuY3Rpb24ocykgewogICAgICAgIHIuRnVsbEJveC5jYWxsKHRoaXMsIHQsIHMpOwogICAgICB9LCByW3QgKyAiQm94Il0ucHJvdG90eXBlID0gbmV3IHIuRnVsbEJveCgpLCByW3QgKyAiQm94Il0ucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24ocykgewogICAgICAgIGlmICh0aGlzLnBhcnNlRnVsbEhlYWRlcihzKSwgZSkKICAgICAgICAgIGUuY2FsbCh0aGlzLCBzKTsKICAgICAgICBlbHNlCiAgICAgICAgICBmb3IgKHRoaXMuZ3JvdXBfaWQgPSBzLnJlYWRVaW50MzIoKSwgdGhpcy5udW1fZW50aXRpZXNfaW5fZ3JvdXAgPSBzLnJlYWRVaW50MzIoKSwgdGhpcy5lbnRpdHlfaWRzID0gW10sIGkgPSAwOyBpIDwgdGhpcy5udW1fZW50aXRpZXNfaW5fZ3JvdXA7IGkrKykgewogICAgICAgICAgICB2YXIgaCA9IHMucmVhZFVpbnQzMigpOwogICAgICAgICAgICB0aGlzLmVudGl0eV9pZHMucHVzaChoKTsKICAgICAgICAgIH0KICAgICAgfTsKICAgIH0sIHIuY3JlYXRlRW50aXR5VG9Hcm91cEN0b3IoImFlYnIiKSwgci5jcmVhdGVFbnRpdHlUb0dyb3VwQ3RvcigiYWZiciIpLCByLmNyZWF0ZUVudGl0eVRvR3JvdXBDdG9yKCJhbGJjIiksIHIuY3JlYXRlRW50aXR5VG9Hcm91cEN0b3IoImFsdHIiKSwgci5jcmVhdGVFbnRpdHlUb0dyb3VwQ3RvcigiYnJzdCIpLCByLmNyZWF0ZUVudGl0eVRvR3JvdXBDdG9yKCJkb2JyIiksIHIuY3JlYXRlRW50aXR5VG9Hcm91cEN0b3IoImVxaXYiKSwgci5jcmVhdGVFbnRpdHlUb0dyb3VwQ3RvcigiZmF2YyIpLCByLmNyZWF0ZUVudGl0eVRvR3JvdXBDdG9yKCJmb2JyIiksIHIuY3JlYXRlRW50aXR5VG9Hcm91cEN0b3IoImlhdWciKSwgci5jcmVhdGVFbnRpdHlUb0dyb3VwQ3RvcigicGFubyIpLCByLmNyZWF0ZUVudGl0eVRvR3JvdXBDdG9yKCJzbGlkIiksIHIuY3JlYXRlRW50aXR5VG9Hcm91cEN0b3IoInN0ZXIiKSwgci5jcmVhdGVFbnRpdHlUb0dyb3VwQ3RvcigidHN5biIpLCByLmNyZWF0ZUVudGl0eVRvR3JvdXBDdG9yKCJ3YmJyIiksIHIuY3JlYXRlRW50aXR5VG9Hcm91cEN0b3IoInByZ3IiKSwgci5jcmVhdGVGdWxsQm94Q3RvcigiZXNkcyIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUgPSB0LnJlYWRVaW50OEFycmF5KHRoaXMuc2l6ZSAtIHRoaXMuaGRyX3NpemUpOwogICAgICBpZiAodGhpcy5kYXRhID0gZSwgdHlwZW9mIGMgPCAidSIpIHsKICAgICAgICB2YXIgcyA9IG5ldyBjKCk7CiAgICAgICAgdGhpcy5lc2QgPSBzLnBhcnNlT25lRGVzY3JpcHRvcihuZXcgbihlLmJ1ZmZlciwgMCwgbi5CSUdfRU5ESUFOKSk7CiAgICAgIH0KICAgIH0pLCByLmNyZWF0ZUJveEN0b3IoImZpZWwiLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuZmllbGRDb3VudCA9IHQucmVhZFVpbnQ4KCksIHRoaXMuZmllbGRPcmRlcmluZyA9IHQucmVhZFVpbnQ4KCk7CiAgICB9KSwgci5jcmVhdGVCb3hDdG9yKCJmcm1hIiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLmRhdGFfZm9ybWF0ID0gdC5yZWFkU3RyaW5nKDQpOwogICAgfSksIHIuY3JlYXRlQm94Q3RvcigiZnR5cCIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUgPSB0aGlzLnNpemUgLSB0aGlzLmhkcl9zaXplOwogICAgICB0aGlzLm1ham9yX2JyYW5kID0gdC5yZWFkU3RyaW5nKDQpLCB0aGlzLm1pbm9yX3ZlcnNpb24gPSB0LnJlYWRVaW50MzIoKSwgZSAtPSA4LCB0aGlzLmNvbXBhdGlibGVfYnJhbmRzID0gW107CiAgICAgIGZvciAodmFyIHMgPSAwOyBlID49IDQ7ICkKICAgICAgICB0aGlzLmNvbXBhdGlibGVfYnJhbmRzW3NdID0gdC5yZWFkU3RyaW5nKDQpLCBlIC09IDQsIHMrKzsKICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJoZGxyIiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLnZlcnNpb24gPT09IDAgJiYgKHQucmVhZFVpbnQzMigpLCB0aGlzLmhhbmRsZXIgPSB0LnJlYWRTdHJpbmcoNCksIHQucmVhZFVpbnQzMkFycmF5KDMpLCB0aGlzLm5hbWUgPSB0LnJlYWRTdHJpbmcodGhpcy5zaXplIC0gdGhpcy5oZHJfc2l6ZSAtIDIwKSwgdGhpcy5uYW1lW3RoaXMubmFtZS5sZW5ndGggLSAxXSA9PT0gIlwwIiAmJiAodGhpcy5uYW1lID0gdGhpcy5uYW1lLnNsaWNlKDAsIC0xKSkpOwogICAgfSksIHIuY3JlYXRlQm94Q3RvcigiaHZjQyIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUsIHMsIGgsIGw7CiAgICAgIHRoaXMuY29uZmlndXJhdGlvblZlcnNpb24gPSB0LnJlYWRVaW50OCgpLCBsID0gdC5yZWFkVWludDgoKSwgdGhpcy5nZW5lcmFsX3Byb2ZpbGVfc3BhY2UgPSBsID4+IDYsIHRoaXMuZ2VuZXJhbF90aWVyX2ZsYWcgPSAobCAmIDMyKSA+PiA1LCB0aGlzLmdlbmVyYWxfcHJvZmlsZV9pZGMgPSBsICYgMzEsIHRoaXMuZ2VuZXJhbF9wcm9maWxlX2NvbXBhdGliaWxpdHkgPSB0LnJlYWRVaW50MzIoKSwgdGhpcy5nZW5lcmFsX2NvbnN0cmFpbnRfaW5kaWNhdG9yID0gdC5yZWFkVWludDhBcnJheSg2KSwgdGhpcy5nZW5lcmFsX2xldmVsX2lkYyA9IHQucmVhZFVpbnQ4KCksIHRoaXMubWluX3NwYXRpYWxfc2VnbWVudGF0aW9uX2lkYyA9IHQucmVhZFVpbnQxNigpICYgNDA5NSwgdGhpcy5wYXJhbGxlbGlzbVR5cGUgPSB0LnJlYWRVaW50OCgpICYgMywgdGhpcy5jaHJvbWFfZm9ybWF0X2lkYyA9IHQucmVhZFVpbnQ4KCkgJiAzLCB0aGlzLmJpdF9kZXB0aF9sdW1hX21pbnVzOCA9IHQucmVhZFVpbnQ4KCkgJiA3LCB0aGlzLmJpdF9kZXB0aF9jaHJvbWFfbWludXM4ID0gdC5yZWFkVWludDgoKSAmIDcsIHRoaXMuYXZnRnJhbWVSYXRlID0gdC5yZWFkVWludDE2KCksIGwgPSB0LnJlYWRVaW50OCgpLCB0aGlzLmNvbnN0YW50RnJhbWVSYXRlID0gbCA+PiA2LCB0aGlzLm51bVRlbXBvcmFsTGF5ZXJzID0gKGwgJiAxMykgPj4gMywgdGhpcy50ZW1wb3JhbElkTmVzdGVkID0gKGwgJiA0KSA+PiAyLCB0aGlzLmxlbmd0aFNpemVNaW51c09uZSA9IGwgJiAzLCB0aGlzLm5hbHVfYXJyYXlzID0gW107CiAgICAgIHZhciBwID0gdC5yZWFkVWludDgoKTsKICAgICAgZm9yIChlID0gMDsgZSA8IHA7IGUrKykgewogICAgICAgIHZhciBfID0gW107CiAgICAgICAgdGhpcy5uYWx1X2FycmF5cy5wdXNoKF8pLCBsID0gdC5yZWFkVWludDgoKSwgXy5jb21wbGV0ZW5lc3MgPSAobCAmIDEyOCkgPj4gNywgXy5uYWx1X3R5cGUgPSBsICYgNjM7CiAgICAgICAgdmFyIG0gPSB0LnJlYWRVaW50MTYoKTsKICAgICAgICBmb3IgKHMgPSAwOyBzIDwgbTsgcysrKSB7CiAgICAgICAgICB2YXIgdyA9IHt9OwogICAgICAgICAgXy5wdXNoKHcpLCBoID0gdC5yZWFkVWludDE2KCksIHcuZGF0YSA9IHQucmVhZFVpbnQ4QXJyYXkoaCk7CiAgICAgICAgfQogICAgICB9CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3RvcigiaWluZiIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGU7CiAgICAgIHRoaXMudmVyc2lvbiA9PT0gMCA/IHRoaXMuZW50cnlfY291bnQgPSB0LnJlYWRVaW50MTYoKSA6IHRoaXMuZW50cnlfY291bnQgPSB0LnJlYWRVaW50MzIoKSwgdGhpcy5pdGVtX2luZm9zID0gW107CiAgICAgIGZvciAodmFyIHMgPSAwOyBzIDwgdGhpcy5lbnRyeV9jb3VudDsgcysrKQogICAgICAgIGlmIChlID0gci5wYXJzZU9uZUJveCh0LCBmYWxzZSwgdGhpcy5zaXplIC0gKHQuZ2V0UG9zaXRpb24oKSAtIHRoaXMuc3RhcnQpKSwgZS5jb2RlID09PSByLk9LKQogICAgICAgICAgZS5ib3gudHlwZSAhPT0gImluZmUiICYmIGEuZXJyb3IoIkJveFBhcnNlciIsICJFeHBlY3RlZCAnaW5mZScgYm94LCBnb3QgIiArIGUuYm94LnR5cGUpLCB0aGlzLml0ZW1faW5mb3Nbc10gPSBlLmJveDsKICAgICAgICBlbHNlCiAgICAgICAgICByZXR1cm47CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3RvcigiaWxvYyIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGU7CiAgICAgIGUgPSB0LnJlYWRVaW50OCgpLCB0aGlzLm9mZnNldF9zaXplID0gZSA+PiA0ICYgMTUsIHRoaXMubGVuZ3RoX3NpemUgPSBlICYgMTUsIGUgPSB0LnJlYWRVaW50OCgpLCB0aGlzLmJhc2Vfb2Zmc2V0X3NpemUgPSBlID4+IDQgJiAxNSwgdGhpcy52ZXJzaW9uID09PSAxIHx8IHRoaXMudmVyc2lvbiA9PT0gMiA/IHRoaXMuaW5kZXhfc2l6ZSA9IGUgJiAxNSA6IHRoaXMuaW5kZXhfc2l6ZSA9IDAsIHRoaXMuaXRlbXMgPSBbXTsKICAgICAgdmFyIHMgPSAwOwogICAgICBpZiAodGhpcy52ZXJzaW9uIDwgMikKICAgICAgICBzID0gdC5yZWFkVWludDE2KCk7CiAgICAgIGVsc2UgaWYgKHRoaXMudmVyc2lvbiA9PT0gMikKICAgICAgICBzID0gdC5yZWFkVWludDMyKCk7CiAgICAgIGVsc2UKICAgICAgICB0aHJvdyAidmVyc2lvbiBvZiBpbG9jIGJveCBub3Qgc3VwcG9ydGVkIjsKICAgICAgZm9yICh2YXIgaCA9IDA7IGggPCBzOyBoKyspIHsKICAgICAgICB2YXIgbCA9IHt9OwogICAgICAgIGlmICh0aGlzLml0ZW1zLnB1c2gobCksIHRoaXMudmVyc2lvbiA8IDIpCiAgICAgICAgICBsLml0ZW1fSUQgPSB0LnJlYWRVaW50MTYoKTsKICAgICAgICBlbHNlIGlmICh0aGlzLnZlcnNpb24gPT09IDIpCiAgICAgICAgICBsLml0ZW1fSUQgPSB0LnJlYWRVaW50MTYoKTsKICAgICAgICBlbHNlCiAgICAgICAgICB0aHJvdyAidmVyc2lvbiBvZiBpbG9jIGJveCBub3Qgc3VwcG9ydGVkIjsKICAgICAgICBzd2l0Y2ggKHRoaXMudmVyc2lvbiA9PT0gMSB8fCB0aGlzLnZlcnNpb24gPT09IDIgPyBsLmNvbnN0cnVjdGlvbl9tZXRob2QgPSB0LnJlYWRVaW50MTYoKSAmIDE1IDogbC5jb25zdHJ1Y3Rpb25fbWV0aG9kID0gMCwgbC5kYXRhX3JlZmVyZW5jZV9pbmRleCA9IHQucmVhZFVpbnQxNigpLCB0aGlzLmJhc2Vfb2Zmc2V0X3NpemUpIHsKICAgICAgICAgIGNhc2UgMDoKICAgICAgICAgICAgbC5iYXNlX29mZnNldCA9IDA7CiAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgY2FzZSA0OgogICAgICAgICAgICBsLmJhc2Vfb2Zmc2V0ID0gdC5yZWFkVWludDMyKCk7CiAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgY2FzZSA4OgogICAgICAgICAgICBsLmJhc2Vfb2Zmc2V0ID0gdC5yZWFkVWludDY0KCk7CiAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgZGVmYXVsdDoKICAgICAgICAgICAgdGhyb3cgIkVycm9yIHJlYWRpbmcgYmFzZSBvZmZzZXQgc2l6ZSI7CiAgICAgICAgfQogICAgICAgIHZhciBwID0gdC5yZWFkVWludDE2KCk7CiAgICAgICAgbC5leHRlbnRzID0gW107CiAgICAgICAgZm9yICh2YXIgXyA9IDA7IF8gPCBwOyBfKyspIHsKICAgICAgICAgIHZhciBtID0ge307CiAgICAgICAgICBpZiAobC5leHRlbnRzLnB1c2gobSksIHRoaXMudmVyc2lvbiA9PT0gMSB8fCB0aGlzLnZlcnNpb24gPT09IDIpCiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5pbmRleF9zaXplKSB7CiAgICAgICAgICAgICAgY2FzZSAwOgogICAgICAgICAgICAgICAgbS5leHRlbnRfaW5kZXggPSAwOwogICAgICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICAgICAgY2FzZSA0OgogICAgICAgICAgICAgICAgbS5leHRlbnRfaW5kZXggPSB0LnJlYWRVaW50MzIoKTsKICAgICAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgICAgIGNhc2UgODoKICAgICAgICAgICAgICAgIG0uZXh0ZW50X2luZGV4ID0gdC5yZWFkVWludDY0KCk7CiAgICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgICBkZWZhdWx0OgogICAgICAgICAgICAgICAgdGhyb3cgIkVycm9yIHJlYWRpbmcgZXh0ZW50IGluZGV4IjsKICAgICAgICAgICAgfQogICAgICAgICAgc3dpdGNoICh0aGlzLm9mZnNldF9zaXplKSB7CiAgICAgICAgICAgIGNhc2UgMDoKICAgICAgICAgICAgICBtLmV4dGVudF9vZmZzZXQgPSAwOwogICAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgICBjYXNlIDQ6CiAgICAgICAgICAgICAgbS5leHRlbnRfb2Zmc2V0ID0gdC5yZWFkVWludDMyKCk7CiAgICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICAgIGNhc2UgODoKICAgICAgICAgICAgICBtLmV4dGVudF9vZmZzZXQgPSB0LnJlYWRVaW50NjQoKTsKICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgZGVmYXVsdDoKICAgICAgICAgICAgICB0aHJvdyAiRXJyb3IgcmVhZGluZyBleHRlbnQgaW5kZXgiOwogICAgICAgICAgfQogICAgICAgICAgc3dpdGNoICh0aGlzLmxlbmd0aF9zaXplKSB7CiAgICAgICAgICAgIGNhc2UgMDoKICAgICAgICAgICAgICBtLmV4dGVudF9sZW5ndGggPSAwOwogICAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgICBjYXNlIDQ6CiAgICAgICAgICAgICAgbS5leHRlbnRfbGVuZ3RoID0gdC5yZWFkVWludDMyKCk7CiAgICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICAgIGNhc2UgODoKICAgICAgICAgICAgICBtLmV4dGVudF9sZW5ndGggPSB0LnJlYWRVaW50NjQoKTsKICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgZGVmYXVsdDoKICAgICAgICAgICAgICB0aHJvdyAiRXJyb3IgcmVhZGluZyBleHRlbnQgaW5kZXgiOwogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfQogICAgfSksIHIuY3JlYXRlQm94Q3RvcigiaW1pciIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUgPSB0LnJlYWRVaW50OCgpOwogICAgICB0aGlzLnJlc2VydmVkID0gZSA+PiA3LCB0aGlzLmF4aXMgPSBlICYgMTsKICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJpbmZlIiwgZnVuY3Rpb24odCkgewogICAgICBpZiAoKHRoaXMudmVyc2lvbiA9PT0gMCB8fCB0aGlzLnZlcnNpb24gPT09IDEpICYmICh0aGlzLml0ZW1fSUQgPSB0LnJlYWRVaW50MTYoKSwgdGhpcy5pdGVtX3Byb3RlY3Rpb25faW5kZXggPSB0LnJlYWRVaW50MTYoKSwgdGhpcy5pdGVtX25hbWUgPSB0LnJlYWRDU3RyaW5nKCksIHRoaXMuY29udGVudF90eXBlID0gdC5yZWFkQ1N0cmluZygpLCB0aGlzLmNvbnRlbnRfZW5jb2RpbmcgPSB0LnJlYWRDU3RyaW5nKCkpLCB0aGlzLnZlcnNpb24gPT09IDEpIHsKICAgICAgICB0aGlzLmV4dGVuc2lvbl90eXBlID0gdC5yZWFkU3RyaW5nKDQpLCBhLndhcm4oIkJveFBhcnNlciIsICJDYW5ub3QgcGFyc2UgZXh0ZW5zaW9uIHR5cGUiKSwgdC5zZWVrKHRoaXMuc3RhcnQgKyB0aGlzLnNpemUpOwogICAgICAgIHJldHVybjsKICAgICAgfQogICAgICB0aGlzLnZlcnNpb24gPj0gMiAmJiAodGhpcy52ZXJzaW9uID09PSAyID8gdGhpcy5pdGVtX0lEID0gdC5yZWFkVWludDE2KCkgOiB0aGlzLnZlcnNpb24gPT09IDMgJiYgKHRoaXMuaXRlbV9JRCA9IHQucmVhZFVpbnQzMigpKSwgdGhpcy5pdGVtX3Byb3RlY3Rpb25faW5kZXggPSB0LnJlYWRVaW50MTYoKSwgdGhpcy5pdGVtX3R5cGUgPSB0LnJlYWRTdHJpbmcoNCksIHRoaXMuaXRlbV9uYW1lID0gdC5yZWFkQ1N0cmluZygpLCB0aGlzLml0ZW1fdHlwZSA9PT0gIm1pbWUiID8gKHRoaXMuY29udGVudF90eXBlID0gdC5yZWFkQ1N0cmluZygpLCB0aGlzLmNvbnRlbnRfZW5jb2RpbmcgPSB0LnJlYWRDU3RyaW5nKCkpIDogdGhpcy5pdGVtX3R5cGUgPT09ICJ1cmkgIiAmJiAodGhpcy5pdGVtX3VyaV90eXBlID0gdC5yZWFkQ1N0cmluZygpKSk7CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3RvcigiaXBtYSIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUsIHM7CiAgICAgIGZvciAoZW50cnlfY291bnQgPSB0LnJlYWRVaW50MzIoKSwgdGhpcy5hc3NvY2lhdGlvbnMgPSBbXSwgZSA9IDA7IGUgPCBlbnRyeV9jb3VudDsgZSsrKSB7CiAgICAgICAgdmFyIGggPSB7fTsKICAgICAgICB0aGlzLmFzc29jaWF0aW9ucy5wdXNoKGgpLCB0aGlzLnZlcnNpb24gPCAxID8gaC5pZCA9IHQucmVhZFVpbnQxNigpIDogaC5pZCA9IHQucmVhZFVpbnQzMigpOwogICAgICAgIHZhciBsID0gdC5yZWFkVWludDgoKTsKICAgICAgICBmb3IgKGgucHJvcHMgPSBbXSwgcyA9IDA7IHMgPCBsOyBzKyspIHsKICAgICAgICAgIHZhciBwID0gdC5yZWFkVWludDgoKSwgXyA9IHt9OwogICAgICAgICAgaC5wcm9wcy5wdXNoKF8pLCBfLmVzc2VudGlhbCA9IChwICYgMTI4KSA+PiA3ID09PSAxLCB0aGlzLmZsYWdzICYgMSA/IF8ucHJvcGVydHlfaW5kZXggPSAocCAmIDEyNykgPDwgOCB8IHQucmVhZFVpbnQ4KCkgOiBfLnByb3BlcnR5X2luZGV4ID0gcCAmIDEyNzsKICAgICAgICB9CiAgICAgIH0KICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJpcmVmIiwgZnVuY3Rpb24odCkgewogICAgICB2YXIgZSwgczsKICAgICAgZm9yICh0aGlzLnJlZmVyZW5jZXMgPSBbXTsgdC5nZXRQb3NpdGlvbigpIDwgdGhpcy5zdGFydCArIHRoaXMuc2l6ZTsgKQogICAgICAgIGlmIChlID0gci5wYXJzZU9uZUJveCh0LCB0cnVlLCB0aGlzLnNpemUgLSAodC5nZXRQb3NpdGlvbigpIC0gdGhpcy5zdGFydCkpLCBlLmNvZGUgPT09IHIuT0spCiAgICAgICAgICB0aGlzLnZlcnNpb24gPT09IDAgPyBzID0gbmV3IHIuU2luZ2xlSXRlbVR5cGVSZWZlcmVuY2VCb3goZS50eXBlLCBlLnNpemUsIGUuaGRyX3NpemUsIGUuc3RhcnQpIDogcyA9IG5ldyByLlNpbmdsZUl0ZW1UeXBlUmVmZXJlbmNlQm94TGFyZ2UoZS50eXBlLCBlLnNpemUsIGUuaGRyX3NpemUsIGUuc3RhcnQpLCBzLndyaXRlID09PSByLkJveC5wcm90b3R5cGUud3JpdGUgJiYgcy50eXBlICE9PSAibWRhdCIgJiYgKGEud2FybigiQm94UGFyc2VyIiwgcy50eXBlICsgIiBib3ggd3JpdGluZyBub3QgeWV0IGltcGxlbWVudGVkLCBrZWVwaW5nIHVucGFyc2VkIGRhdGEgaW4gbWVtb3J5IGZvciBsYXRlciB3cml0ZSIpLCBzLnBhcnNlRGF0YUFuZFJld2luZCh0KSksIHMucGFyc2UodCksIHRoaXMucmVmZXJlbmNlcy5wdXNoKHMpOwogICAgICAgIGVsc2UKICAgICAgICAgIHJldHVybjsKICAgIH0pLCByLmNyZWF0ZUJveEN0b3IoImlyb3QiLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuYW5nbGUgPSB0LnJlYWRVaW50OCgpICYgMzsKICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJpc3BlIiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLmltYWdlX3dpZHRoID0gdC5yZWFkVWludDMyKCksIHRoaXMuaW1hZ2VfaGVpZ2h0ID0gdC5yZWFkVWludDMyKCk7CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3Rvcigia2luZCIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5zY2hlbWVVUkkgPSB0LnJlYWRDU3RyaW5nKCksIHRoaXMudmFsdWUgPSB0LnJlYWRDU3RyaW5nKCk7CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3RvcigibGV2YSIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUgPSB0LnJlYWRVaW50OCgpOwogICAgICB0aGlzLmxldmVscyA9IFtdOwogICAgICBmb3IgKHZhciBzID0gMDsgcyA8IGU7IHMrKykgewogICAgICAgIHZhciBoID0ge307CiAgICAgICAgdGhpcy5sZXZlbHNbc10gPSBoLCBoLnRyYWNrX0lEID0gdC5yZWFkVWludDMyKCk7CiAgICAgICAgdmFyIGwgPSB0LnJlYWRVaW50OCgpOwogICAgICAgIHN3aXRjaCAoaC5wYWRkaW5nX2ZsYWcgPSBsID4+IDcsIGguYXNzaWdubWVudF90eXBlID0gbCAmIDEyNywgaC5hc3NpZ25tZW50X3R5cGUpIHsKICAgICAgICAgIGNhc2UgMDoKICAgICAgICAgICAgaC5ncm91cGluZ190eXBlID0gdC5yZWFkU3RyaW5nKDQpOwogICAgICAgICAgICBicmVhazsKICAgICAgICAgIGNhc2UgMToKICAgICAgICAgICAgaC5ncm91cGluZ190eXBlID0gdC5yZWFkU3RyaW5nKDQpLCBoLmdyb3VwaW5nX3R5cGVfcGFyYW1ldGVyID0gdC5yZWFkVWludDMyKCk7CiAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgY2FzZSAyOgogICAgICAgICAgICBicmVhazsKICAgICAgICAgIGNhc2UgMzoKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICBjYXNlIDQ6CiAgICAgICAgICAgIGguc3ViX3RyYWNrX2lkID0gdC5yZWFkVWludDMyKCk7CiAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgZGVmYXVsdDoKICAgICAgICAgICAgYS53YXJuKCJCb3hQYXJzZXIiLCAiVW5rbm93biBsZXZhIGFzc2lnbmVtZW50IHR5cGUiKTsKICAgICAgICB9CiAgICAgIH0KICAgIH0pLCByLmNyZWF0ZUJveEN0b3IoImxzZWwiLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMubGF5ZXJfaWQgPSB0LnJlYWRVaW50MTYoKTsKICAgIH0pLCByLmNyZWF0ZUJveEN0b3IoIm1heHIiLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMucGVyaW9kID0gdC5yZWFkVWludDMyKCksIHRoaXMuYnl0ZXMgPSB0LnJlYWRVaW50MzIoKTsKICAgIH0pLCByLmNyZWF0ZUJveEN0b3IoIm1kY3YiLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuZGlzcGxheV9wcmltYXJpZXMgPSBbXSwgdGhpcy5kaXNwbGF5X3ByaW1hcmllc1swXSA9IHt9LCB0aGlzLmRpc3BsYXlfcHJpbWFyaWVzWzBdLnggPSB0LnJlYWRVaW50MTYoKSwgdGhpcy5kaXNwbGF5X3ByaW1hcmllc1swXS55ID0gdC5yZWFkVWludDE2KCksIHRoaXMuZGlzcGxheV9wcmltYXJpZXNbMV0gPSB7fSwgdGhpcy5kaXNwbGF5X3ByaW1hcmllc1sxXS54ID0gdC5yZWFkVWludDE2KCksIHRoaXMuZGlzcGxheV9wcmltYXJpZXNbMV0ueSA9IHQucmVhZFVpbnQxNigpLCB0aGlzLmRpc3BsYXlfcHJpbWFyaWVzWzJdID0ge30sIHRoaXMuZGlzcGxheV9wcmltYXJpZXNbMl0ueCA9IHQucmVhZFVpbnQxNigpLCB0aGlzLmRpc3BsYXlfcHJpbWFyaWVzWzJdLnkgPSB0LnJlYWRVaW50MTYoKSwgdGhpcy53aGl0ZV9wb2ludCA9IHt9LCB0aGlzLndoaXRlX3BvaW50LnggPSB0LnJlYWRVaW50MTYoKSwgdGhpcy53aGl0ZV9wb2ludC55ID0gdC5yZWFkVWludDE2KCksIHRoaXMubWF4X2Rpc3BsYXlfbWFzdGVyaW5nX2x1bWluYW5jZSA9IHQucmVhZFVpbnQzMigpLCB0aGlzLm1pbl9kaXNwbGF5X21hc3RlcmluZ19sdW1pbmFuY2UgPSB0LnJlYWRVaW50MzIoKTsKICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJtZGhkIiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLnZlcnNpb24gPT0gMSA/ICh0aGlzLmNyZWF0aW9uX3RpbWUgPSB0LnJlYWRVaW50NjQoKSwgdGhpcy5tb2RpZmljYXRpb25fdGltZSA9IHQucmVhZFVpbnQ2NCgpLCB0aGlzLnRpbWVzY2FsZSA9IHQucmVhZFVpbnQzMigpLCB0aGlzLmR1cmF0aW9uID0gdC5yZWFkVWludDY0KCkpIDogKHRoaXMuY3JlYXRpb25fdGltZSA9IHQucmVhZFVpbnQzMigpLCB0aGlzLm1vZGlmaWNhdGlvbl90aW1lID0gdC5yZWFkVWludDMyKCksIHRoaXMudGltZXNjYWxlID0gdC5yZWFkVWludDMyKCksIHRoaXMuZHVyYXRpb24gPSB0LnJlYWRVaW50MzIoKSksIHRoaXMucGFyc2VMYW5ndWFnZSh0KSwgdC5yZWFkVWludDE2KCk7CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3RvcigibWVoZCIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5mbGFncyAmIDEgJiYgKGEud2FybigiQm94UGFyc2VyIiwgIm1laGQgYm94IGluY29ycmVjdGx5IHVzZXMgZmxhZ3Mgc2V0IHRvIDEsIGNvbnZlcnRpbmcgdmVyc2lvbiB0byAxIiksIHRoaXMudmVyc2lvbiA9IDEpLCB0aGlzLnZlcnNpb24gPT0gMSA/IHRoaXMuZnJhZ21lbnRfZHVyYXRpb24gPSB0LnJlYWRVaW50NjQoKSA6IHRoaXMuZnJhZ21lbnRfZHVyYXRpb24gPSB0LnJlYWRVaW50MzIoKTsKICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJtZXRhIiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLmJveGVzID0gW10sIHIuQ29udGFpbmVyQm94LnByb3RvdHlwZS5wYXJzZS5jYWxsKHRoaXMsIHQpOwogICAgfSksIHIuY3JlYXRlRnVsbEJveEN0b3IoIm1maGQiLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuc2VxdWVuY2VfbnVtYmVyID0gdC5yZWFkVWludDMyKCk7CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3RvcigibWZybyIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5fc2l6ZSA9IHQucmVhZFVpbnQzMigpOwogICAgfSksIHIuY3JlYXRlRnVsbEJveEN0b3IoIm12aGQiLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMudmVyc2lvbiA9PSAxID8gKHRoaXMuY3JlYXRpb25fdGltZSA9IHQucmVhZFVpbnQ2NCgpLCB0aGlzLm1vZGlmaWNhdGlvbl90aW1lID0gdC5yZWFkVWludDY0KCksIHRoaXMudGltZXNjYWxlID0gdC5yZWFkVWludDMyKCksIHRoaXMuZHVyYXRpb24gPSB0LnJlYWRVaW50NjQoKSkgOiAodGhpcy5jcmVhdGlvbl90aW1lID0gdC5yZWFkVWludDMyKCksIHRoaXMubW9kaWZpY2F0aW9uX3RpbWUgPSB0LnJlYWRVaW50MzIoKSwgdGhpcy50aW1lc2NhbGUgPSB0LnJlYWRVaW50MzIoKSwgdGhpcy5kdXJhdGlvbiA9IHQucmVhZFVpbnQzMigpKSwgdGhpcy5yYXRlID0gdC5yZWFkVWludDMyKCksIHRoaXMudm9sdW1lID0gdC5yZWFkVWludDE2KCkgPj4gOCwgdC5yZWFkVWludDE2KCksIHQucmVhZFVpbnQzMkFycmF5KDIpLCB0aGlzLm1hdHJpeCA9IHQucmVhZFVpbnQzMkFycmF5KDkpLCB0LnJlYWRVaW50MzJBcnJheSg2KSwgdGhpcy5uZXh0X3RyYWNrX2lkID0gdC5yZWFkVWludDMyKCk7CiAgICB9KSwgci5jcmVhdGVCb3hDdG9yKCJucGNrIiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLnBhY2tldHNzZW50ID0gdC5yZWFkVWludDMyKCk7CiAgICB9KSwgci5jcmVhdGVCb3hDdG9yKCJudW1wIiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLnBhY2tldHNzZW50ID0gdC5yZWFkVWludDY0KCk7CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3RvcigicGFkYiIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUgPSB0LnJlYWRVaW50MzIoKTsKICAgICAgdGhpcy5wYWRiaXRzID0gW107CiAgICAgIGZvciAodmFyIHMgPSAwOyBzIDwgTWF0aC5mbG9vcigoZSArIDEpIC8gMik7IHMrKykKICAgICAgICB0aGlzLnBhZGJpdHMgPSB0LnJlYWRVaW50OCgpOwogICAgfSksIHIuY3JlYXRlQm94Q3RvcigicGFzcCIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5oU3BhY2luZyA9IHQucmVhZFVpbnQzMigpLCB0aGlzLnZTcGFjaW5nID0gdC5yZWFkVWludDMyKCk7CiAgICB9KSwgci5jcmVhdGVCb3hDdG9yKCJwYXlsIiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLnRleHQgPSB0LnJlYWRTdHJpbmcodGhpcy5zaXplIC0gdGhpcy5oZHJfc2l6ZSk7CiAgICB9KSwgci5jcmVhdGVCb3hDdG9yKCJwYXl0IiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLnBheWxvYWRJRCA9IHQucmVhZFVpbnQzMigpOwogICAgICB2YXIgZSA9IHQucmVhZFVpbnQ4KCk7CiAgICAgIHRoaXMucnRwbWFwX3N0cmluZyA9IHQucmVhZFN0cmluZyhlKTsKICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJwZGluIiwgZnVuY3Rpb24odCkgewogICAgICB2YXIgZSA9ICh0aGlzLnNpemUgLSB0aGlzLmhkcl9zaXplKSAvIDg7CiAgICAgIHRoaXMucmF0ZSA9IFtdLCB0aGlzLmluaXRpYWxfZGVsYXkgPSBbXTsKICAgICAgZm9yICh2YXIgcyA9IDA7IHMgPCBlOyBzKyspCiAgICAgICAgdGhpcy5yYXRlW3NdID0gdC5yZWFkVWludDMyKCksIHRoaXMuaW5pdGlhbF9kZWxheVtzXSA9IHQucmVhZFVpbnQzMigpOwogICAgfSksIHIuY3JlYXRlRnVsbEJveEN0b3IoInBpdG0iLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMudmVyc2lvbiA9PT0gMCA/IHRoaXMuaXRlbV9pZCA9IHQucmVhZFVpbnQxNigpIDogdGhpcy5pdGVtX2lkID0gdC5yZWFkVWludDMyKCk7CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3RvcigicGl4aSIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGU7CiAgICAgIGZvciAodGhpcy5udW1fY2hhbm5lbHMgPSB0LnJlYWRVaW50OCgpLCB0aGlzLmJpdHNfcGVyX2NoYW5uZWxzID0gW10sIGUgPSAwOyBlIDwgdGhpcy5udW1fY2hhbm5lbHM7IGUrKykKICAgICAgICB0aGlzLmJpdHNfcGVyX2NoYW5uZWxzW2VdID0gdC5yZWFkVWludDgoKTsKICAgIH0pLCByLmNyZWF0ZUJveEN0b3IoInBtYXgiLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuYnl0ZXMgPSB0LnJlYWRVaW50MzIoKTsKICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJwcmRpIiwgZnVuY3Rpb24odCkgewogICAgICBpZiAodGhpcy5zdGVwX2NvdW50ID0gdC5yZWFkVWludDE2KCksIHRoaXMuaXRlbV9jb3VudCA9IFtdLCB0aGlzLmZsYWdzICYgMikKICAgICAgICBmb3IgKHZhciBlID0gMDsgZSA8IHRoaXMuc3RlcF9jb3VudDsgZSsrKQogICAgICAgICAgdGhpcy5pdGVtX2NvdW50W2VdID0gdC5yZWFkVWludDE2KCk7CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3RvcigicHJmdCIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5yZWZfdHJhY2tfaWQgPSB0LnJlYWRVaW50MzIoKSwgdGhpcy5udHBfdGltZXN0YW1wID0gdC5yZWFkVWludDY0KCksIHRoaXMudmVyc2lvbiA9PT0gMCA/IHRoaXMubWVkaWFfdGltZSA9IHQucmVhZFVpbnQzMigpIDogdGhpcy5tZWRpYV90aW1lID0gdC5yZWFkVWludDY0KCk7CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3RvcigicHNzaCIsIGZ1bmN0aW9uKHQpIHsKICAgICAgaWYgKHRoaXMuc3lzdGVtX2lkID0gci5wYXJzZUhleDE2KHQpLCB0aGlzLnZlcnNpb24gPiAwKSB7CiAgICAgICAgdmFyIGUgPSB0LnJlYWRVaW50MzIoKTsKICAgICAgICB0aGlzLmtpZCA9IFtdOwogICAgICAgIGZvciAodmFyIHMgPSAwOyBzIDwgZTsgcysrKQogICAgICAgICAgdGhpcy5raWRbc10gPSByLnBhcnNlSGV4MTYodCk7CiAgICAgIH0KICAgICAgdmFyIGggPSB0LnJlYWRVaW50MzIoKTsKICAgICAgaCA+IDAgJiYgKHRoaXMuZGF0YSA9IHQucmVhZFVpbnQ4QXJyYXkoaCkpOwogICAgfSksIHIuY3JlYXRlRnVsbEJveEN0b3IoImNsZWYiLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMud2lkdGggPSB0LnJlYWRVaW50MzIoKSwgdGhpcy5oZWlnaHQgPSB0LnJlYWRVaW50MzIoKTsKICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJlbm9mIiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLndpZHRoID0gdC5yZWFkVWludDMyKCksIHRoaXMuaGVpZ2h0ID0gdC5yZWFkVWludDMyKCk7CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3RvcigicHJvZiIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy53aWR0aCA9IHQucmVhZFVpbnQzMigpLCB0aGlzLmhlaWdodCA9IHQucmVhZFVpbnQzMigpOwogICAgfSksIHIuY3JlYXRlQ29udGFpbmVyQm94Q3RvcigidGFwdCIsIG51bGwsIFsiY2xlZiIsICJwcm9mIiwgImVub2YiXSksIHIuY3JlYXRlQm94Q3RvcigicnRwICIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5kZXNjcmlwdGlvbmZvcm1hdCA9IHQucmVhZFN0cmluZyg0KSwgdGhpcy5zZHB0ZXh0ID0gdC5yZWFkU3RyaW5nKHRoaXMuc2l6ZSAtIHRoaXMuaGRyX3NpemUgLSA0KTsKICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJzYWlvIiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLmZsYWdzICYgMSAmJiAodGhpcy5hdXhfaW5mb190eXBlID0gdC5yZWFkVWludDMyKCksIHRoaXMuYXV4X2luZm9fdHlwZV9wYXJhbWV0ZXIgPSB0LnJlYWRVaW50MzIoKSk7CiAgICAgIHZhciBlID0gdC5yZWFkVWludDMyKCk7CiAgICAgIHRoaXMub2Zmc2V0ID0gW107CiAgICAgIGZvciAodmFyIHMgPSAwOyBzIDwgZTsgcysrKQogICAgICAgIHRoaXMudmVyc2lvbiA9PT0gMCA/IHRoaXMub2Zmc2V0W3NdID0gdC5yZWFkVWludDMyKCkgOiB0aGlzLm9mZnNldFtzXSA9IHQucmVhZFVpbnQ2NCgpOwogICAgfSksIHIuY3JlYXRlRnVsbEJveEN0b3IoInNhaXoiLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuZmxhZ3MgJiAxICYmICh0aGlzLmF1eF9pbmZvX3R5cGUgPSB0LnJlYWRVaW50MzIoKSwgdGhpcy5hdXhfaW5mb190eXBlX3BhcmFtZXRlciA9IHQucmVhZFVpbnQzMigpKSwgdGhpcy5kZWZhdWx0X3NhbXBsZV9pbmZvX3NpemUgPSB0LnJlYWRVaW50OCgpOwogICAgICB2YXIgZSA9IHQucmVhZFVpbnQzMigpOwogICAgICBpZiAodGhpcy5zYW1wbGVfaW5mb19zaXplID0gW10sIHRoaXMuZGVmYXVsdF9zYW1wbGVfaW5mb19zaXplID09PSAwKQogICAgICAgIGZvciAodmFyIHMgPSAwOyBzIDwgZTsgcysrKQogICAgICAgICAgdGhpcy5zYW1wbGVfaW5mb19zaXplW3NdID0gdC5yZWFkVWludDgoKTsKICAgIH0pLCByLmNyZWF0ZVNhbXBsZUVudHJ5Q3RvcihyLlNBTVBMRV9FTlRSWV9UWVBFX01FVEFEQVRBLCAibWV0dCIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5wYXJzZUhlYWRlcih0KSwgdGhpcy5jb250ZW50X2VuY29kaW5nID0gdC5yZWFkQ1N0cmluZygpLCB0aGlzLm1pbWVfZm9ybWF0ID0gdC5yZWFkQ1N0cmluZygpLCB0aGlzLnBhcnNlRm9vdGVyKHQpOwogICAgfSksIHIuY3JlYXRlU2FtcGxlRW50cnlDdG9yKHIuU0FNUExFX0VOVFJZX1RZUEVfTUVUQURBVEEsICJtZXR4IiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLnBhcnNlSGVhZGVyKHQpLCB0aGlzLmNvbnRlbnRfZW5jb2RpbmcgPSB0LnJlYWRDU3RyaW5nKCksIHRoaXMubmFtZXNwYWNlID0gdC5yZWFkQ1N0cmluZygpLCB0aGlzLnNjaGVtYV9sb2NhdGlvbiA9IHQucmVhZENTdHJpbmcoKSwgdGhpcy5wYXJzZUZvb3Rlcih0KTsKICAgIH0pLCByLmNyZWF0ZVNhbXBsZUVudHJ5Q3RvcihyLlNBTVBMRV9FTlRSWV9UWVBFX1NVQlRJVExFLCAic2J0dCIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5wYXJzZUhlYWRlcih0KSwgdGhpcy5jb250ZW50X2VuY29kaW5nID0gdC5yZWFkQ1N0cmluZygpLCB0aGlzLm1pbWVfZm9ybWF0ID0gdC5yZWFkQ1N0cmluZygpLCB0aGlzLnBhcnNlRm9vdGVyKHQpOwogICAgfSksIHIuY3JlYXRlU2FtcGxlRW50cnlDdG9yKHIuU0FNUExFX0VOVFJZX1RZUEVfU1VCVElUTEUsICJzdHBwIiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLnBhcnNlSGVhZGVyKHQpLCB0aGlzLm5hbWVzcGFjZSA9IHQucmVhZENTdHJpbmcoKSwgdGhpcy5zY2hlbWFfbG9jYXRpb24gPSB0LnJlYWRDU3RyaW5nKCksIHRoaXMuYXV4aWxpYXJ5X21pbWVfdHlwZXMgPSB0LnJlYWRDU3RyaW5nKCksIHRoaXMucGFyc2VGb290ZXIodCk7CiAgICB9KSwgci5jcmVhdGVTYW1wbGVFbnRyeUN0b3Ioci5TQU1QTEVfRU5UUllfVFlQRV9TVUJUSVRMRSwgInN0eHQiLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMucGFyc2VIZWFkZXIodCksIHRoaXMuY29udGVudF9lbmNvZGluZyA9IHQucmVhZENTdHJpbmcoKSwgdGhpcy5taW1lX2Zvcm1hdCA9IHQucmVhZENTdHJpbmcoKSwgdGhpcy5wYXJzZUZvb3Rlcih0KTsKICAgIH0pLCByLmNyZWF0ZVNhbXBsZUVudHJ5Q3RvcihyLlNBTVBMRV9FTlRSWV9UWVBFX1NVQlRJVExFLCAidHgzZyIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5wYXJzZUhlYWRlcih0KSwgdGhpcy5kaXNwbGF5RmxhZ3MgPSB0LnJlYWRVaW50MzIoKSwgdGhpcy5ob3Jpem9udGFsX2p1c3RpZmljYXRpb24gPSB0LnJlYWRJbnQ4KCksIHRoaXMudmVydGljYWxfanVzdGlmaWNhdGlvbiA9IHQucmVhZEludDgoKSwgdGhpcy5iZ19jb2xvcl9yZ2JhID0gdC5yZWFkVWludDhBcnJheSg0KSwgdGhpcy5ib3hfcmVjb3JkID0gdC5yZWFkSW50MTZBcnJheSg0KSwgdGhpcy5zdHlsZV9yZWNvcmQgPSB0LnJlYWRVaW50OEFycmF5KDEyKSwgdGhpcy5wYXJzZUZvb3Rlcih0KTsKICAgIH0pLCByLmNyZWF0ZVNhbXBsZUVudHJ5Q3RvcihyLlNBTVBMRV9FTlRSWV9UWVBFX01FVEFEQVRBLCAid3Z0dCIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5wYXJzZUhlYWRlcih0KSwgdGhpcy5wYXJzZUZvb3Rlcih0KTsKICAgIH0pLCByLmNyZWF0ZVNhbXBsZUdyb3VwQ3RvcigiYWxzdCIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUsIHMgPSB0LnJlYWRVaW50MTYoKTsKICAgICAgZm9yICh0aGlzLmZpcnN0X291dHB1dF9zYW1wbGUgPSB0LnJlYWRVaW50MTYoKSwgdGhpcy5zYW1wbGVfb2Zmc2V0ID0gW10sIGUgPSAwOyBlIDwgczsgZSsrKQogICAgICAgIHRoaXMuc2FtcGxlX29mZnNldFtlXSA9IHQucmVhZFVpbnQzMigpOwogICAgICB2YXIgaCA9IHRoaXMuZGVzY3JpcHRpb25fbGVuZ3RoIC0gNCAtIDQgKiBzOwogICAgICBmb3IgKHRoaXMubnVtX291dHB1dF9zYW1wbGVzID0gW10sIHRoaXMubnVtX3RvdGFsX3NhbXBsZXMgPSBbXSwgZSA9IDA7IGUgPCBoIC8gNDsgZSsrKQogICAgICAgIHRoaXMubnVtX291dHB1dF9zYW1wbGVzW2VdID0gdC5yZWFkVWludDE2KCksIHRoaXMubnVtX3RvdGFsX3NhbXBsZXNbZV0gPSB0LnJlYWRVaW50MTYoKTsKICAgIH0pLCByLmNyZWF0ZVNhbXBsZUdyb3VwQ3RvcigiYXZsbCIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5sYXllck51bWJlciA9IHQucmVhZFVpbnQ4KCksIHRoaXMuYWNjdXJhdGVTdGF0aXN0aWNzRmxhZyA9IHQucmVhZFVpbnQ4KCksIHRoaXMuYXZnQml0UmF0ZSA9IHQucmVhZFVpbnQxNigpLCB0aGlzLmF2Z0ZyYW1lUmF0ZSA9IHQucmVhZFVpbnQxNigpOwogICAgfSksIHIuY3JlYXRlU2FtcGxlR3JvdXBDdG9yKCJhdnNzIiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLnN1YlNlcXVlbmNlSWRlbnRpZmllciA9IHQucmVhZFVpbnQxNigpLCB0aGlzLmxheWVyTnVtYmVyID0gdC5yZWFkVWludDgoKTsKICAgICAgdmFyIGUgPSB0LnJlYWRVaW50OCgpOwogICAgICB0aGlzLmR1cmF0aW9uRmxhZyA9IGUgPj4gNywgdGhpcy5hdmdSYXRlRmxhZyA9IGUgPj4gNiAmIDEsIHRoaXMuZHVyYXRpb25GbGFnICYmICh0aGlzLmR1cmF0aW9uID0gdC5yZWFkVWludDMyKCkpLCB0aGlzLmF2Z1JhdGVGbGFnICYmICh0aGlzLmFjY3VyYXRlU3RhdGlzdGljc0ZsYWcgPSB0LnJlYWRVaW50OCgpLCB0aGlzLmF2Z0JpdFJhdGUgPSB0LnJlYWRVaW50MTYoKSwgdGhpcy5hdmdGcmFtZVJhdGUgPSB0LnJlYWRVaW50MTYoKSksIHRoaXMuZGVwZW5kZW5jeSA9IFtdOwogICAgICBmb3IgKHZhciBzID0gdC5yZWFkVWludDgoKSwgaCA9IDA7IGggPCBzOyBoKyspIHsKICAgICAgICB2YXIgbCA9IHt9OwogICAgICAgIHRoaXMuZGVwZW5kZW5jeS5wdXNoKGwpLCBsLnN1YlNlcURpcmVjdGlvbkZsYWcgPSB0LnJlYWRVaW50OCgpLCBsLmxheWVyTnVtYmVyID0gdC5yZWFkVWludDgoKSwgbC5zdWJTZXF1ZW5jZUlkZW50aWZpZXIgPSB0LnJlYWRVaW50MTYoKTsKICAgICAgfQogICAgfSksIHIuY3JlYXRlU2FtcGxlR3JvdXBDdG9yKCJkdHJ0IiwgZnVuY3Rpb24odCkgewogICAgICBhLndhcm4oIkJveFBhcnNlciIsICJTYW1wbGUgR3JvdXAgdHlwZTogIiArIHRoaXMuZ3JvdXBpbmdfdHlwZSArICIgbm90IGZ1bGx5IHBhcnNlZCIpOwogICAgfSksIHIuY3JlYXRlU2FtcGxlR3JvdXBDdG9yKCJtdmlmIiwgZnVuY3Rpb24odCkgewogICAgICBhLndhcm4oIkJveFBhcnNlciIsICJTYW1wbGUgR3JvdXAgdHlwZTogIiArIHRoaXMuZ3JvdXBpbmdfdHlwZSArICIgbm90IGZ1bGx5IHBhcnNlZCIpOwogICAgfSksIHIuY3JlYXRlU2FtcGxlR3JvdXBDdG9yKCJwcm9sIiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLnJvbGxfZGlzdGFuY2UgPSB0LnJlYWRJbnQxNigpOwogICAgfSksIHIuY3JlYXRlU2FtcGxlR3JvdXBDdG9yKCJyYXAgIiwgZnVuY3Rpb24odCkgewogICAgICB2YXIgZSA9IHQucmVhZFVpbnQ4KCk7CiAgICAgIHRoaXMubnVtX2xlYWRpbmdfc2FtcGxlc19rbm93biA9IGUgPj4gNywgdGhpcy5udW1fbGVhZGluZ19zYW1wbGVzID0gZSAmIDEyNzsKICAgIH0pLCByLmNyZWF0ZVNhbXBsZUdyb3VwQ3RvcigicmFzaCIsIGZ1bmN0aW9uKHQpIHsKICAgICAgaWYgKHRoaXMub3BlcmF0aW9uX3BvaW50X2NvdW50ID0gdC5yZWFkVWludDE2KCksIHRoaXMuZGVzY3JpcHRpb25fbGVuZ3RoICE9PSAyICsgKHRoaXMub3BlcmF0aW9uX3BvaW50X2NvdW50ID09PSAxID8gMiA6IHRoaXMub3BlcmF0aW9uX3BvaW50X2NvdW50ICogNikgKyA5KQogICAgICAgIGEud2FybigiQm94UGFyc2VyIiwgIk1pc21hdGNoIGluICIgKyB0aGlzLmdyb3VwaW5nX3R5cGUgKyAiIHNhbXBsZSBncm91cCBsZW5ndGgiKSwgdGhpcy5kYXRhID0gdC5yZWFkVWludDhBcnJheSh0aGlzLmRlc2NyaXB0aW9uX2xlbmd0aCAtIDIpOwogICAgICBlbHNlIHsKICAgICAgICBpZiAodGhpcy5vcGVyYXRpb25fcG9pbnRfY291bnQgPT09IDEpCiAgICAgICAgICB0aGlzLnRhcmdldF9yYXRlX3NoYXJlID0gdC5yZWFkVWludDE2KCk7CiAgICAgICAgZWxzZSB7CiAgICAgICAgICB0aGlzLnRhcmdldF9yYXRlX3NoYXJlID0gW10sIHRoaXMuYXZhaWxhYmxlX2JpdHJhdGUgPSBbXTsKICAgICAgICAgIGZvciAodmFyIGUgPSAwOyBlIDwgdGhpcy5vcGVyYXRpb25fcG9pbnRfY291bnQ7IGUrKykKICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVfYml0cmF0ZVtlXSA9IHQucmVhZFVpbnQzMigpLCB0aGlzLnRhcmdldF9yYXRlX3NoYXJlW2VdID0gdC5yZWFkVWludDE2KCk7CiAgICAgICAgfQogICAgICAgIHRoaXMubWF4aW11bV9iaXRyYXRlID0gdC5yZWFkVWludDMyKCksIHRoaXMubWluaW11bV9iaXRyYXRlID0gdC5yZWFkVWludDMyKCksIHRoaXMuZGlzY2FyZF9wcmlvcml0eSA9IHQucmVhZFVpbnQ4KCk7CiAgICAgIH0KICAgIH0pLCByLmNyZWF0ZVNhbXBsZUdyb3VwQ3Rvcigicm9sbCIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5yb2xsX2Rpc3RhbmNlID0gdC5yZWFkSW50MTYoKTsKICAgIH0pLCByLlNhbXBsZUdyb3VwRW50cnkucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24odCkgewogICAgICBhLndhcm4oIkJveFBhcnNlciIsICJVbmtub3duIFNhbXBsZSBHcm91cCB0eXBlOiAiICsgdGhpcy5ncm91cGluZ190eXBlKSwgdGhpcy5kYXRhID0gdC5yZWFkVWludDhBcnJheSh0aGlzLmRlc2NyaXB0aW9uX2xlbmd0aCk7CiAgICB9LCByLmNyZWF0ZVNhbXBsZUdyb3VwQ3Rvcigic2NpZiIsIGZ1bmN0aW9uKHQpIHsKICAgICAgYS53YXJuKCJCb3hQYXJzZXIiLCAiU2FtcGxlIEdyb3VwIHR5cGU6ICIgKyB0aGlzLmdyb3VwaW5nX3R5cGUgKyAiIG5vdCBmdWxseSBwYXJzZWQiKTsKICAgIH0pLCByLmNyZWF0ZVNhbXBsZUdyb3VwQ3Rvcigic2NubSIsIGZ1bmN0aW9uKHQpIHsKICAgICAgYS53YXJuKCJCb3hQYXJzZXIiLCAiU2FtcGxlIEdyb3VwIHR5cGU6ICIgKyB0aGlzLmdyb3VwaW5nX3R5cGUgKyAiIG5vdCBmdWxseSBwYXJzZWQiKTsKICAgIH0pLCByLmNyZWF0ZVNhbXBsZUdyb3VwQ3Rvcigic2VpZyIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5yZXNlcnZlZCA9IHQucmVhZFVpbnQ4KCk7CiAgICAgIHZhciBlID0gdC5yZWFkVWludDgoKTsKICAgICAgdGhpcy5jcnlwdF9ieXRlX2Jsb2NrID0gZSA+PiA0LCB0aGlzLnNraXBfYnl0ZV9ibG9jayA9IGUgJiAxNSwgdGhpcy5pc1Byb3RlY3RlZCA9IHQucmVhZFVpbnQ4KCksIHRoaXMuUGVyX1NhbXBsZV9JVl9TaXplID0gdC5yZWFkVWludDgoKSwgdGhpcy5LSUQgPSByLnBhcnNlSGV4MTYodCksIHRoaXMuY29uc3RhbnRfSVZfc2l6ZSA9IDAsIHRoaXMuY29uc3RhbnRfSVYgPSAwLCB0aGlzLmlzUHJvdGVjdGVkID09PSAxICYmIHRoaXMuUGVyX1NhbXBsZV9JVl9TaXplID09PSAwICYmICh0aGlzLmNvbnN0YW50X0lWX3NpemUgPSB0LnJlYWRVaW50OCgpLCB0aGlzLmNvbnN0YW50X0lWID0gdC5yZWFkVWludDhBcnJheSh0aGlzLmNvbnN0YW50X0lWX3NpemUpKTsKICAgIH0pLCByLmNyZWF0ZVNhbXBsZUdyb3VwQ3Rvcigic3RzYSIsIGZ1bmN0aW9uKHQpIHsKICAgICAgYS53YXJuKCJCb3hQYXJzZXIiLCAiU2FtcGxlIEdyb3VwIHR5cGU6ICIgKyB0aGlzLmdyb3VwaW5nX3R5cGUgKyAiIG5vdCBmdWxseSBwYXJzZWQiKTsKICAgIH0pLCByLmNyZWF0ZVNhbXBsZUdyb3VwQ3Rvcigic3luYyIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUgPSB0LnJlYWRVaW50OCgpOwogICAgICB0aGlzLk5BTF91bml0X3R5cGUgPSBlICYgNjM7CiAgICB9KSwgci5jcmVhdGVTYW1wbGVHcm91cEN0b3IoInRlbGUiLCBmdW5jdGlvbih0KSB7CiAgICAgIHZhciBlID0gdC5yZWFkVWludDgoKTsKICAgICAgdGhpcy5sZXZlbF9pbmRlcGVuZGVudGx5X2RlY29kYWJsZSA9IGUgPj4gNzsKICAgIH0pLCByLmNyZWF0ZVNhbXBsZUdyb3VwQ3RvcigidHNhcyIsIGZ1bmN0aW9uKHQpIHsKICAgICAgYS53YXJuKCJCb3hQYXJzZXIiLCAiU2FtcGxlIEdyb3VwIHR5cGU6ICIgKyB0aGlzLmdyb3VwaW5nX3R5cGUgKyAiIG5vdCBmdWxseSBwYXJzZWQiKTsKICAgIH0pLCByLmNyZWF0ZVNhbXBsZUdyb3VwQ3RvcigidHNjbCIsIGZ1bmN0aW9uKHQpIHsKICAgICAgYS53YXJuKCJCb3hQYXJzZXIiLCAiU2FtcGxlIEdyb3VwIHR5cGU6ICIgKyB0aGlzLmdyb3VwaW5nX3R5cGUgKyAiIG5vdCBmdWxseSBwYXJzZWQiKTsKICAgIH0pLCByLmNyZWF0ZVNhbXBsZUdyb3VwQ3RvcigidmlwciIsIGZ1bmN0aW9uKHQpIHsKICAgICAgYS53YXJuKCJCb3hQYXJzZXIiLCAiU2FtcGxlIEdyb3VwIHR5cGU6ICIgKyB0aGlzLmdyb3VwaW5nX3R5cGUgKyAiIG5vdCBmdWxseSBwYXJzZWQiKTsKICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJzYmdwIiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLmdyb3VwaW5nX3R5cGUgPSB0LnJlYWRTdHJpbmcoNCksIHRoaXMudmVyc2lvbiA9PT0gMSA/IHRoaXMuZ3JvdXBpbmdfdHlwZV9wYXJhbWV0ZXIgPSB0LnJlYWRVaW50MzIoKSA6IHRoaXMuZ3JvdXBpbmdfdHlwZV9wYXJhbWV0ZXIgPSAwLCB0aGlzLmVudHJpZXMgPSBbXTsKICAgICAgZm9yICh2YXIgZSA9IHQucmVhZFVpbnQzMigpLCBzID0gMDsgcyA8IGU7IHMrKykgewogICAgICAgIHZhciBoID0ge307CiAgICAgICAgdGhpcy5lbnRyaWVzLnB1c2goaCksIGguc2FtcGxlX2NvdW50ID0gdC5yZWFkSW50MzIoKSwgaC5ncm91cF9kZXNjcmlwdGlvbl9pbmRleCA9IHQucmVhZEludDMyKCk7CiAgICAgIH0KICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJzY2htIiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLnNjaGVtZV90eXBlID0gdC5yZWFkU3RyaW5nKDQpLCB0aGlzLnNjaGVtZV92ZXJzaW9uID0gdC5yZWFkVWludDMyKCksIHRoaXMuZmxhZ3MgJiAxICYmICh0aGlzLnNjaGVtZV91cmkgPSB0LnJlYWRTdHJpbmcodGhpcy5zaXplIC0gdGhpcy5oZHJfc2l6ZSAtIDgpKTsKICAgIH0pLCByLmNyZWF0ZUJveEN0b3IoInNkcCAiLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuc2RwdGV4dCA9IHQucmVhZFN0cmluZyh0aGlzLnNpemUgLSB0aGlzLmhkcl9zaXplKTsKICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJzZHRwIiwgZnVuY3Rpb24odCkgewogICAgICB2YXIgZSwgcyA9IHRoaXMuc2l6ZSAtIHRoaXMuaGRyX3NpemU7CiAgICAgIHRoaXMuaXNfbGVhZGluZyA9IFtdLCB0aGlzLnNhbXBsZV9kZXBlbmRzX29uID0gW10sIHRoaXMuc2FtcGxlX2lzX2RlcGVuZGVkX29uID0gW10sIHRoaXMuc2FtcGxlX2hhc19yZWR1bmRhbmN5ID0gW107CiAgICAgIGZvciAodmFyIGggPSAwOyBoIDwgczsgaCsrKQogICAgICAgIGUgPSB0LnJlYWRVaW50OCgpLCB0aGlzLmlzX2xlYWRpbmdbaF0gPSBlID4+IDYsIHRoaXMuc2FtcGxlX2RlcGVuZHNfb25baF0gPSBlID4+IDQgJiAzLCB0aGlzLnNhbXBsZV9pc19kZXBlbmRlZF9vbltoXSA9IGUgPj4gMiAmIDMsIHRoaXMuc2FtcGxlX2hhc19yZWR1bmRhbmN5W2hdID0gZSAmIDM7CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3RvcigKICAgICAgInNlbmMiCiAgICAgIC8qLCBmdW5jdGlvbihzdHJlYW0pIHsKICAgICAgCXRoaXMucGFyc2VGdWxsSGVhZGVyKHN0cmVhbSk7CiAgICAgIAl2YXIgc2FtcGxlX2NvdW50ID0gc3RyZWFtLnJlYWRVaW50MzIoKTsKICAgICAgCXRoaXMuc2FtcGxlcyA9IFtdOwogICAgICAJZm9yICh2YXIgaSA9IDA7IGkgPCBzYW1wbGVfY291bnQ7IGkrKykgewogICAgICAJCXZhciBzYW1wbGUgPSB7fTsKICAgICAgCQkvLyB0ZW5jLmRlZmF1bHRfUGVyX1NhbXBsZV9JVl9TaXplIG9yIHNlaWcuUGVyX1NhbXBsZV9JVl9TaXplCiAgICAgIAkJc2FtcGxlLkluaXRpYWxpemF0aW9uVmVjdG9yID0gdGhpcy5yZWFkVWludDhBcnJheShQZXJfU2FtcGxlX0lWX1NpemUqOCk7CiAgICAgIAkJaWYgKHRoaXMuZmxhZ3MgJiAweDIpIHsKICAgICAgCQkJc2FtcGxlLnN1YnNhbXBsZXMgPSBbXTsKICAgICAgCQkJc3Vic2FtcGxlX2NvdW50ID0gc3RyZWFtLnJlYWRVaW50MTYoKTsKICAgICAgCQkJZm9yICh2YXIgaiA9IDA7IGogPCBzdWJzYW1wbGVfY291bnQ7IGorKykgewogICAgICAJCQkJdmFyIHN1YnNhbXBsZSA9IHt9OwogICAgICAJCQkJc3Vic2FtcGxlLkJ5dGVzT2ZDbGVhckRhdGEgPSBzdHJlYW0ucmVhZFVpbnQxNigpOwogICAgICAJCQkJc3Vic2FtcGxlLkJ5dGVzT2ZQcm90ZWN0ZWREYXRhID0gc3RyZWFtLnJlYWRVaW50MzIoKTsKICAgICAgCQkJCXNhbXBsZS5zdWJzYW1wbGVzLnB1c2goc3Vic2FtcGxlKTsKICAgICAgCQkJfQogICAgICAJCX0KICAgICAgCQkvLyBUT0RPCiAgICAgIAkJdGhpcy5zYW1wbGVzLnB1c2goc2FtcGxlKTsKICAgICAgCX0KICAgICAgfSovCiAgICApLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJzZ3BkIiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLmdyb3VwaW5nX3R5cGUgPSB0LnJlYWRTdHJpbmcoNCksIGEuZGVidWcoIkJveFBhcnNlciIsICJGb3VuZCBTYW1wbGUgR3JvdXBzIG9mIHR5cGUgIiArIHRoaXMuZ3JvdXBpbmdfdHlwZSksIHRoaXMudmVyc2lvbiA9PT0gMSA/IHRoaXMuZGVmYXVsdF9sZW5ndGggPSB0LnJlYWRVaW50MzIoKSA6IHRoaXMuZGVmYXVsdF9sZW5ndGggPSAwLCB0aGlzLnZlcnNpb24gPj0gMiAmJiAodGhpcy5kZWZhdWx0X2dyb3VwX2Rlc2NyaXB0aW9uX2luZGV4ID0gdC5yZWFkVWludDMyKCkpLCB0aGlzLmVudHJpZXMgPSBbXTsKICAgICAgZm9yICh2YXIgZSA9IHQucmVhZFVpbnQzMigpLCBzID0gMDsgcyA8IGU7IHMrKykgewogICAgICAgIHZhciBoOwogICAgICAgIHJbdGhpcy5ncm91cGluZ190eXBlICsgIlNhbXBsZUdyb3VwRW50cnkiXSA/IGggPSBuZXcgclt0aGlzLmdyb3VwaW5nX3R5cGUgKyAiU2FtcGxlR3JvdXBFbnRyeSJdKHRoaXMuZ3JvdXBpbmdfdHlwZSkgOiBoID0gbmV3IHIuU2FtcGxlR3JvdXBFbnRyeSh0aGlzLmdyb3VwaW5nX3R5cGUpLCB0aGlzLmVudHJpZXMucHVzaChoKSwgdGhpcy52ZXJzaW9uID09PSAxID8gdGhpcy5kZWZhdWx0X2xlbmd0aCA9PT0gMCA/IGguZGVzY3JpcHRpb25fbGVuZ3RoID0gdC5yZWFkVWludDMyKCkgOiBoLmRlc2NyaXB0aW9uX2xlbmd0aCA9IHRoaXMuZGVmYXVsdF9sZW5ndGggOiBoLmRlc2NyaXB0aW9uX2xlbmd0aCA9IHRoaXMuZGVmYXVsdF9sZW5ndGgsIGgud3JpdGUgPT09IHIuU2FtcGxlR3JvdXBFbnRyeS5wcm90b3R5cGUud3JpdGUgJiYgKGEuaW5mbygiQm94UGFyc2VyIiwgIlNhbXBsZUdyb3VwIGZvciB0eXBlICIgKyB0aGlzLmdyb3VwaW5nX3R5cGUgKyAiIHdyaXRpbmcgbm90IHlldCBpbXBsZW1lbnRlZCwga2VlcGluZyB1bnBhcnNlZCBkYXRhIGluIG1lbW9yeSBmb3IgbGF0ZXIgd3JpdGUiKSwgaC5kYXRhID0gdC5yZWFkVWludDhBcnJheShoLmRlc2NyaXB0aW9uX2xlbmd0aCksIHQucG9zaXRpb24gLT0gaC5kZXNjcmlwdGlvbl9sZW5ndGgpLCBoLnBhcnNlKHQpOwogICAgICB9CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3Rvcigic2lkeCIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5yZWZlcmVuY2VfSUQgPSB0LnJlYWRVaW50MzIoKSwgdGhpcy50aW1lc2NhbGUgPSB0LnJlYWRVaW50MzIoKSwgdGhpcy52ZXJzaW9uID09PSAwID8gKHRoaXMuZWFybGllc3RfcHJlc2VudGF0aW9uX3RpbWUgPSB0LnJlYWRVaW50MzIoKSwgdGhpcy5maXJzdF9vZmZzZXQgPSB0LnJlYWRVaW50MzIoKSkgOiAodGhpcy5lYXJsaWVzdF9wcmVzZW50YXRpb25fdGltZSA9IHQucmVhZFVpbnQ2NCgpLCB0aGlzLmZpcnN0X29mZnNldCA9IHQucmVhZFVpbnQ2NCgpKSwgdC5yZWFkVWludDE2KCksIHRoaXMucmVmZXJlbmNlcyA9IFtdOwogICAgICBmb3IgKHZhciBlID0gdC5yZWFkVWludDE2KCksIHMgPSAwOyBzIDwgZTsgcysrKSB7CiAgICAgICAgdmFyIGggPSB7fTsKICAgICAgICB0aGlzLnJlZmVyZW5jZXMucHVzaChoKTsKICAgICAgICB2YXIgbCA9IHQucmVhZFVpbnQzMigpOwogICAgICAgIGgucmVmZXJlbmNlX3R5cGUgPSBsID4+IDMxICYgMSwgaC5yZWZlcmVuY2VkX3NpemUgPSBsICYgMjE0NzQ4MzY0NywgaC5zdWJzZWdtZW50X2R1cmF0aW9uID0gdC5yZWFkVWludDMyKCksIGwgPSB0LnJlYWRVaW50MzIoKSwgaC5zdGFydHNfd2l0aF9TQVAgPSBsID4+IDMxICYgMSwgaC5TQVBfdHlwZSA9IGwgPj4gMjggJiA3LCBoLlNBUF9kZWx0YV90aW1lID0gbCAmIDI2ODQzNTQ1NTsKICAgICAgfQogICAgfSksIHIuU2luZ2xlSXRlbVR5cGVSZWZlcmVuY2VCb3ggPSBmdW5jdGlvbih0LCBlLCBzLCBoKSB7CiAgICAgIHIuQm94LmNhbGwodGhpcywgdCwgZSksIHRoaXMuaGRyX3NpemUgPSBzLCB0aGlzLnN0YXJ0ID0gaDsKICAgIH0sIHIuU2luZ2xlSXRlbVR5cGVSZWZlcmVuY2VCb3gucHJvdG90eXBlID0gbmV3IHIuQm94KCksIHIuU2luZ2xlSXRlbVR5cGVSZWZlcmVuY2VCb3gucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24odCkgewogICAgICB0aGlzLmZyb21faXRlbV9JRCA9IHQucmVhZFVpbnQxNigpOwogICAgICB2YXIgZSA9IHQucmVhZFVpbnQxNigpOwogICAgICB0aGlzLnJlZmVyZW5jZXMgPSBbXTsKICAgICAgZm9yICh2YXIgcyA9IDA7IHMgPCBlOyBzKyspCiAgICAgICAgdGhpcy5yZWZlcmVuY2VzW3NdID0ge30sIHRoaXMucmVmZXJlbmNlc1tzXS50b19pdGVtX0lEID0gdC5yZWFkVWludDE2KCk7CiAgICB9LCByLlNpbmdsZUl0ZW1UeXBlUmVmZXJlbmNlQm94TGFyZ2UgPSBmdW5jdGlvbih0LCBlLCBzLCBoKSB7CiAgICAgIHIuQm94LmNhbGwodGhpcywgdCwgZSksIHRoaXMuaGRyX3NpemUgPSBzLCB0aGlzLnN0YXJ0ID0gaDsKICAgIH0sIHIuU2luZ2xlSXRlbVR5cGVSZWZlcmVuY2VCb3hMYXJnZS5wcm90b3R5cGUgPSBuZXcgci5Cb3goKSwgci5TaW5nbGVJdGVtVHlwZVJlZmVyZW5jZUJveExhcmdlLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5mcm9tX2l0ZW1fSUQgPSB0LnJlYWRVaW50MzIoKTsKICAgICAgdmFyIGUgPSB0LnJlYWRVaW50MTYoKTsKICAgICAgdGhpcy5yZWZlcmVuY2VzID0gW107CiAgICAgIGZvciAodmFyIHMgPSAwOyBzIDwgZTsgcysrKQogICAgICAgIHRoaXMucmVmZXJlbmNlc1tzXSA9IHt9LCB0aGlzLnJlZmVyZW5jZXNbc10udG9faXRlbV9JRCA9IHQucmVhZFVpbnQzMigpOwogICAgfSwgci5jcmVhdGVGdWxsQm94Q3RvcigiU21EbSIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5wcmltYXJ5UkNocm9tYXRpY2l0eV94ID0gdC5yZWFkVWludDE2KCksIHRoaXMucHJpbWFyeVJDaHJvbWF0aWNpdHlfeSA9IHQucmVhZFVpbnQxNigpLCB0aGlzLnByaW1hcnlHQ2hyb21hdGljaXR5X3ggPSB0LnJlYWRVaW50MTYoKSwgdGhpcy5wcmltYXJ5R0Nocm9tYXRpY2l0eV95ID0gdC5yZWFkVWludDE2KCksIHRoaXMucHJpbWFyeUJDaHJvbWF0aWNpdHlfeCA9IHQucmVhZFVpbnQxNigpLCB0aGlzLnByaW1hcnlCQ2hyb21hdGljaXR5X3kgPSB0LnJlYWRVaW50MTYoKSwgdGhpcy53aGl0ZVBvaW50Q2hyb21hdGljaXR5X3ggPSB0LnJlYWRVaW50MTYoKSwgdGhpcy53aGl0ZVBvaW50Q2hyb21hdGljaXR5X3kgPSB0LnJlYWRVaW50MTYoKSwgdGhpcy5sdW1pbmFuY2VNYXggPSB0LnJlYWRVaW50MzIoKSwgdGhpcy5sdW1pbmFuY2VNaW4gPSB0LnJlYWRVaW50MzIoKTsKICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJzbWhkIiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLmJhbGFuY2UgPSB0LnJlYWRVaW50MTYoKSwgdC5yZWFkVWludDE2KCk7CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3Rvcigic3NpeCIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5zdWJzZWdtZW50cyA9IFtdOwogICAgICBmb3IgKHZhciBlID0gdC5yZWFkVWludDMyKCksIHMgPSAwOyBzIDwgZTsgcysrKSB7CiAgICAgICAgdmFyIGggPSB7fTsKICAgICAgICB0aGlzLnN1YnNlZ21lbnRzLnB1c2goaCksIGgucmFuZ2VzID0gW107CiAgICAgICAgZm9yICh2YXIgbCA9IHQucmVhZFVpbnQzMigpLCBwID0gMDsgcCA8IGw7IHArKykgewogICAgICAgICAgdmFyIF8gPSB7fTsKICAgICAgICAgIGgucmFuZ2VzLnB1c2goXyksIF8ubGV2ZWwgPSB0LnJlYWRVaW50OCgpLCBfLnJhbmdlX3NpemUgPSB0LnJlYWRVaW50MjQoKTsKICAgICAgICB9CiAgICAgIH0KICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJzdGNvIiwgZnVuY3Rpb24odCkgewogICAgICB2YXIgZTsKICAgICAgaWYgKGUgPSB0LnJlYWRVaW50MzIoKSwgdGhpcy5jaHVua19vZmZzZXRzID0gW10sIHRoaXMudmVyc2lvbiA9PT0gMCkKICAgICAgICBmb3IgKHZhciBzID0gMDsgcyA8IGU7IHMrKykKICAgICAgICAgIHRoaXMuY2h1bmtfb2Zmc2V0cy5wdXNoKHQucmVhZFVpbnQzMigpKTsKICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJzdGRwIiwgZnVuY3Rpb24odCkgewogICAgICB2YXIgZSA9ICh0aGlzLnNpemUgLSB0aGlzLmhkcl9zaXplKSAvIDI7CiAgICAgIHRoaXMucHJpb3JpdHkgPSBbXTsKICAgICAgZm9yICh2YXIgcyA9IDA7IHMgPCBlOyBzKyspCiAgICAgICAgdGhpcy5wcmlvcml0eVtzXSA9IHQucmVhZFVpbnQxNigpOwogICAgfSksIHIuY3JlYXRlRnVsbEJveEN0b3IoInN0aGQiKSwgci5jcmVhdGVGdWxsQm94Q3Rvcigic3RyaSIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5zd2l0Y2hfZ3JvdXAgPSB0LnJlYWRVaW50MTYoKSwgdGhpcy5hbHRlcm5hdGVfZ3JvdXAgPSB0LnJlYWRVaW50MTYoKSwgdGhpcy5zdWJfdHJhY2tfaWQgPSB0LnJlYWRVaW50MzIoKTsKICAgICAgdmFyIGUgPSAodGhpcy5zaXplIC0gdGhpcy5oZHJfc2l6ZSAtIDgpIC8gNDsKICAgICAgdGhpcy5hdHRyaWJ1dGVfbGlzdCA9IFtdOwogICAgICBmb3IgKHZhciBzID0gMDsgcyA8IGU7IHMrKykKICAgICAgICB0aGlzLmF0dHJpYnV0ZV9saXN0W3NdID0gdC5yZWFkVWludDMyKCk7CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3Rvcigic3RzYyIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUsIHM7CiAgICAgIGlmIChlID0gdC5yZWFkVWludDMyKCksIHRoaXMuZmlyc3RfY2h1bmsgPSBbXSwgdGhpcy5zYW1wbGVzX3Blcl9jaHVuayA9IFtdLCB0aGlzLnNhbXBsZV9kZXNjcmlwdGlvbl9pbmRleCA9IFtdLCB0aGlzLnZlcnNpb24gPT09IDApCiAgICAgICAgZm9yIChzID0gMDsgcyA8IGU7IHMrKykKICAgICAgICAgIHRoaXMuZmlyc3RfY2h1bmsucHVzaCh0LnJlYWRVaW50MzIoKSksIHRoaXMuc2FtcGxlc19wZXJfY2h1bmsucHVzaCh0LnJlYWRVaW50MzIoKSksIHRoaXMuc2FtcGxlX2Rlc2NyaXB0aW9uX2luZGV4LnB1c2godC5yZWFkVWludDMyKCkpOwogICAgfSksIHIuY3JlYXRlRnVsbEJveEN0b3IoInN0c2QiLCBmdW5jdGlvbih0KSB7CiAgICAgIHZhciBlLCBzLCBoLCBsOwogICAgICBmb3IgKHRoaXMuZW50cmllcyA9IFtdLCBoID0gdC5yZWFkVWludDMyKCksIGUgPSAxOyBlIDw9IGg7IGUrKykKICAgICAgICBpZiAocyA9IHIucGFyc2VPbmVCb3godCwgdHJ1ZSwgdGhpcy5zaXplIC0gKHQuZ2V0UG9zaXRpb24oKSAtIHRoaXMuc3RhcnQpKSwgcy5jb2RlID09PSByLk9LKQogICAgICAgICAgcltzLnR5cGUgKyAiU2FtcGxlRW50cnkiXSA/IChsID0gbmV3IHJbcy50eXBlICsgIlNhbXBsZUVudHJ5Il0ocy5zaXplKSwgbC5oZHJfc2l6ZSA9IHMuaGRyX3NpemUsIGwuc3RhcnQgPSBzLnN0YXJ0KSA6IChhLndhcm4oIkJveFBhcnNlciIsICJVbmtub3duIHNhbXBsZSBlbnRyeSB0eXBlOiAiICsgcy50eXBlKSwgbCA9IG5ldyByLlNhbXBsZUVudHJ5KHMudHlwZSwgcy5zaXplLCBzLmhkcl9zaXplLCBzLnN0YXJ0KSksIGwud3JpdGUgPT09IHIuU2FtcGxlRW50cnkucHJvdG90eXBlLndyaXRlICYmIChhLmluZm8oIkJveFBhcnNlciIsICJTYW1wbGVFbnRyeSAiICsgbC50eXBlICsgIiBib3ggd3JpdGluZyBub3QgeWV0IGltcGxlbWVudGVkLCBrZWVwaW5nIHVucGFyc2VkIGRhdGEgaW4gbWVtb3J5IGZvciBsYXRlciB3cml0ZSIpLCBsLnBhcnNlRGF0YUFuZFJld2luZCh0KSksIGwucGFyc2UodCksIHRoaXMuZW50cmllcy5wdXNoKGwpOwogICAgICAgIGVsc2UKICAgICAgICAgIHJldHVybjsKICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJzdHNnIiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLmdyb3VwaW5nX3R5cGUgPSB0LnJlYWRVaW50MzIoKTsKICAgICAgdmFyIGUgPSB0LnJlYWRVaW50MTYoKTsKICAgICAgdGhpcy5ncm91cF9kZXNjcmlwdGlvbl9pbmRleCA9IFtdOwogICAgICBmb3IgKHZhciBzID0gMDsgcyA8IGU7IHMrKykKICAgICAgICB0aGlzLmdyb3VwX2Rlc2NyaXB0aW9uX2luZGV4W3NdID0gdC5yZWFkVWludDMyKCk7CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3Rvcigic3RzaCIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUsIHM7CiAgICAgIGlmIChlID0gdC5yZWFkVWludDMyKCksIHRoaXMuc2hhZG93ZWRfc2FtcGxlX251bWJlcnMgPSBbXSwgdGhpcy5zeW5jX3NhbXBsZV9udW1iZXJzID0gW10sIHRoaXMudmVyc2lvbiA9PT0gMCkKICAgICAgICBmb3IgKHMgPSAwOyBzIDwgZTsgcysrKQogICAgICAgICAgdGhpcy5zaGFkb3dlZF9zYW1wbGVfbnVtYmVycy5wdXNoKHQucmVhZFVpbnQzMigpKSwgdGhpcy5zeW5jX3NhbXBsZV9udW1iZXJzLnB1c2godC5yZWFkVWludDMyKCkpOwogICAgfSksIHIuY3JlYXRlRnVsbEJveEN0b3IoInN0c3MiLCBmdW5jdGlvbih0KSB7CiAgICAgIHZhciBlLCBzOwogICAgICBpZiAocyA9IHQucmVhZFVpbnQzMigpLCB0aGlzLnZlcnNpb24gPT09IDApCiAgICAgICAgZm9yICh0aGlzLnNhbXBsZV9udW1iZXJzID0gW10sIGUgPSAwOyBlIDwgczsgZSsrKQogICAgICAgICAgdGhpcy5zYW1wbGVfbnVtYmVycy5wdXNoKHQucmVhZFVpbnQzMigpKTsKICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJzdHN6IiwgZnVuY3Rpb24odCkgewogICAgICB2YXIgZTsKICAgICAgaWYgKHRoaXMuc2FtcGxlX3NpemVzID0gW10sIHRoaXMudmVyc2lvbiA9PT0gMCkKICAgICAgICBmb3IgKHRoaXMuc2FtcGxlX3NpemUgPSB0LnJlYWRVaW50MzIoKSwgdGhpcy5zYW1wbGVfY291bnQgPSB0LnJlYWRVaW50MzIoKSwgZSA9IDA7IGUgPCB0aGlzLnNhbXBsZV9jb3VudDsgZSsrKQogICAgICAgICAgdGhpcy5zYW1wbGVfc2l6ZSA9PT0gMCA/IHRoaXMuc2FtcGxlX3NpemVzLnB1c2godC5yZWFkVWludDMyKCkpIDogdGhpcy5zYW1wbGVfc2l6ZXNbZV0gPSB0aGlzLnNhbXBsZV9zaXplOwogICAgfSksIHIuY3JlYXRlRnVsbEJveEN0b3IoInN0dHMiLCBmdW5jdGlvbih0KSB7CiAgICAgIHZhciBlLCBzLCBoOwogICAgICBpZiAoZSA9IHQucmVhZFVpbnQzMigpLCB0aGlzLnNhbXBsZV9jb3VudHMgPSBbXSwgdGhpcy5zYW1wbGVfZGVsdGFzID0gW10sIHRoaXMudmVyc2lvbiA9PT0gMCkKICAgICAgICBmb3IgKHMgPSAwOyBzIDwgZTsgcysrKQogICAgICAgICAgdGhpcy5zYW1wbGVfY291bnRzLnB1c2godC5yZWFkVWludDMyKCkpLCBoID0gdC5yZWFkSW50MzIoKSwgaCA8IDAgJiYgKGEud2FybigiQm94UGFyc2VyIiwgIkZpbGUgdXNlcyBuZWdhdGl2ZSBzdHRzIHNhbXBsZSBkZWx0YSwgdXNpbmcgdmFsdWUgMSBpbnN0ZWFkLCBzeW5jIG1heSBiZSBsb3N0ISIpLCBoID0gMSksIHRoaXMuc2FtcGxlX2RlbHRhcy5wdXNoKGgpOwogICAgfSksIHIuY3JlYXRlRnVsbEJveEN0b3IoInN0dmkiLCBmdW5jdGlvbih0KSB7CiAgICAgIHZhciBlID0gdC5yZWFkVWludDMyKCk7CiAgICAgIHRoaXMuc2luZ2xlX3ZpZXdfYWxsb3dlZCA9IGUgJiAzLCB0aGlzLnN0ZXJlb19zY2hlbWUgPSB0LnJlYWRVaW50MzIoKTsKICAgICAgdmFyIHMgPSB0LnJlYWRVaW50MzIoKTsKICAgICAgdGhpcy5zdGVyZW9faW5kaWNhdGlvbl90eXBlID0gdC5yZWFkU3RyaW5nKHMpOwogICAgICB2YXIgaCwgbDsKICAgICAgZm9yICh0aGlzLmJveGVzID0gW107IHQuZ2V0UG9zaXRpb24oKSA8IHRoaXMuc3RhcnQgKyB0aGlzLnNpemU7ICkKICAgICAgICBpZiAoaCA9IHIucGFyc2VPbmVCb3godCwgZmFsc2UsIHRoaXMuc2l6ZSAtICh0LmdldFBvc2l0aW9uKCkgLSB0aGlzLnN0YXJ0KSksIGguY29kZSA9PT0gci5PSykKICAgICAgICAgIGwgPSBoLmJveCwgdGhpcy5ib3hlcy5wdXNoKGwpLCB0aGlzW2wudHlwZV0gPSBsOwogICAgICAgIGVsc2UKICAgICAgICAgIHJldHVybjsKICAgIH0pLCByLmNyZWF0ZUJveEN0b3IoInN0eXAiLCBmdW5jdGlvbih0KSB7CiAgICAgIHIuZnR5cEJveC5wcm90b3R5cGUucGFyc2UuY2FsbCh0aGlzLCB0KTsKICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJzdHoyIiwgZnVuY3Rpb24odCkgewogICAgICB2YXIgZSwgczsKICAgICAgaWYgKHRoaXMuc2FtcGxlX3NpemVzID0gW10sIHRoaXMudmVyc2lvbiA9PT0gMCkKICAgICAgICBpZiAodGhpcy5yZXNlcnZlZCA9IHQucmVhZFVpbnQyNCgpLCB0aGlzLmZpZWxkX3NpemUgPSB0LnJlYWRVaW50OCgpLCBzID0gdC5yZWFkVWludDMyKCksIHRoaXMuZmllbGRfc2l6ZSA9PT0gNCkKICAgICAgICAgIGZvciAoZSA9IDA7IGUgPCBzOyBlICs9IDIpIHsKICAgICAgICAgICAgdmFyIGggPSB0LnJlYWRVaW50OCgpOwogICAgICAgICAgICB0aGlzLnNhbXBsZV9zaXplc1tlXSA9IGggPj4gNCAmIDE1LCB0aGlzLnNhbXBsZV9zaXplc1tlICsgMV0gPSBoICYgMTU7CiAgICAgICAgICB9CiAgICAgICAgZWxzZSBpZiAodGhpcy5maWVsZF9zaXplID09PSA4KQogICAgICAgICAgZm9yIChlID0gMDsgZSA8IHM7IGUrKykKICAgICAgICAgICAgdGhpcy5zYW1wbGVfc2l6ZXNbZV0gPSB0LnJlYWRVaW50OCgpOwogICAgICAgIGVsc2UgaWYgKHRoaXMuZmllbGRfc2l6ZSA9PT0gMTYpCiAgICAgICAgICBmb3IgKGUgPSAwOyBlIDwgczsgZSsrKQogICAgICAgICAgICB0aGlzLnNhbXBsZV9zaXplc1tlXSA9IHQucmVhZFVpbnQxNigpOwogICAgICAgIGVsc2UKICAgICAgICAgIGEuZXJyb3IoIkJveFBhcnNlciIsICJFcnJvciBpbiBsZW5ndGggZmllbGQgaW4gc3R6MiBib3giKTsKICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJzdWJzIiwgZnVuY3Rpb24odCkgewogICAgICB2YXIgZSwgcywgaCwgbDsKICAgICAgZm9yIChoID0gdC5yZWFkVWludDMyKCksIHRoaXMuZW50cmllcyA9IFtdLCBlID0gMDsgZSA8IGg7IGUrKykgewogICAgICAgIHZhciBwID0ge307CiAgICAgICAgaWYgKHRoaXMuZW50cmllc1tlXSA9IHAsIHAuc2FtcGxlX2RlbHRhID0gdC5yZWFkVWludDMyKCksIHAuc3Vic2FtcGxlcyA9IFtdLCBsID0gdC5yZWFkVWludDE2KCksIGwgPiAwKQogICAgICAgICAgZm9yIChzID0gMDsgcyA8IGw7IHMrKykgewogICAgICAgICAgICB2YXIgXyA9IHt9OwogICAgICAgICAgICBwLnN1YnNhbXBsZXMucHVzaChfKSwgdGhpcy52ZXJzaW9uID09IDEgPyBfLnNpemUgPSB0LnJlYWRVaW50MzIoKSA6IF8uc2l6ZSA9IHQucmVhZFVpbnQxNigpLCBfLnByaW9yaXR5ID0gdC5yZWFkVWludDgoKSwgXy5kaXNjYXJkYWJsZSA9IHQucmVhZFVpbnQ4KCksIF8uY29kZWNfc3BlY2lmaWNfcGFyYW1ldGVycyA9IHQucmVhZFVpbnQzMigpOwogICAgICAgICAgfQogICAgICB9CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3RvcigidGVuYyIsIGZ1bmN0aW9uKHQpIHsKICAgICAgaWYgKHQucmVhZFVpbnQ4KCksIHRoaXMudmVyc2lvbiA9PT0gMCkKICAgICAgICB0LnJlYWRVaW50OCgpOwogICAgICBlbHNlIHsKICAgICAgICB2YXIgZSA9IHQucmVhZFVpbnQ4KCk7CiAgICAgICAgdGhpcy5kZWZhdWx0X2NyeXB0X2J5dGVfYmxvY2sgPSBlID4+IDQgJiAxNSwgdGhpcy5kZWZhdWx0X3NraXBfYnl0ZV9ibG9jayA9IGUgJiAxNTsKICAgICAgfQogICAgICB0aGlzLmRlZmF1bHRfaXNQcm90ZWN0ZWQgPSB0LnJlYWRVaW50OCgpLCB0aGlzLmRlZmF1bHRfUGVyX1NhbXBsZV9JVl9TaXplID0gdC5yZWFkVWludDgoKSwgdGhpcy5kZWZhdWx0X0tJRCA9IHIucGFyc2VIZXgxNih0KSwgdGhpcy5kZWZhdWx0X2lzUHJvdGVjdGVkID09PSAxICYmIHRoaXMuZGVmYXVsdF9QZXJfU2FtcGxlX0lWX1NpemUgPT09IDAgJiYgKHRoaXMuZGVmYXVsdF9jb25zdGFudF9JVl9zaXplID0gdC5yZWFkVWludDgoKSwgdGhpcy5kZWZhdWx0X2NvbnN0YW50X0lWID0gdC5yZWFkVWludDhBcnJheSh0aGlzLmRlZmF1bHRfY29uc3RhbnRfSVZfc2l6ZSkpOwogICAgfSksIHIuY3JlYXRlRnVsbEJveEN0b3IoInRmZHQiLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMudmVyc2lvbiA9PSAxID8gdGhpcy5iYXNlTWVkaWFEZWNvZGVUaW1lID0gdC5yZWFkVWludDY0KCkgOiB0aGlzLmJhc2VNZWRpYURlY29kZVRpbWUgPSB0LnJlYWRVaW50MzIoKTsKICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJ0ZmhkIiwgZnVuY3Rpb24odCkgewogICAgICB2YXIgZSA9IDA7CiAgICAgIHRoaXMudHJhY2tfaWQgPSB0LnJlYWRVaW50MzIoKSwgdGhpcy5zaXplIC0gdGhpcy5oZHJfc2l6ZSA+IGUgJiYgdGhpcy5mbGFncyAmIHIuVEZIRF9GTEFHX0JBU0VfREFUQV9PRkZTRVQgPyAodGhpcy5iYXNlX2RhdGFfb2Zmc2V0ID0gdC5yZWFkVWludDY0KCksIGUgKz0gOCkgOiB0aGlzLmJhc2VfZGF0YV9vZmZzZXQgPSAwLCB0aGlzLnNpemUgLSB0aGlzLmhkcl9zaXplID4gZSAmJiB0aGlzLmZsYWdzICYgci5URkhEX0ZMQUdfU0FNUExFX0RFU0MgPyAodGhpcy5kZWZhdWx0X3NhbXBsZV9kZXNjcmlwdGlvbl9pbmRleCA9IHQucmVhZFVpbnQzMigpLCBlICs9IDQpIDogdGhpcy5kZWZhdWx0X3NhbXBsZV9kZXNjcmlwdGlvbl9pbmRleCA9IDAsIHRoaXMuc2l6ZSAtIHRoaXMuaGRyX3NpemUgPiBlICYmIHRoaXMuZmxhZ3MgJiByLlRGSERfRkxBR19TQU1QTEVfRFVSID8gKHRoaXMuZGVmYXVsdF9zYW1wbGVfZHVyYXRpb24gPSB0LnJlYWRVaW50MzIoKSwgZSArPSA0KSA6IHRoaXMuZGVmYXVsdF9zYW1wbGVfZHVyYXRpb24gPSAwLCB0aGlzLnNpemUgLSB0aGlzLmhkcl9zaXplID4gZSAmJiB0aGlzLmZsYWdzICYgci5URkhEX0ZMQUdfU0FNUExFX1NJWkUgPyAodGhpcy5kZWZhdWx0X3NhbXBsZV9zaXplID0gdC5yZWFkVWludDMyKCksIGUgKz0gNCkgOiB0aGlzLmRlZmF1bHRfc2FtcGxlX3NpemUgPSAwLCB0aGlzLnNpemUgLSB0aGlzLmhkcl9zaXplID4gZSAmJiB0aGlzLmZsYWdzICYgci5URkhEX0ZMQUdfU0FNUExFX0ZMQUdTID8gKHRoaXMuZGVmYXVsdF9zYW1wbGVfZmxhZ3MgPSB0LnJlYWRVaW50MzIoKSwgZSArPSA0KSA6IHRoaXMuZGVmYXVsdF9zYW1wbGVfZmxhZ3MgPSAwOwogICAgfSksIHIuY3JlYXRlRnVsbEJveEN0b3IoInRmcmEiLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMudHJhY2tfSUQgPSB0LnJlYWRVaW50MzIoKSwgdC5yZWFkVWludDI0KCk7CiAgICAgIHZhciBlID0gdC5yZWFkVWludDgoKTsKICAgICAgdGhpcy5sZW5ndGhfc2l6ZV9vZl90cmFmX251bSA9IGUgPj4gNCAmIDMsIHRoaXMubGVuZ3RoX3NpemVfb2ZfdHJ1bl9udW0gPSBlID4+IDIgJiAzLCB0aGlzLmxlbmd0aF9zaXplX29mX3NhbXBsZV9udW0gPSBlICYgMywgdGhpcy5lbnRyaWVzID0gW107CiAgICAgIGZvciAodmFyIHMgPSB0LnJlYWRVaW50MzIoKSwgaCA9IDA7IGggPCBzOyBoKyspCiAgICAgICAgdGhpcy52ZXJzaW9uID09PSAxID8gKHRoaXMudGltZSA9IHQucmVhZFVpbnQ2NCgpLCB0aGlzLm1vb2Zfb2Zmc2V0ID0gdC5yZWFkVWludDY0KCkpIDogKHRoaXMudGltZSA9IHQucmVhZFVpbnQzMigpLCB0aGlzLm1vb2Zfb2Zmc2V0ID0gdC5yZWFkVWludDMyKCkpLCB0aGlzLnRyYWZfbnVtYmVyID0gdFsicmVhZFVpbnQiICsgOCAqICh0aGlzLmxlbmd0aF9zaXplX29mX3RyYWZfbnVtICsgMSldKCksIHRoaXMudHJ1bl9udW1iZXIgPSB0WyJyZWFkVWludCIgKyA4ICogKHRoaXMubGVuZ3RoX3NpemVfb2ZfdHJ1bl9udW0gKyAxKV0oKSwgdGhpcy5zYW1wbGVfbnVtYmVyID0gdFsicmVhZFVpbnQiICsgOCAqICh0aGlzLmxlbmd0aF9zaXplX29mX3NhbXBsZV9udW0gKyAxKV0oKTsKICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJ0a2hkIiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLnZlcnNpb24gPT0gMSA/ICh0aGlzLmNyZWF0aW9uX3RpbWUgPSB0LnJlYWRVaW50NjQoKSwgdGhpcy5tb2RpZmljYXRpb25fdGltZSA9IHQucmVhZFVpbnQ2NCgpLCB0aGlzLnRyYWNrX2lkID0gdC5yZWFkVWludDMyKCksIHQucmVhZFVpbnQzMigpLCB0aGlzLmR1cmF0aW9uID0gdC5yZWFkVWludDY0KCkpIDogKHRoaXMuY3JlYXRpb25fdGltZSA9IHQucmVhZFVpbnQzMigpLCB0aGlzLm1vZGlmaWNhdGlvbl90aW1lID0gdC5yZWFkVWludDMyKCksIHRoaXMudHJhY2tfaWQgPSB0LnJlYWRVaW50MzIoKSwgdC5yZWFkVWludDMyKCksIHRoaXMuZHVyYXRpb24gPSB0LnJlYWRVaW50MzIoKSksIHQucmVhZFVpbnQzMkFycmF5KDIpLCB0aGlzLmxheWVyID0gdC5yZWFkSW50MTYoKSwgdGhpcy5hbHRlcm5hdGVfZ3JvdXAgPSB0LnJlYWRJbnQxNigpLCB0aGlzLnZvbHVtZSA9IHQucmVhZEludDE2KCkgPj4gOCwgdC5yZWFkVWludDE2KCksIHRoaXMubWF0cml4ID0gdC5yZWFkSW50MzJBcnJheSg5KSwgdGhpcy53aWR0aCA9IHQucmVhZFVpbnQzMigpLCB0aGlzLmhlaWdodCA9IHQucmVhZFVpbnQzMigpOwogICAgfSksIHIuY3JlYXRlQm94Q3RvcigidG1heCIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy50aW1lID0gdC5yZWFkVWludDMyKCk7CiAgICB9KSwgci5jcmVhdGVCb3hDdG9yKCJ0bWluIiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLnRpbWUgPSB0LnJlYWRVaW50MzIoKTsKICAgIH0pLCByLmNyZWF0ZUJveEN0b3IoInRvdGwiLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuYnl0ZXNzZW50ID0gdC5yZWFkVWludDMyKCk7CiAgICB9KSwgci5jcmVhdGVCb3hDdG9yKCJ0cGF5IiwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLmJ5dGVzc2VudCA9IHQucmVhZFVpbnQzMigpOwogICAgfSksIHIuY3JlYXRlQm94Q3RvcigidHB5bCIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5ieXRlc3NlbnQgPSB0LnJlYWRVaW50NjQoKTsKICAgIH0pLCByLlRyYWNrR3JvdXBUeXBlQm94LnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5wYXJzZUZ1bGxIZWFkZXIodCksIHRoaXMudHJhY2tfZ3JvdXBfaWQgPSB0LnJlYWRVaW50MzIoKTsKICAgIH0sIHIuY3JlYXRlVHJhY2tHcm91cEN0b3IoIm1zcmMiKSwgci5UcmFja1JlZmVyZW5jZVR5cGVCb3ggPSBmdW5jdGlvbih0LCBlLCBzLCBoKSB7CiAgICAgIHIuQm94LmNhbGwodGhpcywgdCwgZSksIHRoaXMuaGRyX3NpemUgPSBzLCB0aGlzLnN0YXJ0ID0gaDsKICAgIH0sIHIuVHJhY2tSZWZlcmVuY2VUeXBlQm94LnByb3RvdHlwZSA9IG5ldyByLkJveCgpLCByLlRyYWNrUmVmZXJlbmNlVHlwZUJveC5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMudHJhY2tfaWRzID0gdC5yZWFkVWludDMyQXJyYXkoKHRoaXMuc2l6ZSAtIHRoaXMuaGRyX3NpemUpIC8gNCk7CiAgICB9LCByLnRyZWZCb3gucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24odCkgewogICAgICBmb3IgKHZhciBlLCBzOyB0LmdldFBvc2l0aW9uKCkgPCB0aGlzLnN0YXJ0ICsgdGhpcy5zaXplOyApCiAgICAgICAgaWYgKGUgPSByLnBhcnNlT25lQm94KHQsIHRydWUsIHRoaXMuc2l6ZSAtICh0LmdldFBvc2l0aW9uKCkgLSB0aGlzLnN0YXJ0KSksIGUuY29kZSA9PT0gci5PSykKICAgICAgICAgIHMgPSBuZXcgci5UcmFja1JlZmVyZW5jZVR5cGVCb3goZS50eXBlLCBlLnNpemUsIGUuaGRyX3NpemUsIGUuc3RhcnQpLCBzLndyaXRlID09PSByLkJveC5wcm90b3R5cGUud3JpdGUgJiYgcy50eXBlICE9PSAibWRhdCIgJiYgKGEuaW5mbygiQm94UGFyc2VyIiwgIlRyYWNrUmVmZXJlbmNlICIgKyBzLnR5cGUgKyAiIGJveCB3cml0aW5nIG5vdCB5ZXQgaW1wbGVtZW50ZWQsIGtlZXBpbmcgdW5wYXJzZWQgZGF0YSBpbiBtZW1vcnkgZm9yIGxhdGVyIHdyaXRlIiksIHMucGFyc2VEYXRhQW5kUmV3aW5kKHQpKSwgcy5wYXJzZSh0KSwgdGhpcy5ib3hlcy5wdXNoKHMpOwogICAgICAgIGVsc2UKICAgICAgICAgIHJldHVybjsKICAgIH0sIHIuY3JlYXRlRnVsbEJveEN0b3IoInRyZXAiLCBmdW5jdGlvbih0KSB7CiAgICAgIGZvciAodGhpcy50cmFja19JRCA9IHQucmVhZFVpbnQzMigpLCB0aGlzLmJveGVzID0gW107IHQuZ2V0UG9zaXRpb24oKSA8IHRoaXMuc3RhcnQgKyB0aGlzLnNpemU7ICkKICAgICAgICBpZiAocmV0ID0gci5wYXJzZU9uZUJveCh0LCBmYWxzZSwgdGhpcy5zaXplIC0gKHQuZ2V0UG9zaXRpb24oKSAtIHRoaXMuc3RhcnQpKSwgcmV0LmNvZGUgPT09IHIuT0spCiAgICAgICAgICBib3ggPSByZXQuYm94LCB0aGlzLmJveGVzLnB1c2goYm94KTsKICAgICAgICBlbHNlCiAgICAgICAgICByZXR1cm47CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3RvcigidHJleCIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy50cmFja19pZCA9IHQucmVhZFVpbnQzMigpLCB0aGlzLmRlZmF1bHRfc2FtcGxlX2Rlc2NyaXB0aW9uX2luZGV4ID0gdC5yZWFkVWludDMyKCksIHRoaXMuZGVmYXVsdF9zYW1wbGVfZHVyYXRpb24gPSB0LnJlYWRVaW50MzIoKSwgdGhpcy5kZWZhdWx0X3NhbXBsZV9zaXplID0gdC5yZWFkVWludDMyKCksIHRoaXMuZGVmYXVsdF9zYW1wbGVfZmxhZ3MgPSB0LnJlYWRVaW50MzIoKTsKICAgIH0pLCByLmNyZWF0ZUJveEN0b3IoInRycHkiLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuYnl0ZXNzZW50ID0gdC5yZWFkVWludDY0KCk7CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3RvcigidHJ1biIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUgPSAwOwogICAgICBpZiAodGhpcy5zYW1wbGVfY291bnQgPSB0LnJlYWRVaW50MzIoKSwgZSArPSA0LCB0aGlzLnNpemUgLSB0aGlzLmhkcl9zaXplID4gZSAmJiB0aGlzLmZsYWdzICYgci5UUlVOX0ZMQUdTX0RBVEFfT0ZGU0VUID8gKHRoaXMuZGF0YV9vZmZzZXQgPSB0LnJlYWRJbnQzMigpLCBlICs9IDQpIDogdGhpcy5kYXRhX29mZnNldCA9IDAsIHRoaXMuc2l6ZSAtIHRoaXMuaGRyX3NpemUgPiBlICYmIHRoaXMuZmxhZ3MgJiByLlRSVU5fRkxBR1NfRklSU1RfRkxBRyA/ICh0aGlzLmZpcnN0X3NhbXBsZV9mbGFncyA9IHQucmVhZFVpbnQzMigpLCBlICs9IDQpIDogdGhpcy5maXJzdF9zYW1wbGVfZmxhZ3MgPSAwLCB0aGlzLnNhbXBsZV9kdXJhdGlvbiA9IFtdLCB0aGlzLnNhbXBsZV9zaXplID0gW10sIHRoaXMuc2FtcGxlX2ZsYWdzID0gW10sIHRoaXMuc2FtcGxlX2NvbXBvc2l0aW9uX3RpbWVfb2Zmc2V0ID0gW10sIHRoaXMuc2l6ZSAtIHRoaXMuaGRyX3NpemUgPiBlKQogICAgICAgIGZvciAodmFyIHMgPSAwOyBzIDwgdGhpcy5zYW1wbGVfY291bnQ7IHMrKykKICAgICAgICAgIHRoaXMuZmxhZ3MgJiByLlRSVU5fRkxBR1NfRFVSQVRJT04gJiYgKHRoaXMuc2FtcGxlX2R1cmF0aW9uW3NdID0gdC5yZWFkVWludDMyKCkpLCB0aGlzLmZsYWdzICYgci5UUlVOX0ZMQUdTX1NJWkUgJiYgKHRoaXMuc2FtcGxlX3NpemVbc10gPSB0LnJlYWRVaW50MzIoKSksIHRoaXMuZmxhZ3MgJiByLlRSVU5fRkxBR1NfRkxBR1MgJiYgKHRoaXMuc2FtcGxlX2ZsYWdzW3NdID0gdC5yZWFkVWludDMyKCkpLCB0aGlzLmZsYWdzICYgci5UUlVOX0ZMQUdTX0NUU19PRkZTRVQgJiYgKHRoaXMudmVyc2lvbiA9PT0gMCA/IHRoaXMuc2FtcGxlX2NvbXBvc2l0aW9uX3RpbWVfb2Zmc2V0W3NdID0gdC5yZWFkVWludDMyKCkgOiB0aGlzLnNhbXBsZV9jb21wb3NpdGlvbl90aW1lX29mZnNldFtzXSA9IHQucmVhZEludDMyKCkpOwogICAgfSksIHIuY3JlYXRlRnVsbEJveEN0b3IoInRzZWwiLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuc3dpdGNoX2dyb3VwID0gdC5yZWFkVWludDMyKCk7CiAgICAgIHZhciBlID0gKHRoaXMuc2l6ZSAtIHRoaXMuaGRyX3NpemUgLSA0KSAvIDQ7CiAgICAgIHRoaXMuYXR0cmlidXRlX2xpc3QgPSBbXTsKICAgICAgZm9yICh2YXIgcyA9IDA7IHMgPCBlOyBzKyspCiAgICAgICAgdGhpcy5hdHRyaWJ1dGVfbGlzdFtzXSA9IHQucmVhZFVpbnQzMigpOwogICAgfSksIHIuY3JlYXRlRnVsbEJveEN0b3IoInR4dEMiLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuY29uZmlnID0gdC5yZWFkQ1N0cmluZygpOwogICAgfSksIHIuY3JlYXRlQm94Q3RvcigidHljbyIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUgPSAodGhpcy5zaXplIC0gdGhpcy5oZHJfc2l6ZSkgLyA0OwogICAgICB0aGlzLmNvbXBhdGlibGVfYnJhbmRzID0gW107CiAgICAgIGZvciAodmFyIHMgPSAwOyBzIDwgZTsgcysrKQogICAgICAgIHRoaXMuY29tcGF0aWJsZV9icmFuZHNbc10gPSB0LnJlYWRTdHJpbmcoNCk7CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3RvcigidWRlcyIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5sYW5nID0gdC5yZWFkQ1N0cmluZygpLCB0aGlzLm5hbWUgPSB0LnJlYWRDU3RyaW5nKCksIHRoaXMuZGVzY3JpcHRpb24gPSB0LnJlYWRDU3RyaW5nKCksIHRoaXMudGFncyA9IHQucmVhZENTdHJpbmcoKTsKICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJ1bmNDIiwgZnVuY3Rpb24odCkgewogICAgICB2YXIgZTsKICAgICAgZm9yICh0aGlzLnByb2ZpbGUgPSB0LnJlYWRVaW50MzIoKSwgdGhpcy5jb21wb25lbnRfY291bnQgPSB0LnJlYWRVaW50MTYoKSwgdGhpcy5jb21wb25lbnRfaW5kZXggPSBbXSwgdGhpcy5jb21wb25lbnRfYml0X2RlcHRoX21pbnVzX29uZSA9IFtdLCB0aGlzLmNvbXBvbmVudF9mb3JtYXQgPSBbXSwgdGhpcy5jb21wb25lbnRfYWxpZ25fc2l6ZSA9IFtdLCBlID0gMDsgZSA8IHRoaXMuY29tcG9uZW50X2NvdW50OyBlKyspCiAgICAgICAgdGhpcy5jb21wb25lbnRfaW5kZXgucHVzaCh0LnJlYWRVaW50MTYoKSksIHRoaXMuY29tcG9uZW50X2JpdF9kZXB0aF9taW51c19vbmUucHVzaCh0LnJlYWRVaW50OCgpKSwgdGhpcy5jb21wb25lbnRfZm9ybWF0LnB1c2godC5yZWFkVWludDgoKSksIHRoaXMuY29tcG9uZW50X2FsaWduX3NpemUucHVzaCh0LnJlYWRVaW50OCgpKTsKICAgICAgdGhpcy5zYW1wbGluZ190eXBlID0gdC5yZWFkVWludDgoKSwgdGhpcy5pbnRlcmxlYXZlX3R5cGUgPSB0LnJlYWRVaW50OCgpLCB0aGlzLmJsb2NrX3NpemUgPSB0LnJlYWRVaW50OCgpOwogICAgICB2YXIgcyA9IHQucmVhZFVpbnQ4KCk7CiAgICAgIHRoaXMuY29tcG9uZW50X2xpdHRsZV9lbmRpYW4gPSBzID4+IDcgJiAxLCB0aGlzLmJsb2NrX3BhZF9sc2IgPSBzID4+IDYgJiAxLCB0aGlzLmJsb2NrX2xpdHRsZV9lbmRpYW4gPSBzID4+IDUgJiAxLCB0aGlzLmJsb2NrX3JldmVyc2VkID0gcyA+PiA0ICYgMSwgdGhpcy5wYWRfdW5rbm93biA9IHMgPj4gMyAmIDEsIHRoaXMucGl4ZWxfc2l6ZSA9IHQucmVhZFVpbnQ4KCksIHRoaXMucm93X2FsaWduX3NpemUgPSB0LnJlYWRVaW50MzIoKSwgdGhpcy50aWxlX2FsaWduX3NpemUgPSB0LnJlYWRVaW50MzIoKSwgdGhpcy5udW1fdGlsZV9jb2xzX21pbnVzX29uZSA9IHQucmVhZFVpbnQzMigpLCB0aGlzLm51bV90aWxlX3Jvd3NfbWludXNfb25lID0gdC5yZWFkVWludDMyKCk7CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3RvcigidXJsICIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5mbGFncyAhPT0gMSAmJiAodGhpcy5sb2NhdGlvbiA9IHQucmVhZENTdHJpbmcoKSk7CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3RvcigidXJuICIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5uYW1lID0gdC5yZWFkQ1N0cmluZygpLCB0aGlzLnNpemUgLSB0aGlzLmhkcl9zaXplIC0gdGhpcy5uYW1lLmxlbmd0aCAtIDEgPiAwICYmICh0aGlzLmxvY2F0aW9uID0gdC5yZWFkQ1N0cmluZygpKTsKICAgIH0pLCByLmNyZWF0ZVVVSURCb3goImE1ZDQwYjMwZTgxNDExZGRiYTJmMDgwMDIwMGM5YTY2IiwgdHJ1ZSwgZmFsc2UsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5MaXZlU2VydmVyTWFuaWZlc3QgPSB0LnJlYWRTdHJpbmcodGhpcy5zaXplIC0gdGhpcy5oZHJfc2l6ZSkucmVwbGFjZSgvJi9nLCAiJmFtcDsiKS5yZXBsYWNlKC88L2csICImbHQ7IikucmVwbGFjZSgvPi9nLCAiJmd0OyIpLnJlcGxhY2UoLyIvZywgIiZxdW90OyIpLnJlcGxhY2UoLycvZywgIiYjMDM5OyIpOwogICAgfSksIHIuY3JlYXRlVVVJREJveCgiZDA4YTRmMTgxMGYzNGE4MmI2YzgzMmQ4YWJhMTgzZDMiLCB0cnVlLCBmYWxzZSwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLnN5c3RlbV9pZCA9IHIucGFyc2VIZXgxNih0KTsKICAgICAgdmFyIGUgPSB0LnJlYWRVaW50MzIoKTsKICAgICAgZSA+IDAgJiYgKHRoaXMuZGF0YSA9IHQucmVhZFVpbnQ4QXJyYXkoZSkpOwogICAgfSksIHIuY3JlYXRlVVVJREJveCgKICAgICAgImEyMzk0ZjUyNWE5YjRmMTRhMjQ0NmM0MjdjNjQ4ZGY0IiwKICAgICAgdHJ1ZSwKICAgICAgZmFsc2UKICAgICAgLyosIGZ1bmN0aW9uKHN0cmVhbSkgewogICAgICAJaWYgKHRoaXMuZmxhZ3MgJiAweDEpIHsKICAgICAgCQl0aGlzLkFsZ29yaXRobUlEID0gc3RyZWFtLnJlYWRVaW50MjQoKTsKICAgICAgCQl0aGlzLklWX3NpemUgPSBzdHJlYW0ucmVhZFVpbnQ4KCk7CiAgICAgIAkJdGhpcy5LSUQgPSBCb3hQYXJzZXIucGFyc2VIZXgxNihzdHJlYW0pOwogICAgICAJfQogICAgICAJdmFyIHNhbXBsZV9jb3VudCA9IHN0cmVhbS5yZWFkVWludDMyKCk7CiAgICAgIAl0aGlzLnNhbXBsZXMgPSBbXTsKICAgICAgCWZvciAodmFyIGkgPSAwOyBpIDwgc2FtcGxlX2NvdW50OyBpKyspIHsKICAgICAgCQl2YXIgc2FtcGxlID0ge307CiAgICAgIAkJc2FtcGxlLkluaXRpYWxpemF0aW9uVmVjdG9yID0gdGhpcy5yZWFkVWludDhBcnJheSh0aGlzLklWX3NpemUqOCk7CiAgICAgIAkJaWYgKHRoaXMuZmxhZ3MgJiAweDIpIHsKICAgICAgCQkJc2FtcGxlLnN1YnNhbXBsZXMgPSBbXTsKICAgICAgCQkJc2FtcGxlLk51bWJlck9mRW50cmllcyA9IHN0cmVhbS5yZWFkVWludDE2KCk7CiAgICAgIAkJCWZvciAodmFyIGogPSAwOyBqIDwgc2FtcGxlLk51bWJlck9mRW50cmllczsgaisrKSB7CiAgICAgIAkJCQl2YXIgc3Vic2FtcGxlID0ge307CiAgICAgIAkJCQlzdWJzYW1wbGUuQnl0ZXNPZkNsZWFyRGF0YSA9IHN0cmVhbS5yZWFkVWludDE2KCk7CiAgICAgIAkJCQlzdWJzYW1wbGUuQnl0ZXNPZlByb3RlY3RlZERhdGEgPSBzdHJlYW0ucmVhZFVpbnQzMigpOwogICAgICAJCQkJc2FtcGxlLnN1YnNhbXBsZXMucHVzaChzdWJzYW1wbGUpOwogICAgICAJCQl9CiAgICAgIAkJfQogICAgICAJCXRoaXMuc2FtcGxlcy5wdXNoKHNhbXBsZSk7CiAgICAgIAl9CiAgICAgIH0qLwogICAgKSwgci5jcmVhdGVVVUlEQm94KCI4OTc0ZGJjZTdiZTc0YzUxODRmOTcxNDhmOTg4MjU1NCIsIHRydWUsIGZhbHNlLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuZGVmYXVsdF9BbGdvcml0aG1JRCA9IHQucmVhZFVpbnQyNCgpLCB0aGlzLmRlZmF1bHRfSVZfc2l6ZSA9IHQucmVhZFVpbnQ4KCksIHRoaXMuZGVmYXVsdF9LSUQgPSByLnBhcnNlSGV4MTYodCk7CiAgICB9KSwgci5jcmVhdGVVVUlEQm94KCJkNDgwN2VmMmNhMzk0Njk1OGU1NDI2Y2I5ZTQ2YTc5ZiIsIHRydWUsIGZhbHNlLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuZnJhZ21lbnRfY291bnQgPSB0LnJlYWRVaW50OCgpLCB0aGlzLmVudHJpZXMgPSBbXTsKICAgICAgZm9yICh2YXIgZSA9IDA7IGUgPCB0aGlzLmZyYWdtZW50X2NvdW50OyBlKyspIHsKICAgICAgICB2YXIgcyA9IHt9LCBoID0gMCwgbCA9IDA7CiAgICAgICAgdGhpcy52ZXJzaW9uID09PSAxID8gKGggPSB0LnJlYWRVaW50NjQoKSwgbCA9IHQucmVhZFVpbnQ2NCgpKSA6IChoID0gdC5yZWFkVWludDMyKCksIGwgPSB0LnJlYWRVaW50MzIoKSksIHMuYWJzb2x1dGVfdGltZSA9IGgsIHMuYWJzb2x1dGVfZHVyYXRpb24gPSBsLCB0aGlzLmVudHJpZXMucHVzaChzKTsKICAgICAgfQogICAgfSksIHIuY3JlYXRlVVVJREJveCgiNmQxZDliMDU0MmQ1NDRlNjgwZTIxNDFkYWZmNzU3YjIiLCB0cnVlLCBmYWxzZSwgZnVuY3Rpb24odCkgewogICAgICB0aGlzLnZlcnNpb24gPT09IDEgPyAodGhpcy5hYnNvbHV0ZV90aW1lID0gdC5yZWFkVWludDY0KCksIHRoaXMuZHVyYXRpb24gPSB0LnJlYWRVaW50NjQoKSkgOiAodGhpcy5hYnNvbHV0ZV90aW1lID0gdC5yZWFkVWludDMyKCksIHRoaXMuZHVyYXRpb24gPSB0LnJlYWRVaW50MzIoKSk7CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3Rvcigidm1oZCIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5ncmFwaGljc21vZGUgPSB0LnJlYWRVaW50MTYoKSwgdGhpcy5vcGNvbG9yID0gdC5yZWFkVWludDE2QXJyYXkoMyk7CiAgICB9KSwgci5jcmVhdGVGdWxsQm94Q3RvcigidnBjQyIsIGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGU7CiAgICAgIHRoaXMudmVyc2lvbiA9PT0gMSA/ICh0aGlzLnByb2ZpbGUgPSB0LnJlYWRVaW50OCgpLCB0aGlzLmxldmVsID0gdC5yZWFkVWludDgoKSwgZSA9IHQucmVhZFVpbnQ4KCksIHRoaXMuYml0RGVwdGggPSBlID4+IDQsIHRoaXMuY2hyb21hU3Vic2FtcGxpbmcgPSBlID4+IDEgJiA3LCB0aGlzLnZpZGVvRnVsbFJhbmdlRmxhZyA9IGUgJiAxLCB0aGlzLmNvbG91clByaW1hcmllcyA9IHQucmVhZFVpbnQ4KCksIHRoaXMudHJhbnNmZXJDaGFyYWN0ZXJpc3RpY3MgPSB0LnJlYWRVaW50OCgpLCB0aGlzLm1hdHJpeENvZWZmaWNpZW50cyA9IHQucmVhZFVpbnQ4KCksIHRoaXMuY29kZWNJbnRpYWxpemF0aW9uRGF0YVNpemUgPSB0LnJlYWRVaW50MTYoKSwgdGhpcy5jb2RlY0ludGlhbGl6YXRpb25EYXRhID0gdC5yZWFkVWludDhBcnJheSh0aGlzLmNvZGVjSW50aWFsaXphdGlvbkRhdGFTaXplKSkgOiAodGhpcy5wcm9maWxlID0gdC5yZWFkVWludDgoKSwgdGhpcy5sZXZlbCA9IHQucmVhZFVpbnQ4KCksIGUgPSB0LnJlYWRVaW50OCgpLCB0aGlzLmJpdERlcHRoID0gZSA+PiA0ICYgMTUsIHRoaXMuY29sb3JTcGFjZSA9IGUgJiAxNSwgZSA9IHQucmVhZFVpbnQ4KCksIHRoaXMuY2hyb21hU3Vic2FtcGxpbmcgPSBlID4+IDQgJiAxNSwgdGhpcy50cmFuc2ZlckZ1bmN0aW9uID0gZSA+PiAxICYgNywgdGhpcy52aWRlb0Z1bGxSYW5nZUZsYWcgPSBlICYgMSwgdGhpcy5jb2RlY0ludGlhbGl6YXRpb25EYXRhU2l6ZSA9IHQucmVhZFVpbnQxNigpLCB0aGlzLmNvZGVjSW50aWFsaXphdGlvbkRhdGEgPSB0LnJlYWRVaW50OEFycmF5KHRoaXMuY29kZWNJbnRpYWxpemF0aW9uRGF0YVNpemUpKTsKICAgIH0pLCByLmNyZWF0ZUJveEN0b3IoInZ0dEMiLCBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMudGV4dCA9IHQucmVhZFN0cmluZyh0aGlzLnNpemUgLSB0aGlzLmhkcl9zaXplKTsKICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJ2dmNDIiwgZnVuY3Rpb24odCkgewogICAgICB2YXIgZSwgcywgaCA9IHsKICAgICAgICBoZWxkX2JpdHM6IHZvaWQgMCwKICAgICAgICBudW1faGVsZF9iaXRzOiAwLAogICAgICAgIHN0cmVhbV9yZWFkXzFfYnl0ZXM6IGZ1bmN0aW9uKFQpIHsKICAgICAgICAgIHRoaXMuaGVsZF9iaXRzID0gVC5yZWFkVWludDgoKSwgdGhpcy5udW1faGVsZF9iaXRzID0gODsKICAgICAgICB9LAogICAgICAgIHN0cmVhbV9yZWFkXzJfYnl0ZXM6IGZ1bmN0aW9uKFQpIHsKICAgICAgICAgIHRoaXMuaGVsZF9iaXRzID0gVC5yZWFkVWludDE2KCksIHRoaXMubnVtX2hlbGRfYml0cyA9IDE2OwogICAgICAgIH0sCiAgICAgICAgZXh0cmFjdF9iaXRzOiBmdW5jdGlvbihUKSB7CiAgICAgICAgICB2YXIgTCA9IHRoaXMuaGVsZF9iaXRzID4+IHRoaXMubnVtX2hlbGRfYml0cyAtIFQgJiAoMSA8PCBUKSAtIDE7CiAgICAgICAgICByZXR1cm4gdGhpcy5udW1faGVsZF9iaXRzIC09IFQsIEw7CiAgICAgICAgfQogICAgICB9OwogICAgICBpZiAoaC5zdHJlYW1fcmVhZF8xX2J5dGVzKHQpLCBoLmV4dHJhY3RfYml0cyg1KSwgdGhpcy5sZW5ndGhTaXplTWludXNPbmUgPSBoLmV4dHJhY3RfYml0cygyKSwgdGhpcy5wdGxfcHJlc2VudF9mbGFnID0gaC5leHRyYWN0X2JpdHMoMSksIHRoaXMucHRsX3ByZXNlbnRfZmxhZykgewogICAgICAgIGguc3RyZWFtX3JlYWRfMl9ieXRlcyh0KSwgdGhpcy5vbHNfaWR4ID0gaC5leHRyYWN0X2JpdHMoOSksIHRoaXMubnVtX3N1YmxheWVycyA9IGguZXh0cmFjdF9iaXRzKDMpLCB0aGlzLmNvbnN0YW50X2ZyYW1lX3JhdGUgPSBoLmV4dHJhY3RfYml0cygyKSwgdGhpcy5jaHJvbWFfZm9ybWF0X2lkYyA9IGguZXh0cmFjdF9iaXRzKDIpLCBoLnN0cmVhbV9yZWFkXzFfYnl0ZXModCksIHRoaXMuYml0X2RlcHRoX21pbnVzOCA9IGguZXh0cmFjdF9iaXRzKDMpLCBoLmV4dHJhY3RfYml0cyg1KTsKICAgICAgICB7CiAgICAgICAgICBpZiAoaC5zdHJlYW1fcmVhZF8yX2J5dGVzKHQpLCBoLmV4dHJhY3RfYml0cygyKSwgdGhpcy5udW1fYnl0ZXNfY29uc3RyYWludF9pbmZvID0gaC5leHRyYWN0X2JpdHMoNiksIHRoaXMuZ2VuZXJhbF9wcm9maWxlX2lkYyA9IGguZXh0cmFjdF9iaXRzKDcpLCB0aGlzLmdlbmVyYWxfdGllcl9mbGFnID0gaC5leHRyYWN0X2JpdHMoMSksIHRoaXMuZ2VuZXJhbF9sZXZlbF9pZGMgPSB0LnJlYWRVaW50OCgpLCBoLnN0cmVhbV9yZWFkXzFfYnl0ZXModCksIHRoaXMucHRsX2ZyYW1lX29ubHlfY29uc3RyYWludF9mbGFnID0gaC5leHRyYWN0X2JpdHMoMSksIHRoaXMucHRsX211bHRpbGF5ZXJfZW5hYmxlZF9mbGFnID0gaC5leHRyYWN0X2JpdHMoMSksIHRoaXMuZ2VuZXJhbF9jb25zdHJhaW50X2luZm8gPSBuZXcgVWludDhBcnJheSh0aGlzLm51bV9ieXRlc19jb25zdHJhaW50X2luZm8pLCB0aGlzLm51bV9ieXRlc19jb25zdHJhaW50X2luZm8pIHsKICAgICAgICAgICAgZm9yIChlID0gMDsgZSA8IHRoaXMubnVtX2J5dGVzX2NvbnN0cmFpbnRfaW5mbyAtIDE7IGUrKykgewogICAgICAgICAgICAgIHZhciBsID0gaC5leHRyYWN0X2JpdHMoNik7CiAgICAgICAgICAgICAgaC5zdHJlYW1fcmVhZF8xX2J5dGVzKHQpOwogICAgICAgICAgICAgIHZhciBwID0gaC5leHRyYWN0X2JpdHMoMik7CiAgICAgICAgICAgICAgdGhpcy5nZW5lcmFsX2NvbnN0cmFpbnRfaW5mb1tlXSA9IGwgPDwgMiB8IHA7CiAgICAgICAgICAgIH0KICAgICAgICAgICAgdGhpcy5nZW5lcmFsX2NvbnN0cmFpbnRfaW5mb1t0aGlzLm51bV9ieXRlc19jb25zdHJhaW50X2luZm8gLSAxXSA9IGguZXh0cmFjdF9iaXRzKDYpOwogICAgICAgICAgfSBlbHNlCiAgICAgICAgICAgIGguZXh0cmFjdF9iaXRzKDYpOwogICAgICAgICAgaWYgKHRoaXMubnVtX3N1YmxheWVycyA+IDEpIHsKICAgICAgICAgICAgZm9yIChoLnN0cmVhbV9yZWFkXzFfYnl0ZXModCksIHRoaXMucHRsX3N1YmxheWVyX3ByZXNlbnRfbWFzayA9IDAsIHMgPSB0aGlzLm51bV9zdWJsYXllcnMgLSAyOyBzID49IDA7IC0tcykgewogICAgICAgICAgICAgIHZhciBfID0gaC5leHRyYWN0X2JpdHMoMSk7CiAgICAgICAgICAgICAgdGhpcy5wdGxfc3VibGF5ZXJfcHJlc2VudF9tYXNrIHw9IF8gPDwgczsKICAgICAgICAgICAgfQogICAgICAgICAgICBmb3IgKHMgPSB0aGlzLm51bV9zdWJsYXllcnM7IHMgPD0gOCAmJiB0aGlzLm51bV9zdWJsYXllcnMgPiAxOyArK3MpCiAgICAgICAgICAgICAgaC5leHRyYWN0X2JpdHMoMSk7CiAgICAgICAgICAgIGZvciAodGhpcy5zdWJsYXllcl9sZXZlbF9pZGMgPSBbXSwgcyA9IHRoaXMubnVtX3N1YmxheWVycyAtIDI7IHMgPj0gMDsgLS1zKQogICAgICAgICAgICAgIHRoaXMucHRsX3N1YmxheWVyX3ByZXNlbnRfbWFzayAmIDEgPDwgcyAmJiAodGhpcy5zdWJsYXllcl9sZXZlbF9pZGNbc10gPSB0LnJlYWRVaW50OCgpKTsKICAgICAgICAgIH0KICAgICAgICAgIGlmICh0aGlzLnB0bF9udW1fc3ViX3Byb2ZpbGVzID0gdC5yZWFkVWludDgoKSwgdGhpcy5nZW5lcmFsX3N1Yl9wcm9maWxlX2lkYyA9IFtdLCB0aGlzLnB0bF9udW1fc3ViX3Byb2ZpbGVzKQogICAgICAgICAgICBmb3IgKGUgPSAwOyBlIDwgdGhpcy5wdGxfbnVtX3N1Yl9wcm9maWxlczsgZSsrKQogICAgICAgICAgICAgIHRoaXMuZ2VuZXJhbF9zdWJfcHJvZmlsZV9pZGMucHVzaCh0LnJlYWRVaW50MzIoKSk7CiAgICAgICAgfQogICAgICAgIHRoaXMubWF4X3BpY3R1cmVfd2lkdGggPSB0LnJlYWRVaW50MTYoKSwgdGhpcy5tYXhfcGljdHVyZV9oZWlnaHQgPSB0LnJlYWRVaW50MTYoKSwgdGhpcy5hdmdfZnJhbWVfcmF0ZSA9IHQucmVhZFVpbnQxNigpOwogICAgICB9CiAgICAgIHZhciBtID0gMTIsIHcgPSAxMzsKICAgICAgdGhpcy5uYWx1X2FycmF5cyA9IFtdOwogICAgICB2YXIgUyA9IHQucmVhZFVpbnQ4KCk7CiAgICAgIGZvciAoZSA9IDA7IGUgPCBTOyBlKyspIHsKICAgICAgICB2YXIgRSA9IFtdOwogICAgICAgIHRoaXMubmFsdV9hcnJheXMucHVzaChFKSwgaC5zdHJlYW1fcmVhZF8xX2J5dGVzKHQpLCBFLmNvbXBsZXRlbmVzcyA9IGguZXh0cmFjdF9iaXRzKDEpLCBoLmV4dHJhY3RfYml0cygyKSwgRS5uYWx1X3R5cGUgPSBoLmV4dHJhY3RfYml0cyg1KTsKICAgICAgICB2YXIgSSA9IDE7CiAgICAgICAgZm9yIChFLm5hbHVfdHlwZSAhPSB3ICYmIEUubmFsdV90eXBlICE9IG0gJiYgKEkgPSB0LnJlYWRVaW50MTYoKSksIHMgPSAwOyBzIDwgSTsgcysrKSB7CiAgICAgICAgICB2YXIgUCA9IHQucmVhZFVpbnQxNigpOwogICAgICAgICAgRS5wdXNoKHsKICAgICAgICAgICAgZGF0YTogdC5yZWFkVWludDhBcnJheShQKSwKICAgICAgICAgICAgbGVuZ3RoOiBQCiAgICAgICAgICB9KTsKICAgICAgICB9CiAgICAgIH0KICAgIH0pLCByLmNyZWF0ZUZ1bGxCb3hDdG9yKCJ2dm5DIiwgZnVuY3Rpb24odCkgewogICAgICB2YXIgZSA9IHN0cm0ucmVhZFVpbnQ4KCk7CiAgICAgIHRoaXMubGVuZ3RoU2l6ZU1pbnVzT25lID0gZSAmIDM7CiAgICB9KSwgci5TYW1wbGVFbnRyeS5wcm90b3R5cGUuaXNWaWRlbyA9IGZ1bmN0aW9uKCkgewogICAgICByZXR1cm4gZmFsc2U7CiAgICB9LCByLlNhbXBsZUVudHJ5LnByb3RvdHlwZS5pc0F1ZGlvID0gZnVuY3Rpb24oKSB7CiAgICAgIHJldHVybiBmYWxzZTsKICAgIH0sIHIuU2FtcGxlRW50cnkucHJvdG90eXBlLmlzU3VidGl0bGUgPSBmdW5jdGlvbigpIHsKICAgICAgcmV0dXJuIGZhbHNlOwogICAgfSwgci5TYW1wbGVFbnRyeS5wcm90b3R5cGUuaXNNZXRhZGF0YSA9IGZ1bmN0aW9uKCkgewogICAgICByZXR1cm4gZmFsc2U7CiAgICB9LCByLlNhbXBsZUVudHJ5LnByb3RvdHlwZS5pc0hpbnQgPSBmdW5jdGlvbigpIHsKICAgICAgcmV0dXJuIGZhbHNlOwogICAgfSwgci5TYW1wbGVFbnRyeS5wcm90b3R5cGUuZ2V0Q29kZWMgPSBmdW5jdGlvbigpIHsKICAgICAgcmV0dXJuIHRoaXMudHlwZS5yZXBsYWNlKCIuIiwgIiIpOwogICAgfSwgci5TYW1wbGVFbnRyeS5wcm90b3R5cGUuZ2V0V2lkdGggPSBmdW5jdGlvbigpIHsKICAgICAgcmV0dXJuICIiOwogICAgfSwgci5TYW1wbGVFbnRyeS5wcm90b3R5cGUuZ2V0SGVpZ2h0ID0gZnVuY3Rpb24oKSB7CiAgICAgIHJldHVybiAiIjsKICAgIH0sIHIuU2FtcGxlRW50cnkucHJvdG90eXBlLmdldENoYW5uZWxDb3VudCA9IGZ1bmN0aW9uKCkgewogICAgICByZXR1cm4gIiI7CiAgICB9LCByLlNhbXBsZUVudHJ5LnByb3RvdHlwZS5nZXRTYW1wbGVSYXRlID0gZnVuY3Rpb24oKSB7CiAgICAgIHJldHVybiAiIjsKICAgIH0sIHIuU2FtcGxlRW50cnkucHJvdG90eXBlLmdldFNhbXBsZVNpemUgPSBmdW5jdGlvbigpIHsKICAgICAgcmV0dXJuICIiOwogICAgfSwgci5WaXN1YWxTYW1wbGVFbnRyeS5wcm90b3R5cGUuaXNWaWRlbyA9IGZ1bmN0aW9uKCkgewogICAgICByZXR1cm4gdHJ1ZTsKICAgIH0sIHIuVmlzdWFsU2FtcGxlRW50cnkucHJvdG90eXBlLmdldFdpZHRoID0gZnVuY3Rpb24oKSB7CiAgICAgIHJldHVybiB0aGlzLndpZHRoOwogICAgfSwgci5WaXN1YWxTYW1wbGVFbnRyeS5wcm90b3R5cGUuZ2V0SGVpZ2h0ID0gZnVuY3Rpb24oKSB7CiAgICAgIHJldHVybiB0aGlzLmhlaWdodDsKICAgIH0sIHIuQXVkaW9TYW1wbGVFbnRyeS5wcm90b3R5cGUuaXNBdWRpbyA9IGZ1bmN0aW9uKCkgewogICAgICByZXR1cm4gdHJ1ZTsKICAgIH0sIHIuQXVkaW9TYW1wbGVFbnRyeS5wcm90b3R5cGUuZ2V0Q2hhbm5lbENvdW50ID0gZnVuY3Rpb24oKSB7CiAgICAgIHJldHVybiB0aGlzLmNoYW5uZWxfY291bnQ7CiAgICB9LCByLkF1ZGlvU2FtcGxlRW50cnkucHJvdG90eXBlLmdldFNhbXBsZVJhdGUgPSBmdW5jdGlvbigpIHsKICAgICAgcmV0dXJuIHRoaXMuc2FtcGxlcmF0ZTsKICAgIH0sIHIuQXVkaW9TYW1wbGVFbnRyeS5wcm90b3R5cGUuZ2V0U2FtcGxlU2l6ZSA9IGZ1bmN0aW9uKCkgewogICAgICByZXR1cm4gdGhpcy5zYW1wbGVzaXplOwogICAgfSwgci5TdWJ0aXRsZVNhbXBsZUVudHJ5LnByb3RvdHlwZS5pc1N1YnRpdGxlID0gZnVuY3Rpb24oKSB7CiAgICAgIHJldHVybiB0cnVlOwogICAgfSwgci5NZXRhZGF0YVNhbXBsZUVudHJ5LnByb3RvdHlwZS5pc01ldGFkYXRhID0gZnVuY3Rpb24oKSB7CiAgICAgIHJldHVybiB0cnVlOwogICAgfSwgci5kZWNpbWFsVG9IZXggPSBmdW5jdGlvbih0LCBlKSB7CiAgICAgIHZhciBzID0gTnVtYmVyKHQpLnRvU3RyaW5nKDE2KTsKICAgICAgZm9yIChlID0gdHlwZW9mIGUgPiAidSIgfHwgZSA9PT0gbnVsbCA/IGUgPSAyIDogZTsgcy5sZW5ndGggPCBlOyApCiAgICAgICAgcyA9ICIwIiArIHM7CiAgICAgIHJldHVybiBzOwogICAgfSwgci5hdmMxU2FtcGxlRW50cnkucHJvdG90eXBlLmdldENvZGVjID0gci5hdmMyU2FtcGxlRW50cnkucHJvdG90eXBlLmdldENvZGVjID0gci5hdmMzU2FtcGxlRW50cnkucHJvdG90eXBlLmdldENvZGVjID0gci5hdmM0U2FtcGxlRW50cnkucHJvdG90eXBlLmdldENvZGVjID0gZnVuY3Rpb24oKSB7CiAgICAgIHZhciB0ID0gci5TYW1wbGVFbnRyeS5wcm90b3R5cGUuZ2V0Q29kZWMuY2FsbCh0aGlzKTsKICAgICAgcmV0dXJuIHRoaXMuYXZjQyA/IHQgKyAiLiIgKyByLmRlY2ltYWxUb0hleCh0aGlzLmF2Y0MuQVZDUHJvZmlsZUluZGljYXRpb24pICsgci5kZWNpbWFsVG9IZXgodGhpcy5hdmNDLnByb2ZpbGVfY29tcGF0aWJpbGl0eSkgKyByLmRlY2ltYWxUb0hleCh0aGlzLmF2Y0MuQVZDTGV2ZWxJbmRpY2F0aW9uKSA6IHQ7CiAgICB9LCByLmhldjFTYW1wbGVFbnRyeS5wcm90b3R5cGUuZ2V0Q29kZWMgPSByLmh2YzFTYW1wbGVFbnRyeS5wcm90b3R5cGUuZ2V0Q29kZWMgPSBmdW5jdGlvbigpIHsKICAgICAgdmFyIHQsIGUgPSByLlNhbXBsZUVudHJ5LnByb3RvdHlwZS5nZXRDb2RlYy5jYWxsKHRoaXMpOwogICAgICBpZiAodGhpcy5odmNDKSB7CiAgICAgICAgc3dpdGNoIChlICs9ICIuIiwgdGhpcy5odmNDLmdlbmVyYWxfcHJvZmlsZV9zcGFjZSkgewogICAgICAgICAgY2FzZSAwOgogICAgICAgICAgICBlICs9ICIiOwogICAgICAgICAgICBicmVhazsKICAgICAgICAgIGNhc2UgMToKICAgICAgICAgICAgZSArPSAiQSI7CiAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgY2FzZSAyOgogICAgICAgICAgICBlICs9ICJCIjsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICBjYXNlIDM6CiAgICAgICAgICAgIGUgKz0gIkMiOwogICAgICAgICAgICBicmVhazsKICAgICAgICB9CiAgICAgICAgZSArPSB0aGlzLmh2Y0MuZ2VuZXJhbF9wcm9maWxlX2lkYywgZSArPSAiLiI7CiAgICAgICAgdmFyIHMgPSB0aGlzLmh2Y0MuZ2VuZXJhbF9wcm9maWxlX2NvbXBhdGliaWxpdHksIGggPSAwOwogICAgICAgIGZvciAodCA9IDA7IHQgPCAzMiAmJiAoaCB8PSBzICYgMSwgdCAhPSAzMSk7IHQrKykKICAgICAgICAgIGggPDw9IDEsIHMgPj49IDE7CiAgICAgICAgZSArPSByLmRlY2ltYWxUb0hleChoLCAwKSwgZSArPSAiLiIsIHRoaXMuaHZjQy5nZW5lcmFsX3RpZXJfZmxhZyA9PT0gMCA/IGUgKz0gIkwiIDogZSArPSAiSCIsIGUgKz0gdGhpcy5odmNDLmdlbmVyYWxfbGV2ZWxfaWRjOwogICAgICAgIHZhciBsID0gZmFsc2UsIHAgPSAiIjsKICAgICAgICBmb3IgKHQgPSA1OyB0ID49IDA7IHQtLSkKICAgICAgICAgICh0aGlzLmh2Y0MuZ2VuZXJhbF9jb25zdHJhaW50X2luZGljYXRvclt0XSB8fCBsKSAmJiAocCA9ICIuIiArIHIuZGVjaW1hbFRvSGV4KHRoaXMuaHZjQy5nZW5lcmFsX2NvbnN0cmFpbnRfaW5kaWNhdG9yW3RdLCAwKSArIHAsIGwgPSB0cnVlKTsKICAgICAgICBlICs9IHA7CiAgICAgIH0KICAgICAgcmV0dXJuIGU7CiAgICB9LCByLnZ2YzFTYW1wbGVFbnRyeS5wcm90b3R5cGUuZ2V0Q29kZWMgPSByLnZ2aTFTYW1wbGVFbnRyeS5wcm90b3R5cGUuZ2V0Q29kZWMgPSBmdW5jdGlvbigpIHsKICAgICAgdmFyIHQsIGUgPSByLlNhbXBsZUVudHJ5LnByb3RvdHlwZS5nZXRDb2RlYy5jYWxsKHRoaXMpOwogICAgICBpZiAodGhpcy52dmNDKSB7CiAgICAgICAgZSArPSAiLiIgKyB0aGlzLnZ2Y0MuZ2VuZXJhbF9wcm9maWxlX2lkYywgdGhpcy52dmNDLmdlbmVyYWxfdGllcl9mbGFnID8gZSArPSAiLkgiIDogZSArPSAiLkwiLCBlICs9IHRoaXMudnZjQy5nZW5lcmFsX2xldmVsX2lkYzsKICAgICAgICB2YXIgcyA9ICIiOwogICAgICAgIGlmICh0aGlzLnZ2Y0MuZ2VuZXJhbF9jb25zdHJhaW50X2luZm8pIHsKICAgICAgICAgIHZhciBoID0gW10sIGwgPSAwOwogICAgICAgICAgbCB8PSB0aGlzLnZ2Y0MucHRsX2ZyYW1lX29ubHlfY29uc3RyYWludCA8PCA3LCBsIHw9IHRoaXMudnZjQy5wdGxfbXVsdGlsYXllcl9lbmFibGVkIDw8IDY7CiAgICAgICAgICB2YXIgcDsKICAgICAgICAgIGZvciAodCA9IDA7IHQgPCB0aGlzLnZ2Y0MuZ2VuZXJhbF9jb25zdHJhaW50X2luZm8ubGVuZ3RoOyArK3QpCiAgICAgICAgICAgIGwgfD0gdGhpcy52dmNDLmdlbmVyYWxfY29uc3RyYWludF9pbmZvW3RdID4+IDIgJiA2MywgaC5wdXNoKGwpLCBsICYmIChwID0gdCksIGwgPSB0aGlzLnZ2Y0MuZ2VuZXJhbF9jb25zdHJhaW50X2luZm9bdF0gPj4gMiAmIDM7CiAgICAgICAgICBpZiAocCA9PT0gdm9pZCAwKQogICAgICAgICAgICBzID0gIi5DQSI7CiAgICAgICAgICBlbHNlIHsKICAgICAgICAgICAgcyA9ICIuQyI7CiAgICAgICAgICAgIHZhciBfID0gIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaMjM0NTY3IiwgbSA9IDAsIHcgPSAwOwogICAgICAgICAgICBmb3IgKHQgPSAwOyB0IDw9IHA7ICsrdCkKICAgICAgICAgICAgICBmb3IgKG0gPSBtIDw8IDggfCBoW3RdLCB3ICs9IDg7IHcgPj0gNTsgKSB7CiAgICAgICAgICAgICAgICB2YXIgUyA9IG0gPj4gdyAtIDUgJiAzMTsKICAgICAgICAgICAgICAgIHMgKz0gX1tTXSwgdyAtPSA1LCBtICY9ICgxIDw8IHcpIC0gMTsKICAgICAgICAgICAgICB9CiAgICAgICAgICAgIHcgJiYgKG0gPDw9IDUgLSB3LCBzICs9IF9bbSAmIDMxXSk7CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICAgIGUgKz0gczsKICAgICAgfQogICAgICByZXR1cm4gZTsKICAgIH0sIHIubXA0YVNhbXBsZUVudHJ5LnByb3RvdHlwZS5nZXRDb2RlYyA9IGZ1bmN0aW9uKCkgewogICAgICB2YXIgdCA9IHIuU2FtcGxlRW50cnkucHJvdG90eXBlLmdldENvZGVjLmNhbGwodGhpcyk7CiAgICAgIGlmICh0aGlzLmVzZHMgJiYgdGhpcy5lc2RzLmVzZCkgewogICAgICAgIHZhciBlID0gdGhpcy5lc2RzLmVzZC5nZXRPVEkoKSwgcyA9IHRoaXMuZXNkcy5lc2QuZ2V0QXVkaW9Db25maWcoKTsKICAgICAgICByZXR1cm4gdCArICIuIiArIHIuZGVjaW1hbFRvSGV4KGUpICsgKHMgPyAiLiIgKyBzIDogIiIpOwogICAgICB9IGVsc2UKICAgICAgICByZXR1cm4gdDsKICAgIH0sIHIuc3R4dFNhbXBsZUVudHJ5LnByb3RvdHlwZS5nZXRDb2RlYyA9IGZ1bmN0aW9uKCkgewogICAgICB2YXIgdCA9IHIuU2FtcGxlRW50cnkucHJvdG90eXBlLmdldENvZGVjLmNhbGwodGhpcyk7CiAgICAgIHJldHVybiB0aGlzLm1pbWVfZm9ybWF0ID8gdCArICIuIiArIHRoaXMubWltZV9mb3JtYXQgOiB0OwogICAgfSwgci52cDA4U2FtcGxlRW50cnkucHJvdG90eXBlLmdldENvZGVjID0gci52cDA5U2FtcGxlRW50cnkucHJvdG90eXBlLmdldENvZGVjID0gZnVuY3Rpb24oKSB7CiAgICAgIHZhciB0ID0gci5TYW1wbGVFbnRyeS5wcm90b3R5cGUuZ2V0Q29kZWMuY2FsbCh0aGlzKSwgZSA9IHRoaXMudnBjQy5sZXZlbDsKICAgICAgZSA9PSAwICYmIChlID0gIjAwIik7CiAgICAgIHZhciBzID0gdGhpcy52cGNDLmJpdERlcHRoOwogICAgICByZXR1cm4gcyA9PSA4ICYmIChzID0gIjA4IiksIHQgKyAiLjAiICsgdGhpcy52cGNDLnByb2ZpbGUgKyAiLiIgKyBlICsgIi4iICsgczsKICAgIH0sIHIuYXYwMVNhbXBsZUVudHJ5LnByb3RvdHlwZS5nZXRDb2RlYyA9IGZ1bmN0aW9uKCkgewogICAgICB2YXIgdCA9IHIuU2FtcGxlRW50cnkucHJvdG90eXBlLmdldENvZGVjLmNhbGwodGhpcyksIGUgPSB0aGlzLmF2MUMuc2VxX2xldmVsX2lkeF8wOwogICAgICBlIDwgMTAgJiYgKGUgPSAiMCIgKyBlKTsKICAgICAgdmFyIHM7CiAgICAgIHJldHVybiB0aGlzLmF2MUMuc2VxX3Byb2ZpbGUgPT09IDIgJiYgdGhpcy5hdjFDLmhpZ2hfYml0ZGVwdGggPT09IDEgPyBzID0gdGhpcy5hdjFDLnR3ZWx2ZV9iaXQgPT09IDEgPyAiMTIiIDogIjEwIiA6IHRoaXMuYXYxQy5zZXFfcHJvZmlsZSA8PSAyICYmIChzID0gdGhpcy5hdjFDLmhpZ2hfYml0ZGVwdGggPT09IDEgPyAiMTAiIDogIjA4IiksIHQgKyAiLiIgKyB0aGlzLmF2MUMuc2VxX3Byb2ZpbGUgKyAiLiIgKyBlICsgKHRoaXMuYXYxQy5zZXFfdGllcl8wID8gIkgiIDogIk0iKSArICIuIiArIHM7CiAgICB9LCByLkJveC5wcm90b3R5cGUud3JpdGVIZWFkZXIgPSBmdW5jdGlvbih0LCBlKSB7CiAgICAgIHRoaXMuc2l6ZSArPSA4LCB0aGlzLnNpemUgPiB1ICYmICh0aGlzLnNpemUgKz0gOCksIHRoaXMudHlwZSA9PT0gInV1aWQiICYmICh0aGlzLnNpemUgKz0gMTYpLCBhLmRlYnVnKCJCb3hXcml0ZXIiLCAiV3JpdGluZyBib3ggIiArIHRoaXMudHlwZSArICIgb2Ygc2l6ZTogIiArIHRoaXMuc2l6ZSArICIgYXQgcG9zaXRpb24gIiArIHQuZ2V0UG9zaXRpb24oKSArIChlIHx8ICIiKSksIHRoaXMuc2l6ZSA+IHUgPyB0LndyaXRlVWludDMyKDEpIDogKHRoaXMuc2l6ZVBvc2l0aW9uID0gdC5nZXRQb3NpdGlvbigpLCB0LndyaXRlVWludDMyKHRoaXMuc2l6ZSkpLCB0LndyaXRlU3RyaW5nKHRoaXMudHlwZSwgbnVsbCwgNCksIHRoaXMudHlwZSA9PT0gInV1aWQiICYmIHQud3JpdGVVaW50OEFycmF5KHRoaXMudXVpZCksIHRoaXMuc2l6ZSA+IHUgJiYgdC53cml0ZVVpbnQ2NCh0aGlzLnNpemUpOwogICAgfSwgci5GdWxsQm94LnByb3RvdHlwZS53cml0ZUhlYWRlciA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5zaXplICs9IDQsIHIuQm94LnByb3RvdHlwZS53cml0ZUhlYWRlci5jYWxsKHRoaXMsIHQsICIgdj0iICsgdGhpcy52ZXJzaW9uICsgIiBmPSIgKyB0aGlzLmZsYWdzKSwgdC53cml0ZVVpbnQ4KHRoaXMudmVyc2lvbiksIHQud3JpdGVVaW50MjQodGhpcy5mbGFncyk7CiAgICB9LCByLkJveC5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMudHlwZSA9PT0gIm1kYXQiID8gdGhpcy5kYXRhICYmICh0aGlzLnNpemUgPSB0aGlzLmRhdGEubGVuZ3RoLCB0aGlzLndyaXRlSGVhZGVyKHQpLCB0LndyaXRlVWludDhBcnJheSh0aGlzLmRhdGEpKSA6ICh0aGlzLnNpemUgPSB0aGlzLmRhdGEgPyB0aGlzLmRhdGEubGVuZ3RoIDogMCwgdGhpcy53cml0ZUhlYWRlcih0KSwgdGhpcy5kYXRhICYmIHQud3JpdGVVaW50OEFycmF5KHRoaXMuZGF0YSkpOwogICAgfSwgci5Db250YWluZXJCb3gucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24odCkgewogICAgICB0aGlzLnNpemUgPSAwLCB0aGlzLndyaXRlSGVhZGVyKHQpOwogICAgICBmb3IgKHZhciBlID0gMDsgZSA8IHRoaXMuYm94ZXMubGVuZ3RoOyBlKyspCiAgICAgICAgdGhpcy5ib3hlc1tlXSAmJiAodGhpcy5ib3hlc1tlXS53cml0ZSh0KSwgdGhpcy5zaXplICs9IHRoaXMuYm94ZXNbZV0uc2l6ZSk7CiAgICAgIGEuZGVidWcoIkJveFdyaXRlciIsICJBZGp1c3RpbmcgYm94ICIgKyB0aGlzLnR5cGUgKyAiIHdpdGggbmV3IHNpemUgIiArIHRoaXMuc2l6ZSksIHQuYWRqdXN0VWludDMyKHRoaXMuc2l6ZVBvc2l0aW9uLCB0aGlzLnNpemUpOwogICAgfSwgci5UcmFja1JlZmVyZW5jZVR5cGVCb3gucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24odCkgewogICAgICB0aGlzLnNpemUgPSB0aGlzLnRyYWNrX2lkcy5sZW5ndGggKiA0LCB0aGlzLndyaXRlSGVhZGVyKHQpLCB0LndyaXRlVWludDMyQXJyYXkodGhpcy50cmFja19pZHMpOwogICAgfSwgci5hdmNDQm94LnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGU7CiAgICAgIGZvciAodGhpcy5zaXplID0gNywgZSA9IDA7IGUgPCB0aGlzLlNQUy5sZW5ndGg7IGUrKykKICAgICAgICB0aGlzLnNpemUgKz0gMiArIHRoaXMuU1BTW2VdLmxlbmd0aDsKICAgICAgZm9yIChlID0gMDsgZSA8IHRoaXMuUFBTLmxlbmd0aDsgZSsrKQogICAgICAgIHRoaXMuc2l6ZSArPSAyICsgdGhpcy5QUFNbZV0ubGVuZ3RoOwogICAgICBmb3IgKHRoaXMuZXh0ICYmICh0aGlzLnNpemUgKz0gdGhpcy5leHQubGVuZ3RoKSwgdGhpcy53cml0ZUhlYWRlcih0KSwgdC53cml0ZVVpbnQ4KHRoaXMuY29uZmlndXJhdGlvblZlcnNpb24pLCB0LndyaXRlVWludDgodGhpcy5BVkNQcm9maWxlSW5kaWNhdGlvbiksIHQud3JpdGVVaW50OCh0aGlzLnByb2ZpbGVfY29tcGF0aWJpbGl0eSksIHQud3JpdGVVaW50OCh0aGlzLkFWQ0xldmVsSW5kaWNhdGlvbiksIHQud3JpdGVVaW50OCh0aGlzLmxlbmd0aFNpemVNaW51c09uZSArIDI1MiksIHQud3JpdGVVaW50OCh0aGlzLlNQUy5sZW5ndGggKyAyMjQpLCBlID0gMDsgZSA8IHRoaXMuU1BTLmxlbmd0aDsgZSsrKQogICAgICAgIHQud3JpdGVVaW50MTYodGhpcy5TUFNbZV0ubGVuZ3RoKSwgdC53cml0ZVVpbnQ4QXJyYXkodGhpcy5TUFNbZV0ubmFsdSk7CiAgICAgIGZvciAodC53cml0ZVVpbnQ4KHRoaXMuUFBTLmxlbmd0aCksIGUgPSAwOyBlIDwgdGhpcy5QUFMubGVuZ3RoOyBlKyspCiAgICAgICAgdC53cml0ZVVpbnQxNih0aGlzLlBQU1tlXS5sZW5ndGgpLCB0LndyaXRlVWludDhBcnJheSh0aGlzLlBQU1tlXS5uYWx1KTsKICAgICAgdGhpcy5leHQgJiYgdC53cml0ZVVpbnQ4QXJyYXkodGhpcy5leHQpOwogICAgfSwgci5jbzY0Qm94LnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGU7CiAgICAgIGZvciAodGhpcy52ZXJzaW9uID0gMCwgdGhpcy5mbGFncyA9IDAsIHRoaXMuc2l6ZSA9IDQgKyA4ICogdGhpcy5jaHVua19vZmZzZXRzLmxlbmd0aCwgdGhpcy53cml0ZUhlYWRlcih0KSwgdC53cml0ZVVpbnQzMih0aGlzLmNodW5rX29mZnNldHMubGVuZ3RoKSwgZSA9IDA7IGUgPCB0aGlzLmNodW5rX29mZnNldHMubGVuZ3RoOyBlKyspCiAgICAgICAgdC53cml0ZVVpbnQ2NCh0aGlzLmNodW5rX29mZnNldHNbZV0pOwogICAgfSwgci5jc2xnQm94LnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy52ZXJzaW9uID0gMCwgdGhpcy5mbGFncyA9IDAsIHRoaXMuc2l6ZSA9IDQgKiA1LCB0aGlzLndyaXRlSGVhZGVyKHQpLCB0LndyaXRlSW50MzIodGhpcy5jb21wb3NpdGlvblRvRFRTU2hpZnQpLCB0LndyaXRlSW50MzIodGhpcy5sZWFzdERlY29kZVRvRGlzcGxheURlbHRhKSwgdC53cml0ZUludDMyKHRoaXMuZ3JlYXRlc3REZWNvZGVUb0Rpc3BsYXlEZWx0YSksIHQud3JpdGVJbnQzMih0aGlzLmNvbXBvc2l0aW9uU3RhcnRUaW1lKSwgdC53cml0ZUludDMyKHRoaXMuY29tcG9zaXRpb25FbmRUaW1lKTsKICAgIH0sIHIuY3R0c0JveC5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbih0KSB7CiAgICAgIHZhciBlOwogICAgICBmb3IgKHRoaXMudmVyc2lvbiA9IDAsIHRoaXMuZmxhZ3MgPSAwLCB0aGlzLnNpemUgPSA0ICsgOCAqIHRoaXMuc2FtcGxlX2NvdW50cy5sZW5ndGgsIHRoaXMud3JpdGVIZWFkZXIodCksIHQud3JpdGVVaW50MzIodGhpcy5zYW1wbGVfY291bnRzLmxlbmd0aCksIGUgPSAwOyBlIDwgdGhpcy5zYW1wbGVfY291bnRzLmxlbmd0aDsgZSsrKQogICAgICAgIHQud3JpdGVVaW50MzIodGhpcy5zYW1wbGVfY291bnRzW2VdKSwgdGhpcy52ZXJzaW9uID09PSAxID8gdC53cml0ZUludDMyKHRoaXMuc2FtcGxlX29mZnNldHNbZV0pIDogdC53cml0ZVVpbnQzMih0aGlzLnNhbXBsZV9vZmZzZXRzW2VdKTsKICAgIH0sIHIuZHJlZkJveC5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMudmVyc2lvbiA9IDAsIHRoaXMuZmxhZ3MgPSAwLCB0aGlzLnNpemUgPSA0LCB0aGlzLndyaXRlSGVhZGVyKHQpLCB0LndyaXRlVWludDMyKHRoaXMuZW50cmllcy5sZW5ndGgpOwogICAgICBmb3IgKHZhciBlID0gMDsgZSA8IHRoaXMuZW50cmllcy5sZW5ndGg7IGUrKykKICAgICAgICB0aGlzLmVudHJpZXNbZV0ud3JpdGUodCksIHRoaXMuc2l6ZSArPSB0aGlzLmVudHJpZXNbZV0uc2l6ZTsKICAgICAgYS5kZWJ1ZygiQm94V3JpdGVyIiwgIkFkanVzdGluZyBib3ggIiArIHRoaXMudHlwZSArICIgd2l0aCBuZXcgc2l6ZSAiICsgdGhpcy5zaXplKSwgdC5hZGp1c3RVaW50MzIodGhpcy5zaXplUG9zaXRpb24sIHRoaXMuc2l6ZSk7CiAgICB9LCByLmVsbmdCb3gucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24odCkgewogICAgICB0aGlzLnZlcnNpb24gPSAwLCB0aGlzLmZsYWdzID0gMCwgdGhpcy5zaXplID0gdGhpcy5leHRlbmRlZF9sYW5ndWFnZS5sZW5ndGgsIHRoaXMud3JpdGVIZWFkZXIodCksIHQud3JpdGVTdHJpbmcodGhpcy5leHRlbmRlZF9sYW5ndWFnZSk7CiAgICB9LCByLmVsc3RCb3gucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24odCkgewogICAgICB0aGlzLnZlcnNpb24gPSAwLCB0aGlzLmZsYWdzID0gMCwgdGhpcy5zaXplID0gNCArIDEyICogdGhpcy5lbnRyaWVzLmxlbmd0aCwgdGhpcy53cml0ZUhlYWRlcih0KSwgdC53cml0ZVVpbnQzMih0aGlzLmVudHJpZXMubGVuZ3RoKTsKICAgICAgZm9yICh2YXIgZSA9IDA7IGUgPCB0aGlzLmVudHJpZXMubGVuZ3RoOyBlKyspIHsKICAgICAgICB2YXIgcyA9IHRoaXMuZW50cmllc1tlXTsKICAgICAgICB0LndyaXRlVWludDMyKHMuc2VnbWVudF9kdXJhdGlvbiksIHQud3JpdGVJbnQzMihzLm1lZGlhX3RpbWUpLCB0LndyaXRlSW50MTYocy5tZWRpYV9yYXRlX2ludGVnZXIpLCB0LndyaXRlSW50MTYocy5tZWRpYV9yYXRlX2ZyYWN0aW9uKTsKICAgICAgfQogICAgfSwgci5lbXNnQm94LnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy52ZXJzaW9uID0gMCwgdGhpcy5mbGFncyA9IDAsIHRoaXMuc2l6ZSA9IDQgKiA0ICsgdGhpcy5tZXNzYWdlX2RhdGEubGVuZ3RoICsgKHRoaXMuc2NoZW1lX2lkX3VyaS5sZW5ndGggKyAxKSArICh0aGlzLnZhbHVlLmxlbmd0aCArIDEpLCB0aGlzLndyaXRlSGVhZGVyKHQpLCB0LndyaXRlQ1N0cmluZyh0aGlzLnNjaGVtZV9pZF91cmkpLCB0LndyaXRlQ1N0cmluZyh0aGlzLnZhbHVlKSwgdC53cml0ZVVpbnQzMih0aGlzLnRpbWVzY2FsZSksIHQud3JpdGVVaW50MzIodGhpcy5wcmVzZW50YXRpb25fdGltZV9kZWx0YSksIHQud3JpdGVVaW50MzIodGhpcy5ldmVudF9kdXJhdGlvbiksIHQud3JpdGVVaW50MzIodGhpcy5pZCksIHQud3JpdGVVaW50OEFycmF5KHRoaXMubWVzc2FnZV9kYXRhKTsKICAgIH0sIHIuZnR5cEJveC5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuc2l6ZSA9IDggKyA0ICogdGhpcy5jb21wYXRpYmxlX2JyYW5kcy5sZW5ndGgsIHRoaXMud3JpdGVIZWFkZXIodCksIHQud3JpdGVTdHJpbmcodGhpcy5tYWpvcl9icmFuZCwgbnVsbCwgNCksIHQud3JpdGVVaW50MzIodGhpcy5taW5vcl92ZXJzaW9uKTsKICAgICAgZm9yICh2YXIgZSA9IDA7IGUgPCB0aGlzLmNvbXBhdGlibGVfYnJhbmRzLmxlbmd0aDsgZSsrKQogICAgICAgIHQud3JpdGVTdHJpbmcodGhpcy5jb21wYXRpYmxlX2JyYW5kc1tlXSwgbnVsbCwgNCk7CiAgICB9LCByLmhkbHJCb3gucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24odCkgewogICAgICB0aGlzLnNpemUgPSA1ICogNCArIHRoaXMubmFtZS5sZW5ndGggKyAxLCB0aGlzLnZlcnNpb24gPSAwLCB0aGlzLmZsYWdzID0gMCwgdGhpcy53cml0ZUhlYWRlcih0KSwgdC53cml0ZVVpbnQzMigwKSwgdC53cml0ZVN0cmluZyh0aGlzLmhhbmRsZXIsIG51bGwsIDQpLCB0LndyaXRlVWludDMyKDApLCB0LndyaXRlVWludDMyKDApLCB0LndyaXRlVWludDMyKDApLCB0LndyaXRlQ1N0cmluZyh0aGlzLm5hbWUpOwogICAgfSwgci5odmNDQm94LnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUsIHM7CiAgICAgIGZvciAodGhpcy5zaXplID0gMjMsIGUgPSAwOyBlIDwgdGhpcy5uYWx1X2FycmF5cy5sZW5ndGg7IGUrKykKICAgICAgICBmb3IgKHRoaXMuc2l6ZSArPSAzLCBzID0gMDsgcyA8IHRoaXMubmFsdV9hcnJheXNbZV0ubGVuZ3RoOyBzKyspCiAgICAgICAgICB0aGlzLnNpemUgKz0gMiArIHRoaXMubmFsdV9hcnJheXNbZV1bc10uZGF0YS5sZW5ndGg7CiAgICAgIGZvciAodGhpcy53cml0ZUhlYWRlcih0KSwgdC53cml0ZVVpbnQ4KHRoaXMuY29uZmlndXJhdGlvblZlcnNpb24pLCB0LndyaXRlVWludDgodGhpcy5nZW5lcmFsX3Byb2ZpbGVfc3BhY2UgPDwgNiArIHRoaXMuZ2VuZXJhbF90aWVyX2ZsYWcgPDwgNSArIHRoaXMuZ2VuZXJhbF9wcm9maWxlX2lkYyksIHQud3JpdGVVaW50MzIodGhpcy5nZW5lcmFsX3Byb2ZpbGVfY29tcGF0aWJpbGl0eSksIHQud3JpdGVVaW50OEFycmF5KHRoaXMuZ2VuZXJhbF9jb25zdHJhaW50X2luZGljYXRvciksIHQud3JpdGVVaW50OCh0aGlzLmdlbmVyYWxfbGV2ZWxfaWRjKSwgdC53cml0ZVVpbnQxNih0aGlzLm1pbl9zcGF0aWFsX3NlZ21lbnRhdGlvbl9pZGMgKyAoMTUgPDwgMjQpKSwgdC53cml0ZVVpbnQ4KHRoaXMucGFyYWxsZWxpc21UeXBlICsgMjUyKSwgdC53cml0ZVVpbnQ4KHRoaXMuY2hyb21hX2Zvcm1hdF9pZGMgKyAyNTIpLCB0LndyaXRlVWludDgodGhpcy5iaXRfZGVwdGhfbHVtYV9taW51czggKyAyNDgpLCB0LndyaXRlVWludDgodGhpcy5iaXRfZGVwdGhfY2hyb21hX21pbnVzOCArIDI0OCksIHQud3JpdGVVaW50MTYodGhpcy5hdmdGcmFtZVJhdGUpLCB0LndyaXRlVWludDgoKHRoaXMuY29uc3RhbnRGcmFtZVJhdGUgPDwgNikgKyAodGhpcy5udW1UZW1wb3JhbExheWVycyA8PCAzKSArICh0aGlzLnRlbXBvcmFsSWROZXN0ZWQgPDwgMikgKyB0aGlzLmxlbmd0aFNpemVNaW51c09uZSksIHQud3JpdGVVaW50OCh0aGlzLm5hbHVfYXJyYXlzLmxlbmd0aCksIGUgPSAwOyBlIDwgdGhpcy5uYWx1X2FycmF5cy5sZW5ndGg7IGUrKykKICAgICAgICBmb3IgKHQud3JpdGVVaW50OCgodGhpcy5uYWx1X2FycmF5c1tlXS5jb21wbGV0ZW5lc3MgPDwgNykgKyB0aGlzLm5hbHVfYXJyYXlzW2VdLm5hbHVfdHlwZSksIHQud3JpdGVVaW50MTYodGhpcy5uYWx1X2FycmF5c1tlXS5sZW5ndGgpLCBzID0gMDsgcyA8IHRoaXMubmFsdV9hcnJheXNbZV0ubGVuZ3RoOyBzKyspCiAgICAgICAgICB0LndyaXRlVWludDE2KHRoaXMubmFsdV9hcnJheXNbZV1bc10uZGF0YS5sZW5ndGgpLCB0LndyaXRlVWludDhBcnJheSh0aGlzLm5hbHVfYXJyYXlzW2VdW3NdLmRhdGEpOwogICAgfSwgci5raW5kQm94LnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy52ZXJzaW9uID0gMCwgdGhpcy5mbGFncyA9IDAsIHRoaXMuc2l6ZSA9IHRoaXMuc2NoZW1lVVJJLmxlbmd0aCArIDEgKyAodGhpcy52YWx1ZS5sZW5ndGggKyAxKSwgdGhpcy53cml0ZUhlYWRlcih0KSwgdC53cml0ZUNTdHJpbmcodGhpcy5zY2hlbWVVUkkpLCB0LndyaXRlQ1N0cmluZyh0aGlzLnZhbHVlKTsKICAgIH0sIHIubWRoZEJveC5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuc2l6ZSA9IDQgKiA0ICsgMiAqIDIsIHRoaXMuZmxhZ3MgPSAwLCB0aGlzLnZlcnNpb24gPSAwLCB0aGlzLndyaXRlSGVhZGVyKHQpLCB0LndyaXRlVWludDMyKHRoaXMuY3JlYXRpb25fdGltZSksIHQud3JpdGVVaW50MzIodGhpcy5tb2RpZmljYXRpb25fdGltZSksIHQud3JpdGVVaW50MzIodGhpcy50aW1lc2NhbGUpLCB0LndyaXRlVWludDMyKHRoaXMuZHVyYXRpb24pLCB0LndyaXRlVWludDE2KHRoaXMubGFuZ3VhZ2UpLCB0LndyaXRlVWludDE2KDApOwogICAgfSwgci5tZWhkQm94LnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy52ZXJzaW9uID0gMCwgdGhpcy5mbGFncyA9IDAsIHRoaXMuc2l6ZSA9IDQsIHRoaXMud3JpdGVIZWFkZXIodCksIHQud3JpdGVVaW50MzIodGhpcy5mcmFnbWVudF9kdXJhdGlvbik7CiAgICB9LCByLm1maGRCb3gucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24odCkgewogICAgICB0aGlzLnZlcnNpb24gPSAwLCB0aGlzLmZsYWdzID0gMCwgdGhpcy5zaXplID0gNCwgdGhpcy53cml0ZUhlYWRlcih0KSwgdC53cml0ZVVpbnQzMih0aGlzLnNlcXVlbmNlX251bWJlcik7CiAgICB9LCByLm12aGRCb3gucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24odCkgewogICAgICB0aGlzLnZlcnNpb24gPSAwLCB0aGlzLmZsYWdzID0gMCwgdGhpcy5zaXplID0gMjMgKiA0ICsgMiAqIDIsIHRoaXMud3JpdGVIZWFkZXIodCksIHQud3JpdGVVaW50MzIodGhpcy5jcmVhdGlvbl90aW1lKSwgdC53cml0ZVVpbnQzMih0aGlzLm1vZGlmaWNhdGlvbl90aW1lKSwgdC53cml0ZVVpbnQzMih0aGlzLnRpbWVzY2FsZSksIHQud3JpdGVVaW50MzIodGhpcy5kdXJhdGlvbiksIHQud3JpdGVVaW50MzIodGhpcy5yYXRlKSwgdC53cml0ZVVpbnQxNih0aGlzLnZvbHVtZSA8PCA4KSwgdC53cml0ZVVpbnQxNigwKSwgdC53cml0ZVVpbnQzMigwKSwgdC53cml0ZVVpbnQzMigwKSwgdC53cml0ZVVpbnQzMkFycmF5KHRoaXMubWF0cml4KSwgdC53cml0ZVVpbnQzMigwKSwgdC53cml0ZVVpbnQzMigwKSwgdC53cml0ZVVpbnQzMigwKSwgdC53cml0ZVVpbnQzMigwKSwgdC53cml0ZVVpbnQzMigwKSwgdC53cml0ZVVpbnQzMigwKSwgdC53cml0ZVVpbnQzMih0aGlzLm5leHRfdHJhY2tfaWQpOwogICAgfSwgci5TYW1wbGVFbnRyeS5wcm90b3R5cGUud3JpdGVIZWFkZXIgPSBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuc2l6ZSA9IDgsIHIuQm94LnByb3RvdHlwZS53cml0ZUhlYWRlci5jYWxsKHRoaXMsIHQpLCB0LndyaXRlVWludDgoMCksIHQud3JpdGVVaW50OCgwKSwgdC53cml0ZVVpbnQ4KDApLCB0LndyaXRlVWludDgoMCksIHQud3JpdGVVaW50OCgwKSwgdC53cml0ZVVpbnQ4KDApLCB0LndyaXRlVWludDE2KHRoaXMuZGF0YV9yZWZlcmVuY2VfaW5kZXgpOwogICAgfSwgci5TYW1wbGVFbnRyeS5wcm90b3R5cGUud3JpdGVGb290ZXIgPSBmdW5jdGlvbih0KSB7CiAgICAgIGZvciAodmFyIGUgPSAwOyBlIDwgdGhpcy5ib3hlcy5sZW5ndGg7IGUrKykKICAgICAgICB0aGlzLmJveGVzW2VdLndyaXRlKHQpLCB0aGlzLnNpemUgKz0gdGhpcy5ib3hlc1tlXS5zaXplOwogICAgICBhLmRlYnVnKCJCb3hXcml0ZXIiLCAiQWRqdXN0aW5nIGJveCAiICsgdGhpcy50eXBlICsgIiB3aXRoIG5ldyBzaXplICIgKyB0aGlzLnNpemUpLCB0LmFkanVzdFVpbnQzMih0aGlzLnNpemVQb3NpdGlvbiwgdGhpcy5zaXplKTsKICAgIH0sIHIuU2FtcGxlRW50cnkucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24odCkgewogICAgICB0aGlzLndyaXRlSGVhZGVyKHQpLCB0LndyaXRlVWludDhBcnJheSh0aGlzLmRhdGEpLCB0aGlzLnNpemUgKz0gdGhpcy5kYXRhLmxlbmd0aCwgYS5kZWJ1ZygiQm94V3JpdGVyIiwgIkFkanVzdGluZyBib3ggIiArIHRoaXMudHlwZSArICIgd2l0aCBuZXcgc2l6ZSAiICsgdGhpcy5zaXplKSwgdC5hZGp1c3RVaW50MzIodGhpcy5zaXplUG9zaXRpb24sIHRoaXMuc2l6ZSk7CiAgICB9LCByLlZpc3VhbFNhbXBsZUVudHJ5LnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy53cml0ZUhlYWRlcih0KSwgdGhpcy5zaXplICs9IDIgKiA3ICsgNiAqIDQgKyAzMiwgdC53cml0ZVVpbnQxNigwKSwgdC53cml0ZVVpbnQxNigwKSwgdC53cml0ZVVpbnQzMigwKSwgdC53cml0ZVVpbnQzMigwKSwgdC53cml0ZVVpbnQzMigwKSwgdC53cml0ZVVpbnQxNih0aGlzLndpZHRoKSwgdC53cml0ZVVpbnQxNih0aGlzLmhlaWdodCksIHQud3JpdGVVaW50MzIodGhpcy5ob3JpenJlc29sdXRpb24pLCB0LndyaXRlVWludDMyKHRoaXMudmVydHJlc29sdXRpb24pLCB0LndyaXRlVWludDMyKDApLCB0LndyaXRlVWludDE2KHRoaXMuZnJhbWVfY291bnQpLCB0LndyaXRlVWludDgoTWF0aC5taW4oMzEsIHRoaXMuY29tcHJlc3Nvcm5hbWUubGVuZ3RoKSksIHQud3JpdGVTdHJpbmcodGhpcy5jb21wcmVzc29ybmFtZSwgbnVsbCwgMzEpLCB0LndyaXRlVWludDE2KHRoaXMuZGVwdGgpLCB0LndyaXRlSW50MTYoLTEpLCB0aGlzLndyaXRlRm9vdGVyKHQpOwogICAgfSwgci5BdWRpb1NhbXBsZUVudHJ5LnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy53cml0ZUhlYWRlcih0KSwgdGhpcy5zaXplICs9IDIgKiA0ICsgMyAqIDQsIHQud3JpdGVVaW50MzIoMCksIHQud3JpdGVVaW50MzIoMCksIHQud3JpdGVVaW50MTYodGhpcy5jaGFubmVsX2NvdW50KSwgdC53cml0ZVVpbnQxNih0aGlzLnNhbXBsZXNpemUpLCB0LndyaXRlVWludDE2KDApLCB0LndyaXRlVWludDE2KDApLCB0LndyaXRlVWludDMyKHRoaXMuc2FtcGxlcmF0ZSA8PCAxNiksIHRoaXMud3JpdGVGb290ZXIodCk7CiAgICB9LCByLnN0cHBTYW1wbGVFbnRyeS5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMud3JpdGVIZWFkZXIodCksIHRoaXMuc2l6ZSArPSB0aGlzLm5hbWVzcGFjZS5sZW5ndGggKyAxICsgdGhpcy5zY2hlbWFfbG9jYXRpb24ubGVuZ3RoICsgMSArIHRoaXMuYXV4aWxpYXJ5X21pbWVfdHlwZXMubGVuZ3RoICsgMSwgdC53cml0ZUNTdHJpbmcodGhpcy5uYW1lc3BhY2UpLCB0LndyaXRlQ1N0cmluZyh0aGlzLnNjaGVtYV9sb2NhdGlvbiksIHQud3JpdGVDU3RyaW5nKHRoaXMuYXV4aWxpYXJ5X21pbWVfdHlwZXMpLCB0aGlzLndyaXRlRm9vdGVyKHQpOwogICAgfSwgci5TYW1wbGVHcm91cEVudHJ5LnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdC53cml0ZVVpbnQ4QXJyYXkodGhpcy5kYXRhKTsKICAgIH0sIHIuc2JncEJveC5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMudmVyc2lvbiA9IDEsIHRoaXMuZmxhZ3MgPSAwLCB0aGlzLnNpemUgPSAxMiArIDggKiB0aGlzLmVudHJpZXMubGVuZ3RoLCB0aGlzLndyaXRlSGVhZGVyKHQpLCB0LndyaXRlU3RyaW5nKHRoaXMuZ3JvdXBpbmdfdHlwZSwgbnVsbCwgNCksIHQud3JpdGVVaW50MzIodGhpcy5ncm91cGluZ190eXBlX3BhcmFtZXRlciksIHQud3JpdGVVaW50MzIodGhpcy5lbnRyaWVzLmxlbmd0aCk7CiAgICAgIGZvciAodmFyIGUgPSAwOyBlIDwgdGhpcy5lbnRyaWVzLmxlbmd0aDsgZSsrKSB7CiAgICAgICAgdmFyIHMgPSB0aGlzLmVudHJpZXNbZV07CiAgICAgICAgdC53cml0ZUludDMyKHMuc2FtcGxlX2NvdW50KSwgdC53cml0ZUludDMyKHMuZ3JvdXBfZGVzY3JpcHRpb25faW5kZXgpOwogICAgICB9CiAgICB9LCByLnNncGRCb3gucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24odCkgewogICAgICB2YXIgZSwgczsKICAgICAgZm9yICh0aGlzLmZsYWdzID0gMCwgdGhpcy5zaXplID0gMTIsIGUgPSAwOyBlIDwgdGhpcy5lbnRyaWVzLmxlbmd0aDsgZSsrKQogICAgICAgIHMgPSB0aGlzLmVudHJpZXNbZV0sIHRoaXMudmVyc2lvbiA9PT0gMSAmJiAodGhpcy5kZWZhdWx0X2xlbmd0aCA9PT0gMCAmJiAodGhpcy5zaXplICs9IDQpLCB0aGlzLnNpemUgKz0gcy5kYXRhLmxlbmd0aCk7CiAgICAgIGZvciAodGhpcy53cml0ZUhlYWRlcih0KSwgdC53cml0ZVN0cmluZyh0aGlzLmdyb3VwaW5nX3R5cGUsIG51bGwsIDQpLCB0aGlzLnZlcnNpb24gPT09IDEgJiYgdC53cml0ZVVpbnQzMih0aGlzLmRlZmF1bHRfbGVuZ3RoKSwgdGhpcy52ZXJzaW9uID49IDIgJiYgdC53cml0ZVVpbnQzMih0aGlzLmRlZmF1bHRfc2FtcGxlX2Rlc2NyaXB0aW9uX2luZGV4KSwgdC53cml0ZVVpbnQzMih0aGlzLmVudHJpZXMubGVuZ3RoKSwgZSA9IDA7IGUgPCB0aGlzLmVudHJpZXMubGVuZ3RoOyBlKyspCiAgICAgICAgcyA9IHRoaXMuZW50cmllc1tlXSwgdGhpcy52ZXJzaW9uID09PSAxICYmIHRoaXMuZGVmYXVsdF9sZW5ndGggPT09IDAgJiYgdC53cml0ZVVpbnQzMihzLmRlc2NyaXB0aW9uX2xlbmd0aCksIHMud3JpdGUodCk7CiAgICB9LCByLnNpZHhCb3gucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24odCkgewogICAgICB0aGlzLnZlcnNpb24gPSAwLCB0aGlzLmZsYWdzID0gMCwgdGhpcy5zaXplID0gNCAqIDQgKyAyICsgMiArIDEyICogdGhpcy5yZWZlcmVuY2VzLmxlbmd0aCwgdGhpcy53cml0ZUhlYWRlcih0KSwgdC53cml0ZVVpbnQzMih0aGlzLnJlZmVyZW5jZV9JRCksIHQud3JpdGVVaW50MzIodGhpcy50aW1lc2NhbGUpLCB0LndyaXRlVWludDMyKHRoaXMuZWFybGllc3RfcHJlc2VudGF0aW9uX3RpbWUpLCB0LndyaXRlVWludDMyKHRoaXMuZmlyc3Rfb2Zmc2V0KSwgdC53cml0ZVVpbnQxNigwKSwgdC53cml0ZVVpbnQxNih0aGlzLnJlZmVyZW5jZXMubGVuZ3RoKTsKICAgICAgZm9yICh2YXIgZSA9IDA7IGUgPCB0aGlzLnJlZmVyZW5jZXMubGVuZ3RoOyBlKyspIHsKICAgICAgICB2YXIgcyA9IHRoaXMucmVmZXJlbmNlc1tlXTsKICAgICAgICB0LndyaXRlVWludDMyKHMucmVmZXJlbmNlX3R5cGUgPDwgMzEgfCBzLnJlZmVyZW5jZWRfc2l6ZSksIHQud3JpdGVVaW50MzIocy5zdWJzZWdtZW50X2R1cmF0aW9uKSwgdC53cml0ZVVpbnQzMihzLnN0YXJ0c193aXRoX1NBUCA8PCAzMSB8IHMuU0FQX3R5cGUgPDwgMjggfCBzLlNBUF9kZWx0YV90aW1lKTsKICAgICAgfQogICAgfSwgci5zbWhkQm94LnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy52ZXJzaW9uID0gMCwgdGhpcy5mbGFncyA9IDEsIHRoaXMuc2l6ZSA9IDQsIHRoaXMud3JpdGVIZWFkZXIodCksIHQud3JpdGVVaW50MTYodGhpcy5iYWxhbmNlKSwgdC53cml0ZVVpbnQxNigwKTsKICAgIH0sIHIuc3Rjb0JveC5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMudmVyc2lvbiA9IDAsIHRoaXMuZmxhZ3MgPSAwLCB0aGlzLnNpemUgPSA0ICsgNCAqIHRoaXMuY2h1bmtfb2Zmc2V0cy5sZW5ndGgsIHRoaXMud3JpdGVIZWFkZXIodCksIHQud3JpdGVVaW50MzIodGhpcy5jaHVua19vZmZzZXRzLmxlbmd0aCksIHQud3JpdGVVaW50MzJBcnJheSh0aGlzLmNodW5rX29mZnNldHMpOwogICAgfSwgci5zdHNjQm94LnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGU7CiAgICAgIGZvciAodGhpcy52ZXJzaW9uID0gMCwgdGhpcy5mbGFncyA9IDAsIHRoaXMuc2l6ZSA9IDQgKyAxMiAqIHRoaXMuZmlyc3RfY2h1bmsubGVuZ3RoLCB0aGlzLndyaXRlSGVhZGVyKHQpLCB0LndyaXRlVWludDMyKHRoaXMuZmlyc3RfY2h1bmsubGVuZ3RoKSwgZSA9IDA7IGUgPCB0aGlzLmZpcnN0X2NodW5rLmxlbmd0aDsgZSsrKQogICAgICAgIHQud3JpdGVVaW50MzIodGhpcy5maXJzdF9jaHVua1tlXSksIHQud3JpdGVVaW50MzIodGhpcy5zYW1wbGVzX3Blcl9jaHVua1tlXSksIHQud3JpdGVVaW50MzIodGhpcy5zYW1wbGVfZGVzY3JpcHRpb25faW5kZXhbZV0pOwogICAgfSwgci5zdHNkQm94LnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGU7CiAgICAgIGZvciAodGhpcy52ZXJzaW9uID0gMCwgdGhpcy5mbGFncyA9IDAsIHRoaXMuc2l6ZSA9IDAsIHRoaXMud3JpdGVIZWFkZXIodCksIHQud3JpdGVVaW50MzIodGhpcy5lbnRyaWVzLmxlbmd0aCksIHRoaXMuc2l6ZSArPSA0LCBlID0gMDsgZSA8IHRoaXMuZW50cmllcy5sZW5ndGg7IGUrKykKICAgICAgICB0aGlzLmVudHJpZXNbZV0ud3JpdGUodCksIHRoaXMuc2l6ZSArPSB0aGlzLmVudHJpZXNbZV0uc2l6ZTsKICAgICAgYS5kZWJ1ZygiQm94V3JpdGVyIiwgIkFkanVzdGluZyBib3ggIiArIHRoaXMudHlwZSArICIgd2l0aCBuZXcgc2l6ZSAiICsgdGhpcy5zaXplKSwgdC5hZGp1c3RVaW50MzIodGhpcy5zaXplUG9zaXRpb24sIHRoaXMuc2l6ZSk7CiAgICB9LCByLnN0c2hCb3gucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24odCkgewogICAgICB2YXIgZTsKICAgICAgZm9yICh0aGlzLnZlcnNpb24gPSAwLCB0aGlzLmZsYWdzID0gMCwgdGhpcy5zaXplID0gNCArIDggKiB0aGlzLnNoYWRvd2VkX3NhbXBsZV9udW1iZXJzLmxlbmd0aCwgdGhpcy53cml0ZUhlYWRlcih0KSwgdC53cml0ZVVpbnQzMih0aGlzLnNoYWRvd2VkX3NhbXBsZV9udW1iZXJzLmxlbmd0aCksIGUgPSAwOyBlIDwgdGhpcy5zaGFkb3dlZF9zYW1wbGVfbnVtYmVycy5sZW5ndGg7IGUrKykKICAgICAgICB0LndyaXRlVWludDMyKHRoaXMuc2hhZG93ZWRfc2FtcGxlX251bWJlcnNbZV0pLCB0LndyaXRlVWludDMyKHRoaXMuc3luY19zYW1wbGVfbnVtYmVyc1tlXSk7CiAgICB9LCByLnN0c3NCb3gucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24odCkgewogICAgICB0aGlzLnZlcnNpb24gPSAwLCB0aGlzLmZsYWdzID0gMCwgdGhpcy5zaXplID0gNCArIDQgKiB0aGlzLnNhbXBsZV9udW1iZXJzLmxlbmd0aCwgdGhpcy53cml0ZUhlYWRlcih0KSwgdC53cml0ZVVpbnQzMih0aGlzLnNhbXBsZV9udW1iZXJzLmxlbmd0aCksIHQud3JpdGVVaW50MzJBcnJheSh0aGlzLnNhbXBsZV9udW1iZXJzKTsKICAgIH0sIHIuc3RzekJveC5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbih0KSB7CiAgICAgIHZhciBlLCBzID0gdHJ1ZTsKICAgICAgaWYgKHRoaXMudmVyc2lvbiA9IDAsIHRoaXMuZmxhZ3MgPSAwLCB0aGlzLnNhbXBsZV9zaXplcy5sZW5ndGggPiAwKQogICAgICAgIGZvciAoZSA9IDA7IGUgKyAxIDwgdGhpcy5zYW1wbGVfc2l6ZXMubGVuZ3RoOyApCiAgICAgICAgICBpZiAodGhpcy5zYW1wbGVfc2l6ZXNbZSArIDFdICE9PSB0aGlzLnNhbXBsZV9zaXplc1swXSkgewogICAgICAgICAgICBzID0gZmFsc2U7CiAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgfSBlbHNlCiAgICAgICAgICAgIGUrKzsKICAgICAgZWxzZQogICAgICAgIHMgPSBmYWxzZTsKICAgICAgdGhpcy5zaXplID0gOCwgcyB8fCAodGhpcy5zaXplICs9IDQgKiB0aGlzLnNhbXBsZV9zaXplcy5sZW5ndGgpLCB0aGlzLndyaXRlSGVhZGVyKHQpLCBzID8gdC53cml0ZVVpbnQzMih0aGlzLnNhbXBsZV9zaXplc1swXSkgOiB0LndyaXRlVWludDMyKDApLCB0LndyaXRlVWludDMyKHRoaXMuc2FtcGxlX3NpemVzLmxlbmd0aCksIHMgfHwgdC53cml0ZVVpbnQzMkFycmF5KHRoaXMuc2FtcGxlX3NpemVzKTsKICAgIH0sIHIuc3R0c0JveC5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbih0KSB7CiAgICAgIHZhciBlOwogICAgICBmb3IgKHRoaXMudmVyc2lvbiA9IDAsIHRoaXMuZmxhZ3MgPSAwLCB0aGlzLnNpemUgPSA0ICsgOCAqIHRoaXMuc2FtcGxlX2NvdW50cy5sZW5ndGgsIHRoaXMud3JpdGVIZWFkZXIodCksIHQud3JpdGVVaW50MzIodGhpcy5zYW1wbGVfY291bnRzLmxlbmd0aCksIGUgPSAwOyBlIDwgdGhpcy5zYW1wbGVfY291bnRzLmxlbmd0aDsgZSsrKQogICAgICAgIHQud3JpdGVVaW50MzIodGhpcy5zYW1wbGVfY291bnRzW2VdKSwgdC53cml0ZVVpbnQzMih0aGlzLnNhbXBsZV9kZWx0YXNbZV0pOwogICAgfSwgci50ZmR0Qm94LnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUgPSBNYXRoLnBvdygyLCAzMikgLSAxOwogICAgICB0aGlzLnZlcnNpb24gPSB0aGlzLmJhc2VNZWRpYURlY29kZVRpbWUgPiBlID8gMSA6IDAsIHRoaXMuZmxhZ3MgPSAwLCB0aGlzLnNpemUgPSA0LCB0aGlzLnZlcnNpb24gPT09IDEgJiYgKHRoaXMuc2l6ZSArPSA0KSwgdGhpcy53cml0ZUhlYWRlcih0KSwgdGhpcy52ZXJzaW9uID09PSAxID8gdC53cml0ZVVpbnQ2NCh0aGlzLmJhc2VNZWRpYURlY29kZVRpbWUpIDogdC53cml0ZVVpbnQzMih0aGlzLmJhc2VNZWRpYURlY29kZVRpbWUpOwogICAgfSwgci50ZmhkQm94LnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy52ZXJzaW9uID0gMCwgdGhpcy5zaXplID0gNCwgdGhpcy5mbGFncyAmIHIuVEZIRF9GTEFHX0JBU0VfREFUQV9PRkZTRVQgJiYgKHRoaXMuc2l6ZSArPSA4KSwgdGhpcy5mbGFncyAmIHIuVEZIRF9GTEFHX1NBTVBMRV9ERVNDICYmICh0aGlzLnNpemUgKz0gNCksIHRoaXMuZmxhZ3MgJiByLlRGSERfRkxBR19TQU1QTEVfRFVSICYmICh0aGlzLnNpemUgKz0gNCksIHRoaXMuZmxhZ3MgJiByLlRGSERfRkxBR19TQU1QTEVfU0laRSAmJiAodGhpcy5zaXplICs9IDQpLCB0aGlzLmZsYWdzICYgci5URkhEX0ZMQUdfU0FNUExFX0ZMQUdTICYmICh0aGlzLnNpemUgKz0gNCksIHRoaXMud3JpdGVIZWFkZXIodCksIHQud3JpdGVVaW50MzIodGhpcy50cmFja19pZCksIHRoaXMuZmxhZ3MgJiByLlRGSERfRkxBR19CQVNFX0RBVEFfT0ZGU0VUICYmIHQud3JpdGVVaW50NjQodGhpcy5iYXNlX2RhdGFfb2Zmc2V0KSwgdGhpcy5mbGFncyAmIHIuVEZIRF9GTEFHX1NBTVBMRV9ERVNDICYmIHQud3JpdGVVaW50MzIodGhpcy5kZWZhdWx0X3NhbXBsZV9kZXNjcmlwdGlvbl9pbmRleCksIHRoaXMuZmxhZ3MgJiByLlRGSERfRkxBR19TQU1QTEVfRFVSICYmIHQud3JpdGVVaW50MzIodGhpcy5kZWZhdWx0X3NhbXBsZV9kdXJhdGlvbiksIHRoaXMuZmxhZ3MgJiByLlRGSERfRkxBR19TQU1QTEVfU0laRSAmJiB0LndyaXRlVWludDMyKHRoaXMuZGVmYXVsdF9zYW1wbGVfc2l6ZSksIHRoaXMuZmxhZ3MgJiByLlRGSERfRkxBR19TQU1QTEVfRkxBR1MgJiYgdC53cml0ZVVpbnQzMih0aGlzLmRlZmF1bHRfc2FtcGxlX2ZsYWdzKTsKICAgIH0sIHIudGtoZEJveC5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMudmVyc2lvbiA9IDAsIHRoaXMuc2l6ZSA9IDQgKiAxOCArIDIgKiA0LCB0aGlzLndyaXRlSGVhZGVyKHQpLCB0LndyaXRlVWludDMyKHRoaXMuY3JlYXRpb25fdGltZSksIHQud3JpdGVVaW50MzIodGhpcy5tb2RpZmljYXRpb25fdGltZSksIHQud3JpdGVVaW50MzIodGhpcy50cmFja19pZCksIHQud3JpdGVVaW50MzIoMCksIHQud3JpdGVVaW50MzIodGhpcy5kdXJhdGlvbiksIHQud3JpdGVVaW50MzIoMCksIHQud3JpdGVVaW50MzIoMCksIHQud3JpdGVJbnQxNih0aGlzLmxheWVyKSwgdC53cml0ZUludDE2KHRoaXMuYWx0ZXJuYXRlX2dyb3VwKSwgdC53cml0ZUludDE2KHRoaXMudm9sdW1lIDw8IDgpLCB0LndyaXRlVWludDE2KDApLCB0LndyaXRlSW50MzJBcnJheSh0aGlzLm1hdHJpeCksIHQud3JpdGVVaW50MzIodGhpcy53aWR0aCksIHQud3JpdGVVaW50MzIodGhpcy5oZWlnaHQpOwogICAgfSwgci50cmV4Qm94LnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy52ZXJzaW9uID0gMCwgdGhpcy5mbGFncyA9IDAsIHRoaXMuc2l6ZSA9IDQgKiA1LCB0aGlzLndyaXRlSGVhZGVyKHQpLCB0LndyaXRlVWludDMyKHRoaXMudHJhY2tfaWQpLCB0LndyaXRlVWludDMyKHRoaXMuZGVmYXVsdF9zYW1wbGVfZGVzY3JpcHRpb25faW5kZXgpLCB0LndyaXRlVWludDMyKHRoaXMuZGVmYXVsdF9zYW1wbGVfZHVyYXRpb24pLCB0LndyaXRlVWludDMyKHRoaXMuZGVmYXVsdF9zYW1wbGVfc2l6ZSksIHQud3JpdGVVaW50MzIodGhpcy5kZWZhdWx0X3NhbXBsZV9mbGFncyk7CiAgICB9LCByLnRydW5Cb3gucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24odCkgewogICAgICB0aGlzLnZlcnNpb24gPSAwLCB0aGlzLnNpemUgPSA0LCB0aGlzLmZsYWdzICYgci5UUlVOX0ZMQUdTX0RBVEFfT0ZGU0VUICYmICh0aGlzLnNpemUgKz0gNCksIHRoaXMuZmxhZ3MgJiByLlRSVU5fRkxBR1NfRklSU1RfRkxBRyAmJiAodGhpcy5zaXplICs9IDQpLCB0aGlzLmZsYWdzICYgci5UUlVOX0ZMQUdTX0RVUkFUSU9OICYmICh0aGlzLnNpemUgKz0gNCAqIHRoaXMuc2FtcGxlX2R1cmF0aW9uLmxlbmd0aCksIHRoaXMuZmxhZ3MgJiByLlRSVU5fRkxBR1NfU0laRSAmJiAodGhpcy5zaXplICs9IDQgKiB0aGlzLnNhbXBsZV9zaXplLmxlbmd0aCksIHRoaXMuZmxhZ3MgJiByLlRSVU5fRkxBR1NfRkxBR1MgJiYgKHRoaXMuc2l6ZSArPSA0ICogdGhpcy5zYW1wbGVfZmxhZ3MubGVuZ3RoKSwgdGhpcy5mbGFncyAmIHIuVFJVTl9GTEFHU19DVFNfT0ZGU0VUICYmICh0aGlzLnNpemUgKz0gNCAqIHRoaXMuc2FtcGxlX2NvbXBvc2l0aW9uX3RpbWVfb2Zmc2V0Lmxlbmd0aCksIHRoaXMud3JpdGVIZWFkZXIodCksIHQud3JpdGVVaW50MzIodGhpcy5zYW1wbGVfY291bnQpLCB0aGlzLmZsYWdzICYgci5UUlVOX0ZMQUdTX0RBVEFfT0ZGU0VUICYmICh0aGlzLmRhdGFfb2Zmc2V0X3Bvc2l0aW9uID0gdC5nZXRQb3NpdGlvbigpLCB0LndyaXRlSW50MzIodGhpcy5kYXRhX29mZnNldCkpLCB0aGlzLmZsYWdzICYgci5UUlVOX0ZMQUdTX0ZJUlNUX0ZMQUcgJiYgdC53cml0ZVVpbnQzMih0aGlzLmZpcnN0X3NhbXBsZV9mbGFncyk7CiAgICAgIGZvciAodmFyIGUgPSAwOyBlIDwgdGhpcy5zYW1wbGVfY291bnQ7IGUrKykKICAgICAgICB0aGlzLmZsYWdzICYgci5UUlVOX0ZMQUdTX0RVUkFUSU9OICYmIHQud3JpdGVVaW50MzIodGhpcy5zYW1wbGVfZHVyYXRpb25bZV0pLCB0aGlzLmZsYWdzICYgci5UUlVOX0ZMQUdTX1NJWkUgJiYgdC53cml0ZVVpbnQzMih0aGlzLnNhbXBsZV9zaXplW2VdKSwgdGhpcy5mbGFncyAmIHIuVFJVTl9GTEFHU19GTEFHUyAmJiB0LndyaXRlVWludDMyKHRoaXMuc2FtcGxlX2ZsYWdzW2VdKSwgdGhpcy5mbGFncyAmIHIuVFJVTl9GTEFHU19DVFNfT0ZGU0VUICYmICh0aGlzLnZlcnNpb24gPT09IDAgPyB0LndyaXRlVWludDMyKHRoaXMuc2FtcGxlX2NvbXBvc2l0aW9uX3RpbWVfb2Zmc2V0W2VdKSA6IHQud3JpdGVJbnQzMih0aGlzLnNhbXBsZV9jb21wb3NpdGlvbl90aW1lX29mZnNldFtlXSkpOwogICAgfSwgclsidXJsIEJveCJdLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy52ZXJzaW9uID0gMCwgdGhpcy5sb2NhdGlvbiA/ICh0aGlzLmZsYWdzID0gMCwgdGhpcy5zaXplID0gdGhpcy5sb2NhdGlvbi5sZW5ndGggKyAxKSA6ICh0aGlzLmZsYWdzID0gMSwgdGhpcy5zaXplID0gMCksIHRoaXMud3JpdGVIZWFkZXIodCksIHRoaXMubG9jYXRpb24gJiYgdC53cml0ZUNTdHJpbmcodGhpcy5sb2NhdGlvbik7CiAgICB9LCByWyJ1cm4gQm94Il0ucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24odCkgewogICAgICB0aGlzLnZlcnNpb24gPSAwLCB0aGlzLmZsYWdzID0gMCwgdGhpcy5zaXplID0gdGhpcy5uYW1lLmxlbmd0aCArIDEgKyAodGhpcy5sb2NhdGlvbiA/IHRoaXMubG9jYXRpb24ubGVuZ3RoICsgMSA6IDApLCB0aGlzLndyaXRlSGVhZGVyKHQpLCB0LndyaXRlQ1N0cmluZyh0aGlzLm5hbWUpLCB0aGlzLmxvY2F0aW9uICYmIHQud3JpdGVDU3RyaW5nKHRoaXMubG9jYXRpb24pOwogICAgfSwgci52bWhkQm94LnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy52ZXJzaW9uID0gMCwgdGhpcy5mbGFncyA9IDEsIHRoaXMuc2l6ZSA9IDgsIHRoaXMud3JpdGVIZWFkZXIodCksIHQud3JpdGVVaW50MTYodGhpcy5ncmFwaGljc21vZGUpLCB0LndyaXRlVWludDE2QXJyYXkodGhpcy5vcGNvbG9yKTsKICAgIH0sIHIuY3R0c0JveC5wcm90b3R5cGUudW5wYWNrID0gZnVuY3Rpb24odCkgewogICAgICB2YXIgZSwgcywgaDsKICAgICAgZm9yIChoID0gMCwgZSA9IDA7IGUgPCB0aGlzLnNhbXBsZV9jb3VudHMubGVuZ3RoOyBlKyspCiAgICAgICAgZm9yIChzID0gMDsgcyA8IHRoaXMuc2FtcGxlX2NvdW50c1tlXTsgcysrKQogICAgICAgICAgdFtoXS5wdHMgPSB0W2hdLmR0cyArIHRoaXMuc2FtcGxlX29mZnNldHNbZV0sIGgrKzsKICAgIH0sIHIuc3R0c0JveC5wcm90b3R5cGUudW5wYWNrID0gZnVuY3Rpb24odCkgewogICAgICB2YXIgZSwgcywgaDsKICAgICAgZm9yIChoID0gMCwgZSA9IDA7IGUgPCB0aGlzLnNhbXBsZV9jb3VudHMubGVuZ3RoOyBlKyspCiAgICAgICAgZm9yIChzID0gMDsgcyA8IHRoaXMuc2FtcGxlX2NvdW50c1tlXTsgcysrKQogICAgICAgICAgaCA9PT0gMCA/IHRbaF0uZHRzID0gMCA6IHRbaF0uZHRzID0gdFtoIC0gMV0uZHRzICsgdGhpcy5zYW1wbGVfZGVsdGFzW2VdLCBoKys7CiAgICB9LCByLnN0Y29Cb3gucHJvdG90eXBlLnVucGFjayA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGU7CiAgICAgIGZvciAoZSA9IDA7IGUgPCB0aGlzLmNodW5rX29mZnNldHMubGVuZ3RoOyBlKyspCiAgICAgICAgdFtlXS5vZmZzZXQgPSB0aGlzLmNodW5rX29mZnNldHNbZV07CiAgICB9LCByLnN0c2NCb3gucHJvdG90eXBlLnVucGFjayA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUsIHMsIGgsIGwsIHA7CiAgICAgIGZvciAobCA9IDAsIHAgPSAwLCBlID0gMDsgZSA8IHRoaXMuZmlyc3RfY2h1bmsubGVuZ3RoOyBlKyspCiAgICAgICAgZm9yIChzID0gMDsgcyA8IChlICsgMSA8IHRoaXMuZmlyc3RfY2h1bmsubGVuZ3RoID8gdGhpcy5maXJzdF9jaHVua1tlICsgMV0gOiAxIC8gMCk7IHMrKykKICAgICAgICAgIGZvciAocCsrLCBoID0gMDsgaCA8IHRoaXMuc2FtcGxlc19wZXJfY2h1bmtbZV07IGgrKykgewogICAgICAgICAgICBpZiAodFtsXSkKICAgICAgICAgICAgICB0W2xdLmRlc2NyaXB0aW9uX2luZGV4ID0gdGhpcy5zYW1wbGVfZGVzY3JpcHRpb25faW5kZXhbZV0sIHRbbF0uY2h1bmtfaW5kZXggPSBwOwogICAgICAgICAgICBlbHNlCiAgICAgICAgICAgICAgcmV0dXJuOwogICAgICAgICAgICBsKys7CiAgICAgICAgICB9CiAgICB9LCByLnN0c3pCb3gucHJvdG90eXBlLnVucGFjayA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGU7CiAgICAgIGZvciAoZSA9IDA7IGUgPCB0aGlzLnNhbXBsZV9zaXplcy5sZW5ndGg7IGUrKykKICAgICAgICB0W2VdLnNpemUgPSB0aGlzLnNhbXBsZV9zaXplc1tlXTsKICAgIH0sIHIuRElGRl9CT1hFU19QUk9QX05BTUVTID0gWwogICAgICAiYm94ZXMiLAogICAgICAiZW50cmllcyIsCiAgICAgICJyZWZlcmVuY2VzIiwKICAgICAgInN1YnNhbXBsZXMiLAogICAgICAiaXRlbXMiLAogICAgICAiaXRlbV9pbmZvcyIsCiAgICAgICJleHRlbnRzIiwKICAgICAgImFzc29jaWF0aW9ucyIsCiAgICAgICJzdWJzZWdtZW50cyIsCiAgICAgICJyYW5nZXMiLAogICAgICAic2Vla0xpc3RzIiwKICAgICAgInNlZWtQb2ludHMiLAogICAgICAiZXNkIiwKICAgICAgImxldmVscyIKICAgIF0sIHIuRElGRl9QUklNSVRJVkVfQVJSQVlfUFJPUF9OQU1FUyA9IFsKICAgICAgImNvbXBhdGlibGVfYnJhbmRzIiwKICAgICAgIm1hdHJpeCIsCiAgICAgICJvcGNvbG9yIiwKICAgICAgInNhbXBsZV9jb3VudHMiLAogICAgICAic2FtcGxlX2NvdW50cyIsCiAgICAgICJzYW1wbGVfZGVsdGFzIiwKICAgICAgImZpcnN0X2NodW5rIiwKICAgICAgInNhbXBsZXNfcGVyX2NodW5rIiwKICAgICAgInNhbXBsZV9zaXplcyIsCiAgICAgICJjaHVua19vZmZzZXRzIiwKICAgICAgInNhbXBsZV9vZmZzZXRzIiwKICAgICAgInNhbXBsZV9kZXNjcmlwdGlvbl9pbmRleCIsCiAgICAgICJzYW1wbGVfZHVyYXRpb24iCiAgICBdLCByLmJveEVxdWFsRmllbGRzID0gZnVuY3Rpb24odCwgZSkgewogICAgICBpZiAodCAmJiAhZSkKICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgIHZhciBzOwogICAgICBmb3IgKHMgaW4gdCkKICAgICAgICBpZiAoIShyLkRJRkZfQk9YRVNfUFJPUF9OQU1FUy5pbmRleE9mKHMpID4gLTEpKSB7CiAgICAgICAgICBpZiAodFtzXSBpbnN0YW5jZW9mIHIuQm94IHx8IGVbc10gaW5zdGFuY2VvZiByLkJveCkKICAgICAgICAgICAgY29udGludWU7CiAgICAgICAgICBpZiAodHlwZW9mIHRbc10gPiAidSIgfHwgdHlwZW9mIGVbc10gPiAidSIpCiAgICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgICAgaWYgKHR5cGVvZiB0W3NdID09ICJmdW5jdGlvbiIgfHwgdHlwZW9mIGVbc10gPT0gImZ1bmN0aW9uIikKICAgICAgICAgICAgY29udGludWU7CiAgICAgICAgICBpZiAodC5zdWJCb3hOYW1lcyAmJiB0LnN1YkJveE5hbWVzLmluZGV4T2Yocy5zbGljZSgwLCA0KSkgPiAtMSB8fCBlLnN1YkJveE5hbWVzICYmIGUuc3ViQm94TmFtZXMuaW5kZXhPZihzLnNsaWNlKDAsIDQpKSA+IC0xKQogICAgICAgICAgICBjb250aW51ZTsKICAgICAgICAgIGlmIChzID09PSAiZGF0YSIgfHwgcyA9PT0gInN0YXJ0IiB8fCBzID09PSAic2l6ZSIgfHwgcyA9PT0gImNyZWF0aW9uX3RpbWUiIHx8IHMgPT09ICJtb2RpZmljYXRpb25fdGltZSIpCiAgICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgICAgaWYgKHIuRElGRl9QUklNSVRJVkVfQVJSQVlfUFJPUF9OQU1FUy5pbmRleE9mKHMpID4gLTEpCiAgICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgICAgaWYgKHRbc10gIT09IGVbc10pCiAgICAgICAgICAgIHJldHVybiBmYWxzZTsKICAgICAgICB9CiAgICAgIHJldHVybiB0cnVlOwogICAgfSwgci5ib3hFcXVhbCA9IGZ1bmN0aW9uKHQsIGUpIHsKICAgICAgaWYgKCFyLmJveEVxdWFsRmllbGRzKHQsIGUpKQogICAgICAgIHJldHVybiBmYWxzZTsKICAgICAgZm9yICh2YXIgcyA9IDA7IHMgPCByLkRJRkZfQk9YRVNfUFJPUF9OQU1FUy5sZW5ndGg7IHMrKykgewogICAgICAgIHZhciBoID0gci5ESUZGX0JPWEVTX1BST1BfTkFNRVNbc107CiAgICAgICAgaWYgKHRbaF0gJiYgZVtoXSAmJiAhci5ib3hFcXVhbCh0W2hdLCBlW2hdKSkKICAgICAgICAgIHJldHVybiBmYWxzZTsKICAgICAgfQogICAgICByZXR1cm4gdHJ1ZTsKICAgIH07CiAgICB2YXIgYiA9IGZ1bmN0aW9uKCkgewogICAgfTsKICAgIGIucHJvdG90eXBlLnBhcnNlU2FtcGxlID0gZnVuY3Rpb24odCkgewogICAgICB2YXIgZSA9IHt9LCBzOwogICAgICBlLnJlc291cmNlcyA9IFtdOwogICAgICB2YXIgaCA9IG5ldyBvKHQuZGF0YS5idWZmZXIpOwogICAgICBpZiAoIXQuc3Vic2FtcGxlcyB8fCB0LnN1YnNhbXBsZXMubGVuZ3RoID09PSAwKQogICAgICAgIGUuZG9jdW1lbnRTdHJpbmcgPSBoLnJlYWRTdHJpbmcodC5kYXRhLmxlbmd0aCk7CiAgICAgIGVsc2UgaWYgKGUuZG9jdW1lbnRTdHJpbmcgPSBoLnJlYWRTdHJpbmcodC5zdWJzYW1wbGVzWzBdLnNpemUpLCB0LnN1YnNhbXBsZXMubGVuZ3RoID4gMSkKICAgICAgICBmb3IgKHMgPSAxOyBzIDwgdC5zdWJzYW1wbGVzLmxlbmd0aDsgcysrKQogICAgICAgICAgZS5yZXNvdXJjZXNbc10gPSBoLnJlYWRVaW50OEFycmF5KHQuc3Vic2FtcGxlc1tzXS5zaXplKTsKICAgICAgcmV0dXJuIHR5cGVvZiBET01QYXJzZXIgPCAidSIgJiYgKGUuZG9jdW1lbnQgPSBuZXcgRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKGUuZG9jdW1lbnRTdHJpbmcsICJhcHBsaWNhdGlvbi94bWwiKSksIGU7CiAgICB9OwogICAgdmFyIHYgPSBmdW5jdGlvbigpIHsKICAgIH07CiAgICB2LnByb3RvdHlwZS5wYXJzZVNhbXBsZSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUsIHMgPSBuZXcgbyh0LmRhdGEuYnVmZmVyKTsKICAgICAgcmV0dXJuIGUgPSBzLnJlYWRTdHJpbmcodC5kYXRhLmxlbmd0aCksIGU7CiAgICB9LCB2LnByb3RvdHlwZS5wYXJzZUNvbmZpZyA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUsIHMgPSBuZXcgbyh0LmJ1ZmZlcik7CiAgICAgIHJldHVybiBzLnJlYWRVaW50MzIoKSwgZSA9IHMucmVhZENTdHJpbmcoKSwgZTsKICAgIH0sIGQuWE1MU3VidGl0bGVpbjRQYXJzZXIgPSBiLCBkLlRleHRpbjRQYXJzZXIgPSB2OwogICAgdmFyIHkgPSBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuc3RyZWFtID0gdCB8fCBuZXcgZigpLCB0aGlzLmJveGVzID0gW10sIHRoaXMubWRhdHMgPSBbXSwgdGhpcy5tb29mcyA9IFtdLCB0aGlzLmlzUHJvZ3Jlc3NpdmUgPSBmYWxzZSwgdGhpcy5tb292U3RhcnRGb3VuZCA9IGZhbHNlLCB0aGlzLm9uTW9vdlN0YXJ0ID0gbnVsbCwgdGhpcy5tb292U3RhcnRTZW50ID0gZmFsc2UsIHRoaXMub25SZWFkeSA9IG51bGwsIHRoaXMucmVhZHlTZW50ID0gZmFsc2UsIHRoaXMub25TZWdtZW50ID0gbnVsbCwgdGhpcy5vblNhbXBsZXMgPSBudWxsLCB0aGlzLm9uRXJyb3IgPSBudWxsLCB0aGlzLnNhbXBsZUxpc3RCdWlsdCA9IGZhbHNlLCB0aGlzLmZyYWdtZW50ZWRUcmFja3MgPSBbXSwgdGhpcy5leHRyYWN0ZWRUcmFja3MgPSBbXSwgdGhpcy5pc0ZyYWdtZW50YXRpb25Jbml0aWFsaXplZCA9IGZhbHNlLCB0aGlzLnNhbXBsZVByb2Nlc3NpbmdTdGFydGVkID0gZmFsc2UsIHRoaXMubmV4dE1vb2ZOdW1iZXIgPSAwLCB0aGlzLml0ZW1MaXN0QnVpbHQgPSBmYWxzZSwgdGhpcy5vblNpZHggPSBudWxsLCB0aGlzLnNpZHhTZW50ID0gZmFsc2U7CiAgICB9OwogICAgeS5wcm90b3R5cGUuc2V0U2VnbWVudE9wdGlvbnMgPSBmdW5jdGlvbih0LCBlLCBzKSB7CiAgICAgIHZhciBoID0gdGhpcy5nZXRUcmFja0J5SWQodCk7CiAgICAgIGlmIChoKSB7CiAgICAgICAgdmFyIGwgPSB7fTsKICAgICAgICB0aGlzLmZyYWdtZW50ZWRUcmFja3MucHVzaChsKSwgbC5pZCA9IHQsIGwudXNlciA9IGUsIGwudHJhayA9IGgsIGgubmV4dFNhbXBsZSA9IDAsIGwuc2VnbWVudFN0cmVhbSA9IG51bGwsIGwubmJfc2FtcGxlcyA9IDFlMywgbC5yYXBBbGlnbmVtZW50ID0gdHJ1ZSwgcyAmJiAocy5uYlNhbXBsZXMgJiYgKGwubmJfc2FtcGxlcyA9IHMubmJTYW1wbGVzKSwgcy5yYXBBbGlnbmVtZW50ICYmIChsLnJhcEFsaWduZW1lbnQgPSBzLnJhcEFsaWduZW1lbnQpKTsKICAgICAgfQogICAgfSwgeS5wcm90b3R5cGUudW5zZXRTZWdtZW50T3B0aW9ucyA9IGZ1bmN0aW9uKHQpIHsKICAgICAgZm9yICh2YXIgZSA9IC0xLCBzID0gMDsgcyA8IHRoaXMuZnJhZ21lbnRlZFRyYWNrcy5sZW5ndGg7IHMrKykgewogICAgICAgIHZhciBoID0gdGhpcy5mcmFnbWVudGVkVHJhY2tzW3NdOwogICAgICAgIGguaWQgPT0gdCAmJiAoZSA9IHMpOwogICAgICB9CiAgICAgIGUgPiAtMSAmJiB0aGlzLmZyYWdtZW50ZWRUcmFja3Muc3BsaWNlKGUsIDEpOwogICAgfSwgeS5wcm90b3R5cGUuc2V0RXh0cmFjdGlvbk9wdGlvbnMgPSBmdW5jdGlvbih0LCBlLCBzKSB7CiAgICAgIHZhciBoID0gdGhpcy5nZXRUcmFja0J5SWQodCk7CiAgICAgIGlmIChoKSB7CiAgICAgICAgdmFyIGwgPSB7fTsKICAgICAgICB0aGlzLmV4dHJhY3RlZFRyYWNrcy5wdXNoKGwpLCBsLmlkID0gdCwgbC51c2VyID0gZSwgbC50cmFrID0gaCwgaC5uZXh0U2FtcGxlID0gMCwgbC5uYl9zYW1wbGVzID0gMWUzLCBsLnNhbXBsZXMgPSBbXSwgcyAmJiBzLm5iU2FtcGxlcyAmJiAobC5uYl9zYW1wbGVzID0gcy5uYlNhbXBsZXMpOwogICAgICB9CiAgICB9LCB5LnByb3RvdHlwZS51bnNldEV4dHJhY3Rpb25PcHRpb25zID0gZnVuY3Rpb24odCkgewogICAgICBmb3IgKHZhciBlID0gLTEsIHMgPSAwOyBzIDwgdGhpcy5leHRyYWN0ZWRUcmFja3MubGVuZ3RoOyBzKyspIHsKICAgICAgICB2YXIgaCA9IHRoaXMuZXh0cmFjdGVkVHJhY2tzW3NdOwogICAgICAgIGguaWQgPT0gdCAmJiAoZSA9IHMpOwogICAgICB9CiAgICAgIGUgPiAtMSAmJiB0aGlzLmV4dHJhY3RlZFRyYWNrcy5zcGxpY2UoZSwgMSk7CiAgICB9LCB5LnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKCkgewogICAgICB2YXIgdCwgZSwgcyA9IGZhbHNlOwogICAgICBpZiAoISh0aGlzLnJlc3RvcmVQYXJzZVBvc2l0aW9uICYmICF0aGlzLnJlc3RvcmVQYXJzZVBvc2l0aW9uKCkpKQogICAgICAgIGZvciAoOyA7ICkKICAgICAgICAgIGlmICh0aGlzLmhhc0luY29tcGxldGVNZGF0ICYmIHRoaXMuaGFzSW5jb21wbGV0ZU1kYXQoKSkgewogICAgICAgICAgICBpZiAodGhpcy5wcm9jZXNzSW5jb21wbGV0ZU1kYXQoKSkKICAgICAgICAgICAgICBjb250aW51ZTsKICAgICAgICAgICAgcmV0dXJuOwogICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNhdmVQYXJzZVBvc2l0aW9uICYmIHRoaXMuc2F2ZVBhcnNlUG9zaXRpb24oKSwgdCA9IHIucGFyc2VPbmVCb3godGhpcy5zdHJlYW0sIHMpLCB0LmNvZGUgPT09IHIuRVJSX05PVF9FTk9VR0hfREFUQSkKICAgICAgICAgICAgaWYgKHRoaXMucHJvY2Vzc0luY29tcGxldGVCb3gpIHsKICAgICAgICAgICAgICBpZiAodGhpcy5wcm9jZXNzSW5jb21wbGV0ZUJveCh0KSkKICAgICAgICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgICAgICAgIHJldHVybjsKICAgICAgICAgICAgfSBlbHNlCiAgICAgICAgICAgICAgcmV0dXJuOwogICAgICAgICAgZWxzZSB7CiAgICAgICAgICAgIHZhciBoOwogICAgICAgICAgICBzd2l0Y2ggKGUgPSB0LmJveCwgaCA9IGUudHlwZSAhPT0gInV1aWQiID8gZS50eXBlIDogZS51dWlkLCB0aGlzLmJveGVzLnB1c2goZSksIGgpIHsKICAgICAgICAgICAgICBjYXNlICJtZGF0IjoKICAgICAgICAgICAgICAgIHRoaXMubWRhdHMucHVzaChlKTsKICAgICAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgICAgIGNhc2UgIm1vb2YiOgogICAgICAgICAgICAgICAgdGhpcy5tb29mcy5wdXNoKGUpOwogICAgICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICAgICAgY2FzZSAibW9vdiI6CiAgICAgICAgICAgICAgICB0aGlzLm1vb3ZTdGFydEZvdW5kID0gdHJ1ZSwgdGhpcy5tZGF0cy5sZW5ndGggPT09IDAgJiYgKHRoaXMuaXNQcm9ncmVzc2l2ZSA9IHRydWUpOwogICAgICAgICAgICAgIGRlZmF1bHQ6CiAgICAgICAgICAgICAgICB0aGlzW2hdICE9PSB2b2lkIDAgJiYgYS53YXJuKCJJU09GaWxlIiwgIkR1cGxpY2F0ZSBCb3ggb2YgdHlwZTogIiArIGggKyAiLCBvdmVycmlkaW5nIHByZXZpb3VzIG9jY3VycmVuY2UiKSwgdGhpc1toXSA9IGU7CiAgICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgfQogICAgICAgICAgICB0aGlzLnVwZGF0ZVVzZWRCeXRlcyAmJiB0aGlzLnVwZGF0ZVVzZWRCeXRlcyhlLCB0KTsKICAgICAgICAgIH0KICAgIH0sIHkucHJvdG90eXBlLmNoZWNrQnVmZmVyID0gZnVuY3Rpb24odCkgewogICAgICBpZiAodCA9PSBudWxsKQogICAgICAgIHRocm93ICJCdWZmZXIgbXVzdCBiZSBkZWZpbmVkIGFuZCBub24gZW1wdHkiOwogICAgICBpZiAodC5maWxlU3RhcnQgPT09IHZvaWQgMCkKICAgICAgICB0aHJvdyAiQnVmZmVyIG11c3QgaGF2ZSBhIGZpbGVTdGFydCBwcm9wZXJ0eSI7CiAgICAgIHJldHVybiB0LmJ5dGVMZW5ndGggPT09IDAgPyAoYS53YXJuKCJJU09GaWxlIiwgIklnbm9yaW5nIGVtcHR5IGJ1ZmZlciAoZmlsZVN0YXJ0OiAiICsgdC5maWxlU3RhcnQgKyAiKSIpLCB0aGlzLnN0cmVhbS5sb2dCdWZmZXJMZXZlbCgpLCBmYWxzZSkgOiAoYS5pbmZvKCJJU09GaWxlIiwgIlByb2Nlc3NpbmcgYnVmZmVyIChmaWxlU3RhcnQ6ICIgKyB0LmZpbGVTdGFydCArICIpIiksIHQudXNlZEJ5dGVzID0gMCwgdGhpcy5zdHJlYW0uaW5zZXJ0QnVmZmVyKHQpLCB0aGlzLnN0cmVhbS5sb2dCdWZmZXJMZXZlbCgpLCB0aGlzLnN0cmVhbS5pbml0aWFsaXplZCgpID8gdHJ1ZSA6IChhLndhcm4oIklTT0ZpbGUiLCAiTm90IHJlYWR5IHRvIHN0YXJ0IHBhcnNpbmciKSwgZmFsc2UpKTsKICAgIH0sIHkucHJvdG90eXBlLmFwcGVuZEJ1ZmZlciA9IGZ1bmN0aW9uKHQsIGUpIHsKICAgICAgdmFyIHM7CiAgICAgIGlmICh0aGlzLmNoZWNrQnVmZmVyKHQpKQogICAgICAgIHJldHVybiB0aGlzLnBhcnNlKCksIHRoaXMubW9vdlN0YXJ0Rm91bmQgJiYgIXRoaXMubW9vdlN0YXJ0U2VudCAmJiAodGhpcy5tb292U3RhcnRTZW50ID0gdHJ1ZSwgdGhpcy5vbk1vb3ZTdGFydCAmJiB0aGlzLm9uTW9vdlN0YXJ0KCkpLCB0aGlzLm1vb3YgPyAodGhpcy5zYW1wbGVMaXN0QnVpbHQgfHwgKHRoaXMuYnVpbGRTYW1wbGVMaXN0cygpLCB0aGlzLnNhbXBsZUxpc3RCdWlsdCA9IHRydWUpLCB0aGlzLnVwZGF0ZVNhbXBsZUxpc3RzKCksIHRoaXMub25SZWFkeSAmJiAhdGhpcy5yZWFkeVNlbnQgJiYgKHRoaXMucmVhZHlTZW50ID0gdHJ1ZSwgdGhpcy5vblJlYWR5KHRoaXMuZ2V0SW5mbygpKSksIHRoaXMucHJvY2Vzc1NhbXBsZXMoZSksIHRoaXMubmV4dFNlZWtQb3NpdGlvbiA/IChzID0gdGhpcy5uZXh0U2Vla1Bvc2l0aW9uLCB0aGlzLm5leHRTZWVrUG9zaXRpb24gPSB2b2lkIDApIDogcyA9IHRoaXMubmV4dFBhcnNlUG9zaXRpb24sIHRoaXMuc3RyZWFtLmdldEVuZEZpbGVQb3NpdGlvbkFmdGVyICYmIChzID0gdGhpcy5zdHJlYW0uZ2V0RW5kRmlsZVBvc2l0aW9uQWZ0ZXIocykpKSA6IHRoaXMubmV4dFBhcnNlUG9zaXRpb24gPyBzID0gdGhpcy5uZXh0UGFyc2VQb3NpdGlvbiA6IHMgPSAwLCB0aGlzLnNpZHggJiYgdGhpcy5vblNpZHggJiYgIXRoaXMuc2lkeFNlbnQgJiYgKHRoaXMub25TaWR4KHRoaXMuc2lkeCksIHRoaXMuc2lkeFNlbnQgPSB0cnVlKSwgdGhpcy5tZXRhICYmICh0aGlzLmZsYXR0ZW5JdGVtSW5mbyAmJiAhdGhpcy5pdGVtTGlzdEJ1aWx0ICYmICh0aGlzLmZsYXR0ZW5JdGVtSW5mbygpLCB0aGlzLml0ZW1MaXN0QnVpbHQgPSB0cnVlKSwgdGhpcy5wcm9jZXNzSXRlbXMgJiYgdGhpcy5wcm9jZXNzSXRlbXModGhpcy5vbkl0ZW0pKSwgdGhpcy5zdHJlYW0uY2xlYW5CdWZmZXJzICYmIChhLmluZm8oIklTT0ZpbGUiLCAiRG9uZSBwcm9jZXNzaW5nIGJ1ZmZlciAoZmlsZVN0YXJ0OiAiICsgdC5maWxlU3RhcnQgKyAiKSAtIG5leHQgYnVmZmVyIHRvIGZldGNoIHNob3VsZCBoYXZlIGEgZmlsZVN0YXJ0IHBvc2l0aW9uIG9mICIgKyBzKSwgdGhpcy5zdHJlYW0ubG9nQnVmZmVyTGV2ZWwoKSwgdGhpcy5zdHJlYW0uY2xlYW5CdWZmZXJzKCksIHRoaXMuc3RyZWFtLmxvZ0J1ZmZlckxldmVsKHRydWUpLCBhLmluZm8oIklTT0ZpbGUiLCAiU2FtcGxlIGRhdGEgc2l6ZSBpbiBtZW1vcnk6ICIgKyB0aGlzLmdldEFsbG9jYXRlZFNhbXBsZURhdGFTaXplKCkpKSwgczsKICAgIH0sIHkucHJvdG90eXBlLmdldEluZm8gPSBmdW5jdGlvbigpIHsKICAgICAgdmFyIHQsIGUsIHMgPSB7fSwgaCwgbCwgcCwgXywgbSA9ICgvKiBAX19QVVJFX18gKi8gbmV3IERhdGUoIjE5MDQtMDEtMDFUMDA6MDA6MDBaIikpLmdldFRpbWUoKTsKICAgICAgaWYgKHRoaXMubW9vdikKICAgICAgICBmb3IgKHMuaGFzTW9vdiA9IHRydWUsIHMuZHVyYXRpb24gPSB0aGlzLm1vb3YubXZoZC5kdXJhdGlvbiwgcy50aW1lc2NhbGUgPSB0aGlzLm1vb3YubXZoZC50aW1lc2NhbGUsIHMuaXNGcmFnbWVudGVkID0gdGhpcy5tb292Lm12ZXggIT0gbnVsbCwgcy5pc0ZyYWdtZW50ZWQgJiYgdGhpcy5tb292Lm12ZXgubWVoZCAmJiAocy5mcmFnbWVudF9kdXJhdGlvbiA9IHRoaXMubW9vdi5tdmV4Lm1laGQuZnJhZ21lbnRfZHVyYXRpb24pLCBzLmlzUHJvZ3Jlc3NpdmUgPSB0aGlzLmlzUHJvZ3Jlc3NpdmUsIHMuaGFzSU9EID0gdGhpcy5tb292LmlvZHMgIT0gbnVsbCwgcy5icmFuZHMgPSBbXSwgcy5icmFuZHMucHVzaCh0aGlzLmZ0eXAubWFqb3JfYnJhbmQpLCBzLmJyYW5kcyA9IHMuYnJhbmRzLmNvbmNhdCh0aGlzLmZ0eXAuY29tcGF0aWJsZV9icmFuZHMpLCBzLmNyZWF0ZWQgPSBuZXcgRGF0ZShtICsgdGhpcy5tb292Lm12aGQuY3JlYXRpb25fdGltZSAqIDFlMyksIHMubW9kaWZpZWQgPSBuZXcgRGF0ZShtICsgdGhpcy5tb292Lm12aGQubW9kaWZpY2F0aW9uX3RpbWUgKiAxZTMpLCBzLnRyYWNrcyA9IFtdLCBzLmF1ZGlvVHJhY2tzID0gW10sIHMudmlkZW9UcmFja3MgPSBbXSwgcy5zdWJ0aXRsZVRyYWNrcyA9IFtdLCBzLm1ldGFkYXRhVHJhY2tzID0gW10sIHMuaGludFRyYWNrcyA9IFtdLCBzLm90aGVyVHJhY2tzID0gW10sIHQgPSAwOyB0IDwgdGhpcy5tb292LnRyYWtzLmxlbmd0aDsgdCsrKSB7CiAgICAgICAgICBpZiAoaCA9IHRoaXMubW9vdi50cmFrc1t0XSwgXyA9IGgubWRpYS5taW5mLnN0Ymwuc3RzZC5lbnRyaWVzWzBdLCBsID0ge30sIHMudHJhY2tzLnB1c2gobCksIGwuaWQgPSBoLnRraGQudHJhY2tfaWQsIGwubmFtZSA9IGgubWRpYS5oZGxyLm5hbWUsIGwucmVmZXJlbmNlcyA9IFtdLCBoLnRyZWYpCiAgICAgICAgICAgIGZvciAoZSA9IDA7IGUgPCBoLnRyZWYuYm94ZXMubGVuZ3RoOyBlKyspCiAgICAgICAgICAgICAgcCA9IHt9LCBsLnJlZmVyZW5jZXMucHVzaChwKSwgcC50eXBlID0gaC50cmVmLmJveGVzW2VdLnR5cGUsIHAudHJhY2tfaWRzID0gaC50cmVmLmJveGVzW2VdLnRyYWNrX2lkczsKICAgICAgICAgIGguZWR0cyAmJiAobC5lZGl0cyA9IGguZWR0cy5lbHN0LmVudHJpZXMpLCBsLmNyZWF0ZWQgPSBuZXcgRGF0ZShtICsgaC50a2hkLmNyZWF0aW9uX3RpbWUgKiAxZTMpLCBsLm1vZGlmaWVkID0gbmV3IERhdGUobSArIGgudGtoZC5tb2RpZmljYXRpb25fdGltZSAqIDFlMyksIGwubW92aWVfZHVyYXRpb24gPSBoLnRraGQuZHVyYXRpb24sIGwubW92aWVfdGltZXNjYWxlID0gcy50aW1lc2NhbGUsIGwubGF5ZXIgPSBoLnRraGQubGF5ZXIsIGwuYWx0ZXJuYXRlX2dyb3VwID0gaC50a2hkLmFsdGVybmF0ZV9ncm91cCwgbC52b2x1bWUgPSBoLnRraGQudm9sdW1lLCBsLm1hdHJpeCA9IGgudGtoZC5tYXRyaXgsIGwudHJhY2tfd2lkdGggPSBoLnRraGQud2lkdGggLyA2NTUzNiwgbC50cmFja19oZWlnaHQgPSBoLnRraGQuaGVpZ2h0IC8gNjU1MzYsIGwudGltZXNjYWxlID0gaC5tZGlhLm1kaGQudGltZXNjYWxlLCBsLmN0c19zaGlmdCA9IGgubWRpYS5taW5mLnN0YmwuY3NsZywgbC5kdXJhdGlvbiA9IGgubWRpYS5tZGhkLmR1cmF0aW9uLCBsLnNhbXBsZXNfZHVyYXRpb24gPSBoLnNhbXBsZXNfZHVyYXRpb24sIGwuY29kZWMgPSBfLmdldENvZGVjKCksIGwua2luZCA9IGgudWR0YSAmJiBoLnVkdGEua2luZHMubGVuZ3RoID8gaC51ZHRhLmtpbmRzWzBdIDogeyBzY2hlbWVVUkk6ICIiLCB2YWx1ZTogIiIgfSwgbC5sYW5ndWFnZSA9IGgubWRpYS5lbG5nID8gaC5tZGlhLmVsbmcuZXh0ZW5kZWRfbGFuZ3VhZ2UgOiBoLm1kaWEubWRoZC5sYW5ndWFnZVN0cmluZywgbC5uYl9zYW1wbGVzID0gaC5zYW1wbGVzLmxlbmd0aCwgbC5zaXplID0gaC5zYW1wbGVzX3NpemUsIGwuYml0cmF0ZSA9IGwuc2l6ZSAqIDggKiBsLnRpbWVzY2FsZSAvIGwuc2FtcGxlc19kdXJhdGlvbiwgXy5pc0F1ZGlvKCkgPyAobC50eXBlID0gImF1ZGlvIiwgcy5hdWRpb1RyYWNrcy5wdXNoKGwpLCBsLmF1ZGlvID0ge30sIGwuYXVkaW8uc2FtcGxlX3JhdGUgPSBfLmdldFNhbXBsZVJhdGUoKSwgbC5hdWRpby5jaGFubmVsX2NvdW50ID0gXy5nZXRDaGFubmVsQ291bnQoKSwgbC5hdWRpby5zYW1wbGVfc2l6ZSA9IF8uZ2V0U2FtcGxlU2l6ZSgpKSA6IF8uaXNWaWRlbygpID8gKGwudHlwZSA9ICJ2aWRlbyIsIHMudmlkZW9UcmFja3MucHVzaChsKSwgbC52aWRlbyA9IHt9LCBsLnZpZGVvLndpZHRoID0gXy5nZXRXaWR0aCgpLCBsLnZpZGVvLmhlaWdodCA9IF8uZ2V0SGVpZ2h0KCkpIDogXy5pc1N1YnRpdGxlKCkgPyAobC50eXBlID0gInN1YnRpdGxlcyIsIHMuc3VidGl0bGVUcmFja3MucHVzaChsKSkgOiBfLmlzSGludCgpID8gKGwudHlwZSA9ICJtZXRhZGF0YSIsIHMuaGludFRyYWNrcy5wdXNoKGwpKSA6IF8uaXNNZXRhZGF0YSgpID8gKGwudHlwZSA9ICJtZXRhZGF0YSIsIHMubWV0YWRhdGFUcmFja3MucHVzaChsKSkgOiAobC50eXBlID0gIm1ldGFkYXRhIiwgcy5vdGhlclRyYWNrcy5wdXNoKGwpKTsKICAgICAgICB9CiAgICAgIGVsc2UKICAgICAgICBzLmhhc01vb3YgPSBmYWxzZTsKICAgICAgaWYgKHMubWltZSA9ICIiLCBzLmhhc01vb3YgJiYgcy50cmFja3MpIHsKICAgICAgICBmb3IgKHMudmlkZW9UcmFja3MgJiYgcy52aWRlb1RyYWNrcy5sZW5ndGggPiAwID8gcy5taW1lICs9ICd2aWRlby9tcDQ7IGNvZGVjcz0iJyA6IHMuYXVkaW9UcmFja3MgJiYgcy5hdWRpb1RyYWNrcy5sZW5ndGggPiAwID8gcy5taW1lICs9ICdhdWRpby9tcDQ7IGNvZGVjcz0iJyA6IHMubWltZSArPSAnYXBwbGljYXRpb24vbXA0OyBjb2RlY3M9IicsIHQgPSAwOyB0IDwgcy50cmFja3MubGVuZ3RoOyB0KyspCiAgICAgICAgICB0ICE9PSAwICYmIChzLm1pbWUgKz0gIiwiKSwgcy5taW1lICs9IHMudHJhY2tzW3RdLmNvZGVjOwogICAgICAgIHMubWltZSArPSAnIjsgcHJvZmlsZXM9IicsIHMubWltZSArPSB0aGlzLmZ0eXAuY29tcGF0aWJsZV9icmFuZHMuam9pbigpLCBzLm1pbWUgKz0gJyInOwogICAgICB9CiAgICAgIHJldHVybiBzOwogICAgfSwgeS5wcm90b3R5cGUuc2V0TmV4dFNlZWtQb3NpdGlvbkZyb21TYW1wbGUgPSBmdW5jdGlvbih0KSB7CiAgICAgIHQgJiYgKHRoaXMubmV4dFNlZWtQb3NpdGlvbiA/IHRoaXMubmV4dFNlZWtQb3NpdGlvbiA9IE1hdGgubWluKHQub2Zmc2V0ICsgdC5hbHJlYWR5UmVhZCwgdGhpcy5uZXh0U2Vla1Bvc2l0aW9uKSA6IHRoaXMubmV4dFNlZWtQb3NpdGlvbiA9IHQub2Zmc2V0ICsgdC5hbHJlYWR5UmVhZCk7CiAgICB9LCB5LnByb3RvdHlwZS5wcm9jZXNzU2FtcGxlcyA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUsIHM7CiAgICAgIGlmICh0aGlzLnNhbXBsZVByb2Nlc3NpbmdTdGFydGVkKSB7CiAgICAgICAgaWYgKHRoaXMuaXNGcmFnbWVudGF0aW9uSW5pdGlhbGl6ZWQgJiYgdGhpcy5vblNlZ21lbnQgIT09IG51bGwpCiAgICAgICAgICBmb3IgKGUgPSAwOyBlIDwgdGhpcy5mcmFnbWVudGVkVHJhY2tzLmxlbmd0aDsgZSsrKSB7CiAgICAgICAgICAgIHZhciBoID0gdGhpcy5mcmFnbWVudGVkVHJhY2tzW2VdOwogICAgICAgICAgICBmb3IgKHMgPSBoLnRyYWs7IHMubmV4dFNhbXBsZSA8IHMuc2FtcGxlcy5sZW5ndGggJiYgdGhpcy5zYW1wbGVQcm9jZXNzaW5nU3RhcnRlZDsgKSB7CiAgICAgICAgICAgICAgYS5kZWJ1ZygiSVNPRmlsZSIsICJDcmVhdGluZyBtZWRpYSBmcmFnbWVudCBvbiB0cmFjayAjIiArIGguaWQgKyAiIGZvciBzYW1wbGUgIiArIHMubmV4dFNhbXBsZSk7CiAgICAgICAgICAgICAgdmFyIGwgPSB0aGlzLmNyZWF0ZUZyYWdtZW50KGguaWQsIHMubmV4dFNhbXBsZSwgaC5zZWdtZW50U3RyZWFtKTsKICAgICAgICAgICAgICBpZiAobCkKICAgICAgICAgICAgICAgIGguc2VnbWVudFN0cmVhbSA9IGwsIHMubmV4dFNhbXBsZSsrOwogICAgICAgICAgICAgIGVsc2UKICAgICAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgICAgIGlmICgocy5uZXh0U2FtcGxlICUgaC5uYl9zYW1wbGVzID09PSAwIHx8IHQgfHwgcy5uZXh0U2FtcGxlID49IHMuc2FtcGxlcy5sZW5ndGgpICYmIChhLmluZm8oIklTT0ZpbGUiLCAiU2VuZGluZyBmcmFnbWVudGVkIGRhdGEgb24gdHJhY2sgIyIgKyBoLmlkICsgIiBmb3Igc2FtcGxlcyBbIiArIE1hdGgubWF4KDAsIHMubmV4dFNhbXBsZSAtIGgubmJfc2FtcGxlcykgKyAiLCIgKyAocy5uZXh0U2FtcGxlIC0gMSkgKyAiXSIpLCBhLmluZm8oIklTT0ZpbGUiLCAiU2FtcGxlIGRhdGEgc2l6ZSBpbiBtZW1vcnk6ICIgKyB0aGlzLmdldEFsbG9jYXRlZFNhbXBsZURhdGFTaXplKCkpLCB0aGlzLm9uU2VnbWVudCAmJiB0aGlzLm9uU2VnbWVudChoLmlkLCBoLnVzZXIsIGguc2VnbWVudFN0cmVhbS5idWZmZXIsIHMubmV4dFNhbXBsZSwgdCB8fCBzLm5leHRTYW1wbGUgPj0gcy5zYW1wbGVzLmxlbmd0aCksIGguc2VnbWVudFN0cmVhbSA9IG51bGwsIGggIT09IHRoaXMuZnJhZ21lbnRlZFRyYWNrc1tlXSkpCiAgICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgfQogICAgICAgICAgfQogICAgICAgIGlmICh0aGlzLm9uU2FtcGxlcyAhPT0gbnVsbCkKICAgICAgICAgIGZvciAoZSA9IDA7IGUgPCB0aGlzLmV4dHJhY3RlZFRyYWNrcy5sZW5ndGg7IGUrKykgewogICAgICAgICAgICB2YXIgcCA9IHRoaXMuZXh0cmFjdGVkVHJhY2tzW2VdOwogICAgICAgICAgICBmb3IgKHMgPSBwLnRyYWs7IHMubmV4dFNhbXBsZSA8IHMuc2FtcGxlcy5sZW5ndGggJiYgdGhpcy5zYW1wbGVQcm9jZXNzaW5nU3RhcnRlZDsgKSB7CiAgICAgICAgICAgICAgYS5kZWJ1ZygiSVNPRmlsZSIsICJFeHBvcnRpbmcgb24gdHJhY2sgIyIgKyBwLmlkICsgIiBzYW1wbGUgIyIgKyBzLm5leHRTYW1wbGUpOwogICAgICAgICAgICAgIHZhciBfID0gdGhpcy5nZXRTYW1wbGUocywgcy5uZXh0U2FtcGxlKTsKICAgICAgICAgICAgICBpZiAoXykKICAgICAgICAgICAgICAgIHMubmV4dFNhbXBsZSsrLCBwLnNhbXBsZXMucHVzaChfKTsKICAgICAgICAgICAgICBlbHNlIHsKICAgICAgICAgICAgICAgIHRoaXMuc2V0TmV4dFNlZWtQb3NpdGlvbkZyb21TYW1wbGUocy5zYW1wbGVzW3MubmV4dFNhbXBsZV0pOwogICAgICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIGlmICgocy5uZXh0U2FtcGxlICUgcC5uYl9zYW1wbGVzID09PSAwIHx8IHMubmV4dFNhbXBsZSA+PSBzLnNhbXBsZXMubGVuZ3RoKSAmJiAoYS5kZWJ1ZygiSVNPRmlsZSIsICJTZW5kaW5nIHNhbXBsZXMgb24gdHJhY2sgIyIgKyBwLmlkICsgIiBmb3Igc2FtcGxlICIgKyBzLm5leHRTYW1wbGUpLCB0aGlzLm9uU2FtcGxlcyAmJiB0aGlzLm9uU2FtcGxlcyhwLmlkLCBwLnVzZXIsIHAuc2FtcGxlcyksIHAuc2FtcGxlcyA9IFtdLCBwICE9PSB0aGlzLmV4dHJhY3RlZFRyYWNrc1tlXSkpCiAgICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgfQogICAgICAgICAgfQogICAgICB9CiAgICB9LCB5LnByb3RvdHlwZS5nZXRCb3ggPSBmdW5jdGlvbih0KSB7CiAgICAgIHZhciBlID0gdGhpcy5nZXRCb3hlcyh0LCB0cnVlKTsKICAgICAgcmV0dXJuIGUubGVuZ3RoID8gZVswXSA6IG51bGw7CiAgICB9LCB5LnByb3RvdHlwZS5nZXRCb3hlcyA9IGZ1bmN0aW9uKHQsIGUpIHsKICAgICAgdmFyIHMgPSBbXTsKICAgICAgcmV0dXJuIHkuX3N3ZWVwLmNhbGwodGhpcywgdCwgcywgZSksIHM7CiAgICB9LCB5Ll9zd2VlcCA9IGZ1bmN0aW9uKHQsIGUsIHMpIHsKICAgICAgdGhpcy50eXBlICYmIHRoaXMudHlwZSA9PSB0ICYmIGUucHVzaCh0aGlzKTsKICAgICAgZm9yICh2YXIgaCBpbiB0aGlzLmJveGVzKSB7CiAgICAgICAgaWYgKGUubGVuZ3RoICYmIHMpCiAgICAgICAgICByZXR1cm47CiAgICAgICAgeS5fc3dlZXAuY2FsbCh0aGlzLmJveGVzW2hdLCB0LCBlLCBzKTsKICAgICAgfQogICAgfSwgeS5wcm90b3R5cGUuZ2V0VHJhY2tTYW1wbGVzSW5mbyA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUgPSB0aGlzLmdldFRyYWNrQnlJZCh0KTsKICAgICAgaWYgKGUpCiAgICAgICAgcmV0dXJuIGUuc2FtcGxlczsKICAgIH0sIHkucHJvdG90eXBlLmdldFRyYWNrU2FtcGxlID0gZnVuY3Rpb24odCwgZSkgewogICAgICB2YXIgcyA9IHRoaXMuZ2V0VHJhY2tCeUlkKHQpLCBoID0gdGhpcy5nZXRTYW1wbGUocywgZSk7CiAgICAgIHJldHVybiBoOwogICAgfSwgeS5wcm90b3R5cGUucmVsZWFzZVVzZWRTYW1wbGVzID0gZnVuY3Rpb24odCwgZSkgewogICAgICB2YXIgcyA9IDAsIGggPSB0aGlzLmdldFRyYWNrQnlJZCh0KTsKICAgICAgaC5sYXN0VmFsaWRTYW1wbGUgfHwgKGgubGFzdFZhbGlkU2FtcGxlID0gMCk7CiAgICAgIGZvciAodmFyIGwgPSBoLmxhc3RWYWxpZFNhbXBsZTsgbCA8IGU7IGwrKykKICAgICAgICBzICs9IHRoaXMucmVsZWFzZVNhbXBsZShoLCBsKTsKICAgICAgYS5pbmZvKCJJU09GaWxlIiwgIlRyYWNrICMiICsgdCArICIgcmVsZWFzZWQgc2FtcGxlcyB1cCB0byAiICsgZSArICIgKHJlbGVhc2VkIHNpemU6ICIgKyBzICsgIiwgcmVtYWluaW5nOiAiICsgdGhpcy5zYW1wbGVzRGF0YVNpemUgKyAiKSIpLCBoLmxhc3RWYWxpZFNhbXBsZSA9IGU7CiAgICB9LCB5LnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKCkgewogICAgICB0aGlzLnNhbXBsZVByb2Nlc3NpbmdTdGFydGVkID0gdHJ1ZSwgdGhpcy5wcm9jZXNzU2FtcGxlcyhmYWxzZSk7CiAgICB9LCB5LnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24oKSB7CiAgICAgIHRoaXMuc2FtcGxlUHJvY2Vzc2luZ1N0YXJ0ZWQgPSBmYWxzZTsKICAgIH0sIHkucHJvdG90eXBlLmZsdXNoID0gZnVuY3Rpb24oKSB7CiAgICAgIGEuaW5mbygiSVNPRmlsZSIsICJGbHVzaGluZyByZW1haW5pbmcgc2FtcGxlcyIpLCB0aGlzLnVwZGF0ZVNhbXBsZUxpc3RzKCksIHRoaXMucHJvY2Vzc1NhbXBsZXModHJ1ZSksIHRoaXMuc3RyZWFtLmNsZWFuQnVmZmVycygpLCB0aGlzLnN0cmVhbS5sb2dCdWZmZXJMZXZlbCh0cnVlKTsKICAgIH0sIHkucHJvdG90eXBlLnNlZWtUcmFjayA9IGZ1bmN0aW9uKHQsIGUsIHMpIHsKICAgICAgdmFyIGgsIGwsIHAgPSAxIC8gMCwgXyA9IDAsIG0gPSAwLCB3OwogICAgICBpZiAocy5zYW1wbGVzLmxlbmd0aCA9PT0gMCkKICAgICAgICByZXR1cm4gYS5pbmZvKCJJU09GaWxlIiwgIk5vIHNhbXBsZSBpbiB0cmFjaywgY2Fubm90IHNlZWshIFVzaW5nIHRpbWUgIiArIGEuZ2V0RHVyYXRpb25TdHJpbmcoMCwgMSkgKyAiIGFuZCBvZmZzZXQ6IDAiKSwgeyBvZmZzZXQ6IDAsIHRpbWU6IDAgfTsKICAgICAgZm9yIChoID0gMDsgaCA8IHMuc2FtcGxlcy5sZW5ndGg7IGgrKykgewogICAgICAgIGlmIChsID0gcy5zYW1wbGVzW2hdLCBoID09PSAwKQogICAgICAgICAgbSA9IDAsIHcgPSBsLnRpbWVzY2FsZTsKICAgICAgICBlbHNlIGlmIChsLmN0cyA+IHQgKiBsLnRpbWVzY2FsZSkgewogICAgICAgICAgbSA9IGggLSAxOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgfQogICAgICAgIGUgJiYgbC5pc19zeW5jICYmIChfID0gaCk7CiAgICAgIH0KICAgICAgZm9yIChlICYmIChtID0gXyksIHQgPSBzLnNhbXBsZXNbbV0uY3RzLCBzLm5leHRTYW1wbGUgPSBtOyBzLnNhbXBsZXNbbV0uYWxyZWFkeVJlYWQgPT09IHMuc2FtcGxlc1ttXS5zaXplICYmIHMuc2FtcGxlc1ttICsgMV07ICkKICAgICAgICBtKys7CiAgICAgIHJldHVybiBwID0gcy5zYW1wbGVzW21dLm9mZnNldCArIHMuc2FtcGxlc1ttXS5hbHJlYWR5UmVhZCwgYS5pbmZvKCJJU09GaWxlIiwgIlNlZWtpbmcgdG8gIiArIChlID8gIlJBUCIgOiAiIikgKyAiIHNhbXBsZSAjIiArIHMubmV4dFNhbXBsZSArICIgb24gdHJhY2sgIiArIHMudGtoZC50cmFja19pZCArICIsIHRpbWUgIiArIGEuZ2V0RHVyYXRpb25TdHJpbmcodCwgdykgKyAiIGFuZCBvZmZzZXQ6ICIgKyBwKSwgeyBvZmZzZXQ6IHAsIHRpbWU6IHQgLyB3IH07CiAgICB9LCB5LnByb3RvdHlwZS5nZXRUcmFja0R1cmF0aW9uID0gZnVuY3Rpb24odCkgewogICAgICB2YXIgZTsKICAgICAgcmV0dXJuIHQuc2FtcGxlcyA/IChlID0gdC5zYW1wbGVzW3Quc2FtcGxlcy5sZW5ndGggLSAxXSwgKGUuY3RzICsgZS5kdXJhdGlvbikgLyBlLnRpbWVzY2FsZSkgOiAxIC8gMDsKICAgIH0sIHkucHJvdG90eXBlLnNlZWsgPSBmdW5jdGlvbih0LCBlKSB7CiAgICAgIHZhciBzID0gdGhpcy5tb292LCBoLCBsLCBwLCBfID0geyBvZmZzZXQ6IDEgLyAwLCB0aW1lOiAxIC8gMCB9OwogICAgICBpZiAodGhpcy5tb292KSB7CiAgICAgICAgZm9yIChwID0gMDsgcCA8IHMudHJha3MubGVuZ3RoOyBwKyspCiAgICAgICAgICBoID0gcy50cmFrc1twXSwgISh0ID4gdGhpcy5nZXRUcmFja0R1cmF0aW9uKGgpKSAmJiAobCA9IHRoaXMuc2Vla1RyYWNrKHQsIGUsIGgpLCBsLm9mZnNldCA8IF8ub2Zmc2V0ICYmIChfLm9mZnNldCA9IGwub2Zmc2V0KSwgbC50aW1lIDwgXy50aW1lICYmIChfLnRpbWUgPSBsLnRpbWUpKTsKICAgICAgICByZXR1cm4gYS5pbmZvKCJJU09GaWxlIiwgIlNlZWtpbmcgYXQgdGltZSAiICsgYS5nZXREdXJhdGlvblN0cmluZyhfLnRpbWUsIDEpICsgIiBuZWVkcyBhIGJ1ZmZlciB3aXRoIGEgZmlsZVN0YXJ0IHBvc2l0aW9uIG9mICIgKyBfLm9mZnNldCksIF8ub2Zmc2V0ID09PSAxIC8gMCA/IF8gPSB7IG9mZnNldDogdGhpcy5uZXh0UGFyc2VQb3NpdGlvbiwgdGltZTogMCB9IDogXy5vZmZzZXQgPSB0aGlzLnN0cmVhbS5nZXRFbmRGaWxlUG9zaXRpb25BZnRlcihfLm9mZnNldCksIGEuaW5mbygiSVNPRmlsZSIsICJBZGp1c3RlZCBzZWVrIHBvc2l0aW9uIChhZnRlciBjaGVja2luZyBkYXRhIGFscmVhZHkgaW4gYnVmZmVyKTogIiArIF8ub2Zmc2V0KSwgXzsKICAgICAgfSBlbHNlCiAgICAgICAgdGhyb3cgIkNhbm5vdCBzZWVrOiBtb292IG5vdCByZWNlaXZlZCEiOwogICAgfSwgeS5wcm90b3R5cGUuZXF1YWwgPSBmdW5jdGlvbih0KSB7CiAgICAgIGZvciAodmFyIGUgPSAwOyBlIDwgdGhpcy5ib3hlcy5sZW5ndGggJiYgZSA8IHQuYm94ZXMubGVuZ3RoOyApIHsKICAgICAgICB2YXIgcyA9IHRoaXMuYm94ZXNbZV0sIGggPSB0LmJveGVzW2VdOwogICAgICAgIGlmICghci5ib3hFcXVhbChzLCBoKSkKICAgICAgICAgIHJldHVybiBmYWxzZTsKICAgICAgICBlKys7CiAgICAgIH0KICAgICAgcmV0dXJuIHRydWU7CiAgICB9LCBkLklTT0ZpbGUgPSB5LCB5LnByb3RvdHlwZS5sYXN0Qm94U3RhcnRQb3NpdGlvbiA9IDAsIHkucHJvdG90eXBlLnBhcnNpbmdNZGF0ID0gbnVsbCwgeS5wcm90b3R5cGUubmV4dFBhcnNlUG9zaXRpb24gPSAwLCB5LnByb3RvdHlwZS5kaXNjYXJkTWRhdERhdGEgPSBmYWxzZSwgeS5wcm90b3R5cGUucHJvY2Vzc0luY29tcGxldGVCb3ggPSBmdW5jdGlvbih0KSB7CiAgICAgIHZhciBlLCBzLCBoOwogICAgICByZXR1cm4gdC50eXBlID09PSAibWRhdCIgPyAoZSA9IG5ldyByW3QudHlwZSArICJCb3giXSh0LnNpemUpLCB0aGlzLnBhcnNpbmdNZGF0ID0gZSwgdGhpcy5ib3hlcy5wdXNoKGUpLCB0aGlzLm1kYXRzLnB1c2goZSksIGUuc3RhcnQgPSB0LnN0YXJ0LCBlLmhkcl9zaXplID0gdC5oZHJfc2l6ZSwgdGhpcy5zdHJlYW0uYWRkVXNlZEJ5dGVzKGUuaGRyX3NpemUpLCB0aGlzLmxhc3RCb3hTdGFydFBvc2l0aW9uID0gZS5zdGFydCArIGUuc2l6ZSwgaCA9IHRoaXMuc3RyZWFtLnNlZWsoZS5zdGFydCArIGUuc2l6ZSwgZmFsc2UsIHRoaXMuZGlzY2FyZE1kYXREYXRhKSwgaCA/ICh0aGlzLnBhcnNpbmdNZGF0ID0gbnVsbCwgdHJ1ZSkgOiAodGhpcy5tb292U3RhcnRGb3VuZCA/IHRoaXMubmV4dFBhcnNlUG9zaXRpb24gPSB0aGlzLnN0cmVhbS5maW5kRW5kQ29udGlndW91c0J1ZigpIDogdGhpcy5uZXh0UGFyc2VQb3NpdGlvbiA9IGUuc3RhcnQgKyBlLnNpemUsIGZhbHNlKSkgOiAodC50eXBlID09PSAibW9vdiIgJiYgKHRoaXMubW9vdlN0YXJ0Rm91bmQgPSB0cnVlLCB0aGlzLm1kYXRzLmxlbmd0aCA9PT0gMCAmJiAodGhpcy5pc1Byb2dyZXNzaXZlID0gdHJ1ZSkpLCBzID0gdGhpcy5zdHJlYW0ubWVyZ2VOZXh0QnVmZmVyID8gdGhpcy5zdHJlYW0ubWVyZ2VOZXh0QnVmZmVyKCkgOiBmYWxzZSwgcyA/ICh0aGlzLm5leHRQYXJzZVBvc2l0aW9uID0gdGhpcy5zdHJlYW0uZ2V0RW5kUG9zaXRpb24oKSwgdHJ1ZSkgOiAodC50eXBlID8gdGhpcy5tb292U3RhcnRGb3VuZCA/IHRoaXMubmV4dFBhcnNlUG9zaXRpb24gPSB0aGlzLnN0cmVhbS5nZXRFbmRQb3NpdGlvbigpIDogdGhpcy5uZXh0UGFyc2VQb3NpdGlvbiA9IHRoaXMuc3RyZWFtLmdldFBvc2l0aW9uKCkgKyB0LnNpemUgOiB0aGlzLm5leHRQYXJzZVBvc2l0aW9uID0gdGhpcy5zdHJlYW0uZ2V0RW5kUG9zaXRpb24oKSwgZmFsc2UpKTsKICAgIH0sIHkucHJvdG90eXBlLmhhc0luY29tcGxldGVNZGF0ID0gZnVuY3Rpb24oKSB7CiAgICAgIHJldHVybiB0aGlzLnBhcnNpbmdNZGF0ICE9PSBudWxsOwogICAgfSwgeS5wcm90b3R5cGUucHJvY2Vzc0luY29tcGxldGVNZGF0ID0gZnVuY3Rpb24oKSB7CiAgICAgIHZhciB0LCBlOwogICAgICByZXR1cm4gdCA9IHRoaXMucGFyc2luZ01kYXQsIGUgPSB0aGlzLnN0cmVhbS5zZWVrKHQuc3RhcnQgKyB0LnNpemUsIGZhbHNlLCB0aGlzLmRpc2NhcmRNZGF0RGF0YSksIGUgPyAoYS5kZWJ1ZygiSVNPRmlsZSIsICJGb3VuZCAnbWRhdCcgZW5kIGluIGJ1ZmZlcmVkIGRhdGEiKSwgdGhpcy5wYXJzaW5nTWRhdCA9IG51bGwsIHRydWUpIDogKHRoaXMubmV4dFBhcnNlUG9zaXRpb24gPSB0aGlzLnN0cmVhbS5maW5kRW5kQ29udGlndW91c0J1ZigpLCBmYWxzZSk7CiAgICB9LCB5LnByb3RvdHlwZS5yZXN0b3JlUGFyc2VQb3NpdGlvbiA9IGZ1bmN0aW9uKCkgewogICAgICByZXR1cm4gdGhpcy5zdHJlYW0uc2Vlayh0aGlzLmxhc3RCb3hTdGFydFBvc2l0aW9uLCB0cnVlLCB0aGlzLmRpc2NhcmRNZGF0RGF0YSk7CiAgICB9LCB5LnByb3RvdHlwZS5zYXZlUGFyc2VQb3NpdGlvbiA9IGZ1bmN0aW9uKCkgewogICAgICB0aGlzLmxhc3RCb3hTdGFydFBvc2l0aW9uID0gdGhpcy5zdHJlYW0uZ2V0UG9zaXRpb24oKTsKICAgIH0sIHkucHJvdG90eXBlLnVwZGF0ZVVzZWRCeXRlcyA9IGZ1bmN0aW9uKHQsIGUpIHsKICAgICAgdGhpcy5zdHJlYW0uYWRkVXNlZEJ5dGVzICYmICh0LnR5cGUgPT09ICJtZGF0IiA/ICh0aGlzLnN0cmVhbS5hZGRVc2VkQnl0ZXModC5oZHJfc2l6ZSksIHRoaXMuZGlzY2FyZE1kYXREYXRhICYmIHRoaXMuc3RyZWFtLmFkZFVzZWRCeXRlcyh0LnNpemUgLSB0Lmhkcl9zaXplKSkgOiB0aGlzLnN0cmVhbS5hZGRVc2VkQnl0ZXModC5zaXplKSk7CiAgICB9LCB5LnByb3RvdHlwZS5hZGQgPSByLkJveC5wcm90b3R5cGUuYWRkLCB5LnByb3RvdHlwZS5hZGRCb3ggPSByLkJveC5wcm90b3R5cGUuYWRkQm94LCB5LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24odCkgewogICAgICB2YXIgZSA9IHQgfHwge307CiAgICAgIHRoaXMuYWRkKCJmdHlwIikuc2V0KCJtYWpvcl9icmFuZCIsIGUuYnJhbmRzICYmIGUuYnJhbmRzWzBdIHx8ICJpc280Iikuc2V0KCJtaW5vcl92ZXJzaW9uIiwgMCkuc2V0KCJjb21wYXRpYmxlX2JyYW5kcyIsIGUuYnJhbmRzIHx8IFsiaXNvNCJdKTsKICAgICAgdmFyIHMgPSB0aGlzLmFkZCgibW9vdiIpOwogICAgICByZXR1cm4gcy5hZGQoIm12aGQiKS5zZXQoInRpbWVzY2FsZSIsIGUudGltZXNjYWxlIHx8IDYwMCkuc2V0KCJyYXRlIiwgZS5yYXRlIHx8IDY1NTM2KS5zZXQoImNyZWF0aW9uX3RpbWUiLCAwKS5zZXQoIm1vZGlmaWNhdGlvbl90aW1lIiwgMCkuc2V0KCJkdXJhdGlvbiIsIGUuZHVyYXRpb24gfHwgMCkuc2V0KCJ2b2x1bWUiLCBlLndpZHRoID8gMCA6IDI1Nikuc2V0KCJtYXRyaXgiLCBbNjU1MzYsIDAsIDAsIDAsIDY1NTM2LCAwLCAwLCAwLCAxMDczNzQxODI0XSkuc2V0KCJuZXh0X3RyYWNrX2lkIiwgMSksIHMuYWRkKCJtdmV4IiksIHRoaXM7CiAgICB9LCB5LnByb3RvdHlwZS5hZGRUcmFjayA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5tb292IHx8IHRoaXMuaW5pdCh0KTsKICAgICAgdmFyIGUgPSB0IHx8IHt9OwogICAgICBlLndpZHRoID0gZS53aWR0aCB8fCAzMjAsIGUuaGVpZ2h0ID0gZS5oZWlnaHQgfHwgMzIwLCBlLmlkID0gZS5pZCB8fCB0aGlzLm1vb3YubXZoZC5uZXh0X3RyYWNrX2lkLCBlLnR5cGUgPSBlLnR5cGUgfHwgImF2YzEiOwogICAgICB2YXIgcyA9IHRoaXMubW9vdi5hZGQoInRyYWsiKTsKICAgICAgdGhpcy5tb292Lm12aGQubmV4dF90cmFja19pZCA9IGUuaWQgKyAxLCBzLmFkZCgidGtoZCIpLnNldCgiZmxhZ3MiLCByLlRLSERfRkxBR19FTkFCTEVEIHwgci5US0hEX0ZMQUdfSU5fTU9WSUUgfCByLlRLSERfRkxBR19JTl9QUkVWSUVXKS5zZXQoImNyZWF0aW9uX3RpbWUiLCAwKS5zZXQoIm1vZGlmaWNhdGlvbl90aW1lIiwgMCkuc2V0KCJ0cmFja19pZCIsIGUuaWQpLnNldCgiZHVyYXRpb24iLCBlLmR1cmF0aW9uIHx8IDApLnNldCgibGF5ZXIiLCBlLmxheWVyIHx8IDApLnNldCgiYWx0ZXJuYXRlX2dyb3VwIiwgMCkuc2V0KCJ2b2x1bWUiLCAxKS5zZXQoIm1hdHJpeCIsIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSkuc2V0KCJ3aWR0aCIsIGUud2lkdGggPDwgMTYpLnNldCgiaGVpZ2h0IiwgZS5oZWlnaHQgPDwgMTYpOwogICAgICB2YXIgaCA9IHMuYWRkKCJtZGlhIik7CiAgICAgIGguYWRkKCJtZGhkIikuc2V0KCJjcmVhdGlvbl90aW1lIiwgMCkuc2V0KCJtb2RpZmljYXRpb25fdGltZSIsIDApLnNldCgidGltZXNjYWxlIiwgZS50aW1lc2NhbGUgfHwgMSkuc2V0KCJkdXJhdGlvbiIsIGUubWVkaWFfZHVyYXRpb24gfHwgMCkuc2V0KCJsYW5ndWFnZSIsIGUubGFuZ3VhZ2UgfHwgInVuZCIpLCBoLmFkZCgiaGRsciIpLnNldCgiaGFuZGxlciIsIGUuaGRsciB8fCAidmlkZSIpLnNldCgibmFtZSIsIGUubmFtZSB8fCAiVHJhY2sgY3JlYXRlZCB3aXRoIE1QNEJveC5qcyIpLCBoLmFkZCgiZWxuZyIpLnNldCgiZXh0ZW5kZWRfbGFuZ3VhZ2UiLCBlLmxhbmd1YWdlIHx8ICJmci1GUiIpOwogICAgICB2YXIgbCA9IGguYWRkKCJtaW5mIik7CiAgICAgIGlmIChyW2UudHlwZSArICJTYW1wbGVFbnRyeSJdICE9PSB2b2lkIDApIHsKICAgICAgICB2YXIgcCA9IG5ldyByW2UudHlwZSArICJTYW1wbGVFbnRyeSJdKCk7CiAgICAgICAgcC5kYXRhX3JlZmVyZW5jZV9pbmRleCA9IDE7CiAgICAgICAgdmFyIF8gPSAiIjsKICAgICAgICBmb3IgKHZhciBtIGluIHIuc2FtcGxlRW50cnlDb2RlcykKICAgICAgICAgIGZvciAodmFyIHcgPSByLnNhbXBsZUVudHJ5Q29kZXNbbV0sIFMgPSAwOyBTIDwgdy5sZW5ndGg7IFMrKykKICAgICAgICAgICAgaWYgKHcuaW5kZXhPZihlLnR5cGUpID4gLTEpIHsKICAgICAgICAgICAgICBfID0gbTsKICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgfQogICAgICAgIHN3aXRjaCAoXykgewogICAgICAgICAgY2FzZSAiVmlzdWFsIjoKICAgICAgICAgICAgaWYgKGwuYWRkKCJ2bWhkIikuc2V0KCJncmFwaGljc21vZGUiLCAwKS5zZXQoIm9wY29sb3IiLCBbMCwgMCwgMF0pLCBwLnNldCgid2lkdGgiLCBlLndpZHRoKS5zZXQoImhlaWdodCIsIGUuaGVpZ2h0KS5zZXQoImhvcml6cmVzb2x1dGlvbiIsIDcyIDw8IDE2KS5zZXQoInZlcnRyZXNvbHV0aW9uIiwgNzIgPDwgMTYpLnNldCgiZnJhbWVfY291bnQiLCAxKS5zZXQoImNvbXByZXNzb3JuYW1lIiwgZS50eXBlICsgIiBDb21wcmVzc29yIikuc2V0KCJkZXB0aCIsIDI0KSwgZS5hdmNEZWNvZGVyQ29uZmlnUmVjb3JkKSB7CiAgICAgICAgICAgICAgdmFyIEUgPSBuZXcgci5hdmNDQm94KCk7CiAgICAgICAgICAgICAgRS5wYXJzZShuZXcgbyhlLmF2Y0RlY29kZXJDb25maWdSZWNvcmQpKSwgcC5hZGRCb3goRSk7CiAgICAgICAgICAgIH0gZWxzZSBpZiAoZS5oZXZjRGVjb2RlckNvbmZpZ1JlY29yZCkgewogICAgICAgICAgICAgIHZhciBJID0gbmV3IHIuaHZjQ0JveCgpOwogICAgICAgICAgICAgIEkucGFyc2UobmV3IG8oZS5oZXZjRGVjb2RlckNvbmZpZ1JlY29yZCkpLCBwLmFkZEJveChJKTsKICAgICAgICAgICAgfQogICAgICAgICAgICBicmVhazsKICAgICAgICAgIGNhc2UgIkF1ZGlvIjoKICAgICAgICAgICAgbC5hZGQoInNtaGQiKS5zZXQoImJhbGFuY2UiLCBlLmJhbGFuY2UgfHwgMCksIHAuc2V0KCJjaGFubmVsX2NvdW50IiwgZS5jaGFubmVsX2NvdW50IHx8IDIpLnNldCgic2FtcGxlc2l6ZSIsIGUuc2FtcGxlc2l6ZSB8fCAxNikuc2V0KCJzYW1wbGVyYXRlIiwgZS5zYW1wbGVyYXRlIHx8IDY1NTM2KTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICBjYXNlICJIaW50IjoKICAgICAgICAgICAgbC5hZGQoImhtaGQiKTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICBjYXNlICJTdWJ0aXRsZSI6CiAgICAgICAgICAgIHN3aXRjaCAobC5hZGQoInN0aGQiKSwgZS50eXBlKSB7CiAgICAgICAgICAgICAgY2FzZSAic3RwcCI6CiAgICAgICAgICAgICAgICBwLnNldCgibmFtZXNwYWNlIiwgZS5uYW1lc3BhY2UgfHwgIm5vbmFtZXNwYWNlIikuc2V0KCJzY2hlbWFfbG9jYXRpb24iLCBlLnNjaGVtYV9sb2NhdGlvbiB8fCAiIikuc2V0KCJhdXhpbGlhcnlfbWltZV90eXBlcyIsIGUuYXV4aWxpYXJ5X21pbWVfdHlwZXMgfHwgIiIpOwogICAgICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICAgIH0KICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICBjYXNlICJNZXRhZGF0YSI6CiAgICAgICAgICAgIGwuYWRkKCJubWhkIik7CiAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgY2FzZSAiU3lzdGVtIjoKICAgICAgICAgICAgbC5hZGQoIm5taGQiKTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICBkZWZhdWx0OgogICAgICAgICAgICBsLmFkZCgibm1oZCIpOwogICAgICAgICAgICBicmVhazsKICAgICAgICB9CiAgICAgICAgZS5kZXNjcmlwdGlvbiAmJiBwLmFkZEJveChlLmRlc2NyaXB0aW9uKSwgZS5kZXNjcmlwdGlvbl9ib3hlcyAmJiBlLmRlc2NyaXB0aW9uX2JveGVzLmZvckVhY2goZnVuY3Rpb24oVCkgewogICAgICAgICAgcC5hZGRCb3goVCk7CiAgICAgICAgfSksIGwuYWRkKCJkaW5mIikuYWRkKCJkcmVmIikuYWRkRW50cnkobmV3IHJbInVybCBCb3giXSgpLnNldCgiZmxhZ3MiLCAxKSk7CiAgICAgICAgdmFyIFAgPSBsLmFkZCgic3RibCIpOwogICAgICAgIHJldHVybiBQLmFkZCgic3RzZCIpLmFkZEVudHJ5KHApLCBQLmFkZCgic3R0cyIpLnNldCgic2FtcGxlX2NvdW50cyIsIFtdKS5zZXQoInNhbXBsZV9kZWx0YXMiLCBbXSksIFAuYWRkKCJzdHNjIikuc2V0KCJmaXJzdF9jaHVuayIsIFtdKS5zZXQoInNhbXBsZXNfcGVyX2NodW5rIiwgW10pLnNldCgic2FtcGxlX2Rlc2NyaXB0aW9uX2luZGV4IiwgW10pLCBQLmFkZCgic3RjbyIpLnNldCgiY2h1bmtfb2Zmc2V0cyIsIFtdKSwgUC5hZGQoInN0c3oiKS5zZXQoInNhbXBsZV9zaXplcyIsIFtdKSwgdGhpcy5tb292Lm12ZXguYWRkKCJ0cmV4Iikuc2V0KCJ0cmFja19pZCIsIGUuaWQpLnNldCgiZGVmYXVsdF9zYW1wbGVfZGVzY3JpcHRpb25faW5kZXgiLCBlLmRlZmF1bHRfc2FtcGxlX2Rlc2NyaXB0aW9uX2luZGV4IHx8IDEpLnNldCgiZGVmYXVsdF9zYW1wbGVfZHVyYXRpb24iLCBlLmRlZmF1bHRfc2FtcGxlX2R1cmF0aW9uIHx8IDApLnNldCgiZGVmYXVsdF9zYW1wbGVfc2l6ZSIsIGUuZGVmYXVsdF9zYW1wbGVfc2l6ZSB8fCAwKS5zZXQoImRlZmF1bHRfc2FtcGxlX2ZsYWdzIiwgZS5kZWZhdWx0X3NhbXBsZV9mbGFncyB8fCAwKSwgdGhpcy5idWlsZFRyYWtTYW1wbGVMaXN0cyhzKSwgZS5pZDsKICAgICAgfQogICAgfSwgci5Cb3gucHJvdG90eXBlLmNvbXB1dGVTaXplID0gZnVuY3Rpb24odCkgewogICAgICB2YXIgZSA9IHQgfHwgbmV3IG4oKTsKICAgICAgZS5lbmRpYW5uZXNzID0gbi5CSUdfRU5ESUFOLCB0aGlzLndyaXRlKGUpOwogICAgfSwgeS5wcm90b3R5cGUuYWRkU2FtcGxlID0gZnVuY3Rpb24odCwgZSwgcykgewogICAgICB2YXIgaCA9IHMgfHwge30sIGwgPSB7fSwgcCA9IHRoaXMuZ2V0VHJhY2tCeUlkKHQpOwogICAgICBpZiAocCAhPT0gbnVsbCkgewogICAgICAgIGwubnVtYmVyID0gcC5zYW1wbGVzLmxlbmd0aCwgbC50cmFja19pZCA9IHAudGtoZC50cmFja19pZCwgbC50aW1lc2NhbGUgPSBwLm1kaWEubWRoZC50aW1lc2NhbGUsIGwuZGVzY3JpcHRpb25faW5kZXggPSBoLnNhbXBsZV9kZXNjcmlwdGlvbl9pbmRleCA/IGguc2FtcGxlX2Rlc2NyaXB0aW9uX2luZGV4IC0gMSA6IDAsIGwuZGVzY3JpcHRpb24gPSBwLm1kaWEubWluZi5zdGJsLnN0c2QuZW50cmllc1tsLmRlc2NyaXB0aW9uX2luZGV4XSwgbC5kYXRhID0gZSwgbC5zaXplID0gZS5ieXRlTGVuZ3RoLCBsLmFscmVhZHlSZWFkID0gbC5zaXplLCBsLmR1cmF0aW9uID0gaC5kdXJhdGlvbiB8fCAxLCBsLmN0cyA9IGguY3RzIHx8IDAsIGwuZHRzID0gaC5kdHMgfHwgMCwgbC5pc19zeW5jID0gaC5pc19zeW5jIHx8IGZhbHNlLCBsLmlzX2xlYWRpbmcgPSBoLmlzX2xlYWRpbmcgfHwgMCwgbC5kZXBlbmRzX29uID0gaC5kZXBlbmRzX29uIHx8IDAsIGwuaXNfZGVwZW5kZWRfb24gPSBoLmlzX2RlcGVuZGVkX29uIHx8IDAsIGwuaGFzX3JlZHVuZGFuY3kgPSBoLmhhc19yZWR1bmRhbmN5IHx8IDAsIGwuZGVncmFkYXRpb25fcHJpb3JpdHkgPSBoLmRlZ3JhZGF0aW9uX3ByaW9yaXR5IHx8IDAsIGwub2Zmc2V0ID0gMCwgbC5zdWJzYW1wbGVzID0gaC5zdWJzYW1wbGVzLCBwLnNhbXBsZXMucHVzaChsKSwgcC5zYW1wbGVzX3NpemUgKz0gbC5zaXplLCBwLnNhbXBsZXNfZHVyYXRpb24gKz0gbC5kdXJhdGlvbiwgcC5maXJzdF9kdHMgPT09IHZvaWQgMCAmJiAocC5maXJzdF9kdHMgPSBoLmR0cyksIHRoaXMucHJvY2Vzc1NhbXBsZXMoKTsKICAgICAgICB2YXIgXyA9IHRoaXMuY3JlYXRlU2luZ2xlU2FtcGxlTW9vZihsKTsKICAgICAgICByZXR1cm4gdGhpcy5hZGRCb3goXyksIF8uY29tcHV0ZVNpemUoKSwgXy50cmFmc1swXS50cnVuc1swXS5kYXRhX29mZnNldCA9IF8uc2l6ZSArIDgsIHRoaXMuYWRkKCJtZGF0IikuZGF0YSA9IG5ldyBVaW50OEFycmF5KGUpLCBsOwogICAgICB9CiAgICB9LCB5LnByb3RvdHlwZS5jcmVhdGVTaW5nbGVTYW1wbGVNb29mID0gZnVuY3Rpb24odCkgewogICAgICB2YXIgZSA9IDA7CiAgICAgIHQuaXNfc3luYyA/IGUgPSAxIDw8IDI1IDogZSA9IDY1NTM2OwogICAgICB2YXIgcyA9IG5ldyByLm1vb2ZCb3goKTsKICAgICAgcy5hZGQoIm1maGQiKS5zZXQoInNlcXVlbmNlX251bWJlciIsIHRoaXMubmV4dE1vb2ZOdW1iZXIpLCB0aGlzLm5leHRNb29mTnVtYmVyKys7CiAgICAgIHZhciBoID0gcy5hZGQoInRyYWYiKSwgbCA9IHRoaXMuZ2V0VHJhY2tCeUlkKHQudHJhY2tfaWQpOwogICAgICByZXR1cm4gaC5hZGQoInRmaGQiKS5zZXQoInRyYWNrX2lkIiwgdC50cmFja19pZCkuc2V0KCJmbGFncyIsIHIuVEZIRF9GTEFHX0RFRkFVTFRfQkFTRV9JU19NT09GKSwgaC5hZGQoInRmZHQiKS5zZXQoImJhc2VNZWRpYURlY29kZVRpbWUiLCB0LmR0cyAtIChsLmZpcnN0X2R0cyB8fCAwKSksIGguYWRkKCJ0cnVuIikuc2V0KCJmbGFncyIsIHIuVFJVTl9GTEFHU19EQVRBX09GRlNFVCB8IHIuVFJVTl9GTEFHU19EVVJBVElPTiB8IHIuVFJVTl9GTEFHU19TSVpFIHwgci5UUlVOX0ZMQUdTX0ZMQUdTIHwgci5UUlVOX0ZMQUdTX0NUU19PRkZTRVQpLnNldCgiZGF0YV9vZmZzZXQiLCAwKS5zZXQoImZpcnN0X3NhbXBsZV9mbGFncyIsIDApLnNldCgic2FtcGxlX2NvdW50IiwgMSkuc2V0KCJzYW1wbGVfZHVyYXRpb24iLCBbdC5kdXJhdGlvbl0pLnNldCgic2FtcGxlX3NpemUiLCBbdC5zaXplXSkuc2V0KCJzYW1wbGVfZmxhZ3MiLCBbZV0pLnNldCgic2FtcGxlX2NvbXBvc2l0aW9uX3RpbWVfb2Zmc2V0IiwgW3QuY3RzIC0gdC5kdHNdKSwgczsKICAgIH0sIHkucHJvdG90eXBlLmxhc3RNb29mSW5kZXggPSAwLCB5LnByb3RvdHlwZS5zYW1wbGVzRGF0YVNpemUgPSAwLCB5LnByb3RvdHlwZS5yZXNldFRhYmxlcyA9IGZ1bmN0aW9uKCkgewogICAgICB2YXIgdCwgZSwgcywgaCwgbCwgcCwgXywgbTsKICAgICAgZm9yICh0aGlzLmluaXRpYWxfZHVyYXRpb24gPSB0aGlzLm1vb3YubXZoZC5kdXJhdGlvbiwgdGhpcy5tb292Lm12aGQuZHVyYXRpb24gPSAwLCB0ID0gMDsgdCA8IHRoaXMubW9vdi50cmFrcy5sZW5ndGg7IHQrKykgewogICAgICAgIGUgPSB0aGlzLm1vb3YudHJha3NbdF0sIGUudGtoZC5kdXJhdGlvbiA9IDAsIGUubWRpYS5tZGhkLmR1cmF0aW9uID0gMCwgcyA9IGUubWRpYS5taW5mLnN0Ymwuc3RjbyB8fCBlLm1kaWEubWluZi5zdGJsLmNvNjQsIHMuY2h1bmtfb2Zmc2V0cyA9IFtdLCBoID0gZS5tZGlhLm1pbmYuc3RibC5zdHNjLCBoLmZpcnN0X2NodW5rID0gW10sIGguc2FtcGxlc19wZXJfY2h1bmsgPSBbXSwgaC5zYW1wbGVfZGVzY3JpcHRpb25faW5kZXggPSBbXSwgbCA9IGUubWRpYS5taW5mLnN0Ymwuc3RzeiB8fCBlLm1kaWEubWluZi5zdGJsLnN0ejIsIGwuc2FtcGxlX3NpemVzID0gW10sIHAgPSBlLm1kaWEubWluZi5zdGJsLnN0dHMsIHAuc2FtcGxlX2NvdW50cyA9IFtdLCBwLnNhbXBsZV9kZWx0YXMgPSBbXSwgXyA9IGUubWRpYS5taW5mLnN0YmwuY3R0cywgXyAmJiAoXy5zYW1wbGVfY291bnRzID0gW10sIF8uc2FtcGxlX29mZnNldHMgPSBbXSksIG0gPSBlLm1kaWEubWluZi5zdGJsLnN0c3M7CiAgICAgICAgdmFyIHcgPSBlLm1kaWEubWluZi5zdGJsLmJveGVzLmluZGV4T2YobSk7CiAgICAgICAgdyAhPSAtMSAmJiAoZS5tZGlhLm1pbmYuc3RibC5ib3hlc1t3XSA9IG51bGwpOwogICAgICB9CiAgICB9LCB5LmluaXRTYW1wbGVHcm91cHMgPSBmdW5jdGlvbih0LCBlLCBzLCBoLCBsKSB7CiAgICAgIHZhciBwLCBfLCBtLCB3OwogICAgICBmdW5jdGlvbiBTKEUsIEksIFApIHsKICAgICAgICB0aGlzLmdyb3VwaW5nX3R5cGUgPSBFLCB0aGlzLmdyb3VwaW5nX3R5cGVfcGFyYW1ldGVyID0gSSwgdGhpcy5zYmdwID0gUCwgdGhpcy5sYXN0X3NhbXBsZV9pbl9ydW4gPSAtMSwgdGhpcy5lbnRyeV9pbmRleCA9IC0xOwogICAgICB9CiAgICAgIGZvciAoZSAmJiAoZS5zYW1wbGVfZ3JvdXBzX2luZm8gPSBbXSksIHQuc2FtcGxlX2dyb3Vwc19pbmZvIHx8ICh0LnNhbXBsZV9ncm91cHNfaW5mbyA9IFtdKSwgXyA9IDA7IF8gPCBzLmxlbmd0aDsgXysrKSB7CiAgICAgICAgZm9yICh3ID0gc1tfXS5ncm91cGluZ190eXBlICsgIi8iICsgc1tfXS5ncm91cGluZ190eXBlX3BhcmFtZXRlciwgbSA9IG5ldyBTKHNbX10uZ3JvdXBpbmdfdHlwZSwgc1tfXS5ncm91cGluZ190eXBlX3BhcmFtZXRlciwgc1tfXSksIGUgJiYgKGUuc2FtcGxlX2dyb3Vwc19pbmZvW3ddID0gbSksIHQuc2FtcGxlX2dyb3Vwc19pbmZvW3ddIHx8ICh0LnNhbXBsZV9ncm91cHNfaW5mb1t3XSA9IG0pLCBwID0gMDsgcCA8IGgubGVuZ3RoOyBwKyspCiAgICAgICAgICBoW3BdLmdyb3VwaW5nX3R5cGUgPT09IHNbX10uZ3JvdXBpbmdfdHlwZSAmJiAobS5kZXNjcmlwdGlvbiA9IGhbcF0sIG0uZGVzY3JpcHRpb24udXNlZCA9IHRydWUpOwogICAgICAgIGlmIChsKQogICAgICAgICAgZm9yIChwID0gMDsgcCA8IGwubGVuZ3RoOyBwKyspCiAgICAgICAgICAgIGxbcF0uZ3JvdXBpbmdfdHlwZSA9PT0gc1tfXS5ncm91cGluZ190eXBlICYmIChtLmZyYWdtZW50X2Rlc2NyaXB0aW9uID0gbFtwXSwgbS5mcmFnbWVudF9kZXNjcmlwdGlvbi51c2VkID0gdHJ1ZSwgbS5pc19mcmFnbWVudCA9IHRydWUpOwogICAgICB9CiAgICAgIGlmIChlKSB7CiAgICAgICAgaWYgKGwpCiAgICAgICAgICBmb3IgKF8gPSAwOyBfIDwgbC5sZW5ndGg7IF8rKykKICAgICAgICAgICAgIWxbX10udXNlZCAmJiBsW19dLnZlcnNpb24gPj0gMiAmJiAodyA9IGxbX10uZ3JvdXBpbmdfdHlwZSArICIvMCIsIG0gPSBuZXcgUyhsW19dLmdyb3VwaW5nX3R5cGUsIDApLCBtLmlzX2ZyYWdtZW50ID0gdHJ1ZSwgZS5zYW1wbGVfZ3JvdXBzX2luZm9bd10gfHwgKGUuc2FtcGxlX2dyb3Vwc19pbmZvW3ddID0gbSkpOwogICAgICB9IGVsc2UKICAgICAgICBmb3IgKF8gPSAwOyBfIDwgaC5sZW5ndGg7IF8rKykKICAgICAgICAgICFoW19dLnVzZWQgJiYgaFtfXS52ZXJzaW9uID49IDIgJiYgKHcgPSBoW19dLmdyb3VwaW5nX3R5cGUgKyAiLzAiLCBtID0gbmV3IFMoaFtfXS5ncm91cGluZ190eXBlLCAwKSwgdC5zYW1wbGVfZ3JvdXBzX2luZm9bd10gfHwgKHQuc2FtcGxlX2dyb3Vwc19pbmZvW3ddID0gbSkpOwogICAgfSwgeS5zZXRTYW1wbGVHcm91cFByb3BlcnRpZXMgPSBmdW5jdGlvbih0LCBlLCBzLCBoKSB7CiAgICAgIHZhciBsLCBwOwogICAgICBlLnNhbXBsZV9ncm91cHMgPSBbXTsKICAgICAgZm9yIChsIGluIGgpCiAgICAgICAgaWYgKGUuc2FtcGxlX2dyb3Vwc1tsXSA9IHt9LCBlLnNhbXBsZV9ncm91cHNbbF0uZ3JvdXBpbmdfdHlwZSA9IGhbbF0uZ3JvdXBpbmdfdHlwZSwgZS5zYW1wbGVfZ3JvdXBzW2xdLmdyb3VwaW5nX3R5cGVfcGFyYW1ldGVyID0gaFtsXS5ncm91cGluZ190eXBlX3BhcmFtZXRlciwgcyA+PSBoW2xdLmxhc3Rfc2FtcGxlX2luX3J1biAmJiAoaFtsXS5sYXN0X3NhbXBsZV9pbl9ydW4gPCAwICYmIChoW2xdLmxhc3Rfc2FtcGxlX2luX3J1biA9IDApLCBoW2xdLmVudHJ5X2luZGV4KyssIGhbbF0uZW50cnlfaW5kZXggPD0gaFtsXS5zYmdwLmVudHJpZXMubGVuZ3RoIC0gMSAmJiAoaFtsXS5sYXN0X3NhbXBsZV9pbl9ydW4gKz0gaFtsXS5zYmdwLmVudHJpZXNbaFtsXS5lbnRyeV9pbmRleF0uc2FtcGxlX2NvdW50KSksIGhbbF0uZW50cnlfaW5kZXggPD0gaFtsXS5zYmdwLmVudHJpZXMubGVuZ3RoIC0gMSA/IGUuc2FtcGxlX2dyb3Vwc1tsXS5ncm91cF9kZXNjcmlwdGlvbl9pbmRleCA9IGhbbF0uc2JncC5lbnRyaWVzW2hbbF0uZW50cnlfaW5kZXhdLmdyb3VwX2Rlc2NyaXB0aW9uX2luZGV4IDogZS5zYW1wbGVfZ3JvdXBzW2xdLmdyb3VwX2Rlc2NyaXB0aW9uX2luZGV4ID0gLTEsIGUuc2FtcGxlX2dyb3Vwc1tsXS5ncm91cF9kZXNjcmlwdGlvbl9pbmRleCAhPT0gMCkgewogICAgICAgICAgdmFyIF87CiAgICAgICAgICBoW2xdLmZyYWdtZW50X2Rlc2NyaXB0aW9uID8gXyA9IGhbbF0uZnJhZ21lbnRfZGVzY3JpcHRpb24gOiBfID0gaFtsXS5kZXNjcmlwdGlvbiwgZS5zYW1wbGVfZ3JvdXBzW2xdLmdyb3VwX2Rlc2NyaXB0aW9uX2luZGV4ID4gMCA/IChlLnNhbXBsZV9ncm91cHNbbF0uZ3JvdXBfZGVzY3JpcHRpb25faW5kZXggPiA2NTUzNSA/IHAgPSAoZS5zYW1wbGVfZ3JvdXBzW2xdLmdyb3VwX2Rlc2NyaXB0aW9uX2luZGV4ID4+IDE2KSAtIDEgOiBwID0gZS5zYW1wbGVfZ3JvdXBzW2xdLmdyb3VwX2Rlc2NyaXB0aW9uX2luZGV4IC0gMSwgXyAmJiBwID49IDAgJiYgKGUuc2FtcGxlX2dyb3Vwc1tsXS5kZXNjcmlwdGlvbiA9IF8uZW50cmllc1twXSkpIDogXyAmJiBfLnZlcnNpb24gPj0gMiAmJiBfLmRlZmF1bHRfZ3JvdXBfZGVzY3JpcHRpb25faW5kZXggPiAwICYmIChlLnNhbXBsZV9ncm91cHNbbF0uZGVzY3JpcHRpb24gPSBfLmVudHJpZXNbXy5kZWZhdWx0X2dyb3VwX2Rlc2NyaXB0aW9uX2luZGV4IC0gMV0pOwogICAgICAgIH0KICAgIH0sIHkucHJvY2Vzc19zZHRwID0gZnVuY3Rpb24odCwgZSwgcykgewogICAgICBlICYmICh0ID8gKGUuaXNfbGVhZGluZyA9IHQuaXNfbGVhZGluZ1tzXSwgZS5kZXBlbmRzX29uID0gdC5zYW1wbGVfZGVwZW5kc19vbltzXSwgZS5pc19kZXBlbmRlZF9vbiA9IHQuc2FtcGxlX2lzX2RlcGVuZGVkX29uW3NdLCBlLmhhc19yZWR1bmRhbmN5ID0gdC5zYW1wbGVfaGFzX3JlZHVuZGFuY3lbc10pIDogKGUuaXNfbGVhZGluZyA9IDAsIGUuZGVwZW5kc19vbiA9IDAsIGUuaXNfZGVwZW5kZWRfb24gPSAwLCBlLmhhc19yZWR1bmRhbmN5ID0gMCkpOwogICAgfSwgeS5wcm90b3R5cGUuYnVpbGRTYW1wbGVMaXN0cyA9IGZ1bmN0aW9uKCkgewogICAgICB2YXIgdCwgZTsKICAgICAgZm9yICh0ID0gMDsgdCA8IHRoaXMubW9vdi50cmFrcy5sZW5ndGg7IHQrKykKICAgICAgICBlID0gdGhpcy5tb292LnRyYWtzW3RdLCB0aGlzLmJ1aWxkVHJha1NhbXBsZUxpc3RzKGUpOwogICAgfSwgeS5wcm90b3R5cGUuYnVpbGRUcmFrU2FtcGxlTGlzdHMgPSBmdW5jdGlvbih0KSB7CiAgICAgIHZhciBlLCBzLCBoLCBsLCBwLCBfLCBtLCB3LCBTLCBFLCBJLCBQLCBULCBMLCB6LCBHdCwgc2UsIEJ0LCBLLCBtdCwgQ2UsIGplLCB5dCwgcmU7CiAgICAgIGlmICh0LnNhbXBsZXMgPSBbXSwgdC5zYW1wbGVzX2R1cmF0aW9uID0gMCwgdC5zYW1wbGVzX3NpemUgPSAwLCBzID0gdC5tZGlhLm1pbmYuc3RibC5zdGNvIHx8IHQubWRpYS5taW5mLnN0YmwuY282NCwgaCA9IHQubWRpYS5taW5mLnN0Ymwuc3RzYywgbCA9IHQubWRpYS5taW5mLnN0Ymwuc3RzeiB8fCB0Lm1kaWEubWluZi5zdGJsLnN0ejIsIHAgPSB0Lm1kaWEubWluZi5zdGJsLnN0dHMsIF8gPSB0Lm1kaWEubWluZi5zdGJsLmN0dHMsIG0gPSB0Lm1kaWEubWluZi5zdGJsLnN0c3MsIHcgPSB0Lm1kaWEubWluZi5zdGJsLnN0c2QsIFMgPSB0Lm1kaWEubWluZi5zdGJsLnN1YnMsIFAgPSB0Lm1kaWEubWluZi5zdGJsLnN0ZHAsIEUgPSB0Lm1kaWEubWluZi5zdGJsLnNiZ3BzLCBJID0gdC5tZGlhLm1pbmYuc3RibC5zZ3BkcywgQnQgPSAtMSwgSyA9IC0xLCBtdCA9IC0xLCBDZSA9IC0xLCBqZSA9IDAsIHl0ID0gMCwgcmUgPSAwLCB5LmluaXRTYW1wbGVHcm91cHModCwgbnVsbCwgRSwgSSksICEodHlwZW9mIGwgPiAidSIpKSB7CiAgICAgICAgZm9yIChlID0gMDsgZSA8IGwuc2FtcGxlX3NpemVzLmxlbmd0aDsgZSsrKSB7CiAgICAgICAgICB2YXIgQyA9IHt9OwogICAgICAgICAgQy5udW1iZXIgPSBlLCBDLnRyYWNrX2lkID0gdC50a2hkLnRyYWNrX2lkLCBDLnRpbWVzY2FsZSA9IHQubWRpYS5tZGhkLnRpbWVzY2FsZSwgQy5hbHJlYWR5UmVhZCA9IDAsIHQuc2FtcGxlc1tlXSA9IEMsIEMuc2l6ZSA9IGwuc2FtcGxlX3NpemVzW2VdLCB0LnNhbXBsZXNfc2l6ZSArPSBDLnNpemUsIGUgPT09IDAgPyAoTCA9IDEsIFQgPSAwLCBDLmNodW5rX2luZGV4ID0gTCwgQy5jaHVua19ydW5faW5kZXggPSBULCBzZSA9IGguc2FtcGxlc19wZXJfY2h1bmtbVF0sIEd0ID0gMCwgVCArIDEgPCBoLmZpcnN0X2NodW5rLmxlbmd0aCA/IHogPSBoLmZpcnN0X2NodW5rW1QgKyAxXSAtIDEgOiB6ID0gMSAvIDApIDogZSA8IHNlID8gKEMuY2h1bmtfaW5kZXggPSBMLCBDLmNodW5rX3J1bl9pbmRleCA9IFQpIDogKEwrKywgQy5jaHVua19pbmRleCA9IEwsIEd0ID0gMCwgTCA8PSB6IHx8IChUKyssIFQgKyAxIDwgaC5maXJzdF9jaHVuay5sZW5ndGggPyB6ID0gaC5maXJzdF9jaHVua1tUICsgMV0gLSAxIDogeiA9IDEgLyAwKSwgQy5jaHVua19ydW5faW5kZXggPSBULCBzZSArPSBoLnNhbXBsZXNfcGVyX2NodW5rW1RdKSwgQy5kZXNjcmlwdGlvbl9pbmRleCA9IGguc2FtcGxlX2Rlc2NyaXB0aW9uX2luZGV4W0MuY2h1bmtfcnVuX2luZGV4XSAtIDEsIEMuZGVzY3JpcHRpb24gPSB3LmVudHJpZXNbQy5kZXNjcmlwdGlvbl9pbmRleF0sIEMub2Zmc2V0ID0gcy5jaHVua19vZmZzZXRzW0MuY2h1bmtfaW5kZXggLSAxXSArIEd0LCBHdCArPSBDLnNpemUsIGUgPiBCdCAmJiAoSysrLCBCdCA8IDAgJiYgKEJ0ID0gMCksIEJ0ICs9IHAuc2FtcGxlX2NvdW50c1tLXSksIGUgPiAwID8gKHQuc2FtcGxlc1tlIC0gMV0uZHVyYXRpb24gPSBwLnNhbXBsZV9kZWx0YXNbS10sIHQuc2FtcGxlc19kdXJhdGlvbiArPSB0LnNhbXBsZXNbZSAtIDFdLmR1cmF0aW9uLCBDLmR0cyA9IHQuc2FtcGxlc1tlIC0gMV0uZHRzICsgdC5zYW1wbGVzW2UgLSAxXS5kdXJhdGlvbikgOiBDLmR0cyA9IDAsIF8gPyAoZSA+PSBtdCAmJiAoQ2UrKywgbXQgPCAwICYmIChtdCA9IDApLCBtdCArPSBfLnNhbXBsZV9jb3VudHNbQ2VdKSwgQy5jdHMgPSB0LnNhbXBsZXNbZV0uZHRzICsgXy5zYW1wbGVfb2Zmc2V0c1tDZV0pIDogQy5jdHMgPSBDLmR0cywgbSA/IChlID09IG0uc2FtcGxlX251bWJlcnNbamVdIC0gMSA/IChDLmlzX3N5bmMgPSB0cnVlLCBqZSsrKSA6IChDLmlzX3N5bmMgPSBmYWxzZSwgQy5kZWdyYWRhdGlvbl9wcmlvcml0eSA9IDApLCBTICYmIFMuZW50cmllc1t5dF0uc2FtcGxlX2RlbHRhICsgcmUgPT0gZSArIDEgJiYgKEMuc3Vic2FtcGxlcyA9IFMuZW50cmllc1t5dF0uc3Vic2FtcGxlcywgcmUgKz0gUy5lbnRyaWVzW3l0XS5zYW1wbGVfZGVsdGEsIHl0KyspKSA6IEMuaXNfc3luYyA9IHRydWUsIHkucHJvY2Vzc19zZHRwKHQubWRpYS5taW5mLnN0Ymwuc2R0cCwgQywgQy5udW1iZXIpLCBQID8gQy5kZWdyYWRhdGlvbl9wcmlvcml0eSA9IFAucHJpb3JpdHlbZV0gOiBDLmRlZ3JhZGF0aW9uX3ByaW9yaXR5ID0gMCwgUyAmJiBTLmVudHJpZXNbeXRdLnNhbXBsZV9kZWx0YSArIHJlID09IGUgJiYgKEMuc3Vic2FtcGxlcyA9IFMuZW50cmllc1t5dF0uc3Vic2FtcGxlcywgcmUgKz0gUy5lbnRyaWVzW3l0XS5zYW1wbGVfZGVsdGEpLCAoRS5sZW5ndGggPiAwIHx8IEkubGVuZ3RoID4gMCkgJiYgeS5zZXRTYW1wbGVHcm91cFByb3BlcnRpZXModCwgQywgZSwgdC5zYW1wbGVfZ3JvdXBzX2luZm8pOwogICAgICAgIH0KICAgICAgICBlID4gMCAmJiAodC5zYW1wbGVzW2UgLSAxXS5kdXJhdGlvbiA9IE1hdGgubWF4KHQubWRpYS5tZGhkLmR1cmF0aW9uIC0gdC5zYW1wbGVzW2UgLSAxXS5kdHMsIDApLCB0LnNhbXBsZXNfZHVyYXRpb24gKz0gdC5zYW1wbGVzW2UgLSAxXS5kdXJhdGlvbik7CiAgICAgIH0KICAgIH0sIHkucHJvdG90eXBlLnVwZGF0ZVNhbXBsZUxpc3RzID0gZnVuY3Rpb24oKSB7CiAgICAgIHZhciB0LCBlLCBzLCBoLCBsLCBwLCBfLCBtLCB3LCBTLCBFLCBJLCBQLCBULCBMOwogICAgICBpZiAodGhpcy5tb292ICE9PSB2b2lkIDApIHsKICAgICAgICBmb3IgKDsgdGhpcy5sYXN0TW9vZkluZGV4IDwgdGhpcy5tb29mcy5sZW5ndGg7ICkKICAgICAgICAgIGlmICh3ID0gdGhpcy5tb29mc1t0aGlzLmxhc3RNb29mSW5kZXhdLCB0aGlzLmxhc3RNb29mSW5kZXgrKywgdy50eXBlID09ICJtb29mIikKICAgICAgICAgICAgZm9yIChTID0gdywgdCA9IDA7IHQgPCBTLnRyYWZzLmxlbmd0aDsgdCsrKSB7CiAgICAgICAgICAgICAgZm9yIChFID0gUy50cmFmc1t0XSwgSSA9IHRoaXMuZ2V0VHJhY2tCeUlkKEUudGZoZC50cmFja19pZCksIFAgPSB0aGlzLmdldFRyZXhCeUlkKEUudGZoZC50cmFja19pZCksIEUudGZoZC5mbGFncyAmIHIuVEZIRF9GTEFHX1NBTVBMRV9ERVNDID8gaCA9IEUudGZoZC5kZWZhdWx0X3NhbXBsZV9kZXNjcmlwdGlvbl9pbmRleCA6IGggPSBQID8gUC5kZWZhdWx0X3NhbXBsZV9kZXNjcmlwdGlvbl9pbmRleCA6IDEsIEUudGZoZC5mbGFncyAmIHIuVEZIRF9GTEFHX1NBTVBMRV9EVVIgPyBsID0gRS50ZmhkLmRlZmF1bHRfc2FtcGxlX2R1cmF0aW9uIDogbCA9IFAgPyBQLmRlZmF1bHRfc2FtcGxlX2R1cmF0aW9uIDogMCwgRS50ZmhkLmZsYWdzICYgci5URkhEX0ZMQUdfU0FNUExFX1NJWkUgPyBwID0gRS50ZmhkLmRlZmF1bHRfc2FtcGxlX3NpemUgOiBwID0gUCA/IFAuZGVmYXVsdF9zYW1wbGVfc2l6ZSA6IDAsIEUudGZoZC5mbGFncyAmIHIuVEZIRF9GTEFHX1NBTVBMRV9GTEFHUyA/IF8gPSBFLnRmaGQuZGVmYXVsdF9zYW1wbGVfZmxhZ3MgOiBfID0gUCA/IFAuZGVmYXVsdF9zYW1wbGVfZmxhZ3MgOiAwLCBFLnNhbXBsZV9udW1iZXIgPSAwLCBFLnNiZ3BzLmxlbmd0aCA+IDAgJiYgeS5pbml0U2FtcGxlR3JvdXBzKEksIEUsIEUuc2JncHMsIEkubWRpYS5taW5mLnN0Ymwuc2dwZHMsIEUuc2dwZHMpLCBlID0gMDsgZSA8IEUudHJ1bnMubGVuZ3RoOyBlKyspIHsKICAgICAgICAgICAgICAgIHZhciB6ID0gRS50cnVuc1tlXTsKICAgICAgICAgICAgICAgIGZvciAocyA9IDA7IHMgPCB6LnNhbXBsZV9jb3VudDsgcysrKSB7CiAgICAgICAgICAgICAgICAgIFQgPSB7fSwgVC5tb29mX251bWJlciA9IHRoaXMubGFzdE1vb2ZJbmRleCwgVC5udW1iZXJfaW5fdHJhZiA9IEUuc2FtcGxlX251bWJlciwgRS5zYW1wbGVfbnVtYmVyKyssIFQubnVtYmVyID0gSS5zYW1wbGVzLmxlbmd0aCwgRS5maXJzdF9zYW1wbGVfaW5kZXggPSBJLnNhbXBsZXMubGVuZ3RoLCBJLnNhbXBsZXMucHVzaChUKSwgVC50cmFja19pZCA9IEkudGtoZC50cmFja19pZCwgVC50aW1lc2NhbGUgPSBJLm1kaWEubWRoZC50aW1lc2NhbGUsIFQuZGVzY3JpcHRpb25faW5kZXggPSBoIC0gMSwgVC5kZXNjcmlwdGlvbiA9IEkubWRpYS5taW5mLnN0Ymwuc3RzZC5lbnRyaWVzW1QuZGVzY3JpcHRpb25faW5kZXhdLCBULnNpemUgPSBwLCB6LmZsYWdzICYgci5UUlVOX0ZMQUdTX1NJWkUgJiYgKFQuc2l6ZSA9IHouc2FtcGxlX3NpemVbc10pLCBJLnNhbXBsZXNfc2l6ZSArPSBULnNpemUsIFQuZHVyYXRpb24gPSBsLCB6LmZsYWdzICYgci5UUlVOX0ZMQUdTX0RVUkFUSU9OICYmIChULmR1cmF0aW9uID0gei5zYW1wbGVfZHVyYXRpb25bc10pLCBJLnNhbXBsZXNfZHVyYXRpb24gKz0gVC5kdXJhdGlvbiwgSS5maXJzdF90cmFmX21lcmdlZCB8fCBzID4gMCA/IFQuZHRzID0gSS5zYW1wbGVzW0kuc2FtcGxlcy5sZW5ndGggLSAyXS5kdHMgKyBJLnNhbXBsZXNbSS5zYW1wbGVzLmxlbmd0aCAtIDJdLmR1cmF0aW9uIDogKEUudGZkdCA/IFQuZHRzID0gRS50ZmR0LmJhc2VNZWRpYURlY29kZVRpbWUgOiBULmR0cyA9IDAsIEkuZmlyc3RfdHJhZl9tZXJnZWQgPSB0cnVlKSwgVC5jdHMgPSBULmR0cywgei5mbGFncyAmIHIuVFJVTl9GTEFHU19DVFNfT0ZGU0VUICYmIChULmN0cyA9IFQuZHRzICsgei5zYW1wbGVfY29tcG9zaXRpb25fdGltZV9vZmZzZXRbc10pLCBMID0gXywgei5mbGFncyAmIHIuVFJVTl9GTEFHU19GTEFHUyA/IEwgPSB6LnNhbXBsZV9mbGFnc1tzXSA6IHMgPT09IDAgJiYgei5mbGFncyAmIHIuVFJVTl9GTEFHU19GSVJTVF9GTEFHICYmIChMID0gei5maXJzdF9zYW1wbGVfZmxhZ3MpLCBULmlzX3N5bmMgPSAhKEwgPj4gMTYgJiAxKSwgVC5pc19sZWFkaW5nID0gTCA+PiAyNiAmIDMsIFQuZGVwZW5kc19vbiA9IEwgPj4gMjQgJiAzLCBULmlzX2RlcGVuZGVkX29uID0gTCA+PiAyMiAmIDMsIFQuaGFzX3JlZHVuZGFuY3kgPSBMID4+IDIwICYgMywgVC5kZWdyYWRhdGlvbl9wcmlvcml0eSA9IEwgJiA2NTUzNTsKICAgICAgICAgICAgICAgICAgdmFyIEd0ID0gISEoRS50ZmhkLmZsYWdzICYgci5URkhEX0ZMQUdfQkFTRV9EQVRBX09GRlNFVCksIHNlID0gISEoRS50ZmhkLmZsYWdzICYgci5URkhEX0ZMQUdfREVGQVVMVF9CQVNFX0lTX01PT0YpLCBCdCA9ICEhKHouZmxhZ3MgJiByLlRSVU5fRkxBR1NfREFUQV9PRkZTRVQpLCBLID0gMDsKICAgICAgICAgICAgICAgICAgR3QgPyBLID0gRS50ZmhkLmJhc2VfZGF0YV9vZmZzZXQgOiBzZSB8fCBlID09PSAwID8gSyA9IFMuc3RhcnQgOiBLID0gbSwgZSA9PT0gMCAmJiBzID09PSAwID8gQnQgPyBULm9mZnNldCA9IEsgKyB6LmRhdGFfb2Zmc2V0IDogVC5vZmZzZXQgPSBLIDogVC5vZmZzZXQgPSBtLCBtID0gVC5vZmZzZXQgKyBULnNpemUsIChFLnNiZ3BzLmxlbmd0aCA+IDAgfHwgRS5zZ3Bkcy5sZW5ndGggPiAwIHx8IEkubWRpYS5taW5mLnN0Ymwuc2JncHMubGVuZ3RoID4gMCB8fCBJLm1kaWEubWluZi5zdGJsLnNncGRzLmxlbmd0aCA+IDApICYmIHkuc2V0U2FtcGxlR3JvdXBQcm9wZXJ0aWVzKEksIFQsIFQubnVtYmVyX2luX3RyYWYsIEUuc2FtcGxlX2dyb3Vwc19pbmZvKTsKICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgaWYgKEUuc3VicykgewogICAgICAgICAgICAgICAgSS5oYXNfZnJhZ21lbnRfc3Vic2FtcGxlcyA9IHRydWU7CiAgICAgICAgICAgICAgICB2YXIgbXQgPSBFLmZpcnN0X3NhbXBsZV9pbmRleDsKICAgICAgICAgICAgICAgIGZvciAoZSA9IDA7IGUgPCBFLnN1YnMuZW50cmllcy5sZW5ndGg7IGUrKykKICAgICAgICAgICAgICAgICAgbXQgKz0gRS5zdWJzLmVudHJpZXNbZV0uc2FtcGxlX2RlbHRhLCBUID0gSS5zYW1wbGVzW210IC0gMV0sIFQuc3Vic2FtcGxlcyA9IEUuc3Vicy5lbnRyaWVzW2VdLnN1YnNhbXBsZXM7CiAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CiAgICAgIH0KICAgIH0sIHkucHJvdG90eXBlLmdldFNhbXBsZSA9IGZ1bmN0aW9uKHQsIGUpIHsKICAgICAgdmFyIHMsIGggPSB0LnNhbXBsZXNbZV07CiAgICAgIGlmICghdGhpcy5tb292KQogICAgICAgIHJldHVybiBudWxsOwogICAgICBpZiAoIWguZGF0YSkKICAgICAgICBoLmRhdGEgPSBuZXcgVWludDhBcnJheShoLnNpemUpLCBoLmFscmVhZHlSZWFkID0gMCwgdGhpcy5zYW1wbGVzRGF0YVNpemUgKz0gaC5zaXplLCBhLmRlYnVnKCJJU09GaWxlIiwgIkFsbG9jYXRpbmcgc2FtcGxlICMiICsgZSArICIgb24gdHJhY2sgIyIgKyB0LnRraGQudHJhY2tfaWQgKyAiIG9mIHNpemUgIiArIGguc2l6ZSArICIgKHRvdGFsOiAiICsgdGhpcy5zYW1wbGVzRGF0YVNpemUgKyAiKSIpOwogICAgICBlbHNlIGlmIChoLmFscmVhZHlSZWFkID09IGguc2l6ZSkKICAgICAgICByZXR1cm4gaDsKICAgICAgZm9yICg7IDsgKSB7CiAgICAgICAgdmFyIGwgPSB0aGlzLnN0cmVhbS5maW5kUG9zaXRpb24odHJ1ZSwgaC5vZmZzZXQgKyBoLmFscmVhZHlSZWFkLCBmYWxzZSk7CiAgICAgICAgaWYgKGwgPiAtMSkgewogICAgICAgICAgcyA9IHRoaXMuc3RyZWFtLmJ1ZmZlcnNbbF07CiAgICAgICAgICB2YXIgcCA9IHMuYnl0ZUxlbmd0aCAtIChoLm9mZnNldCArIGguYWxyZWFkeVJlYWQgLSBzLmZpbGVTdGFydCk7CiAgICAgICAgICBpZiAoaC5zaXplIC0gaC5hbHJlYWR5UmVhZCA8PSBwKQogICAgICAgICAgICByZXR1cm4gYS5kZWJ1ZygiSVNPRmlsZSIsICJHZXR0aW5nIHNhbXBsZSAjIiArIGUgKyAiIGRhdGEgKGFscmVhZHlSZWFkOiAiICsgaC5hbHJlYWR5UmVhZCArICIgb2Zmc2V0OiAiICsgKGgub2Zmc2V0ICsgaC5hbHJlYWR5UmVhZCAtIHMuZmlsZVN0YXJ0KSArICIgcmVhZCBzaXplOiAiICsgKGguc2l6ZSAtIGguYWxyZWFkeVJlYWQpICsgIiBmdWxsIHNpemU6ICIgKyBoLnNpemUgKyAiKSIpLCBuLm1lbWNweSgKICAgICAgICAgICAgICBoLmRhdGEuYnVmZmVyLAogICAgICAgICAgICAgIGguYWxyZWFkeVJlYWQsCiAgICAgICAgICAgICAgcywKICAgICAgICAgICAgICBoLm9mZnNldCArIGguYWxyZWFkeVJlYWQgLSBzLmZpbGVTdGFydCwKICAgICAgICAgICAgICBoLnNpemUgLSBoLmFscmVhZHlSZWFkCiAgICAgICAgICAgICksIHMudXNlZEJ5dGVzICs9IGguc2l6ZSAtIGguYWxyZWFkeVJlYWQsIHRoaXMuc3RyZWFtLmxvZ0J1ZmZlckxldmVsKCksIGguYWxyZWFkeVJlYWQgPSBoLnNpemUsIGg7CiAgICAgICAgICBpZiAocCA9PT0gMCkKICAgICAgICAgICAgcmV0dXJuIG51bGw7CiAgICAgICAgICBhLmRlYnVnKCJJU09GaWxlIiwgIkdldHRpbmcgc2FtcGxlICMiICsgZSArICIgcGFydGlhbCBkYXRhIChhbHJlYWR5UmVhZDogIiArIGguYWxyZWFkeVJlYWQgKyAiIG9mZnNldDogIiArIChoLm9mZnNldCArIGguYWxyZWFkeVJlYWQgLSBzLmZpbGVTdGFydCkgKyAiIHJlYWQgc2l6ZTogIiArIHAgKyAiIGZ1bGwgc2l6ZTogIiArIGguc2l6ZSArICIpIiksIG4ubWVtY3B5KAogICAgICAgICAgICBoLmRhdGEuYnVmZmVyLAogICAgICAgICAgICBoLmFscmVhZHlSZWFkLAogICAgICAgICAgICBzLAogICAgICAgICAgICBoLm9mZnNldCArIGguYWxyZWFkeVJlYWQgLSBzLmZpbGVTdGFydCwKICAgICAgICAgICAgcAogICAgICAgICAgKSwgaC5hbHJlYWR5UmVhZCArPSBwLCBzLnVzZWRCeXRlcyArPSBwLCB0aGlzLnN0cmVhbS5sb2dCdWZmZXJMZXZlbCgpOwogICAgICAgIH0gZWxzZQogICAgICAgICAgcmV0dXJuIG51bGw7CiAgICAgIH0KICAgIH0sIHkucHJvdG90eXBlLnJlbGVhc2VTYW1wbGUgPSBmdW5jdGlvbih0LCBlKSB7CiAgICAgIHZhciBzID0gdC5zYW1wbGVzW2VdOwogICAgICByZXR1cm4gcy5kYXRhID8gKHRoaXMuc2FtcGxlc0RhdGFTaXplIC09IHMuc2l6ZSwgcy5kYXRhID0gbnVsbCwgcy5hbHJlYWR5UmVhZCA9IDAsIHMuc2l6ZSkgOiAwOwogICAgfSwgeS5wcm90b3R5cGUuZ2V0QWxsb2NhdGVkU2FtcGxlRGF0YVNpemUgPSBmdW5jdGlvbigpIHsKICAgICAgcmV0dXJuIHRoaXMuc2FtcGxlc0RhdGFTaXplOwogICAgfSwgeS5wcm90b3R5cGUuZ2V0Q29kZWNzID0gZnVuY3Rpb24oKSB7CiAgICAgIHZhciB0LCBlID0gIiI7CiAgICAgIGZvciAodCA9IDA7IHQgPCB0aGlzLm1vb3YudHJha3MubGVuZ3RoOyB0KyspIHsKICAgICAgICB2YXIgcyA9IHRoaXMubW9vdi50cmFrc1t0XTsKICAgICAgICB0ID4gMCAmJiAoZSArPSAiLCIpLCBlICs9IHMubWRpYS5taW5mLnN0Ymwuc3RzZC5lbnRyaWVzWzBdLmdldENvZGVjKCk7CiAgICAgIH0KICAgICAgcmV0dXJuIGU7CiAgICB9LCB5LnByb3RvdHlwZS5nZXRUcmV4QnlJZCA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGU7CiAgICAgIGlmICghdGhpcy5tb292IHx8ICF0aGlzLm1vb3YubXZleCkKICAgICAgICByZXR1cm4gbnVsbDsKICAgICAgZm9yIChlID0gMDsgZSA8IHRoaXMubW9vdi5tdmV4LnRyZXhzLmxlbmd0aDsgZSsrKSB7CiAgICAgICAgdmFyIHMgPSB0aGlzLm1vb3YubXZleC50cmV4c1tlXTsKICAgICAgICBpZiAocy50cmFja19pZCA9PSB0KQogICAgICAgICAgcmV0dXJuIHM7CiAgICAgIH0KICAgICAgcmV0dXJuIG51bGw7CiAgICB9LCB5LnByb3RvdHlwZS5nZXRUcmFja0J5SWQgPSBmdW5jdGlvbih0KSB7CiAgICAgIGlmICh0aGlzLm1vb3YgPT09IHZvaWQgMCkKICAgICAgICByZXR1cm4gbnVsbDsKICAgICAgZm9yICh2YXIgZSA9IDA7IGUgPCB0aGlzLm1vb3YudHJha3MubGVuZ3RoOyBlKyspIHsKICAgICAgICB2YXIgcyA9IHRoaXMubW9vdi50cmFrc1tlXTsKICAgICAgICBpZiAocy50a2hkLnRyYWNrX2lkID09IHQpCiAgICAgICAgICByZXR1cm4gczsKICAgICAgfQogICAgICByZXR1cm4gbnVsbDsKICAgIH0sIHkucHJvdG90eXBlLml0ZW1zID0gW10sIHkucHJvdG90eXBlLml0ZW1zRGF0YVNpemUgPSAwLCB5LnByb3RvdHlwZS5mbGF0dGVuSXRlbUluZm8gPSBmdW5jdGlvbigpIHsKICAgICAgdmFyIHQgPSB0aGlzLml0ZW1zLCBlLCBzLCBoLCBsID0gdGhpcy5tZXRhOwogICAgICBpZiAobCAhPSBudWxsICYmIGwuaGRsciAhPT0gdm9pZCAwICYmIGwuaWluZiAhPT0gdm9pZCAwKSB7CiAgICAgICAgZm9yIChlID0gMDsgZSA8IGwuaWluZi5pdGVtX2luZm9zLmxlbmd0aDsgZSsrKQogICAgICAgICAgaCA9IHt9LCBoLmlkID0gbC5paW5mLml0ZW1faW5mb3NbZV0uaXRlbV9JRCwgdFtoLmlkXSA9IGgsIGgucmVmX3RvID0gW10sIGgubmFtZSA9IGwuaWluZi5pdGVtX2luZm9zW2VdLml0ZW1fbmFtZSwgbC5paW5mLml0ZW1faW5mb3NbZV0ucHJvdGVjdGlvbl9pbmRleCA+IDAgJiYgKGgucHJvdGVjdGlvbiA9IGwuaXByby5wcm90ZWN0aW9uc1tsLmlpbmYuaXRlbV9pbmZvc1tlXS5wcm90ZWN0aW9uX2luZGV4IC0gMV0pLCBsLmlpbmYuaXRlbV9pbmZvc1tlXS5pdGVtX3R5cGUgPyBoLnR5cGUgPSBsLmlpbmYuaXRlbV9pbmZvc1tlXS5pdGVtX3R5cGUgOiBoLnR5cGUgPSAibWltZSIsIGguY29udGVudF90eXBlID0gbC5paW5mLml0ZW1faW5mb3NbZV0uY29udGVudF90eXBlLCBoLmNvbnRlbnRfZW5jb2RpbmcgPSBsLmlpbmYuaXRlbV9pbmZvc1tlXS5jb250ZW50X2VuY29kaW5nOwogICAgICAgIGlmIChsLmlsb2MpCiAgICAgICAgICBmb3IgKGUgPSAwOyBlIDwgbC5pbG9jLml0ZW1zLmxlbmd0aDsgZSsrKSB7CiAgICAgICAgICAgIHZhciBwID0gbC5pbG9jLml0ZW1zW2VdOwogICAgICAgICAgICBzd2l0Y2ggKGggPSB0W3AuaXRlbV9JRF0sIHAuZGF0YV9yZWZlcmVuY2VfaW5kZXggIT09IDAgJiYgKGEud2FybigiSXRlbSBzdG9yYWdlIHdpdGggcmVmZXJlbmNlIHRvIG90aGVyIGZpbGVzOiBub3Qgc3VwcG9ydGVkIiksIGguc291cmNlID0gbC5kaW5mLmJveGVzW3AuZGF0YV9yZWZlcmVuY2VfaW5kZXggLSAxXSksIHAuY29uc3RydWN0aW9uX21ldGhvZCkgewogICAgICAgICAgICAgIGNhc2UgMDoKICAgICAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgICAgIGNhc2UgMToKICAgICAgICAgICAgICAgIGEud2FybigiSXRlbSBzdG9yYWdlIHdpdGggY29uc3RydWN0aW9uX21ldGhvZCA6IG5vdCBzdXBwb3J0ZWQiKTsKICAgICAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgICAgIGNhc2UgMjoKICAgICAgICAgICAgICAgIGEud2FybigiSXRlbSBzdG9yYWdlIHdpdGggY29uc3RydWN0aW9uX21ldGhvZCA6IG5vdCBzdXBwb3J0ZWQiKTsKICAgICAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgICB9CiAgICAgICAgICAgIGZvciAoaC5leHRlbnRzID0gW10sIGguc2l6ZSA9IDAsIHMgPSAwOyBzIDwgcC5leHRlbnRzLmxlbmd0aDsgcysrKQogICAgICAgICAgICAgIGguZXh0ZW50c1tzXSA9IHt9LCBoLmV4dGVudHNbc10ub2Zmc2V0ID0gcC5leHRlbnRzW3NdLmV4dGVudF9vZmZzZXQgKyBwLmJhc2Vfb2Zmc2V0LCBoLmV4dGVudHNbc10ubGVuZ3RoID0gcC5leHRlbnRzW3NdLmV4dGVudF9sZW5ndGgsIGguZXh0ZW50c1tzXS5hbHJlYWR5UmVhZCA9IDAsIGguc2l6ZSArPSBoLmV4dGVudHNbc10ubGVuZ3RoOwogICAgICAgICAgfQogICAgICAgIGlmIChsLnBpdG0gJiYgKHRbbC5waXRtLml0ZW1faWRdLnByaW1hcnkgPSB0cnVlKSwgbC5pcmVmKQogICAgICAgICAgZm9yIChlID0gMDsgZSA8IGwuaXJlZi5yZWZlcmVuY2VzLmxlbmd0aDsgZSsrKSB7CiAgICAgICAgICAgIHZhciBfID0gbC5pcmVmLnJlZmVyZW5jZXNbZV07CiAgICAgICAgICAgIGZvciAocyA9IDA7IHMgPCBfLnJlZmVyZW5jZXMubGVuZ3RoOyBzKyspCiAgICAgICAgICAgICAgdFtfLmZyb21faXRlbV9JRF0ucmVmX3RvLnB1c2goeyB0eXBlOiBfLnR5cGUsIGlkOiBfLnJlZmVyZW5jZXNbc10gfSk7CiAgICAgICAgICB9CiAgICAgICAgaWYgKGwuaXBycCkKICAgICAgICAgIGZvciAodmFyIG0gPSAwOyBtIDwgbC5pcHJwLmlwbWFzLmxlbmd0aDsgbSsrKSB7CiAgICAgICAgICAgIHZhciB3ID0gbC5pcHJwLmlwbWFzW21dOwogICAgICAgICAgICBmb3IgKGUgPSAwOyBlIDwgdy5hc3NvY2lhdGlvbnMubGVuZ3RoOyBlKyspIHsKICAgICAgICAgICAgICB2YXIgUyA9IHcuYXNzb2NpYXRpb25zW2VdOwogICAgICAgICAgICAgIGZvciAoaCA9IHRbUy5pZF0sIGgucHJvcGVydGllcyA9PT0gdm9pZCAwICYmIChoLnByb3BlcnRpZXMgPSB7fSwgaC5wcm9wZXJ0aWVzLmJveGVzID0gW10pLCBzID0gMDsgcyA8IFMucHJvcHMubGVuZ3RoOyBzKyspIHsKICAgICAgICAgICAgICAgIHZhciBFID0gUy5wcm9wc1tzXTsKICAgICAgICAgICAgICAgIGlmIChFLnByb3BlcnR5X2luZGV4ID4gMCAmJiBFLnByb3BlcnR5X2luZGV4IC0gMSA8IGwuaXBycC5pcGNvLmJveGVzLmxlbmd0aCkgewogICAgICAgICAgICAgICAgICB2YXIgSSA9IGwuaXBycC5pcGNvLmJveGVzW0UucHJvcGVydHlfaW5kZXggLSAxXTsKICAgICAgICAgICAgICAgICAgaC5wcm9wZXJ0aWVzW0kudHlwZV0gPSBJLCBoLnByb3BlcnRpZXMuYm94ZXMucHVzaChJKTsKICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH0KICAgICAgICAgIH0KICAgICAgfQogICAgfSwgeS5wcm90b3R5cGUuZ2V0SXRlbSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUsIHM7CiAgICAgIGlmICghdGhpcy5tZXRhKQogICAgICAgIHJldHVybiBudWxsOwogICAgICBpZiAocyA9IHRoaXMuaXRlbXNbdF0sICFzLmRhdGEgJiYgcy5zaXplKQogICAgICAgIHMuZGF0YSA9IG5ldyBVaW50OEFycmF5KHMuc2l6ZSksIHMuYWxyZWFkeVJlYWQgPSAwLCB0aGlzLml0ZW1zRGF0YVNpemUgKz0gcy5zaXplLCBhLmRlYnVnKCJJU09GaWxlIiwgIkFsbG9jYXRpbmcgaXRlbSAjIiArIHQgKyAiIG9mIHNpemUgIiArIHMuc2l6ZSArICIgKHRvdGFsOiAiICsgdGhpcy5pdGVtc0RhdGFTaXplICsgIikiKTsKICAgICAgZWxzZSBpZiAocy5hbHJlYWR5UmVhZCA9PT0gcy5zaXplKQogICAgICAgIHJldHVybiBzOwogICAgICBmb3IgKHZhciBoID0gMDsgaCA8IHMuZXh0ZW50cy5sZW5ndGg7IGgrKykgewogICAgICAgIHZhciBsID0gcy5leHRlbnRzW2hdOwogICAgICAgIGlmIChsLmFscmVhZHlSZWFkICE9PSBsLmxlbmd0aCkgewogICAgICAgICAgdmFyIHAgPSB0aGlzLnN0cmVhbS5maW5kUG9zaXRpb24odHJ1ZSwgbC5vZmZzZXQgKyBsLmFscmVhZHlSZWFkLCBmYWxzZSk7CiAgICAgICAgICBpZiAocCA+IC0xKSB7CiAgICAgICAgICAgIGUgPSB0aGlzLnN0cmVhbS5idWZmZXJzW3BdOwogICAgICAgICAgICB2YXIgXyA9IGUuYnl0ZUxlbmd0aCAtIChsLm9mZnNldCArIGwuYWxyZWFkeVJlYWQgLSBlLmZpbGVTdGFydCk7CiAgICAgICAgICAgIGlmIChsLmxlbmd0aCAtIGwuYWxyZWFkeVJlYWQgPD0gXykKICAgICAgICAgICAgICBhLmRlYnVnKCJJU09GaWxlIiwgIkdldHRpbmcgaXRlbSAjIiArIHQgKyAiIGV4dGVudCAjIiArIGggKyAiIGRhdGEgKGFscmVhZHlSZWFkOiAiICsgbC5hbHJlYWR5UmVhZCArICIgb2Zmc2V0OiAiICsgKGwub2Zmc2V0ICsgbC5hbHJlYWR5UmVhZCAtIGUuZmlsZVN0YXJ0KSArICIgcmVhZCBzaXplOiAiICsgKGwubGVuZ3RoIC0gbC5hbHJlYWR5UmVhZCkgKyAiIGZ1bGwgZXh0ZW50IHNpemU6ICIgKyBsLmxlbmd0aCArICIgZnVsbCBpdGVtIHNpemU6ICIgKyBzLnNpemUgKyAiKSIpLCBuLm1lbWNweSgKICAgICAgICAgICAgICAgIHMuZGF0YS5idWZmZXIsCiAgICAgICAgICAgICAgICBzLmFscmVhZHlSZWFkLAogICAgICAgICAgICAgICAgZSwKICAgICAgICAgICAgICAgIGwub2Zmc2V0ICsgbC5hbHJlYWR5UmVhZCAtIGUuZmlsZVN0YXJ0LAogICAgICAgICAgICAgICAgbC5sZW5ndGggLSBsLmFscmVhZHlSZWFkCiAgICAgICAgICAgICAgKSwgZS51c2VkQnl0ZXMgKz0gbC5sZW5ndGggLSBsLmFscmVhZHlSZWFkLCB0aGlzLnN0cmVhbS5sb2dCdWZmZXJMZXZlbCgpLCBzLmFscmVhZHlSZWFkICs9IGwubGVuZ3RoIC0gbC5hbHJlYWR5UmVhZCwgbC5hbHJlYWR5UmVhZCA9IGwubGVuZ3RoOwogICAgICAgICAgICBlbHNlCiAgICAgICAgICAgICAgcmV0dXJuIGEuZGVidWcoIklTT0ZpbGUiLCAiR2V0dGluZyBpdGVtICMiICsgdCArICIgZXh0ZW50ICMiICsgaCArICIgcGFydGlhbCBkYXRhIChhbHJlYWR5UmVhZDogIiArIGwuYWxyZWFkeVJlYWQgKyAiIG9mZnNldDogIiArIChsLm9mZnNldCArIGwuYWxyZWFkeVJlYWQgLSBlLmZpbGVTdGFydCkgKyAiIHJlYWQgc2l6ZTogIiArIF8gKyAiIGZ1bGwgZXh0ZW50IHNpemU6ICIgKyBsLmxlbmd0aCArICIgZnVsbCBpdGVtIHNpemU6ICIgKyBzLnNpemUgKyAiKSIpLCBuLm1lbWNweSgKICAgICAgICAgICAgICAgIHMuZGF0YS5idWZmZXIsCiAgICAgICAgICAgICAgICBzLmFscmVhZHlSZWFkLAogICAgICAgICAgICAgICAgZSwKICAgICAgICAgICAgICAgIGwub2Zmc2V0ICsgbC5hbHJlYWR5UmVhZCAtIGUuZmlsZVN0YXJ0LAogICAgICAgICAgICAgICAgXwogICAgICAgICAgICAgICksIGwuYWxyZWFkeVJlYWQgKz0gXywgcy5hbHJlYWR5UmVhZCArPSBfLCBlLnVzZWRCeXRlcyArPSBfLCB0aGlzLnN0cmVhbS5sb2dCdWZmZXJMZXZlbCgpLCBudWxsOwogICAgICAgICAgfSBlbHNlCiAgICAgICAgICAgIHJldHVybiBudWxsOwogICAgICAgIH0KICAgICAgfQogICAgICByZXR1cm4gcy5hbHJlYWR5UmVhZCA9PT0gcy5zaXplID8gcyA6IG51bGw7CiAgICB9LCB5LnByb3RvdHlwZS5yZWxlYXNlSXRlbSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUgPSB0aGlzLml0ZW1zW3RdOwogICAgICBpZiAoZS5kYXRhKSB7CiAgICAgICAgdGhpcy5pdGVtc0RhdGFTaXplIC09IGUuc2l6ZSwgZS5kYXRhID0gbnVsbCwgZS5hbHJlYWR5UmVhZCA9IDA7CiAgICAgICAgZm9yICh2YXIgcyA9IDA7IHMgPCBlLmV4dGVudHMubGVuZ3RoOyBzKyspIHsKICAgICAgICAgIHZhciBoID0gZS5leHRlbnRzW3NdOwogICAgICAgICAgaC5hbHJlYWR5UmVhZCA9IDA7CiAgICAgICAgfQogICAgICAgIHJldHVybiBlLnNpemU7CiAgICAgIH0gZWxzZQogICAgICAgIHJldHVybiAwOwogICAgfSwgeS5wcm90b3R5cGUucHJvY2Vzc0l0ZW1zID0gZnVuY3Rpb24odCkgewogICAgICBmb3IgKHZhciBlIGluIHRoaXMuaXRlbXMpIHsKICAgICAgICB2YXIgcyA9IHRoaXMuaXRlbXNbZV07CiAgICAgICAgdGhpcy5nZXRJdGVtKHMuaWQpLCB0ICYmICFzLnNlbnQgJiYgKHQocyksIHMuc2VudCA9IHRydWUsIHMuZGF0YSA9IG51bGwpOwogICAgICB9CiAgICB9LCB5LnByb3RvdHlwZS5oYXNJdGVtID0gZnVuY3Rpb24odCkgewogICAgICBmb3IgKHZhciBlIGluIHRoaXMuaXRlbXMpIHsKICAgICAgICB2YXIgcyA9IHRoaXMuaXRlbXNbZV07CiAgICAgICAgaWYgKHMubmFtZSA9PT0gdCkKICAgICAgICAgIHJldHVybiBzLmlkOwogICAgICB9CiAgICAgIHJldHVybiAtMTsKICAgIH0sIHkucHJvdG90eXBlLmdldE1ldGFIYW5kbGVyID0gZnVuY3Rpb24oKSB7CiAgICAgIHJldHVybiB0aGlzLm1ldGEgPyB0aGlzLm1ldGEuaGRsci5oYW5kbGVyIDogbnVsbDsKICAgIH0sIHkucHJvdG90eXBlLmdldFByaW1hcnlJdGVtID0gZnVuY3Rpb24oKSB7CiAgICAgIHJldHVybiAhdGhpcy5tZXRhIHx8ICF0aGlzLm1ldGEucGl0bSA/IG51bGwgOiB0aGlzLmdldEl0ZW0odGhpcy5tZXRhLnBpdG0uaXRlbV9pZCk7CiAgICB9LCB5LnByb3RvdHlwZS5pdGVtVG9GcmFnbWVudGVkVHJhY2tGaWxlID0gZnVuY3Rpb24odCkgewogICAgICB2YXIgZSA9IHQgfHwge30sIHMgPSBudWxsOwogICAgICBpZiAoZS5pdGVtSWQgPyBzID0gdGhpcy5nZXRJdGVtKGUuaXRlbUlkKSA6IHMgPSB0aGlzLmdldFByaW1hcnlJdGVtKCksIHMgPT0gbnVsbCkKICAgICAgICByZXR1cm4gbnVsbDsKICAgICAgdmFyIGggPSBuZXcgeSgpOwogICAgICBoLmRpc2NhcmRNZGF0RGF0YSA9IGZhbHNlOwogICAgICB2YXIgbCA9IHsgdHlwZTogcy50eXBlLCBkZXNjcmlwdGlvbl9ib3hlczogcy5wcm9wZXJ0aWVzLmJveGVzIH07CiAgICAgIHMucHJvcGVydGllcy5pc3BlICYmIChsLndpZHRoID0gcy5wcm9wZXJ0aWVzLmlzcGUuaW1hZ2Vfd2lkdGgsIGwuaGVpZ2h0ID0gcy5wcm9wZXJ0aWVzLmlzcGUuaW1hZ2VfaGVpZ2h0KTsKICAgICAgdmFyIHAgPSBoLmFkZFRyYWNrKGwpOwogICAgICByZXR1cm4gcCA/IChoLmFkZFNhbXBsZShwLCBzLmRhdGEpLCBoKSA6IG51bGw7CiAgICB9LCB5LnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgZm9yICh2YXIgZSA9IDA7IGUgPCB0aGlzLmJveGVzLmxlbmd0aDsgZSsrKQogICAgICAgIHRoaXMuYm94ZXNbZV0ud3JpdGUodCk7CiAgICB9LCB5LnByb3RvdHlwZS5jcmVhdGVGcmFnbWVudCA9IGZ1bmN0aW9uKHQsIGUsIHMpIHsKICAgICAgdmFyIGggPSB0aGlzLmdldFRyYWNrQnlJZCh0KSwgbCA9IHRoaXMuZ2V0U2FtcGxlKGgsIGUpOwogICAgICBpZiAobCA9PSBudWxsKQogICAgICAgIHJldHVybiB0aGlzLnNldE5leHRTZWVrUG9zaXRpb25Gcm9tU2FtcGxlKGguc2FtcGxlc1tlXSksIG51bGw7CiAgICAgIHZhciBwID0gcyB8fCBuZXcgbigpOwogICAgICBwLmVuZGlhbm5lc3MgPSBuLkJJR19FTkRJQU47CiAgICAgIHZhciBfID0gdGhpcy5jcmVhdGVTaW5nbGVTYW1wbGVNb29mKGwpOwogICAgICBfLndyaXRlKHApLCBfLnRyYWZzWzBdLnRydW5zWzBdLmRhdGFfb2Zmc2V0ID0gXy5zaXplICsgOCwgYS5kZWJ1ZygiTVA0Qm94IiwgIkFkanVzdGluZyBkYXRhX29mZnNldCB3aXRoIG5ldyB2YWx1ZSAiICsgXy50cmFmc1swXS50cnVuc1swXS5kYXRhX29mZnNldCksIHAuYWRqdXN0VWludDMyKF8udHJhZnNbMF0udHJ1bnNbMF0uZGF0YV9vZmZzZXRfcG9zaXRpb24sIF8udHJhZnNbMF0udHJ1bnNbMF0uZGF0YV9vZmZzZXQpOwogICAgICB2YXIgbSA9IG5ldyByLm1kYXRCb3goKTsKICAgICAgcmV0dXJuIG0uZGF0YSA9IGwuZGF0YSwgbS53cml0ZShwKSwgcDsKICAgIH0sIHkud3JpdGVJbml0aWFsaXphdGlvblNlZ21lbnQgPSBmdW5jdGlvbih0LCBlLCBzLCBoKSB7CiAgICAgIHZhciBsOwogICAgICBhLmRlYnVnKCJJU09GaWxlIiwgIkdlbmVyYXRpbmcgaW5pdGlhbGl6YXRpb24gc2VnbWVudCIpOwogICAgICB2YXIgcCA9IG5ldyBuKCk7CiAgICAgIHAuZW5kaWFubmVzcyA9IG4uQklHX0VORElBTiwgdC53cml0ZShwKTsKICAgICAgdmFyIF8gPSBlLmFkZCgibXZleCIpOwogICAgICBmb3IgKHMgJiYgXy5hZGQoIm1laGQiKS5zZXQoImZyYWdtZW50X2R1cmF0aW9uIiwgcyksIGwgPSAwOyBsIDwgZS50cmFrcy5sZW5ndGg7IGwrKykKICAgICAgICBfLmFkZCgidHJleCIpLnNldCgidHJhY2tfaWQiLCBlLnRyYWtzW2xdLnRraGQudHJhY2tfaWQpLnNldCgiZGVmYXVsdF9zYW1wbGVfZGVzY3JpcHRpb25faW5kZXgiLCAxKS5zZXQoImRlZmF1bHRfc2FtcGxlX2R1cmF0aW9uIiwgaCkuc2V0KCJkZWZhdWx0X3NhbXBsZV9zaXplIiwgMCkuc2V0KCJkZWZhdWx0X3NhbXBsZV9mbGFncyIsIDY1NTM2KTsKICAgICAgcmV0dXJuIGUud3JpdGUocCksIHAuYnVmZmVyOwogICAgfSwgeS5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdmFyIGUgPSBuZXcgbigpOwogICAgICBlLmVuZGlhbm5lc3MgPSBuLkJJR19FTkRJQU4sIHRoaXMud3JpdGUoZSksIGUuc2F2ZSh0KTsKICAgIH0sIHkucHJvdG90eXBlLmdldEJ1ZmZlciA9IGZ1bmN0aW9uKCkgewogICAgICB2YXIgdCA9IG5ldyBuKCk7CiAgICAgIHJldHVybiB0LmVuZGlhbm5lc3MgPSBuLkJJR19FTkRJQU4sIHRoaXMud3JpdGUodCksIHQuYnVmZmVyOwogICAgfSwgeS5wcm90b3R5cGUuaW5pdGlhbGl6ZVNlZ21lbnRhdGlvbiA9IGZ1bmN0aW9uKCkgewogICAgICB2YXIgdCwgZSwgcywgaDsKICAgICAgZm9yICh0aGlzLm9uU2VnbWVudCA9PT0gbnVsbCAmJiBhLndhcm4oIk1QNEJveCIsICJObyBzZWdtZW50YXRpb24gY2FsbGJhY2sgc2V0ISIpLCB0aGlzLmlzRnJhZ21lbnRhdGlvbkluaXRpYWxpemVkIHx8ICh0aGlzLmlzRnJhZ21lbnRhdGlvbkluaXRpYWxpemVkID0gdHJ1ZSwgdGhpcy5uZXh0TW9vZk51bWJlciA9IDAsIHRoaXMucmVzZXRUYWJsZXMoKSksIGUgPSBbXSwgdCA9IDA7IHQgPCB0aGlzLmZyYWdtZW50ZWRUcmFja3MubGVuZ3RoOyB0KyspIHsKICAgICAgICB2YXIgbCA9IG5ldyByLm1vb3ZCb3goKTsKICAgICAgICBsLm12aGQgPSB0aGlzLm1vb3YubXZoZCwgbC5ib3hlcy5wdXNoKGwubXZoZCksIHMgPSB0aGlzLmdldFRyYWNrQnlJZCh0aGlzLmZyYWdtZW50ZWRUcmFja3NbdF0uaWQpLCBsLmJveGVzLnB1c2gocyksIGwudHJha3MucHVzaChzKSwgaCA9IHt9LCBoLmlkID0gcy50a2hkLnRyYWNrX2lkLCBoLnVzZXIgPSB0aGlzLmZyYWdtZW50ZWRUcmFja3NbdF0udXNlciwgaC5idWZmZXIgPSB5LndyaXRlSW5pdGlhbGl6YXRpb25TZWdtZW50KHRoaXMuZnR5cCwgbCwgdGhpcy5tb292Lm12ZXggJiYgdGhpcy5tb292Lm12ZXgubWVoZCA/IHRoaXMubW9vdi5tdmV4Lm1laGQuZnJhZ21lbnRfZHVyYXRpb24gOiB2b2lkIDAsIHRoaXMubW9vdi50cmFrc1t0XS5zYW1wbGVzLmxlbmd0aCA+IDAgPyB0aGlzLm1vb3YudHJha3NbdF0uc2FtcGxlc1swXS5kdXJhdGlvbiA6IDApLCBlLnB1c2goaCk7CiAgICAgIH0KICAgICAgcmV0dXJuIGU7CiAgICB9LCByLkJveC5wcm90b3R5cGUucHJpbnRIZWFkZXIgPSBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMuc2l6ZSArPSA4LCB0aGlzLnNpemUgPiB1ICYmICh0aGlzLnNpemUgKz0gOCksIHRoaXMudHlwZSA9PT0gInV1aWQiICYmICh0aGlzLnNpemUgKz0gMTYpLCB0LmxvZyh0LmluZGVudCArICJzaXplOiIgKyB0aGlzLnNpemUpLCB0LmxvZyh0LmluZGVudCArICJ0eXBlOiIgKyB0aGlzLnR5cGUpOwogICAgfSwgci5GdWxsQm94LnByb3RvdHlwZS5wcmludEhlYWRlciA9IGZ1bmN0aW9uKHQpIHsKICAgICAgdGhpcy5zaXplICs9IDQsIHIuQm94LnByb3RvdHlwZS5wcmludEhlYWRlci5jYWxsKHRoaXMsIHQpLCB0LmxvZyh0LmluZGVudCArICJ2ZXJzaW9uOiIgKyB0aGlzLnZlcnNpb24pLCB0LmxvZyh0LmluZGVudCArICJmbGFnczoiICsgdGhpcy5mbGFncyk7CiAgICB9LCByLkJveC5wcm90b3R5cGUucHJpbnQgPSBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMucHJpbnRIZWFkZXIodCk7CiAgICB9LCByLkNvbnRhaW5lckJveC5wcm90b3R5cGUucHJpbnQgPSBmdW5jdGlvbih0KSB7CiAgICAgIHRoaXMucHJpbnRIZWFkZXIodCk7CiAgICAgIGZvciAodmFyIGUgPSAwOyBlIDwgdGhpcy5ib3hlcy5sZW5ndGg7IGUrKykKICAgICAgICBpZiAodGhpcy5ib3hlc1tlXSkgewogICAgICAgICAgdmFyIHMgPSB0LmluZGVudDsKICAgICAgICAgIHQuaW5kZW50ICs9ICIgIiwgdGhpcy5ib3hlc1tlXS5wcmludCh0KSwgdC5pbmRlbnQgPSBzOwogICAgICAgIH0KICAgIH0sIHkucHJvdG90eXBlLnByaW50ID0gZnVuY3Rpb24odCkgewogICAgICB0LmluZGVudCA9ICIiOwogICAgICBmb3IgKHZhciBlID0gMDsgZSA8IHRoaXMuYm94ZXMubGVuZ3RoOyBlKyspCiAgICAgICAgdGhpcy5ib3hlc1tlXSAmJiB0aGlzLmJveGVzW2VdLnByaW50KHQpOwogICAgfSwgci5tdmhkQm94LnByb3RvdHlwZS5wcmludCA9IGZ1bmN0aW9uKHQpIHsKICAgICAgci5GdWxsQm94LnByb3RvdHlwZS5wcmludEhlYWRlci5jYWxsKHRoaXMsIHQpLCB0LmxvZyh0LmluZGVudCArICJjcmVhdGlvbl90aW1lOiAiICsgdGhpcy5jcmVhdGlvbl90aW1lKSwgdC5sb2codC5pbmRlbnQgKyAibW9kaWZpY2F0aW9uX3RpbWU6ICIgKyB0aGlzLm1vZGlmaWNhdGlvbl90aW1lKSwgdC5sb2codC5pbmRlbnQgKyAidGltZXNjYWxlOiAiICsgdGhpcy50aW1lc2NhbGUpLCB0LmxvZyh0LmluZGVudCArICJkdXJhdGlvbjogIiArIHRoaXMuZHVyYXRpb24pLCB0LmxvZyh0LmluZGVudCArICJyYXRlOiAiICsgdGhpcy5yYXRlKSwgdC5sb2codC5pbmRlbnQgKyAidm9sdW1lOiAiICsgKHRoaXMudm9sdW1lID4+IDgpKSwgdC5sb2codC5pbmRlbnQgKyAibWF0cml4OiAiICsgdGhpcy5tYXRyaXguam9pbigiLCAiKSksIHQubG9nKHQuaW5kZW50ICsgIm5leHRfdHJhY2tfaWQ6ICIgKyB0aGlzLm5leHRfdHJhY2tfaWQpOwogICAgfSwgci50a2hkQm94LnByb3RvdHlwZS5wcmludCA9IGZ1bmN0aW9uKHQpIHsKICAgICAgci5GdWxsQm94LnByb3RvdHlwZS5wcmludEhlYWRlci5jYWxsKHRoaXMsIHQpLCB0LmxvZyh0LmluZGVudCArICJjcmVhdGlvbl90aW1lOiAiICsgdGhpcy5jcmVhdGlvbl90aW1lKSwgdC5sb2codC5pbmRlbnQgKyAibW9kaWZpY2F0aW9uX3RpbWU6ICIgKyB0aGlzLm1vZGlmaWNhdGlvbl90aW1lKSwgdC5sb2codC5pbmRlbnQgKyAidHJhY2tfaWQ6ICIgKyB0aGlzLnRyYWNrX2lkKSwgdC5sb2codC5pbmRlbnQgKyAiZHVyYXRpb246ICIgKyB0aGlzLmR1cmF0aW9uKSwgdC5sb2codC5pbmRlbnQgKyAidm9sdW1lOiAiICsgKHRoaXMudm9sdW1lID4+IDgpKSwgdC5sb2codC5pbmRlbnQgKyAibWF0cml4OiAiICsgdGhpcy5tYXRyaXguam9pbigiLCAiKSksIHQubG9nKHQuaW5kZW50ICsgImxheWVyOiAiICsgdGhpcy5sYXllciksIHQubG9nKHQuaW5kZW50ICsgImFsdGVybmF0ZV9ncm91cDogIiArIHRoaXMuYWx0ZXJuYXRlX2dyb3VwKSwgdC5sb2codC5pbmRlbnQgKyAid2lkdGg6ICIgKyB0aGlzLndpZHRoKSwgdC5sb2codC5pbmRlbnQgKyAiaGVpZ2h0OiAiICsgdGhpcy5oZWlnaHQpOwogICAgfTsKICAgIHZhciBBID0ge307CiAgICBBLmNyZWF0ZUZpbGUgPSBmdW5jdGlvbih0LCBlKSB7CiAgICAgIHZhciBzID0gdCAhPT0gdm9pZCAwID8gdCA6IHRydWUsIGggPSBuZXcgeShlKTsKICAgICAgcmV0dXJuIGguZGlzY2FyZE1kYXREYXRhID0gIXMsIGg7CiAgICB9LCBkLmNyZWF0ZUZpbGUgPSBBLmNyZWF0ZUZpbGU7CiAgfSkoVGkpOwogIGNvbnN0IEggPSAvKiBAX19QVVJFX18gKi8gVWkoVGkpLCBSID0gewogICAgc2FtcGxlUmF0ZTogNDhlMywKICAgIGNoYW5uZWxDb3VudDogMiwKICAgIGNvZGVjOiAibXA0YS40MC4yIgogIH07CiAgdmFyIEx0LCBkdCwgVXQsIGl0LCBrZSwgQ2ksIFR0LCBzdDsKICBjb25zdCBodCA9IGNsYXNzIGh0MiB7CiAgICBjb25zdHJ1Y3RvcihhLCBvID0ge30pIHsKICAgICAgVSh0aGlzLCBrZSk7CiAgICAgIEYodGhpcywgInJlYWR5Iik7CiAgICAgIFUodGhpcywgTHQsIHsKICAgICAgICAvLyDlvq7np5IKICAgICAgICBkdXJhdGlvbjogMCwKICAgICAgICB3aWR0aDogMCwKICAgICAgICBoZWlnaHQ6IDAKICAgICAgfSk7CiAgICAgIFUodGhpcywgZHQsIG5ldyBGbG9hdDMyQXJyYXkoKSk7CiAgICAgIFUodGhpcywgVXQsIG5ldyBGbG9hdDMyQXJyYXkoKSk7CiAgICAgIFUodGhpcywgaXQsIHZvaWQgMCk7CiAgICAgIFUodGhpcywgVHQsIDApOwogICAgICBVKHRoaXMsIHN0LCAwKTsKICAgICAgeCh0aGlzLCBpdCwgewogICAgICAgIGxvb3A6IGZhbHNlLAogICAgICAgIHZvbHVtZTogMSwKICAgICAgICAuLi5vCiAgICAgIH0pLCB0aGlzLnJlYWR5ID0gSHQodGhpcywga2UsIENpKS5jYWxsKHRoaXMsIGEpLnRoZW4oKCkgPT4gKHsKICAgICAgICAvLyBhdWRpbyDmsqHmnInlrr3pq5jvvIzml6DpnIDnu5jliLYKICAgICAgICB3aWR0aDogMCwKICAgICAgICBoZWlnaHQ6IDAsCiAgICAgICAgZHVyYXRpb246IG8ubG9vcCA/IDEgLyAwIDogZyh0aGlzLCBMdCkuZHVyYXRpb24KICAgICAgfSkpOwogICAgfQogICAgZ2V0IG1ldGEoKSB7CiAgICAgIHJldHVybiB7CiAgICAgICAgZHVyYXRpb246IGcodGhpcywgTHQpLmR1cmF0aW9uLAogICAgICAgIHNhbXBsZVJhdGU6IFIuc2FtcGxlUmF0ZSwKICAgICAgICBjaGFuQ291bnQ6IDIKICAgICAgfTsKICAgIH0KICAgIGdldFBDTURhdGEoKSB7CiAgICAgIHJldHVybiBbZyh0aGlzLCBkdCksIGcodGhpcywgVXQpXTsKICAgIH0KICAgIC8qKgogICAgICogUmV0dXJuIHRoZSBhdWRpbyBQQ00gZGF0YSBjb3JyZXNwb25kaW5nIHRvIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIGxhc3QgYW5kIGN1cnJlbnQgbW9tZW50cy4gSWYgdGhlIGRpZmZlcmVuY2UgZXhjZWVkcyAzIHNlY29uZHMgb3IgdGhlIGN1cnJlbnQgdGltZSBpcyBsZXNzIHRoYW4gdGhlIHByZXZpb3VzIHRpbWUsIHJlc2V0IHRoZSBzdGF0ZS4KICAgICAqIENOOiDov5Tlm57kuIrmrKHkuI7lvZPliY3ml7bliLvlt67lr7nlupTnmoTpn7PpopEgUENNIOaVsOaNru+8m+iLpeW3ruWAvOi2hei/hyAzcyDmiJblvZPliY3ml7bpl7TlsI/kuo7kuIrmrKHml7bpl7TvvIzliJnph43nva7nirbmgIEKICAgICAqLwogICAgYXN5bmMgdGljayhhKSB7CiAgICAgIGlmICghZyh0aGlzLCBpdCkubG9vcCAmJiBhID49IGcodGhpcywgTHQpLmR1cmF0aW9uKQogICAgICAgIHJldHVybiB7IGF1ZGlvOiBbXSwgc3RhdGU6ICJkb25lIiB9OwogICAgICBjb25zdCBvID0gYSAtIGcodGhpcywgVHQpOwogICAgICBpZiAoYSA8IGcodGhpcywgVHQpIHx8IG8gPiAzZTYpCiAgICAgICAgcmV0dXJuIHgodGhpcywgVHQsIGEpLCB4KHRoaXMsIHN0LCBNYXRoLmNlaWwoCiAgICAgICAgICBnKHRoaXMsIFR0KSAvIDFlNiAqIFIuc2FtcGxlUmF0ZQogICAgICAgICkpLCB7CiAgICAgICAgICBhdWRpbzogW25ldyBGbG9hdDMyQXJyYXkoMCksIG5ldyBGbG9hdDMyQXJyYXkoMCldLAogICAgICAgICAgc3RhdGU6ICJzdWNjZXNzIgogICAgICAgIH07CiAgICAgIHgodGhpcywgVHQsIGEpOwogICAgICBjb25zdCBuID0gTWF0aC5jZWlsKAogICAgICAgIG8gLyAxZTYgKiBSLnNhbXBsZVJhdGUKICAgICAgKSwgdSA9IGcodGhpcywgc3QpICsgbiwgZiA9IGcodGhpcywgaXQpLmxvb3AgPyBbCiAgICAgICAgdGkoZyh0aGlzLCBkdCksIGcodGhpcywgc3QpLCB1KSwKICAgICAgICB0aShnKHRoaXMsIFV0KSwgZyh0aGlzLCBzdCksIHUpCiAgICAgIF0gOiBbCiAgICAgICAgZyh0aGlzLCBkdCkuc2xpY2UoZyh0aGlzLCBzdCksIHUpLAogICAgICAgIGcodGhpcywgVXQpLnNsaWNlKGcodGhpcywgc3QpLCB1KQogICAgICBdOwogICAgICByZXR1cm4geCh0aGlzLCBzdCwgdSksIHsgYXVkaW86IGYsIHN0YXRlOiAic3VjY2VzcyIgfTsKICAgIH0KICAgIGFzeW5jIHNwbGl0KGEpIHsKICAgICAgYXdhaXQgdGhpcy5yZWFkeTsKICAgICAgY29uc3QgbyA9IE1hdGguY2VpbChhIC8gMWU2ICogUi5zYW1wbGVSYXRlKSwgbiA9IG5ldyBodDIoCiAgICAgICAgdGhpcy5nZXRQQ01EYXRhKCkubWFwKChmKSA9PiBmLnNsaWNlKDAsIG8pKSwKICAgICAgICBnKHRoaXMsIGl0KQogICAgICApLCB1ID0gbmV3IGh0MigKICAgICAgICB0aGlzLmdldFBDTURhdGEoKS5tYXAoKGYpID0+IGYuc2xpY2UobykpLAogICAgICAgIGcodGhpcywgaXQpCiAgICAgICk7CiAgICAgIHJldHVybiBbbiwgdV07CiAgICB9CiAgICBhc3luYyBjbG9uZSgpIHsKICAgICAgcmV0dXJuIG5ldyBodDIodGhpcy5nZXRQQ01EYXRhKCksIGcodGhpcywgaXQpKTsKICAgIH0KICAgIGRlc3Ryb3koKSB7CiAgICAgIHgodGhpcywgZHQsIG5ldyBGbG9hdDMyQXJyYXkoMCkpLCB4KHRoaXMsIFV0LCBuZXcgRmxvYXQzMkFycmF5KDApKSwgQi5pbmZvKCItLS0tIGF1ZGlvY2xpcCBkZXN0cm95IC0tLS0iKTsKICAgIH0KICB9OwogIEx0ID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCksIGR0ID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCksIFV0ID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCksIGl0ID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCksIGtlID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrU2V0KCksIENpID0gYXN5bmMgZnVuY3Rpb24oYSkgewogICAgaHQuY3R4ID09IG51bGwgJiYgKGh0LmN0eCA9IG5ldyBBdWRpb0NvbnRleHQoewogICAgICBzYW1wbGVSYXRlOiBSLnNhbXBsZVJhdGUKICAgIH0pKTsKICAgIGNvbnN0IG8gPSBwZXJmb3JtYW5jZS5ub3coKSwgbiA9IGEgaW5zdGFuY2VvZiBSZWFkYWJsZVN0cmVhbSA/IGF3YWl0IHdzKGEsIGh0LmN0eCkgOiBhOwogICAgQi5pbmZvKCJBdWRpbyBjbGlwIGRlY29kZWQgY29tcGxldGU6IiwgcGVyZm9ybWFuY2Uubm93KCkgLSBvKTsKICAgIGNvbnN0IHUgPSBnKHRoaXMsIGl0KS52b2x1bWU7CiAgICBpZiAodSAhPT0gMSkKICAgICAgZm9yIChjb25zdCBmIG9mIG4pCiAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBmLmxlbmd0aDsgYyArPSAxKQogICAgICAgICAgZltjXSAqPSB1OwogICAgZyh0aGlzLCBMdCkuZHVyYXRpb24gPSBuWzBdLmxlbmd0aCAvIFIuc2FtcGxlUmF0ZSAqIDFlNiwgeCh0aGlzLCBkdCwgblswXSksIHgodGhpcywgVXQsIG5bMV0gPz8gZyh0aGlzLCBkdCkpLCBCLmluZm8oCiAgICAgICJBdWRpbyBjbGlwIGNvbnZlcnQgdG8gQXVkaW9EYXRhLCB0aW1lOiIsCiAgICAgIHBlcmZvcm1hbmNlLm5vdygpIC0gbwogICAgKTsKICB9LCBUdCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpLCBzdCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpLCBGKGh0LCAiY3R4IiwgbnVsbCk7CiAgYXN5bmMgZnVuY3Rpb24gd3MoZCwgYSkgewogICAgY29uc3QgbyA9IGF3YWl0IG5ldyBSZXNwb25zZShkKS5hcnJheUJ1ZmZlcigpOwogICAgcmV0dXJuIG9pKGF3YWl0IGEuZGVjb2RlQXVkaW9EYXRhKG8pKTsKICB9CiAgdmFyIHB0OwogIGNsYXNzIEZpIHsKICAgIGNvbnN0cnVjdG9yKCkgewogICAgICBVKHRoaXMsIHB0LCAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpKTsKICAgICAgRih0aGlzLCAib24iLCAoYSwgbykgPT4gewogICAgICAgIGNvbnN0IG4gPSBnKHRoaXMsIHB0KS5nZXQoYSkgPz8gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTsKICAgICAgICByZXR1cm4gbi5hZGQobyksIGcodGhpcywgcHQpLmhhcyhhKSB8fCBnKHRoaXMsIHB0KS5zZXQoYSwgbiksICgpID0+IHsKICAgICAgICAgIG4uZGVsZXRlKG8pLCBuLnNpemUgPT09IDAgJiYgZyh0aGlzLCBwdCkuZGVsZXRlKGEpOwogICAgICAgIH07CiAgICAgIH0pOwogICAgICBGKHRoaXMsICJvbmNlIiwgKGEsIG8pID0+IHsKICAgICAgICBjb25zdCBuID0gdGhpcy5vbihhLCAoLi4udSkgPT4gewogICAgICAgICAgbigpLCBvKC4uLnUpOwogICAgICAgIH0pOwogICAgICAgIHJldHVybiBuOwogICAgICB9KTsKICAgICAgRih0aGlzLCAiZW1pdCIsIChhLCAuLi5vKSA9PiB7CiAgICAgICAgY29uc3QgbiA9IGcodGhpcywgcHQpLmdldChhKTsKICAgICAgICBuICE9IG51bGwgJiYgbi5mb3JFYWNoKCh1KSA9PiB1KC4uLm8pKTsKICAgICAgfSk7CiAgICB9CiAgICBkZXN0cm95KCkgewogICAgICBnKHRoaXMsIHB0KS5jbGVhcigpOwogICAgfQogIH0KICBwdCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpOwogICgoKSA9PiB7CiAgICBjb25zdCBkID0ge307CiAgICBzZWxmLm9ubWVzc2FnZSA9IGFzeW5jIChhKSA9PiB7CiAgICAgIHZhciBvOwogICAgICBjb25zdCB7IGV2dFR5cGU6IG4sIGFyZ3M6IHUgfSA9IGEuZGF0YTsKICAgICAgbGV0IGYgPSBkW3UuZmlsZVBhdGhdOwogICAgICB0cnkgewogICAgICAgIGxldCBjOwogICAgICAgIGNvbnN0IHIgPSBbXTsKICAgICAgICBpZiAobiA9PT0gInJlZ2lzdGVyIikKICAgICAgICAgIGYgPSBhd2FpdCB1LmZpbGVIYW5kbGUuY3JlYXRlU3luY0FjY2Vzc0hhbmRsZSgpLCBkW3UuZmlsZVBhdGhdID0gZjsKICAgICAgICBlbHNlIGlmIChuID09PSAiY2xvc2UiKQogICAgICAgICAgZi5jbG9zZSgpLCBkZWxldGUgZFt1LmZpbGVQYXRoXTsKICAgICAgICBlbHNlIGlmIChuID09PSAidHJ1bmNhdGUiKQogICAgICAgICAgZi50cnVuY2F0ZSh1Lm5ld1NpemUpOwogICAgICAgIGVsc2UgaWYgKG4gPT09ICJ3cml0ZSIpIHsKICAgICAgICAgIGNvbnN0IHsgZGF0YTogYiwgb3B0czogdiB9ID0gYS5kYXRhLmFyZ3M7CiAgICAgICAgICBjID0gZi53cml0ZShiLCB2KTsKICAgICAgICB9IGVsc2UgaWYgKG4gPT09ICJyZWFkIikgewogICAgICAgICAgY29uc3QgeyBvZmZzZXQ6IGIsIHNpemU6IHYgfSA9IGEuZGF0YS5hcmdzLCB5ID0gbmV3IEFycmF5QnVmZmVyKHYpLCBBID0gZi5yZWFkKHksIHsgYXQ6IGIgfSk7CiAgICAgICAgICBjID0gQSA9PT0gdiA/IHkgOiAoCiAgICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgdHJhbnNmZXIgc3VwcG9ydCBieSBjaHJvbWUgMTE0CiAgICAgICAgICAgICgobyA9IHkudHJhbnNmZXIpID09IG51bGwgPyB2b2lkIDAgOiBvLmNhbGwoeSwgQSkpID8/IHkuc2xpY2UoMCwgQSkKICAgICAgICAgICksIHIucHVzaChjKTsKICAgICAgICB9IGVsc2UKICAgICAgICAgIG4gPT09ICJnZXRTaXplIiA/IGMgPSBmLmdldFNpemUoKSA6IG4gPT09ICJmbHVzaCIgJiYgZi5mbHVzaCgpOwogICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoCiAgICAgICAgICB7CiAgICAgICAgICAgIGV2dFR5cGU6ICJjYWxsYmFjayIsCiAgICAgICAgICAgIGNiSWQ6IGEuZGF0YS5jYklkLAogICAgICAgICAgICByZXR1cm5WYWw6IGMKICAgICAgICAgIH0sCiAgICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yCiAgICAgICAgICByCiAgICAgICAgKTsKICAgICAgfSBjYXRjaCAoYykgewogICAgICAgIGNvbnN0IHIgPSBjOwogICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoewogICAgICAgICAgZXZ0VHlwZTogInRocm93RXJyb3IiLAogICAgICAgICAgY2JJZDogYS5kYXRhLmNiSWQsCiAgICAgICAgICBlcnJNc2c6IHIubmFtZSArICI6ICIgKyByLm1lc3NhZ2UgKyBgCmAgKyBKU09OLnN0cmluZ2lmeShhLmRhdGEpCiAgICAgICAgfSk7CiAgICAgIH0KICAgIH07CiAgfSkudG9TdHJpbmcoKTsKICBmdW5jdGlvbiBMcyhkKSB7CiAgICBCLmluZm8oInJlY29kZW11eCBvcHRzOiIsIGQpOwogICAgY29uc3QgYSA9IEguY3JlYXRlRmlsZSgpLCBvID0gbmV3IEZpKCk7CiAgICBsZXQgbiA9IGQudmlkZW8gIT0gbnVsbCA/IGtzKGQudmlkZW8sIGEsIG8pIDogbnVsbCwgdSA9IGQuYXVkaW8gIT0gbnVsbCA/IE5zKGQuYXVkaW8sIGEsIG8pIDogbnVsbDsKICAgIHJldHVybiBkLnZpZGVvID09IG51bGwgJiYgby5lbWl0KCJWaWRlb1JlYWR5IiksIGQuYXVkaW8gPT0gbnVsbCAmJiBvLmVtaXQoIkF1ZGlvUmVhZHkiKSwgewogICAgICBlbmNvZGVWaWRlbzogKGYsIGMpID0+IHsKICAgICAgICBuID09IG51bGwgfHwgbi5lbmNvZGUoZiwgYyksIGYuY2xvc2UoKTsKICAgICAgfSwKICAgICAgZW5jb2RlQXVkaW86IChmKSA9PiB7CiAgICAgICAgdSAhPSBudWxsICYmICh1LmVuY29kZShmKSwgZi5jbG9zZSgpKTsKICAgICAgfSwKICAgICAgZ2V0RWVjb2RlUXVldWVTaXplOiAoKSA9PiAobiA9PSBudWxsID8gdm9pZCAwIDogbi5lbmNvZGVRdWV1ZVNpemUpID8/ICh1ID09IG51bGwgPyB2b2lkIDAgOiB1LmVuY29kZVF1ZXVlU2l6ZSkgPz8gMCwKICAgICAgZmx1c2g6IGFzeW5jICgpID0+IHsKICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChbCiAgICAgICAgICAobiA9PSBudWxsID8gdm9pZCAwIDogbi5zdGF0ZSkgPT09ICJjb25maWd1cmVkIiA/IG4uZmx1c2goKSA6IG51bGwsCiAgICAgICAgICAodSA9PSBudWxsID8gdm9pZCAwIDogdS5zdGF0ZSkgPT09ICJjb25maWd1cmVkIiA/IHUuZmx1c2goKSA6IG51bGwKICAgICAgICBdKTsKICAgICAgfSwKICAgICAgY2xvc2U6ICgpID0+IHsKICAgICAgICBvLmRlc3Ryb3koKSwgKG4gPT0gbnVsbCA/IHZvaWQgMCA6IG4uc3RhdGUpID09PSAiY29uZmlndXJlZCIgJiYgbi5jbG9zZSgpLCAodSA9PSBudWxsID8gdm9pZCAwIDogdS5zdGF0ZSkgPT09ICJjb25maWd1cmVkIiAmJiB1LmNsb3NlKCk7CiAgICAgIH0sCiAgICAgIG1wNGZpbGU6IGEKICAgIH07CiAgfQogIGZ1bmN0aW9uIGtzKGQsIGEsIG8pIHsKICAgIGNvbnN0IG4gPSB7CiAgICAgIC8vIOW+ruenkgogICAgICB0aW1lc2NhbGU6IDFlNiwKICAgICAgd2lkdGg6IGQud2lkdGgsCiAgICAgIGhlaWdodDogZC5oZWlnaHQsCiAgICAgIGJyYW5kczogWyJpc29tIiwgImlzbzIiLCAiYXZjMSIsICJtcDQyIiwgIm1wNDEiXSwKICAgICAgYXZjRGVjb2RlckNvbmZpZ1JlY29yZDogbnVsbAogICAgfTsKICAgIGxldCB1ID0gLTEsIGYgPSBbXSwgYyA9IGZhbHNlOwogICAgcmV0dXJuIG8ub25jZSgiQXVkaW9SZWFkeSIsICgpID0+IHsKICAgICAgYyA9IHRydWUsIGYuZm9yRWFjaCgoYikgPT4gewogICAgICAgIGNvbnN0IHYgPSB1ZShiKTsKICAgICAgICBhLmFkZFNhbXBsZSh1LCB2LmRhdGEsIHYpOwogICAgICB9KSwgZiA9IFtdOwogICAgfSksIE9zKGQsIChiLCB2KSA9PiB7CiAgICAgIHZhciB5OwogICAgICBpZiAodSA9PT0gLTEgJiYgdiAhPSBudWxsICYmIChuLmF2Y0RlY29kZXJDb25maWdSZWNvcmQgPSAoeSA9IHYuZGVjb2RlckNvbmZpZykgPT0gbnVsbCA/IHZvaWQgMCA6IHkuZGVzY3JpcHRpb24sIHUgPSBhLmFkZFRyYWNrKG4pLCBvLmVtaXQoIlZpZGVvUmVhZHkiKSwgQi5pbmZvKCJWaWRlb0VuY29kZXIsIHZpZGVvIHRyYWNrIHJlYWR5LCB0cmFja0lkOiIsIHUpKSwgYykgewogICAgICAgIGNvbnN0IEEgPSB1ZShiKTsKICAgICAgICBhLmFkZFNhbXBsZSh1LCBBLmRhdGEsIEEpOwogICAgICB9IGVsc2UKICAgICAgICBmLnB1c2goYik7CiAgICB9KTsKICB9CiAgZnVuY3Rpb24gT3MoZCwgYSkgewogICAgY29uc3QgbyA9IG5ldyBWaWRlb0VuY29kZXIoewogICAgICBlcnJvcjogQi5lcnJvciwKICAgICAgb3V0cHV0OiBhCiAgICB9KTsKICAgIHJldHVybiBvLmNvbmZpZ3VyZSh7CiAgICAgIGNvZGVjOiBkLmNvZGVjLAogICAgICBmcmFtZXJhdGU6IGQuZXhwZWN0RlBTLAogICAgICAvLyBoYXJkd2FyZUFjY2VsZXJhdGlvbjogJ3ByZWZlci1oYXJkd2FyZScsCiAgICAgIC8vIOeggeeOhwogICAgICBiaXRyYXRlOiBkLmJpdHJhdGUsCiAgICAgIHdpZHRoOiBkLndpZHRoLAogICAgICBoZWlnaHQ6IGQuaGVpZ2h0LAogICAgICAvLyBIMjY0IOS4jeaUr+aMgeiDjOaZr+mAj+aYjuW6pgogICAgICBhbHBoYTogImRpc2NhcmQiLAogICAgICAvLyBtYWNvcyDoh6rluKbmkq3mlL7lmajlj6rmlK/mjIFhdmMKICAgICAgYXZjOiB7IGZvcm1hdDogImF2YyIgfQogICAgICAvLyBtcDRib3guanMg5peg5rOV6Kej5p6QIGFubmV4YiDnmoQgbWltZUNvZGVjIO+8jOWPquS8muaYvuekuiBhdmMxCiAgICAgIC8vIGF2YzogeyBmb3JtYXQ6ICdhbm5leGInIH0KICAgIH0pLCBvOwogIH0KICBmdW5jdGlvbiBOcyhkLCBhLCBvKSB7CiAgICBjb25zdCBuID0gewogICAgICB0aW1lc2NhbGU6IDFlNiwKICAgICAgc2FtcGxlcmF0ZTogZC5zYW1wbGVSYXRlLAogICAgICBjaGFubmVsX2NvdW50OiBkLmNoYW5uZWxDb3VudCwKICAgICAgaGRscjogInNvdW4iLAogICAgICB0eXBlOiBkLmNvZGVjID09PSAiYWFjIiA/ICJtcDRhIiA6ICJPcHVzIgogICAgfTsKICAgIGxldCB1ID0gLTEsIGYgPSBbXSwgYyA9IGZhbHNlOwogICAgby5vbmNlKCJWaWRlb1JlYWR5IiwgKCkgPT4gewogICAgICBjID0gdHJ1ZSwgZi5mb3JFYWNoKChiKSA9PiB7CiAgICAgICAgY29uc3QgdiA9IHVlKGIpOwogICAgICAgIGEuYWRkU2FtcGxlKHUsIHYuZGF0YSwgdik7CiAgICAgIH0pLCBmID0gW107CiAgICB9KTsKICAgIGNvbnN0IHIgPSBuZXcgQXVkaW9FbmNvZGVyKHsKICAgICAgZXJyb3I6IEIuZXJyb3IsCiAgICAgIG91dHB1dDogKGIsIHYpID0+IHsKICAgICAgICB2YXIgeTsKICAgICAgICBpZiAodSA9PT0gLTEpIHsKICAgICAgICAgIGNvbnN0IEEgPSAoeSA9IHYuZGVjb2RlckNvbmZpZykgPT0gbnVsbCA/IHZvaWQgMCA6IHkuZGVzY3JpcHRpb247CiAgICAgICAgICB1ID0gYS5hZGRUcmFjayh7CiAgICAgICAgICAgIC4uLm4sCiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBBID09IG51bGwgPyB2b2lkIDAgOiBWcyhBKQogICAgICAgICAgfSksIG8uZW1pdCgiQXVkaW9SZWFkeSIpLCBCLmluZm8oIkF1ZGlvRW5jb2RlciwgYXVkaW8gdHJhY2sgcmVhZHksIHRyYWNrSWQ6IiwgdSk7CiAgICAgICAgfQogICAgICAgIGlmIChjKSB7CiAgICAgICAgICBjb25zdCBBID0gdWUoYik7CiAgICAgICAgICBhLmFkZFNhbXBsZSh1LCBBLmRhdGEsIEEpOwogICAgICAgIH0gZWxzZQogICAgICAgICAgZi5wdXNoKGIpOwogICAgICB9CiAgICB9KTsKICAgIHJldHVybiByLmNvbmZpZ3VyZSh7CiAgICAgIGNvZGVjOiBkLmNvZGVjID09PSAiYWFjIiA/IFIuY29kZWMgOiAib3B1cyIsCiAgICAgIHNhbXBsZVJhdGU6IGQuc2FtcGxlUmF0ZSwKICAgICAgbnVtYmVyT2ZDaGFubmVsczogZC5jaGFubmVsQ291bnQsCiAgICAgIGJpdHJhdGU6IDEyOGUzCiAgICB9KSwgcjsKICB9CiAgZnVuY3Rpb24gTmkoZCwgYSwgbykgewogICAgbGV0IG4gPSAwLCB1ID0gMDsKICAgIGNvbnN0IGYgPSBkLmJveGVzLCBjID0gW10sIHIgPSAoKSA9PiB7CiAgICAgIGlmIChmLmxlbmd0aCA8IDQgfHwgdSA+PSBmLmxlbmd0aCkKICAgICAgICByZXR1cm4gbnVsbDsKICAgICAgaWYgKGMubGVuZ3RoID09PSAwKQogICAgICAgIGZvciAobGV0IGUgPSAxOyA7IGUgKz0gMSkgewogICAgICAgICAgY29uc3QgcyA9IGQuZ2V0VHJhY2tCeUlkKGUpOwogICAgICAgICAgaWYgKHMgPT0gbnVsbCkKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICBjLnB1c2goeyB0cmFjazogcywgaWQ6IGUgfSk7CiAgICAgICAgfQogICAgICBjb25zdCB0ID0gbmV3IEguRGF0YVN0cmVhbSgpOwogICAgICB0LmVuZGlhbm5lc3MgPSBILkRhdGFTdHJlYW0uQklHX0VORElBTjsKICAgICAgZm9yIChsZXQgZSA9IHU7IGUgPCBmLmxlbmd0aDsgZSsrKQogICAgICAgIGZbZV0ud3JpdGUodCksIGRlbGV0ZSBmW2VdOwogICAgICByZXR1cm4gYy5mb3JFYWNoKCh7IHRyYWNrOiBlLCBpZDogcyB9KSA9PiB7CiAgICAgICAgZC5yZWxlYXNlVXNlZFNhbXBsZXMocywgZS5zYW1wbGVzLmxlbmd0aCksIGUuc2FtcGxlcyA9IFtdOwogICAgICB9KSwgZC5tZGF0cyA9IFtdLCBkLm1vb2ZzID0gW10sIHUgPSBmLmxlbmd0aCwgbmV3IFVpbnQ4QXJyYXkodC5idWZmZXIpOwogICAgfTsKICAgIGxldCBiID0gZmFsc2UsIHYgPSBmYWxzZSwgeSA9IG51bGw7CiAgICByZXR1cm4gewogICAgICBzdHJlYW06IG5ldyBSZWFkYWJsZVN0cmVhbSh7CiAgICAgICAgc3RhcnQodCkgewogICAgICAgICAgbiA9IHNlbGYuc2V0SW50ZXJ2YWwoKCkgPT4gewogICAgICAgICAgICBjb25zdCBlID0gcigpOwogICAgICAgICAgICBlICE9IG51bGwgJiYgIXYgJiYgdC5lbnF1ZXVlKGUpOwogICAgICAgICAgfSwgYSksIHkgPSAoKSA9PiB7CiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwobiksIGQuZmx1c2goKTsKICAgICAgICAgICAgY29uc3QgZSA9IHIoKTsKICAgICAgICAgICAgZSAhPSBudWxsICYmICF2ICYmIHQuZW5xdWV1ZShlKSwgdiB8fCB0LmNsb3NlKCk7CiAgICAgICAgICB9LCBiICYmIHkoKTsKICAgICAgICB9LAogICAgICAgIGNhbmNlbCgpIHsKICAgICAgICAgIHYgPSB0cnVlLCBjbGVhckludGVydmFsKG4pLCBvID09IG51bGwgfHwgbygpOwogICAgICAgIH0KICAgICAgfSksCiAgICAgIHN0b3A6ICgpID0+IHsKICAgICAgICBiIHx8IChiID0gdHJ1ZSwgeSA9PSBudWxsIHx8IHkoKSk7CiAgICAgIH0KICAgIH07CiAgfQogIGZ1bmN0aW9uIHVlKGQpIHsKICAgIGNvbnN0IGEgPSBuZXcgQXJyYXlCdWZmZXIoZC5ieXRlTGVuZ3RoKTsKICAgIGQuY29weVRvKGEpOwogICAgY29uc3QgbyA9IGQudGltZXN0YW1wOwogICAgcmV0dXJuIHsKICAgICAgZHVyYXRpb246IGQuZHVyYXRpb24gPz8gMCwKICAgICAgZHRzOiBvLAogICAgICBjdHM6IG8sCiAgICAgIGlzX3N5bmM6IGQudHlwZSA9PT0gImtleSIsCiAgICAgIGRhdGE6IGEKICAgIH07CiAgfQogIGZ1bmN0aW9uIFZzKGQpIHsKICAgIGNvbnN0IGEgPSBkLmJ5dGVMZW5ndGgsIG8gPSBuZXcgVWludDhBcnJheShbCiAgICAgIDAsCiAgICAgIC8vIHZlcnNpb24gMAogICAgICAwLAogICAgICAwLAogICAgICAwLAogICAgICAvLyBmbGFncwogICAgICAzLAogICAgICAvLyBkZXNjcmlwdG9yX3R5cGUKICAgICAgMjMgKyBhLAogICAgICAvLyBsZW5ndGgKICAgICAgMCwKICAgICAgLy8gMHgwMSwgLy8gZXNfaWQKICAgICAgMiwKICAgICAgLy8gZXNfaWQKICAgICAgMCwKICAgICAgLy8gc3RyZWFtX3ByaW9yaXR5CiAgICAgIDQsCiAgICAgIC8vIGRlc2NyaXB0b3JfdHlwZQogICAgICAxOCArIGEsCiAgICAgIC8vIGxlbmd0aAogICAgICA2NCwKICAgICAgLy8gY29kZWMgOiBtcGVnNF9hdWRpbwogICAgICAyMSwKICAgICAgLy8gc3RyZWFtX3R5cGUKICAgICAgMCwKICAgICAgMCwKICAgICAgMCwKICAgICAgLy8gYnVmZmVyX3NpemUKICAgICAgMCwKICAgICAgMCwKICAgICAgMCwKICAgICAgMCwKICAgICAgLy8gbWF4Qml0cmF0ZQogICAgICAwLAogICAgICAwLAogICAgICAwLAogICAgICAwLAogICAgICAvLyBhdmdCaXRyYXRlCiAgICAgIDUsCiAgICAgIC8vIGRlc2NyaXB0b3JfdHlwZQogICAgICBhLAogICAgICAuLi5uZXcgVWludDhBcnJheShkIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgPyBkIDogZC5idWZmZXIpLAogICAgICA2LAogICAgICAxLAogICAgICAyCiAgICBdKSwgbiA9IG5ldyBILkJveFBhcnNlci5lc2RzQm94KG8uYnl0ZUxlbmd0aCk7CiAgICByZXR1cm4gbi5oZHJfc2l6ZSA9IDAsIG4ucGFyc2UobmV3IEguRGF0YVN0cmVhbShvLCAwLCBILkRhdGFTdHJlYW0uQklHX0VORElBTikpLCBuOwogIH0KICBjb25zdCBOID0gY2xhc3MgTjIgewogICAgY29uc3RydWN0b3IoYSwgbywgbiwgdSwgZikgewogICAgICBGKHRoaXMsICJ4IiwgMCk7CiAgICAgIEYodGhpcywgInkiLCAwKTsKICAgICAgRih0aGlzLCAidyIsIDApOwogICAgICBGKHRoaXMsICJoIiwgMCk7CiAgICAgIEYodGhpcywgImFuZ2xlIiwgMCk7CiAgICAgIEYodGhpcywgIm1hc3RlciIsIG51bGwpOwogICAgICB0aGlzLnggPSBhID8/IDAsIHRoaXMueSA9IG8gPz8gMCwgdGhpcy53ID0gbiA/PyAwLCB0aGlzLmggPSB1ID8/IDAsIHRoaXMubWFzdGVyID0gZiA/PyBudWxsOwogICAgfQogICAgZ2V0IGNlbnRlcigpIHsKICAgICAgY29uc3QgeyB4OiBhLCB5OiBvLCB3OiBuLCBoOiB1IH0gPSB0aGlzOwogICAgICByZXR1cm4geyB4OiBhICsgbiAvIDIsIHk6IG8gKyB1IC8gMiB9OwogICAgfQogICAgLy8g5LiK5LiL5bem5Y+zK+Wbm+S4quinkivml4vovazmjqfliLbngrkKICAgIGdldCBjdHJscygpIHsKICAgICAgY29uc3QgeyB3OiBhLCBoOiBvIH0gPSB0aGlzLCBuID0gTjIuQ1RSTF9TSVpFLCB1ID0gbiAvIDIsIGYgPSBhIC8gMiwgYyA9IG8gLyAyLCByID0gbiAqIDEuNSwgYiA9IHIgLyAyOwogICAgICByZXR1cm4gewogICAgICAgIHQ6IG5ldyBOMigtdSwgLWMgLSB1LCBuLCBuLCB0aGlzKSwKICAgICAgICBiOiBuZXcgTjIoLXUsIGMgLSB1LCBuLCBuLCB0aGlzKSwKICAgICAgICBsOiBuZXcgTjIoLWYgLSB1LCAtdSwgbiwgbiwgdGhpcyksCiAgICAgICAgcjogbmV3IE4yKGYgLSB1LCAtdSwgbiwgbiwgdGhpcyksCiAgICAgICAgbHQ6IG5ldyBOMigtZiAtIHUsIC1jIC0gdSwgbiwgbiwgdGhpcyksCiAgICAgICAgbGI6IG5ldyBOMigtZiAtIHUsIGMgLSB1LCBuLCBuLCB0aGlzKSwKICAgICAgICBydDogbmV3IE4yKGYgLSB1LCAtYyAtIHUsIG4sIG4sIHRoaXMpLAogICAgICAgIHJiOiBuZXcgTjIoZiAtIHUsIGMgLSB1LCBuLCBuLCB0aGlzKSwKICAgICAgICByb3RhdGU6IG5ldyBOMigtYiwgLWMgLSBuICogMiAtIGIsIHIsIHIsIHRoaXMpCiAgICAgIH07CiAgICB9CiAgICBjbG9uZSgpIHsKICAgICAgY29uc3QgeyB4OiBhLCB5OiBvLCB3OiBuLCBoOiB1LCBtYXN0ZXI6IGYgfSA9IHRoaXM7CiAgICAgIHJldHVybiBuZXcgTjIoYSwgbywgbiwgdSwgZik7CiAgICB9CiAgICAvKioKICAgICAqIOajgOa1i+eCueWHu+aYr+WQpuWRveS4rQogICAgICovCiAgICBjaGVja0hpdChhLCBvKSB7CiAgICAgIGxldCB7IGFuZ2xlOiBuLCBjZW50ZXI6IHUsIHg6IGYsIHk6IGMsIHc6IHIsIGg6IGIsIG1hc3RlcjogdiB9ID0gdGhpczsKICAgICAgY29uc3QgeSA9ICh2ID09IG51bGwgPyB2b2lkIDAgOiB2LmNlbnRlcikgPz8gdSwgQSA9ICh2ID09IG51bGwgPyB2b2lkIDAgOiB2LmFuZ2xlKSA/PyBuOwogICAgICB2ID09IG51bGwgJiYgKGYgPSBmIC0geS54LCBjID0gYyAtIHkueSk7CiAgICAgIGNvbnN0IHQgPSBhIC0geS54LCBlID0gbyAtIHkueTsKICAgICAgbGV0IHMgPSB0LCBoID0gZTsKICAgICAgcmV0dXJuIEEgIT09IDAgJiYgKHMgPSB0ICogTWF0aC5jb3MoQSkgKyBlICogTWF0aC5zaW4oQSksIGggPSBlICogTWF0aC5jb3MoQSkgLSB0ICogTWF0aC5zaW4oQSkpLCAhKHMgPCBmIHx8IHMgPiBmICsgciB8fCBoIDwgYyB8fCBoID4gYyArIGIpOwogICAgfQogIH07CiAgRihOLCAiQ1RSTF9TSVpFIiwgMTYpOwogIGNvbnN0IENPTkZJRyA9IHsKICAgIGhlYWRlcnM6IHsKICAgICAgIkNvbnRlbnQtVHlwZSI6ICJhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgiCiAgICB9LAogICAgLy8gc2lnbjogJy8vMTI3LjAuMC4xL3NpZ24nLAogICAgc2lnbjogIi8vbW9yZXRlbGUucnUvc2lnbiIsCiAgICB0ZWxlZzogIi8vbW9yZXRlbGUucnUvdGVsZWciCiAgfTsKICBsZXQgc2lnbmFsU2VydmVyLCBVc2VyOwogIGxldCBVc2VycyA9IHt9OwogIHNlbGYub25tZXNzYWdlID0gYXN5bmMgKGV2dCkgPT4gewogICAgY29uc3QgeyBjbWQsIHR5cGUsIHV1aWQsIHR1dWlkLCBkYXRhIH0gPSBldnQuZGF0YSB8fCB7fTsKICAgIGxldCBjdXNlciA9IFVzZXJzW3V1aWRdIHx8IHt9OwogICAgc3dpdGNoIChjbWQgfHwgdHlwZSkgewogICAgICBjYXNlICJDb25uZWN0IjoKICAgICAgICBVc2Vyc1t1dWlkXSA9IGRhdGE7CiAgICAgICAgVXNlciA9IGRhdGE7CiAgICAgICAgaWYgKCFzaWduYWxTZXJ2ZXIpCiAgICAgICAgICBzaWduYWxTZXJ2ZXIgPSBuZXcgU2lnbmFsU2VydmVyKCk7CiAgICAgICAgc2lnbmFsU2VydmVyLnNlbmQoeyBjbWQ6IHR5cGUsIHV1aWQgfSk7CiAgICAgICAgc2lnbmFsU2VydmVyLnNldEludGVydmFsKHRydWUpOwogICAgICAgIGJyZWFrOwogICAgICBjYXNlICJEaXNjb25uZWN0IjoKICAgICAgICBzaWduYWxTZXJ2ZXIuc2VuZCh7IGNtZDogIkRpc2Nvbm5lY3QiIH0pOwogICAgICAgIGJyZWFrOwogICAgICBjYXNlICJTZW5kVG8iOgogICAgICAgIHNpZ25hbFNlcnZlci5zZW5kKHsgY21kOiAiU2VuZFRvIiwgdXVpZCwgdHV1aWQsIGRhdGEgfSk7CiAgICAgICAgYnJlYWs7CiAgICAgIGNhc2UgIlVzZXJTdGF0ZSI6CiAgICAgICAgc2lnbmFsU2VydmVyLnNlbmQoeyBjbWQ6ICJVc2VyU3RhdGUiLCB1dWlkLCB1c2VyU3RhdGU6IGRhdGEgfSk7CiAgICAgICAgYnJlYWs7CiAgICAgIGNhc2UgIk5pY2tOYW1lIjoKICAgICAgICBjdXNlci51c2VybmFtZSA9IG5pY2tOYW1lOwogICAgICAgIGJyZWFrOwogICAgICBjYXNlICJ2aWRlby1vZmZlciI6CiAgICAgIGNhc2UgInZpZGVvLWFuc3dlciI6CiAgICAgIGNhc2UgIm5ldy1pY2UtY2FuZGlkYXRlcyI6CiAgICAgICAgc2lnbmFsU2VydmVyLnNlbmQoZXZ0LmRhdGEpOwogICAgICAgIGJyZWFrOwogICAgICBjYXNlIEVXb3JrZXJNc2cuU3RhcnQ6CiAgICAgICAgaWYgKFNUQVRFID09PSBTdGF0ZS5QcmVwYXJpbmcpIHsKICAgICAgICAgIFNUQVRFID0gU3RhdGUuUnVubmluZzsKICAgICAgICAgIGNsZWFyID0gaW5pdChkYXRhLCAoKSA9PiB7CiAgICAgICAgICAgIFNUQVRFID0gU3RhdGUuU3RvcHBlZDsKICAgICAgICAgIH0pOwogICAgICAgIH0KICAgICAgICBicmVhazsKICAgICAgY2FzZSBFV29ya2VyTXNnLlN0b3A6CiAgICAgICAgU1RBVEUgPSBTdGF0ZS5TdG9wcGVkOwogICAgICAgIGNsZWFyID09IG51bGwgPyB2b2lkIDAgOiBjbGVhcigpOwogICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoeyB0eXBlOiBFV29ya2VyTXNnLlNhZmVFeGl0IH0pOwogICAgICAgIGJyZWFrOwogICAgICBjYXNlIEVXb3JrZXJNc2cuUGF1c2VkOgogICAgICAgIFBBVVNFRCA9IGRhdGE7CiAgICAgICAgaWYgKGRhdGEpIHsKICAgICAgICAgIFZJREVPX1BBVVNFX0NUUkwucGF1c2UoKTsKICAgICAgICB9IGVsc2UgewogICAgICAgICAgVklERU9fUEFVU0VfQ1RSTC5wbGF5KCk7CiAgICAgICAgfQogICAgfQogIH07CiAgY2xhc3MgU2lnbmFsU2VydmVyIHsKICAgIGNvbnN0cnVjdG9yKGRlbGF5ID0gNWUzKSB7CiAgICAgIF9fcHJpdmF0ZUFkZCh0aGlzLCBfdG1JbnQsIDApOwogICAgICB0aGlzLmRlbGF5ID0gZGVsYXk7CiAgICAgIHRoaXMudG1JbnQgPSAwOwogICAgfQogICAgc2V0SW50ZXJ2YWwoZmxhZykgewogICAgICBjb25zdCBfdGhpcyA9IHRoaXM7CiAgICAgIGlmICh0aGlzLnRtSW50KSB7CiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRtSW50KTsKICAgICAgICB0aGlzLnRtSW50ID0gMDsKICAgICAgfQogICAgICBpZiAoZmxhZykgewogICAgICAgIHRoaXMuc2VuZCh7IGNtZDogInBpbmciLCB1dWlkOiBVc2VyLnV1aWQgfHwgIiIgfSk7CiAgICAgICAgdGhpcy50bUludCA9IHNldEludGVydmFsKGFzeW5jICgpID0+IHsKICAgICAgICAgIE9iamVjdC5rZXlzKFVzZXJzKS5mb3JFYWNoKCh1dWlkKSA9PiB7CiAgICAgICAgICAgIF90aGlzLnNlbmQoeyBjbWQ6ICJwaW5nIiwgdXVpZCB9KTsKICAgICAgICAgIH0pOwogICAgICAgIH0sIHRoaXMuZGVsYXkpOwogICAgICB9CiAgICB9CiAgICBhc3luYyBzZW5kKHBhcnMpIHsKICAgICAgY29uc3QgY3VzZXIgPSBVc2Vyc1twYXJzLnV1aWRdIHx8IHt9OwogICAgICBjb25zdCB7IHVzZXJuYW1lLCB1dWlkLCB1c2VyU3RhdGUgfSA9IGN1c2VyOwogICAgICBjb25zdCBib2R5ID0gSlNPTi5zdHJpbmdpZnkoeyB1c2VyU3RhdGUsIHVzZXJuYW1lLCB1dWlkLCAuLi5wYXJzIH0pOwogICAgICBsZXQgcmVzID0gYXdhaXQgZmV0Y2goImh0dHBzOiIgKyBDT05GSUcuc2lnbiwgeyBoZWFkZXJzOiBDT05GSUcuaGVhZGVycywgbWV0aG9kOiAiUE9TVCIsIGJvZHkgfSkudGhlbigocmVxKSA9PiB7CiAgICAgICAgaWYgKHJlcS5zdGF0dXMgPT09IDIwMCkKICAgICAgICAgIHJldHVybiByZXEuanNvbigpOwogICAgICAgIGNvbnNvbGUuZXJyb3IocmVxLnN0YXR1cywgcmVxKTsKICAgICAgfSkuY2F0Y2goKGVycikgPT4gewogICAgICAgIGNvbnNvbGUud2Fybigi0JjQvdGC0LXRgNC90LXRgjoiLCBlcnIubWVzc2FnZSk7CiAgICAgIH0pOwogICAgICBpZiAocmVzKQogICAgICAgIHRoaXMucGFyc2VSZXMocmVzKTsKICAgICAgcmV0dXJuIHJlczsKICAgIH0KICAgIHBhcnNlUmVzKHJlcykgewogICAgICBjb25zdCB7IHRvWW91LCBvbmxpbmUgfSA9IHJlczsKICAgICAgaWYgKHRvWW91KSB7CiAgICAgICAgdG9Zb3UuZm9yRWFjaCgobGluZSkgPT4gewogICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHsKICAgICAgICAgICAgc2VsZi5wb3N0TWVzc2FnZShsaW5lKTsKICAgICAgICAgIH0pOwogICAgICAgIH0pOwogICAgICB9IGVsc2UgewogICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoeyBjbWQ6ICJ1c2VycyIsIG9ubGluZSB9KTsKICAgICAgfQogICAgfQogIH0KICBfdG1JbnQgPSBuZXcgV2Vha01hcCgpOwogIGNsYXNzIFJlY29kZXJQYXVzZUN0cmwgewogICAgLy8g0JLRgNC10LzRjywg0LrQvtCz0LTQsCDQsdGL0LvQsCDQsNC60YLQuNCy0LjRgNC+0LLQsNC90LAg0L/QsNGD0LfQsCwg0LjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC00LvRjyDRgNCw0YHRh9C10YLQsCDQv9GA0L7QtNC+0LvQttC40YLQtdC70YzQvdC+0YHRgtC4INC/0LDRg9C30YsuCiAgICBjb25zdHJ1Y3RvcihleHBlY3RGUFMpIHsKICAgICAgX19wcml2YXRlQWRkKHRoaXMsIF9vZmZzZXRUaW1lLCBwZXJmb3JtYW5jZS5ub3coKSk7CiAgICAgIC8vINCS0YDQtdC80Y8g0YHQvNC10YnQtdC90LjRjyDRgtC10LrRg9GJ0LXQs9C+INC60LDQtNGA0LAsINC40YHQv9C+0LvRjNC30YPQtdC80L7QtSDQtNC70Y8g0YDQsNGB0YfQtdGC0LAg0LLRgNC10LzQtdC90L3QvtC5INC80LXRgtC60Lgg0LrQsNC00YDQsC4KICAgICAgX19wcml2YXRlQWRkKHRoaXMsIF9sYXN0VGltZSwgX19wcml2YXRlR2V0KHRoaXMsIF9vZmZzZXRUaW1lKSk7CiAgICAgIC8vINCS0YDQtdC80Y8g0LrQvtC00LjRgNC+0LLQsNC90LjRjyDQv9GA0LXQtNGL0LTRg9GJ0LXQs9C+INC60LDQtNGA0LAsINC40YHQv9C+0LvRjNC30YPQtdC80L7QtSDQtNC70Y8g0YDQsNGB0YfQtdGC0LAg0L/RgNC+0LTQvtC70LbQuNGC0LXQu9GM0L3QvtGB0YLQuCDRgtC10LrRg9GJ0LXQs9C+INC60LDQtNGA0LAuCiAgICAgIF9fcHJpdmF0ZUFkZCh0aGlzLCBfZnJhbWVDbnQsIDApOwogICAgICAvLyDQmNGB0L/QvtC70YzQt9GD0LXRgtGB0Y8g0LTQu9GPINC+0LPRgNCw0L3QuNGH0LXQvdC40Y8g0YfQsNGB0YLQvtGC0Ysg0LrQsNC00YDQvtCyCiAgICAgIF9fcHJpdmF0ZUFkZCh0aGlzLCBfcGF1c2VkLCBmYWxzZSk7CiAgICAgIC8vINCV0YHQu9C4INGN0YLQviDQv9GA0LDQstC00LAsINC/0YDQuNC+0YHRgtCw0L3QvtCy0LjRgtGMINC60L7QtNC40YDQvtCy0LDQvdC40LUg0LTQsNC90L3Ri9GFLiDQn9GA0Lgg0L7RgtC80LXQvdC1INC/0LDRg9C30Ysg0L3Rg9C20L3QviDQstGL0YfQtdGB0YLRjAogICAgICBfX3ByaXZhdGVBZGQodGhpcywgX3BhdXNlVGltZSwgMCk7CiAgICB9CiAgICBwbGF5KCkgewogICAgICBpZiAoIV9fcHJpdmF0ZUdldCh0aGlzLCBfcGF1c2VkKSkKICAgICAgICByZXR1cm47CiAgICAgIF9fcHJpdmF0ZVNldCh0aGlzLCBfcGF1c2VkLCBmYWxzZSk7CiAgICAgIF9fcHJpdmF0ZVNldCh0aGlzLCBfb2Zmc2V0VGltZSwgX19wcml2YXRlR2V0KHRoaXMsIF9vZmZzZXRUaW1lKSArIChwZXJmb3JtYW5jZS5ub3coKSAtIF9fcHJpdmF0ZUdldCh0aGlzLCBfcGF1c2VUaW1lKSkpOwogICAgICBfX3ByaXZhdGVTZXQodGhpcywgX2xhc3RUaW1lLCBfX3ByaXZhdGVHZXQodGhpcywgX2xhc3RUaW1lKSArIChwZXJmb3JtYW5jZS5ub3coKSAtIF9fcHJpdmF0ZUdldCh0aGlzLCBfcGF1c2VUaW1lKSkpOwogICAgfQogICAgcGF1c2UoKSB7CiAgICAgIGlmIChfX3ByaXZhdGVHZXQodGhpcywgX3BhdXNlZCkpCiAgICAgICAgcmV0dXJuOwogICAgICBfX3ByaXZhdGVTZXQodGhpcywgX3BhdXNlZCwgdHJ1ZSk7CiAgICAgIF9fcHJpdmF0ZVNldCh0aGlzLCBfcGF1c2VUaW1lLCBwZXJmb3JtYW5jZS5ub3coKSk7CiAgICB9CiAgICB0cmFuc2Zyb20oZnJhbWUpIHsKICAgICAgY29uc3Qgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7CiAgICAgIGNvbnN0IG9mZnNldFRpbWUgPSBub3cgLSBfX3ByaXZhdGVHZXQodGhpcywgX29mZnNldFRpbWUpOwogICAgICBpZiAoX19wcml2YXRlR2V0KHRoaXMsIF9wYXVzZWQpIHx8IC8vINCY0LfQsdC10LPQsNC50YLQtSDRgdC70LjRiNC60L7QvCDQstGL0YHQvtC60L7QuSDRh9Cw0YHRgtC+0YLRiyDQutCw0LTRgNC+0LIsINC/0YDQtdCy0YvRiNCw0Y7RidC10Lkg0L7QttC40LTQsNC90LjRjy4KICAgICAgX19wcml2YXRlR2V0KHRoaXMsIF9mcmFtZUNudCkgLyBvZmZzZXRUaW1lICogMWUzID4gdGhpcy5leHBlY3RGUFMpIHsKICAgICAgICBmcmFtZS5jbG9zZSgpOwogICAgICAgIHJldHVybjsKICAgICAgfQogICAgICBjb25zdCB2ZiA9IG5ldyBWaWRlb0ZyYW1lKGZyYW1lLCB7CiAgICAgICAgdGltZXN0YW1wOiBvZmZzZXRUaW1lICogMWUzLAogICAgICAgIC8vINCy0YDQtdC80LXQvdC90LDRjyDQvNC10YLQutCwLCDQtdC00LjQvdC40YbQsCDQvNC40LrRgNC+0YHQtdC60YPQvdC00YsKICAgICAgICBkdXJhdGlvbjogKG5vdyAtIF9fcHJpdmF0ZUdldCh0aGlzLCBfbGFzdFRpbWUpKSAqIDFlMwogICAgICB9KTsKICAgICAgX19wcml2YXRlU2V0KHRoaXMsIF9sYXN0VGltZSwgbm93KTsKICAgICAgX19wcml2YXRlU2V0KHRoaXMsIF9mcmFtZUNudCwgX19wcml2YXRlR2V0KHRoaXMsIF9mcmFtZUNudCkgKyAxKTsKICAgICAgZnJhbWUuY2xvc2UoKTsKICAgICAgcmV0dXJuIHsKICAgICAgICB2ZiwKICAgICAgICBvcHRzOiB7IGtleUZyYW1lOiBfX3ByaXZhdGVHZXQodGhpcywgX2ZyYW1lQ250KSAlIDMwID09PSAwIH0KICAgICAgfTsKICAgIH0KICB9CiAgX29mZnNldFRpbWUgPSBuZXcgV2Vha01hcCgpOwogIF9sYXN0VGltZSA9IG5ldyBXZWFrTWFwKCk7CiAgX2ZyYW1lQ250ID0gbmV3IFdlYWtNYXAoKTsKICBfcGF1c2VkID0gbmV3IFdlYWtNYXAoKTsKICBfcGF1c2VUaW1lID0gbmV3IFdlYWtNYXAoKTsKICBjb25zdCBWSURFT19QQVVTRV9DVFJMID0gbmV3IFJlY29kZXJQYXVzZUN0cmwoMzApOwogIGNvbnN0IFN0YXRlID0gewogICAgUHJlcGFyaW5nOiAicHJlcGFyaW5nIiwKICAgIFJ1bm5pbmc6ICJydW5uaW5nIiwKICAgIFN0b3BwZWQ6ICJzdG9wcGVkIgogIH07CiAgY29uc3QgRVdvcmtlck1zZyA9IHsKICAgIFNhZmVFeGl0OiAiU2FmZUV4aXQiLAogICAgU3RvcDogIlN0b3AiLAogICAgUGF1c2VkOiAiUGF1c2VkIiwKICAgIFN0YXJ0OiAiU3RhcnQiLAogICAgT3V0cHV0U3RyZWFtOiAiT3V0cHV0U3RyZWFtIgogIH07CiAgbGV0IFNUQVRFID0gU3RhdGUuUHJlcGFyaW5nOwogIGxldCBQQVVTRUQgPSBmYWxzZTsKICBsZXQgY2xlYXIgPSBudWxsOwogIGZ1bmN0aW9uIGluaXQob3B0cywgb25FbmRlZCkgewogICAgbGV0IHN0b3BFbmNvZGVWaWRlbyA9IG51bGw7CiAgICBsZXQgc3RvcEVuY29kZUF1ZGlvID0gbnVsbDsKICAgIGNvbnN0IHJlY29kZXIgPSBMcyh7CiAgICAgIHZpZGVvOiB7IC4uLm9wdHMudmlkZW8sIGJpdHJhdGU6IG9wdHMuYml0cmF0ZSA/PyAzZTYgfSwKICAgICAgYXVkaW86IG9wdHMuYXVkaW8KICAgIH0pOwogICAgbGV0IHN0b3BlZCA9IGZhbHNlOwogICAgaWYgKG9wdHMuc3RyZWFtcy52aWRlbyAhPSBudWxsKSB7CiAgICAgIGxldCBsYXN0VmYgPSBudWxsOwogICAgICBsZXQgYXV0b0luc2VydFZGVGltZXIgPSAwOwogICAgICBsZXQgY291bnQgPSAwOwogICAgICBjb25zdCBlbWl0VmYgPSAodmYpID0+IHsKICAgICAgICBjbGVhclRpbWVvdXQoYXV0b0luc2VydFZGVGltZXIpOwogICAgICAgIGxhc3RWZiA9PSBudWxsID8gdm9pZCAwIDogbGFzdFZmLmNsb3NlKCk7CiAgICAgICAgbGFzdFZmID0gdmY7CiAgICAgICAgY29uc3QgdmZXcmFwID0gVklERU9fUEFVU0VfQ1RSTC50cmFuc2Zyb20odmYuY2xvbmUoKSk7CiAgICAgICAgaWYgKHZmV3JhcCA9PSBudWxsKQogICAgICAgICAgcmV0dXJuOwogICAgICAgIHJlY29kZXIuZW5jb2RlVmlkZW8odmZXcmFwLnZmLCB2ZldyYXAub3B0cyk7CiAgICAgICAgYXV0b0luc2VydFZGVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHsKICAgICAgICAgIGlmIChsYXN0VmYgPT0gbnVsbCkKICAgICAgICAgICAgcmV0dXJuOwogICAgICAgICAgY29uc3QgbmV3VmYgPSBuZXcgVmlkZW9GcmFtZShsYXN0VmYsIHsKICAgICAgICAgICAgdGltZXN0YW1wOiBsYXN0VmYudGltZXN0YW1wICsgMWU2LAogICAgICAgICAgICBkdXJhdGlvbjogMWU2CiAgICAgICAgICB9KTsKICAgICAgICAgIGVtaXRWZihuZXdWZik7CiAgICAgICAgfSwgMWUzKTsKICAgICAgICBjb3VudCsrOwogICAgICAgIGlmIChjb3VudCA+IDEwMCkKICAgICAgICAgIHN0b3BlZCA9IHRydWU7CiAgICAgICAgdmZyKCk7CiAgICAgICAgY29uc29sZS5sb2coInJlYWQiLCBzdG9wZWQsIGNvdW50KTsKICAgICAgfTsKICAgICAgY29uc3Qgc3RvcFJlYWRTdHJlYW0gPSBIZShvcHRzLnN0cmVhbXMudmlkZW8sIHsKICAgICAgICBvbkNodW5rOiBhc3luYyAoY2h1bmspID0+IHsKICAgICAgICAgIGlmIChzdG9wZWQpIHsKICAgICAgICAgICAgY2h1bmsuY2xvc2UoKTsKICAgICAgICAgICAgY29uc29sZS53YXJuKCJzdG9wZWQiLCBjb3VudCk7CiAgICAgICAgICAgIHJldHVybjsKICAgICAgICAgIH0KICAgICAgICAgIGVtaXRWZihjaHVuayk7CiAgICAgICAgfSwKICAgICAgICBvbkRvbmU6IChldikgPT4gewogICAgICAgIH0KICAgICAgfSk7CiAgICAgIHN0b3BFbmNvZGVWaWRlbyA9ICgpID0+IHsKICAgICAgICBzdG9wUmVhZFN0cmVhbSgpOwogICAgICAgIGNsZWFyVGltZW91dChhdXRvSW5zZXJ0VkZUaW1lcik7CiAgICAgICAgbGFzdFZmID09IG51bGwgPyB2b2lkIDAgOiBsYXN0VmYuY2xvc2UoKTsKICAgICAgfTsKICAgIH0KICAgIGlmIChvcHRzLmF1ZGlvICE9IG51bGwgJiYgb3B0cy5zdHJlYW1zLmF1ZGlvICE9IG51bGwpIHsKICAgICAgc3RvcEVuY29kZUF1ZGlvID0gSGUob3B0cy5zdHJlYW1zLmF1ZGlvLCB7CiAgICAgICAgb25DaHVuazogYXN5bmMgKGFkKSA9PiB7CiAgICAgICAgICBpZiAoc3RvcGVkIHx8IFBBVVNFRCkgewogICAgICAgICAgICBhZC5jbG9zZSgpOwogICAgICAgICAgICByZXR1cm47CiAgICAgICAgICB9CiAgICAgICAgICByZWNvZGVyLmVuY29kZUF1ZGlvKGFkKTsKICAgICAgICB9LAogICAgICAgIG9uRG9uZTogKCkgPT4gewogICAgICAgIH0KICAgICAgfSk7CiAgICB9CiAgICBjb25zdCB7IHN0cmVhbSwgc3RvcDogc3RvcFN0cmVhbSB9ID0gTmkoCiAgICAgIHJlY29kZXIubXA0ZmlsZSwKICAgICAgb3B0cy50aW1lU2xpY2UsCiAgICAgICgpID0+IHsKICAgICAgICBleGl0KCk7CiAgICAgICAgb25FbmRlZCgpOwogICAgICB9CiAgICApOwogICAgc2VsZi5wb3N0TWVzc2FnZSgKICAgICAgewogICAgICAgIHR5cGU6IEVXb3JrZXJNc2cuT3V0cHV0U3RyZWFtLAogICAgICAgIGRhdGE6IHN0cmVhbQogICAgICB9LAogICAgICAvLyBAdHMtZXhwZWN0LWVycm9yCiAgICAgIFtzdHJlYW1dCiAgICApOwogICAgYXN5bmMgZnVuY3Rpb24gdmZyKHZmLCBjbnQpIHsKICAgIH0KICAgIGZ1bmN0aW9uIGV4aXQoKSB7CiAgICAgIHN0b3BlZCA9IHRydWU7CiAgICAgIHN0b3BFbmNvZGVWaWRlbyA9PSBudWxsID8gdm9pZCAwIDogc3RvcEVuY29kZVZpZGVvKCk7CiAgICAgIHN0b3BFbmNvZGVBdWRpbyA9PSBudWxsID8gdm9pZCAwIDogc3RvcEVuY29kZUF1ZGlvKCk7CiAgICAgIHJlY29kZXIuY2xvc2UoKTsKICAgICAgc3RvcFN0cmVhbSgpOwogICAgfQogICAgcmV0dXJuIGV4aXQ7CiAgfQp9KSgpOwo=";
const decodeBase64 = (base64) => Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
const blob = typeof window !== "undefined" && window.Blob && new Blob([decodeBase64(encodedJs)], { type: "text/javascript;charset=utf-8" });
function WorkerWrapper(options) {
  let objURL;
  try {
    objURL = blob && (window.URL || window.webkitURL).createObjectURL(blob);
    if (!objURL)
      throw "";
    const worker2 = new Worker(objURL, {
      name: options == null ? void 0 : options.name
    });
    worker2.addEventListener("error", () => {
      (window.URL || window.webkitURL).revokeObjectURL(objURL);
    });
    return worker2;
  } catch (e) {
    return new Worker(
      "data:text/javascript;base64," + encodedJs,
      {
        name: options == null ? void 0 : options.name
      }
    );
  } finally {
    objURL && (window.URL || window.webkitURL).revokeObjectURL(objURL);
  }
}
const audio = { autoGainControl: false, echoCancellation: false, noiseSuppression: false };
const errorMessage = "Не найдены медиа устройства";
const createApp = async (opt = {}) => {
  const out = { status: "off" };
  if (!MediaRecorder.isTypeSupported("audio/webm"))
    return { ...out, errorMessage };
  const {
    uuid = 4,
    nick = "guest",
    url = "//127.0.0.1/cvideo",
    stateInfo,
    timeLimit = 3 * 60
  } = opt;
  const evArr = ["start", "pause", "resume", "stop", "error", "dataavailable"];
  const detectRTC = await Utils.detectRTC();
  let stream;
  if (detectRTC.hasWebcam) {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio });
  } else if (detectRTC.hasMicrophone) {
    const videoStream = await navigator.mediaDevices.getDisplayMedia({ video: { mediaSource: "screen" }, audio });
    const audioStream = await navigator.mediaDevices.getUserMedia({ video: false, audio });
    const rTracks = [
      ...audioStream.getAudioTracks(),
      ...videoStream.getVideoTracks()
    ];
    stream = new MediaStream(rTracks);
  } else {
    return { ...out, errorMessage };
  }
  stateInfo({ type: "media", stream });
  let mimeType = "video/webm";
  if (navigator.userAgent.indexOf("Firefox") === -1)
    mimeType += ";codecs=vp8";
  let timer = 0, startTm;
  const tStart = () => {
    if (startTm)
      clearInterval(startTm);
    startTm = setInterval(() => {
      timer++;
      stateInfo({ type: "recording", timer });
      if (timer > timeLimit) {
        clearInterval(startTm);
        mr.stop();
      }
    }, 1e3);
  };
  const parseData = async (data) => {
    let blobData = data.slice(0, data.size, "video/webm");
    Utils.stopTracks(stream);
    const date = /* @__PURE__ */ new Date();
    const prefix = `${nick}_${date.toLocaleDateString()}_${date.toLocaleTimeString()}`;
    const fileName = prefix.replace(/[\/\. :]/g, "_");
    const nameFile = fileName + ".webm";
    const fd = new FormData();
    fd.append("uuid", uuid);
    fd.append("name", nameFile);
    fd.append("rawdata", blobData, nameFile);
    const res = await fetch(url, { method: "POST", body: fd }).then((resp) => resp.json());
    return { date, fileName: nameFile, ...res };
  };
  const mr = new MediaRecorder(stream, { mimeType });
  const evHandler = (ev) => {
    const { type } = ev;
    if (type === "error")
      console.warn(ev);
    else if (type === "pause" && startTm)
      clearInterval(startTm);
    else if (type === "stop") {
      if (startTm)
        clearInterval(startTm);
    } else if (type === "resume")
      tStart();
    else if (type === "start") {
      timer = 0;
      tStart();
    } else if (type === "dataavailable") {
      parseData(ev.data).then((res) => {
        stateInfo({ type, mimeType, timer, ...res });
      });
      return;
    }
    stateInfo({ type, timer });
  };
  evArr.forEach((k) => mr.addEventListener(k, evHandler));
  return {
    ...out,
    status: "ok",
    state: () => {
      return mr.state;
    },
    start: () => {
      if (mr.state === "inactive")
        mr.start();
    },
    pause: () => {
      mr.pause();
    },
    resume: () => {
      mr.resume();
    },
    stop: () => {
      mr.stop();
      Utils.stopTracks(stream);
    }
  };
};
const worker = new WorkerWrapper();
const bcc = new BroadcastChannel("channel_MtNs");
(async () => {
  const rem = new URL(location.href).searchParams.get("guid") || "";
  const nameKey = `uname${rem}`;
  const username = localStorage.getItem(nameKey) || `Guest${rem}`;
  const uuidKey = `uuid${rem}`;
  let uuid = localStorage.getItem(uuidKey);
  if (!uuid) {
    uuid = rem + "_" + self.crypto.randomUUID();
    localStorage.setItem(uuidKey, uuid);
  }
  localStorage.setItem(nameKey, username);
  worker.postMessage({ type: "Connect", uuid, data: { username, uuid } });
})();
const mtNs = {
  worker,
  bcc,
  Mrecorder: createApp
};
self.mtNs = mtNs;
