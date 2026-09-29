import { parseCheckpoint, checkpointUrl } from '../data/journey.js';
export const QR_CHECKPOINTS=['gate-1','ramp-b','lift-a','lift-b','corridor-c','accessible-corridor','accessible-washroom','assistance-desk','platform-3','platform-5'];
export function processCheckpoint(search,journey) {
  const checkpoint=parseCheckpoint(search);
  return checkpoint?{...journey,stationCode:'BPL',checkpoint,fromQR:true}:null;
}
export function qrUrl(id,origin,configuredBase='') {
  if(!parseCheckpoint(checkpointUrl(id).split('?')[1]))throw new Error('Invalid checkpoint');
  const base=new URL(configuredBase||origin);
  if(!['http:','https:'].includes(base.protocol)||base.username||base.password)throw new Error('Use an HTTP(S) application URL.');
  return new URL(checkpointUrl(id),base.origin).href;
}
export function isLoopbackUrl(url) {return ['localhost','127.0.0.1','[::1]'].includes(new URL(url).hostname);}
