# Read-only data contract, schemaVersion 1

File: `data/latest.json` (JSON over a trusted HTTPS static host).

Only the exporter may set `verified: true`, and only after checking the input against real Market Engine output. **Never fabricate** prices, timestamps, signal outcomes, entry points, or harmonic ratios. Source timestamps must be true UTC ISO-8601 values; price fields must be numbers, not formatted strings.

```json
{
  "schemaVersion": 1,
  "source": "actual verified source name",
  "updatedAtUTC": "2026-11-05T20:00:00Z",
  "tickers": {
    "SPY": {
      "verified": true,
      "price": null,
      "session": "Regular",
      "timeframe": "15m",
      "signal": {
        "status": "NO TRADE",
        "direction": "neutral",
        "summary": "No confirmed setup in the saved research.",
        "entry": null,
        "stop": null,
        "target1": null,
        "target2": null
      }
    }
  }
}
```

**The timestamp and source above are structural examples only, not real market data.** Do not publish them as a current quote. Use null for missing numbers and false for unverified records. The other watchlist symbols may be present in the mapping as unverified.

The Creation displays the source/time as a **saved snapshot**, not a real-time quote, even when the data is verified. Data freshness, rights/licensing, options quote access, and delayed-market disclaimers must be addressed before deployment of a live feed.
