import { useState, useEffect } from "react";
import { MapPin, Users, CheckCircle2 } from "lucide-react";
import { subscribeToAssistanceRequests, updateAssistanceStatus } from "../../services/assistanceService";

function AssistanceCard() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const unsub = subscribeToAssistanceRequests((data) => {
      if (data) setRequests(data);
    });
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  const handleStatus = async (id, status) => {
    await updateAssistanceStatus(id, status);
  };

  return (
    <section className="rounded-3xl border border-[#E0E4DD] dark:border-[#2A3F33] bg-white dark:bg-[#15231B] p-6 shadow-md transition-colors">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
            <Users size={22} />
          </div>

          <div>
            <h2 className="font-bold text-lg text-[#14251D] dark:text-white">
              Live Assistance Requests
            </h2>
            <p className="text-xs text-[#65716A] dark:text-[#A0ABA4]">
              Incoming visitor support tickets
            </p>
          </div>
        </div>

        <span className="rounded-full bg-amber-100 dark:bg-amber-950 px-3 py-1 text-xs font-bold text-amber-800 dark:text-amber-300">
          {requests.length} Requests
        </span>
      </div>

      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="rounded-2xl border border-[#E0E4DD] dark:border-[#2A3F33] p-5 transition"
          >
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                    req.status === "PENDING"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      : req.status === "IN_PROGRESS"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  }`}
                >
                  {req.status}
                </span>

                <h3 className="mt-3 text-lg font-bold text-[#14251D] dark:text-white">
                  {req.type || "Mobility Assistance"}
                </h3>

                <div className="mt-1 flex items-center gap-2 text-xs text-[#65716A] dark:text-[#A0ABA4]">
                  <MapPin size={15} />
                  <span>{req.location || "Station Gate Entrance"}</span>
                  <span>• {req.user || "Visitor"}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleStatus(req.id, "IN_PROGRESS")}
                  className="rounded-xl bg-[#14251D] dark:bg-[#52725F] px-4 py-2 text-xs font-bold text-white hover:bg-[#253D31] transition shadow-xs cursor-pointer"
                >
                  Accept & Assign
                </button>

                <button
                  type="button"
                  onClick={() => handleStatus(req.id, "COMPLETED")}
                  className="flex items-center gap-1.5 rounded-xl border border-[#D9DDD6] dark:border-[#2A3F33] px-4 py-2 text-xs font-bold text-[#14251D] dark:text-white hover:bg-[#EEF2EC] dark:hover:bg-[#2A3F33] transition cursor-pointer"
                >
                  <CheckCircle2 size={15} />
                  <span>Resolve</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AssistanceCard;