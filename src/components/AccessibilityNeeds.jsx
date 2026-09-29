import { NEEDS, NEED_LABELS, MOBILITY_MODES, changeNeed } from '../data/support';
import { useI18n } from '../i18n/context';
export default function AccessibilityNeeds({journey,setJourney}) {
  const {t}=useI18n();
  return <section className="needs-section" aria-labelledby="needs-title"><h2 id="needs-title">{t('What would make your journey easier?')}</h2><p>{t('Choose one or more options.')}</p><div className="needs-list">{NEEDS.map(id=><div key={id} className={journey.needs.includes(id)?'need-selected':''}><label className="need-choice"><input type="checkbox" checked={journey.needs.includes(id)} onChange={e=>setJourney(j=>changeNeed(j,id,e.target.checked))}/><strong>{t(NEED_LABELS[id])}</strong></label>{journey.needs.includes(id)&&<div className="need-details">
    {id==='mobility'&&<fieldset><legend>{t('What would help?')}</legend>{Object.entries(MOBILITY_MODES).map(([value,label])=><label key={value}><input type="radio" name="mobility-mode" checked={journey.mobilityMode===value} onChange={()=>setJourney(j=>({...j,mobilityMode:value}))}/>{t(label)}</label>)}</fieldset>}
    {id==='vision'&&<p>{journey.voice?t('Voice guidance enabled. You can turn it off above.'):`${t('Voice Assist')}: ${t('OFF')}`}</p>}
    {id==='hearing'&&<p>{t('Visual and vibration alerts enabled.')}</p>}


    {id==='custom'&&<fieldset><legend>{t('Selected support')}</legend>{[['stepFreeNavigation','Step-Free Navigation'],['visualAlerts','Visual Alerts'],['vibrationAlerts','Vibration Alerts'],['simpleGuidance','Simple Guidance']].map(([key,label])=><label key={key}><input type="checkbox" checked={Boolean(journey.custom[key])} onChange={e=>setJourney(j=>({...j,custom:{...j.custom,[key]:e.target.checked}}))}/>{t(label)}</label>)}</fieldset>}
  </div>}</div>)}</div></section>;
}
