import { useState, useEffect } from "react";
import {
  Globe,
  Mic,
  Moon,
  Sun,
  Type,
  ArrowLeft,
  CheckCircle2,
  Volume2,
  Check,
  ShieldCheck,
  VolumeX,
  MapPin,
  EyeOff,
  Building2
} from "lucide-react";

import { LANGUAGES, getTranslation } from "./services/i18n";
import { voiceService } from "./services/voiceService";
import VoiceModal from "./components/VoiceModal";
import BlindVoiceMode from "./components/BlindVoiceMode";
import StaffDashboard from "./pages/StaffDashboard";
import Navigation from "./pages/Navigation";
import Dashboard from "./pages/Dashboard";
import { INDIAN_CITIES, getCityVenueList } from "./services/cityDataService";
import { getVenueData } from "./services/venueService";
import "./App.css";

function App() {
  const [screen, setScreen] = useState("home"); // home | places | venue_select | preferences | dashboard | journey | staff
  const [lang, setLang] = useState("en");
  const [selectedCityId, setSelectedCityId] = useState("mumbai");
  const [selectedCategoryId, setSelectedCategoryId] = useState("railway");
  const [selectedVenueId, setSelectedVenueId] = useState("mmct");
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState("normal");
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [blindModeOpen, setBlindModeOpen] = useState(false);
  const [notification, setNotification] = useState("");
  const [speakingVenueId, setSpeakingVenueId] = useState(null);

  const [preferences, setPreferences] = useState({
    visualAlerts: true,
    stepFreeNavigation: true,
    audioGuidance: true,
    simpleGuidance: false,
  });

  const voiceLang = LANGUAGES.find((l) => l.code === lang)?.voiceLang || "en-US";
  const currentVenue = getVenueData(selectedCityId, selectedCategoryId, selectedVenueId);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const showNotification = (msg) => {
    setNotification(msg);
    voiceService.speak(msg, voiceLang);
    setTimeout(() => {
      setNotification("");
    }, 4500);
  };

  const handleVoiceCommand = (action, payload) => {
    if (action === "select_place") {
      const catId = payload || "railway";
      setSelectedCategoryId(catId);
      const list = getCityVenueList(selectedCityId, catId);
      if (list && list.length > 0) setSelectedVenueId(list[0].id);
      setScreen("preferences");
      showNotification(`${getTranslation(lang, catId)} selected.`);
    } else if (action === "start_journey") {
      setScreen("journey");
      showNotification("Guided journey started.");
    } else if (action === "request_assistance") {
      showNotification(getTranslation(lang, "assistanceSent"));
    } else if (action === "change_lang") {
      setLang(payload);
    } else if (action === "go_staff") {
      setScreen("staff");
    }
  };

  const speakVenueDetails = (e, venueObj) => {
    e.stopPropagation();
    if (speakingVenueId === venueObj.id) {
      voiceService.stop();
      setSpeakingVenueId(null);
    } else {
      const cityName = INDIAN_CITIES.find(c => c.id === selectedCityId)?.name;
      const msg = `${venueObj.name} in ${cityName}. Destination: ${venueObj.targetValue}`;
      voiceService.speak(msg, voiceLang);
      setSpeakingVenueId(venueObj.id);
      setTimeout(() => setSpeakingVenueId(null), 5000);
    }
  };

  const categories = [
    { id: "railway", icon: "🚆", titleKey: "railwayStation", descKey: "railwayDesc" },
    { id: "hospital", icon: "🏥", titleKey: "hospital", descKey: "hospitalDesc" },
    { id: "tourist", icon: "🏛️", titleKey: "touristSite", descKey: "touristDesc" },
    { id: "office", icon: "🏢", titleKey: "publicOffice", descKey: "publicDesc" },
    { id: "airport", icon: "✈️", titleKey: "airport", descKey: "airportDesc" },
    { id: "metro", icon: "🚇", titleKey: "metroStation", descKey: "metroDesc" },
  ];

  const textSizeClass =
    textSize === "large" ? "text-lg" : textSize === "small" ? "text-xs" : "text-sm";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        highContrast
          ? "bg-black text-yellow-300 font-bold"
          : darkMode
          ? "bg-[#0F1A15] text-[#EAEFEA]"
          : "bg-[#F4F7F3] text-[#14251D]"
      } ${textSizeClass}`}
    >
      {/* GLOBAL NOTIFICATION TOAST */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-2xl bg-[#14251D] text-white px-5 py-3.5 shadow-2xl border border-[#52725F]">
          <Volume2 size={20} className="text-[#8EAA95] shrink-0" />
          <span className="font-bold text-sm">{notification}</span>
        </div>
      )}

      {/* VOICE ASSISTANT MODAL */}
      <VoiceModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        currentLang={lang}
        onCommand={handleVoiceCommand}
      />

      {/* BLIND ACCESSIBILITY VOICE MODE SCREEN */}
      <BlindVoiceMode
        isOpen={blindModeOpen}
        onClose={() => setBlindModeOpen(false)}
        currentRoute={currentVenue.normalRoute || []}
        activeStepIndex={0}
        onStepChange={() => {}}
        venueName={currentVenue.name}
        targetValue={currentVenue.targetValue}
        currentLang={lang}
        onRequestAssistance={() => showNotification(getTranslation(lang, "assistanceSent"))}
      />

      {/* NAVIGATION BAR */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          highContrast
            ? "bg-black border-yellow-400"
            : darkMode
            ? "bg-[#0F1A15]/90 border-[#2A3F33]"
            : "bg-[#F4F7F3]/90 border-[#D9DDD6]"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
          {/* LOGO */}
          <div
            onClick={() => setScreen("home")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold text-xl transition-transform group-hover:scale-105 ${
                highContrast
                  ? "bg-yellow-400 text-black"
                  : "bg-[#14251D] dark:bg-[#52725F] text-white shadow-md"
              }`}
            >
              स
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight block leading-none text-[#14251D] dark:text-white">
                {getTranslation(lang, "appName")}
              </span>
              <span className="text-[10px] text-[#52725F] dark:text-[#8EAA95] font-bold tracking-wider">
                ACCESSIBLE NAVIGATION INDIA
              </span>
            </div>
          </div>

          {/* CONTROLS & CITY SELECTOR */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* CITY SELECTOR */}
            <div className="flex items-center gap-1.5 rounded-full border border-[#D9DDD6] dark:border-[#2A3F33] bg-white dark:bg-[#15231B] px-3 py-1.5 text-xs font-bold shadow-xs">
              <MapPin size={14} className="text-[#52725F] dark:text-[#8EAA95]" />
              <select
                value={selectedCityId}
                onChange={(e) => {
                  const newCity = e.target.value;
                  setSelectedCityId(newCity);
                  const list = getCityVenueList(newCity, selectedCategoryId);
                  if (list && list.length > 0) setSelectedVenueId(list[0].id);
                  const cityName = INDIAN_CITIES.find(c => c.id === newCity)?.name;
                  showNotification(`City changed to ${cityName}`);
                }}
                className="bg-transparent focus:outline-none cursor-pointer text-[#14251D] dark:text-white font-bold"
              >
                {INDIAN_CITIES.map((c) => (
                  <option key={c.id} value={c.id} className="dark:bg-[#15231B] text-[#14251D] dark:text-white">
                    {c.name}, India
                  </option>
                ))}
              </select>
            </div>

            {/* LANGUAGE SELECTOR */}
            <div className="relative flex items-center gap-1.5 rounded-full border border-[#D9DDD6] dark:border-[#2A3F33] bg-white dark:bg-[#15231B] px-3 py-1.5 text-xs font-semibold shadow-xs">
              <Globe size={14} className="text-[#52725F] dark:text-[#8EAA95]" />
              <select
                value={lang}
                onChange={(e) => {
                  setLang(e.target.value);
                  showNotification(`Language changed`);
                }}
                className="bg-transparent focus:outline-none cursor-pointer text-[#14251D] dark:text-white font-bold"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="dark:bg-[#15231B] text-[#14251D] dark:text-white">
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* BLIND VOICE MODE BUTTON */}
            <button
              onClick={() => setBlindModeOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-emerald-700 text-white px-3.5 py-1.5 text-xs font-extrabold hover:bg-emerald-800 transition shadow-md cursor-pointer"
              title="Blind Accessibility Voice Mode"
            >
              <EyeOff size={14} />
              <span className="hidden md:inline">Blind Voice Mode</span>
            </button>

            {/* VOICE ASSISTANT MIC BUTTON */}
            <button
              onClick={() => setVoiceModalOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-[#14251D] dark:bg-[#52725F] text-white px-3.5 py-1.5 text-xs font-bold hover:opacity-90 transition shadow-xs cursor-pointer"
              title="Voice AI Assistant"
            >
              <Mic size={14} className="text-[#8EAA95]" />
              <span className="hidden md:inline">Voice AI</span>
            </button>

            {/* DARK MODE TOGGLE */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D9DDD6] dark:border-[#2A3F33] bg-white dark:bg-[#15231B] text-[#14251D] dark:text-white hover:bg-[#EEF2EC] dark:hover:bg-[#2A3F33] transition cursor-pointer"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* HIGH CONTRAST TOGGLE */}
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                highContrast
                  ? "bg-yellow-400 text-black border-yellow-400"
                  : "border-[#D9DDD6] dark:border-[#2A3F33] bg-white dark:bg-[#15231B] text-[#14251D] dark:text-white"
              }`}
              title="High Contrast Mode"
            >
              🌗 Contrast
            </button>

            {/* TEXT SIZE TOGGLE */}
            <button
              onClick={() =>
                setTextSize((curr) =>
                  curr === "normal" ? "large" : curr === "large" ? "small" : "normal"
                )
              }
              className="flex items-center gap-0.5 rounded-full border border-[#D9DDD6] dark:border-[#2A3F33] bg-white dark:bg-[#15231B] px-2.5 py-1 text-xs font-bold text-[#14251D] dark:text-white hover:bg-[#EEF2EC] dark:hover:bg-[#2A3F33] transition cursor-pointer"
              title="Adjust Font Size"
            >
              <Type size={13} />
              <span>{textSize === "large" ? "A+" : textSize === "small" ? "A-" : "A"}</span>
            </button>

            {/* MODE SWITCHER: USER VS STAFF */}
            <button
              onClick={() =>
                setScreen((curr) => (curr === "staff" ? "home" : "staff"))
              }
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition shadow-xs cursor-pointer ${
                screen === "staff"
                  ? "bg-amber-600 text-white hover:bg-amber-700"
                  : "border border-[#52725F] text-[#52725F] dark:text-[#8EAA95] bg-[#EDF3ED] dark:bg-[#1F3327] hover:bg-[#DFE8DF]"
              }`}
            >
              {screen === "staff" ? "User View" : getTranslation(lang, "staffPortal")}
            </button>
          </div>
        </div>
      </header>

      {/* SCREEN ROUTER */}

      {/* 1. STAFF PORTAL */}
      {screen === "staff" && (
        <StaffDashboard
          selectedCityId={selectedCityId}
          onCityChange={(cId) => setSelectedCityId(cId)}
        />
      )}

      {/* 2. GUIDED ROUTE / NAVIGATION PAGE */}
      {screen === "journey" && (
        <Navigation
          selectedCityId={selectedCityId}
          selectedPlaceId={selectedCategoryId}
          selectedVenueId={selectedVenueId}
          currentLang={lang}
          onBack={() => setScreen("dashboard")}
        />
      )}

      {/* 3. DASHBOARD SUMMARY PAGE */}
      {screen === "dashboard" && (
        <Dashboard
          selectedCityId={selectedCityId}
          selectedPlaceId={selectedCategoryId}
          selectedVenueId={selectedVenueId}
          preferences={preferences}
          onJourney={() => setScreen("journey")}
          currentLang={lang}
          onBack={() => setScreen("venue_select")}
        />
      )}

      {/* 4. VENUE SELECTOR SCREEN (ALL REAL-WORLD VENUES IN SELECTED CITY) */}
      {screen === "venue_select" && (
        <main className="mx-auto max-w-5xl px-6 py-12 animate-in fade-in duration-300">
          <button
            onClick={() => setScreen("places")}
            className="mb-8 flex items-center gap-2 rounded-full border border-[#D9DDD6] dark:border-[#2A3F33] bg-white dark:bg-[#15231B] px-4 py-2 text-sm font-semibold text-[#14251D] dark:text-white hover:bg-[#EEF2EC] dark:hover:bg-[#2A3F33] transition cursor-pointer"
          >
            <ArrowLeft size={16} />
            {getTranslation(lang, "back")}
          </button>

          <div className="mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#52725F] dark:text-[#8EAA95]">
              STEP 02 • SELECT SPECIFIC VENUE IN {INDIAN_CITIES.find(c => c.id === selectedCityId)?.name.toUpperCase()}
            </span>
            <h1 className="mt-2 text-4xl font-bold leading-tight text-[#14251D] dark:text-white">
              Choose Destination Venue
            </h1>
            <p className="mt-2 text-base text-[#65716A] dark:text-[#A0ABA4]">
              Showing all active real-time accessible locations in {INDIAN_CITIES.find(c => c.id === selectedCityId)?.name}.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-2">
            {getCityVenueList(selectedCityId, selectedCategoryId).map((vObj) => (
              <div
                key={vObj.id}
                onClick={() => {
                  setSelectedVenueId(vObj.id);
                  setScreen("preferences");
                }}
                className={`flex flex-col justify-between rounded-3xl border p-6 text-left transition hover:-translate-y-1 hover:shadow-xl group cursor-pointer ${
                  selectedVenueId === vObj.id
                    ? "border-[#52725F] bg-[#EDF3ED] dark:bg-[#1F3327]"
                    : "border-[#D9DDD6] dark:border-[#2A3F33] bg-white dark:bg-[#15231B]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF0EA] dark:bg-[#2A3F33] text-[#52725F] dark:text-[#8EAA95]">
                    <Building2 size={24} />
                  </div>
                  <button
                    onClick={(e) => speakVenueDetails(e, vObj)}
                    className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border border-[#D9DDD6] dark:border-[#2A3F33] bg-[#F7F7F2] dark:bg-[#2A3F33] text-[#14251D] dark:text-[#8EAA95] hover:bg-[#EDF3ED] transition cursor-pointer"
                  >
                    {speakingVenueId === vObj.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    <span>{speakingVenueId === vObj.id ? "Stop" : "Listen"}</span>
                  </button>
                </div>

                <div className="mt-5">
                  <h3 className="font-bold text-xl text-[#14251D] dark:text-white group-hover:text-[#52725F] dark:group-hover:text-[#8EAA95] transition">
                    {vObj.name}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-[#52725F] dark:text-[#8EAA95]">
                    {vObj.targetLabel}: {vObj.targetValue}
                  </p>
                </div>

                <div className="mt-6 flex items-center font-bold text-sm text-[#14251D] dark:text-[#8EAA95]">
                  Select & Personalize Guidance →
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* 5. PREFERENCES SCREEN */}
      {screen === "preferences" && (
        <main className="mx-auto max-w-4xl px-6 py-12 animate-in fade-in duration-300">
          <button
            onClick={() => setScreen("venue_select")}
            className="mb-8 flex items-center gap-2 rounded-full border border-[#D9DDD6] dark:border-[#2A3F33] bg-white dark:bg-[#15231B] px-4 py-2 text-sm font-semibold text-[#14251D] dark:text-white hover:bg-[#EEF2EC] dark:hover:bg-[#2A3F33] transition cursor-pointer"
          >
            <ArrowLeft size={16} />
            {getTranslation(lang, "back")}
          </button>

          <div className="mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#52725F] dark:text-[#8EAA95]">
              STEP 03 • ACCESSIBILITY PREFERENCES FOR {currentVenue.name.toUpperCase()}
            </span>
            <h1 className="mt-2 text-4xl font-bold leading-tight text-[#14251D] dark:text-white">
              {getTranslation(lang, "howGuide")}
            </h1>
            <p className="mt-3 text-base text-[#65716A] dark:text-[#A0ABA4]">
              {getTranslation(lang, "selectPreferences")}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                id: "visualAlerts",
                icon: "👁️",
                title: getTranslation(lang, "visualAlerts"),
                desc: getTranslation(lang, "visualDesc"),
              },
              {
                id: "stepFreeNavigation",
                icon: "♿",
                title: getTranslation(lang, "stepFreeRoute"),
                desc: getTranslation(lang, "stepFreeAvail"),
              },
              {
                id: "audioGuidance",
                icon: "🔊",
                title: getTranslation(lang, "audioGuidance"),
                desc: getTranslation(lang, "audioDesc"),
              },
              {
                id: "simpleGuidance",
                icon: "✋",
                title: getTranslation(lang, "simpleGuidance"),
                desc: getTranslation(lang, "simpleDesc"),
              },
            ].map((option) => {
              const selected = preferences[option.id];
              return (
                <button
                  key={option.id}
                  onClick={() =>
                    setPreferences((prev) => ({
                      ...prev,
                      [option.id]: !prev[option.id],
                    }))
                  }
                  className={`flex items-start gap-4 rounded-3xl border p-6 text-left transition shadow-xs cursor-pointer ${
                    selected
                      ? "border-[#52725F] bg-[#EDF3ED] dark:bg-[#1F3327]"
                      : "border-[#D9DDD6] dark:border-[#2A3F33] bg-white dark:bg-[#15231B] hover:border-[#8EAA95]"
                  }`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF0EA] dark:bg-[#2A3F33] text-2xl shadow-xs">
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-[#14251D] dark:text-white">{option.title}</h3>
                    <p className="mt-1 text-sm text-[#65716A] dark:text-[#A0ABA4]">{option.desc}</p>
                  </div>
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                      selected
                        ? "border-[#52725F] bg-[#52725F] text-white"
                        : "border-[#D9DDD6] dark:border-[#2A3F33] bg-white dark:bg-[#15231B]"
                    }`}
                  >
                    {selected && <Check size={16} />}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setScreen("dashboard")}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#14251D] dark:bg-[#52725F] py-4 text-base font-bold text-white hover:bg-[#253D31] dark:hover:bg-[#3E5848] transition shadow-lg cursor-pointer"
          >
            {getTranslation(lang, "continue")}
            <span>→</span>
          </button>
        </main>
      )}

      {/* 6. CATEGORY SELECTION SCREEN */}
      {screen === "places" && (
        <main className="mx-auto max-w-5xl px-6 py-12 animate-in fade-in duration-300">
          <button
            onClick={() => setScreen("home")}
            className="mb-8 flex items-center gap-2 rounded-full border border-[#D9DDD6] dark:border-[#2A3F33] bg-white dark:bg-[#15231B] px-4 py-2 text-sm font-semibold text-[#14251D] dark:text-white hover:bg-[#EEF2EC] dark:hover:bg-[#2A3F33] transition cursor-pointer"
          >
            <ArrowLeft size={16} />
            {getTranslation(lang, "back")}
          </button>

          <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#52725F] dark:text-[#8EAA95]">
                STEP 01 • PLACE CATEGORIES IN {INDIAN_CITIES.find(c => c.id === selectedCityId)?.name.toUpperCase()}
              </span>
              <h1 className="mt-2 text-4xl font-bold leading-tight text-[#14251D] dark:text-white">
                {getTranslation(lang, "whereGoing")}
              </h1>
              <p className="mt-2 text-base text-[#65716A] dark:text-[#A0ABA4]">
                {getTranslation(lang, "selectPlace")}
              </p>
            </div>

            <button
              onClick={() => setBlindModeOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-emerald-800 text-white px-5 py-3 font-bold text-xs hover:bg-emerald-900 transition shadow-md shrink-0 cursor-pointer"
            >
              <EyeOff size={16} />
              <span>Launch Blind Voice Mode</span>
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const venueList = getCityVenueList(selectedCityId, cat.id);
              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategoryId(cat.id);
                    if (venueList && venueList.length > 0) setSelectedVenueId(venueList[0].id);
                    setScreen("venue_select");
                  }}
                  className="flex flex-col justify-between rounded-3xl border border-[#D9DDD6] dark:border-[#2A3F33] bg-white dark:bg-[#15231B] p-6 text-left transition hover:-translate-y-1 hover:border-[#8EAA95] hover:shadow-xl group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF0EA] dark:bg-[#2A3F33] text-3xl">
                      {cat.icon}
                    </div>
                    <span className="rounded-full bg-[#EDF3ED] dark:bg-[#2A3F33] px-3 py-1 text-xs font-bold text-[#52725F] dark:text-[#8EAA95]">
                      {venueList.length} Venues
                    </span>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-bold text-xl text-[#14251D] dark:text-white group-hover:text-[#52725F] dark:group-hover:text-[#8EAA95] transition">
                      {getTranslation(lang, cat.titleKey)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#65716A] dark:text-[#A0ABA4]">
                      {getTranslation(lang, cat.descKey)}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center font-bold text-sm text-[#14251D] dark:text-[#8EAA95]">
                    Browse {venueList.length} locations →
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* 7. HOME HERO SCREEN */}
      {screen === "home" && (
        <main className="mx-auto max-w-7xl px-6 py-12 md:py-20 animate-in fade-in duration-300">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-block rounded-full bg-[#EDF3ED] dark:bg-[#1F3327] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#52725F] dark:text-[#8EAA95]">
                ACCESSIBILITY FOR EVERYONE IN INDIA
              </span>

              <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl text-[#14251D] dark:text-white">
                {getTranslation(lang, "tagline")}
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-[#65716A] dark:text-[#A0ABA4]">
                {getTranslation(lang, "heroDesc")} Real-time accessible navigation tailored for major cities in India.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => setScreen("places")}
                  className="flex items-center gap-3 rounded-2xl bg-[#14251D] dark:bg-[#52725F] px-7 py-4 font-bold text-white shadow-xl hover:bg-[#253D31] dark:hover:bg-[#3E5848] hover:scale-105 transition cursor-pointer"
                >
                  <span>{getTranslation(lang, "startJourney")}</span>
                  <span className="text-xl">→</span>
                </button>

                <button
                  onClick={() => setBlindModeOpen(true)}
                  className="flex items-center gap-2.5 rounded-2xl bg-emerald-700 text-white px-6 py-4 font-bold shadow-md hover:bg-emerald-800 transition cursor-pointer"
                >
                  <EyeOff size={20} />
                  <span>Blind Voice Guidance</span>
                </button>
              </div>

              {/* TRUST BADGES */}
              <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-[#D9DDD6] dark:border-[#2A3F33] pt-8">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#52725F] dark:text-[#8EAA95]">
                  <CheckCircle2 size={18} />
                  <span>Accessible by design</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#52725F] dark:text-[#8EAA95]">
                  <ShieldCheck size={18} />
                  <span>Live facility updates</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#52725F] dark:text-[#8EAA95]">
                  <Globe size={18} />
                  <span>5 Indian Languages</span>
                </div>
              </div>
            </div>

            {/* HERO VISUAL CARD */}
            <div className="relative rounded-[40px] bg-[#EAF0EA] dark:bg-[#1A2C22] p-8 md:p-12 shadow-inner">
              <div className="relative rounded-3xl bg-white dark:bg-[#15231B] p-8 shadow-2xl border border-[#D9DDD6] dark:border-[#2A3F33]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#65716A] dark:text-[#A0ABA4]">
                      {INDIAN_CITIES.find(c => c.id === selectedCityId)?.name.toUpperCase()} LIVE DEMO
                    </span>
                  </div>
                  <span className="rounded-full bg-[#EDF3ED] dark:bg-[#2A3F33] px-3 py-1 text-xs font-bold text-[#52725F] dark:text-[#8EAA95]">
                    {getTranslation(lang, "stepFreeRoute")}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-bold text-[#14251D] dark:text-white">
                  {currentVenue.name}
                </h3>
                <p className="text-sm font-semibold text-[#52725F] dark:text-[#8EAA95]">
                  {currentVenue.targetLabel}: {currentVenue.targetValue}
                </p>

                <div className="my-6 space-y-4 border-y border-[#EEF2EC] dark:border-[#2A3F33] py-6">
                  {(currentVenue.normalRoute || []).slice(0, 3).map((st, idx) => (
                    <div key={st.id || idx} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#14251D] dark:bg-[#52725F] text-xs font-bold text-white">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#14251D] dark:text-white">{st.name}</p>
                        <p className="text-xs text-[#65716A] dark:text-[#A0ABA4]">{st.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setScreen("places")}
                  className="w-full rounded-2xl bg-[#52725F] py-3.5 text-center font-bold text-white shadow-md hover:bg-[#3E5848] transition cursor-pointer"
                >
                  Explore Accessible Routes in {INDIAN_CITIES.find(c => c.id === selectedCityId)?.name}
                </button>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;