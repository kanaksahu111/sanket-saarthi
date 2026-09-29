# Small UI polish

Changed files: src/Polish.css, src/App.jsx, src/components/StatusIcon.jsx, src/components/AccessibilityNeeds.jsx, src/components/AssistancePanel.jsx, src/pages/Dashboard.jsx, src/pages/StaffDashboard.jsx, src/i18n/messages.js.

- Cream #F7F6F0, deep green #173F32, neutral text #18231D. Pale amber for changes, muted red for unavailable facilities, blue for pending assistance, soft green for confirmed support.
- Stronger next instruction, compact selected support rows, quieter secondary buttons, clearer search field and staff sections. Map disclosure moved below journey controls.
- Minimal inline SVG status icons; no dependencies added.
- Copy: “What would make your journey easier?”, “Choose one or more options.”, “What would help?” with Hindi translations.
- No business logic, Firebase, API, route, QR, speech, vibration or assistance lifecycle changes. Previously removed support categories remain removed.

Checked: desktop setup, confirmation and live journey; English/Hindi support selection; 320/390px setup with no horizontal overflow; mobile read-only staff preview; browser console clean on desktop journey. Build passed. Live operational alert changes and assistance acceptance require authorized staff and were not replayed in this styling pass. Missing facility records still correctly block an unconfirmed accessible route.
