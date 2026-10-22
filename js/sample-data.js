// Made-up numbers so every state shows before the real sheet is linked:
// no money yet, partway, exactly full, over the goal, deposit in or not.
// Same row shape the live Google Sheet produces (keys are the column headers,
// lowercased with spaces removed).
window.BRANSON_SAMPLE = {
  settings: [{ goalperplayer: '1000', depositamount: '50', depositdeadline: '', teamdiscount: '100', tripname: 'Ballparks of America, Branson, MO' }],
  players: [
    { number: '7', name: 'Owen Ackerman' }, { number: '5', name: 'Kayden Lyons' },
    { number: '99', name: 'Jaxsen Rodriguez' }, { number: '12', name: 'Dom Diaz' },
    { number: '13', name: 'Jake Harris' }, { number: '11', name: 'Kameren Branch' },
    { number: '68', name: 'Caleb Gingras' }, { number: '29', name: 'Ethan Ladanyi' },
    { number: '4', name: 'Sammy Van Tassel' }, { number: '15', name: 'Mason Frank' },
    { number: '16', name: 'Johnathan Velez' }, { number: '14', name: 'Liam Tineo' },
    { number: '2', name: 'Liam Pichardo' }, { number: '?', name: 'Robby Glas' }
  ],
  payments: [
    { date: '9/02/2026', player: 'Owen Ackerman', from: 'Ackerman Family', amount: '50', method: 'Venmo', type: 'Deposit', notes: '' },
    { date: '9/20/2026', player: 'Owen Ackerman', from: 'Riverside Auto Body', amount: '500', method: 'Check', type: 'Sponsor', notes: '' },
    { date: '10/05/2026', player: 'Owen Ackerman', from: 'Grandma & Grandpa', amount: '200', method: 'Check', type: 'Family', notes: '' },
    { date: '10/12/2026', player: 'Owen Ackerman', from: 'Main Street Pizza', amount: '250', method: 'Check', type: 'Sponsor', notes: '' },
    { date: '9/03/2026', player: 'Kayden Lyons', from: 'Lyons Family', amount: '50', method: 'Venmo', type: 'Deposit', notes: '' },
    { date: '10/01/2026', player: 'Kayden Lyons', from: 'Summit Landscaping', amount: '300', method: 'Check', type: 'Sponsor', notes: '' },
    { date: '9/04/2026', player: 'Jaxsen Rodriguez', from: 'Rodriguez Family', amount: '50', method: 'Cash', type: 'Deposit', notes: '' },
    { date: '9/28/2026', player: 'Jaxsen Rodriguez', from: 'Northside Dental', amount: '1000', method: 'Check', type: 'Sponsor', notes: 'Big one!' },
    { date: '10/15/2026', player: 'Jaxsen Rodriguez', from: 'Rodriguez Family', amount: '290', method: 'Venmo', type: 'Family', notes: '' },
    { date: '9/05/2026', player: 'Dom Diaz', from: 'Diaz Family', amount: '50', method: 'Venmo', type: 'Deposit', notes: '' },
    { date: '10/08/2026', player: 'Dom Diaz', from: 'Bat Night fundraiser', amount: '120', method: 'Cash', type: 'Fundraiser', notes: '' },
    { date: '9/06/2026', player: 'Jake Harris', from: 'Harris Family', amount: '50', method: 'Venmo', type: 'Deposit', notes: '' },
    { date: '10/02/2026', player: 'Jake Harris', from: 'Harris Plumbing & Heating', amount: '600', method: 'Check', type: 'Sponsor', notes: '' },
    { date: '10/18/2026', player: 'Jake Harris', from: 'Lakeview Diner', amount: '150', method: 'Check', type: 'Sponsor', notes: '' },
    { date: '9/08/2026', player: 'Caleb Gingras', from: 'Gingras Family', amount: '50', method: 'Zelle', type: 'Deposit', notes: '' },
    { date: '9/30/2026', player: 'Caleb Gingras', from: 'Pine Hill Hardware', amount: '450', method: 'Check', type: 'Sponsor', notes: '' },
    { date: '10/10/2026', player: 'Caleb Gingras', from: 'Gingras Family', amount: '500', method: 'Venmo', type: 'Family', notes: '' },
    { date: '9/09/2026', player: 'Ethan Ladanyi', from: 'Ladanyi Family', amount: '50', method: 'Venmo', type: 'Deposit', notes: '' },
    { date: '9/10/2026', player: 'Sammy Van Tassel', from: 'Van Tassel Family', amount: '50', method: 'Check', type: 'Deposit', notes: '' },
    { date: '10/14/2026', player: 'Sammy Van Tassel', from: 'Coastal Realty Group', amount: '250', method: 'Check', type: 'Sponsor', notes: '' },
    { date: '9/11/2026', player: 'Mason Frank', from: 'Frank Family', amount: '50', method: 'Venmo', type: 'Deposit', notes: '' },
    { date: '10/03/2026', player: 'Mason Frank', from: 'Frank Family', amount: '400', method: 'Venmo', type: 'Family', notes: '' },
    { date: '9/12/2026', player: 'Liam Tineo', from: 'Tineo Family', amount: '50', method: 'Cash', type: 'Deposit', notes: '' },
    { date: '10/16/2026', player: 'Liam Pichardo', from: 'Westgate Tire', amount: '200', method: 'Check', type: 'Sponsor', notes: '' },
    { date: '10/19/2026', player: 'Owen Ackerman', from: "Dunkin' Donuts table", amount: '62.50', method: 'Cash', type: 'Fundraiser', notes: 'Split with Jake ($125 total)' },
    { date: '10/19/2026', player: 'Jake Harris', from: "Dunkin' Donuts table", amount: '62.50', method: 'Cash', type: 'Fundraiser', notes: 'Split with Owen ($125 total)' },
    { date: '10/06/2026', player: '', from: 'Anonymous', amount: '250', method: 'Check', type: 'Other', notes: 'For the whole team' }
  ],
  sponsors: [
    { player: 'Owen Ackerman', company: 'Riverside Auto Body', contact: 'Mike R.', status: 'Paid', pledgedamount: '500', notes: '' },
    { player: 'Owen Ackerman', company: 'Main Street Pizza', contact: '', status: 'Paid', pledgedamount: '250', notes: '' },
    { player: 'Owen Ackerman', company: 'Hilltop Insurance', contact: 'Front desk', status: 'Asked', pledgedamount: '', notes: 'Follow up next week' },
    { player: 'Kayden Lyons', company: 'Summit Landscaping', contact: '', status: 'Paid', pledgedamount: '300', notes: '' },
    { player: 'Kayden Lyons', company: 'Brookside Bakery', contact: '', status: 'Pledged', pledgedamount: '150', notes: 'Check coming' },
    { player: 'Kayden Lyons', company: 'Valley Fitness', contact: '', status: 'Declined', pledgedamount: '', notes: '' },
    { player: 'Jaxsen Rodriguez', company: 'Northside Dental', contact: 'Dr. Patel', status: 'Paid', pledgedamount: '1000', notes: '' },
    { player: 'Jake Harris', company: 'Harris Plumbing & Heating', contact: '', status: 'Paid', pledgedamount: '600', notes: '' },
    { player: 'Jake Harris', company: 'Lakeview Diner', contact: '', status: 'Paid', pledgedamount: '150', notes: '' },
    { player: 'Caleb Gingras', company: 'Pine Hill Hardware', contact: '', status: 'Paid', pledgedamount: '450', notes: '' },
    { player: 'Ethan Ladanyi', company: 'Oak Street Chiropractic', contact: '', status: 'Pledged', pledgedamount: '400', notes: '' },
    { player: 'Ethan Ladanyi', company: 'Bayshore Marina', contact: '', status: 'Asked', pledgedamount: '', notes: '' },
    { player: 'Sammy Van Tassel', company: 'Coastal Realty Group', contact: '', status: 'Paid', pledgedamount: '250', notes: '' },
    { player: 'Liam Pichardo', company: 'Westgate Tire', contact: '', status: 'Paid', pledgedamount: '200', notes: '' },
    { player: 'Kameren Branch', company: 'Elm Street Barbers', contact: '', status: 'Asked', pledgedamount: '', notes: '' }
  ]
};
