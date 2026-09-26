import { useState } from "react";
import { MapPin, Users } from "lucide-react";

function AssistanceCard() {
  const [status, setStatus] = useState("pending");

  const formatStatus = (value) => {
    return value.replace("_", " ");
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
          <Users size={22} />
        </div>

        <div>
          <h2 className="font-bold">
            Assistance Requests
          </h2>

          <p className="text-sm text-slate-500">
            Visitor support requests
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 p-5">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase text-orange-700">
              {formatStatus(status)}
            </span>

            <h3 className="mt-3 text-lg font-bold">
              Mobility Assistance
            </h3>

            <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
              <MapPin size={16} />
              Entrance Gate 2
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Request ID: REQ-001
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStatus("accepted")}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Accept
            </button>

            <button
              type="button"
              onClick={() => setStatus("in_progress")}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              In Progress
            </button>

            <button
              type="button"
              onClick={() => setStatus("completed")}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Complete
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AssistanceCard;