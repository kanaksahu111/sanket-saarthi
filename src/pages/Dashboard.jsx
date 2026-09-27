import { useEffect, useRef } from "react";

import { useAssistanceRequests } from "../hooks/useAssistanceRequests";
import { useVenue } from "../hooks/useVenue";
import { useFacilities } from "../hooks/useFacilities";
import { triggerVibration } from "../utils/vibration";


function Dashboard({ preferences, onJourney }) {
  const { train, loading: trainLoading } = useVenue("train-001");
  const platform = train?.platform ?? "—";
  const { facilities, loading: facilitiesLoading } = useFacilities([
  "lift-a",
  "lift-b",
]);
const liftA = facilities.find((facility) => facility.id === "lift-a");
const liftB = facilities.find((facility) => facility.id === "lift-b");
const { requests, createRequest } = useAssistanceRequests();
const latestAssistanceRequest =
  requests.length > 0 ? requests[requests.length - 1] : null;
  const previousPlatform = useRef(null);
  const previousLiftStatus = useRef(null);
  const previousAssistanceStatus = useRef(null);
  useEffect(() => {
  if (!preferences?.sensorySupport) {
    return;
  }

  // Train platform update
  if (!trainLoading && train?.platform != null) {
    if (
      previousPlatform.current !== null &&
      previousPlatform.current !== train.platform
    ) {
      triggerVibration();
    }

    previousPlatform.current = train.platform;
  }

  // Lift status update
  if (!facilitiesLoading && liftA?.status) {
    if (
      previousLiftStatus.current !== null &&
      previousLiftStatus.current !== liftA.status
    ) {
      triggerVibration();
    }

    previousLiftStatus.current = liftA.status;
  }

  // Assistance status update
  if (latestAssistanceRequest?.status) {
    if (
      previousAssistanceStatus.current !== null &&
      previousAssistanceStatus.current !== latestAssistanceRequest.status
    ) {
      triggerVibration();
    }

    previousAssistanceStatus.current =
      latestAssistanceRequest.status;
  }
}, [
  preferences?.sensorySupport,
  train?.platform,
  trainLoading,
  liftA?.status,
  facilitiesLoading,
  latestAssistanceRequest?.status,
]);

  const selectedPreferences = [];

if (preferences?.sensorySupport) {
  selectedPreferences.push("Sensory Support");
}

if (preferences?.mobilitySupport) {
  selectedPreferences.push("Mobility Support");
}

  return (
    <main className="dashboard-page">

      {/* PAGE HEADER */}

      <div className="dashboard-heading">

        <div className="eyebrow">
          YOUR JOURNEY
        </div>

        <h1>
          Central
          <span> Railway Station</span>
        </h1>

        <p>
          Your accessible journey has been personalized
          according to your preferences.
        </p>

      </div>


      {/* MAIN CONTENT */}

      <div className="dashboard-grid">

        {/* ROUTE */}

        <section className="journey-card">

          <div className="journey-header">

            <div>

              <div className="card-label">
                ACCESSIBLE ROUTE
              </div>

              <h2>
                Entrance → Platform {platform}
              </h2>

            </div>

            <span className="live-badge">
              ● LIVE
            </span>

          </div>


          {/* ROUTE STEPS */}

          <div className="journey-route">

            <div className="journey-step active">

              <div className="journey-dot">
                1
              </div>

              <div className="journey-step-content">

                <strong>
                  Station Entrance
                </strong>

                <small>
                  Starting point
                </small>

              </div>

            </div>


            <div className="journey-line"></div>


            <div className="journey-step">

              <div className="journey-dot">
                2
              </div>

              <div className="journey-step-content">

                <strong>
                  Security Check
                </strong>

                <small>
                  Approximately 120 m
                </small>

              </div>

            </div>


            <div className="journey-line"></div>


            <div className="journey-step">

              <div className="journey-dot">
                3
              </div>

              <div className="journey-step-content">

                <strong>
                  Accessible Lift
                </strong>

                <small>
                  Step-free access
                </small>

              </div>

            </div>


            <div className="journey-line"></div>


            <div className="journey-step">

              <div className="journey-dot">
                4
              </div>

              <div className="journey-step-content">

                <strong>
                  Platform {platform}
                </strong>

                <small>
                  Destination
                </small>

              </div>

            </div>

          </div>


          {/* ACCESSIBILITY STATUS */}

          <div className="accessibility-tag">
            ♿ Step-free route available
          </div>


          {/* START JOURNEY */}

          <button
            className="continue-button"
            onClick={onJourney}
          >
            Start Guided Journey
            <span>→</span>
          </button>

        </section>


        {/* RIGHT SIDE */}

        <aside className="dashboard-side">


          {/* USER PREFERENCES */}

          <div className="info-card">

            <div className="card-label">
              YOUR ACCESSIBILITY
            </div>


            <div className="selected-preferences">

              {selectedPreferences.length > 0 ? (

                selectedPreferences.map((item) => (

                  <div
                    className="selected-item"
                    key={item}
                  >
                    <span>✓</span>
                    {item}
                  </div>

                ))

              ) : (

                <div className="selected-item">
                  <span>✓</span>
                  Standard guidance
                </div>

              )}

            </div>

          </div>


          {/* LIVE UPDATE */}

          <div className="live-update-card">

            <div className="update-icon">
              !
            </div>

            <div>

              <strong>
                Live update
              </strong>

              <p>
                {trainLoading
                ? "Checking the latest platform information..."
                : `Platform ${platform} currently has an accessible
                route available.`}
              </p>

            </div>

          </div>
          <div className="live-update-card">
            <div className="update-icon">
              ♿
              </div>
              <div>
                <strong>Lift status</strong>
                <p>
                  {facilitiesLoading
                  ? "Checking lift availability..."
                  : liftA?.status === "OUT_OF_SERVICE"
                  ? liftB?.status === "OUT_OF_SERVICE"
                  ? "Lift A and Lift B are currently unavailable."
                  : "Lift A is out of service. Use Lift B for step-free access."
                  : "Lift A is available for step-free access."}
                  </p>
                  </div>
                  </div>
         {latestAssistanceRequest && (
  <div className="live-update-card">
    <div className="update-icon">
      🆘
    </div>

    <div>
      <strong>Assistance request</strong>

      <p>
        Status: {latestAssistanceRequest.status}
      </p>
    </div>
   
  </div>


)}


          {/* ASSISTANCE */}

          <button
  className="assistance-button"
  onClick={async () => {
    try {
      await createRequest({
        type: "MOBILITY",
        location: "Entrance Gate 2",
        message: "Visitor needs mobility assistance.",
      });
    } catch (error) {
      console.error("Assistance request failed:", error);
    }
  }}
>
  {latestAssistanceRequest
    ? "✓ Assistance Requested"
    : "🆘 Request Assistance"}
</button>

        </aside>

      </div>

    </main>
  );
}

export default Dashboard;
