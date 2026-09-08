# Weekly Reports System

A team collaboration platform for tracking weekly progress with AI-powered report writing assistance.

---

## Prerequisites

- Node.js (v18+)
- npm (v8+)
- MySQL (v8+)

---

## 1. Running Database

### Create Database
```bash
mysql -u root -p
```

Then run:
```sql
CREATE DATABASE weekly_reports_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Load Schema
```bash
mysql -u root -p weekly_reports_db < database/schema.sql
```

Verify:
```sql
USE weekly_reports_db;
SHOW TABLES;  -- Should show 15 tables
```

---

## 2. Installing Dependencies

### Backend Dependencies
```bash
cd backend
npm install
```

### Frontend Dependencies
```bash
cd frontend
npm install
```

---

## 3. Running Backend

### Setup .env File
Create `backend/.env`:

```env
DATABASE_URL="mysql://root:your_password@localhost:3306/weekly_reports_db"
JWT_SECRET="your key"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
GOOGLE_API_KEY="YOUR_API_KEY_HERE"
```

Get Google API Key from: https://ai.google.dev

### Start Backend
```bash
cd backend
npm run dev
```

Expected output:
```
✅ Server running on port 5000
```

Backend URL: `http://localhost:5000`

---

## 4. Running Frontend

### Start Frontend
```bash
cd frontend
npm run dev
```

Expected output:
```
> Local:        http://localhost:3000
```

Frontend URL: `http://localhost:3000`

---

## Test Credentials

```
Email: alice@company.com (Team Member)
Email: manager@company.com (Manager)
Email: admin@company.com (Admin)
```

---

## Quick Start (All at Once)

### Terminal 1 - Database (one time only)
```bash
mysql -u root -p weekly_reports_db < database/schema.sql
```

### Terminal 2 - Backend
```bash
cd backend
npm install
npm run dev
```

### Terminal 3 - Frontend
```bash
cd frontend
npm install
npm run dev
```

Then open: http://localhost:3000

---

**Done! Application is ready to use.** 🚀
