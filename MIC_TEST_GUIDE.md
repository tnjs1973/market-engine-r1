# Market Engine R1 — microphone diagnostic 0.3

This is a standalone diagnostic; it does **not** change or replace the Market Engine R1 dashboard.

## Install on the Rabbit

1. In your existing GitHub repository `tnjs1973/market-engine-r1`, choose **Add file → Upload files**.
2. Upload **only** `mic-test.html` to the repository root and commit it as `Add microphone diagnostic 0.3`.
3. Check the published page at: `https://tnjs1973.github.io/market-engine-r1/mic-test.html?v=3`.
4. Scan the separate diagnostic Creation QR code. Leave the main Market Engine Creation alone.

## Exact physical test

1. Open **Market Engine Mic** (DIAG 0.3) on your R1.
2. Tap **ENABLE MIC**. If permission is requested, grant it for this test. If permission is denied or unsupported, note the exact on-screen message; don't try to bypass it.
3. Speak normally and see whether the audio meter moves.
4. Hold the R1 **side button** for two seconds while saying a few words, then release. Check **PTT START / END** counts and **LAST CAPTURE**.
5. If the side button events stay `0 / 0`, hold the orange **HOLD TO TEST** touchscreen button for two seconds, then release. This isolates microphone support from side-button event delivery.
6. Tap **DISABLE MIC** when finished or close the Creation. Audio tracks are stopped on close.

## Interpret the result

| Observation | What it means |
| --- | --- |
| `MIC API UNAVAILABLE` | This R1 WebView does not expose `navigator.mediaDevices.getUserMedia`. We need a different native/OS3 bridge. |
| `MIC ACCESS FAILED: NotAllowedError` | Browser or R1 OS denied permission; the Creation cannot record with this method. |
| `MIC ACTIVE` and moving meter | WebView microphone access works. |
| PTT counts increment | Rabbit delivered side-button press/release events to this Creation. |
| `AUDIO CAPTURED` with nonzero bytes | `MediaRecorder` successfully captured audio into volatile memory. |
| Touch works but PTT stays `0 / 0` | Mic recording works, but Rabbit did not deliver hardware events to our app. |

**Security:** No audio is saved, uploaded, sent to an API, or stored in the browser. The test only counts captured bytes and immediately discards the audio. No brokerage, market, or personal data is accessed.

## Next step

Only after testing on the physical R1 should we implement speech recognition. If R1 WebView microphone capture is blocked, use the OS3 voice/skills path instead of trying to bypass device restrictions.
