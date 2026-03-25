# College Event Management System

A full-stack MERN application for managing college events with role-based access control.

## 🚀 Features

- **JWT Authentication** with bcrypt password hashing
- **Role-based Access**: Admin & Student roles
- **Admin Dashboard**: Create, edit, delete events & track registrations
- **Student Portal**: Browse events, register, view registrations
- **Search & Filter**: Full-text search with location filtering
- **Dark Mode**: Persistent theme toggle
- **Responsive**: Mobile-first design with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React + Vite + Tailwind CSS v4
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas
- **Auth**: JWT + bcrypt

## 📦 Setup

### Backend

```bash
cd backend
cp .env.example .env    # Fill in your MongoDB URI & JWT secret
npm install
npm run seed            # Seed sample data (optional)
npm run dev             # Start dev server on port 5000
```

### Frontend

```bash
cd frontend
cp .env.example .env    # For local dev, leave VITE_API_URL empty
npm install
npm run dev             # Start dev server on port 5173
```

## 🌐 Deployment

### Backend → Render
1. Create a **Web Service** on [Render](https://render.com)
2. Connect your GitHub repo
3. **Root Directory**: `backend`
4. **Build Command**: `npm install`
5. **Start Command**: `node server.js`
6. Add environment variables:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = your secret key
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = your Vercel frontend URL

### Frontend → Vercel
1. Import your GitHub repo on [Vercel](https://vercel.com)
2. **Root Directory**: `frontend`
3. **Framework Preset**: Vite
4. Add environment variable:
   - `VITE_API_URL` = your Render backend URL (e.g., `https://your-app.onrender.com`)

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@college.edu | admin123 |
| Student | john@college.edu | student123 |

## 📁 Project Structure

```
event-management/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth, role, error handlers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # Seed script
│   └── server.js
└── frontend/
    └── src/
        ├── components/  # Reusable UI components
        ├── context/     # Auth context
        ├── pages/       # Route pages
        ├── services/    # API layer
        └── App.jsx      # Router
```
