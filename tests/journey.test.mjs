import test from 'node:test';
import assert from 'node:assert/strict';
import { FACILITIES, routeFor, instructionFor, parseCheckpoint, platformNumber, statusLabel } from '../src/data/journey.js';
const facilities = FACILITIES.map(f => ({ ...f, status: 'OPERATIONAL' }));
test('demo route uses ramps and lift A, and changes destination 3 to 5', () => {
  const first = routeFor(3, facilities);
  assert.deepEqual(first.steps.map(s => s.id), ['gate-1', 'ramp-b', 'lift-a', 'accessible-corridor', 'platform-3']);
  assert.equal(routeFor(5, facilities).steps.at(-1).id, 'platform-5');
  assert.equal(first.blocked, false);
});
test('lift A outage selects corridor C and lift B', () => {
  const next = routeFor(5, facilities.map(f => f.id === 'lift-a' ? { ...f, status: 'UNAVAILABLE' } : f));
  assert.deepEqual(next.steps.map(s => s.id), ['gate-1', 'ramp-b', 'corridor-c', 'lift-b', 'platform-5']);
  assert.equal(next.blocked, false);
  assert.match(instructionFor(next, 'lift-a', false), /Confirm a checkpoint/);
  assert.match(instructionFor(next, 'lift-b', true), /Go to Platform 5/);
  assert.match(instructionFor(next, 'platform-5', false), /arrived/);
});
test('unknown, unavailable ramp, or both unavailable lifts never claim a safe route', () => {
  assert.equal(routeFor(3, []).blocked, true);
  for (const disabled of [['ramp-b'], ['lift-a','lift-b']]) {
    const route = routeFor(3, facilities.map(f => disabled.includes(f.id) ? { ...f, status: 'MAINTENANCE' } : f));
    assert.equal(route.blocked, true);
    assert.match(instructionFor(route, 'gate-1', false), /Pause here/);
  }
});
test('checkpoint URLs accept only this venue and known checkpoints', () => {
  assert.equal(parseCheckpoint('?venue=bhopal-junction&location=lift-b'), 'lift-b');
  assert.equal(parseCheckpoint('?venue=other&location=lift-b'), null);
  assert.equal(parseCheckpoint('?venue=bhopal-junction&location=platform-99'), null);
  assert.equal(parseCheckpoint('?venue=bhopal-junction&location=platform-5'), 'platform-5');
});
test('platform inputs are validated and legacy facility statuses remain supported', () => {
  for (const input of [0, 21, 2.5, 'abc', '']) assert.throws(() => platformNumber(input));
  assert.equal(platformNumber('5'), 5);
  assert.equal(statusLabel('OUT_OF_SERVICE'), 'Unavailable');
  assert.equal(statusLabel('AVAILABLE'), 'Operational');
});
test('simple guidance changes wording without a separate journey engine', () => {
  const route = routeFor(3, facilities);
  assert.match(instructionFor(route, 'gate-1', false), /70 m/);
  assert.match(instructionFor(route, 'gate-1', true), /^Go to Ramp B/);
});
