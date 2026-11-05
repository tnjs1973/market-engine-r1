# Market Engine R1 Companion — Version 0.1

This is a **read-only** Rabbit R1 Creation designed for its 240 × 282 pixel screen. It does **not** contain live quotes, generate signals, access a brokerage account, or place trades.

## What works now

- Four-ticker watchlist: SPY, QQQ, MU, WMT.
- Touch tabs, R1 scroll-wheel navigation, short side-button click to advance.
- Refreshes `data/latest.json` without caching.
- Shows price, status, source/timestamp, and entry/stop/targets **only** for records marked verified with a feed source and timestamp.
- Speaks a concise status using Rabbit's `PluginMessageHandler` bridge, when available. A browser speech fallback is included for desktop preview.
- Unconnected state displays no fabricated price, pattern, or entry/exit levels.

## Step 1 — Open locally on a computer

From the folder containing this README, run:

```powershell
py -m http.server 8765
```

Open `http://localhost:8765/` on your PC. Click ticker tabs, Refresh, and Speak. The app should show **NO DATA** until your engine is connected.

## Step 2 — Prepare the Rabbit

1. Visit https://os3.rabbit.tech/ and sign into your Rabbit account.
2. Check that your R1 is linked under **Settings → R1**.
3. For an OS3-created app, Rabbit requires an online computer with `rabbit agent` and a model API key; our already-built files can alternatively be hosted as a third-party Creation.
4. If hosting this version yourself, use a trusted HTTPS static host (for example GitHub Pages), generate an R1 installation QR code using Rabbit's official `creations-sdk/qr` reference, and scan it in **R1 → Creations → Add via QR code**.

Do not upload sensitive credentials or private trade/account information to a public web Creation. Rabbit says anyone with the Creation URL can open it.

## Step 3 — Connect Market Engine 2 (future phase)

The existing Windows tasks must remain untouched. Add a **separate read-only exporter** after we inspect an actual saved output or Parquet schema. The exporter can generate `data/latest.json` according to `data/SCHEMA.md`. Do not expose your Windows computer or a private API directly to the public internet.

Deploy the Creation and a **sanitized** read-only snapshot through a security-reviewed HTTPS delivery path. No API keys, broker credentials, or personal account details belong in the client files.

## Test checklist

- Screen fits 240 × 282 without horizontal overflow.
- All four tabs switch.
- Scroll wheel and side button switch symbols on the R1 (verify on device).
- With placeholder data, all numerical values are `—` and source indicates unavailable.
- Refresh works without caching.
- Speak works through Rabbit's assistant bridge (verify on device).
- No orders or broker integrations exist.

## Source documentation

- Rabbit Creations: https://www.rabbit.tech/support/article/how-to-use-r1-creations
- Rabbit's SDK example: https://github.com/rabbit-hmi-oss/creations-sdk
