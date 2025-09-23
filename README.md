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
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
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

## License
This project is open source and available under the MIT License.
