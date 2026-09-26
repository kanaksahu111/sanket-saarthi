export function triggerVibration(pattern = [200, 100, 200]) {
  if ("vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}