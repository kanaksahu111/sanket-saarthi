import { useState } from "react";
import { Building2 } from "lucide-react";
import { VENUE_TYPES, updateVenueTarget } from "../../services/venueService";

function PlatformControl({ selectedVenueId = "railway", onVenueChange }) {
  const currentVenue = VENUE_TYPES[selectedVenueId] || VENUE_TYPES.railway;
  const [selectedTarget, setSelectedTarget] = useState(currentVenue.targetValue);
  const [activeTarget, setActiveTarget] = useState(currentVenue.targetValue);

  const handleUpdate = async () => {
    setActiveTarget(selectedTarget);
    await updateVenueTarget(selectedVenueId, selectedTarget);
  };

  return (
    <section className="rounded-3xl border border-[#E0E4DD] dark:border-[#2A3F33] bg-white dark:bg-[#15231B] p-6 shadow-md transition-colors">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300">
            <Building2 size={22} />
          </div>

          <div>
            <h2 className="font-bold text-lg text-[#14251D] dark:text-white">
              Venue Operations Control
            </h2>
            <p className="text-xs text-[#65716A] dark:text-[#A0ABA4]">
              Manage target location & platform assignments
            </p>
          </div>
        </div>
      </div>

      {/* VENUE SELECTOR */}
      <div className="mb-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#52725F] dark:text-[#8EAA95]">
          Active Venue Type
        </label>
        <select
          value={selectedVenueId}
          onChange={(e) => {
            onVenueChange(e.target.value);
            const newVenue = VENUE_TYPES[e.target.value];
            if (newVenue) {
              setSelectedTarget(newVenue.targetValue);
              setActiveTarget(newVenue.targetValue);
            }
          }}
          className="mt-1.5 w-full rounded-2xl border border-[#D9DDD6] dark:border-[#2A3F33] bg-[#F7F7F2] dark:bg-[#1A2C22] p-3 text-sm font-bold text-[#14251D] dark:text-white focus:outline-none"
        >
          {Object.values(VENUE_TYPES).map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.targetLabel})
            </option>
          ))}
        </select>
      </div>

      {/* ACTIVE ASSIGNMENT BOX */}
      <div className="rounded-2xl bg-[#EDF3ED] dark:bg-[#1A2C22] p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-[#65716A] dark:text-[#A0ABA4]">
          Current Active {currentVenue.targetLabel}
        </p>
        <p className="mt-1 text-2xl font-extrabold text-[#14251D] dark:text-white">
          {activeTarget}
        </p>
      </div>

      {/* UPDATE ASSIGNMENT SELECTOR */}
      <div className="mt-5">
        <label htmlFor="target-select" className="block text-xs font-bold uppercase tracking-wider text-[#65716A] dark:text-[#A0ABA4]">
          Update {currentVenue.targetLabel} Assignment
        </label>
        <select
          id="target-select"
          value={selectedTarget}
          onChange={(e) => setSelectedTarget(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-[#D9DDD6] dark:border-[#2A3F33] bg-white dark:bg-[#15231B] p-3 text-sm font-semibold text-[#14251D] dark:text-white focus:outline-none"
        >
          {currentVenue.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={handleUpdate}
        className="mt-5 w-full rounded-2xl bg-[#14251D] dark:bg-[#52725F] px-5 py-3.5 font-bold text-white hover:bg-[#253D31] dark:hover:bg-[#3E5848] transition shadow-md cursor-pointer"
      >
        Update Venue Status
      </button>
    </section>
  );
}

export default PlatformControl;