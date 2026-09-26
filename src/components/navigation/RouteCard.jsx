import { Clock, CheckCircle2, Volume2 } from "lucide-react";
import RouteStep from "./RouteStep";
import { voiceService } from "../../services/voiceService";
import { LANGUAGES } from "../../services/i18n";

function RouteCard({ route, alternative, activeStepIndex, onStepClick, currentLang = "en" }) {
  const voiceLang = LANGUAGES.find((l) => l.code === currentLang)?.voiceLang || "en-US";

  const handleSpeakFullRoute = () => {
    const summary = route.map((s, idx) => `Step ${idx + 1}: ${s.name}`).join(". ");
    voiceService.speak(`Accessible route guidance summary: ${summary}`, voiceLang);
  };

  return (
    <section className="rounded-3xl border border-[#E0E4DD] dark:border-[#2A3F33] bg-white dark:bg-[#15231B] p-6 shadow-md md:p-8 transition-colors">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#EEF2EC] dark:border-[#2A3F33] pb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#52725F] dark:text-[#8EAA95]">
            {alternative
              ? "Alternative step-free route"
              : "Recommended step-free route"}
          </p>

          <h2 className="mt-1 text-2xl font-bold text-[#14251D] dark:text-white">
            Follow your turn-by-turn guidance
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSpeakFullRoute}
            className="flex items-center gap-1.5 rounded-full bg-[#EDF3ED] dark:bg-[#2A3F33] px-3.5 py-1.5 text-xs font-bold text-[#52725F] dark:text-[#8EAA95] hover:bg-[#DFE8DF] transition"
          >
            <Volume2 size={15} />
            <span>Read Full Route</span>
          </button>

          <div className="flex items-center gap-1.5 rounded-full bg-[#F1F3EE] dark:bg-[#2A3F33] px-3.5 py-1.5 text-xs font-semibold text-[#65716A] dark:text-[#A0ABA4]">
            <Clock size={15} />
            <span>{alternative ? "8 min" : "6 min"}</span>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        {route.map((step, index) => (
          <RouteStep
            key={step.id || index}
            name={step.name}
            description={step.description}
            type={step.type}
            isLast={index === route.length - 1}
            isActive={index === activeStepIndex}
            onClick={() => onStepClick(index)}
            currentLang={currentLang}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center gap-3 rounded-2xl bg-[#EDF3ED] dark:bg-[#2A3F33] p-4 text-[#52725F] dark:text-[#8EAA95]">
        <CheckCircle2 size={22} className="shrink-0" />
        <div>
          <p className="font-bold text-sm">Step-free route verified</p>
          <p className="text-xs opacity-90">
            All required elevators, ramps, and doors are clear.
          </p>
        </div>
      </div>
    </section>
  );
}

export default RouteCard;