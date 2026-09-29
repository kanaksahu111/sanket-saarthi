export const VENUE_ID = 'central-station'; // Keep the existing Firebase path.
export const VENUE_NAME = 'Bhopal Junction';
export const TRAIN_ID = 'train-001';
export const SUPPORT = [
  ['stepFreeNavigation', 'Step-Free Navigation', 'Use ramps, lifts and accessible corridors.'],
  ['visualAlerts', 'Visual Alerts', 'Prominent text alerts for important changes.'],
  ['vibrationAlerts', 'Vibration Alerts', 'Vibrate on supported devices, alongside text alerts.'],
  ['audioGuidance', 'Voice Assist', 'Read instructions and important updates aloud.'],
  ['simpleGuidance', 'Simple Guidance', 'Short instructions, one action at a time.'],
];
export const FACILITIES = [
  { id: 'lift-a', name: 'Lift A', nearby: 'Main concourse' },
  { id: 'lift-b', name: 'Lift B', nearby: 'Corridor C' },
  { id: 'ramp-b', name: 'Ramp B', nearby: '70 m from Entrance Gate 1' },
  { id: 'accessible-washroom', name: 'Accessible Washroom', nearby: '40 m from Ramp B' },
  { id: 'assistance-desk', name: 'Assistance Desk', nearby: 'Main concourse' },
];
export const FACILITY_IDS = FACILITIES.map(f => f.id);
export const TYPES = ['Mobility Assistance', 'Navigation Help', 'Communication Assistance', 'Boarding Assistance', 'Luggage Assistance', 'Wheelchair Assistance', 'Human Assistance', 'Wheelchair + Human Assistance', 'Other'];
export function statusLabel(status) {
  return ({ OPERATIONAL: 'Operational', AVAILABLE: 'Operational', OPEN: 'Operational', UNAVAILABLE: 'Unavailable', OUT_OF_SERVICE: 'Unavailable', MAINTENANCE: 'Maintenance' })[status] || 'Not confirmed';
}
export function operational(facility) { return statusLabel(facility?.status) === 'Operational'; }
export function routeFor(platform, facilities, stepFree = true) {
  const byId = Object.fromEntries(facilities.map(f => [f.id, f]));
  const useB = !operational(byId['lift-a']);
  const blocked = !operational(byId['ramp-b']) || (!operational(byId['lift-a']) && !operational(byId['lift-b']));
  const middle = useB ? ['corridor-c', 'lift-b'] : ['lift-a', 'accessible-corridor'];
  // General guidance uses the same safe station route, without asserting step-free suitability.
  const ids = ['gate-1', 'ramp-b', ...middle, `platform-${platform}`];
  const names = { 'gate-1': 'Entrance Gate 1', 'ramp-b': 'Ramp B', 'lift-a': 'Lift A', 'lift-b': 'Lift B', 'corridor-c': 'Corridor C', 'accessible-corridor': 'Accessible Corridor', [`platform-${platform}`]: `Platform ${platform}` };
  return { steps: ids.map(id => ({ id, name: names[id] })), blocked, useB, stepFree, lift: useB ? 'Lift B' : 'Lift A' };
}
export function instructionFor(route, checkpoint, simple) {
  if (route.blocked) return 'Pause here. An accessible route is not confirmed. Request staff assistance.';
  const index = route.steps.findIndex(s => s.id === checkpoint);
  if (index < 0) return 'Your route changed. Confirm a checkpoint on the updated route or request staff assistance.';
  const next = route.steps[index + 1];
  if (!next) return 'You’ve arrived. Please check the station display before boarding.';
  if (simple) return `Go to ${next.name}. Follow the signs. Confirm when you arrive.`;
  return checkpoint === 'gate-1' ? 'Continue straight for 70 m towards Ramp B.' : `Follow the marked accessible route towards ${next.name}. Confirm your location at the next checkpoint.`;
}
export function parseCheckpoint(search) {
  const query = new URLSearchParams(search);
  if (query.has('station') ? query.get('station') !== 'BPL' : query.get('venue') !== 'bhopal-junction') return null;
  const id = query.get('location');
  return /^(gate-1|gate-2|ramp-b|lift-a|lift-b|corridor-c|accessible-corridor|accessible-washroom|assistance-desk|platform-([1-9]|1[0-9]|20))$/.test(id || '') ? id : null;
}
export function checkpointUrl(id) { return `/checkpoint?station=BPL&location=${encodeURIComponent(id)}`; }
export function platformNumber(value) { const n = Number(value); if (!Number.isInteger(n) || n < 1 || n > 20) throw new Error('Enter a platform between 1 and 20.'); return n; }
