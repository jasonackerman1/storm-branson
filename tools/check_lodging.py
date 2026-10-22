#!/usr/bin/env python3
"""Check the family lodging price on EventConnect and save it to data/lodging.json.

We track one example room so families see a real number: the 2 Bedroom Condo
(2 Queen Beds with Queen Sofa Bed) at The Suites at Fall Creek, for the
tournament nights. Run daily by .github/workflows/check-lodging.yml. When the
price changes (or the room sells out), it writes a short note to
lodging_alert.txt so the workflow can open a GitHub issue, which emails Jason.

Uses only the Python standard library.
"""
import json
import os
import sys
import urllib.request

EVENT_ID = 46760
HOTEL_MATCH = 'Fall Creek'
ROOM_MATCH = '2 Bedroom Condo'
CHECK_IN = '2027-07-29'    # Thursday, Opening Ceremonies
CHECK_OUT = '2027-08-02'   # Monday, last day: 4 nights
QUOTED_AVG = 177           # the nightly average families were first shown
OUT = os.path.join(os.path.dirname(__file__), '..', 'data', 'lodging.json')
ALERT = os.path.join(os.path.dirname(__file__), '..', 'lodging_alert.txt')

URL = ('https://app.eventconnect.io/api/v2/events/{e}/procured-hotels?type=procured'
       '&ignore_private_rooms=true&show_unavailable_hotels=true&filter_by_rate_type=true'
       '&check_in={ci}&check_out={co}&event={e}&withRates=true&userLoggedIn=0&memberOnly=0'
       '&max_range=50').format(e=EVENT_ID, ci=CHECK_IN, co=CHECK_OUT)
PAGE = 'https://app.eventconnect.io/events/{e}/hotels'.format(e=EVENT_ID)


def fetch():
    req = urllib.request.Request(URL, headers={'User-Agent': 'Mozilla/5.0 (storm-branson price check)',
                                               'Accept': 'application/json'})
    with urllib.request.urlopen(req, timeout=60) as res:
        return json.load(res)


def main():
    data = fetch()
    hotel = next((h for h in data['data']['hotelContracts'] if HOTEL_MATCH in h['name']), None)
    if not hotel:
        sys.exit('Could not find a hotel matching %r. Has the event changed?' % HOTEL_MATCH)
    room = next((r for r in hotel['roomContracts'] if ROOM_MATCH in r['name']), None)
    if not room:
        sys.exit('Could not find a room matching %r at %s.' % (ROOM_MATCH, hotel['name']))

    resort = next((f['amount'] for f in hotel.get('fees', []) if f['type'] == 'per_night' and f['amount_type'] == 'dollar'), 0)
    tax = next((f['amount'] for f in hotel.get('fees', []) if f['amount_type'] == 'percent'), 0)

    new = {
        'hotel': hotel['name'],
        'room': room['name'],
        'checkIn': CHECK_IN,
        'checkOut': CHECK_OUT,
        'nights': 4,
        'avgNightly': float(room['averageRateWithMarkup']),
        'quotedAvg': QUOTED_AVG,
        'resortFeePerNight': float(resort),
        'taxPercent': float(tax),
        'roomsLeft': int(room.get('minimumNightlyRoomContractsRemaining') or 0),
        'soldOut': bool(room.get('soldOut')) or bool(hotel.get('isSoldOut')),
        'bookBy': (hotel.get('cutOff') or '')[:10],
        'url': PAGE,
    }

    old = {}
    if os.path.exists(OUT):
        with open(OUT) as f:
            old = json.load(f)

    notes = []
    if old and old.get('avgNightly') != new['avgNightly']:
        notes.append('The nightly average changed from $%g to $%g.' % (old['avgNightly'], new['avgNightly']))
    if new['soldOut'] and not old.get('soldOut'):
        notes.append('The room now shows as sold out.')
    if old and new['roomsLeft'] <= 3 < old.get('roomsLeft', 99):
        notes.append('Only %d of these rooms are left.' % new['roomsLeft'])

    with open(OUT, 'w') as f:
        json.dump(new, f, indent=2)
        f.write('\n')

    print('%s, %s: $%g/night avg, %d left' % (new['hotel'], new['room'], new['avgNightly'], new['roomsLeft']))
    if notes:
        with open(ALERT, 'w') as f:
            f.write('%s, %s (%s to %s)\n\n' % (new['hotel'], new['room'], CHECK_IN, CHECK_OUT))
            f.write('\n'.join(notes) + '\n\n')
            f.write('Quoted to families: $%g/night. Check it here: %s\n' % (QUOTED_AVG, PAGE))
        print('ALERT: ' + ' '.join(notes))


if __name__ == '__main__':
    main()
