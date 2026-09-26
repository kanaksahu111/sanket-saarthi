import { useState } from "react";
import { Accessibility, CheckCircle2, AlertTriangle } from "lucide-react";
import { updateFacilityStatus } from "../../services/facilityService";

function FacilityControl() {
  const [facilities, setFacilities] = useState([
    { id: "lift-a", name: "Primary Elevator A", status: "available" },
    { id: "lift-b", name: "Secondary Elevator B", status: "available" },
    { id: "ramp-b", name: "Accessibility Entrance Ramp", status: "available" },
    { id: "escalator-1", name: "Escalator 1", status: "available" },
    { id: "tactile-bacon", name: "Audio Beacon system", status: "available" },
  ]);

  const toggleFacility = (id) => {
    setFacilities((current) =>
      current.map((facility) => {
        if (facility.id === id) {
          const newStatus = facility.status === "available" ? "out_of_service" : "available";
          updateFacilityStatus(id, newStatus);
          return { ...facility, status: newStatus };
        }
        return facility;
      })
    );
  };

  return (
    <section className="rounded-3xl border border-[#E0E4DD] dark:border-[#2A3F33] bg-white dark:bg-[#15231B] p-6 shadow-md transition-colors">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
          <Accessibility size={22} />
        </div>

        <div>
          <h2 className="font-bold text-lg text-[#14251D] dark:text-white">
            Facility Infrastructure
          </h2>
          <p className="text-xs text-[#65716A] dark:text-[#A0ABA4]">
            Manage live accessibility status
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {facilities.map((facility) => {
          const available = facility.status === "available";

          return (
            <div
              key={facility.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-[#E0E4DD] dark:border-[#2A3F33] p-4 transition"
            >
              <div>
                <p className="font-bold text-sm text-[#14251D] dark:text-white">
                  {facility.name}
                </p>

                <div
                  className={`mt-1 flex items-center gap-1.5 text-xs font-semibold ${
                    available
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-red-700 dark:text-red-400"
                  }`}
                >
                  {available ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    <AlertTriangle size={15} />
                  )}

                  <span>{available ? "Operational" : "Out of Service"}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleFacility(facility.id)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold border transition cursor-pointer ${
                  available
                    ? "border-red-300 text-red-700 bg-red-50 hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
                    : "border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                }`}
              >
                {available ? "Mark Out-of-Service" : "Restore Facility"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FacilityControl;