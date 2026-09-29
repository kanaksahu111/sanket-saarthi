import { useState } from 'react';
import StationMap from '../components/StationMap';
import AssistancePanel from '../components/AssistancePanel';
import { getStationByCode } from '../services/stationService';
import { getTrain } from '../services/trainService';
import { speak } from '../services/speechService';
import { useI18n } from '../i18n/context';
export default function StandardStation({journey,setJourney}){
  const {language,t}=useI18n();
  const station=getStationByCode(journey.stationCode);
  const [number,setNumber]=useState('');
  const [train,setTrain]=useState(null);
  const [message,setMessage]=useState('');
  const [busy,setBusy]=useState(false);
  const name=language==='hi'?(station.nameHi||station.name):station.name;
  async function lookup(e){e.preventDefault();setBusy(true);setTrain(null);setMessage('');try{const result=await getTrain(number);if(!result.stationCodes.includes(station.code)){setMessage('This train is not configured for this station.');}else{setTrain(result);}}catch{setMessage('Train information is unavailable. Check official station information.');}finally{setBusy(false);}}
  return <main className="flow-page"><h1>{name}</h1><p>{station.code}{station.state?` · ${station.state}`:''}</p><p className="notice">{t('Detailed accessibility guidance is not yet available for this station.')}</p><div className="action-row"><a className="secondary-action" href="#assistance">{t('Request Assistance')}</a><a className="secondary-action" href="#station-location">{t('View Station Location')}</a><button className="secondary-action" onClick={()=>speak(`${name}. ${t('Detailed accessibility guidance is not yet available for this station.')}`,undefined,language)}>{t('Read Instruction')}</button></div><div id="station-location"><StationMap station={station}/></div><form className="train-entry" onSubmit={lookup}><label>{t('Train number')}<input inputMode="numeric" pattern="[0-9]{5}" required maxLength={5} value={number} onChange={e=>setNumber(e.target.value.replace(/\D/g,''))}/></label><button className="secondary-action" disabled={busy}>{t(busy?'Finding train…':'Find train')}</button><p role="status">{t(message)}</p>{train&&<p>{train.name} · {t(train.source==='demo'?'Sample train data. Platform updates are controlled by staff.':'Train details from the connected provider.')}</p>}</form><p className="muted">{t('Requests go to the Sanket Saarthi demo team. Local railway staffing is not connected. Enter a clear meeting point.')}</p><AssistancePanel checkpoint="" defaultLocation="" destination={{id:'station',name:station.name}} journey={journey} setJourney={setJourney}/></main>;
}
