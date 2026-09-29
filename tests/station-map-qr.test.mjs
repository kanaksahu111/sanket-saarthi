import test from 'node:test';
import assert from 'node:assert/strict';
import QRCode from 'qrcode';
import { stationCount,searchStations,getStationByCode,getStationLocation,getNearbyStations,distanceKm } from '../src/services/stationService.js';
import { QR_CHECKPOINTS,qrUrl,processCheckpoint,isLoopbackUrl } from '../src/services/checkpointService.js';

test('large catalog searches names/cities/codes and reconciles renamed stations',()=>{
  assert.ok(stationCount>8000);assert.ok(searchStations('Mumbai').length>8);
  assert.equal(searchStations('NDLS')[0].code,'NDLS');
  assert.equal(getStationByCode('HBJ').code,'RKMP');
  assert.equal(getStationByCode('BPL').operationalSource,'DEMO');
  assert.equal(getStationByCode('NDLS').configured,false);
  assert.equal(getStationByCode('invented'),undefined);
});
test('nearby stations use source coordinates and actual great-circle distances',()=>{
  const bpl=getStationLocation('BPL');assert.ok(bpl.latitude>23&&bpl.latitude<24);
  assert.equal(getNearbyStations(bpl.latitude,bpl.longitude)[0].code,'BPL');
  assert.equal(getNearbyStations(bpl.latitude,bpl.longitude)[0].distance,0);
  assert.ok(Math.abs(distanceKm(0,0,0,1)-111.195)<0.1);
  assert.deepEqual(getNearbyStations(NaN,0),[]);
  assert.equal(getStationLocation('made-up'),null);
});
test('all QR codes encode deployed URLs and use the same checkpoint processor',async()=>{
  for(const id of QR_CHECKPOINTS){
    const url=qrUrl(id,'http://localhost:5173','https://saarthi.example');
    assert.ok(url.startsWith('https://saarthi.example/checkpoint?'));
    const journey=processCheckpoint(new URL(url).search,{id:'test',needs:['mobility'],started:true});
    assert.equal(journey.checkpoint,id);assert.equal(journey.started,true);assert.deepEqual(journey.needs,['mobility']);
    const svg=await QRCode.toString(url,{type:'svg',errorCorrectionLevel:'M',margin:4});assert.match(svg,/<svg/);
  }
  assert.equal(processCheckpoint('?station=NDLS&location=lift-b',{}),null);
  assert.throws(()=>qrUrl('bad','https://saarthi.example'));
  assert.throws(()=>qrUrl('gate-1','https://saarthi.example','javascript:alert(1)'));
  assert.equal(isLoopbackUrl(qrUrl('gate-1','http://localhost:5173')),true);
  assert.equal(isLoopbackUrl(qrUrl('gate-1','http://192.168.1.2:5173')),false);
});
