import test from 'node:test';
import assert from 'node:assert/strict';
import { searchStations, stations } from '../src/data/stations.js';
import { changeNeed, derivePreferences, mobilityRequest, validTransition } from '../src/data/support.js';
import { parseCheckpoint, checkpointUrl, FACILITIES } from '../src/data/journey.js';
import { journeyRoute, instructionText, alertText } from '../src/data/guidance.js';
import { getTrain, getTrainSchedule, getTrainStatus } from '../src/services/trainService.js';
import { translate, placeName, hi } from '../src/i18n/messages.js';
const facilities=FACILITIES.map(f=>({...f,status:'OPERATIONAL'}));
const t=(key,values)=>translate('hi',key,values);
const place=name=>placeName('hi',name);

test('search city, station code, Hindi and aliases without per-city truncation',()=>{
  assert.equal(searchStations('BPL')[0].code,'BPL');
  assert.equal(searchStations('भोपाल').length,2);
  assert.equal(searchStations('Delhi').length,7);
  assert.equal(searchStations('Mumbai').length,8);
  assert.equal(searchStations('Bangalore').length,3);
  assert.equal(new Set(stations.map(s=>s.code)).size,stations.length);
  assert.deepEqual(stations.filter(s=>s.configured).map(s=>s.code),['BPL']);
});
test('combined needs enable channels, mobility expansion preserves multiple selections',()=>{
  let journey={needs:[],voice:false,mobilityMode:'combined'};
  journey=changeNeed(journey,'vision',true);
  journey=changeNeed(journey,'hearing',true);
  journey=changeNeed(journey,'mobility',true);
  journey=changeNeed(journey,'cognitive',true);
  const prefs=derivePreferences(journey.needs,journey.voice);
  assert.deepEqual(prefs,{stepFreeNavigation:true,visualAlerts:true,vibrationAlerts:true,audioGuidance:true,simpleGuidance:false});
  assert.ok(!journey.needs.includes('cognitive'));
  assert.equal(changeNeed(journey,'communication',true),journey);
  assert.equal(derivePreferences([],false,{simpleGuidance:true}).simpleGuidance,true);
  journey=changeNeed(journey,'mobility',false);
  assert.equal(journey.mobilityMode,'route');
  assert.ok(journey.needs.includes('vision'));
});
test('route-only does not create request; combined support is exactly one payload',()=>{
  assert.equal(mobilityRequest('route'),null);
  assert.deepEqual(mobilityRequest('combined'),{type:'Wheelchair + Human Assistance',wheelchair:true,human:true});
  assert.equal(mobilityRequest('wheelchair').human,false);
  assert.equal(mobilityRequest('human').wheelchair,false);
});
test('request lifecycle cannot skip stages or complete twice',()=>{
  assert.ok(validTransition('PENDING','ACCEPTED'));
  assert.ok(validTransition('ACCEPTED','ON_THE_WAY'));
  assert.ok(validTransition('ON_THE_WAY','COMPLETED'));
  assert.equal(validTransition('PENDING','COMPLETED'),false);
  assert.equal(validTransition('COMPLETED','COMPLETED'),false);
});
test('new and legacy checkpoint URLs work, other stations cannot inherit BPL route',()=>{
  assert.equal(parseCheckpoint('?station=BPL&location=lift-b'),'lift-b');
  assert.equal(parseCheckpoint('?venue=bhopal-junction&location=lift-a'),'lift-a');
  assert.equal(parseCheckpoint('?station=NDLS&location=lift-b'),null);
  assert.equal(parseCheckpoint('?station=NDLS&venue=bhopal-junction&location=gate-1'),null);
  assert.equal(checkpointUrl('platform-5'),'/checkpoint?station=BPL&location=platform-5');
});
test('Hindi covers instructions, platform/route alerts and destinations',()=>{
  const route=journeyRoute({purpose:'train'},5,facilities);
  assert.match(instructionText(route,'gate-1',false,true,t,place),/रैंप/);
  const simple=instructionText(route,'lift-a',true,true,t,place);
  assert.ok(simple.split('\n').length===3);
  const alert=alertText({kind:'platform',before:3,after:5},t,place);
  assert.match(alert.text,/प्लेटफ़ॉर्म 3 → प्लेटफ़ॉर्म 5/);
  assert.equal(place('Platform 5'),'प्लेटफ़ॉर्म 5');
  assert.ok(Object.values(hi).every(value=>typeof value==='string'&&value.length>0));
});
test('all purposes have configured destinations and reject unavailable facilities',()=>{
  assert.equal(journeyRoute({purpose:'exit'},3,facilities).steps.at(-1).id,'gate-2');
  assert.equal(journeyRoute({purpose:'facility',facility:'accessible-washroom'},3,facilities).blocked,false);
  assert.equal(journeyRoute({purpose:'assistance'},3,[]).blocked,true);
});
test('train API uses known fallback on errors, never invents unknown trains',async()=>{
  const sample=await getTrain('12345',{apiBase:'/api/trains',fetcher:async()=>{throw new Error('offline');}});
  assert.equal(sample.source,'demo');
  await assert.rejects(getTrain('99999',{apiBase:'/api/trains',fetcher:async()=>({ok:false})}));
  const external=await getTrain('99999',{apiBase:'/api/trains',fetcher:async()=>({ok:true,json:async()=>({number:'99999',name:'Provider train',stationCodes:['NDLS']})})});
  assert.equal(external.source,'api');
  assert.equal((await getTrainSchedule('12345')).source,'demo');
  assert.equal((await getTrainStatus('12345')).status,'On Time');
});
