> Latest update: see [MOBILE-AND-MAPS.md](./MOBILE-AND-MAPS.md) for mobile access, the expanded station catalog, interactive maps, QR codes and revised request fields.

# Sanket Saarthi implementation report

## 1. Visitor flow
Landing → Station and accessibility needs → Purpose/details with compact summary → Live guidance → Arrival. New checkpoint visits skip station search but retain needs selection. Existing journeys resume at the checkpoint. Train, exit, facility and assistance purposes share the flow.

## 2. Modified files
src/App.jsx, main.jsx, pages/Dashboard.jsx, services/assistanceService.js, facilityService.js, venueService.js, hooks/useAssistanceRequests.js, useFacilities.js, useVenue.js, utils/vibration.js, index.html, public/favicon.svg and package manifests. Existing uncommitted work was extended.

## 3. New files
src/JourneyScreens.jsx; components/StationSearch.jsx, AccessibilityNeeds.jsx, AssistancePanel.jsx, Assistant.jsx, Landing.jsx, Showcase.jsx; pages/StaffDashboard.jsx; data/stations.js, support.js, guidance.js, journey.js; i18n/context.js, LanguageProvider.jsx, messages.js; services/trainService.js, speechService.js, authService.js, operationsService.js; hooks/useLiveJourney.js; Flow.css, Journey.css, Refined.css; firestore.rules; tests and documentation. Earlier reference-derived background: public/station-background.png.

## 4. Reused components
Existing React/Vite, CSS theme, Firebase singleton/config, venue/facility hooks and services remain. GSAP preview, dark mode and assistant extended. One shared speech system. No new AI, QR scanner, maps or routing dependency.

## 5. Firebase changes
Preserved venues/central-station/trains/train-001 and venues/central-station/facilities/*. Activity logs live under that venue. staff/<uid>.enabled authorizes staff. assistanceRequests adds destination, checkpoint ID, wheelchair/human flags, support and journey ID; status/timestamps support the full lifecycle. Owner reads/staff writes are restricted by supplied rules. Rules are NOT deployed. Credentials/configuration unchanged. See DEMO-SETUP.md.

## 6. Stations
39 verified entries across Bhopal, Indore, Delhi, Mumbai, Kolkata, Bengaluru, Chennai, Hyderabad, Pune, Jaipur, Lucknow and Patna. Sources in STATION-SOURCES.md. Search name/code/city/Hindi without a per-city cap. Expandable catalog, not exhaustive. Only BPL has configured sample indoor routes; others report unavailable guidance.

## 7. Languages
English/Hindi visitor flow: choices, summaries, instructions, alerts, assistance lifecycle, checkpoints, facility labels and assistant replies use centralized translations. Staff console remains English. User-entered text and external provider names are not automatically translated.

## 8. Voice
Landing toggle, Read Instruction and Stop Voice. Vision enables voice with manual override. Enabled instructions and alerts use en-IN/hi-IN through one channel. New speech cancels prior output; page changes and Stop cancel it. Browser voices determine availability. Assistant microphone uses optional browser recognition with typed fallback.

## 9. Vibration
Enabled support triggers vibration on operational and assistance-status updates. Text always accompanies updates; unsupported/rejected vibration fails silently. Physical hardware verification remains necessary.

## 10. Mobility
Inline route-only, wheelchair, human and combined options. Route-only creates no request. Multiple accessibility needs stay selected together and change output through one journey engine.

## 11. Wheelchair workflow
Meeting point and destination included. Combined wheelchair + human assistance creates one request. Waiting → Accepted → On the Way → Completed, controlled by staff. Demo coordination, not official railway reservation.

## 12. Human workflow
Meeting point defaults to current checkpoint; short assistance-purpose selector. Status notifications remain visible and optionally spoken/vibrated. Arrival offers boarding assistance.

## 13. QR
/checkpoint?station=BPL&location=gate-1 and other known IDs; legacy venue=bhopal-junction supported. Session state preserves preferences and progress. Simulate QR Scan supports laptops. No camera scanner or physical QR generator added. Off-route checkpoints prompt reconfirmation/help; unavailable routes pause progression.

## 14. Train service
getTrain/getTrainSchedule/getTrainStatus behind trainService. Optional same-origin backend adapter; provider credentials belong on that backend. No real rail API connected by default. API errors fall back only for known sample 12345; unknown trains are not fabricated. Indoor guidance is restricted to the configured sample train.

## 15. Live train information
Firestore platform/status and facility changes are staff-maintained operational data, not an official railway feed. Listener updates drive visitor alerts and predefined rerouting.

## 16. Sample information
12345 train identity, route geometry and distances are predefined samples. No live timetable or ETA claimed. Sample labeling remains where needed to avoid misleading visitors.

## 17. Staff Dashboard
/staff includes sign-in/role checks, train platform control, five facility statuses, assistance lifecycle and recent activity. Important changes require confirmation. Initialize missing records preserves existing documents; explicit reset restores Platform 3 and operational facilities. Requests show meeting point, destination and assistance type.

## 18. Validation
npm run build: PASS. npm run lint: PASS. node --test tests/*.test.mjs: 16 PASS. Tests cover routes/reroutes/blocking, checkpoints, search, preferences, lifecycle, Hindi instructions, train fallback and mocked speech/vibration. Browser verified keyboard city/station search, eight Mumbai results, BPL selection, mobility expansion, multiple needs, Hindi summary/live guidance, checkpoint URL, live Platform 3 read and staff rendering. No errors captured in checked consoles.

## 19. Remaining limitations
Authenticated staff writes and complete two-account lifecycle remain unverified pending user Auth/rules setup. Rules not emulator-tested or deployed. Ramp B, Accessible Washroom and Assistance Desk are missing at expected live paths: initialize through authorized staff controls before demo. Physical microphone/speech/vibration need presentation-device verification. No indoor GPS/pathfinding. Feedback is session-only. No commit/push. Follow DEMO-SETUP.md for setup and complete live test.
