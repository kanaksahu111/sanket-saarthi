import { ListChecks } from "lucide-react";

import { translations } from "../../data/communicationTranslations";

function SimpleGuidance({
  language,
  highContrast,
}) {
  const t = translations[language];

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
        <ListChecks size={22} />
      </div>

      <p
        className={`text-xs font-bold uppercase tracking-[0.15em] ${
          highContrast
            ? "text-yellow-300"
            : "text-[#648A73]"
        }`}
      >
        {t.simpleGuidance}
      </p>

      <h2 className="mt-2 text-xl font-bold">
        {t.simpleTitle}
      </h2>

      <div className="mt-5 space-y-3">
        {t.steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 rounded-xl p-4 ${
              highContrast
                ? "border border-white/30 bg-black"
                : "bg-[#F5F6F2]"
            }`}
          >
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                highContrast
                  ? "bg-yellow-300 text-black"
                  : "bg-[#14251D] text-white"
              }`}
            >
              {index + 1}
            </div>

            <p className="pt-0.5 font-medium">
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SimpleGuidance;