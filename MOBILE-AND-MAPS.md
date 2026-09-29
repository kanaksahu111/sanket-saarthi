# Mobile, maps and physical QR setup

## Run on your phone

1. On the computer, run `npm run dev:mobile`. Keep it running.
2. Connect the phone and computer to the same Wi-Fi.
3. Vite prints a Network URL, such as `http://192.168.1.10:5173`. Open the actual printed URL on your phone. The port may differ if another server is running.
4. If Windows asks about network access, allow Node on your trusted private network. Do not disable the firewall. Guest/public Wi-Fi may block device-to-device access.
5. Open `/station-qr` using that Network URL, or enter the Network URL in the QR page's Application URL field and press Update QR codes. Scan a code using the phone camera and open it in the same browser used for the journey.

Never use localhost/127.0.0.1 QR links from another device: they refer to the phone itself. The page warns about this.

For the full phone demo, use an HTTPS deployment. Browser geolocation and microphone features generally require HTTPS; LAN HTTP is useful for layout, QR and Firebase checks. Vibration and installed speech voices vary by device/browser. A computer's journey is not automatically transferred to a phone; the phone starts its own journey and anonymous identity.

## Deployment

Build command: `npm run build`. Output: `dist`. Existing Firebase configuration remains unchanged. `vercel.json` rewrites `/checkpoint`, `/staff`, and `/station-qr` to the app so scanned links work on direct entry. Add the deployed domain to Firebase Authentication's authorized domains when necessary. Deploy reviewed Firestore rules before assistance testing.

No new API key is needed for maps, station search or QR codes. Optional `VITE_PUBLIC_APP_URL=https://your-actual-domain` sets the QR base at build time; otherwise the current page origin is used. QR base URLs assume this app is hosted at the domain root. `VITE_TRAIN_API_BASE` remains the optional existing same-origin backend adapter; no rail provider credentials belong in Vite variables. No deployment was performed by this task.

## What changed

1. Flow: landing → station search/QR and accessibility → BPL purpose/summary → indoor demo journey. Other stations open a standard location/train lookup/general assistance view. Support selection, dark mode, speech and Hindi remain available.
2. Map library: Leaflet 1.9.4; no React wrapper required.
3. Map tiles: OpenStreetMap standard tiles, with visible attribution, normal browser caching and no offline prefetch. Internet required; failures show text and leave guidance available.
4. Station source: DataMeet railways CC0 snapshot plus the existing Indian Railways-sourced names/codes/Hindi catalog. See STATION-SOURCES.md.
5. Search: 8,963 distinct station records, with 50-result progressive rendering and Show more. Search matches name, code, city/address and state. No artificial per-city limit. This reference dataset is not an official current station registry.
6. Accessibility mapping: BPL only. Its indoor route/facility layout is a predefined DEMO, not verified physical infrastructure.
7. Real reference data: station identity and source coordinates. BPL coordinates: 23.2668843843, 77.4131428577. No entrance or help-point geographic marker is fabricated. Nearby distances use the haversine formula and known coordinates within 50 km; they are straight-line estimates, not walking directions.
8. Demo operations: Lift A/B, ramps, indoor routes, 12345 train, platform/facility changes and staff assistance coordination. Firebase provides live synchronization of these demo operations, not an official rail feed.
9. QR page: `/station-qr`, linked from Staff Dashboard. Ten downloadable/printable codes: gate-1, ramp-b, lift-a, lift-b, corridor-c, accessible-corridor, accessible-washroom, assistance-desk, platform-3 and platform-5. Every code encodes `/checkpoint?station=BPL&location=<id>` at the selected app origin.
10. QR persistence: physical links and simulation share checkpointService. Same-browser local storage supports camera links opening new tabs; stored journeys expire after 24 hours. Private browsers or a different app browser may create a new journey. New visitors still choose needs; station is identified automatically.
11. Firebase: same collections and initialization. Requests now include stationCode/stationName; updated rules validate them. Redeploy/merge rules before sending requests. General station requests go to the existing demo operations team and clearly disclose that local railway staff are not connected.
12. Train data: unchanged trainService with known 12345 fallback. External provider remains optional. Unknown station/train combinations do not get a fabricated platform or route.
13. Logo: public/logo.svg and public/favicon.svg now use an S-shaped wayfinding path with an arrow; header uses the same asset.
14. Staff: responsive single-column rows on phones; Station QR Codes link; requests show station identity. Existing confirm/update/lifecycle controls retained.
15. Languages: English/Hindi for new visitor UI and QR controls. Geographic names lacking curated Hindi use source names; provider map labels remain unchanged.
16. Dependencies: leaflet and qrcode. No external QR service, map credentials, camera-scanning library or GPS indoor routing.
17. Mobile: responsive header, 44px controls, 16px form text, single-column operations, constrained chat panel, map touch controls, safe-area spacing, printable QR cards. tests/mobile-preview.html renders real app frames at phone widths for repeatable QA; it is not included in production output.
18. Limits: reference coordinates may be stale; location permission can fail; source data contains no verified entrances. Physical camera scan and device speech/vibration need your phone test. Authenticated staff writes and cross-account assistance remain pending your Auth/rules setup. Missing BPL facilities must be initialized by authorized staff. No production hosting or real railway staffing is implied.
19. Validation: production build and lint pass; 19 automated tests pass. Browser checks verified 390px/320px layouts, no landing horizontal overflow after fix, BPL map tiles (6/6 loaded), NDLS location/standard view, Hindi labels, ten QR images and configured-origin links. Build retains a large-chunk advisory because the app bundles Firebase and the local station catalog; no build errors. No commit or push.

## Full phone demo checklist

After following DEMO-SETUP.md, initialize missing BPL facilities and reset to Platform 3. On the phone scan gate-1, choose Mobility → Wheelchair + Human Assistance and other support, then Catch a Train → 12345. Submit once. In a separate staff browser accept, mark On the Way and Completed. Change Platform 3 → 5; mark Lift A Unavailable; check text plus enabled voice/vibration. Scan Lift B in the same phone browser, then Platform 5. Confirm arrival. Repeat with another station to verify location and the unavailable-indoor-guidance message.
