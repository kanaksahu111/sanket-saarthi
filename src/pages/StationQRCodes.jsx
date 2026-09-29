import { useEffect,useState } from 'react';
import QRCode from 'qrcode';
import { QR_CHECKPOINTS,qrUrl,isLoopbackUrl } from '../services/checkpointService';
import { checkpointName } from '../data/guidance';
import { useI18n } from '../i18n/context';
function QRCard({id,base}) {
  const {t,place}=useI18n();
  const [image,setImage]=useState('');
  const [error,setError]=useState(false);
  let url='';
  try{url=qrUrl(id,window.location.origin,base);}catch{/* Show URL validation below. */}
  useEffect(()=>{let active=true;if(url)QRCode.toDataURL(url,{width:256,margin:4,errorCorrectionLevel:'M'}).then(value=>{if(active){setImage(value);setError(false);}}).catch(()=>{if(active)setError(true);});return()=>{active=false;};},[url]);
  return <article className="qr-card"><h2>{place(checkpointName(id))}</h2>{url&&!error?<>{image&&<img src={image} width="256" height="256" alt={`${t('QR checkpoint')}: ${place(checkpointName(id))}`}/>}<a href={url}>{url}</a>{image&&<button className="secondary-action qr-download" onClick={()=>{const link=document.createElement('a');link.href=image;link.download=`BPL-${id}.png`;link.click();}}>{t('Download QR')}</button>}</>:<p role="alert">{t('Enter a valid HTTP(S) application URL.')}</p>}</article>;
}
export default function StationQRCodes(){
  const {t}=useI18n();
  const [draft,setDraft]=useState(import.meta.env.VITE_PUBLIC_APP_URL||window.location.origin);
  const [base,setBase]=useState(draft);
  const [invalid,setInvalid]=useState(false);
  let loopback=false;try{loopback=isLoopbackUrl(base);}catch{/* validated on submit */}
  return <main className="flow-page qr-page"><h1>{t('Station QR Codes')}</h1><p>Bhopal Junction · BPL · {t('Demo indoor checkpoints')}</p><form className="qr-settings" onSubmit={e=>{e.preventDefault();try{qrUrl('gate-1',window.location.origin,draft);setBase(draft);setInvalid(false);}catch{setInvalid(true);}}}><label>{t('Application URL')}<input type="url" required value={draft} onChange={e=>setDraft(e.target.value)}/></label><button className="secondary-action">{t('Update QR codes')}</button><button type="button" className="secondary-action" onClick={()=>window.print()}>{t('Print QR codes')}</button></form>{invalid&&<p role="alert">{t('Enter a valid HTTP(S) application URL.')}</p>}{loopback&&<p className="notice" role="status">{t('These codes point to this computer. For a phone, use your deployed HTTPS URL or this computer’s LAN address.')}</p>}<p className="muted">{t('Scan with your phone camera. Existing journeys resume in the same browser; new visitors choose their support needs.')}</p><div className="qr-grid">{QR_CHECKPOINTS.map(id=><QRCard key={`${id}-${base}`} id={id} base={base}/>)}</div></main>;
}
