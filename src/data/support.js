export const NEEDS = ['mobility', 'vision', 'hearing', 'custom'];
export const NEED_LABELS = {mobility:'Mobility',vision:'Blind or Low Vision',hearing:'Deaf or Hard of Hearing',custom:'Other / Custom Support'};
export const MOBILITY_MODES = {route:'Accessible Route Only',wheelchair:'Wheelchair Assistance',human:'Human Assistance',combined:'Wheelchair + Human Assistance'};
export function derivePreferences(needs = [], voice = false, custom = {}) {
  return { stepFreeNavigation:needs.includes('mobility') || Boolean(custom.stepFreeNavigation), visualAlerts:needs.includes('hearing') || Boolean(custom.visualAlerts), vibrationAlerts:needs.includes('hearing') || needs.includes('mobility') || Boolean(custom.vibrationAlerts), audioGuidance:voice, simpleGuidance:Boolean(custom.simpleGuidance) };
}
export function changeNeed(journey, need, checked) {
  if (!NEEDS.includes(need)) return journey;
  const needs = checked ? [...new Set([...journey.needs,need])] : journey.needs.filter(n => n !== need);
  return {...journey,needs,voice:need === 'vision' && checked ? true : journey.voice,mobilityMode:need === 'mobility' && !checked ? 'route' : journey.mobilityMode};
}
export const REQUEST_TRANSITIONS = { PENDING:'ACCEPTED', ACCEPTED:'ON_THE_WAY', ON_THE_WAY:'COMPLETED' };
export const REQUEST_STATUS = { PENDING:'Request received', ACCEPTED:'Assistance confirmed', ON_THE_WAY:'Assistance is on the way', COMPLETED:'Assistance completed' };
export function validTransition(from,to) { return REQUEST_TRANSITIONS[from] === to; }
export function mobilityRequest(mode) {
  if (mode === 'route') return null;
  return { type:MOBILITY_MODES[mode], wheelchair:mode === 'wheelchair' || mode === 'combined', human:mode === 'human' || mode === 'combined' };
}
