import { useState, useEffect } from "react";
import { ArrowLeft, Train, Accessibility, Volume2, VolumeX, AlertTriangle, LifeBuoy, MapPin, EyeOff } from "lucide-react";
import RouteCard from "../components/navigation/RouteCard";
import BlindVoiceMode from "../components/BlindVoiceMode";
import { getTranslation, LANGUAGES } from "../services/i18n";
import { voiceService } from "../services/voiceService";
import { createAssistanceRequest } from "../services/assistanceService";
import { subscribeToFacility, updateFacilityStatus } from "../services/facilityService";
import { getVenueData, subscribeToVenue } from "../services/venueService";
import { INDIAN_CITIES } from "../services/cityDataService";

function Navigation({ selectedCityId = "mumbai", selectedPlaceId = "railway", selectedVenueId = null, currentLang = "en", onBack }) {
  const [venue, setVenue] = useState(() => getVenueData(selectedCityId, selectedPlaceId, selectedVenueId));
  const [liftAStatus, setLiftAStatus] = useState("available");
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [assistanceSent, setAssistanceSent] = useState(false);
  const [blindModeOpen, setBlindModeOpen] = useState(false);

  const voiceLang = LANGUAGES.find((l) => l.code === currentLang)?.voiceLang || "en-US";
  const cityName = INDIAN_CITIES.find(c => c.id === selectedCityId)?.name || "Mumbai";

  useEffect(() => {
    const unsubVenue = subscribeToVenue(selectedCityId, selectedPlaceId, (data) => {
      if (data) setVenue(data);
    }, selectedVenueId);
    const unsubFac = subscribeToFacility("lift-a", (fac) => {
      if (fac) setLiftAStatus(fac.status);
    });
    return () => {
      if (typeof unsubVenue === "function") unsubVenue();
      if (typeof unsubFac === "function") unsubFac();
    };
  }, [selectedCityId, selectedPlaceId, selectedVenueId]);

  const normalRoute = venue.normalRoute || getVenueData(selectedCityId, selectedPlaceId, selectedVenueId).normalRoute;
  const alternativeRoute = venue.altRoute || getVenueData(selectedCityId, selectedPlaceId, selectedVenueId).altRoute || normalRoute;

  const liftUnavailable = liftAStatus === "out_of_service";
  const currentRoute = liftUnavailable ? alternativeRoute : normalRoute;

  const speakCurrentStep = (stepIdx, isAlternative = false) => {
    if (voiceMuted) return;
    const step = currentRoute[stepIdx];
    if (step) {
      const msg = isAlternative
        ? `Rerouted guidance: Step ${stepIdx + 1}, ${step.name}. ${step.description}`
        : `Step ${stepIdx + 1}: ${step.name}. ${step.description}`;
      voiceService.speak(msg, voiceLang);
    }
  };

  const handleNextStep = () => {
    if (activeStepIndex < currentRoute.length - 1) {
      const nextIdx = activeStepIndex + 1;
      setActiveStepIndex(nextIdx);
      speakCurrentStep(nextIdx);
    }
  };

  const handleToggleLiftSimulation = () => {
    const newStatus = liftUnavailable ? "available" : "out_of_service";
    setLiftAStatus(newStatus);
    updateFacilityStatus("lift-a", newStatus);

    if (!voiceMuted) {
      if (newStatus === "out_of_service") {
        voiceService.speak(
          `Alert! Primary elevator is out of service at ${venue.name} in ${cityName}. Sanket Saarthi has recalculated your accessible route.`,
          voiceLang
        );
      } else {
        voiceService.speak(
          `Primary elevator restored at ${venue.name}. Returning to primary step-free route.`,
          voiceLang
        );
      }
    }
  };

  const handleRequestAssistance = async () => {
    await createAssistanceRequest({
      user: "Current Visitor",
      location: `${venue.name} (${cityName}) Step ${activeStepIndex + 1}`,
      type: "Accessibility Guidance",
    });
    setAssistanceSent(true);
    if (!voiceMuted) {
      voiceService.speak(getTranslation(currentLang, "assistanceSent"), voiceLang);
    }
    setTimeout(() => setAssistanceSent(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F3] dark:bg-[#0F1A15] text-[#14251D] dark:text-[#EAEFEA] transition-colors animate-in fade-in duration-300">
      {/* BLIND ACCESSIBILITY MODE OVERLAY */}
      <BlindVoiceMode
        isOpen={blindModeOpen}
        onClose={() => setBlindModeOpen(false)}
        currentRoute={currentRoute}
        activeStepIndex={activeStepIndex}
        onStepChange={(idx) => setActiveStepIndex(idx)}
        venueName={venue.name}
        targetValue={venue.targetValue}
        currentLang={currentLang}
        onRequestAssistance={handleRequestAssistance}
      />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8 md:py-12">
        {/* HEADER CONTROLS */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={onBack || (() => window.history.back())}
            className="flex items-center gap-2 rounded-full border border-[#D9DDD6] dark:border-[#2A3F33] bg-white dark:bg-[#15231B] px-5 py-2.5 text-sm font-semibold text-[#14251D] dark:text-white hover:bg-[#EEF2EC] dark:hover:bg-[#2A3F33] transition shadow-xs cursor-pointer"
          >
            <ArrowLeft size={16} />
            {getTranslation(currentLang, "back")}
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setBlindModeOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-emerald-700 text-white px-4 py-2 text-xs font-extrabold hover:bg-emerald-800 transition shadow-md cursor-pointer"
            >
              <EyeOff size={16} />
              <span>Blind Voice Mode</span>
            </button>

            <button
              onClick={() => setVoiceMuted(!voiceMuted)}
              className="flex items-center gap-2 rounded-full border border-[#D9DDD6] dark:border-[#2A3F33] bg-white dark:bg-[#15231B] px-4 py-2 text-sm font-semibold text-[#14251D] dark:text-white hover:bg-[#EEF2EC] dark:hover:bg-[#2A3F33] transition cursor-pointer"
            >
              {voiceMuted ? <VolumeX size={16} className="text-red-500" /> : <Volume2 size={16} className="text-[#52725F] dark:text-[#8EAA95]" />}
              <span>{voiceMuted ? "Audio Muted" : "Audio Active"}</span>
            </button>
          </div>
        </div>

        {/* PAGE INTRO */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#52725F] dark:text-[#8EAA95]">
            <MapPin size={14} />
            <span>{cityName}, INDIA • GUIDED NAVIGATION</span>
          </div>
          <h1 className="mt-2 max-w-2xl text-4xl font-bold leading-tight md:text-5xl text-[#14251D] dark:text-white">
            {getTranslation(currentLang, "followRoute")}
            <span className="text-[#52725F] dark:text-[#8EAA95]"> {venue.targetValue}.</span>
          </h1>
          <p className="mt-3 max-w-xl text-base text-[#65716A] dark:text-[#A0ABA4]">
            {venue.name} → {venue.targetValue}
          </p>
        </div>

        {/* DESTINATION CARD */}
        <section className="mb-6 flex flex-col justify-between gap-5 rounded-3xl border border-[#E0E4DD] dark:border-[#2A3F33] bg-white dark:bg-[#15231B] p-6 shadow-md sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EDF3ED] dark:bg-[#2A3F33] text-[#52725F] dark:text-[#8EAA95]">
              <Train size={28} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#65716A] dark:text-[#A0ABA4]">
                Target Destination
              </p>
              <h2 className="text-2xl font-bold text-[#14251D] dark:text-white">{venue.targetValue}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-[#EDF3ED] dark:bg-[#2A3F33] px-4 py-2 text-sm font-bold text-[#52725F] dark:text-[#8EAA95]">
            <Accessibility size={18} />
            {getTranslation(currentLang, "stepFreeRoute")}
          </div>
        </section>

        {/* REROUTE WARNING IF LIFT UNAVAILABLE */}
        {liftUnavailable && (
          <div className="mb-6 flex items-start gap-4 rounded-3xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-5 text-amber-900 dark:text-amber-200 shadow-sm animate-in slide-in-from-top-2">
            <AlertTriangle size={24} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-base">Facility Alert: Primary Elevator Out of Service</h4>
              <p className="mt-1 text-sm leading-relaxed">
                Sanket Saarthi has automatically updated your accessible navigation for {venue.name} in {cityName}. Step-free bypass route recalculated.
              </p>
            </div>
          </div>
        )}

        {/* ACTIVE ROUTE CARD */}
        <RouteCard
          route={currentRoute}
          alternative={liftUnavailable}
          activeStepIndex={activeStepIndex}
          onStepClick={(idx) => {
            setActiveStepIndex(idx);
            speakCurrentStep(idx);
          }}
          currentLang={currentLang}
        />

        {/* ACTION BUTTONS */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleNextStep}
            disabled={activeStepIndex >= currentRoute.length - 1}
            className="flex-1 flex items-center justify-center gap-3 rounded-2xl bg-[#14251D] dark:bg-[#52725F] py-4 px-6 font-bold text-white shadow-lg hover:bg-[#253D31] dark:hover:bg-[#3E5848] transition disabled:opacity-50 cursor-pointer"
          >
            <span>{getTranslation(currentLang, "checkpointReached")}</span>
            <span>→</span>
          </button>

          <button
            onClick={handleRequestAssistance}
            className={`flex items-center justify-center gap-2 rounded-2xl border px-6 py-4 font-bold transition shadow-sm cursor-pointer ${
              assistanceSent
                ? "bg-emerald-700 border-emerald-700 text-white"
                : "border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 hover:bg-red-100"
            }`}
          >
            <LifeBuoy size={20} />
            <span>
              {assistanceSent
                ? getTranslation(currentLang, "assistanceSent")
                : getTranslation(currentLang, "needAssistance")}
            </span>
          </button>
        </div>

        {/* LIVE DEMO SIMULATION PANEL */}
        <section className="mt-10 rounded-3xl border border-dashed border-[#B5C2B8] dark:border-[#2A3F33] bg-[#EAF0EA] dark:bg-[#15231B] p-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#52725F] dark:text-[#8EAA95]">
            {getTranslation(currentLang, "simUpdate")}
          </span>
          <p className="mt-2 text-sm leading-relaxed text-[#65716A] dark:text-[#A0ABA4]">
            Simulate a real-time facility outage to test how Sanket Saarthi automatically reroutes the visitor for {venue.name} in {cityName} and announces live voice guidance.
          </p>

          <button
            type="button"
            onClick={handleToggleLiftSimulation}
            className={`mt-4 rounded-xl px-5 py-3 text-sm font-bold text-white transition shadow-md cursor-pointer ${
              liftUnavailable
                ? "bg-emerald-700 hover:bg-emerald-800"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {liftUnavailable
              ? getTranslation(currentLang, "restoreLift")
              : getTranslation(currentLang, "toggleLift")}
          </button>
        </section>
      </main>
    </div>
  );
}

export default Navigation;