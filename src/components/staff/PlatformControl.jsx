import { useState } from "react";
import { Train } from "lucide-react";

function PlatformControl() {
  const [platform, setPlatform] = useState("3");
  const [selectedPlatform, setSelectedPlatform] =
    useState("3");

  const handleUpdate = () => {
    setPlatform(selectedPlatform);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <Train size={22} />
        </div>

        <div>
          <h2 className="font-bold">Platform Control</h2>

          <p className="text-sm text-slate-500">
            Train 12345 Express
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-slate-50 p-4">
        <p className="text-sm text-slate-500">
          Current Platform
        </p>

        <p className="mt-1 text-4xl font-bold">
          {platform}
        </p>
      </div>

      <label
        htmlFor="platform"
        className="mt-5 block text-sm font-semibold"
      >
        Change platform
      </label>

      <select
        id="platform"
        value={selectedPlatform}
        onChange={(e) => setSelectedPlatform(e.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3"
      >
        <option value="3">Platform 3</option>
        <option value="4">Platform 4</option>
        <option value="5">Platform 5</option>
      </select>

      <button
        type="button"
        onClick={handleUpdate}
        className="mt-4 w-full rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
      >
        Update Platform
      </button>
    </section>
  );
}

export default PlatformControl; 