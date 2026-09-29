import { clientId } from './utils/clientId';
import { useEffect, useState, useSyncExternalStore } from 'react';
import JourneyScreens from './JourneyScreens';
import Assistant from './components/Assistant';
import StaffDashboard from './pages/StaffDashboard';
import { useLiveJourney } from './hooks/useLiveJourney';
import { getStationByCode as stationByCode } from './services/stationService';
import StationQRCodes from './pages/StationQRCodes';
import { processCheckpoint } from './services/checkpointService';
import { derivePreferences, NEEDS } from './data/support';
import { stopSpeech, isSpeaking, subscribeSpeech } from './services/speechService';
import { useI18n } from './i18n/context';
import './App.css';
import './Refined.css';
import './Journey.css';
import './Flow.css';
import './Mobile.css';
import './Polish.css';
function initialJourney() {
  let saved={};
  try{saved=JSON.parse(localStorage.getItem('saarthi-journey')||sessionStorage.getItem('saarthi-journey'))||{};if(saved.savedAt&&Date.now()-saved.savedAt>86400000)saved={};}catch{/* Optional storage. */}
  const query=new URLSearchParams(location.search),cp=processCheckpoint(location.search,saved)?.checkpoint;
  const isQR=location.pathname==='/checkpoint';
  const code=query.get('station')||(query.get('venue')==='bhopal-junction'?'BPL':'');
  const legacyNeeds=[...(saved.preferences?.stepFreeNavigation?['mobility']:[]),...(saved.preferences?.simpleGuidance?['cognitive']:[])];
  return {id:saved.id||clientId('journey'),stationCode:isQR?(stationByCode(code)?.code||''):(saved.stationCode??(saved.started?'BPL':'')),checkpoint:cp||saved.checkpoint||'gate-1',fromQR:isQR&&Boolean(stationByCode(code)),started:isQR?Boolean(cp&&saved.started):Boolean(saved.started),needs:(saved.needs||legacyNeeds).filter(n=>NEEDS.includes(n)),custom:saved.custom||{},voice:Boolean(saved.voice??saved.preferences?.audioGuidance),mobilityMode:saved.mobilityMode||'route',purpose:saved.purpose||'train',facility:saved.facility||'accessible-washroom',trainNumber:saved.trainNumber||'12345',train:saved.train||null,requestId:saved.requestId||null};
}
function initialScreen(){if(location.pathname==='/station-qr')return 'qr';if(location.pathname==='/staff')return 'staff';if(location.pathname==='/checkpoint'){const j=initialJourney();return j.started&&j.stationCode==='BPL'?'journey':'setup';}return 'home';}
export default function App(){
  const {language,setLanguage,t}=useI18n();
  const [screen,setScreen]=useState(initialScreen);
  const [journey,setJourney]=useState(initialJourney);
  const [theme,setTheme]=useState(()=>{try{return localStorage.getItem('saarthi-theme')||'light';}catch{return 'light';}});
  const configured={...journey,preferences:derivePreferences(journey.needs,journey.voice,journey.needs.includes('custom')?journey.custom:{})};
  const live=useLiveJourney(configured,screen==='journey');
  const speaking=useSyncExternalStore(subscribeSpeech,isSpeaking,()=>false);
  useEffect(()=>{document.documentElement.dataset.theme=theme;try{localStorage.setItem('saarthi-theme',theme);}catch{/* Optional storage. */}},[theme]);
  useEffect(()=>{try{sessionStorage.setItem('saarthi-journey',JSON.stringify(journey));localStorage.setItem('saarthi-journey',JSON.stringify({...journey,savedAt:Date.now()}));}catch{/* Optional storage. */}},[journey]);
  useEffect(()=>{const heading=document.querySelector('#main-content h1');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}},[screen]);
  useEffect(()=>()=>stopSpeech(),[]);
  useEffect(()=>{function pop(event){stopSpeech();if(location.pathname==='/checkpoint'){const next=initialJourney();setJourney(next);setScreen(next.started?'journey':'setup');}else setScreen(location.pathname==='/station-qr'?'qr':location.pathname==='/staff'?'staff':event.state?.screen||'home');}window.addEventListener('popstate',pop);return()=>window.removeEventListener('popstate',pop);},[]);
  function navigate(next){stopSpeech();const target=next==='places'?'setup':next;setScreen(target);history.pushState({screen:target},'',target==='staff'?'/staff':target==='qr'?'/station-qr':'/');window.scrollTo({top:0});}
  return <div className={screen==='home'?'landing-shell':'application-shell'}><a className="skip-link" href="#main-content">{t('Skip to content')}</a><header className="site-header"><button className="brand" onClick={()=>navigate('home')} aria-label={t('Sanket Saarthi home')}><span className="brand-icon" aria-hidden="true"><img src="/logo.svg" alt="" width="40" height="40"/></span><span>{language==='hi'?'संकेत सारथी':'Sanket Saarthi'}</span></button><nav aria-label={t('Main navigation')}>
    <button className="voice-toggle" aria-pressed={journey.voice} onClick={()=>{if(journey.voice)stopSpeech();setJourney(j=>({...j,voice:!j.voice}));}}>{t('Voice Assist')}: {t(journey.voice?'ON':'OFF')}</button>{speaking&&<button className="plain-action" onClick={stopSpeech}>{t('Stop Voice')}</button>}
    <label className="language-picker"><span className="sr-only">{t('Language')}</span><select value={language} onChange={e=>{stopSpeech();setLanguage(e.target.value);}}><option value="en">English</option><option value="hi">हिन्दी</option></select></label>
    <button className="theme-toggle" onClick={()=>setTheme(theme==='dark'?'light':'dark')} aria-label={t(theme==='dark'?'Switch to light mode':'Switch to dark mode')}>{theme==='dark'?'☀':'☾'}</button><a className="staff-link" href="/staff" target="_blank" rel="noreferrer">{t('Staff Login')}</a>{screen!=='home'&&<button className="back-button" onClick={()=>navigate(({setup:'home',details:'setup',journey:'details',staff:'home'})[screen]||'home')}>← {t('Back')}</button>}
  </nav></header><div id="main-content">{screen==='qr'?<StationQRCodes/>:screen==='staff'?<StaffDashboard live={live}/>:<JourneyScreens screen={screen} setScreen={navigate} journey={configured} setJourney={setJourney} live={live}/>}</div><footer className="site-footer"><span>{language==='hi'?'संकेत सारथी':'Sanket Saarthi'}</span></footer><Assistant screen={screen} onNavigate={navigate} onTheme={setTheme} voice={journey.voice}/></div>;
}
