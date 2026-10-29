# Storm Branson — Project Status

_Last updated: 2026-10-28_

## What it is
A live fundraising dashboard for the Storm 11U trip to the Ballparks of America tournament (Branson, MO). Each player has a $1,000 "bucket," and the $50 commitment deposit counts toward it. The tournament is the **2027 Global Games, Jul 29 – Aug 2, 2027** (12U, $995/player; event page https://www.ballparksofamerica.com/event-46760). The old "$100 off if every deposit is in" message was retired 2026-10-22 as out of date (`teamDiscount: 0` hides it).

Organizers enter money by hand in a Google Sheet. This page reads that sheet live every time it loads, every 60s while it's open, and when it comes back to the foreground.

## How to Pay (2026-10-28)
The mom leading the trip's fundraising saw the dashboard and asked whether people could pay through it. Until now, payments were tracked by Sean sending Nicole a screenshot. The page now makes paying easy. **It doesn't take money or know a payment happened.** An organizer still enters each payment in the sheet.
- **Donate / Pay** gold button in the hero (under the next-payment line) jumps to `#pay`.
- **How to Pay section** (`#pay`, before Know Before You Go, built by `setupPay()` in `js/app.js`):
  - **Venmo:** a "Who is it for?" dropdown (General fund + every player in the sheet, refilled on each load) and a blue button to `@WallkillTravelOrganization`. The note fills in as `Storm 12U Branson (Player Name)`, the memo the donation form asks for. Givers type the amount (any amount).
  - **Check:** payable to **Wallkill Travel Organization** (from the form, not "Hudson Valley Storm"), memo, include the form, mail to Hudson Valley Storm, 3 Lira St., Wallkill, NY 12589.
  - Donation Form (PDF) download, 501(c)(3)/tax-deductible line, WallkillTravelTeams@gmail.com · 845-843-8548.
- **Player popup:** "Venmo for {first name}" with that player's note, plus a "Pay by check" link back to the section. The General Fund popup has a Venmo button too.
- All payment details are in one `payment` block in `js/config.js`. The form is `pdf/Storm-12U-Branson-Donation-Form.pdf` (page 1 is the sponsor letter, page 2 the form with the Venmo QR code).
- Venmo link format: `https://venmo.com/?txn=pay&audience=private&recipients=USER&note=...`. `audience=private` keeps kids' names off Venmo's public feed. This format isn't officially documented, but **Jason tested it on his phone on 2026-10-28 and it works.** The page already tells people to type the note themselves.
- Tested in headless Chrome at phone and desktop sizes against the real sheet, with no errors from our code (the Vimeo embed logs its own). Live at `bf0b36d`.

## Where things stand (checkpoint 2026-10-22)
**Live:** https://jasonackerman1.github.io/storm-branson/, reading the real team sheet. Today's work is all pushed and live (latest: 7 cards per row + Team payments card, `f2f9fb4`). Two GitHub Actions run on their own: the daily lodging price check and the weekly Ballparks of America page check (both first runs succeeded). Jason reviewed the live page end of day 2026-10-22: "looks great for now."

**Roster:** all 14 still count. Lyons may be too old for 12U (April 30 cut-off), Harris is out (Cooperstown guest player), Liam P. is unsure, and Mason's brother Nolan might join. Jason's plan is to remove or add rows in the sheet once it's settled, with no tags. Ballparks' minimum is 11 players + 2 coaches; the max is 14 players + 4 coaches.

**Repo location:** the working copy is `/Users/jackerman/Documents/storm-branson` (since 2026-10-28). The old clone at `Documents/Storm/storm-branson` was removed 2026-10-28 (moved to the Trash).

**Next / open questions for the coach:**
1. Did the team put down its Ballparks deposit before 9/30 ($500) or after ($1,000)? This changes the Nov 30 target in `js/config.js`.
2. Confirm the payment schedule and unmet-rooms fee match the team's EventConnect dashboard. The 2027 event page says $2,500/$2,500 (the FAQ still says $3,000/$3,000) and spells out the late rule: a fee up to $500 or a waitlist.
3. The team's $50-per-player deposit deadline (stat card still says "Deadline TBD"); set `depositDeadline` in `js/config.js`.
4. 4 vs 5 family lodging nights (the last day's games run to 11pm; a 5-night stay showed 0 block rooms left).
5. Swap in the 2027 prep kits when Ballparks posts them.

## Banner, trip header, payments, lodging, prep kit (2026-10-22)
- **Background video:** Ballparks of America's own Vimeo video (`1196142378`, "What is Ballparks of America", background mode, muted/looping) sits behind the top of the page in `#page-bg`, keeps its 16:9 ratio (cover-cropped, centered) and is sized by `js/banner.js` to end just above "The Breakdown", with a dark tint fading to black. Their panorama photo (Storyblok URL) shows first; the video only fades in once Vimeo reports it's actually playing, so the area is never empty and a no-autoplay phone just keeps the photo. Skipped for reduced-motion and Save-Data. Headless Chrome gets Vimeo's bot block unless it uses a normal user agent (testing note only).
- **Header is the trip:** Storm wordmark + "Hudson Valley, NY" on the left, a gold dotted route with a rolling baseball (`img/baseball.svg`), "N days to Branson" countdown and "About 1,200 miles" in the middle, "Road to" + the Ballparks of America logo (`img/boa-logo.svg`, their primary logo, saved locally) + event name/dates on the right. "Road to Branson" stays in the page as screen-reader text. Mileage is a ballpark (about 1,200–1,250 driving).
- **Team payment marks** on the team bar from `teamPayments` in `js/config.js` (BoA's schedule: deposit at registration, $2,500 by 11/30, $2,500 by 1/31, rest by 4/1). Marks turn gold when reached and red if missed; a "Next team payment" line sits under the bar. **Assumes the $1,000 deposit (registered on/after 10/1).** If the team registered before 9/30 it should be $500. Open question for the coach.
- **Family lodging estimate:** shown only in the player popup (taken off the cards 2026-10-22 at Jason's request). Example room: 2 Bedroom Condo (2 Queen + Queen Sofa) at The Suites at Fall Creek, $177/night avg × 4 nights (Jul 29 – Aug 2) + $12/night resort fee + 12.35% tax. EventConnect's own nightly list ($169/$189/$189/$169) averages $179, so the real total may be about $8 higher. A 5-night stay through Aug 3 showed 0 rooms left in the block, so it stays at 4 nights for now.
- **Daily price watch:** `.github/workflows/check-lodging.yml` runs `tools/check_lodging.py` about 9am Eastern. It reads EventConnect's public JSON feed (the browser can't, since there are no CORS headers) and writes `data/lodging.json`, which the page loads. It opens a GitHub issue (which emails Jason) if the price changes, the room sells out, or only 3 are left.
- **Weekly Ballparks of America check (2026-10-22):** `.github/workflows/check-boa.yml` runs `tools/check_boa.py` Mondays about 9am Eastern. It saves the text of the 2027 event page, Registered Teams and FAQ in `data/boa/`, diffs against last week, and watches the Prep Kit PDF links (new 2027 kits, removed or broken links). Any change opens a GitHub issue showing old vs. new wording; nothing edits the page automatically. `data/boa-check.json` feeds the "last checked" note under Know Before You Go. Switch the cron to daily near the trip. First GitHub run succeeded with no false alarm.
- **Header/payment line (2026-10-22):** countdown moved above the dashed route line, which now lines up with the logo centers (measured in `js/banner.js`). The next-payment line spells out the running total ("With the deposit, that's $3,500 total").
- **7 player cards per row (2026-10-22):** at 1100px and wider, `.grid` is `repeat(7, minmax(0, 1fr))`, so the 14 players fill two even rows. Long names wrap to two balanced lines (`.grid .card-name`, raised specificity because the base `.card-name` rule sits later in the CSS and was winning). Below 1100px it falls back to auto-fill (3 rows on a tablet); phones stay at 2 per row. Family lodging was taken off the cards the same day (popup only).
- **Team payments card (2026-10-22):** full-width first card in Know Before You Go (`#team-payments`): schedule, late-payment rule, refunds, roster minimum, coach pays via EventConnect. The next-payment line on the team bar ends with a "What if a payment is late?" link to it.
- **Deploy note:** one GitHub Pages deploy hung for 28 minutes on 2026-10-22 (build fine, deploy step stuck); Jason cancelled it and a manual rebuild (`POST /repos/jasonackerman1/storm-branson/pages/builds`) fixed it. This repo is legacy Pages build type. If a push doesn't show up, check the latest Pages build before blaming the browser cache.
- **Late payments (from the event page's Payment Policies):** a late fee of up to $500 on the team account, or being moved to a waitlist; BoA can modify or cancel a registration. Teams registering after a deadline get 30 days to catch up.
- **Know Before You Go** section after the jerseys: highlights from BoA's five-day Parents Prep Kit (lodging rules incl. the team's 8 rooms/night minimum or $1,000 fee, app/streaming, packing, cashless campus/gift cards/add-ons, campus rules like no gum or seeds, the week) plus a download button that links to their PDF. It's the **Summer 2026** kit; the 2027 one is "coming soon," so refresh this when it's out.
- **From the Registered Teams page (same day):** a Road to Ballparks timeline at the top of Know Before You Go (4 phases on 2027 dates: roster/lodging/travel by late Feb, Triton jerseys/hats by late Apr, trading cards/add-ons by Jun 29 (30 days out), plan the week early–mid Jul). `js/prep.js` greys out past phases and highlights the next one. Added a Coaches Prep Kit download, a Getting There card (SGF 45 min, STL backup, vans park free), lodging favorites (Element Hotel next door, Cabins at Grand Mountain, golf-course condos, Table Rock Lake), and a Branson Fun card (Tripster attractions portal, RockLane pontoon discount, pin trading via BJ's Trophy). That page's FAQ still lists an older payment schedule ($1,000/$3,000/$3,000); the dashboard follows the event page ($2,500/$2,500). Its roster cap is 14 players + 4 coaches, and Storm has exactly 14.
- **Fact check against ballparksofamerica.com (2026-10-22):** checked every dashboard claim against the event page, FAQ, Registered Teams, Tournaments Hub, Branson, Experience, Contact pages and both 5-day prep kits. The 2027 Tournaments Hub lists the Global Games as a **5 DAY TOURNAMENT**, Jul 29 – Aug 2, so the 5-day kits are the right ones. Fixed: "closest airport SGF" (the small Branson Airport, BKG, is 22 min; SGF is 45–50 min and where most teams fly); added the 75-mile rule, free parking/admission, cash-for-gift-card at the Pro Shop, and the player coupon packet. Site contradictions left for the coach: unmet-rooms fee (FAQ says "Global Games (4-day): $800", the 5-day rule and the event page say $1,000; dashboard says "up to $1,000"), and the payment schedule (FAQ $3,000/$3,000 vs event page $2,500/$2,500; dashboard follows the event page).
- **Open:** the team's $50-deposit deadline (stat card still says "Deadline TBD"); whether the team's BoA deposit was $500 or $1,000; 4 vs 5 lodging nights.

## Prototype built (2026-10-21)
- Plain HTML/CSS/JS with no build step, so it also works opened straight from disk. Same look as the Storm walk-up app: black/red/gold, Anton font, Storm wordmark.
- **Grand total** (count-up) and team goal bar ($1,000 × number of players).
- **Stat cards:** Deposits in (with deadline countdown), Buckets full ($ still to go), General Fund (tap for its payments), Average per player.
- **Team-discount banner:** "X of 14 in, still waiting on …" (adds a last initial when first names repeat, e.g. the two Liams). Switches to a celebration once all deposits are in.
- **Jersey buckets:** each jersey fills from the bottom with an animated wave, red while filling and gold once it reaches $1,000. A "+$X" chip shows money over the goal, and a deposit stamp sits in the corner (green check, or dashed $). Sort by Most (default), #, Least, A–Z (a picked sort is remembered per browser). Section title renamed "The Breakdown" (was "The Buckets") 2026-10-22. **Realistic jersey, 2026-10-22 (second try):** the first redraw (front view, V-neck, buttons) still looked like an icon to Jason. Now the jersey shows its **back** (where name and number really go): last name arched across the shoulders, tackle-twill number (white, red outline, black edge), back-view collar (nearly flat cream/red back collar band with the dark inside of the front collar showing behind it) and an MLB-style logo patch at the back of the neck, striped cuffs, knit texture, soft folds, lighting and a drop shadow. Number sits just under the name, mid-jersey (baseline y=82, moved up twice at Jason's request). Still black at $0, fills red, gold when full. Jason approved this version ("great").
- **Player detail sheet** (tap a jersey): total, to-go/over, deposit date, Sponsors, and Money Collected (see below).
- **Robustness:** a sheet that isn't shared, or a wrong tab name, gives a plain error message. Google silently returns the first tab for an unknown tab name, so the page checks the column headers. It falls back to the last good copy kept in that browser. Payment rows naming a player who isn't on the Players tab go to the General Fund, with a "For the organizers" note.
- **Sample data** (`js/sample-data.js`) shows every state until a sheet ID is set. A yellow banner says so.

## Detail popup: Sponsors vs Money Collected (2026-10-22)
- Jason found the first version confusing: a sponsor's payment showed twice, once under Sponsors and again under "Payments received."
- **Sponsors** now lists each company with its status, the amount it paid, and the date and method. Money from a listed sponsor shows only here. A payment with Type **Sponsor** from a company not on the Sponsors tab is added automatically as Paid.
- **Money Collected** (renamed from Payments received) lists everything else: family, the deposit, and table collections.
- Both section headers show their subtotal, and the two add up to the player's total. The General Fund popup uses Money Collected too.
- Table collections (e.g. two boys at a Dunkin' Donuts table): one Payments row per boy with his share, Type Fundraiser. This is explained in the template's Instructions tab and in SETUP.md. Sample data has an example (Owen/Jake, $62.50 each).

## Jersey text consistency (2026-10-22)
- Every jersey now uses one last-name size and one number size, measured in Anton so the longest name (VAN TASSEL) fits across the chest. Before this, only names over 8 letters were squeezed.
- Jason asked whether the jersey shape uses too much space. The layout is the reason, not the shape: about 254px per card, 2 per row on a phone. He was offered compact rows or smaller cards and chose to **keep the big jersey cards as is**.

## Hosting + starter spreadsheets (2026-10-22)
- **Live at https://jasonackerman1.github.io/storm-branson/**: public repo `jasonackerman1/storm-branson`, GitHub Pages from `main` (same pattern as Storm, with `.nojekyll`). There's no build step and no service worker, so a push is live as soon as Pages rebuilds.
- _(Superseded, see the one-tab section below.)_ Two starter files in `template/`. **`Storm-Branson-Tracker-with-sample-data.xlsx`** (recommended) has the real roster and settings, plus the sample payments and sponsors, each with Notes starting "SAMPLE - delete this row". **`Storm-Branson-Tracker-blank.xlsx`** has no money rows.
- Jason asked for duplicate sample and blank tabs. That would break the tab-name lookup, so the workflow is instead: upload the sample file, connect, check, then delete the SAMPLE rows (the roster rows stay).
- While the live sheet still has any SAMPLE rows, the dashboard shows a yellow banner ("The sheet still has N SAMPLE rows · delete them before sharing").

## Data: ONE tab, "Tracker" (simplified 2026-10-22), built by `tools/build_template.py` → `template/*.xlsx`
- Jason found four tabs plus long instructions too much, so it's now one tab: **Player | # | Date | From | Amount | Method | Type | Status | Notes**.
  - **Every name in Player is a jersey** (revised same day, at Jason's request: no separate roster block). His # can be on any one of his rows. A kid with no money yet has a name-only row, and his first donation can be filled into it. A name with no # anywhere shows "?" plus an organizer note, since it's usually a typo or a new kid. Typing an explicit "?" as the # doesn't trigger the note. Robby Glas wears #7 (same as Owen) until new jerseys arrive, per Jason 2026-10-22.
  - Rows with an **Amount** are money received. A blank Player means the General Fund.
  - **Sponsor** rows with a Status and no Amount are companies that have been asked. When they pay, the Amount goes on the same row, and the row shows as Paid.
  - Pledged amounts go in Notes.
- Settings (goal, deposit, discount, deadline, trip name) moved to `js/config.js`. The instructions became hover notes on the headers.
- In the app, `splitRows()` turns the one tab into the same players, payments, and sponsors the rest of the code already used. The sample totals and popups are identical to the four-tab version.
- **Only one starter file now:** `template/Storm-Branson-Tracker.xlsx` (14 name + # rows). The sample-data/blank pair is gone. The connection test is seeing 14 jerseys at $0 with the right numbers. The SAMPLE-row banner code stays in the app, but nothing ships SAMPLE rows anymore.
- Gotchas:
  - The `#` column is plain text so `?` survives, because gviz blanks values whose type doesn't match the column.
  - The page checks the headers, because Google returns the first tab for an unknown tab name.
  - The Player column has no dropdown. Google's autocomplete helps, and a typo shows as a "?" jersey with an organizer note.
- Jason chose an unlisted link (no login), so anyone with the dashboard link can see names, totals, and sponsors.

## Setup
See `SETUP.md`: upload the template, **Save as Google Sheets**, share it, then put the ID in `js/config.js` (or add `?sheet=ID` to test).

## Real starting data (2026-10-22)
- `/Users/jackerman/Documents/Storm/Storm-Branson-Tracker-START.xlsx` is **outside the repo on purpose**: it has real business names and money, and the repo is public. Built from the template by a one-off script.
- **Owen:** $50 deposit, and $125 each from Phancy Screens and from Shutters, Screens and More, both Paid, total $300. Asked: Lero's Point to Point, Window Works, ArrowWorthy, Harbor Freight, Konica Minolta.
- **Johnathan Velez:** GDC Barber, Catherine's Hair Design and Spa, Hennessy Liquors, Halligan's Public House (all Asked).
- **Sammy Van Tassel:** Dana Distributors, Herring Sanitation, Taylor Recycling, Bach's True Value, Independent Helicopters, Red Tail Flight School, Veolia (all Asked).
- **Mason Frank:** Orange County Sheriff's Office PBA, Wallkill Valley Federal Savings, Ulster County Sheriff's Office PBA, License to Sell, Carolina Boys (all Asked).
- Dates and methods weren't known, so they're blank.
- **Not entered:** Sammy's deposit and donations. Jason only *assumes* he paid, and the amounts are unknown.
- **Spellings confirmed by Jason.** He corrected two: Lero's Point to Point and ArrowWorthy. Window Works is a separate company. Everything else was right as entered.
- Checked by feeding the file to the dashboard as Google CSV: $300 total, 1/14 deposits, 14 jerseys, Owen's popup correct.

## Connected to the real Google Sheet (2026-10-22)
- Sheet ID `1Yq7uIxXvhTFiOYZuM3FBPv_WR4ru0dbDU67rKY58vLQ` (a converted Google Sheet), set in `js/config.js`. The sample banner is gone.
- gviz CSV returns the Tracker tab (35 lines: header + 34 rows), and Google sends `access-control-allow-origin` for the github.io site.
- The first link (`1cO_uqQf53QxV3BkwLjvU8hkJYxUTcBye`, `rtpof=true`) was the uploaded .xlsx in Office mode. Jason converted it with Save as Google Sheets and sent the new ID the same day.

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
- **Confirm an edit round-trip:** change something in the Google Sheet and check it appears on the dashboard within about a minute. Not yet tested by Jason.
- **Sammy Van Tassel's money:** Jason assumes Sammy paid his deposit and has some donations, but nothing is confirmed. Add rows once it is.
- **Deposit deadline:** goes in `js/config.js` (`depositDeadline`) when known. The countdown and discount line pick it up automatically.
- Dates and methods for Owen's $300 are blank in the sheet; organizers can fill them in anytime.
- Old uploaded-xlsx copy in Google Drive (ID `1cO_…`) should be deleted so nobody edits the wrong file.

## Cache busting (2026-10-22)
- `index.html` loads CSS/JS with `?v=...`. **Bump that value whenever js/ or css/ changes**, or browsers can keep showing the old version for up to 10 minutes (GitHub Pages caching).
