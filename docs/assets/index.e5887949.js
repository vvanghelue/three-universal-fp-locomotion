import{G as e}from"./vendor.506c9701.js";if(function(e=".",o="__import__"){try{self[o]=new Function("u","return import(u)")}catch(n){const t=new URL(e,location),r=e=>{URL.revokeObjectURL(e.src),e.remove()};self[o]=e=>new Promise(((n,s)=>{const c=new URL(e,t);if(self[o].moduleMap[c])return n(self[o].moduleMap[c]);const d=new Blob([`import * as m from '${c}';`,`${o}.moduleMap['${c}']=m;`],{type:"text/javascript"}),a=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(d),onerror(){s(new Error(`Failed to import: ${e}`)),r(a)},onload(){n(self[o].moduleMap[c]),r(a)}});document.head.appendChild(a)})),self[o].moduleMap={}}}("assets/"),window){window.document&&window.document.addEventListener("touchstart",(()=>{}));window.navigator.userAgent.includes("Quest")}window.openExample1=()=>{(new e).setPath("./").load("demo-scene/demo-scene.glb",(function(e){console.log(e.scene)}))};
//# sourceMappingURL=index.e5887949.js.map
