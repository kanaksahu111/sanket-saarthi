> Latest update: see [MOBILE-AND-MAPS.md](./MOBILE-AND-MAPS.md) for mobile access, the expanded station catalog, interactive maps, QR codes and revised request fields.

# Current UI and demo status

Visitor flow: Landing → Station + accessibility needs → Purpose/details + compact summary → Live guidance. Green/cream styling, station background, dark mode, persistent assistant and GSAP preview remain. English/Hindi and Voice Assist are available from landing.

Verified: build, lint, 16 regression tests; browser keyboard city/station search, mobility expansion, multiple needs, Hindi summary/live journey, checkpoint URL, Firebase Platform 3 read and staff read-only console. No console errors captured.

The database provides Lift A and Lift B. Ramp B, Accessible Washroom and Assistance Desk are missing at expected paths. Guidance pauses until authorized staff initializes them.

Firebase Auth/rules setup remains with the user. Authenticated writes, cross-account acceptance and physical speech/vibration are unverified. No credentials changed; no commit/push.

See DEMO-SETUP.md and IMPLEMENTATION-REPORT.md.
