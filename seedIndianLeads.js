const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Lead = require('./models/leadModel.js');

dotenv.config({ path: __dirname + '/.env' });

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const firstNames = [
  'Arjun', 'Aditya', 'Rahul', 'Siddharth', 'Varun', 'Ishant', 'Priya', 'Ananya', 'Sneha', 'Kavita',
  'Rohit', 'Amit', 'Sanjay', 'Deepika', 'Kunal', 'Manish', 'Neha', 'Pooja', 'Vikram', 'Rajesh',
  'Sunita', 'Meera', 'Rohan', 'Aakash', 'Tanvi', 'Isha', 'Aarav', 'Vihaan', 'Sai', 'Karthik',
  'Deepak', 'Suresh', 'Ramesh', 'Lata', 'Geeta', 'Anjali', 'Preeti', 'Abhishek', 'Vivek', 'Nitin'
];

const lastNames = [
  'Sharma', 'Verma', 'Gupta', 'Patel', 'Reddy', 'Singh', 'Kumar', 'Mehta', 'Nair', 'Iyer',
  'Deshmukh', 'Joshi', 'Kulkarni', 'Bose', 'Chatterjee', 'Dubey', 'Mishra', 'Tiwari', 'Yadav', 'Rao'
];

const sources = ['Website Contact Form', 'LinkedIn Outreach', 'Referral Network', 'Instagram Ad', 'Google Search', 'Organic Search'];
const statuses = ['New', 'Contacted', 'Converted'];
const interests = [
  'Enterprise CRM Solutions', 'Sales Automation', 'Lead Tracking APIs', 'Customer Retention Strategies',
  'Cloud-based Marketing Tools', 'AI-driven Sales Analytics', 'SaaS Platform Integration', 'Custom CRM Development'
];
const messages = [
  "I'm interested in integrating your CRM with our current workflow. Can we schedule a demo?",
  "Looking for a cost-effective solution for our startup's sales team. What are your pricing plans?",
  "We are currently evaluating several CRM platforms. Could you send over a feature list?",
  "I saw your ad on LinkedIn and would like to know more about the automation features.",
  "Referred by a partner. I want to explore how your platform can improve our customer retention.",
  "Our sales pipeline is getting complex. Need a robust tool like LeadFlow to manage our leads better.",
  "Interested in the API documentation for custom integrations. Who should I speak with?",
  "Could you please provide a walkthrough of the analytics dashboard? It looks very promising."
];


const seedIndianLeads = async () => {
  try {
    // Keep existing admin and other data but add these new ones
    // Or we can delete existing ones if preferred. User asked to "add", so let's just append.
    
    const leads = [];
    for (let i = 0; i < 50; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const domain = ['gmail.com', 'outlook.com', 'yahoo.in', 'company.in', 'startup.co.in'];
        
        leads.push({
            name: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${domain[Math.floor(Math.random() * domain.length)]}`,
            phone: `+91 ${Math.floor(Math.random() * 10) === 0 ? '9' : Math.floor(6 + Math.random() * 4)}${Math.floor(100000000 + Math.random() * 899999999)}`, // more realistic Indian mobile format
            source: sources[Math.floor(Math.random() * sources.length)],
            message: `${messages[Math.floor(Math.random() * messages.length)]} Focus area: ${interests[Math.floor(Math.random() * interests.length)]}.`,
            status: statuses[Math.floor(Math.random() * statuses.length)]
        });

    }

    await Lead.insertMany(leads);

    console.log('Successfully added 50 Indian leads to the database.');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedIndianLeads();
