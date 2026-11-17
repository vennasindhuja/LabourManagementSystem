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
- Copy `backend/.env.example` to `backend/.env` and set your PostgreSQL password in `DB_PASSWORD`.

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

- **Dashboard**: Workforce metrics, attendance summaries, trade breakdowns, project totals, and payroll summaries.
- **Workforce**: Search, filter, add, update, and manage worker profiles, trades, contact details, and daily wages.
- **Attendance Muster**: Record and review worker attendance and overtime.
- **Job Sites & Projects**: Create and manage construction projects and site details.
- **Payroll & Wages**: Generate payroll and track worker payments.
