// Local UI identifiers only, never authentication tokens. LAN HTTP may lack randomUUID.
export function clientId(prefix='item') {
  return globalThis.crypto?.randomUUID?.() || `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
