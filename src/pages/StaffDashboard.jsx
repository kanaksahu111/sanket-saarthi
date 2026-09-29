import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, requireStaff, staffLogin, staffLogout } from '../services/authService';
import { useAssistanceRequests } from '../hooks/useAssistanceRequests';
import { FACILITIES, TRAIN_ID, platformNumber, statusLabel } from '../data/journey';
import { updateTrainPlatform } from '../services/venueService';
import { updateFacilityStatus } from '../services/facilityService';
import { initializeDemo, subscribeActivity } from '../services/operationsService';
import { REQUEST_TRANSITIONS } from '../data/support';
import ConfirmDialog from '../components/ConfirmDialog';
export default function StaffDashboard({ live }) {
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let generation = 0;
    const unsubscribe = onAuthStateChanged(auth, user => {
      const current = ++generation;
      setAuthorized(false);
      if (!user || user.isAnonymous) return;
      requireStaff().then(() => { if (generation === current) setAuthorized(true); }).catch(err => { if (generation === current) setError(err.message); });
    });
    return () => { generation++; unsubscribe(); };
  }, []);
  async function login(e) { e.preventDefault(); setBusy(true); setError(''); try { await staffLogin(email, password); setPassword(''); } catch (err) { setError(`Sign-in failed: ${err.message}`); } finally { setBusy(false); } }
  return <main className="staff-page"><div className="journey-title"><div><div className="eyebrow">BHOPAL JUNCTION / DEMO OPERATIONS</div><h1>Station control.</h1><p>Shared station information. Clear decisions.</p></div>{authorized && <button className="secondary-action" onClick={() => staffLogout().catch(err => setError(err.message))}>Sign out</button>}</div>
    {!authorized && <section className="staff-signin"><div><h2>Staff sign-in</h2><p>Use an authorized Firebase staff account to update operations. Visitors do not need a staff account.</p><p className="muted">Initial setup: enable Email/Password authentication, create a staff account, and authorize its UID. See DEMO-SETUP.md. Existing facilities remain intact.</p></div><form onSubmit={login}><label>Email<input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)}/></label><label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)}/></label><button disabled={busy} className="continue-button">{busy ? 'Signing in…' : 'Sign in to operations'}</button></form></section>}
    {error && <p className="error-text" role="alert">{error}</p>}
    <p><a className="secondary-action" href="/station-qr">Station QR Codes</a></p><Operations key={authorized ? 'staff' : 'preview'} live={live} authorized={authorized}/>
  </main>;
}
function Operations({ live, authorized }) {
  const [platform, setPlatform] = useState('5');
  const [draft, setDraft] = useState({});
  const [confirmation, setConfirmation] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [activity, setActivity] = useState([]);
  const [activityError, setActivityError] = useState('');
  useEffect(() => {
    if (!authorized) return;
    return subscribeActivity(setActivity, err => setActivityError(err.message));
  }, [authorized]);
  function confirm(title, description, action) { setError(''); setConfirmation({ title, description, action }); }
  async function execute() { setBusy(true); setError(''); try { await confirmation.action(); setMessage('Update saved to Firebase.'); setConfirmation(null); } catch (err) { setError(err.message); } finally { setBusy(false); } }
  return <>
    <p className="connection-note" role="status">{live.error || (live.fromCache ? 'Connecting to Firebase. Controls require current server data.' : 'Connected to Firebase')}{!authorized && ' · Read-only preview'}</p>
    <section className="operations-section"><div className="section-heading"><h2>01 / Train operations</h2><span>12345 Express</span></div><div className="operation-row"><div><strong>Current platform: {live.train?.platform ?? 'Not set'}</strong><small>{live.train?.status || 'Status not confirmed'}</small></div><label>New platform<input type="number" min="1" max="20" value={platform} onChange={e => setPlatform(e.target.value)}/></label><button className="secondary-action" disabled={!authorized || !live.train || live.fromCache} onClick={() => { try { const next = platformNumber(platform); if (next === Number(live.train.platform)) throw new Error('Choose a different platform.'); confirm('Change Platform', `Train 12345: Platform ${live.train.platform} → Platform ${next}`, () => updateTrainPlatform(TRAIN_ID, next, live.train.platform)); } catch (err) { setMessage(err.message); } }}>Update Platform</button></div></section>
    <section className="operations-section"><h2>02 / Facility status</h2>{FACILITIES.map(f => { const current = live.facilities.find(item => item.id === f.id); return <div className="operation-row" key={f.id}><div><strong>{f.name}</strong><small className="facility-status" data-tone={statusLabel(current?.status)==='Operational'?'success':statusLabel(current?.status)==='Unavailable'?'error':'warning'}>{statusLabel(current?.status)}</small></div><label><span className="sr-only">New status for {f.name}</span><select value={draft[f.id] || ''} onChange={e => setDraft(d => ({ ...d, [f.id]: e.target.value }))}><option value="">Choose status</option><option value="OPERATIONAL">Operational</option><option value="UNAVAILABLE">Unavailable</option><option value="MAINTENANCE">Maintenance</option></select></label><button className="secondary-action" disabled={!authorized || !current || !draft[f.id] || live.fromCache || current.status === draft[f.id]} onClick={() => confirm('Change Facility Status', `${f.name}: ${statusLabel(current.status)} → ${statusLabel(draft[f.id])}`, () => updateFacilityStatus(f.id, draft[f.id], current.status))}>Change Status<span className="sr-only"> for {f.name}</span></button></div>; })}</section>
    <section className="operations-section"><h2>03 / Assistance requests</h2>{authorized ? <StaffRequests live={live}/> : <p>Sign in to view visitor requests.</p>}</section>
    <section className="operations-section"><h2>04 / Recent activity</h2>{activityError && <p role="alert">Activity unavailable: {activityError}</p>}{activity.length ? <ul className="activity-list">{activity.map(item => <li key={item.id}><time>{item.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Saving…'}</time><span>{item.text}</span></li>)}</ul> : <p>No activity loaded.</p>}</section>
    {authorized && <details className="demo-tools"><summary>Demo setup and reset</summary><p>Initialize creates only missing records. Reset sets the sample train to Platform 3 and facilities to Operational; existing assistance requests are preserved.</p><div className="action-row"><button className="secondary-action" onClick={() => confirm('Initialize missing demo records', 'Create missing train and facilities without overwriting existing records.', () => initializeDemo(false))}>Initialize missing records</button><button className="secondary-action" onClick={() => confirm('Reset demo operations', 'Reset train platform to 3 and all five facilities to Operational.', () => initializeDemo(true))}>Reset demo</button></div></details>}
    <p role="status">{message}</p>{confirmation && <ConfirmDialog title={confirmation.title} pending={busy} error={error} onCancel={() => setConfirmation(null)} onConfirm={execute}><p>{confirmation.description}</p></ConfirmDialog>}
  </>;
}
function StaffRequests({ live }) {
  const { requests, updateStatus, loading, error } = useAssistanceRequests(true);
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  async function advance(id,status) { setBusy(id); setMessage(''); try { await updateStatus(id,status); setMessage('Assistance status updated. The visitor has been notified.'); } catch (err) { setMessage(err.message); } finally { setBusy(''); } }
  const labels={PENDING:'Waiting',ACCEPTED:'Accepted',ON_THE_WAY:'On the Way',COMPLETED:'Completed'};
  const actions={PENDING:'Accept Request',ACCEPTED:'Mark On the Way',ON_THE_WAY:'Mark Completed'};
  return <>{(loading||error)&&<p role="status">{error||'Loading requests…'}</p>}{!loading&&!requests.length&&<p>No assistance requests.</p>}{requests.map(request=><div className="operation-row assistance-operation" key={request.id}><div><strong>{request.type}</strong><small>{request.stationName||'Bhopal Junction'} · {request.stationCode||'BPL'}{request.stationCode&&request.stationCode!=='BPL'?' · General demo coordination':''}</small><small>#{request.id.slice(-6).toUpperCase()}</small><p>{request.location} → {(!request.stationCode||request.stationCode==='BPL')&&request.destinationId?.startsWith('platform-')&&live.train?.platform?`Platform ${live.train.platform}`:request.destination||'Not specified'}</p>{request.wheelchair&&<small>✓ Wheelchair required</small>}{request.human&&<small>✓ Human assistance required</small>}{request.support&&<small>{request.support}</small>}</div><span>{labels[request.status]||request.status}</span><button className="secondary-action" disabled={Boolean(busy)||!REQUEST_TRANSITIONS[request.status]} onClick={()=>advance(request.id,REQUEST_TRANSITIONS[request.status])}>{busy===request.id?'Updating…':actions[request.status]||'Completed'}</button></div>)}<p role="status">{message}</p></>;
}
