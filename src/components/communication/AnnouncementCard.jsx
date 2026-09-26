import {
  AlertOctagon,
  ArrowRight,
  Accessibility,
} from "lucide-react";

import { translations } from "../../data/communicationTranslations";

function AnnouncementCard({
  language,
  highContrast,
}) {
  const t = translations[language];

  return (
    <div
      className={`rounded-[3xl] border p-6 ${
        highContrast
          ? "border-yellow-300 bg-black"
          : "border-[#D7E2D9] bg-[#EDF3ED]"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
            highContrast
              ? "bg-yellow-300 text-black"
              : "bg-[#14251D] text-white"
          }`}
        >
          <AlertOctagon size={21} />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Accessibility size={17} />

            <p className="text-xs font-bold uppercase tracking-[0.14em]">
              {t.priority}
            </p>
          </div>

          <h3 className="mt-3 text-xl font-bold">
            {t.liftUnavailable}
          </h3>

          <p className="mt-2 opacity-80">
            {t.routeChanged}
          </p>

          <div
            className={`mt-4 rounded-xl p-4 ${
              highContrast
                ? "border border-white/40"
                : "bg-white"
            }`}
          >
            <p className="font-semibold">
              {t.alternateRoute}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-bold">
              <span>Ramp B</span>
              <ArrowRight size={14} />
              <span>Corridor C</span>
              <ArrowRight size={14} />
              <span>Lift B</span>
              <ArrowRight size={14} />
              <span>Platform 5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementCard;