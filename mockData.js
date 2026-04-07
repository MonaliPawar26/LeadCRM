const mockUser = {
  _id: "65ae31a494746000",
  email: "admin@example.com",
  name: "Admin Panel",
  password: "$pbkdf2-sha256$29000$...", // mock password
};

const mockLeads = [
  {
    _id: "65ae31a494746001",
    name: "Arjun Sharma",
    email: "arjun.sharma0@gmail.com",
    phone: "+91 9821345678",
    source: "LinkedIn Outreach",
    message: "I'm interested in integrating your CRM with our current workflow. Focus area: Sales Automation.",
    status: "New",
    notes: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    _id: "65ae31a494746002",
    name: "Priya Verma",
    email: "priya.verma1@outlook.com",
    phone: "+91 7401239485",
    source: "Google Search",
    message: "We are currently evaluating several CRM platforms. Focus area: Cloud-based Tools.",
    status: "Contacted",
    notes: [{ note: "Initial email sent", timestamp: new Date() }],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    _id: "65ae31a494746003",
    name: "Rahul Gupta",
    email: "rahul.gupta2@yahoo.in",
    phone: "+91 8593456123",
    source: "Referral Network",
    message: "Could you please provide a walkthrough of the analytics dashboard? Focus area: SaaS Integration.",
    status: "Converted",
    notes: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  }
];

// Dynamically generate the remaining 47 leads
const firstNames = ['Aditya', 'Siddharth', 'Varun', 'Ishant', 'Ananya', 'Sneha', 'Kavita', 'Rohit', 'Amit', 'Sanjay', 'Deepika', 'Kunal', 'Manish', 'Neha', 'Pooja', 'Vikram', 'Rajesh', 'Sunita', 'Meera', 'Rohan', 'Aakash', 'Tanvi', 'Isha', 'Aarav', 'Vihaan', 'Sai', 'Karthik', 'Deepak', 'Suresh', 'Ramesh', 'Lata', 'Geeta', 'Anjali', 'Preeti', 'Abhishek', 'Vivek', 'Nitin'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Patel', 'Reddy', 'Singh', 'Kumar', 'Mehta', 'Nair', 'Iyer', 'Deshmukh', 'Joshi', 'Kulkarni', 'Bose', 'Chatterjee', 'Dubey', 'Mishra', 'Tiwari', 'Yadav', 'Rao'];
const sources = ['Website Contact Form', 'LinkedIn Outreach', 'Referral Network', 'Instagram Ad', 'Google Search', 'Organic Search'];
const statuses = ['New', 'Contacted', 'Converted'];

// Daily distribution: spread 47 leads realistically across last 7 days
// Approximate per-day counts: [3, 5, 7, 8, 9, 8, 7] = 47 leads
// Day 0 = 6 days ago, Day 6 = today
const dailyPlan = [
  { daysAgo: 6, count: 3 },  // Mon-like: slow start
  { daysAgo: 5, count: 5 },  // Tue: picking up
  { daysAgo: 4, count: 7 },  // Wed: mid-week peak
  { daysAgo: 3, count: 9 },  // Thu: highest
  { daysAgo: 2, count: 8 },  // Fri: still strong
  { daysAgo: 1, count: 8 },  // Sat
  { daysAgo: 0, count: 7 },  // Today
];

let leadIndex = 4;
dailyPlan.forEach(({ daysAgo, count }) => {
  for (let j = 0; j < count; j++) {
    const i = leadIndex++;
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    // Vary hours within the day so they feel natural
    const hoursOffset = daysAgo * 24 + (j % 8) * 2;
    mockLeads.push({
      _id: `65ae31a4947460${i.toString().padStart(2, '0')}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@gmail.com`,
      phone: `+91 ${9000000000 + i * 123456}`,
      source: sources[i % sources.length],
      message: "Looking for a cost-effective solution for our startup's sales team. Focus area: Customer Retention.",
      // Distribute statuses realistically: older leads more likely converted/contacted
      status: daysAgo >= 4
        ? statuses[j % 2 === 0 ? 1 : 2]        // older days: Contacted/Converted
        : daysAgo >= 2
        ? statuses[j % 3]                        // mid days: mix of all
        : 'New',                                  // recent days: mostly New
      notes: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * hoursOffset).toISOString()
    });
  }
});

module.exports = { mockLeads, mockUser };
