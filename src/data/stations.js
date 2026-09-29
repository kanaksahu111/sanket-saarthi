// Station codes checked against Indian Railways' Station Code Index and WCR report.
// The catalog is searchable; only BPL has a configured indoor route/backend.
export const STATION_SOURCES = [
  'https://indianrailways.gov.in/railwayboard/uploads/directorate/coaching/TAG_2019-20/Station_Code_Index.pdf',
  'https://wcr.indianrailways.gov.in/uploads/files/1747652113612-GMAR%202023-24%20Final%20Approved.pdf',
  'https://www.indianrail.gov.in/duronto_trn_list.html',
];
const rows = [
  ['Bhopal','भोपाल', [['BPL','Bhopal Junction','भोपाल जंक्शन'],['RKMP','Rani Kamlapati','रानी कमलापति']]],
  ['Indore','इंदौर', [['INDB','Indore Junction','इंदौर जंक्शन'],['RJQ','Rajendra Nagar','राजेंद्र नगर']]],
  ['Delhi','दिल्ली', [['NDLS','New Delhi','नई दिल्ली'],['DLI','Delhi Junction','दिल्ली जंक्शन'],['NZM','Hazrat Nizamuddin','हज़रत निज़ामुद्दीन'],['DEC','Delhi Cantonment','दिल्ली छावनी'],['DEE','Delhi Sarai Rohilla','दिल्ली सराय रोहिल्ला'],['DSJ','Delhi Safdarjung','दिल्ली सफदरजंग'],['DSA','Delhi Shahdara','दिल्ली शाहदरा']]],
  ['Mumbai','मुंबई', [['CSMT','Chhatrapati Shivaji Maharaj Terminus','छत्रपति शिवाजी महाराज टर्मिनस'],['MMCT','Mumbai Central','मुंबई सेंट्रल'],['LTT','Lokmanya Tilak Terminus','लोकमान्य तिलक टर्मिनस'],['BDTS','Bandra Terminus','बांद्रा टर्मिनस'],['DR','Dadar','दादर'],['BVI','Borivali','बोरीवली'],['KYN','Kalyan Junction','कल्याण जंक्शन'],['PNVL','Panvel','पनवेल']]],
  ['Kolkata','कोलकाता', [['HWH','Howrah Junction','हावड़ा जंक्शन'],['SDAH','Sealdah','सियालदह'],['KOAA','Kolkata','कोलकाता'],['SRC','Santragachi Junction','सांतरागाछी जंक्शन']]],
  ['Bengaluru','बेंगलुरु', [['SBC','Bengaluru City','बेंगलुरु सिटी'],['BNC','Bengaluru Cantonment','बेंगलुरु छावनी'],['KJM','Krishnarajapuram','कृष्णराजपुरम']]],
  ['Chennai','चेन्नई', [['MAS','Chennai Central','चेन्नई सेंट्रल'],['MS','Chennai Egmore','चेन्नई एगमोर']]],
  ['Hyderabad','हैदराबाद', [['HYB','Hyderabad Deccan','हैदराबाद डेक्कन'],['SC','Secunderabad Junction','सिकंदराबाद जंक्शन'],['KCG','Kacheguda','काचीगुडा']]],
  ['Pune','पुणे', [['PUNE','Pune Junction','पुणे जंक्शन']]],
  ['Jaipur','जयपुर', [['JP','Jaipur Junction','जयपुर जंक्शन']]],
  ['Lucknow','लखनऊ', [['LKO','Lucknow Charbagh','लखनऊ चारबाग'],['LJN','Lucknow Junction','लखनऊ जंक्शन']]],
  ['Patna','पटना', [['PNBE','Patna Junction','पटना जंक्शन'],['PPTA','Patliputra','पाटलिपुत्र'],['PNC','Patna Sahib','पटना साहिब'],['DNR','Danapur','दानापुर']]],
];
export const stations = rows.flatMap(([city,cityHi,list]) => list.map(([code,name,nameHi]) => ({ code,name,nameHi,city,cityHi,configured:code === 'BPL',aliases: city === 'Bengaluru' ? ['Bangalore'] : city === 'Mumbai' ? ['Bombay'] : [] })));
export function stationByCode(code) { return stations.find(s => s.code === code); }
export function searchStations(value) {
  const q = value.trim().toLocaleLowerCase();
  return stations.filter(s => !q || [s.code,s.name,s.nameHi,s.city,s.cityHi,...s.aliases].some(v => v.toLocaleLowerCase().includes(q)))
    .sort((a,b) => Number(b.code.toLowerCase() === q) - Number(a.code.toLowerCase() === q));
}
