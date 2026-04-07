const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel.js');
const Lead = require('./models/leadModel.js');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    await User.deleteMany();
    await Lead.deleteMany();

    const admin = await User.create({
      email: 'admin@example.com',
      password: 'password123',
    });

    console.log('Admin user created: admin@example.com / password123');

    await Lead.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        source: 'Website',
        message: 'I am interested in your services.',
        status: 'New',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '0987654321',
        source: 'LinkedIn',
        message: 'Can you provide more information about pricing?',
        status: 'Contacted',
      },
    ]);

    console.log('Sample leads created');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
