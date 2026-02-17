# Quick Start Guide - E-Campus Approval System

Get the E-Campus Approval System up and running in 15 minutes!

## Prerequisites

Install these before starting:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) (Free)
- [Cloudinary Account](https://cloudinary.com) (Free)

## Step 1: Download & Extract (1 min)

1. Download the project files
2. Extract to your desired location
3. Open terminal/command prompt

## Step 2: MongoDB Atlas Setup (3 mins)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user (username + password)
4. Add IP: `0.0.0.0/0` (allow all - for development)
5. Get connection string (Connect → Drivers)
6. Save it - looks like: `mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/dbname`

## Step 3: Cloudinary Setup (2 mins)

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Note these values:
   - Cloud Name
   - API Key
   - API Secret

## Step 4: Backend Setup (3 mins)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_random_secret_key_min_32_chars
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

Start backend:
```bash
npm start
```

✅ Backend running at `http://localhost:5000`

## Step 5: Frontend Setup (3 mins)

Open a new terminal window:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

Start frontend:
```bash
npm start
```

✅ Frontend running at `http://localhost:3000`

## Step 6: Create Accounts (3 mins)

### Register Admin Account

1. Go to `http://localhost:3000`
2. Click "Register here"
3. Fill in details:
   - Name: Admin User
   - Email: admin@example.com
   - Password: admin123
   - Role: **Admin / Teacher**
   - Department: Administration
   - Digital Signature: Upload any image
4. Click "Create Account"

### Register Student Account

1. Logout (top right)
2. Go to Login → "Register here"
3. Fill in details:
   - Name: Student User
   - Email: student@example.com
   - Password: student123
   - Role: **Student**
   - Student ID: STU001
   - Department: Computer Science
   - Digital Signature: Upload any image
4. Click "Create Account"

## Step 7: Test the System (3 mins)

### As Student:

1. Login as student
2. Click "Events and Duty Leave"
3. Edit template, add reason, select dates
4. Upload a document (PDF or image)
5. Submit request
6. Check "Status" page
7. Check "Notifications"

### As Admin:

1. Logout and login as admin
2. View the student's request
3. Click "Approve" or "Reject"
4. Add rejection reason if rejecting
5. Confirm action

### Verify:

1. Login as student again
2. Check notifications (should see approval/rejection)
3. Check status page
4. Check history page

## Common Issues & Solutions

### Backend won't start

**Error**: `MongoDB connection error`
- ✅ Check connection string in `.env`
- ✅ Verify IP is whitelisted (0.0.0.0/0)
- ✅ Check database user credentials

**Error**: `Cloudinary error`
- ✅ Verify credentials in `.env`
- ✅ Check for typos in cloud name

### Frontend won't connect

**Error**: `Network Error` or CORS
- ✅ Ensure backend is running on port 5000
- ✅ Check `REACT_APP_API_URL` in frontend `.env`
- ✅ Restart frontend after changing `.env`

### File upload fails

- ✅ Check file size < 5MB
- ✅ Use JPG, PNG, or PDF format
- ✅ Verify Cloudinary credentials

### Can't login

- ✅ Check email and password
- ✅ Ensure role matches (Student vs Admin)
- ✅ Check browser console for errors

## Project Structure Overview

```
e-campus-approval-system/
├── backend/              # Node.js + Express API
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & upload
│   └── server.js        # Entry point
│
└── frontend/            # React application
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── pages/       # Route pages
    │   ├── contexts/    # Auth context
    │   └── utils/       # API & templates
    └── public/          # Static files
```

## Default Ports

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`
- MongoDB Atlas: Cloud-hosted

## Next Steps

1. ✅ Test all features
2. ✅ Customize permission templates
3. ✅ Add more student/admin accounts
4. ✅ Review README.md for full documentation
5. ✅ See DEPLOYMENT.md for production setup

## Features to Explore

### Student Features
- Submit 4 types of permission requests
- Real-time status tracking
- View complete history
- Receive instant notifications
- Edit permission templates
- Upload supporting documents

### Admin Features
- View all requests in one dashboard
- Quick approve/reject actions
- Add rejection reasons
- Automatic notifications to students
- Digital signature on decisions

## Support

Need help?
1. Check `README.md` for detailed docs
2. Check `API_DOCUMENTATION.md` for API details
3. Check `DEPLOYMENT.md` for production setup
4. Review error logs in terminal

## Development Tips

### Auto-restart on changes
Backend: Already enabled with nodemon
Frontend: Already enabled with React

### View database
Use [MongoDB Compass](https://www.mongodb.com/products/compass) with your connection string

### Test API endpoints
Use [Postman](https://www.postman.com/) for API testing

### Debug frontend
Open browser DevTools (F12) → Console & Network tabs

## Security Notes for Development

⚠️ **Development Setup Only**
- JWT secret is simple (change for production)
- MongoDB accepts all IPs (restrict for production)
- CORS is open (configure for production)
- No rate limiting (add for production)

✅ **For Production**
- Use strong JWT secret (32+ characters)
- Whitelist specific IPs in MongoDB
- Configure CORS origins
- Add rate limiting
- Enable HTTPS

## Performance

Expected response times (development):
- Login: < 500ms
- Submit request: < 800ms
- Load dashboard: < 300ms
- File upload: < 2s (depends on file size)

## Useful Commands

### Backend
```bash
npm start          # Start server
npm run dev        # Start with auto-reload (if nodemon installed)
```

### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
```

### Both
```bash
npm install        # Install dependencies
npm audit fix      # Fix security vulnerabilities
```

## What's Next?

Now that you have the system running:

1. **Customize**: Edit templates in `frontend/src/utils/templates.js`
2. **Deploy**: Follow `DEPLOYMENT.md` to go live
3. **Extend**: Add new permission categories
4. **Integrate**: Connect to existing student database

## Success Checklist

- [ ] Backend running without errors
- [ ] Frontend accessible at localhost:3000
- [ ] MongoDB connection successful
- [ ] Cloudinary uploads working
- [ ] Admin account created
- [ ] Student account created
- [ ] Permission request submitted
- [ ] Request approved/rejected
- [ ] Notification received
- [ ] Status page working
- [ ] History page showing data

**All checked? Congratulations! 🎉 You're ready to use the system!**

---

**Need to deploy to production?** → See `DEPLOYMENT.md`  
**Want to understand the API?** → See `API_DOCUMENTATION.md`  
**Looking for full details?** → See `README.md`
