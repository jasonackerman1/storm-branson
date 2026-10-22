"""Builds template/Storm-Branson-Tracker.xlsx — the spreadsheet the dashboard reads.

Upload the result to Google Drive and save it as a Google Sheet (see SETUP.md).
Run:  python3 tools/build_template.py

Column rules that matter for the live dashboard (Google's CSV export drops any
value whose type doesn't match the rest of its column):
  - Players "Number" is plain text, so "?" survives next to real numbers.
  - Settings is one row with one setting per column, so no column mixes types.
"""
import os
from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.worksheet.datavalidation import DataValidation

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'template', 'Storm-Branson-Tracker.xlsx')

PLAYERS = [
    ('7', 'Owen Ackerman'), ('5', 'Kayden Lyons'), ('99', 'Jaxsen Rodriguez'),
    ('12', 'Dom Diaz'), ('13', 'Jake Harris'), ('11', 'Kameren Branch'),
    ('68', 'Caleb Gingras'), ('29', 'Ethan Ladanyi'), ('4', 'Sammy Van Tassel'),
    ('15', 'Mason Frank'), ('16', 'Johnathan Velez'), ('14', 'Liam Tineo'),
    ('2', 'Liam Pichardo'), ('?', 'Robby Glas'),
]
MAX_ROWS = 1000

HEAD_FILL = PatternFill('solid', fgColor='000000')
HEAD_FONT = Font(bold=True, color='F8B000')
NOTE_FONT = Font(italic=True, color='7A6A55')


def header(ws, cols, widths):
    for i, (name, width) in enumerate(zip(cols, widths), start=1):
        c = ws.cell(row=1, column=i, value=name)
        c.fill, c.font = HEAD_FILL, HEAD_FONT
        ws.column_dimensions[c.column_letter].width = width
    ws.freeze_panes = 'A2'


def dropdown(ws, rng, formula, blank_ok=True, error=None):
    dv = DataValidation(type='list', formula1=formula, allow_blank=blank_ok)
    if error:
        dv.showErrorMessage, dv.errorTitle, dv.error = True, 'Pick from the list', error
    ws.add_data_validation(dv)
    dv.add(rng)


wb = Workbook()

# --- Instructions --------------------------------------------------------
ws = wb.active
ws.title = 'Instructions'
ws.column_dimensions['A'].width = 110
lines = [
    ('STORM: ROAD TO BRANSON  (money tracker)', Font(bold=True, size=14)),
    ('The dashboard reads this sheet every time it loads. Edit here, and the dashboard updates.', None),
    ('', None),
    ('PAYMENTS tab: add one row for every check, Venmo, or cash payment that comes in.', Font(bold=True)),
    ('  Date: the day it came in.   Player: pick the player from the dropdown. Leave it BLANK for a donation that isn\'t for a specific player (it goes to the General Fund).', None),
    ('  From: who sent it (a company, a grandparent, the family...).   Amount: dollars only, e.g. 150.', None),
    ('  Method: Check / Venmo / Cash / Zelle / PayPal / Other.', None),
    ('  Type: pick "Deposit" for the $50 commitment deposit. That is how the dashboard knows a player\'s deposit is in.', None),
    ('        Use Sponsor for company donations, Family for money from the player\'s family, Fundraiser for event money.', None),
    ('  Every payment, including the deposit, counts toward the player\'s $1,000 bucket.', None),
    ('', None),
    ('SPONSORS tab: the companies each player is asking for donations.', Font(bold=True)),
    ('  Status: Asked, Pledged, Paid, or Declined. Pledged Amount: what they promised (optional).', None),
    ('  When the money actually arrives, ALSO add it on the Payments tab, with the same company name in "From".', None),
    ('', None),
    ('PLAYERS tab: the roster. Add or remove rows and the dashboard follows. Keep names spelled exactly the same everywhere.', Font(bold=True)),
    ('SETTINGS tab: goal per player, deposit amount, deposit deadline (type it like 3/1/2027), team discount.', Font(bold=True)),
    ('', None),
    ('Don\'t rename the tabs or the column headers in row 1. The dashboard finds data by those names.', NOTE_FONT),
]
for r, (text, font) in enumerate(lines, start=1):
    c = ws.cell(row=r, column=1, value=text)
    if font:
        c.font = font
    c.alignment = Alignment(wrap_text=True)

# --- Settings (one row, one setting per column) --------------------------
ws = wb.create_sheet('Settings')
header(ws, ['Goal Per Player', 'Deposit Amount', 'Deposit Deadline', 'Team Discount', 'Trip Name'],
       [18, 18, 20, 18, 46])
ws.append([1000, 50, None, 100, 'Ballparks of America, Branson, MO'])
ws['A2'].number_format = ws['B2'].number_format = ws['D2'].number_format = '"$"#,##0'
ws['C2'].number_format = 'm/d/yyyy'

# --- Players --------------------------------------------------------------
ws = wb.create_sheet('Players')
header(ws, ['Number', 'Name'], [10, 28])
for num, name in PLAYERS:
    ws.append([num, name])
for r in range(2, MAX_ROWS + 1):
    ws.cell(row=r, column=1).number_format = '@'  # keep "?" alongside real numbers

player_list = f'Players!$B$2:$B${MAX_ROWS}'

# --- Payments ---------------------------------------------------------------
ws = wb.create_sheet('Payments')
header(ws, ['Date', 'Player', 'From', 'Amount', 'Method', 'Type', 'Notes'],
       [12, 22, 30, 12, 12, 13, 40])
for r in range(2, MAX_ROWS + 1):
    ws.cell(row=r, column=1).number_format = 'm/d/yyyy'
    ws.cell(row=r, column=4).number_format = '"$"#,##0.00'
    ws.cell(row=r, column=3).number_format = '@'
    ws.cell(row=r, column=7).number_format = '@'
dropdown(ws, f'B2:B{MAX_ROWS}', player_list,
         error='Pick a player from the list, or leave it blank for the General Fund.')
dropdown(ws, f'E2:E{MAX_ROWS}', '"Check,Venmo,Cash,Zelle,PayPal,Other"')
dropdown(ws, f'F2:F{MAX_ROWS}', '"Deposit,Sponsor,Family,Fundraiser,Other"')

# --- Sponsors ----------------------------------------------------------------
ws = wb.create_sheet('Sponsors')
header(ws, ['Player', 'Company', 'Contact', 'Status', 'Pledged Amount', 'Notes'],
       [22, 30, 24, 12, 16, 40])
for r in range(2, MAX_ROWS + 1):
    ws.cell(row=r, column=5).number_format = '"$"#,##0'
    for col in (2, 3, 6):
        ws.cell(row=r, column=col).number_format = '@'
dropdown(ws, f'A2:A{MAX_ROWS}', player_list, error='Pick a player from the list.')
dropdown(ws, f'D2:D{MAX_ROWS}', '"Asked,Pledged,Paid,Declined"')

wb.save(OUT)
print('wrote', os.path.normpath(OUT))
