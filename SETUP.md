# Connecting the dashboard to the team's Google Sheet

This takes about 5 minutes and only has to be done once.

## 1. Put the template in Google Drive
1. Go to [drive.google.com](https://drive.google.com) and sign in with the account that should **own** the tracker.
2. Click **+ New → File upload** and pick `template/Storm-Branson-Tracker.xlsx` from this folder.
3. Double-click the uploaded file. It opens in Google Sheets.
4. **Important:** click **File → Save as Google Sheets**. That makes a real Google Sheet copy, which opens in a new tab.
   The dashboard can't read the uploaded `.xlsx` version, so use the new copy from here on and delete the `.xlsx` from Drive.

## 2. Share it
1. In the new Google Sheet, click **Share** (top right).
2. Under **General access**, change "Restricted" to **Anyone with the link**, and leave the role as **Viewer**.
   This is what lets the dashboard read the numbers. People can only *see* the sheet, not change it.
3. In the "Add people" box at the top, add the organizers' emails as **Editor** so they can enter payments.
4. Click **Done**.

## 3. Connect the dashboard
1. Copy the sheet's ID from the address bar. It's the long part between `/d/` and `/edit`:
   `https://docs.google.com/spreadsheets/d/`**`1AbC...xyz`**`/edit`
2. **To test right away:** open the dashboard with `?sheet=` and the ID on the end of its address:
   `.../index.html?sheet=1AbC...xyz`
3. **To make it permanent:** paste the ID into `js/config.js` between the quotes on the `sheetId:` line (or send it to Claude to do).
   The yellow "Sample data" banner disappears once it's reading the real sheet.

## How the organizers use it
- **Payments tab:** one row per check, Venmo, or cash payment. Pick the player from the dropdown, or leave Player blank for a general donation.
  Pick Type **Deposit** for the $50 commitment deposit. That's how the dashboard knows a player's deposit is in.
- **Sponsors tab:** the companies each player is asking. When a sponsor's money arrives, also add it on Payments, with the same company name in **From**, so it shows as "received."
- **Settings tab:** type the deposit deadline (like `3/1/2027`) once it's known, and the dashboard starts a countdown.
- Don't rename the tabs or the row-1 headers. If a name on Payments doesn't match the Players tab, the dashboard shows a "For the organizers" note at the bottom of the page.

The dashboard re-reads the sheet every time it's opened, every minute while it's open, and when someone taps **Refresh**. Google can take a few seconds to a minute to reflect a new edit.
