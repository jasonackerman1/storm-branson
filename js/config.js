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
  teamDiscount: 100,
  tripName: 'Ballparks of America, Branson, MO'
};
