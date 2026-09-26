import { useState } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";

function App() {
  const [screen, setScreen] = useState("home");

  const [preferences, setPreferences] = useState({
    visualAlerts: false,
    stepFreeNavigation: false,
    audioGuidance: false,
    simpleGuidance: false,
  });

  const places = [
    {
      id: "railway",
      icon: "🚆",
      title: "Railway Station",
      description:
        "Find platforms, entrances, facilities and accessible routes.",
    },
    {
      id: "hospital",
      icon: "🏥",
      title: "Hospital",
      description:
        "Find departments, registration, entrances and assistance.",
    },
    {
      id: "tourist",
      icon: "🏛️",
      title: "Tourist Site",
      description:
        "Explore attractions, routes, facilities and visitor support.",
    },
    {
      id: "office",
      icon: "🏢",
      title: "Public Office",
      description:
        "Find the right counter, department and service.",
    },
  ];

  /* =========================
     DASHBOARD
  ========================= */

  if (screen === "dashboard") {
    return (
      <div className="app">

        <header className="navbar">

          <div className="logo">
            <span className="logo-mark">स</span>
            <span>Sanket Saarthi</span>
          </div>

          <button
            className="back-button"
            onClick={() => setScreen("preferences")}
          >
            ← Back
          </button>

        </header>

        <Dashboard
          preferences={preferences}
          onJourney={() => setScreen("journey")}
        />

      </div>
    );
  }


  /* =========================
     GUIDED JOURNEY
  ========================= */

  if (screen === "journey") {
    return (
      <div className="app">

        <header className="navbar">

          <div className="logo">
            <span className="logo-mark">स</span>
            <span>Sanket Saarthi</span>
          </div>

          <button
            className="back-button"
            onClick={() => setScreen("dashboard")}
          >
            ← Back
          </button>

        </header>

        <main className="journey-page">

          <div className="eyebrow">
            GUIDED JOURNEY
          </div>

          <h1>
            Follow your
            <span> accessible route.</span>
          </h1>

          <p className="journey-description">
            Central Railway Station → Platform 3
          </p>


          <div className="guided-route">

            <div className="guided-step active">

              <div className="guided-number">
                1
              </div>

              <div>
                <strong>
                  Station Entrance
                </strong>

                <small>
                  You are here
                </small>
              </div>

            </div>


            <div className="guided-line"></div>


            <div className="guided-step">

              <div className="guided-number">
                2
              </div>

              <div>
                <strong>
                  Security Check
                </strong>

                <small>
                  120 m ahead
                </small>
              </div>

            </div>


            <div className="guided-line"></div>


            <div className="guided-step">

              <div className="guided-number">
                3
              </div>

              <div>
                <strong>
                  Accessible Lift
                </strong>

                <small>
                  Step-free access
                </small>
              </div>

            </div>


            <div className="guided-line"></div>


            <div className="guided-step">

              <div className="guided-number">
                4
              </div>

              <div>
                <strong>
                  Platform 3
                </strong>

                <small>
                  Destination
                </small>
              </div>

            </div>

          </div>


          <div className="journey-actions">

            <button
              className="continue-button"
              onClick={() =>
                alert("You have reached the next checkpoint.")
              }
            >
              I've Reached This Point
              <span>→</span>
            </button>

            <button
              className="assistance-button"
              onClick={() =>
                alert(
                  "Assistance request feature will be connected to the backend."
                )
              }
            >
              🆘 Need Assistance
            </button>

          </div>

        </main>

      </div>
    );
  }


  /* =========================
     ACCESSIBILITY PREFERENCES
  ========================= */

  if (screen === "preferences") {

    const options = [
      {
        id: "visualAlerts",
        icon: "👁",
        title: "Visual guidance",
        description:
          "Clear visual alerts and important updates.",
      },
      {
        id: "stepFreeNavigation",
        icon: "♿",
        title: "Step-free route",
        description:
          "Avoid stairs and use accessible paths where possible.",
      },
      {
        id: "audioGuidance",
        icon: "🔊",
        title: "Audio guidance",
        description:
          "Receive spoken directions during your journey.",
      },
      {
        id: "simpleGuidance",
        icon: "✋",
        title: "Simple guidance",
        description:
          "Short and easy-to-follow instructions.",
      },
    ];

    return (
      <div className="app">

        <header className="navbar">

          <div className="logo">
            <span className="logo-mark">स</span>
            <span>Sanket Saarthi</span>
          </div>

          <button
            className="back-button"
            onClick={() => setScreen("places")}
          >
            ← Back
          </button>

        </header>


        <main className="preferences-page">

          <div className="preferences-heading">

            <div className="eyebrow">
              STEP 02
            </div>

            <h1>
              How would you like
              <span> us to guide you?</span>
            </h1>

            <p>
              Select the types of guidance that would make
              your journey easier. You can choose more than one.
            </p>

          </div>


          <div className="preferences-grid">

            {options.map((option) => {

              const selected =
                preferences[option.id];

              return (
                <button
                  key={option.id}
                  className={`preference-card ${
                    selected ? "selected" : ""
                  }`}
                  onClick={() => {

                    setPreferences((previous) => ({
                      ...previous,
                      [option.id]:
                        !previous[option.id],
                    }));

                  }}
                >

                  <div className="preference-icon">
                    {option.icon}
                  </div>

                  <div className="preference-content">

                    <h2>
                      {option.title}
                    </h2>

                    <p>
                      {option.description}
                    </p>

                  </div>

                  <div className="preference-check">
                    {selected ? "✓" : ""}
                  </div>

                </button>
              );

            })}

          </div>


          <button
            className="continue-button"
            onClick={() => setScreen("dashboard")}
          >
            Continue
            <span>→</span>
          </button>

        </main>

      </div>
    );
  }


  /* =========================
     PLACE SELECTION
  ========================= */

  if (screen === "places") {

    return (
      <div className="app">

        <header className="navbar">

          <div className="logo">
            <span className="logo-mark">स</span>
            <span>Sanket Saarthi</span>
          </div>

          <button
            className="back-button"
            onClick={() => setScreen("home")}
          >
            ← Back
          </button>

        </header>


        <main className="places-page">

          <div className="places-heading">

            <div className="eyebrow">
              STEP 01
            </div>

            <h1>
              Where are
              <span> you going?</span>
            </h1>

            <p>
              Choose the type of place you are visiting.
              Sanket Saarthi will personalize the guidance
              for you.
            </p>

          </div>


          <div className="places-grid">

            {places.map((place) => (

              <button
                className="place-card"
                key={place.id}
                onClick={() => {

                  if (place.id === "railway") {
                    setScreen("preferences");
                  }

                }}
              >

                <div className="place-icon">
                  {place.icon}
                </div>

                <div className="place-content">

                  <h2>
                    {place.title}
                  </h2>

                  <p>
                    {place.description}
                  </p>

                </div>

                <span className="place-arrow">
                  →
                </span>

              </button>

            ))}

          </div>

        </main>

      </div>
    );
  }


  /* =========================
     HOME
  ========================= */

  return (
    <div className="app">

      <header className="navbar">

        <div className="logo">

          <span className="logo-mark">
            स
          </span>

          <span>
            Sanket Saarthi
          </span>

        </div>

        <button className="help-button">
          How it works
        </button>

      </header>


      <main className="hero">

        <div className="hero-content">

          <div className="eyebrow">
            GUIDANCE THAT UNDERSTANDS YOU
          </div>

          <h1>
            Your guide through
            <span> public spaces.</span>
          </h1>

          <p className="hero-description">
            Sanket Saarthi helps you navigate public places
            with accessible guidance, useful information,
            and assistance tailored to the way you need to
            experience a place.
          </p>

          <button
            className="start-button"
            onClick={() => setScreen("places")}
          >
            Start Your Journey
            <span>→</span>
          </button>


          <div className="trust-row">

            <div className="trust-item">
              <span>✓</span>
              Accessible by design
            </div>

            <div className="trust-item">
              <span>✓</span>
              Personalized guidance
            </div>

            <div className="trust-item">
              <span>✓</span>
              Human assistance
            </div>

          </div>

        </div>


        <div className="hero-visual">

          <div className="visual-card main-card">

            <div className="card-top">
              <span className="status-dot"></span>
              Your journey
            </div>

            <div className="station-name">
              Central Railway Station
            </div>

            <div className="route-preview">

              <div className="route-point active">
                <span></span>
                Entrance
              </div>

              <div className="route-line"></div>

              <div className="route-point">
                <span></span>
                Platform 3
              </div>

            </div>

            <div className="accessibility-tag">
              ♿ Step-free route available
            </div>

          </div>


          <div className="floating-card update-card">

            <span className="update-icon">
              !
            </span>

            <div>

              <strong>
                Live update
              </strong>

              <small>
                Platform 3 is accessible
              </small>

            </div>

          </div>


          <div className="floating-card assistance-card">

            <span className="assistance-icon">
              +
            </span>

            <div>

              <strong>
                Need help?
              </strong>

              <small>
                Request assistance
              </small>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default App;