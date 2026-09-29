import { clientId } from './utils/clientId';
import { useEffect, useState } from 'react';
import Landing from './components/Landing';
import StationSearch from './components/StationSearch';
import AccessibilityNeeds from './components/AccessibilityNeeds';
import Dashboard from './pages/Dashboard';
import { SUPPORT, FACILITIES } from './data/journey';
import { getStationByCode as stationByCode } from './services/stationService';
import StationMap from './components/StationMap';
import NearbyStations from './components/NearbyStations';
import StandardStation from './pages/StandardStation';
import { mobilityRequest, MOBILITY_MODES } from './data/support';
import { checkpointName, journeyRoute } from './data/guidance';
import { getTrain } from './services/trainService';
import { createAssistanceRequest } from './services/assistanceService';
import { useI18n } from './i18n/context';
export default function JourneyScreens({screen,setScreen,journey,setJourney,live}) {
  const {language,t,place}=useI18n();
  const station=stationByCode(journey.stationCode);
  const [userLocation,setUserLocation]=useState(null);
  function selectStation(s){setJourney(j=>({...j,stationCode:s?.code||'',fromQR:false,checkpoint:s?.code===j.stationCode?j.checkpoint:'gate-1',started:false,requestId:null,id:s?.code===j.stationCode?j.id:clientId('journey')}));}
  if(screen==='home')return <Landing onStart={()=>setScreen('setup')}/>;
  if(screen==='details'&&station&&!station.configured)return <StandardStation journey={journey} setJourney={setJourney}/>;
  if(screen==='journey')return <Dashboard journey={journey} setJourney={setJourney} live={live}/>;
  if(screen==='details')return <JourneyDetails journey={journey} setJourney={setJourney} live={live} onStart={()=>setScreen('journey')}/>;
  return <main className="flow-page setup-page"><h1>{t('Station and accessibility')}</h1>{journey.fromQR&&station?<div className="identified-station"><strong>{t('Station identified from QR')}: {language==='hi'?(station.nameHi||station.name):station.name} ({station.code})</strong><p>{t('Current location')}: {place(checkpointName(journey.checkpoint))}</p><button className="plain-action" onClick={()=>setJourney(j=>({...j,fromQR:false,started:false}))}>{t('Change station')}</button></div>:<StationSearch station={station} onSelect={selectStation}/>}
    {!journey.fromQR&&<NearbyStations onSelect={selectStation} onLocation={setUserLocation}/>}
    {station&&<StationMap key={station.code} station={station} userLocation={userLocation}/>}
    {station&&!station.configured&&<p className="notice">{t('Detailed accessibility guidance is not yet available for this station.')}</p>}
    <AccessibilityNeeds journey={journey} setJourney={setJourney}/><button className="continue-button" disabled={!station} onClick={()=>setScreen('details')}>{t('Continue')} →</button>
  </main>;
}
function JourneyDetails({journey,setJourney,live,onStart}) {
  const {language,t,place}=useI18n();
  const [result,setResult]=useState({number:'',train:null,error:''});
  const [pending,setPending]=useState(false);
  const [submitError,setSubmitError]=useState(false);
  const [meeting,setMeeting]=useState(null);
  const [help,setHelp]=useState('Reaching my platform');
  const number=journey.trainNumber;
  useEffect(()=>{
    if(journey.purpose!=='train'||!/^\d{5}$/.test(number))return;
    let current=true;
    getTrain(number).then(train=>{if(current)setResult({number,train,error:''});}).catch(()=>{if(current)setResult({number,train:null,error:'Train not available. Try sample train 12345.'});});
    return ()=>{current=false;};
  },[number,journey.purpose]);
  const train=result.number===number?result.train:null;
  const platform=live.train?.platform;
  const route=journeyRoute(journey,platform,live.facilities);
  const destination=route.steps.at(-1);
  const request=journey.needs.includes('mobility')?mobilityRequest(journey.mobilityMode):null;
  const requiresRequest=Boolean(request)||journey.purpose==='assistance';
  const validTrain=journey.purpose!=='train'||(train?.number==='12345'&&train.source==='demo'&&Boolean(platform));
  const station=stationByCode(journey.stationCode);
  async function start(sendRequest){
    if(!validTrain||!station?.configured)return;
    setPending(true);setSubmitError(false);
    try{
      let requestId=journey.requestId;
      if(sendRequest&&!requestId){
        requestId=await createAssistanceRequest({...(request||{type:'Human Assistance',wheelchair:false,human:true}),location:meeting?.trim()||checkpointName(journey.checkpoint),locationId:meeting?.trim()?'':journey.checkpoint,destination:destination.name,destinationId:destination.id,support:request?.type==='Wheelchair Assistance'?'':help,journeyId:journey.id,stationCode:journey.stationCode});
      }
      setJourney(j=>({...j,started:true,train:journey.purpose==='train'?train:null,requestId}));onStart();
    }catch{setSubmitError(true);}finally{setPending(false);}
  }
  return <main className="flow-page details-page"><h1>{t('What do you need help with?')}</h1><p>{language==='hi'?station?.nameHi:station?.name} · {place(checkpointName(journey.checkpoint))}</p><div className="purpose-options">{[['train','Catch a Train'],['exit','Exit the Station'],['facility','Find a Facility'],['assistance','Request Assistance']].map(([value,label])=><button key={value} className="secondary-action" aria-pressed={journey.purpose===value} onClick={()=>setJourney(j=>({...j,purpose:value,requestId:null}))}>{t(label)}</button>)}</div>
    {journey.purpose==='train'&&<div className="train-entry"><label>{t('Train number')}<input inputMode="numeric" maxLength={5} value={number} onChange={e=>setJourney(j=>({...j,trainNumber:e.target.value.replace(/\D/g,''),requestId:null}))}/></label><p role="status">{!/^\d{5}$/.test(number)?t('Enter a five-digit train number.'):result.number!==number?t('Finding train…'):result.error?t(result.error):train?.source==='demo'?t('Sample train data. Platform updates are controlled by staff.'):t('Train details from the connected provider.')}</p>{train&&train.source!=='demo'&&<p>{t('This train has no configured indoor route here.')}</p>}</div>}
    {journey.purpose==='facility'&&<label>{t('Choose a facility')}<select value={journey.facility} onChange={e=>setJourney(j=>({...j,facility:e.target.value,requestId:null}))}>{FACILITIES.map(f=><option key={f.id} value={f.id}>{place(f.name)}</option>)}</select></label>}
    <section className="compact-summary"><h2>{t('Your journey')}</h2>{train&&journey.purpose==='train'&&<p>{language==='hi'?(train.nameHi||train.name):train.name}</p>}<p>{t('Destination')}: <strong>{place(destination.name)}</strong></p><p>{t('Starting from')}: {place(checkpointName(journey.checkpoint))}</p><ul>{SUPPORT.filter(([id])=>journey.preferences[id]).map(([id,label])=><li key={id}>✓ {t(label)}</li>)}{request&&<li>✓ {t(MOBILITY_MODES[journey.mobilityMode])}</li>}</ul>{!SUPPORT.some(([id])=>journey.preferences[id])&&<p>{t('Standard text guidance')}</p>}</section>
    {requiresRequest&&<section className="request-setup"><h2>{t(request?.type||'Human Assistance')}</h2><label>{t(request?.type==='Wheelchair Assistance'?'Where would you like to receive the wheelchair?':'Where should staff meet you?')}<input value={meeting??place(checkpointName(journey.checkpoint))} maxLength={120} onChange={e=>setMeeting(e.target.value)}/></label>{request?.type!=='Wheelchair Assistance'&&<label>{t('What would you like help with?')}<select value={help} onChange={e=>setHelp(e.target.value)}>{['Reaching my platform','Navigating the station','Boarding assistance','Communication assistance','Other'].map(option=><option key={option} value={option}>{t(option)}</option>)}</select></label>}<p className="muted">{t('This coordinates assistance with demo staff, not an official railway reservation.')}</p></section>}
    {submitError&&<p className="error-text" role="alert">{t('Request not sent. Check your connection and try again.')}</p>}
    <div className="action-row"><button className="continue-button" disabled={pending||!validTrain||!station?.configured||live.loading||Boolean(live.error)||live.fromCache} onClick={()=>start(requiresRequest)}>{pending?t('Sending…'):t(requiresRequest?'Request assistance and start':'Start Journey')} →</button>{requiresRequest&&<button className="plain-action" disabled={pending||!validTrain||live.loading||Boolean(live.error)||live.fromCache} onClick={()=>start(false)}>{t('Start without requesting help')}</button>}</div>
    {(live.loading||live.error||live.fromCache)&&<p role="status">{t(live.error?'Station updates are unavailable. Check with staff.':'Waiting for station information…')}</p>}
  </main>;
}


