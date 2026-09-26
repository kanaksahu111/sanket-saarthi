import { useState } from "react";
import {
  MapPin,
  Accessibility,
  Footprints,
  Train,
  Volume2,
  VolumeX,
} from "lucide-react";
import { voiceService } from "../../services/voiceService";
import { LANGUAGES } from "../../services/i18n";

function RouteStep({ name, description, type, isLast, isActive, onClick, currentLang = "en" }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const icons = {
    entrance: MapPin,
    ramp: Accessibility,
    lift: Accessibility,
    corridor: Footprints,
    platform: Train,
  };

  const Icon = icons[type] || MapPin;
  const voiceLang = LANGUAGES.find((l) => l.code === currentLang)?.voiceLang || "en-US";

  const handleSpeakStep = (e) => {
    e.stopPropagation();
    if (isSpeaking) {
      voiceService.stop();
      setIsSpeaking(false);
    } else {
      const textToSpeak = `${name}. ${description}`;
      voiceService.speak(textToSpeak, voiceLang);
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 4000);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative flex gap-4 p-4 rounded-2xl transition cursor-pointer ${
        isActive
          ? "bg-[#52725F]/15 dark:bg-[#52725F]/30 border border-[#52725F]"
          : "hover:bg-black/5 dark:hover:bg-white/5"
      }`}
    >
      <div className="flex flex-col items-center">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
            isActive
              ? "bg-[#52725F] text-white shadow-md"
              : "bg-[#EAF0EA] dark:bg-[#2A3F33] text-[#52725F] dark:text-[#8EAA95]"
          }`}
        >
          <Icon size={20} />
        </div>

        {!isLast && (
          <div className="my-2 h-10 w-0.5 bg-[#CBD4CC] dark:bg-[#2A3F33]" />
        )}
      </div>

      <div className="flex-1 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-[#14251D] dark:text-white">
            {name}
          </h3>

          <button
            onClick={handleSpeakStep}
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border transition ${
              isSpeaking
                ? "bg-emerald-600 text-white border-emerald-600"
                : "border-[#CBD4CC] dark:border-[#2A3F33] text-[#52725F] dark:text-[#8EAA95] hover:bg-[#EAF0EA] dark:hover:bg-[#2A3F33]"
            }`}
            title="Read step out loud"
          >
            {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>{isSpeaking ? "Stop" : "Audio"}</span>
          </button>
        </div>

        <p className="mt-1 text-sm leading-relaxed text-[#65716A] dark:text-[#A0ABA4]">
          {description}
        </p>
      </div>
    </div>
  );
}

export default RouteStep;