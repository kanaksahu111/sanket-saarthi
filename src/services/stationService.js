import catalog from '../data/station-catalog.json' with { type: 'json' };
import { stations as curated } from '../data/stations.js';

// REAL geographic reference data, not a live railway feed. DataMeet CC0 snapshot.
// Renamed codes are reconciled with the existing curated railway-code catalog.
const renamed = {HBJ:'RKMP',BCT:'MMCT',CSTM:'CSMT'};
const byCode = new Map();
function coordinatePair(value) {
  return Array.isArray(value) && value.length >= 2 && value.every(Number.isFinite)
    && value[0] >= 68 && value[0] <= 98 && value[1] >= 6 && value[1] <= 38;
}
for (const [codeValue,name,state,address,coordinatesValue] of catalog) {
  const row={code:codeValue,name,state,address,coordinates:coordinatesValue};
  if (/bangladesh|pakistan|nepal/i.test(row.state || '')) continue;
  const code = renamed[row.code] || row.code;
  const coordinates = coordinatePair(row.coordinates) ? row.coordinates : null;
  if (byCode.has(code) && (byCode.get(code).coordinates || !coordinates)) continue;
  byCode.set(code,{...row,code,coordinates,aliases:row.code === code ? [] : [row.code],configured:false,source:'REAL',coordinateSource:'DataMeet railways (CC0)',operationalSource:null});
}
for (const station of curated) {
  const geographic=byCode.get(station.code);
  byCode.set(station.code,{...geographic,...station,aliases:[...(geographic?.aliases||[]),...station.aliases],source:'REAL',operationalSource:station.configured?'DEMO':null});
}
const stations=[...byCode.values()];
const searchable=stations.map(station=>({station,text:[station.code,station.name,station.nameHi,station.city,station.cityHi,station.state,station.address,...station.aliases].filter(Boolean).join(' ').toLocaleLowerCase()}));
export const stationCount=stations.length;
export function getStationByCode(code) {return byCode.get(renamed[code?.toUpperCase()]||code?.toUpperCase());}
export function getStationLocation(code) {const s=getStationByCode(code);return s?.coordinates ? {latitude:s.coordinates[1],longitude:s.coordinates[0],source:s.coordinateSource}:null;}
export function searchStations(query='') {
  const q=query.trim().toLocaleLowerCase();
  return searchable.filter(({text})=>!q||q.split(/\s+/).every(part=>text.includes(part))).map(({station})=>station)
    .sort((a,b)=>Number(b.code.toLowerCase()===q)-Number(a.code.toLowerCase()===q)||Number(b.configured)-Number(a.configured));
}
export function distanceKm(latitude,longitude,otherLatitude,otherLongitude) {
  const rad=n=>n*Math.PI/180;
  const a=Math.sin(rad(otherLatitude-latitude)/2)**2+Math.cos(rad(latitude))*Math.cos(rad(otherLatitude))*Math.sin(rad(otherLongitude-longitude)/2)**2;
  return 6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(Math.max(0,1-a)));
}
export function getNearbyStations(latitude,longitude,radiusKm=50) {
  if(!Number.isFinite(latitude)||!Number.isFinite(longitude)||Math.abs(latitude)>90||Math.abs(longitude)>180)return [];
  return stations.filter(s=>s.coordinates).map(s=>({...s,distance:distanceKm(latitude,longitude,s.coordinates[1],s.coordinates[0])})).filter(s=>s.distance<=radiusKm).sort((a,b)=>a.distance-b.distance);
}
