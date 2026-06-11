# SGV Web Dev Showcase — React + Node.js

A complete full-stack web development showcase by **Suresh Gopi V**, featuring 7 projects built with React and Node.js.

## 🗂️ Project Structure

```
intern/
 ├── frontend/     ← React (Vite) app — http://localhost:3000
 └── backend/      ← Node.js + Express + JSON DB — http://localhost:5000
```

## 🚀 Getting Started

### 1. Start the Backend
```bash
cd backend
node server.js
# Runs on http://localhost:5000
```

### 2. Start the Frontend
```bash
cd frontend
npm install   # first time only
npm run dev
# Opens at http://localhost:3000
```

## 🛠️ Tech Stack

| Layer     | Tech                         |
|-----------|------------------------------|
| Frontend  | React 18, React Router, Vite |
| Backend   | Node.js, Express.js          |
| Database  | JSON file (`backend/db/db.json`) |
| Styling   | Vanilla CSS (design system)  |
| HTTP      | Axios                        |

## 📋 All 7 Tasks

| # | Task | Level | Route |
|---|------|-------|-------|
| 1 | Personal Portfolio | Level 1 | `/portfolio` |
| 2 | Landing Page | Level 1 | `/landing` |
| 3 | Calculator | Level 1 | `/calculator` |
| 4 | Job Board | Level 2 | `/jobboard` |
| 5 | Online Quiz Maker | Level 2 | `/quiz` |
| 6 | E-Commerce Store | Level 3 | `/ecommerce` |
| 7 | Project Manager | Level 3 | `/projects` |

## 🔗 API Endpoints

```
GET    /api/jobs              — List jobs (filter: q, type)
POST   /api/jobs              — Post a new job
POST   /api/jobs/:id/apply    — Apply to a job
DELETE /api/jobs/:id          — Remove a job

GET    /api/quizzes           — List quizzes
POST   /api/quizzes           — Create a quiz
GET    /api/quizzes/:id       — Get quiz (mode=take hides answers)
POST   /api/quizzes/:id/submit — Submit answers, get score
DELETE /api/quizzes/:id       — Delete a quiz

GET    /api/products          — List products (filter: category, search)
POST   /api/products/order    — Place order

GET    /api/projects          — List projects
POST   /api/projects          — Create project
PUT    /api/projects/:id      — Update project
DELETE /api/projects/:id      — Delete project
POST   /api/projects/:id/tasks       — Add task
PUT    /api/projects/:id/tasks/:tid  — Update task
DELETE /api/projects/:id/tasks/:tid  — Delete task

POST   /api/contact           — Send contact message
```

## 👤 About

Built by **Suresh Gopi V** — Aspiring Full Stack Developer  
🌐 Portfolio: https://portfolio-mauve-one-17.vercel.app/  
🐙 GitHub: https://github.com/suresh007-bash  
💼 LinkedIn: https://www.linkedin.com/in/suresh-gopi-7a7220321
