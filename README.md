# Labour Management System

A full-stack construction and labour management platform built with NestJS, TypeORM, PostgreSQL, React, TypeScript, Vite, and Tailwind CSS.

---

## 🏗️ Architecture & Tech Stack

- **Backend**: [NestJS](https://nestjs.com/) (TypeScript), TypeORM, PostgreSQL
- **Frontend**: [React 19](https://react.dev/), TypeScript, [Vite](https://vite.dev/), [Tailwind CSS v4](https://tailwindcss.com/), Lucide Icons
- **Database**: PostgreSQL 18

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) running on `localhost:5432` with a database named `testdb`.

### 2. Quick Start (Windows)
Double-click `start.bat` or run:
```powershell
.\start.bat
```
This automatically launches both backend and frontend servers in separate windows.

### 3. Manual Startup

**Terminal 1 — Backend:**
```bash
cd backend
npm install
npm run start:dev
```
Backend runs at: `http://localhost:5000`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:3000`

---

## 📊 Modules & Features

- **Dashboard**: Live metrics, attendance rates, trade breakdowns, active projects & workers.
- **Labour Management**: Worker directory, skills/trade categorization, contact details, daily wage tracking.
- **Projects**: Construction projects and site assignment.
- **Attendance**: Daily check-ins, status (Present, Half-Day, Absent), overtime hours tracking.
- **Payroll**: Automated wage calculations, status tracking (Pending, Paid), payment receipts.
