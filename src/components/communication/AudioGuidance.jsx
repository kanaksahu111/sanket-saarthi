import { useEffect, useState } from "react";
import { Square, Volume2 } from "lucide-react";

import {
  languages,
  translations,
} from "../../data/communicationTranslations";

function AudioGuidance({
  language,
  highContrast,
  autoRead,
}) {
  const [speaking, setSpeaking] = useState(false);

  const t = translations[language];

  const speak = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported by this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(
      t.platformMessage
    );

    const selectedLanguage = languages.find(
      (item) => item.code === language
    );

    speech.lang =
      selectedLanguage?.speechCode || "en-IN";

    speech.rate = 0.88;
    speech.pitch = 1;

    speech.onstart = () => setSpeaking(true);
    speech.onend = () => setSpeaking(false);
    speech.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(speech);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  useEffect(() => {
    if (autoRead) {
      const timer = setTimeout(() => {
        speak();
      }, 300);

      return () => {
        clearTimeout(timer);
        window.speechSynthesis.cancel();
      };
    }

    return undefined;
  }, [language, autoRead]);

  return (
    <div
      className={`rounded-[3xl] border p-6 ${
        highContrast
          ? "border-white/40 bg-[#111]"
          : "border-[#E0E4DD] bg-white"
      }`}
    >
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
          highContrast
            ? "bg-yellow-300 text-black"
            : "bg-[#EAF0EA] text-[#52725F]"
        }`}
      >
        <Volume2 size={22} />
      </div>

      <p
        className={`text-xs font-bold uppercase tracking-[0.15em] ${
          highContrast
            ? "text-yellow-300"
            : "text-[#648A73]"
        }`}
      >
        {t.audioGuidance}
      </p>

      <h2 className="mt-2 text-xl font-bold">
        {t.audioDescription}
      </h2>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={speak}
          className={`flex items-center gap-2 rounded-xl px-5 py-3 font-semibold ${
            highContrast
              ? "bg-yellow-300 text-black"
              : "bg-[#14251D] text-white"
          }`}
        >
          <Volume2 size={18} />

          {speaking ? "•••" : t.readAloud}
        </button>

        {speaking && (
          <button
            onClick={stop}
            className="flex items-center gap-2 rounded-xl border px-5 py-3 font-semibold"
          >
            <Square size={16} />
            {t.stop}
          </button>
        )}
      </div>

      <p className="mt-4 text-xs opacity-60">
        Voice availability depends on the languages installed
        on your device.
      </p>
    </div>
  );
}

export default AudioGuidance;