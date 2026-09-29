import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/authService';
import { subscribeToAssistanceRequests, createAssistanceRequest, updateAssistanceStatus } from '../services/assistanceService';
export function useAssistanceRequests(staff = false) {
  const [state, setState] = useState({ requests: [], loading: false, error: '' });
  useEffect(() => {
    let stop = () => {};
    const unsubscribe = onAuthStateChanged(auth, user => {
      stop();
      if (!user) { setState({ requests: [], loading: false, error: '' }); return; }
      setState({ requests: [], loading: true, error: '' });
      stop = subscribeToAssistanceRequests(requests => setState({ requests, loading: false, error: '' }), error => setState({ requests: [], loading: false, error: error.message }), staff ? undefined : user.uid);
    });
    return () => { unsubscribe(); stop(); };
  }, [staff]);
  return { ...state, createRequest: createAssistanceRequest, updateStatus: updateAssistanceStatus };
}
