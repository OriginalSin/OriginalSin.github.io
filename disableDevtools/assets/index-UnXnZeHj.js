(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const l of t.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function s(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function i(e){if(e.ep)return;e.ep=!0;const t=s(e);fetch(e.href,t)}})();const u="/vite.svg",f="/mtNs.svg",m="/motion-blur-2.svg",g=`<img src="${m}" class="loader" alt="loader" />`;let n,c,p=200;const a="hello",v="data:application/javascript;base64,"+btoa(`
      self.addEventListener('message', (e) => {
          if(e.data === '${a}') {
            self.postMessage('${a}');
          }
          debugger;
          self.postMessage('no');
      });`),h=()=>new Promise(r=>{const o=new Worker(v);let s=!1;const i=e=>{s||(s=!0,o.terminate(),r(e))};o.addEventListener("message",e=>{e.data===a?setTimeout(()=>{i(!0)},1):i(!1)}),o.postMessage(a)});async function d(){const r=document.body.classList;n&&(n.innerHTML=g);const o=new Date().getTime()+p;await h();const s=new Date().getTime()-o>0;return!c&&n&&(n.innerHTML=s?"yes":"no"),s?r.add("devtools"):r.remove("devtools"),c=!1,s}async function y(r,o){n=r,window.addEventListener("focus",d),window.addEventListener("blur",function(s){return n.innerHTML="",c=!0,Promise.resolve().then(()=>{window.confirm("Page paused, please confirm to continue"),location.hash="#pause",location.reload(location)})}),d()}const w=`<img src="${f}" class="logo mtNs" alt="mtNs logo" />`;document.querySelector("#app").innerHTML=`
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${u}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://moretele.ru/pkks/index.html" target="_blank">
      ${w}
    </a>

    <h1>Is DevTools open?</h1>
      <h1 class="devtools-state"></h1>
    <p class="read-the-docs">
      Try it out by opening DevTools
    </p>
  </div>
`;y(document.querySelector(".devtools-state"));
