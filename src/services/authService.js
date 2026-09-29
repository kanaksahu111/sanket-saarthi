import { getAuth, signInAnonymously, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import app, { db } from '../firebase/config';
export const auth = getAuth(app);
export async function visitorIdentity() {
  await auth.authStateReady();
  return auth.currentUser || (await signInAnonymously(auth)).user;
}
export async function requireStaff() {
  const user = auth.currentUser;
  if (!user || user.isAnonymous) throw new Error('Sign in with an authorized staff account.');
  const role = await getDoc(doc(db, 'staff', user.uid));
  if (!role.exists() || role.data().enabled !== true) throw new Error('This account is not authorized for staff operations.');
  return user;
}
export async function staffLogin(email, password) { await signInWithEmailAndPassword(auth, email, password); return requireStaff(); }
export function staffLogout() { return signOut(auth); }
