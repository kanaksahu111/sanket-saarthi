import { Clock, CheckCircle2 } from "lucide-react";
import RouteStep from "./RouteStep";

function RouteCard({ route, alternative }) {

  return (
    <section className="rounded-[28px] border border-[#E0E4DD] bg-white p-6 shadow-[0_10px_35px_rgba(20,37,29,0.05)] md:p-8">

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">

        <div>

          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#648A73]">
            {alternative
              ? "Alternative step-free route"
              : "Recommended step-free route"}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#14251D]">
            Follow this route
          </h2>

        </div>

        <div className="flex items-center gap-2 rounded-full bg-[#F1F3EE] px-4 py-2 text-sm text-[#65716A]">
          <Clock size={16} />

          {alternative ? "8 min" : "6 min"}
        </div>

      </div>

      <div>
        {route.map((step, index) => (
          <RouteStep
            key={step.id}
            name={step.name}
            description={step.description}
            type={step.type}
            isLast={index === route.length - 1}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center gap-3 rounded-2xl bg-[#EDF3ED] p-4 text-[#52725F]">

        <CheckCircle2 size={20} />

        <div>
          <p className="font-semibold">
            Step-free route available
          </p>

          <p className="text-sm opacity-80">
            All required facilities are currently accessible.
          </p>
        </div>

      </div>

    </section>
  );
}

export default RouteCard;