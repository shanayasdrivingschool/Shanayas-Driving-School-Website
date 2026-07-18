import{e as s}from"./index-DOycVryr.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=s("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]),p=(c,t)=>{if(typeof window>"u"||t.length===0)return;const a=Array.from(t.reduce((o,r)=>(Object.keys(r).forEach(e=>o.add(e)),o),new Set)),i=[a.join(","),...t.map(o=>a.map(r=>{const e=o[r];return`"${(e==null?"":Array.isArray(e)?e.join(" | "):typeof e=="object"?JSON.stringify(e):String(e)).replace(/"/g,'""')}"`}).join(","))],d=new Blob([i.join(`
`)],{type:"text/csv;charset=utf-8;"}),n=document.createElement("a");n.href=URL.createObjectURL(d),n.download=c,n.click(),URL.revokeObjectURL(n.href)};export{f as D,p as d};
