import { useState } from "react";
import PlatformControl from "../components/staff/PlatformControl";
import FacilityControl from "../components/staff/FacilityControl";
import AssistanceCard from "../components/staff/AssistanceCard";
import { getVenueData } from "../services/venueService";
import { INDIAN_CITIES } from "../services/cityDataService";
import { MapPin } from "lucide-react";

function StaffDashboard({ selectedCityId = "mumbai", onCityChange }) {
  const [selectedPlaceId, setSelectedPlaceId] = useState("railway");
  const venue = getVenueData(selectedCityId, selectedPlaceId);
  const cityName = INDIAN_CITIES.find(c => c.id === selectedCityId)?.name || "Mumbai";

  return (
    <div className="min-h-screen bg-[#F7F7F2] dark:bg-[#0F1A15] text-[#14251D] dark:text-[#EAEFEA] transition-colors">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center border-b border-[#E0E4DD] dark:border-[#2A3F33] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#52725F] dark:text-[#8EAA95]">
              <MapPin size={14} />
              <span>{cityName.toUpperCase()}, INDIA • STAFF OPERATIONS PORTAL</span>
            </div>

            <h1 className="mt-2 text-4xl font-extrabold text-[#14251D] dark:text-white">
              {venue.name}
            </h1>

            <p className="mt-2 text-sm text-[#65716A] dark:text-[#A0ABA4]">
              Manage live platform assignments, facility availability, and incoming visitor requests.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* CITY SWITCHER FOR STAFF */}
            <div className="flex items-center gap-1.5 rounded-full border border-[#D9DDD6] dark:border-[#2A3F33] bg-white dark:bg-[#15231B] px-3.5 py-2 text-xs font-bold text-[#14251D] dark:text-white shadow-xs">
              <MapPin size={14} className="text-[#52725F]" />
              <select
                value={selectedCityId}
                onChange={(e) => onCityChange && onCityChange(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer font-bold"
              >
                {INDIAN_CITIES.map((c) => (
                  <option key={c.id} value={c.id} className="dark:bg-[#15231B]">
                    {c.name}, India
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-[#D9DDD6] dark:border-[#2A3F33] bg-white dark:bg-[#15231B] px-4 py-2 text-xs font-bold text-[#52725F] dark:text-[#8EAA95]">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Control Active</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <PlatformControl
            selectedVenueId={selectedPlaceId}
            onVenueChange={(id) => setSelectedPlaceId(id)}
          />

          <FacilityControl />

          <div className="lg:col-span-2">
            <AssistanceCard />
          </div>
        </div>
      </main>
    </div>
  );
}

export default StaffDashboard;