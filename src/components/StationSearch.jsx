import { useEffect, useRef, useState } from 'react';
import { searchStations } from '../services/stationService';
import { useI18n } from '../i18n/context';
export default function StationSearch({station,onSelect}) {
  const {language,t}=useI18n();
  const [query,setQuery]=useState('');
  const [open,setOpen]=useState(false);
  const [active,setActive]=useState(0);
  const list=useRef(null);
  const [limit,setLimit]=useState(50);
  const results=searchStations(query);
  useEffect(()=>{list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({block:'nearest'});},[active]);
  function choose(item){onSelect(item);setOpen(false);setQuery('');}
  return <div className="station-search"><label htmlFor="station-search">{t('Search station, city or station code')}</label><input id="station-search" role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls="station-options" aria-activedescendant={open && results[active] ? `station-${results[active].code}`:undefined} autoComplete="off" placeholder={t('Station name, city or code')} value={open ? query : station ? `${language==='hi'?(station.nameHi||station.name):station.name} (${station.code})`:query} onFocus={()=>{setOpen(true);setQuery('');setActive(0);}} onBlur={e=>{if(!e.currentTarget.parentElement.contains(e.relatedTarget))setOpen(false);}} onChange={e=>{setQuery(e.target.value);setLimit(50);setActive(0);setOpen(true);onSelect(null);}} onKeyDown={e=>{
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();setOpen(true);setActive(a=>Math.max(0,Math.min(Math.min(results.length,limit)-1,a+(e.key==='ArrowDown'?1:-1))));}
    if(e.key==='Enter'&&open&&results[active]){e.preventDefault();choose(results[active]);}
    if(e.key==='Escape'){setOpen(false);}
  }}/>{open && <ul ref={list} id="station-options" role="listbox" aria-label={t('Station suggestions')}>{results.slice(0,limit).map((s,i)=><li id={`station-${s.code}`} key={s.code} role="option" aria-selected={i===active} onMouseDown={e=>e.preventDefault()} onClick={()=>choose(s)}><strong>{language==='hi'?(s.nameHi||s.name):s.name}</strong><span>{s.code} · {language==='hi'?(s.cityHi||s.city||s.state||s.address):(s.city||s.state||s.address)}</span></li>)}{results.length>limit&&<li role="presentation"><button type="button" className="search-more" onMouseDown={e=>e.preventDefault()} onClick={()=>setLimit(n=>n+50)}>{t('Show more stations')}</button></li>}{!results.length && <li role="presentation">{t('No stations found.')}</li>}</ul>}<span className="sr-only" role="status">{open?t('{count} stations found.',{count:results.length}):''}</span></div>;
}
