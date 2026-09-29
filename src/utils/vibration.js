export function triggerVibration(pattern = [300, 150, 300]) {
  try { if ('vibrate' in navigator) navigator.vibrate(pattern); } catch { /* Optional hardware feature. */ }
}
