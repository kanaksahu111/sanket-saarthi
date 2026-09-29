import { useRef,useEffect,useState } from 'react';
import { getNearbyStations } from '../services/stationService';
import { useI18n } from '../i18n/context';
export default function NearbyStations({onSelect,onLocation}) {
  const {t,language}=useI18n();
  const [state,setState]=useState({busy:false,stations:[],message:''});
  const mounted=useRef(true);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
  function locate(){
    if(!navigator.geolocation||!window.isSecureContext){setState({busy:false,stations:[],message:'Location requires HTTPS and browser support. Search manually instead.'});return;}
    setState({busy:true,stations:[],message:''});
    navigator.geolocation.getCurrentPosition(position=>{
      if(!mounted.current)return;
      const {latitude,longitude,accuracy}=position.coords;
      onLocation({latitude,longitude,accuracy});
      const stations=getNearbyStations(latitude,longitude);
      setState({busy:false,stations,message:stations.length?'':'No stations with known coordinates were found within 50 km.'});
    },()=>{if(mounted.current)setState({busy:false,stations:[],message:'Location unavailable or denied. Search manually instead.'});},{timeout:10000,maximumAge:60000,enableHighAccuracy:false});
  }
  return <section className="nearby-stations"><button className="secondary-action" onClick={locate} disabled={state.busy}>{t(state.busy?'Finding location…':'Use my location')}</button><p className="muted">{t('Location is not saved. Map tiles use your viewing area; distances are straight-line estimates, not accessible routes.')}</p>{state.message&&<p role="status">{t(state.message)}</p>}{state.stations.length>0&&<details open><summary>{t('Stations near you')} ({state.stations.length})</summary><ul>{state.stations.map(s=><li key={s.code}><button onClick={()=>onSelect(s)}><strong>{language==='hi'?(s.nameHi||s.name):s.name} ({s.code})</strong><span>{s.distance.toFixed(1)} {t('km away')}</span></button></li>)}</ul></details>}</section>;
}
