// The Google Sheet this dashboard reads. Paste the long ID from the sheet's
// address bar between the quotes:
//   https://docs.google.com/spreadsheets/d/THIS_PART_IS_THE_ID/edit
// Leave it empty to show the built-in sample data.
// For testing without editing this file, add ?sheet=THE_ID to the page address.
window.BRANSON_CONFIG = {
  sheetId: '1Yq7uIxXvhTFiOYZuM3FBPv_WR4ru0dbDU67rKY58vLQ',
  // How often an open page re-checks the sheet, in seconds.
  refreshSeconds: 60,

  // Trip settings. These rarely change, so they live here, not in the sheet.
  goalPerPlayer: 1000,
  depositAmount: 50,
  depositDeadline: '',   // e.g. '3/1/2027' — the countdown shows once this is set
  teamDiscount: 0,      // $ off per player if every deposit is in; 0 hides the discount box
  tripName: 'Ballparks of America, Branson, MO',

  // The tournament (from ballparksofamerica.com/event-46760). Drives the
  // countdown and the dates under the Ballparks logo.
  event: {
    name: '2027 Global Games',
    start: '7/29/2027',
    end: '8/2/2027'
  },

  // Ballparks of America's team payment schedule, in order, from the 2027
  // Global Games event page. (Their general FAQ still shows an older
  // $1,000 / $3,000 / $3,000 schedule; go with the coach's EventConnect
  // dashboard if it differs.) The team total has to reach each running sum by
  // its due date; they show as marks on the team bar. The deposit has no date
  // because it's due when the team registers ($500 by 9/30, $1,000 from 10/1
  // on). The last payment is "the rest", so it uses the full team goal.
  teamPayments: [
    { label: 'Deposit', amount: 1000, due: '' },
    { label: '2nd payment', amount: 2500, due: '11/30/2026' },
    { label: '3rd payment', amount: 2500, due: '1/31/2027' },
    { label: 'Final payment', amount: 'rest', due: '4/1/2027' }
  ]
};
