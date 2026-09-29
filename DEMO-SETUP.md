> Latest update: see [MOBILE-AND-MAPS.md](./MOBILE-AND-MAPS.md) for mobile access, the expanded station catalog, interactive maps, QR codes and revised request fields.

# Sanket Saarthi demo

The existing Firebase app/configuration is unchanged. Operational data continues to use `venues/central-station/trains/train-001` and `venues/central-station/facilities/*`. Bhopal Junction and Train 12345 Express are the presentation names for this sample venue/train. Existing station records are not automatically overwritten.

## One-time Firebase setup (before presenting)

1. Enable Firebase Authentication Email/Password and Anonymous providers in the existing project. Anonymous identity isolates each visitor's assistance requests; visitors do not see a sign-in form.
2. Create the demo staff Email/Password account. Using a trusted administrator environment, create `staff/<that user's UID>` with `enabled: true`. The web client cannot grant this role. Do not put staff passwords in source files or chat.
3. Review and merge `firestore.rules` with the project's deployed rules. This file has NOT been deployed by this task. It restricts staff writes and visitor request reads. If the project currently has open rules, UI sign-in alone does not secure Firestore. Do not overwrite unrelated production rules.
4. Open `/staff`, sign in, and choose **Demo setup and reset → Initialize missing records → Confirm Update**. This adds only missing facilities (Ramp B, Accessible Washroom, Assistance Desk, etc.) and leaves existing records intact.
5. Before the demonstration use **Reset demo → Confirm Update**. This deliberately sets Platform 3 and all five facilities Operational. Historical requests/activity are retained. No Firebase Console editing is needed during the demonstration.

Existing documents with legacy `AVAILABLE`, `OPEN`, or `OUT_OF_SERVICE` statuses are read correctly. Staff writes use `OPERATIONAL`, `UNAVAILABLE`, `MAINTENANCE`.

## Demonstration

Run `npm run dev`. Open the visitor and `/staff` in separate tabs. For true staff/visitor identity separation, use a separate browser profile or private window for the visitor.

1. Visitor opens `/checkpoint?station=BPL&location=gate-1` (legacy venue URLs also work), selects Mobility → Accessible Route Only and Deaf or Hard of Hearing, and enables Voice Assist. Continue to Catch a Train, keep sample 12345, check Platform 3 and Start Journey. From home, search/select BPL on the same screen as accessibility needs.
2. Staff changes platform to 5 and confirms. Visitor receives an alert and updated destination.
3. Staff marks Lift A Unavailable and confirms. Visitor's route switches to Corridor C and Lift B. If Ramp B or both lifts are unavailable, guidance pauses and offers assistance.
4. Visitor opens Simulate QR Scan, selects Lift B, and confirms. Request Mobility Assistance, meeting at Lift B.
5. Staff accepts the request. The owning visitor receives Assistance Confirmed. Staff then uses Mark On the Way and Mark Completed; the visitor receives each status update. For a combined request, select Mobility → Wheelchair + Human Assistance during setup, enter a meeting point and submit once on the purpose screen.
6. Visitor confirms arrival at Platform 5. The arrival screen offers feedback and boarding assistance.

Checkpoint URLs preserve the journey and selected preferences in session storage. A new browser session starts with support selection before guidance. Location is always a user-confirmed checkpoint, never GPS. Physical QR scanning is intentionally not included; ordinary QR codes can encode the displayed checkpoint URLs.

## Implementation notes

- Landing photo reconstructed from the user's reference using built-in imagegen; saved to `public/station-background.png`. Prompt: “Extract and reconstruct ONLY the realistic Indian railway station photographic background … remove browser chrome, website text, buttons, panels, cards, footer and cream overlay; preserve station architecture, accessible lift, platform roof, train, tactile paving and distant travelers; natural editorial photograph; no UI or overlays.”
- `JourneyScreens.jsx` and `pages/Dashboard.jsx` extend the former preferences/dashboard/four-step route into the requested flow; old fixed route markup was replaced because it could not represent checkpoints or rerouting. Existing Firebase services remain the integration point.
- The shared speech service serializes both chatbot speech and journey speech. No AI backend, camera scanning, mapping, or routing dependency was added. Existing GSAP preview and light/dark mode remain.
- The project uses its existing CSS system; Tailwind was not installed solely to rewrite styling. English and Hindi visitor interfaces are supported through `src/i18n/messages.js`. Speech requests en-IN/hi-IN and depends on installed browser voices. Staff operations remain English.
- Feedback is explicitly session-only. Assistance and activity logs persist to Firestore.
- Full build: `npm run build`; lint: `npm run lint`; regression tests: `node --test tests/*.test.mjs`.
- Firebase reference: https://firebase.google.com/docs/firestore/manage-data/transactions

Actual staff writes and the complete two-account demonstration require the one-time Auth/rules setup above. Microphone, speech output, and vibration must also be checked on the presentation device. The browser Vibration API is optional and never the only alert channel.

## Firebase Console setup details

In the existing project, open Build → Authentication → Sign-in method and enable Email/Password and Anonymous. Under Users, add your staff account and copy its UID. In Firestore Database → Data, create collection `staff`, document ID equal to that UID, and a Boolean field `enabled` set to `true`. In Firestore → Rules, merge the supplied rules with existing unrelated rules, then Publish. Keep your existing Firebase web configuration unchanged.

Deploy the updated request rules too: requests now contain destination, wheelchair/human flags, support, journey ID and checkpoint ID. Staff status updates use PENDING → ACCEPTED → ON_THE_WAY → COMPLETED. Old rules may reject these fields or transitions. A client cannot create its own staff role. Never put service-account keys or staff passwords in Vite environment variables.

## Train service and station scope

The catalog contains 39 verified station entries across 12 city groups; see `STATION-SOURCES.md`. Search has no artificial per-city result cap. Only BPL has configured sample indoor routes. Other stations explicitly report unavailable guidance.

`src/services/trainService.js` supplies sample 12345 and exposes getTrain/getTrainSchedule/getTrainStatus. Optional `VITE_TRAIN_API_BASE=/api/trains` expects a same-origin backend endpoint `/api/trains/12345` returning number, name and stationCodes, with optional schedule/status. Implement that backend separately and keep provider credentials there. No external rail API is connected. Only the configured sample train can start the indoor journey; platform and facility changes come from this project's Firestore, not an official rail feed. Failed API lookup falls back only for the known sample number.
