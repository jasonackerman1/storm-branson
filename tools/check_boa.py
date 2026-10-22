#!/usr/bin/env python3
"""Watch the Ballparks of America pages that "Know Before You Go" is based on.

Once a week (.github/workflows/check-boa.yml) this reads each page below, keeps
a plain-text copy in data/boa/, and compares it with last week's copy. If any
wording changed, or a Prep Kit PDF link appears, disappears or stops working,
it writes boa_alert.txt so the workflow can open a GitHub issue, which emails
Jason. It never edits the dashboard itself: a person reads the change and
decides whether the section needs updating.

It also writes data/boa-check.json, which the dashboard reads to show when the
section was last checked.

Uses only the Python standard library.
"""
import datetime
import difflib
import html
import json
import os
import re
import urllib.request

ROOT = os.path.join(os.path.dirname(__file__), '..')
SNAP_DIR = os.path.join(ROOT, 'data', 'boa')
STATUS = os.path.join(ROOT, 'data', 'boa-check.json')
ALERT = os.path.join(ROOT, 'boa_alert.txt')

PAGES = {
    'event': ('2027 Global Games event page', 'https://www.ballparksofamerica.com/event-46760'),
    'registered-teams': ('Registered Teams page', 'https://www.ballparksofamerica.com/registered-teams'),
    'faq': ('FAQ', 'https://www.ballparksofamerica.com/faq'),
}
PDF_RE = re.compile(r'https://content\.ballparksofamerica\.app/[^"\'\\\s<>]+\.pdf')
# Lines that change without meaning anything (page chrome, loaders, the footer year).
NOISE = re.compile(r'^(Loading\.\.\.|©|\d{4} Ballparks of America|﻿)$')
UA = {'User-Agent': 'Mozilla/5.0 (storm-branson page check)'}


def fetch(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as res:
        return res.read().decode('utf-8', 'replace')


def page_text(raw):
    """The page's readable text, one line per block, without scripts or styles."""
    s = re.sub(r'<(script|style|noscript)\b.*?</\1>', '', raw, flags=re.S | re.I)
    s = html.unescape(re.sub(r'<[^>]+>', '\n', s)).replace('\xa0', ' ')
    lines = [re.sub(r'\s+', ' ', l).strip() for l in s.splitlines()]
    return [l for l in lines if l and not NOISE.match(l)]


def pdf_ok(url):
    try:
        req = urllib.request.Request(url, headers=UA, method='HEAD')
        with urllib.request.urlopen(req, timeout=60) as res:
            return res.status == 200
    except Exception:
        return False


def read_lines(path):
    if not os.path.exists(path):
        return None
    with open(path) as f:
        return f.read().splitlines()


def main():
    os.makedirs(SNAP_DIR, exist_ok=True)
    notes = []
    pdfs = set()

    for key, (name, url) in PAGES.items():
        raw = fetch(url)
        pdfs.update(PDF_RE.findall(raw))
        new = page_text(raw)
        if len(new) < 20:
            notes.append('## %s\n%s\nCould only read %d lines from this page. It may have moved or changed '
                         'how it loads, so the check needs a look.' % (name, url, len(new)))
            continue
        path = os.path.join(SNAP_DIR, key + '.txt')
        old = read_lines(path)
        if old is not None and old != new:
            diff = list(difflib.unified_diff(old, new, 'last week', 'this week', n=1, lineterm=''))
            notes.append('## %s\n%s\n\n```diff\n%s\n```' % (name, url, '\n'.join(diff[2:])))
        with open(path, 'w') as f:
            f.write('\n'.join(new) + '\n')

    # Prep Kit PDFs: new ones (the 2027 kits) or old ones going away or breaking.
    pdf_path = os.path.join(SNAP_DIR, 'prep-kit-links.txt')
    old_pdfs = read_lines(pdf_path)
    new_pdfs = sorted(pdfs)
    if old_pdfs is not None:
        added = [u for u in new_pdfs if u not in old_pdfs]
        removed = [u for u in old_pdfs if u not in new_pdfs]
        if added or removed:
            notes.append('## Prep Kit links\n' + ''.join('\nNew: ' + u for u in added) +
                         ''.join('\nGone: ' + u for u in removed) +
                         '\n\nIf these are the 2027 kits, the two download buttons in Know Before You Go need the new links.')
    with open(pdf_path, 'w') as f:
        f.write('\n'.join(new_pdfs) + '\n')
    with open(os.path.join(ROOT, 'index.html')) as f:
        linked = sorted(set(PDF_RE.findall(f.read())))
    broken = [u for u in linked if not pdf_ok(u)]
    if broken:
        notes.append('## Broken download buttons\nThese Prep Kit links on the dashboard no longer open:' +
                     ''.join('\n' + u for u in broken))

    today = datetime.date.today().isoformat()
    status = {}
    if os.path.exists(STATUS):
        with open(STATUS) as f:
            status = json.load(f)
    status['lastChecked'] = today
    if notes:
        status['lastChanged'] = today
    with open(STATUS, 'w') as f:
        json.dump(status, f, indent=2)
        f.write('\n')

    if notes:
        body = ('Something changed on the Ballparks of America pages that "Know Before You Go" is based on. '
                'Lines starting with - are the old wording and + the new. Check whether the dashboard needs '
                'an update.\n\n' + '\n\n'.join(notes))
        with open(ALERT, 'w') as f:
            f.write(body[:60000])
        print(body)
    else:
        print('No changes.')


if __name__ == '__main__':
    main()
