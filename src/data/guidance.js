import { routeFor, operational } from './journey.js';
export function checkpointName(id = '') {
  if (id.startsWith('platform-')) return `Platform ${id.slice(9)}`;
  return {'gate-1':'Entrance Gate 1','gate-2':'Gate 2','ramp-b':'Ramp B','lift-a':'Lift A','lift-b':'Lift B','corridor-c':'Corridor C','accessible-corridor':'Accessible Corridor','accessible-washroom':'Accessible Washroom','assistance-desk':'Assistance Desk'}[id] || id;
}
export function journeyRoute(journey, platform, facilities) {
  if (journey.purpose === 'train') return routeFor(platform ?? '—',facilities,journey.preferences?.stepFreeNavigation);
  const destination = journey.purpose === 'exit' ? 'gate-2' : journey.purpose === 'facility' ? journey.facility : 'assistance-desk';
  const destinationFacility = facilities.find(f => f.id === destination);
  if (['lift-a','lift-b'].includes(destination)) return {steps:['gate-1','ramp-b',...(destination === 'lift-b' ? ['corridor-c'] : []),destination].map(id => ({id,name:checkpointName(id)})),blocked:!operational(destinationFacility) || !operational(facilities.find(f=>f.id === 'ramp-b')),lift:checkpointName(destination)};
  return {steps:['gate-1','accessible-corridor',destination].map(id => ({id,name:checkpointName(id)})),blocked:destination !== 'gate-2' && !operational(destinationFacility),lift:null};
}
export function instructionText(route, checkpoint, simple, connected, t, place) {
  if (!connected) return t('Station updates are unavailable. Check with staff.');
  if (route.blocked) return t('Pause here. An accessible route is not confirmed. Request staff assistance.');
  const index = route.steps.findIndex(s => s.id === checkpoint);
  if (index < 0) return t('Your route changed. Confirm a checkpoint on the updated route or request staff assistance.');
  const next = route.steps[index+1];
  if (!next) return t('You’ve arrived.');
  if (simple) return [t('Go to {place}.',{place:place(next.name)}),t('Follow the signs.'),t('Confirm when you arrive.')].join('\n');
  return checkpoint === 'gate-1' && next.id === 'ramp-b' ? t('Continue straight for 70 m towards Ramp B.') : t('Follow the marked accessible route towards {place}.',{place:place(next.name)});
}
export function alertText(event,t,place) {
  if (event.kind === 'platform') return {title:t('Platform change'),text:`${t('Platform {number}',{number:event.before})} → ${t('Platform {number}',{number:event.after})}. ${t('Your journey has been updated.')}`};
  return {title:t(event.affectsRoute ? 'Route update':'Facility update'),text:t('{facility}: {before} → {after}.',{facility:place(event.facility),before:t(event.before),after:t(event.after)}),oldRoute:event.oldRoute?.map(place).join(' → '),newRoute:event.newRoute?.map(place).join(' → '),blocked:event.blocked};
}
