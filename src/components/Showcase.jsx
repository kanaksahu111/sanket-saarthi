import { useEffect,useRef,useState } from 'react';
import gsap from 'gsap';
import { useI18n } from '../i18n/context';
const venues=[{name:'Bhopal Junction',type:'Railway station',steps:['Entrance Gate 1','Ramp B','Lift A','Platform 3']},{name:'Airport',type:'Coming soon',steps:['Entrance','Assistance Desk','Departure gate']},{name:'Hospital',type:'Coming soon',steps:['Entrance','Reception','Department']}];
export default function Showcase(){
  const {t,place}=useI18n();
  const root=useRef(null);
  const [active,setActive]=useState(0),[paused,setPaused]=useState(false);
  useEffect(()=>{const media=gsap.matchMedia();media.add('(prefers-reduced-motion: no-preference)',()=>{if(paused)return;const timeline=gsap.timeline({repeat:-1});for(let i=0;i<venues.length;i++)timeline.to(root.current,{opacity:0,duration:.2,delay:4}).call(()=>setActive(a=>(a+1)%venues.length)).to(root.current,{opacity:1,duration:.3});});return()=>media.revert();},[paused]);
  const venue=venues[active];
  return <section className="showcase" aria-label={t('Example journeys')}><div className="showcase-top"><span>{t('Journey preview')}</span><span className="preview-tag">{t('Step-free route')}</span></div><div className="showcase-card" ref={root}><div className="preview-label"><span className="venue-symbol" aria-hidden="true">⌖</span><span>{t(venue.name)}<small>{t(venue.type)}</small></span></div><div className="preview-stops">{venue.steps.map((step,i)=><div key={step}><span className="preview-stop-marker" aria-hidden="true">{i===0?'●':'○'}</span><strong>{place(step)}</strong></div>)}</div><p className="muted">{t('Sample route and distances; follow station signs.')}</p></div><div className="showcase-bottom"><div className="slide-dots">{venues.map((v,i)=><button key={v.name} aria-label={t('Preview {place}',{place:t(v.name)})} aria-pressed={active===i} onClick={()=>{setPaused(true);setActive(i);}}/>)}</div><button className="pause-button" onClick={()=>setPaused(p=>!p)}>{t(paused?'Play':'Pause')}</button></div></section>;
}
