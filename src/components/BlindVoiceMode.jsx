import { useState, useEffect, useCallback } from "react";
import { Volume2, Mic, MicOff, X, EyeOff, LifeBuoy, ArrowRight, RefreshCw } from "lucide-react";
import { voiceService } from "../services/voiceService";
import { getTranslation, LANGUAGES } from "../services/i18n";

function BlindVoiceMode({ isOpen, onClose, currentRoute = [], activeStepIndex = 0, onStepChange, venueName = "", targetValue = "", currentLang = "en", onRequestAssistance }) {
  const [listening, setListening] = useState(false);
  const [lastSpeech, setLastSpeech] = useState("");
  const voiceLang = LANGUAGES.find((l) => l.code === currentLang)?.voiceLang || "en-US";

  const triggerVibration = () => {
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([100, 50, 100]);
    }
  };

  const speakStep = useCallback(
    (idx) => {
      const step = currentRoute[idx];
      if (step) {
        const text = `Step ${idx + 1} of ${currentRoute.length}: ${step.name}. ${step.description}`;
        setLastSpeech(text);
        voiceService.speak(text, voiceLang);
        triggerVibration();
      }
    },
    [currentRoute, voiceLang]
  );

  const processBlindCommand = useCallback(
    (text) => {
      const cmd = text.toLowerCase().trim();
      triggerVibration();

      if (cmd.includes("next") || cmd.includes("ahead") || cmd.includes("आगे") || cmd.includes("पुढील") || cmd.includes("अगला")) {
        if (activeStepIndex < currentRoute.length - 1) {
          const nextIdx = activeStepIndex + 1;
          onStepChange(nextIdx);
          speakStep(nextIdx);
        } else {
          voiceService.speak("You have reached your destination!", voiceLang);
        }
      } else if (cmd.includes("previous") || cmd.includes("back") || cmd.includes("पीछे") || cmd.includes("मागे")) {
        if (activeStepIndex > 0) {
          const prevIdx = activeStepIndex - 1;
          onStepChange(prevIdx);
          speakStep(prevIdx);
        }
      } else if (cmd.includes("where") || cmd.includes("location") || cmd.includes("कहाँ") || cmd.includes("कुठे")) {
        const msg = `You are at ${venueName}, navigating to ${targetValue}. Currently at step ${activeStepIndex + 1}: ${currentRoute[activeStepIndex]?.name || ''}`;
        setLastSpeech(msg);
        voiceService.speak(msg, voiceLang);
      } else if (cmd.includes("repeat") || cmd.includes("again") || cmd.includes("फिर") || cmd.includes("पुन्हा")) {
        speakStep(activeStepIndex);
      } else if (cmd.includes("help") || cmd.includes("assistance") || cmd.includes("मदद") || cmd.includes("मदत")) {
        if (onRequestAssistance) onRequestAssistance();
        const msg = "Emergency assistance requested! Staff notified to meet you.";
        setLastSpeech(msg);
        voiceService.speak(msg, voiceLang);
      } else {
        speakStep(activeStepIndex);
      }
    },
    [activeStepIndex, currentRoute, onStepChange, onRequestAssistance, speakStep, targetValue, venueName, voiceLang]
  );

  const startListeningLoop = useCallback(() => {
    setListening(true);
    voiceService.startListening(
      (text) => {
        setListening(false);
        processBlindCommand(text);
      },
      () => {
        setListening(false);
      },
      voiceLang
    );
  }, [processBlindCommand, voiceLang]);

  useEffect(() => {
    if (isOpen) {
      const welcome = `Blind Voice Guidance active for ${venueName}. Destination ${targetValue}. ${getTranslation(currentLang, "playAudio")}`;
      voiceService.speak(welcome, voiceLang);
    } else {
      voiceService.stop();
      voiceService.stopListening();
    }
  }, [isOpen, currentLang, targetValue, venueName, voiceLang]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#14251D] text-white p-6 animate-in fade-in duration-300">
      {/* TOP HEADER */}
      <div className="flex items-center justify-between border-b border-[#52725F] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#52725F] text-white shadow-lg">
            <EyeOff size={28} />
          </div>
          <div>
            <h2 className="font-extrabold text-xl tracking-tight text-emerald-300">
              BLIND VOICE GUIDANCE
            </h2>
            <p className="text-xs text-[#8EAA95] font-semibold">
              Hands-Free Screen Reader & Speech Assistant
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#52725F] text-white hover:bg-emerald-700 transition cursor-pointer"
          title="Exit Voice Mode"
        >
          <X size={24} />
        </button>
      </div>

      {/* CENTER STATUS & FULL SCREEN TOUCH PAD */}
      <div
        onClick={() => {
          if (activeStepIndex < currentRoute.length - 1) {
            const next = activeStepIndex + 1;
            onStepChange(next);
            speakStep(next);
          } else {
            speakStep(activeStepIndex);
          }
        }}
        className="my-auto flex flex-col items-center justify-center text-center p-8 rounded-3xl border-2 border-dashed border-[#8EAA95] bg-[#1A2C22] hover:bg-[#22392C] transition cursor-pointer group"
      >
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#52725F] text-white shadow-2xl group-hover:scale-110 transition">
          <Volume2 size={48} className="animate-pulse" />
        </div>

        <p className="text-xs font-bold uppercase tracking-widest text-[#8EAA95]">
          STEP {activeStepIndex + 1} OF {currentRoute.length}
        </p>

        <h3 className="mt-3 text-3xl font-extrabold text-white leading-tight">
          {currentRoute[activeStepIndex]?.name || venueName}
        </h3>

        <p className="mt-4 text-base leading-relaxed text-[#A0ABA4] max-w-md">
          {currentRoute[activeStepIndex]?.description}
        </p>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#52725F] px-6 py-3 font-bold text-sm text-white shadow-lg">
          <ArrowRight size={18} />
          <span>Tap Anywhere on Screen for Next Step</span>
        </div>
      </div>

      {/* BOTTOM CONTROLS & SPEECH ASSISTANT */}
      <div className="space-y-4 border-t border-[#52725F] pt-4">
        {lastSpeech && (
          <div className="flex items-center gap-2 rounded-2xl bg-[#1A2C22] p-4 text-sm font-semibold text-emerald-300">
            <Volume2 size={20} className="shrink-0 text-white" />
            <span>"{lastSpeech}"</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={startListeningLoop}
            className={`flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-sm transition shadow-lg cursor-pointer ${
              listening ? "bg-red-600 text-white animate-pulse" : "bg-[#52725F] text-white hover:bg-emerald-700"
            }`}
          >
            {listening ? <MicOff size={20} /> : <Mic size={20} />}
            <span>{listening ? "Listening..." : "Speak Command"}</span>
          </button>

          <button
            onClick={() => speakStep(activeStepIndex)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-white text-[#14251D] py-4 font-bold text-sm hover:bg-gray-100 transition shadow-lg cursor-pointer"
          >
            <RefreshCw size={18} />
            <span>Repeat Step</span>
          </button>
        </div>

        <button
          onClick={() => {
            if (onRequestAssistance) onRequestAssistance();
            voiceService.speak("Assistance request sent to staff.", voiceLang);
            triggerVibration();
          }}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-red-700 py-4 font-bold text-white hover:bg-red-800 transition shadow-lg cursor-pointer text-base"
        >
          <LifeBuoy size={22} />
          <span>EMERGENCY VOICE ASSISTANCE</span>
        </button>
      </div>
    </div>
  );
}

export default BlindVoiceMode;
