# E-Campus Approval System

A complete MERN stack web application for managing student permission requests with role-based authentication for students and administrators.

## Features

### Student Features
- 🔐 Secure login with digital signature upload
- 📝 Submit permission requests for:
  - Events and Duty Leave
  - Scholarship Applications
  - Season Ticket Requests
  - Document Retrieval
- 📊 Track request status in real-time
- 📜 View complete request history
- 🔔 Receive notifications on approval/rejection
- ✍️ Editable permission templates

### Admin Features
- 🔐 Secure admin login with digital signature
- 📋 View all student permission requests
- ✅ Approve or reject requests
- 💬 Provide rejection reasons
- 📝 Digital signature attachment on decisions
- 📊 Dashboard with comprehensive request details

## Tech Stack

### Frontend
- React.js 18
- React Router DOM v6
- Axios for API calls
- React Icons
- CSS3 with custom styling

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT Authentication
- Bcrypt for password hashing
- Multer for file uploads
- Cloudinary for image storage

## Project Structure

```
e-campus-approval-system/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── permissionController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Permission.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── permissionRoutes.js
│   │   └── notificationRoutes.js
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Navbar.css
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── PermissionModal.js
│   │   │   └── PermissionModal.css
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Login.css
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Dashboard.css
│   │   │   ├── Status.js
│   │   │   ├── Status.css
│   │   │   ├── History.js
│   │   │   ├── History.css
│   │   │   ├── Notifications.js
│   │   │   ├── Notifications.css
│   │   │   ├── AdminDashboard.js
│   │   │   └── AdminDashboard.css
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── templates.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account (for image storage)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```

5. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

5. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and add it to backend `.env` as `MONGODB_URI`

## Cloudinary Setup

1. Create a Cloudinary account at https://cloudinary.com
2. Go to Dashboard to find your credentials
3. Add Cloud Name, API Key, and API Secret to backend `.env`

## Default User Accounts

You'll need to register users through the application. Use the following format:

### Student Account
- Name: John Doe
- Email: student@example.com
- Password: student123
- Role: Student
- Student ID: STU001
- Department: Computer Science
- Digital Signature: Upload an image file

### Admin Account
- Name: Prof. Smith
- Email: admin@example.com
- Password: admin123
- Role: Admin
- Department: Administration
- Digital Signature: Upload an image file

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/signature` - Update digital signature

### Permissions (Student)
- `POST /api/permissions` - Create permission request
- `GET /api/permissions/my-permissions` - Get user's permissions
- `GET /api/permissions/status` - Get latest status
- `GET /api/permissions/history` - Get request history

### Permissions (Admin)
- `GET /api/permissions/all` - Get all permissions
- `PUT /api/permissions/:id/approve` - Approve permission
- `PUT /api/permissions/:id/reject` - Reject permission

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

## Deployment

### Backend Deployment (Render)

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables from `.env`
5. Deploy

### Frontend Deployment (Netlify)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy to Netlify:
   - Drag and drop the `build` folder to Netlify
   - Or connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `build`

3. Add environment variable:
   - `REACT_APP_API_URL` = your Render backend URL

## Usage Guide

### For Students

1. **Register/Login**
   - Register with your details and upload digital signature
   - Login with email and password

2. **Submit Permission Request**
   - Click on any module (Events, Scholarship, etc.)
   - Edit the template as needed
   - Fill in reason, dates
   - Upload required documents (for Events and Scholarship)
   - Submit request

3. **Track Status**
   - View latest request status
   - Check approval/rejection details
   - See rejection reasons if applicable

4. **View History**
   - See all past requests
   - Filter by status
   - Review decisions

5. **Check Notifications**
   - Receive updates on request decisions
   - Mark notifications as read

### For Admins

1. **Login**
   - Login with admin credentials
   - Upload/update digital signature

2. **Review Requests**
   - View all pending and processed requests
   - See student details and request information
   - Review attached documents and templates

3. **Take Action**
   - Approve requests (signature automatically attached)
   - Reject requests with reason
   - Student receives notification automatically

## Features in Detail

### Digital Signatures
- Required during registration
- Can be updated anytime
- Automatically attached to approved/rejected requests
- Stored securely in Cloudinary

### Permission Templates
- Pre-defined templates for each category
- Auto-populated with student details
- Fully editable before submission
- Professional format

### Document Upload
- Required for Events/Duty Leave and Scholarship
- Accepts PDF, JPG, PNG formats
- Maximum 5MB file size
- Stored in Cloudinary

### Notifications
- Real-time updates on request status
- Approval/rejection messages
- Includes decision maker's name
- Rejection reasons displayed
- Unread notification counter

### Status Tracking
- Latest request status
- Decision maker information
- Decision date and time
- Complete request details
- Template content display

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Protected API routes
- File upload validation
- CORS enabled
- Environment variable protection

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify connection string
   - Check IP whitelist
   - Ensure database user has correct permissions

2. **Cloudinary Upload Error**
   - Verify credentials
   - Check file size limits
   - Ensure correct folder permissions

3. **CORS Error**
   - Check frontend URL in backend CORS config
   - Verify API URL in frontend .env

4. **Authentication Error**
   - Clear browser cache and cookies
   - Check JWT secret consistency
   - Verify token expiration

## Support

For issues or questions:
1. Check the documentation
2. Review error logs
3. Verify environment variables
4. Check API endpoint availability

## License

This project is created for educational purposes.

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

---

**Built with ❤️ using MERN Stack**
