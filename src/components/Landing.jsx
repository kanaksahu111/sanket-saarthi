import { useSyncExternalStore } from 'react';
import Showcase from './Showcase';
import { useI18n } from '../i18n/context';
import { speak, stopSpeech, subscribeSpeech, isSpeaking } from '../services/speechService';
export default function Landing({onStart}){
  const {t,language}=useI18n();
  const speaking=useSyncExternalStore(subscribeSpeech,isSpeaking,()=>false);
  return <><main className="hero reference-hero"><div className="hero-content"><h1>{t('Navigate public spaces with confidence.')}</h1><p className="hero-description">{t('Accessible guidance, real-time updates and assistance when you need it.')}</p><div className="action-row"><button className="start-button" onClick={onStart}>{t('Start your journey')} <span>→</span></button><button className="plain-action" disabled={!window.speechSynthesis} onClick={()=>speaking?stopSpeech():speak(t('Choose a station and your accessibility needs on the same screen.'),undefined,language)}>{t(speaking?'Stop Voice':'Read Instruction')}</button></div></div><Showcase/></main><section className="venue-strip" aria-label={t('Find your route')}><div className="venue-strip-grid">{['Railway Stations','Hospitals','Airports','Government Offices'].map((title,i)=><button key={title} onClick={onStart} disabled={i>0}><span><strong>{t(title)}</strong>{i>0&&<small>{t('Coming soon')}</small>}</span>{i===0&&<span>→</span>}</button>)}</div></section></>;
}
