# Connecting the dashboard to the team's Google Sheet

About 5 minutes, one time.

## 1. Put the file in Google Drive
1. At [drive.google.com](https://drive.google.com), click **+ New → File upload** and pick `template/Storm-Branson-Tracker.xlsx`.
   It's one tab, with one row per player (name and #) and nothing else yet.
2. Open it, then click **File → Save as Google Sheets**. Use that new copy from here on, and delete the `.xlsx` from Drive.
   The dashboard can't read the uploaded `.xlsx` itself.

## 2. Share it
**Share → General access → Anyone with the link → Viewer.** Then add the organizers by email as **Editor**.

## 3. Connect
Copy the sheet's link and send it to Claude. To test it yourself, add `?sheet=` and the ID (the long part between `/d/` and `/edit`) to the end of the dashboard's address.

## 4. Check it
The dashboard should show all 14 jerseys at $0, with the right numbers, and no yellow "Sample data" banner. That means it's connected.

## How it works (one tab: "Tracker")
| Row | What to fill in |
|---|---|
| **A player** | Every name in Player gets a jersey. His **#** only needs to be on one of his rows. Each kid starts with a row with just his name and #, and his first donation can go right into it. To add a new kid, type his name and # on a new row. |
| **Money received** | Player, Date, From, **Amount**, Method, Type. Leave Player blank for a team-wide donation. |
| **Deposit** | Same as money, with Type **Deposit**. That's how the dashboard marks the deposit in. |
| **Sponsor being asked** | Player, From (the company), Type **Sponsor**, Status (Asked / Pledged / Declined). No Amount. |
| **Sponsor pays** | Fill in Date, Amount, and Method on that same sponsor row. It switches to Paid. |
| **Table collection** | One row per boy with his share, Type **Fundraiser**, and a note like "Split with Jake ($125 total)". |

Hover over any column header in the sheet for a reminder. Keep each player's name spelled the same on every row. A misspelled name would show up as a new jersey with a "?", and the dashboard flags it at the bottom of the page.

Goal, deposit amount, team discount, and the deposit deadline are set in `js/config.js`, not the sheet.

The dashboard re-reads the sheet when it opens, every minute while it's open, and on **Refresh**.
