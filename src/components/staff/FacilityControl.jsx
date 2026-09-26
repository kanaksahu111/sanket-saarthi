import { useState } from "react";
import {
  Accessibility,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

function FacilityControl() {
  const [facilities, setFacilities] = useState([
    {
      id: "ramp-b",
      name: "Ramp B",
      status: "available",
      changeable: false,
    },
    {
      id: "lift-a",
      name: "Lift A",
      status: "available",
      changeable: true,
    },
    {
      id: "lift-b",
      name: "Lift B",
      status: "available",
      changeable: true,
    },
    {
      id: "corridor",
      name: "Accessible Corridor",
      status: "available",
      changeable: false,
    },
  ]);

  const toggleFacility = (id) => {
    setFacilities((current) =>
      current.map((facility) =>
        facility.id === id
          ? {
              ...facility,
              status:
                facility.status === "available"
                  ? "out_of_service"
                  : "available",
            }
          : facility
      )
    );
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
          <Accessibility size={22} />
        </div>

        <div>
          <h2 className="font-bold">Facility Status</h2>

          <p className="text-sm text-slate-500">
            Accessibility infrastructure
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {facilities.map((facility) => {
          const available =
            facility.status === "available";

          return (
            <div
              key={facility.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4"
            >
              <div>
                <p className="font-semibold">
                  {facility.name}
                </p>

                <div
                  className={`mt-1 flex items-center gap-1 text-sm font-medium ${
                    available
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {available ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <AlertTriangle size={16} />
                  )}

                  {available
                    ? "Available"
                    : "Out of Service"}
                </div>
              </div>

              {facility.changeable && (
                <button
                  type="button"
                  onClick={() =>
                    toggleFacility(facility.id)
                  }
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                >
                  {available
                    ? "Mark Unavailable"
                    : "Restore"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FacilityControl;