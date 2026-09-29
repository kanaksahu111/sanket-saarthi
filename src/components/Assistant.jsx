import { useEffect,useRef,useState } from 'react';
import { speak,stopSpeech } from '../services/speechService';
import { useI18n } from '../i18n/context';
export default function Assistant({onNavigate,onTheme,voice}){
  const {t,language}=useI18n();
  const [open,setOpen]=useState(false),[input,setInput]=useState(''),[listening,setListening]=useState(false),[status,setStatus]=useState('');
  const [messages,setMessages]=useState([{role:'bot',text:'I can help you choose a station, set up support, or request assistance.'}]);
  const recognition=useRef(null),inputRef=useRef(null),log=useRef(null),launcher=useRef(null);
  const canListen=Boolean(window.SpeechRecognition||window.webkitSpeechRecognition);
  useEffect(()=>{if(open)inputRef.current?.focus();},[open]);
  useEffect(()=>{log.current?.scrollTo({top:log.current.scrollHeight});},[messages,open]);
  useEffect(()=>()=>{recognition.current?.abort();},[language]);
  function close(){recognition.current?.abort();stopSpeech();setOpen(false);launcher.current?.focus();}
  function send(text){const clean=text.trim();if(!clean)return;const q=clean.toLowerCase();let answer='Try Start journey, Mobility support, or Help.';
    if(/dark|डार्क/.test(q)){onTheme('dark');answer='Dark mode is on.';}
    else if(/light|लाइट/.test(q)){onTheme('light');answer='Light mode is on.';}
    else if(/home|मुख्य/.test(q)){onNavigate('home');answer='You’re on the home page.';}
    else if(/start|city|station|journey|यात्रा|शहर|स्टेशन/.test(q)){onNavigate('setup');answer='Choose a station and your accessibility needs on the same screen.';}
    else if(/mobility|wheelchair|चलने|व्हीलचेयर/.test(q))answer='Choose Mobility, then select a route, wheelchair, staff help, or both.';
    else if(/help|assistan|मदद|सहायता/.test(q))answer='Use Request Assistance during your journey. You can choose help without speaking.';
    else if(/airport|hospital|अस्पताल|हवाई/.test(q))answer='More venue types are coming soon.';
    setMessages(m=>[...m,{role:'user',text:clean},{role:'bot',text:answer}]);setInput('');if(voice)speak(t(answer),undefined,language);
  }
  function listen(){if(listening){recognition.current?.stop();return;}const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;if(!Recognition)return;stopSpeech();const session=new Recognition();recognition.current=session;session.lang=language==='hi'?'hi-IN':'en-IN';session.interimResults=false;session.onstart=()=>{setListening(true);setStatus('Listening…');};session.onend=()=>setListening(false);session.onresult=e=>{setStatus('Voice received.');send(e.results[0][0].transcript);};session.onerror=e=>{setListening(false);setStatus(e.error==='not-allowed'?'Microphone access denied. Type your message below.':'Could not hear you. Try again or type below.');};try{session.start();}catch{setStatus('Could not hear you. Try again or type below.');}}
  return <div className="assistant-widget">{open&&<section className="chat-panel" role="dialog" aria-modal="false" aria-labelledby="assistant-title" onKeyDown={e=>{if(e.key==='Escape')close();}}><header><div><strong id="assistant-title">{t('Your Saarthi')}</strong><small>{t('Website & voice guide')}</small></div><button aria-label={t('Close assistant')} onClick={close}>×</button></header><div className="chat-log" ref={log} role="log" aria-live="polite">{messages.map((m,i)=><div className={`chat-message ${m.role}`} key={i}>{m.role==='bot'?t(m.text):m.text}</div>)}</div><div className="quick-actions">{['Start journey','Mobility support','Help'].map(text=><button key={text} onClick={()=>send(text)}>{t(text)}</button>)}</div><p className="voice-status" role="status">{t(status||(canListen?'Press Voice to enable your microphone.':'Voice input unavailable here. Type below.'))}</p><form onSubmit={e=>{e.preventDefault();send(input);}}><input aria-label={t('Message Saarthi')} ref={inputRef} value={input} maxLength={1000} onChange={e=>setInput(e.target.value)} placeholder={t('Ask your Saarthi…')}/><button type="button" onClick={listen} disabled={!canListen} aria-label={t(listening?'Stop listening':'Start voice input')} aria-pressed={listening}>{t(listening?'Stop':'Voice')}</button><button type="submit" disabled={!input.trim()} aria-label={t('Send message')}>↑</button></form></section>}<button ref={launcher} className="chat-launcher" aria-expanded={open} onClick={()=>open?close():setOpen(true)}>{t(open?'Close assistant':'Ask Saarthi')} <span aria-hidden="true">{open?'×':'↗'}</span></button></div>;
}
