# Client Lead Management System (Mini CRM) 🚀

A production-quality full-stack CRM system designed for businesses and agencies to efficiently manage incoming leads, track conversions, and maintain follow-up notes.

![CRM Dashboard](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200)

## ✨ Features

- **Admin Authentication**: Secure JWT-based login with hashed passwords.
- **Lead Submission API**: Public endpoint for website contact forms.
- **Dynamic Dashboard**: Real-time statistics on lead statuses and trends.
- **Lead Management**: Advanced table with filtering, searching, and sorting.
- **Status Tracking**: Update lead lifecycle from 'New' to 'Converted'.
- **Timeline Notes**: Add and view timestamped follow-up history for every lead.
- **Responsive Design**: Premium UI built with Tailwind CSS and Framer Motion.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Axios, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Security**: JWT, BcryptJS, Helmet.
- **Environment**: Dotenv for secure configuration.

## 🚀 Installation

### 1. Prerequisites
- Node.js installed
- MongoDB installed locally or an Atlas URI

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/crm
JWT_SECRET=your_jwt_secret
```

### 3. Seed Database (Optional but Recommended)
Create an admin user and sample leads:
```bash
node seed.js
```
*Default Credentials*: `admin@example.com` / `password123`

### 4. Frontend Setup
```bash
cd ../client
npm install
```

## 🏃 Running the Application

### Start Backend
```bash
cd server
npm run dev
```

### Start Frontend
```bash
cd client
npm run dev
```

## 🔌 API Routes

### Authentication
- `POST /api/auth/login` - Admin login

### Leads
- `POST /api/leads` - Submit a new lead (Public)
- `GET /api/leads` - Get all leads (Protected)
- `GET /api/leads/:id` - Get lead details (Protected)
- `PUT /api/leads/:id` - Update lead status (Protected)
- `DELETE /api/leads/:id` - Delete a lead (Protected)
- `POST /api/leads/:id/notes` - Add a note (Protected)

## 📸 Future Improvements
- [ ] Email notifications for new leads.
- [ ] Multi-admin role management.
- [ ] Lead assignment to specific team members.
- [ ] Data export to CSV/Excel.

## 📄 License
MIT License. Free to use and modify.

---
**Developed by Antigravity**
