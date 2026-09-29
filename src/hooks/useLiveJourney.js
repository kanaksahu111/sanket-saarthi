import { useEffect, useEffectEvent, useState } from 'react';
import { subscribeToTrain } from '../services/venueService';
import { subscribeToFacility } from '../services/facilityService';
import { FACILITIES, TRAIN_ID, statusLabel } from '../data/journey';
import { journeyRoute, alertText } from '../data/guidance';
import { speak } from '../services/speechService';
import { triggerVibration } from '../utils/vibration';
import { useI18n } from '../i18n/context';
import { clientId } from '../utils/clientId';
export function useLiveJourney(journey, active) {
  const {preferences} = journey;
  const {language,t,place} = useI18n();
  const [data,setData] = useState({train:null,facilities:[],loading:true,error:'',fromCache:true});
  const [alerts,setAlerts] = useState([]);
  const notify = useEffectEvent(event => {
    if (!active || journey.stationCode !== 'BPL') return;
    if (event.kind === 'platform' && journey.purpose !== 'train') return;
    setAlerts(previous => [{...event,id:clientId('alert')},...previous].slice(0,8));
    if (preferences.vibrationAlerts) triggerVibration();
    if (preferences.audioGuidance) { const message = alertText(event,t,place); speak(`${message.title}. ${message.text}${message.newRoute ? ` ${t('New route')}: ${message.newRoute}` : ''}`,undefined,language); }
  });
  const facilityEvent = useEffectEvent((facility,old,next,records,train) => {
    const before = journeyRoute(journey,train?.platform,records);
    const after = journeyRoute(journey,train?.platform,records.map(f => f.id === facility.id ? next : f));
    const affectsRoute = before.steps.some(s => s.id === facility.id) || after.steps.some(s => s.id === facility.id);
    notify({kind:'facility',facility:facility.name,before:statusLabel(old.status),after:statusLabel(next.status),affectsRoute,oldRoute:affectsRoute ? before.steps.map(s=>s.name):null,newRoute:affectsRoute ? after.steps.map(s=>s.name):null,blocked:after.blocked});
  });
  useEffect(() => {
    let train=null,seenTrain=false;
    const records=new Map(),confirmed=new Map(),errors=new Map();
    function publish() {setData({train,facilities:[...records.values()].filter(Boolean),loading:!seenTrain || records.size < FACILITIES.length,error:[...errors.values()].join(' '),fromCache:[...confirmed.values()].some(value=>!value) || confirmed.size < FACILITIES.length+1});}
    const fail=key=>error=>{errors.set(key,error.message);if(key==='train')seenTrain=true;else records.set(key,null);publish();};
    const stops=[subscribeToTrain(TRAIN_ID,(next,meta)=>{
      if(train && next && String(train.platform)!==String(next.platform))notify({kind:'platform',before:train.platform,after:next.platform});
      train=next;seenTrain=true;errors.delete('train');confirmed.set('train',!meta.fromCache && !meta.pending);publish();
    },fail('train'))];
    FACILITIES.forEach(f=>stops.push(subscribeToFacility(f.id,(next,meta)=>{
      const old=records.get(f.id);
      if(old && next && old.status!==next.status)facilityEvent(f,old,next,[...records.values()].filter(Boolean),train);
      records.set(f.id,next);errors.delete(f.id);confirmed.set(f.id,!meta.fromCache && !meta.pending);publish();
    },fail(f.id))));
    return ()=>stops.forEach(stop=>stop());
  },[]);
  return {...data,alerts,dismissAlert:id=>setAlerts(a=>a.filter(item=>item.id!==id))};
}
