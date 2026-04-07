# 🚀 Client Lead Management System (Mini CRM)

A full-stack **Mini CRM (Customer Relationship Management)** application designed to help businesses efficiently manage leads, track conversions, and streamline follow-ups.

This project demonstrates real-world full-stack development using modern technologies and best practices.

---

## 🌐 Live Demo

🔗

---

## 📌 Project Overview

The Mini CRM system is built to simulate how businesses handle customer leads in real scenarios.
It provides a structured workflow to:

* Capture incoming leads
* Track their lifecycle
* Manage follow-ups
* Maintain organized customer data

This project focuses on **scalability, clean UI, and secure backend architecture**.

---

## ✨ Core Features

### 🔐 Authentication & Security

* Secure login system using **JWT (JSON Web Tokens)**
* Password hashing with **Bcrypt**
* Protected API routes
* Middleware-based authentication handling

---

### 📥 Lead Management System

* Create new leads from forms or API
* Update lead details dynamically
* Delete leads when no longer required
* Track lead lifecycle:

  * New
  * Contacted
  * Qualified
  * Converted

---

### 📊 Dashboard & Insights

* Overview of total leads
* Status-based categorization
* Real-time updates
* Clean and minimal dashboard UI

---

### 🔍 Search, Filter & Sorting

* Search leads by name/email
* Filter based on status
* Sort data for better usability

---

### 📝 Follow-up Notes System

* Add notes for each lead
* Timestamped entries
* Helps track communication history

---

### 📱 Responsive UI/UX

* Fully responsive design
* Works on mobile, tablet, and desktop
* Smooth animations using Framer Motion

---

## 🛠️ Tech Stack

### 🎨 Frontend

* React.js
* Tailwind CSS
* Axios
* Framer Motion

---

### ⚙️ Backend

* Node.js
* Express.js

---

### 🗄️ Database

* MongoDB (Mongoose ODM)

---

### 🔐 Security

* JWT Authentication
* BcryptJS
* Helmet

---

## 📁 Project Structure

```bash
CRM/
│── client/              # Frontend (React + Vite)
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│
│── server/              # Backend (Node + Express)
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│
│── package.json
│── package-lock.json
│── query
│── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Prerequisites

* Node.js installed
* MongoDB (Local or Atlas)

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create `.env` file inside `server`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

### 3️⃣ Frontend Setup

```bash
cd client
npm install
```

---

## ▶️ Running the Application

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

---

## 🔌 API Endpoints

### Authentication

* `POST /api/auth/login`

### Leads

* `POST /api/leads` → Create lead
* `GET /api/leads` → Get all leads
* `GET /api/leads/:id` → Get single lead
* `PUT /api/leads/:id` → Update lead
* `DELETE /api/leads/:id` → Delete lead
* `POST /api/leads/:id/notes` → Add note

---

## 🚀 Deployment Strategy

* Backend → Deploy on Render
* Frontend → Deploy on Vercel / Netlify

Ensure:

* Environment variables are configured
* API base URL is updated in frontend

---

## 📈 Future Scope & Enhancements

### 🔔 Notifications System

* Email alerts for new leads
* Follow-up reminders
* Real-time notifications

---

### 👥 Role-Based Access Control

* Admin, Manager, Employee roles
* Permission-based access
* Secure multi-user environment

---

### 📊 Advanced Analytics Dashboard

* Graphs and charts (lead conversion rate, trends)
* Performance tracking
* Monthly/weekly reports

---

### 📤 Data Export & Reporting

* Export leads to CSV / Excel
* Generate reports
* Download analytics data

---

### 🤝 Lead Assignment System

* Assign leads to team members
* Track individual performance
* Improve workflow distribution

---

### 🌐 Third-Party Integrations

* Email services (SendGrid, Nodemailer)
* CRM integrations
* Payment or subscription tools

---

### 📱 Mobile App Version

* React Native or Flutter app
* Manage leads on the go

---

### 🔐 Enhanced Security

* Rate limiting
* Two-factor authentication (2FA)
* API validation improvements

---

## 🙋‍♀️ Author

**Monali Pawar**

---

## 📄 License

This project is licensed under the **MIT License**.
You are free to use, modify, and distribute this project.

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub!

---






