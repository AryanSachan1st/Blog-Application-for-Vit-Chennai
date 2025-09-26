# Blog Application for VIT Chennai

This is a full-stack blog application built for VIT Chennai.

## Features
- User authentication (signup, login, logout)
- Create, read, update, and delete blog posts
- Search functionality for blog posts
- Pagination for blog listings
- Responsive design

## Tech Stack
- Frontend: React.js
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT

## Project Structure
```
.
├── client/          # React frontend
├── server/          # Node.js backend
├── README.md        # This file
└── .gitignore       # Git ignore file
```

## Setup Instructions

1. Clone the repository
2. Install dependencies for both client and server:
   ```
   cd client
   npm install
   
   cd server
   npm install
   ```
3. Set up environment variables in `server/.env`:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=your_jwt_secret
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```
4. Start the development servers:
   ```
   # In one terminal
   cd server
   npm run dev
   
   # In another terminal
   cd client
   npm start
   ```

## Contributing
Feel free to fork this repository and submit pull requests.
