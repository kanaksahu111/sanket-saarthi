import { useEffect, useMemo, useState } from 'react';
import { I18nContext } from './context';
import { translate, placeName } from './messages';
export default function LanguageProvider({children}) {
  const [language,setLanguage] = useState(() => { try { return localStorage.getItem('saarthi-language') === 'hi' ? 'hi' : 'en'; } catch { return 'en'; } });
  useEffect(() => { document.documentElement.lang = language; try { localStorage.setItem('saarthi-language',language); } catch { /* Optional persistence. */ } },[language]);
  const value = useMemo(() => ({language,setLanguage,t:(key,values) => translate(language,key,values),place:name => placeName(language,name)}),[language]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
