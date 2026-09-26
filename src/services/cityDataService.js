export const INDIAN_CITIES = [
  { id: "mumbai", name: "Mumbai", state: "Maharashtra" },
  { id: "delhi", name: "New Delhi", state: "Delhi NCR" },
  { id: "bengaluru", name: "Bengaluru", state: "Karnataka" },
  { id: "chennai", name: "Chennai", state: "Tamil Nadu" },
  { id: "kolkata", name: "Kolkata", state: "West Bengal" },
  { id: "pune", name: "Pune", state: "Maharashtra" }
];

export const CITY_VENUES_MULTIPLE = {
  mumbai: {
    railway: [
      {
        id: "mmct",
        name: "Mumbai Central (MMCT)",
        targetLabel: "Platform",
        targetValue: "Platform 3 (Vande Bharat Exp)",
        options: ["Platform 1 (Local Line)", "Platform 3 (Vande Bharat Exp)", "Platform 5 (Rajdhani Exp)"],
        normalRoute: [
          { id: 1, name: "Concourse Main Gate 1", description: "Tactile paving guide leading from taxi stand to ticket hall", type: "entrance" },
          { id: 2, name: "Accessible Ramp B", description: "Gentle 1:12 slope ramp leading to security clearance", type: "ramp" },
          { id: 3, name: "Central Elevator A", description: "Braille button elevator to overbridge level", type: "lift" },
          { id: 4, name: "Platform 3 Boarding Gate", description: "Step-free ramp bridge to train coach door", type: "platform" }
        ]
      },
      {
        id: "csmt",
        name: "Chhatrapati Shivaji Maharaj Terminus (CSMT)",
        targetLabel: "Platform",
        targetValue: "Platform 18 (Express Line)",
        options: ["Platform 1 (Harbour Line)", "Platform 8 (Main Line)", "Platform 18 (Express Line)"],
        normalRoute: [
          { id: 1, name: "Heritage Gate 1 Entrance", description: "Tactile paving at main concourse entry", type: "entrance" },
          { id: 2, name: "Central Concourse Ramp", description: "Wide step-free access to express platforms", type: "ramp" },
          { id: 3, name: "Platform 18 Boarding Point", description: "Assisted wheelchair boarding point", type: "platform" }
        ]
      },
      {
        id: "bdts",
        name: "Bandra Terminus (BDTS)",
        targetLabel: "Platform",
        targetValue: "Platform 1 (Paschim Express)",
        options: ["Platform 1 (Paschim Express)", "Platform 4", "Platform 6"],
        normalRoute: [
          { id: 1, name: "West Gate Drop-off", description: "Tactile tiles from autorickshaw stand", type: "entrance" },
          { id: 2, name: "Platform 1 Direct Level Access", description: "Step-free corridor to train boarding point", type: "corridor" }
        ]
      },
      {
        id: "dadar",
        name: "Dadar Junction (DR)",
        targetLabel: "Platform",
        targetValue: "Platform 5 (Fast Line Northbound)",
        options: ["Platform 1 (Central Slow)", "Platform 5 (Fast Line)", "Platform 8 (Western Line)"],
        normalRoute: [
          { id: 1, name: "East Side Ramp Entry", description: "Wide ramp bypassing street stairs", type: "ramp" },
          { id: 2, name: "Overbridge Elevator 2", description: "Braille lift to Platform 5 overbridge", type: "lift" }
        ]
      }
    ],
    hospital: [
      {
        id: "kem",
        name: "KEM Hospital Parel",
        targetLabel: "Department",
        targetValue: "Cardiology OPD - Floor 2 Building B",
        options: ["Cardiology OPD - Floor 2 Building B", "Emergency Trauma Ward", "Radiology & MRI Annex"],
        normalRoute: [
          { id: 1, name: "Main Gate Reception Desk", description: "Wheelchair escort desk & tactile map", type: "entrance" },
          { id: 2, name: "Covered Ramp Corridor", description: "Anti-slip ramp to Outpatient Block", type: "ramp" },
          { id: 3, name: "Patient Elevator 2", description: "Voice-guided lift to Floor 2 Cardiology", type: "lift" }
        ]
      },
      {
        id: "lilavati",
        name: "Lilavati Hospital Bandra",
        targetLabel: "Department",
        targetValue: "Orthopedics & Rehab - Floor 1",
        options: ["Orthopedics & Rehab - Floor 1", "Emergency Care Wing", "Diagnostic Centre"],
        normalRoute: [
          { id: 1, name: "Main Entrance Portico", description: "Wheelchair valet & escort booth", type: "entrance" },
          { id: 2, name: "Elevator Block A", description: "Voice-guided lift to Floor 1", type: "lift" }
        ]
      },
      {
        id: "tata",
        name: "Tata Memorial Cancer Hospital Parel",
        targetLabel: "Department",
        targetValue: "OPD Registration - Golden Jubilee Block",
        options: ["OPD Registration - Golden Jubilee Block", "Daycare Chemotherapy Unit"],
        normalRoute: [
          { id: 1, name: "Golden Jubilee Gate Entry", description: "Priority PRM registration queue desk", type: "entrance" },
          { id: 2, name: "Low Counter Registration Desk 4", description: "Wheelchair accessible counter desk", type: "platform" }
        ]
      }
    ],
    tourist: [
      {
        id: "gateway",
        name: "Gateway of India Promenade",
        targetLabel: "Viewpoint",
        targetValue: "Harbor Promenade Deck",
        options: ["Harbor Promenade Deck", "Ferry Jetty 2 (Elephanta Caves)", "Taj Heritage Courtyard"],
        normalRoute: [
          { id: 1, name: "Regal Gate Entrance", description: "Tactile paving & security check wide lane", type: "entrance" },
          { id: 2, name: "Paved Seafront Walk", description: "Step-free wide granite walkway", type: "corridor" },
          { id: 3, name: "Promenade Deck", description: "Accessible safety railing viewing bay", type: "platform" }
        ]
      },
      {
        id: "csmvs",
        name: "CSMVS Museum Fort",
        targetLabel: "Viewpoint",
        targetValue: "Sculpture Garden & Main Hall",
        options: ["Sculpture Garden & Main Hall", "Natural History Gallery"],
        normalRoute: [
          { id: 1, name: "Museum Main Gate", description: "Wheelchair rental booth & ramp", type: "entrance" },
          { id: 2, name: "Main Hall Wooden Ramp", description: "Step-free ramp entry to main gallery", type: "ramp" }
        ]
      }
    ],
    office: [
      {
        id: "bmc",
        name: "BMC Head Office Fort",
        targetLabel: "Service Counter",
        targetValue: "Citizen Facilitation Counter 5",
        options: ["Citizen Facilitation Counter 5", "Property Tax Desk"],
        normalRoute: [
          { id: 1, name: "Heritage Gate Entry", description: "Wheelchair ramp entry at West Wing", type: "entrance" },
          { id: 2, name: "Counter 5 Low Desk", description: "Priority citizen counter desk", type: "platform" }
        ]
      },
      {
        id: "rto_mumbai",
        name: "RTO Mumbai Central",
        targetLabel: "Service Counter",
        targetValue: "DL Verification Counter 2",
        options: ["DL Verification Counter 2", "Vehicle Fitness Desk"],
        normalRoute: [
          { id: 1, name: "RTO Main Entrance Gate", description: "Step-free ground floor counter hall", type: "entrance" }
        ]
      }
    ],
    airport: [
      {
        id: "csmia_t2",
        name: "CSMIA International Terminal 2",
        targetLabel: "Departure Gate",
        targetValue: "Gate 45B (International)",
        options: ["Gate 45B (International)", "Check-in Island 8", "Security Lane 3"],
        normalRoute: [
          { id: 1, name: "Departures Gate 4 Drop-off", description: "Dedicated wheelchair assistance booth", type: "entrance" },
          { id: 2, name: "Island 8 Priority Counter", description: "Low counter check-in desk", type: "corridor" },
          { id: 3, name: "Security Gate 3 Elevator", description: "Spacious lift to departures lounge", type: "lift" },
          { id: 4, name: "Gate 45B Boarding Bridge", description: "Direct jet bridge boarding", type: "platform" }
        ]
      },
      {
        id: "csmia_t1",
        name: "CSMIA Domestic Terminal 1",
        targetLabel: "Departure Gate",
        targetValue: "Gate A4 (Domestic)",
        options: ["Gate A4 (Domestic)", "Check-in Row C"],
        normalRoute: [
          { id: 1, name: "Gate 2 Curbside PRM Desk", description: "Assistive electric buggy pickup point", type: "entrance" }
        ]
      }
    ],
    metro: [
      {
        id: "ghatkopar_metro",
        name: "Ghatkopar Metro Station",
        targetLabel: "Platform",
        targetValue: "Platform 1 (Towards Versova)",
        options: ["Platform 1 (Towards Versova)", "Railway Transfer Bridge"],
        normalRoute: [
          { id: 1, name: "East Gate Street Elevator", description: "Direct elevator to concourse", type: "lift" },
          { id: 2, name: "Platform 1 Elevator", description: "Elevator down to platform level", type: "lift" }
        ]
      },
      {
        id: "andheri_metro",
        name: "Andheri Metro Station",
        targetLabel: "Platform",
        targetValue: "Platform 2 (Towards Ghatkopar)",
        options: ["Platform 2 (Towards Ghatkopar)", "Railway Overbridge Link"],
        normalRoute: [
          { id: 1, name: "Station Gate 3 Elevator", description: "Street-level lift to concourse", type: "lift" }
        ]
      }
    ]
  },
  delhi: {
    railway: [
      {
        id: "ndls",
        name: "New Delhi Railway Station (NDLS)",
        targetLabel: "Platform",
        targetValue: "Platform 16 (Paharganj Entry)",
        options: ["Platform 16 (Paharganj Entry)", "Platform 1 (Ajmeri Gate Entry)", "Platform 12"],
        normalRoute: [
          { id: 1, name: "Paharganj Gate 1 Entry", description: "Tactile path from prepaid auto stand to main concourse", type: "entrance" },
          { id: 2, name: "Security Check Ramp", description: "Step-free baggage scanner lane", type: "ramp" },
          { id: 3, name: "Concourse Lift 3", description: "Elevator to foot overbridge level", type: "lift" },
          { id: 4, name: "Platform 16 Boarding Point", description: "Accessible coach boarding zone", type: "platform" }
        ]
      },
      {
        id: "dli",
        name: "Old Delhi Railway Station (DLI)",
        targetLabel: "Platform",
        targetValue: "Platform 1 (Kalka Mail)",
        options: ["Platform 1 (Kalka Mail)", "Platform 3", "Platform 7"],
        normalRoute: [
          { id: 1, name: "Chandni Chowk Gate Entry", description: "Tactile tiles at main entrance", type: "entrance" },
          { id: 2, name: "Platform 1 Level Access", description: "Step-free access to Platform 1", type: "corridor" }
        ]
      },
      {
        id: "nzm",
        name: "Hazrat Nizamuddin (NZM)",
        targetLabel: "Platform",
        targetValue: "Platform 4 (August Kranti Exp)",
        options: ["Platform 4 (August Kranti Exp)", "Platform 1"],
        normalRoute: [
          { id: 1, name: "East Entry Ramp", description: "Ramp entry from parking area", type: "ramp" }
        ]
      }
    ],
    hospital: [
      {
        id: "aiims",
        name: "AIIMS New Delhi Main OPD",
        targetLabel: "Department",
        targetValue: "Rajkumari Amrit Kaur OPD - Counter 12",
        options: ["Rajkumari Amrit Kaur OPD - Counter 12", "Emergency Block", "AIIMS Cancer Centre"],
        normalRoute: [
          { id: 1, name: "Main Gate 2 Reception", description: "Patient transport buggy pickup point", type: "entrance" },
          { id: 2, name: "OPD Central Ramp", description: "Gentle incline ramp for wheelchairs", type: "ramp" },
          { id: 3, name: "Elevator Block B", description: "Voice-guided elevator to 1st floor OPD", type: "lift" }
        ]
      },
      {
        id: "safdarjung",
        name: "Safdarjung Hospital Delhi",
        targetLabel: "Department",
        targetValue: "Super Speciality OPD - Floor 1",
        options: ["Super Speciality OPD - Floor 1", "Emergency Block"],
        normalRoute: [
          { id: 1, name: "Ring Road Gate Entry", description: "Helpdesk & wheelchair booth", type: "entrance" }
        ]
      }
    ],
    tourist: [
      {
        id: "redfort",
        name: "Red Fort (Lal Qila)",
        targetLabel: "Viewpoint",
        targetValue: "Diwan-i-Aam & Royal Gardens",
        options: ["Diwan-i-Aam & Royal Gardens", "Lahori Gate Entrance"],
        normalRoute: [
          { id: 1, name: "Lahori Gate Entrance", description: "Security checkpoint with tactile tiles", type: "entrance" },
          { id: 2, name: "Chhatta Chowk Passage", description: "Flat paved Heritage passage", type: "corridor" },
          { id: 3, name: "Diwan-i-Aam Access Ramp", description: "Wooden ramp bypassing stone stairs", type: "ramp" }
        ]
      },
      {
        id: "qutub",
        name: "Qutub Minar Heritage Complex",
        targetLabel: "Viewpoint",
        targetValue: "Alai Darwaza Courtyard Deck",
        options: ["Alai Darwaza Courtyard Deck", "Iron Pillar Lawn"],
        normalRoute: [
          { id: 1, name: "Ticket Counter Ramp Gate", description: "Electric cart pick up point", type: "entrance" }
        ]
      }
    ],
    office: [
      {
        id: "dda_passport",
        name: "DDA Passport Seva Kendra ITO",
        targetLabel: "Counter",
        targetValue: "Biometric Desk Counter A4",
        options: ["Biometric Desk Counter A4", "Token Desk"],
        normalRoute: [
          { id: 1, name: "Main ITO Building Entry", description: "Ramp access with security desk", type: "entrance" }
        ]
      }
    ],
    airport: [
      {
        id: "igi_t3",
        name: "Indira Gandhi International Airport T3",
        targetLabel: "Departure Gate",
        targetValue: "Boarding Gate 32 (International)",
        options: ["Boarding Gate 32 (International)", "Check-in Row K"],
        normalRoute: [
          { id: 1, name: "Departures Gate 6 Curbside", description: "Wheelchair assistance desk", type: "entrance" },
          { id: 2, name: "Row K Priority Check-in", description: "Low desk counter", type: "corridor" }
        ]
      }
    ],
    metro: [
      {
        id: "rajiv_chowk",
        name: "Rajiv Chowk Metro Junction",
        targetLabel: "Platform",
        targetValue: "Platform 3 (Yellow Line HUDA City)",
        options: ["Platform 3 (Yellow Line HUDA City)", "Platform 1 (Blue Line)"],
        normalRoute: [
          { id: 1, name: "Gate 4 Street Elevator", description: "Street-level elevator to concourse", type: "lift" }
        ]
      }
    ]
  },
  bengaluru: {
    railway: [
      {
        id: "ksr",
        name: "KSR Bengaluru City Railway Station",
        targetLabel: "Platform",
        targetValue: "Platform 1 (Shatabdi Express)",
        options: ["Platform 1 (Shatabdi Express)", "Platform 5 (Mysuru Line)"],
        normalRoute: [
          { id: 1, name: "Main Entry Gate 1", description: "Tactile floor tiles from drop-off to ticket hall", type: "entrance" }
        ]
      },
      {
        id: "yesvantpur",
        name: "Yesvantpur Junction (YPR)",
        targetLabel: "Platform",
        targetValue: "Platform 1 (Duronto Express)",
        options: ["Platform 1 (Duronto Express)", "Platform 6"],
        normalRoute: [
          { id: 1, name: "Main Entrance Ramp", description: "Ramp entry to Platform 1", type: "ramp" }
        ]
      }
    ],
    hospital: [
      {
        id: "manipal",
        name: "Manipal Hospital Old Airport Rd",
        targetLabel: "Department",
        targetValue: "Neurology & Rehab OPD - Floor 1",
        options: ["Neurology & Rehab OPD - Floor 1", "Emergency Wing"],
        normalRoute: [
          { id: 1, name: "Main Entrance Portico", description: "Wheelchair escort desk at portico", type: "entrance" }
        ]
      }
    ],
    tourist: [
      {
        id: "lalbagh",
        name: "Lalbagh Botanical Gardens",
        targetLabel: "Viewpoint",
        targetValue: "Glass House Heritage Lawn",
        options: ["Glass House Heritage Lawn", "West Gate Entrance"],
        normalRoute: [
          { id: 1, name: "West Gate Entry", description: "Electric buggy station", type: "entrance" }
        ]
      }
    ],
    office: [
      {
        id: "bbmp",
        name: "BBMP Central Civic Office",
        targetLabel: "Counter",
        targetValue: "Revenue & Trade License Counter 3",
        options: ["Revenue & Trade License Counter 3"],
        normalRoute: [
          { id: 1, name: "Hudson Circle Entry", description: "Ramp entrance", type: "entrance" }
        ]
      }
    ],
    airport: [
      {
        id: "kia_t2",
        name: "Kempegowda International Airport T2",
        targetLabel: "Departure Gate",
        targetValue: "Gate D14 (Garden Terminal)",
        options: ["Gate D14 (Garden Terminal)", "Check-in Island C"],
        normalRoute: [
          { id: 1, name: "Terminal 2 Curbside", description: "PRM assistance counter", type: "entrance" }
        ]
      }
    ],
    metro: [
      {
        id: "mg_road_metro",
        name: "MG Road Metro Station",
        targetLabel: "Platform",
        targetValue: "Platform 2 (Purple Line)",
        options: ["Platform 2 (Purple Line)", "Platform 1"],
        normalRoute: [
          { id: 1, name: "Boulevard Entry Lift", description: "Street-level lift", type: "lift" }
        ]
      }
    ]
  },
  chennai: {
    railway: [
      {
        id: "mas",
        name: "Chennai Central (MAS)",
        targetLabel: "Platform",
        targetValue: "Platform 4 (Coromandel Express)",
        options: ["Platform 4 (Coromandel Express)", "Platform 1"],
        normalRoute: [
          { id: 1, name: "Main Concourse Entry", description: "Tactile paving at entry", type: "entrance" }
        ]
      },
      {
        id: "ms",
        name: "Chennai Egmore (MS)",
        targetLabel: "Platform",
        targetValue: "Platform 3 (Vigai Express)",
        options: ["Platform 3 (Vigai Express)", "Platform 5"],
        normalRoute: [
          { id: 1, name: "Gandhi Irwin Road Gate", description: "Ramp access to Platform 1-3", type: "ramp" }
        ]
      }
    ],
    hospital: [
      {
        id: "rggh",
        name: "Rajiv Gandhi Government Hospital",
        targetLabel: "Department",
        targetValue: "OPD Building Block A - Floor 1",
        options: ["OPD Building Block A - Floor 1"],
        normalRoute: [
          { id: 1, name: "EVR Periyar Salai Gate", description: "Helpdesk & wheelchair desk", type: "entrance" }
        ]
      }
    ],
    tourist: [
      {
        id: "marina",
        name: "Marina Beach Promenade",
        targetLabel: "Viewpoint",
        targetValue: "Wooden Boardwalk Beach Deck",
        options: ["Wooden Boardwalk Beach Deck"],
        normalRoute: [
          { id: 1, name: "Kamarajar Salai Entry", description: "Ramp entrance", type: "entrance" }
        ]
      }
    ],
    office: [
      {
        id: "chennai_coll",
        name: "Chennai Collectorate Office",
        targetLabel: "Counter",
        targetValue: "Public Grievance Counter 2",
        options: ["Public Grievance Counter 2"],
        normalRoute: [
          { id: 1, name: "Rajaji Salai Main Gate", description: "Ramp access", type: "entrance" }
        ]
      }
    ],
    airport: [
      {
        id: "chennai_t1",
        name: "Chennai International Airport T1",
        targetLabel: "Departure Gate",
        targetValue: "Gate 4 (Domestic Terminal)",
        options: ["Gate 4 (Domestic Terminal)"],
        normalRoute: [
          { id: 1, name: "Departures Gate 2 Curbside", description: "PRM assistance counter", type: "entrance" }
        ]
      }
    ],
    metro: [
      {
        id: "mgr_metro",
        name: "Puratchi Thalaivar Dr. M.G.R Metro",
        targetLabel: "Platform",
        targetValue: "Platform 2 (Blue Line Airport)",
        options: ["Platform 2 (Blue Line Airport)"],
        normalRoute: [
          { id: 1, name: "Poonamallee High Rd Lift", description: "Street-level lift", type: "lift" }
        ]
      }
    ]
  },
  kolkata: {
    railway: [
      {
        id: "howrah",
        name: "Howrah Junction Railway Station",
        targetLabel: "Platform",
        targetValue: "Platform 9 (Vande Bharat / Rajdhani)",
        options: ["Platform 9 (Vande Bharat / Rajdhani)", "Platform 1"],
        normalRoute: [
          { id: 1, name: "New Complex Gate Entry", description: "Tactile paving guide", type: "entrance" }
        ]
      },
      {
        id: "sealdah",
        name: "Sealdah Railway Station (SDAH)",
        targetLabel: "Platform",
        targetValue: "Platform 1A (Main Line)",
        options: ["Platform 1A (Main Line)", "Platform 8"],
        normalRoute: [
          { id: 1, name: "Main Flyover Entrance Ramp", description: "Ramp to main concourse", type: "ramp" }
        ]
      }
    ],
    hospital: [
      {
        id: "sskm",
        name: "SSKM Hospital Kolkata",
        targetLabel: "Department",
        targetValue: "OPD Building Counter 5",
        options: ["OPD Building Counter 5"],
        normalRoute: [
          { id: 1, name: "AJC Bose Road Main Gate", description: "Wheelchair desk at gate", type: "entrance" }
        ]
      }
    ],
    tourist: [
      {
        id: "victoria",
        name: "Victoria Memorial Heritage Site",
        targetLabel: "Viewpoint",
        targetValue: "Main Hall & North Gardens",
        options: ["Main Hall & North Gardens"],
        normalRoute: [
          { id: 1, name: "North Gate Entrance", description: "Tactile path from road to gardens", type: "entrance" }
        ]
      }
    ],
    office: [
      {
        id: "kmc",
        name: "Kolkata Municipal Corporation (KMC)",
        targetLabel: "Counter",
        targetValue: "Assessment & Revenue Counter 4",
        options: ["Assessment & Revenue Counter 4"],
        normalRoute: [
          { id: 1, name: "SN Banerjee Road Entry", description: "Ramp entry at main building", type: "entrance" }
        ]
      }
    ],
    airport: [
      {
        id: "nscbi",
        name: "Netaji Subhash Chandra Bose Airport",
        targetLabel: "Departure Gate",
        targetValue: "Gate 18 (Domestic / Int)",
        options: ["Gate 18 (Domestic / Int)"],
        normalRoute: [
          { id: 1, name: "Departures Gate 3 Curbside", description: "Wheelchair assistance desk", type: "entrance" }
        ]
      }
    ],
    metro: [
      {
        id: "park_street",
        name: "Park Street Metro Station",
        targetLabel: "Platform",
        targetValue: "Platform 1 (North-South Line)",
        options: ["Platform 1 (North-South Line)"],
        normalRoute: [
          { id: 1, name: "Gate 2 Street Elevator", description: "Street-level lift to concourse", type: "lift" }
        ]
      }
    ]
  },
  pune: {
    railway: [
      {
        id: "pune_jnc",
        name: "Pune Junction Railway Station",
        targetLabel: "Platform",
        targetValue: "Platform 1 (Deccan Queen Express)",
        options: ["Platform 1 (Deccan Queen Express)", "Platform 2"],
        normalRoute: [
          { id: 1, name: "Main Concourse Entry Gate 1", description: "Tactile floor tiles from auto stand", type: "entrance" }
        ]
      },
      {
        id: "shivajinagar_rly",
        name: "Shivajinagar Station (SVJR)",
        targetLabel: "Platform",
        targetValue: "Platform 1 (Lonavala Local)",
        options: ["Platform 1 (Lonavala Local)"],
        normalRoute: [
          { id: 1, name: "JM Road Ramp Gate", description: "Ramp entry to Platform 1", type: "ramp" }
        ]
      }
    ],
    hospital: [
      {
        id: "sassoon",
        name: "Sassoon General Hospital Pune",
        targetLabel: "Department",
        targetValue: "New OPD Building - Floor 1",
        options: ["New OPD Building - Floor 1"],
        normalRoute: [
          { id: 1, name: "Main Gate Reception Desk", description: "Wheelchair booth at gate", type: "entrance" }
        ]
      }
    ],
    tourist: [
      {
        id: "shaniwarwada",
        name: "Shaniwar Wada Heritage Site",
        targetLabel: "Viewpoint",
        targetValue: "Main Dilli Darwaza Courtyard",
        options: ["Main Dilli Darwaza Courtyard"],
        normalRoute: [
          { id: 1, name: "Dilli Darwaza Entry Gate", description: "Ramp entry bypassing wooden threshold", type: "entrance" }
        ]
      }
    ],
    office: [
      {
        id: "pmc",
        name: "PMC (Pune Municipal Corp) Building",
        targetLabel: "Counter",
        targetValue: "Citizen Facilitation Counter 2",
        options: ["Citizen Facilitation Counter 2"],
        normalRoute: [
          { id: 1, name: "Shivajinagar Main Entry", description: "Ramp entrance", type: "entrance" }
        ]
      }
    ],
    airport: [
      {
        id: "pune_airport",
        name: "Pune International Airport (Lohegaon)",
        targetLabel: "Departure Gate",
        targetValue: "Boarding Gate 4 (New Terminal)",
        options: ["Boarding Gate 4 (New Terminal)"],
        normalRoute: [
          { id: 1, name: "New Terminal Gate 2 Drop-off", description: "Wheelchair assistance desk", type: "entrance" }
        ]
      }
    ],
    metro: [
      {
        id: "civil_court_metro",
        name: "Civil Court Metro Interchange",
        targetLabel: "Platform",
        targetValue: "Platform 1 (Purple Line PCMC)",
        options: ["Platform 1 (Purple Line PCMC)"],
        normalRoute: [
          { id: 1, name: "Deep Underground Lift 1", description: "Express lift directly from street to concourse", type: "lift" }
        ]
      }
    ]
  }
};

export const getCityVenueList = (cityId = "mumbai", categoryId = "railway") => {
  const cityData = CITY_VENUES_MULTIPLE[cityId] || CITY_VENUES_MULTIPLE.mumbai;
  return cityData[categoryId] || cityData.railway;
};

export const getCityVenue = (cityId = "mumbai", categoryId = "railway", venueId = null) => {
  const list = getCityVenueList(cityId, categoryId);
  if (venueId) {
    const found = list.find((v) => v.id === venueId);
    if (found) return found;
  }
  return list[0];
};
