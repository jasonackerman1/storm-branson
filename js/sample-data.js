// Made-up numbers so every state shows before the real sheet is linked:
// no money yet, partway, exactly full, over the goal, deposit in or not.
// Same row shape as the one-tab Google Sheet ("Tracker"): keys are the column
// headers lowercased. Every Player name gets a jersey, and his # only needs to
// be on one of his rows. Kids with no money yet just have a name-only row.
window.BRANSON_SAMPLE = {
  rows: [
    { player: "Owen Ackerman", number: "7", date: "9/02/2026", from: "Ackerman Family", amount: "50", method: "Venmo", type: "Deposit" },
    { player: "Owen Ackerman", date: "9/20/2026", from: "Riverside Auto Body", amount: "500", method: "Check", type: "Sponsor", status: "Paid" },
    { player: "Owen Ackerman", date: "10/05/2026", from: "Grandma & Grandpa", amount: "200", method: "Check", type: "Family" },
    { player: "Owen Ackerman", date: "10/12/2026", from: "Main Street Pizza", amount: "250", method: "Check", type: "Sponsor", status: "Paid" },
    { player: "Owen Ackerman", date: "10/19/2026", from: "Dunkin' Donuts table", amount: "62.50", method: "Cash", type: "Fundraiser", notes: "Split with Jake ($125 total)" },
    { player: "Owen Ackerman", from: "Hilltop Insurance", type: "Sponsor", status: "Asked", notes: "Contact: Front desk · Follow up next week" },
    { player: "Kayden Lyons", number: "5", date: "9/03/2026", from: "Lyons Family", amount: "50", method: "Venmo", type: "Deposit" },
    { player: "Kayden Lyons", date: "10/01/2026", from: "Summit Landscaping", amount: "300", method: "Check", type: "Sponsor", status: "Paid" },
    { player: "Kayden Lyons", from: "Brookside Bakery", type: "Sponsor", status: "Pledged", notes: "Pledged $150 · Check coming" },
    { player: "Kayden Lyons", from: "Valley Fitness", type: "Sponsor", status: "Declined" },
    { player: "Jaxsen Rodriguez", number: "99", date: "9/04/2026", from: "Rodriguez Family", amount: "50", method: "Cash", type: "Deposit" },
    { player: "Jaxsen Rodriguez", date: "9/28/2026", from: "Northside Dental", amount: "1000", method: "Check", type: "Sponsor", status: "Paid", notes: "Big one!" },
    { player: "Jaxsen Rodriguez", date: "10/15/2026", from: "Rodriguez Family", amount: "290", method: "Venmo", type: "Family" },
    { player: "Dom Diaz", number: "12", date: "9/05/2026", from: "Diaz Family", amount: "50", method: "Venmo", type: "Deposit" },
    { player: "Dom Diaz", date: "10/08/2026", from: "Bat Night fundraiser", amount: "120", method: "Cash", type: "Fundraiser" },
    { player: "Jake Harris", number: "13", date: "9/06/2026", from: "Harris Family", amount: "50", method: "Venmo", type: "Deposit" },
    { player: "Jake Harris", date: "10/02/2026", from: "Harris Plumbing & Heating", amount: "600", method: "Check", type: "Sponsor", status: "Paid" },
    { player: "Jake Harris", date: "10/18/2026", from: "Lakeview Diner", amount: "150", method: "Check", type: "Sponsor", status: "Paid" },
    { player: "Jake Harris", date: "10/19/2026", from: "Dunkin' Donuts table", amount: "62.50", method: "Cash", type: "Fundraiser", notes: "Split with Owen ($125 total)" },
    { player: "Kameren Branch", number: "11" },
    { player: "Caleb Gingras", number: "68", date: "9/08/2026", from: "Gingras Family", amount: "50", method: "Zelle", type: "Deposit" },
    { player: "Caleb Gingras", date: "9/30/2026", from: "Pine Hill Hardware", amount: "450", method: "Check", type: "Sponsor", status: "Paid" },
    { player: "Caleb Gingras", date: "10/10/2026", from: "Gingras Family", amount: "500", method: "Venmo", type: "Family" },
    { player: "Ethan Ladanyi", number: "29", date: "9/09/2026", from: "Ladanyi Family", amount: "50", method: "Venmo", type: "Deposit" },
    { player: "Ethan Ladanyi", from: "Oak Street Chiropractic", type: "Sponsor", status: "Pledged", notes: "Pledged $400" },
    { player: "Ethan Ladanyi", from: "Bayshore Marina", type: "Sponsor", status: "Asked" },
    { player: "Sammy Van Tassel", number: "4", date: "9/10/2026", from: "Van Tassel Family", amount: "50", method: "Check", type: "Deposit" },
    { player: "Sammy Van Tassel", date: "10/14/2026", from: "Coastal Realty Group", amount: "250", method: "Check", type: "Sponsor", status: "Paid" },
    { player: "Mason Frank", number: "15", date: "9/11/2026", from: "Frank Family", amount: "50", method: "Venmo", type: "Deposit" },
    { player: "Mason Frank", date: "10/03/2026", from: "Frank Family", amount: "400", method: "Venmo", type: "Family" },
    { player: "Johnathan Velez", number: "16" },
    { player: "Liam Tineo", number: "14", date: "9/12/2026", from: "Tineo Family", amount: "50", method: "Cash", type: "Deposit" },
    { player: "Liam Pichardo", number: "2", date: "10/16/2026", from: "Westgate Tire", amount: "200", method: "Check", type: "Sponsor", status: "Paid" },
    { player: "Robby Glas", number: "?" },
    { date: "10/06/2026", from: "Anonymous", amount: "250", method: "Check", type: "Other", notes: "For the whole team" }
  ]
};
