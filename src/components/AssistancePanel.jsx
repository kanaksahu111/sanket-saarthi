import StatusIcon from './StatusIcon';
import { useEffect,useEffectEvent,useRef,useState } from 'react';
import { useAssistanceRequests } from '../hooks/useAssistanceRequests';
import { TYPES } from '../data/journey';
import { REQUEST_STATUS,mobilityRequest } from '../data/support';
import { checkpointName } from '../data/guidance';
import { speak } from '../services/speechService';
import { triggerVibration } from '../utils/vibration';
import { useI18n } from '../i18n/context';
function requestMessage(request){
  if(request.status==='PENDING')return 'Finding available staff…';
  if(request.status==='ON_THE_WAY')return 'Staff are on the way to your meeting point.';
  if(request.status==='COMPLETED')return 'Your assistance request is complete.';
  if(request.wheelchair&&request.human)return 'Wheelchair and human assistance have been accepted for your journey.';
  return request.wheelchair?'Your wheelchair assistance request has been accepted.':'A staff member has accepted your assistance request.';
}
export default function AssistancePanel({checkpoint,destination,journey,setJourney,boarding=false,defaultLocation}){
  const {t,place,language}=useI18n();
  const [open,setOpen]=useState(journey.purpose==='assistance'&&!journey.requestId);
  const [type,setType]=useState(boarding?'Boarding Assistance':journey.needs.includes('mobility')&&mobilityRequest(journey.mobilityMode)?mobilityRequest(journey.mobilityMode).type:'Navigation Help');
  const [meeting,setMeeting]=useState(null);
  const [pending,setPending]=useState(false),[error,setError]=useState(false);
  const {requests,createRequest,error:listenerError,loading}=useAssistanceRequests();
  const request=requests.find(r=>r.id===journey.requestId)||requests.find(r=>r.journeyId===journey.id);
  const previous=useRef(null);
  const announce=useEffectEvent(current=>{if(journey.preferences.vibrationAlerts)triggerVibration();if(journey.preferences.audioGuidance)speak(`${t(REQUEST_STATUS[current.status])}. ${t(requestMessage(current))} ${t('Meeting point')}: ${current.locationId?place(checkpointName(current.locationId)):current.location}`,undefined,language);});
  useEffect(()=>{if(request&&previous.current?.id===request.id&&previous.current.status!==request.status)announce(request);previous.current=request?{id:request.id,status:request.status}:null;},[request]);
  async function submit(e){e.preventDefault();setPending(true);setError(false);try{const id=await createRequest({type,location:meeting?.trim()||defaultLocation||checkpointName(checkpoint),locationId:meeting?.trim()?'':checkpoint,destination:destination.name,destinationId:destination.id,wheelchair:type==='Wheelchair Assistance'||type==='Wheelchair + Human Assistance',human:type!=='Wheelchair Assistance',journeyId:journey.id,stationCode:journey.stationCode});setJourney(j=>({...j,requestId:id}));setOpen(false);}catch{setError(true);}finally{setPending(false);}}
  const active=request&&request.status!=='COMPLETED';
  return <section id="assistance" className="assistance-section" aria-label={t('Human Assistance')}>
    {request&&<div className={journey.preferences.visualAlerts?'notice assistance-notice prominent':'notice assistance-notice'} role="status" data-tone={request.status==='PENDING'?'info':'success'}><strong className="status-heading"><StatusIcon kind={request.status==='PENDING'?'info':'success'}/>{t(request.wheelchair&&!request.human&&request.status==='ACCEPTED'?'Wheelchair assistance confirmed':REQUEST_STATUS[request.status]||'Request received')}</strong><p>{t(requestMessage(request))}</p><p>{t('Meeting point')}: <b>{request.locationId?place(checkpointName(request.locationId)):request.location}</b></p>{request.destination&&<p>{t('Destination')}: {place(request.destination)}</p>}<p>{t(request.type)}</p><ol className="request-progress">{Object.entries(REQUEST_STATUS).map(([status,label])=><li key={status} aria-current={request.status===status?'step':undefined}>{request.status===status?'● ':''}{t(label)}</li>)}</ol></div>}
    {!open&&<button className="secondary-action" disabled={Boolean(active)||loading} onClick={()=>{setType(boarding?'Boarding Assistance':journey.needs.includes('mobility')&&mobilityRequest(journey.mobilityMode)?mobilityRequest(journey.mobilityMode).type:'Navigation Help');setMeeting(null);setOpen(true);}}>{t(active?'Assistance request active':boarding?'Request Boarding Assistance':'Request Assistance')}</button>}
    {open&&!active&&<form onSubmit={submit} className="assistance-form"><h3>{t('How can we help?')}</h3><label>{t('Assistance type')}<select value={type} onChange={e=>setType(e.target.value)}>{TYPES.map(option=><option key={option} value={option}>{t(option)}</option>)}</select></label><label>{t(type==='Wheelchair Assistance'?'Where would you like to receive the wheelchair?':'Where should staff meet you?')}<input value={meeting??defaultLocation??place(checkpointName(checkpoint))} onChange={e=>setMeeting(e.target.value)} required maxLength={120}/></label><p>{t('Destination')}: {place(destination.name)}</p>{type.includes('Wheelchair')&&<p className="muted">{t('This coordinates assistance with demo staff, not an official railway reservation.')}</p>}<div className="action-row"><button className="continue-button" disabled={pending}>{t(pending?'Sending…':type==='Wheelchair Assistance'?'Request Wheelchair':'Request Assistance')}</button><button type="button" className="plain-action" disabled={pending} onClick={()=>setOpen(false)}>{t('Cancel')}</button></div></form>}
    {(error||listenerError)&&<p role="alert" className="error-text">{t(error?'Request not sent. Check your connection and try again.':'Assistance updates are unavailable.')}</p>}
  </section>;
}
