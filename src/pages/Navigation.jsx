import { useState } from "react";
import { ArrowLeft, Train, Accessibility } from "lucide-react";

import RouteCard from "../components/navigation/RouteCard";
import RouteWarning from "../components/navigation/RouteWarning";

function Navigation() {
  const [liftAStatus, setLiftAStatus] = useState("available");

  const normalRoute = [
    {
      id: 1,
      name: "Entrance",
      description: "Main station entrance",
      type: "entrance",
    },
    {
      id: 2,
      name: "Ramp B",
      description: "Continue through the accessible ramp",
      type: "ramp",
    },
    {
      id: 3,
      name: "Lift A",
      description: "Take the lift to platform level",
      type: "lift",
    },
    {
      id: 4,
      name: "Accessible Corridor",
      description: "Follow the accessible corridor",
      type: "corridor",
    },
    {
      id: 5,
      name: "Platform 5",
      description: "You have reached your destination",
      type: "platform",
    },
  ];

  const alternativeRoute = [
    {
      id: 1,
      name: "Entrance",
      description: "Main station entrance",
      type: "entrance",
    },
    {
      id: 2,
      name: "Ramp B",
      description: "Continue through the accessible ramp",
      type: "ramp",
    },
    {
      id: 3,
      name: "Corridor C",
      description: "Continue through Corridor C",
      type: "corridor",
    },
    {
      id: 4,
      name: "Lift B",
      description: "Use Lift B instead of Lift A",
      type: "lift",
    },
    {
      id: 5,
      name: "Platform 5",
      description: "You have reached your destination",
      type: "platform",
    },
  ];

  const liftUnavailable = liftAStatus === "out_of_service";

  const currentRoute = liftUnavailable
    ? alternativeRoute
    : normalRoute;

  return (
    <div className="min-h-screen bg-[#F7F7F2] text-[#14251D]">

      {/* NAVBAR */}
      <header className="border-b border-[#E3E6DF] bg-[#F7F7F2]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14251D] font-bold text-white">
              स
            </div>

            <span className="text-lg font-bold">
              Sanket Saarthi
            </span>
          </div>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 rounded-full border border-[#D9DDD6] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[#EEF2EC]"
          >
            <ArrowLeft size={16} />
            Back
          </button>

        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">

        {/* PAGE INTRO */}
        <div className="mb-10">

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#5E806D]">
            Step-free guidance
          </p>

          <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
            Your accessible route
            <span className="text-[#648A73]"> to Platform 5.</span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-[#69736D]">
            Follow a route designed around your accessibility
            preferences. We will update your guidance if a
            facility becomes unavailable.
          </p>

        </div>

        {/* DESTINATION CARD */}
        <section className="mb-6 flex flex-col justify-between gap-5 rounded-[28px] border border-[#E0E4DD] bg-white p-6 shadow-[0_10px_35px_rgba(20,37,29,0.05)] sm:flex-row sm:items-center">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF0EA] text-[#52725F]">
              <Train size={25} />
            </div>

            <div>
              <p className="text-sm text-[#7A847E]">
                Central Railway Station
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Platform 5
              </h2>
            </div>

          </div>

          <div className="flex items-center gap-2 rounded-full bg-[#EDF3ED] px-4 py-2 text-sm font-semibold text-[#52725F]">
            <Accessibility size={17} />
            Step-free route
          </div>

        </section>

        {/* WARNING */}
        {liftUnavailable && <RouteWarning />}

        {/* ROUTE */}
        <RouteCard
          route={currentRoute}
          alternative={liftUnavailable}
        />

        {/* TEMPORARY TEST */}
        <section className="mt-6 rounded-[3xl] border border-dashed border-[#CCD3CC] bg-[#F1F3EE] p-5">

          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#718078]">
            Demo simulation
          </p>

          <p className="mt-2 text-sm leading-6 text-[#68736D]">
            Simulate a facility update to demonstrate how Sanket
            Saarthi automatically adapts the accessible route.
          </p>

          <button
            type="button"
            onClick={() =>
              setLiftAStatus(
                liftUnavailable
                  ? "available"
                  : "out_of_service"
              )
            }
            className="mt-4 rounded-xl bg-[#14251D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#253D31]"
          >
            {liftUnavailable
              ? "Restore Lift A"
              : "Simulate Lift A Unavailable"}
          </button>

        </section>

      </main>
    </div>
  );
}

export default Navigation;