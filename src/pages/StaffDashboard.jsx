import PlatformControl from "../components/staff/PlatformControl";
import FacilityControl from "../components/staff/FacilityControl";
import AssistanceCard from "../components/staff/AssistanceCard";

function StaffDashboard() {

  return (
    <div className="min-h-screen bg-[#F7F7F2] text-[#14251D]">

      <header className="border-b border-[#E0E4DD]">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14251D] font-bold text-white">
              स
            </div>

            <div>
              <p className="font-bold">
                Sanket Saarthi
              </p>

              <p className="text-xs text-[#78817C]">
                Staff Portal
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#DCE4DC] bg-white px-4 py-2 text-sm font-semibold text-[#52725F]">
            <span className="h-2 w-2 rounded-full bg-[#648A73]" />
            Live
          </div>

        </div>

      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">

        <div className="mb-10">

          <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#648A73]">
            Station operations
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Central Railway Station
          </h1>

          <p className="mt-3 max-w-2xl text-[#737D77]">
            Manage accessibility information, facility status
            and visitor assistance from one place.
          </p>

        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          <PlatformControl />

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