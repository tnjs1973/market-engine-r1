// Dependency-free functional test: `node tests/smoke.cjs`.
// Rabbit hardware and exact rendering still require on-device verification.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

class Element {
  constructor() {this.children=[];this.textContent='';this.className='';this.attrs={};this.listeners={};this.onclick=null;this.value='';this.focused=false;}
  append(...nodes) {this.children.push(...nodes);}
  replaceChildren(...nodes) {this.children=[...nodes];}
  setAttribute(key,value) {this.attrs[key]=value;}
  addEventListener(name,callback) {this.listeners[name]=callback;}
  click() {if(this.onclick) this.onclick(); else if(this.listeners.click) this.listeners.click();}
  focus() {this.focused=true;}
  blur() {this.focused=false;}
}

async function run() {
  const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script,'Inline application JavaScript found');
  new vm.Script(script); // syntax check
  const ids=new Map();
  const document={createElement:()=>new Element(),getElementById:(id)=>{if(!ids.has(id)) ids.set(id,new Element());return ids.get(id);}};
  const events={};
  const empty={schemaVersion:1,source:null,updatedAtUTC:null,tickers:{SPY:{verified:false,price:99999}}};
  let payload=empty;
  const messages=[];
  const window={
    addEventListener:(name,callback)=>{events[name]=callback;},
    PluginMessageHandler:{postMessage:message=>messages.push(JSON.parse(message))}
  };
  const fetch=async()=>({ok:true,json:async()=>payload});
  const context={document,window,fetch,Date,JSON,Number,String,Error};
  vm.runInNewContext(script,context);
  await new Promise(setImmediate);
  assert.equal(document.getElementById('connection').textContent,'NO DATA');
  assert.equal(document.getElementById('panel').children[0].children[1].textContent,'—','unverified price hidden');
  assert.equal(document.getElementById('tabs').children.length,4);
  document.getElementById('tabs').children[1].click();
  assert.equal(window.marketEngineR1.getState().selected,1,'QQQ selected');
  events.scrollDown();
  assert.equal(window.marketEngineR1.getState().selected,2,'scroll navigates');
  events.sideClick();
  assert.equal(document.getElementById('question').focused,true,'side button focuses microphone field');
  events.longPressStart();
  assert.equal(document.getElementById('question').focused,true,'PTT hold focuses voice input');
  window.marketEngineR1.select('WMT');

  payload={schemaVersion:1,source:'Test fixture',updatedAtUTC:'2026-11-05T20:00:00Z',tickers:{
    WMT:{verified:true,price:123.45,session:'Test session',timeframe:'15m',signal:{status:'WATCH',summary:'Test fixture only',direction:'neutral',entry:122,stop:120,target1:126,target2:128}}
  }};
  await window.marketEngineR1.refresh();
  assert.equal(document.getElementById('connection').textContent,'SAVED DATA');
  assert.equal(document.getElementById('panel').children[0].children[1].textContent,'$123.45');
  document.getElementById('speak').click();
  assert.equal(messages.length,1,'R1 speech bridge called');
  assert.match(messages[0].message,/Test fixture only/);
  assert.equal(messages[0].wantsR1Response,true);
  window.marketEngineR1.askQuestion('What is the entry and target for WMT?');
  assert.match(window.marketEngineR1.getState().answer,/entry \$122\.00/);
  assert.equal(messages.length,2,'voice question produces spoken answer');
  window.marketEngineR1.askQuestion('What is SPY doing?');
  assert.match(window.marketEngineR1.getState().answer,/No verified Market Engine 2 data for SPY/);

  payload={...payload,tickers:{WMT:{...payload.tickers.WMT,verified:false}}};
  window.marketEngineR1.select('WMT');
  await window.marketEngineR1.refresh();
  assert.equal(document.getElementById('panel').children[0].children[1].textContent,'—','unverified replacement hidden');
  assert.match(html,/max-width:240px; max-height:282px/,'small-screen dimensions are constrained');
  console.log('PASS: syntax, unverified data suppression, navigation, verified feed, PTT focus and spoken query');
}
run().catch(error=>{console.error(error);process.exitCode=1;});
