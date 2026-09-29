// One shared speech channel for instructions, alerts and the existing chatbot.
let finish = null;
let speaking = false;
const listeners = new Set();
function publish(value) { speaking = value; listeners.forEach(listener => listener()); }
export function subscribeSpeech(listener) { listeners.add(listener); return () => listeners.delete(listener); }
export function isSpeaking() { return speaking; }
export function stopSpeech() { globalThis.speechSynthesis?.cancel(); const done = finish; finish = null; publish(false); done?.(); }
export function speak(text, onEnd = () => {}, language = 'en') {
  stopSpeech();
  if (!globalThis.speechSynthesis) { onEnd(); return false; }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
  const voice = speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith(language));
  if (voice) utterance.voice = voice;
  finish = onEnd; publish(true);
  utterance.onend = utterance.onerror = () => { if (finish === onEnd) { finish = null; publish(false); onEnd(); } };
  speechSynthesis.speak(utterance); return true;
}
