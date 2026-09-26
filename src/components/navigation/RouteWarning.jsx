import { AlertTriangle } from "lucide-react";

function RouteWarning() {

  return (
    <section
      role="alert"
      aria-live="assertive"
      className="mb-6 rounded-[3xl] border border-[#E6D6B9] bg-[#FFF8EA] p-5"
    >

      <div className="flex gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4E8CF] text-[#8A6735]">
          <AlertTriangle size={21} />
        </div>

        <div>

          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#967343]">
            Live accessibility update
          </p>

          <h2 className="mt-1 text-lg font-bold text-[#463820]">
            Your route has changed
          </h2>

          <p className="mt-1 text-sm leading-6 text-[#75654B]">
            Lift A is currently unavailable. We found another
            step-free route using Lift B.
          </p>

        </div>

      </div>

    </section>
  );
}

export default RouteWarning;