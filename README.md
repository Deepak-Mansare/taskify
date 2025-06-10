# Taskify - MERN Stack Task Manager

Taskify is a basic full-stack web app that helps users manage tasks. Users can sign up, log in, and handle their tasks. Admins can see all users and assign tasks. I built this project while learning the MERN stack (MongoDB, Express, React, Node.js).

## Features

- User Registration & Login  
- JWT-based Authentication  
- Role-based Access (User & Admin)  
- Create, Read, Update, and Delete Tasks  
- Protected Routes  
- Passwords are hashed using bcrypt  
- Toast Notifications for alerts  
- Clean and simple folder structure  

## Technologies Used

- **Frontend**: React, React Router, Axios, Bootstrap, React Toastify  
- **Backend**: Node.js, Express, MongoDB, Mongoose  
- **Authentication**: JWT, bcrypt  

## Folder Structure

```
taskify/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── middleware/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.jsx
```

## How to Run This Project

### Backend

1. Open terminal and go to the `backend` folder:
   ```
   cd backend
   ```
2. Install backend dependencies:
   ```
   npm install
   ```
3. Create a `.env` file:
   ```
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
4. Start the backend:
   ```
   npm start
   ```

### Frontend

1. In another terminal, go to the `frontend` folder:
   ```
   cd frontend
   ```
2. Install frontend dependencies:
   ```
   npm install
   ```
3. Start the frontend:
   ```
   npm run dev
   ```
4. Visit `http://localhost:3000` in your browser.

## User Roles

- **User**: Can register, log in, and manage their own tasks  
- **Admin**: Can view all users and assign tasks to them  

## Notes

- Protected routes are handled using `ProtectedRoute.jsx`
- If a user without permission tries to access a page, they’re redirected to `/unauthorized`

## What I Learned

- How JWT works and how to use it for route protection  
- How to connect frontend and backend with Axios  
- How to manage forms and user feedback using Toast  
- Role-based access and protected routes in React  

---

This project helped me understand how to build a full-stack app from scratch. I'm planning to add more features like task filters and status updates soon.
