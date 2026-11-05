// Dependency-free tests for the R1 microphone diagnostic.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');

class Node {
  constructor() {this.textContent='';this.style={};this.attributes={};this.listeners={};}
  addEventListener(type,fn) {this.listeners[type]=fn;}
  setAttribute(name,value) {this.attributes[name]=value;}
  fire(type,event={}) {this.listeners[type]?.(event);}
}

async function test(hasMic) {
  const html=fs.readFileSync(path.join(__dirname,'..','mic-test.html'),'utf8');
  const js=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(js);
  new vm.Script(js);
  assert.ok(!/\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b|\blocalStorage\b/.test(js),'diagnostic has no network or persistence code');
  const nodes=new Map();
  const document={getElementById:id=>{if(!nodes.has(id)) nodes.set(id,new Node());return nodes.get(id);},addEventListener() {}};
  const events={};
  const track={addEventListener(){},stop(){}};
  const stream={getAudioTracks:()=>[track],getTracks:()=>[track]};
  const navigator=hasMic?{mediaDevices:{getUserMedia:async()=>stream}}:{};
  class Recorder {
    static isTypeSupported(){return true;}
    constructor(){this.state='inactive';}
    start(){this.state='recording';}
    stop(){this.state='inactive';this.ondataavailable?.({data:{size:4096}});this.onstop?.();}
  }
  const window={addEventListener:(type,fn)=>events[type]=fn,MediaRecorder:Recorder};
  const context={document,navigator,window,setInterval,clearInterval,Date,Math,Uint8Array,Boolean,String,Error};
  vm.runInNewContext(js,context);
  assert.equal(nodes.get('mic-api').textContent,hasMic?'Available':'Unavailable');
  if (!hasMic) {assert.match(nodes.get('status').textContent,/UNAVAILABLE/);return;}
  nodes.get('enable').fire('click');
  await new Promise(setImmediate);
  assert.equal(nodes.get('track').textContent,'Active');
  events.longPressStart();
  assert.equal(window.r1MicDiagnostic.read().recording,true);
  events.longPressEnd();
  assert.equal(window.r1MicDiagnostic.read().recording,false);
  assert.equal(window.r1MicDiagnostic.read().bytes,4096);
  assert.equal(nodes.get('ptt').textContent,'1 / 1');
  assert.equal(nodes.get('status').textContent,'AUDIO CAPTURED');
  window.r1MicDiagnostic.disableMic();
  assert.equal(nodes.get('track').textContent,'None');
}

Promise.resolve().then(()=>test(false)).then(()=>test(true)).then(()=>{
  console.log('PASS: API unavailable, microphone granted, hardware PTT events, recorded bytes, clean stop');
}).catch(error=>{console.error(error);process.exitCode=1;});
