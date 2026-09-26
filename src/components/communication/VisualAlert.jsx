import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { translations } from "../../data/communicationTranslations";

function VisualAlert({ language, highContrast }) {
  const [acknowledged, setAcknowledged] = useState(false);

  const t = translations[language];

  const handleAcknowledge = () => {
    setAcknowledged(true);

    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  return (
    <div
      className={`rounded-[3xl] border p-6 ${
        highContrast
          ? "border-yellow-300 bg-black"
          : "border-[#E6D6B9] bg-[#FFF8EA]"
      }`}
    >
      <div className="flex gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
            highContrast
              ? "bg-yellow-300 text-black"
              : "bg-[#F4E8CF] text-[#8A6735]"
          }`}
        >
          <AlertTriangle size={22} />
        </div>

        <div className="flex-1">
          <p
            className={`text-xs font-bold uppercase tracking-[0.15em] ${
              highContrast ? "text-yellow-300" : "text-[#967343]"
            }`}
          >
            {t.importantUpdate}
          </p>

          <h2 className="mt-2 text-xl font-bold">
            {t.platformChanged}
          </h2>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-xl px-4 py-2 font-semibold ${
                highContrast
                  ? "border border-white"
                  : "bg-white"
              }`}
            >
              {t.oldPlatform}
            </span>

            <ArrowRight size={20} />

            <span
              className={`rounded-xl px-4 py-2 font-semibold ${
                highContrast
                  ? "bg-yellow-300 text-black"
                  : "bg-[#14251D] text-white"
              }`}
            >
              {t.newPlatform}
            </span>
          </div>

          <p className="mt-4 leading-7">
            {t.platformMessage}
          </p>

          <button
            onClick={handleAcknowledge}
            disabled={acknowledged}
            className={`mt-5 flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold ${
              acknowledged
                ? "bg-[#648A73] text-white"
                : highContrast
                ? "border border-white"
                : "border border-[#D8C9AA] bg-white"
            }`}
          >
            {acknowledged && <CheckCircle2 size={18} />}

            {acknowledged
              ? t.acknowledged
              : t.acknowledge}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VisualAlert;