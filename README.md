# 📸 Stock Image Management Platform

A full-stack image management application where users can register, log in, upload multiple images with titles, rearrange via drag-and-drop, and edit/delete their images. Built with a **Vite + React + TypeScript** frontend and an **ExpressJS (TypeScript)** backend using **MongoDB**.

---

## 🚀 Tech Stack

### Frontend
- Vite
- React
- TypeScript
- React DnD
- Axios

### Backend
- ExpressJS (TypeScript)
- MongoDB + Mongoose
- JWT (access & refresh tokens)
- Cloudinary (image storage)
- bcrypt, cookie-parser

---

## 🔐 Features

- ✅ User registration and login (Email, Phone, Password)
- ✅ JWT-based authentication (access & refresh tokens)
- ✅ Password reset
- ✅ Bulk image upload with titles
- ✅ Edit & delete uploaded images
- ✅ Drag and drop rearrangement of images (React DnD)
- ✅ Image hosting on Cloudinary

---

## 🛆 Installation & Setup

### Backend

**Prerequisites:**
- Node.js and npm
- MongoDB cluster (or local setup)

**Setup:**
```bash
cd server
npm install
```

**Development:**
```bash
npm run dev
```

**Build and Start:**
```bash
npm run build
npm start
```

**Environment Variables (.env)**
```
PORT
MONGO_URI
FRONTEND_URI

ACCESS_TOKEN_SECRET
REFRESH_TOKEN_SECRET
ACCESS_TOKEN_EXPIRY
REFRESH_TOKEN_EXPIRY

CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

### Frontend

```bash
cd client
npm install
npm run dev
```

**Frontend .env file (.env)**
```
VITE_SERVER_BASEURL
```

---

## 📸 Functionality

1. **Register/Login**: Secure login with JWT and token refresh.
2. **Image Upload**: Upload multiple images with a unique title for each.
3. **View/Edit/Delete**: Full CRUD operations on uploaded images.
4. **Rearrange Images**: Drag-and-drop sorting with React DnD and save order.

---

## 🛠️ Deployment Notes

- Backend is deployed on Render
- Ensure correct CORS and `FRONTEND_URI` settings in `.env`
- Cloudinary is used for image storage

---

## 🧑‍💻 Developer Notes

- Keep environment secrets secure and never push `.env` files to public repos

---



