function Dashboard({ preferences, onJourney }) {
  const selectedPreferences = [];

  if (preferences && preferences.visualAlerts) {
    selectedPreferences.push("Visual alerts");
  }

  if (preferences && preferences.stepFreeNavigation) {
    selectedPreferences.push("Step-free route");
  }

  if (preferences && preferences.audioGuidance) {
    selectedPreferences.push("Audio guidance");
  }

  if (preferences && preferences.simpleGuidance) {
    selectedPreferences.push("Simple guidance");
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
                Entrance → Platform 3
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
                  Platform 3
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
                Platform 3 currently has an
                accessible route available.
              </p>

            </div>

          </div>


          {/* ASSISTANCE */}

          <button
            className="assistance-button"
            onClick={() =>
              alert(
                "Assistance request feature will be connected to the backend."
              )
            }
          >
            🆘 Request Assistance
          </button>

        </aside>

      </div>

    </main>
  );
}

export default Dashboard;