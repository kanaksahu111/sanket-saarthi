import { useEffect,useRef,useState,useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getStationLocation } from '../services/stationService';
import { useI18n } from '../i18n/context';
const markerIcon=L.divIcon({className:'station-map-marker',html:'<span aria-hidden="true">●</span>',iconSize:[28,28],iconAnchor:[14,14]});
export default function StationMap({station,userLocation}) {
  const {t,language}=useI18n();
  const container=useRef(null);
  const [failed,setFailed]=useState(false);
  const geo=useMemo(()=>getStationLocation(station.code),[station.code]);
  const name=language==='hi'?(station.nameHi||station.name):station.name;
  useEffect(()=>{
    if(!geo||!container.current)return;
    const map=L.map(container.current,{scrollWheelZoom:false,zoomControl:false}).setView([geo.latitude,geo.longitude],15);
    L.control.zoom({zoomInTitle:t('Zoom in'),zoomOutTitle:t('Zoom out')}).addTo(map);
    const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
    tiles.on('tileerror',()=>setFailed(true));
    const text=document.createElement('span');text.textContent=`${name} (${station.code})`;
    L.marker([geo.latitude,geo.longitude],{icon:markerIcon,title:`${name} (${station.code})`,alt:name}).addTo(map).bindPopup(text);
    if(userLocation){
      L.circleMarker([userLocation.latitude,userLocation.longitude],{radius:8,color:'#165d9a',fillOpacity:0.8}).addTo(map).bindTooltip(t('Your approximate location'));
      L.circle([userLocation.latitude,userLocation.longitude],{radius:userLocation.accuracy||0,color:'#165d9a',weight:1,fillOpacity:0.05}).addTo(map);
      map.fitBounds([[geo.latitude,geo.longitude],[userLocation.latitude,userLocation.longitude]],{padding:[35,35],maxZoom:15});
    }
    const observer=new ResizeObserver(()=>map.invalidateSize());observer.observe(container.current);
    return()=>{observer.disconnect();map.remove();};
  },[station.code,geo,name,userLocation,t]);
  return <section className="station-map-section" aria-label={t('Station location')}><h2>{t('Station location')}</h2><p><strong>{name} ({station.code})</strong>{station.state?` · ${station.state}`:''}</p>{geo?<><div ref={container} className="station-map" role="region" aria-label={t('Outdoor station map')} />{failed&&<p role="status">{t('Map tiles are unavailable. You can continue without the map.')}</p>}<p className="muted">{geo.latitude.toFixed(5)}, {geo.longitude.toFixed(5)} · {t('Geographic context only. Indoor routes are separate demo guidance.')}</p><a className="secondary-action map-link" href={`https://www.openstreetmap.org/?mlat=${geo.latitude}&mlon=${geo.longitude}#map=16/${geo.latitude}/${geo.longitude}`} target="_blank" rel="noreferrer">{t('Open Map')} ↗</a></>:<p>{t('Geographic location is not available for this station.')}</p>}<small className="map-source">{t('Station locations: DataMeet, CC0. Reference data may be outdated.')}</small></section>;
}
