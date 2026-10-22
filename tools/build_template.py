"""Builds template/Storm-Branson-Tracker.xlsx, the one-tab sheet ("Tracker") the
dashboard reads. It starts with one row per player: just his name and #.

Run:  python3 tools/build_template.py

How the dashboard reads the tab:
  - every name in Player gets a jersey; his # can be on any one of his rows
  - a row with Amount = money received (Player blank = General Fund)
  - a Sponsor row with a Status and no Amount = a company that's been asked
A player's first donation can go right into his starting row.
The # column is plain text so "?" survives: Google's CSV export blanks any value
whose type doesn't match the rest of its column.
"""
import json
import os
import subprocess
from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.styles import Font, PatternFill
from openpyxl.worksheet.datavalidation import DataValidation

HERE = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_DIR = os.path.join(HERE, '..', 'template')
SAMPLE_JS = os.path.join(HERE, '..', 'js', 'sample-data.js')
MAX_ROWS = 1000

COLUMNS = [
    # header, width, hover note
    ('Player', 22, 'The player this row is for. Typing a new name adds a jersey to the dashboard. Leave blank for a donation to the whole team (General Fund).'),
    ('#', 6, 'Jersey number. Only needed once per player, on any one of his rows. Use ? if he doesn\'t have one yet.'),
    ('Date', 12, 'The day the money came in.'),
    ('From', 28, 'Who it came from: a company, Grandma & Grandpa, a fundraiser table...'),
    ('Amount', 11, 'Dollars received. Leave blank on a sponsor row until their money actually arrives.'),
    ('Method', 11, 'Check, Venmo, Cash, Zelle, PayPal, or Other.'),
    ('Type', 12, 'Deposit = the $50 commitment deposit. Sponsor = a company. Family, Fundraiser (e.g. a table split between boys: one row per boy with his share), or Other.'),
    ('Status', 11, 'Sponsors only: Asked, Pledged, Paid, or Declined.'),
    ('Notes', 40, 'Anything else, e.g. "Pledged $150" or "Split with Jake ($125 total)".'),
]
HEAD_FILL = PatternFill('solid', fgColor='000000')
HEAD_FONT = Font(bold=True, color='F8B000')


def load_sample():
    js = ('global.window={};require(process.argv[1]);'
          'process.stdout.write(JSON.stringify(window.BRANSON_SAMPLE))')
    return json.loads(subprocess.check_output(['node', '-e', js, os.path.abspath(SAMPLE_JS)]))['rows']


def build(out, players):
    wb = Workbook()
    ws = wb.active
    ws.title = 'Tracker'
    for i, (name, width, note) in enumerate(COLUMNS, start=1):
        c = ws.cell(row=1, column=i, value=name)
        c.fill, c.font = HEAD_FILL, HEAD_FONT
        c.comment = Comment(note, 'Storm')
        ws.column_dimensions[c.column_letter].width = width
    ws.freeze_panes = 'A2'

    for r in range(2, MAX_ROWS + 1):
        ws.cell(row=r, column=2).number_format = '@'
        ws.cell(row=r, column=3).number_format = 'm/d/yyyy'
        ws.cell(row=r, column=5).number_format = '"$"#,##0.00'
        for col in (1, 4, 9):
            ws.cell(row=r, column=col).number_format = '@'

    for i, r in enumerate(players, start=2):
        ws.cell(row=i, column=1, value=r['player'])
        ws.cell(row=i, column=2, value=r['number'])

    for rng, items in (('F2:F%d', 'Check,Venmo,Cash,Zelle,PayPal,Other'),
                       ('G2:G%d', 'Deposit,Sponsor,Family,Fundraiser,Other'),
                       ('H2:H%d', 'Asked,Pledged,Paid,Declined')):
        dv = DataValidation(type='list', formula1='"' + items + '"', allow_blank=True)
        ws.add_data_validation(dv)
        dv.add(rng % MAX_ROWS)

    os.makedirs(os.path.dirname(out), exist_ok=True)
    wb.save(out)
    print('wrote', os.path.normpath(out), '-', len(players), 'players')


# The roster comes from the sample data's numbered rows, so there's one list to keep current.
players = [{'player': r['player'], 'number': r['number']} for r in load_sample() if r.get('number')]
build(os.path.join(TEMPLATE_DIR, 'Storm-Branson-Tracker.xlsx'), players)
