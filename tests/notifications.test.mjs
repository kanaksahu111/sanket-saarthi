import test from 'node:test';
import assert from 'node:assert/strict';
import { speak, stopSpeech, isSpeaking } from '../src/services/speechService.js';
import { triggerVibration } from '../src/utils/vibration.js';

test('shared speech cancels previous output, uses Hindi and supports Stop Voice',()=>{
  let cancelled=0, spoken;
  globalThis.SpeechSynthesisUtterance=class {constructor(text){this.text=text;}};
  globalThis.speechSynthesis={cancel(){cancelled++;},getVoices(){return [{lang:'hi-IN'}];},speak(value){spoken=value;}};
  try {
    speak('निर्देश',undefined,'hi');
    assert.equal(spoken.lang,'hi-IN'); assert.equal(isSpeaking(),true);
    const old=spoken;
    speak('Next instruction'); old.onend();
    assert.equal(isSpeaking(),true);
    stopSpeech(); assert.equal(isSpeaking(),false); assert.equal(cancelled,3);
  } finally {delete globalThis.speechSynthesis;delete globalThis.SpeechSynthesisUtterance;}
  assert.equal(speak('Unsupported'),false);
});

test('vibration supports unavailable hardware and rejected API without throwing',()=>{
  const original=Object.getOwnPropertyDescriptor(globalThis,'navigator');
  let pattern;
  try {
    Object.defineProperty(globalThis,'navigator',{configurable:true,value:{}});
    assert.doesNotThrow(()=>triggerVibration());
    Object.defineProperty(globalThis,'navigator',{configurable:true,value:{vibrate(value){pattern=value;}}});
    triggerVibration(); assert.deepEqual(pattern,[300,150,300]);
    Object.defineProperty(globalThis,'navigator',{configurable:true,value:{vibrate(){throw new Error('Unavailable');}}});
    assert.doesNotThrow(()=>triggerVibration());
  } finally {if(original)Object.defineProperty(globalThis,'navigator',original);else delete globalThis.navigator;}
});
