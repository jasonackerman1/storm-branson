// The Google Sheet this dashboard reads. Paste the long ID from the sheet's
// address bar between the quotes:
//   https://docs.google.com/spreadsheets/d/THIS_PART_IS_THE_ID/edit
// Leave it empty to show the built-in sample data.
// For testing without editing this file, add ?sheet=THE_ID to the page address.
window.BRANSON_CONFIG = {
  sheetId: '',
  // How often an open page re-checks the sheet, in seconds.
  refreshSeconds: 60
};
