# Storm Branson — Project Status

_Last updated: 2026-10-21_

## What it is
A live fundraising dashboard for the Storm 11U trip to the Ballparks of America tournament (Branson, MO). Each player has a $1,000 "bucket," and the $50 commitment deposit counts toward it. If every player's deposit is in by the deadline, the team gets $100 off per player.

Organizers enter money by hand in a Google Sheet. This page reads that sheet live every time it loads, every 60s while it's open, and when it comes back to the foreground.

## Prototype built (2026-10-21)
- Plain HTML/CSS/JS with no build step, so it also works opened straight from disk. Same look as the Storm walk-up app: black/red/gold, Anton font, Storm wordmark.
- **Grand total** (count-up) and team goal bar ($1,000 × number of players).
- **Stat cards:** Deposits in (with deadline countdown), Buckets full ($ still to go), General Fund (tap for its payments), Average per player.
- **Team-discount banner:** "X of 14 in, still waiting on …" (adds a last initial when first names repeat, e.g. the two Liams). Switches to a celebration once all deposits are in.
- **Jersey buckets:** each jersey fills from the bottom with an animated wave, red while filling and gold once it reaches $1,000. A "+$X" chip shows money over the goal, and a deposit stamp sits in the corner (green check, or dashed $). Sort by #, Most, Least, A–Z (remembered per browser).
- **Player detail sheet** (tap a jersey): total, to-go/over, deposit date, sponsor list (Asked/Pledged/Paid/Declined, plus "received," matched from Payments by company name), and every payment received.
- **Robustness:** a sheet that isn't shared, or a wrong tab name, gives a plain error message. Google silently returns the first tab for an unknown tab name, so the page checks the column headers. It falls back to the last good copy kept in that browser. Payment rows naming a player who isn't on the Players tab go to the General Fund, with a "For the organizers" note.
- **Sample data** (`js/sample-data.js`) shows every state until a sheet ID is set. A yellow banner says so.

## Data (Google Sheet), built by `tools/build_template.py` → `template/Storm-Branson-Tracker.xlsx`
- **Settings:** one row, one setting per column (Goal Per Player, Deposit Amount, Deposit Deadline, Team Discount, Trip Name).
- **Players:** Number (plain text, so `?` survives), Name. Pre-filled with the 14 current Storm players.
- **Payments:** Date, Player (dropdown, blank = General Fund), From, Amount, Method, Type (Deposit/Sponsor/Family/Fundraiser/Other), Notes.
- **Sponsors:** Player, Company, Contact, Status, Pledged Amount, Notes.
- Read through Google's `gviz` CSV export, which needs "Anyone with the link can view."
  **Gotcha:** gviz drops any value whose type doesn't match the rest of its column. That's why Settings is a single row and Players.Number is a text column.
- Jason chose an unlisted link (no login), so anyone with the dashboard link can see names, totals, and sponsors.

## Setup
See `SETUP.md`: upload the template, **Save as Google Sheets**, share it, then put the ID in `js/config.js` (or add `?sheet=ID` to test).

## Verified
Headless Chrome (puppeteer-core, temporary, not committed), at desktop 1280px and phone 390px:
- sample totals and no sideways scroll
- detail sheet open/close
- General Fund sheet
- sorting
- live mode against faked gviz CSV responses (cents, a "?" number, unmatched-name warning, deadline countdown)
- not-shared fallback to the cached copy
- wrong-tab error

Zero console errors. **Not yet tested against a real Google Sheet.**

## Open
- Jason to test the prototype.
- Create the real Google Sheet and connect it.
- Decide hosting: likely a new GitHub Pages repo `jasonackerman1/storm-branson`, like Storm.
- Deposit deadline date (TBD).
