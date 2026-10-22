# Connecting the dashboard to the team's Google Sheet

About 5 minutes, one time.

## 1. Put the file in Google Drive
1. At [drive.google.com](https://drive.google.com), click **+ New → File upload** and pick `template/Storm-Branson-Tracker-with-sample-data.xlsx`.
   It has the real roster plus made-up SAMPLE rows for testing. (`Storm-Branson-Tracker-blank.xlsx` is just the roster.)
2. Open it, then click **File → Save as Google Sheets**. Use that new copy from here on, and delete the `.xlsx` from Drive.
   The dashboard can't read the uploaded `.xlsx` itself.

## 2. Share it
**Share → General access → Anyone with the link → Viewer.** Then add the organizers by email as **Editor**.

## 3. Connect
Copy the sheet's link and send it to Claude. To test it yourself, add `?sheet=` and the ID (the long part between `/d/` and `/edit`) to the end of the dashboard's address.

## 4. Check it, then clear the samples
Check that the dashboard matches the sheet. Then delete every row whose Notes say **SAMPLE**, and keep the roster rows at the top. The yellow banner on the dashboard goes away once they're gone.

## How it works (one tab: "Tracker")
| Row | What to fill in |
|---|---|
| **Player on the roster** | Player + **#**. These are the rows at the top; add a row to add a player. |
| **Money received** | Player, Date, From, **Amount**, Method, Type. Leave Player blank for a team-wide donation. |
| **Deposit** | Same as money, with Type **Deposit**. That's how the dashboard marks the deposit in. |
| **Sponsor being asked** | Player, From (the company), Type **Sponsor**, Status (Asked / Pledged / Declined). No Amount. |
| **Sponsor pays** | Fill in Date, Amount, and Method on that same sponsor row. It switches to Paid. |
| **Table collection** | One row per boy with his share, Type **Fundraiser**, and a note like "Split with Jake ($125 total)". |

Hover over any column header in the sheet for a reminder. Keep each player's name spelled the same as on his roster row. The dashboard flags any name it doesn't recognize at the bottom of the page.

Goal, deposit amount, team discount, and the deposit deadline are set in `js/config.js`, not the sheet.

The dashboard re-reads the sheet when it opens, every minute while it's open, and on **Refresh**.
