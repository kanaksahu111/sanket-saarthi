import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, LifeBuoy, Volume2, VolumeX, MapPin } from "lucide-react";
import { getTranslation, LANGUAGES } from "../services/i18n";
import { getVenueData, subscribeToVenue } from "../services/venueService";
import { createAssistanceRequest } from "../services/assistanceService";
import { voiceService } from "../services/voiceService";
import { INDIAN_CITIES } from "../services/cityDataService";

function Dashboard({ selectedCityId = "mumbai", selectedPlaceId = "railway", selectedVenueId = null, preferences, onJourney, currentLang = "en", onBack }) {
  const [venue, setVenue] = useState(() => getVenueData(selectedCityId, selectedPlaceId, selectedVenueId));
  const [assistanceMsg, setAssistanceMsg] = useState("");
  const [isSpeakingSummary, setIsSpeakingSummary] = useState(false);

  const voiceLang = LANGUAGES.find((l) => l.code === currentLang)?.voiceLang || "en-US";
  const cityName = INDIAN_CITIES.find(c => c.id === selectedCityId)?.name || "Mumbai";

  useEffect(() => {
    const unsub = subscribeToVenue(selectedCityId, selectedPlaceId, (data) => {
      if (data) setVenue(data);
    }, selectedVenueId);
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [selectedCityId, selectedPlaceId, selectedVenueId]);

  const selectedPreferences = [];
  if (preferences?.visualAlerts) selectedPreferences.push(getTranslation(currentLang, "visualAlerts"));
  if (preferences?.stepFreeNavigation) selectedPreferences.push(getTranslation(currentLang, "stepFreeRoute"));
  if (preferences?.audioGuidance) selectedPreferences.push(getTranslation(currentLang, "audioGuidance"));
  if (preferences?.simpleGuidance) selectedPreferences.push(getTranslation(currentLang, "simpleGuidance"));

  const handleRequestAssistance = async () => {
    await createAssistanceRequest({
      user: "Current Visitor",
      location: `${venue.name} in ${cityName}`,
      type: "Accessibility Guidance",
    });
    setAssistanceMsg(getTranslation(currentLang, "assistanceSent"));
    if (preferences?.audioGuidance) {
      voiceService.speak(getTranslation(currentLang, "assistanceSent"), voiceLang);
    }
    setTimeout(() => setAssistanceMsg(""), 4000);
  };

  const handleSpeakSummary = () => {
    if (isSpeakingSummary) {
      voiceService.stop();
      setIsSpeakingSummary(false);
    } else {
      const msg = `Journey summary for ${venue.name} in ${cityName}, India. Target destination is ${venue.targetValue}. Step-free accessible route available.`;
      voiceService.speak(msg, voiceLang);
      setIsSpeakingSummary(true);
      setTimeout(() => setIsSpeakingSummary(false), 5000);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-300">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 rounded-full border border-[#D9DDD6] dark:border-[#2A3F33] bg-white dark:bg-[#15231B] px-4 py-2 text-sm font-semibold text-[#14251D] dark:text-white hover:bg-[#EEF2EC] dark:hover:bg-[#2A3F33] transition shadow-xs cursor-pointer"
      >
        <ArrowLeft size={16} />
        {getTranslation(currentLang, "back")}
      </button>

      {/* PAGE HEADER */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#52725F] dark:text-[#8EAA95]">
            <MapPin size={14} />
            <span>{cityName.toUpperCase()}, INDIA • JOURNEY DASHBOARD</span>
          </div>
          <h1 className="mt-2 text-4xl font-bold leading-tight md:text-5xl text-[#14251D] dark:text-white">
            {venue.name}
          </h1>
          <p className="mt-2 text-base font-semibold text-[#52725F] dark:text-[#8EAA95]">
            Personalized step-free route for {venue.targetValue}.
          </p>
        </div>

        <button
          onClick={handleSpeakSummary}
          className="flex items-center gap-2 rounded-2xl border border-[#D9DDD6] dark:border-[#2A3F33] bg-white dark:bg-[#15231B] px-5 py-3 text-sm font-bold text-[#14251D] dark-text:white


           hover:bg-[#EEF2EC] dark:hover:bg-[#375645] transition shadow-xs shrink-0 cursor-pointer"
        >
          {isSpeakingSummary ? <VolumeX size={18} /> : <Volume2 size={18} className="text-[#52725F] dark:text-[#8EAA95]" />}
          <span>{isSpeakingSummary ? "Stop Audio" : "Listen Summary"}</span>
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* MAIN ROUTE CARD */}
        <section className="lg:col-span-2 rounded-3xl border border-[#E0E4DD] dark:border-[#2A3F33] bg-white dark:bg-[#15231B] p-6 md:p-8 shadow-md transition-colors">
          <div className="flex items-center justify-between border-b border-[#EEF2EC] dark:border-[#2A3F33] pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#52725F] dark:text-[#8EAA95]">
                ACCESSIBLE ROUTE PREVIEW
              </span>
              <h2 className="mt-1 text-2xl font-bold text-[#14251D] dark:text-white">
                Entrance → {venue.targetValue}
              </h2>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-[#EDF3ED] dark:bg-[#2A3F33] px-3.5 py-1.5 text-xs font-extrabold text-[#52725F] dark:text-[#8EAA95]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              {getTranslation(currentLang, "live")}
            </span>
          </div>

          <div className="my-8 space-y-6">
            {(venue.normalRoute || []).slice(0, 3).map((step, idx) => (
              <div key={step.id || idx}>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#14251D] dark:bg-[#52725F] font-bold text-white text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#14251D] dark:text-white">{step.name}</h4>
                    <p className="text-xs text-[#65716A] dark:text-[#A0ABA4]">{step.description}</p>
                  </div>
                </div>
                {idx < 2 && <div className="ml-5 my-2 h-6 w-0.5 bg-[#D9DDD6] dark:bg-[#2A3F33]" />}
              </div>
            ))}
          </div>

          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-[#EDF3ED] dark:bg-[#2A3F33] p-4 text-[#52725F] dark:text-[#8EAA95]">
            <CheckCircle2 size={20} className="shrink-0" />
            <p className="text-sm font-bold">
              {getTranslation(currentLang, "stepFreeAvail")}
            </p>
          </div>

          <button
            onClick={onJourney}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#14251D] dark:bg-[#52725F] py-4 font-bold text-white hover:bg-[#253D31] dark:hover:bg-[#3E5848] transition shadow-lg text-base cursor-pointer"
          >
            <span>Start Guided Navigation</span>
            <span>→</span>
          </button>
        </section>

        {/* SIDEBAR PREFERENCES & ASSISTANCE */}
        <aside className="space-y-6">
          <div className="rounded-3xl border border-[#E0E4DD] dark:border-[#2A3F33] bg-white dark:bg-[#15231B] p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#52725F] dark:text-[#8EAA95]">
              YOUR ACCESSIBILITY PREFERENCES
            </h3>
            <div className="mt-4 space-y-2">
              {selectedPreferences.length > 0 ? (
                selectedPreferences.map((pref, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl bg-[#F7F7F2] dark:bg-[#1A2C22] p-3 text-sm font-semibold text-[#14251D] dark:text-white">
                    <CheckCircle2 size={16} className="text-[#52725F] dark:text-[#8EAA95]" />
                    <span>{pref}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2 rounded-xl bg-[#F7F7F2] dark:bg-[#1A2C22] p-3 text-sm font-semibold text-[#14251D] dark:text-white">
                  <CheckCircle2 size={16} className="text-[#52725F] dark:text-[#8EAA95]" />
                  <span>Standard Step-free Route</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950 p-6 shadow-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-bold">
                !
              </div>
              <h4 className="font-bold text-base">Real-time Venue Alert</h4>
            </div>
            <p className="mt-3 text-sm leading-relaxed">
              {venue.targetValue} in {cityName} has active wheelchair assistance staff on duty.
            </p>
          </div>

          <button
            onClick={handleRequestAssistance}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950 py-4 font-bold text-red-700 dark:text-red-300 hover:bg-red-100 transition shadow-xs cursor-pointer"
          >
            <LifeBuoy size={20} />
            <span>{assistanceMsg || getTranslation(currentLang, "needAssistance")}</span>
          </button>
        </aside>
      </div>
    </main>
  );
}

export default Dashboard;