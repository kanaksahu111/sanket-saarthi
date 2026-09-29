// A same-origin backend may implement /api/trains/{number}. Secrets stay there.
// No external API is required. This sample is deliberately NOT a real timetable.
export const DEMO_TRAIN = { number:'12345', name:'12345 Express', nameHi:'12345 एक्सप्रेस', status:'On Time', stationCodes:['BPL'], source:'demo', schedule:[{stationCode:'BPL',arrival:null,departure:null}] };
export function validateTrain(data, number) {
  if (!data || String(data.number) !== String(number) || typeof data.name !== 'string' || !Array.isArray(data.stationCodes)) throw new Error('Invalid train response');
  return {...data,number:String(number),source:'api'};
}
export async function getTrain(number, options = {}) {
  const normalized = String(number).trim();
  if (!/^\d{5}$/.test(normalized)) throw new Error('Enter a five-digit train number.');
  const base = options.apiBase ?? import.meta.env?.VITE_TRAIN_API_BASE;
  if (base) {
    try {
      if (!base.startsWith('/') || base.startsWith('//')) throw new Error('Train API must use a same-origin backend.');
      const response = await (options.fetcher || fetch)(`${base.replace(/\/$/,'')}/${encodeURIComponent(normalized)}`, { signal:AbortSignal.timeout(4000) });
      if (!response.ok) throw new Error('Train service unavailable');
      return validateTrain(await response.json(),normalized);
    } catch { /* Known sample train remains available if backend fails. */ }
  }
  if (normalized === DEMO_TRAIN.number) return {...DEMO_TRAIN};
  throw new Error('Train not available. Try sample train 12345.');
}
export async function getTrainSchedule(number, options) { const train = await getTrain(number,options); return {source:train.source,stops:train.schedule || []}; }
export async function getTrainStatus(number, options) { const train = await getTrain(number,options); return {source:train.source,status:train.status || 'Not confirmed'}; }
