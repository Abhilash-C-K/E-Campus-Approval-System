# Deployment Guide - E-Campus Approval System

This guide will walk you through deploying the E-Campus Approval System to production using MongoDB Atlas, Render (backend), and Netlify (frontend).

## Prerequisites

- GitHub account
- MongoDB Atlas account
- Cloudinary account
- Render account
- Netlify account

## Step 1: MongoDB Atlas Setup

### 1.1 Create Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click "Build a Database"
4. Choose the FREE tier (M0 Sandbox)
5. Select a cloud provider and region (closest to your users)
6. Name your cluster (e.g., "e-campus-cluster")
7. Click "Create Cluster"

### 1.2 Create Database User

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and strong password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### 1.3 Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your specific IP addresses
5. Click "Confirm"

### 1.4 Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `myFirstDatabase` with your database name (e.g., "e-campus-db")

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/e-campus-db?retryWrites=true&w=majority
```

## Step 2: Cloudinary Setup

### 2.1 Create Account and Get Credentials

1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for a free account
3. Go to Dashboard
4. Note down:
   - Cloud Name
   - API Key
   - API Secret

### 2.2 Create Upload Folders (Optional)

1. Go to "Media Library"
2. Create folders:
   - `signatures` (for digital signatures)
   - `documents` (for uploaded documents)

## Step 3: Backend Deployment (Render)

### 3.1 Prepare Code

1. Create a GitHub repository
2. Push your backend code to GitHub:

```bash
cd e-campus-approval-system
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 3.2 Deploy to Render

1. Go to [Render](https://render.com)
2. Sign up or log in
3. Click "New +" → "Web Service"
4. Connect your GitHub account
5. Select your repository
6. Configure the service:

**Basic Settings:**
- Name: `e-campus-backend` (or your choice)
- Region: Choose closest to your users
- Branch: `main`
- Root Directory: `backend`
- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

**Environment Variables:**
Click "Advanced" and add these environment variables:

```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_very_secure_random_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=production
```

7. Click "Create Web Service"
8. Wait for deployment (5-10 minutes)
9. Note your backend URL (e.g., `https://e-campus-backend.onrender.com`)

### 3.3 Test Backend

Test the health endpoint:
```
https://your-backend-url.onrender.com/api/health
```

Should return:
```json
{
  "message": "E-Campus Approval System API is running"
}
```

## Step 4: Frontend Deployment (Netlify)

### 4.1 Update Frontend Configuration

1. Update `frontend/.env`:
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

2. Commit the change:
```bash
git add .
git commit -m "Update API URL for production"
git push
```

### 4.2 Deploy to Netlify

#### Option A: Drag and Drop (Quick)

1. Build the frontend:
```bash
cd frontend
npm install
npm run build
```

2. Go to [Netlify](https://www.netlify.com)
3. Sign up or log in
4. Drag and drop the `build` folder to Netlify
5. Your site is live!

#### Option B: GitHub Integration (Recommended)

1. Go to [Netlify](https://www.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub"
4. Select your repository
5. Configure build settings:

**Build Settings:**
- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `frontend/build`

**Environment Variables:**
Click "Show advanced" → "New variable"
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

6. Click "Deploy site"
7. Wait for deployment (2-5 minutes)
8. Note your frontend URL (e.g., `https://your-app-name.netlify.app`)

### 4.3 Custom Domain (Optional)

1. In Netlify, go to "Domain settings"
2. Click "Add custom domain"
3. Follow instructions to configure DNS
4. Enable HTTPS (automatic with Netlify)

## Step 5: Update Backend CORS

If you're using a custom domain or need to restrict CORS:

1. Update `backend/server.js`:

```javascript
const corsOptions = {
  origin: [
    'https://your-netlify-app.netlify.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

2. Commit and push changes
3. Render will auto-deploy

## Step 6: Create Initial Admin Account

1. Go to your frontend URL
2. Click "Register here"
3. Fill in admin details:
   - Name: Your Name
   - Email: admin@yourdomain.com
   - Password: SecurePassword123
   - Role: Admin / Teacher
   - Department: Administration
   - Upload digital signature
4. Click "Create Account"

## Step 7: Testing

### Test Student Flow

1. Register as a student
2. Submit a permission request
3. Check status page
4. View history

### Test Admin Flow

1. Login as admin
2. View permission requests
3. Approve/reject a request
4. Verify student receives notification

## Monitoring and Maintenance

### Render Monitoring

1. Go to Render dashboard
2. Select your service
3. View logs in real-time
4. Monitor resource usage
5. Set up alerts (paid plans)

### Netlify Monitoring

1. Go to Netlify dashboard
2. View deployment logs
3. Check build status
4. Monitor bandwidth usage

### MongoDB Atlas Monitoring

1. Go to MongoDB Atlas dashboard
2. View cluster metrics
3. Check connection status
4. Monitor storage usage

## Troubleshooting

### Backend Won't Start

1. Check Render logs for errors
2. Verify environment variables
3. Test MongoDB connection string
4. Check Cloudinary credentials

### Frontend Can't Connect to Backend

1. Verify `REACT_APP_API_URL` is correct
2. Check CORS configuration
3. Test backend health endpoint
4. Clear browser cache

### File Uploads Failing

1. Verify Cloudinary credentials
2. Check file size limits
3. Review upload permissions
4. Check Cloudinary storage quota

### Database Connection Issues

1. Verify MongoDB connection string
2. Check IP whitelist
3. Verify database user credentials
4. Check cluster status

## Performance Optimization

### Backend

1. Enable compression:
```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

2. Add rate limiting:
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);
```

### Frontend

1. Code splitting (already enabled with Create React App)
2. Image optimization in Cloudinary
3. Enable caching headers in Netlify

## Security Best Practices

1. **Never commit `.env` files**
2. **Use strong JWT secrets** (generate with `openssl rand -base64 32`)
3. **Regularly update dependencies**: `npm audit fix`
4. **Enable HTTPS** (automatic with Netlify and Render)
5. **Implement rate limiting** on API endpoints
6. **Validate all inputs** on backend
7. **Sanitize user data** before storing
8. **Regular backups** of MongoDB data

## Backup Strategy

### MongoDB Backups

1. Go to MongoDB Atlas dashboard
2. Enable continuous backup (paid feature)
3. Or use mongodump for manual backups:

```bash
mongodump --uri="your-connection-string" --out=./backup
```

### Code Backups

1. Keep code in GitHub (already done)
2. Tag releases:
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## Scaling Considerations

### When to Scale

- Backend response time > 500ms
- MongoDB connections maxed out
- Cloudinary storage quota exceeded
- Render dyno memory usage > 80%

### How to Scale

1. **Upgrade Render Plan**: More memory and CPU
2. **Upgrade MongoDB Atlas**: Larger cluster
3. **Upgrade Cloudinary**: Higher storage limits
4. **Add CDN**: For static assets
5. **Implement Caching**: Redis for sessions

## Cost Estimates (Free Tier)

- **MongoDB Atlas**: Free (512MB storage)
- **Cloudinary**: Free (25GB storage, 25GB bandwidth/month)
- **Render**: Free (750 hours/month, sleeps after inactivity)
- **Netlify**: Free (100GB bandwidth/month)

**Total Monthly Cost: $0** (within free tier limits)

## Support and Updates

### Staying Updated

1. Star the repository on GitHub
2. Watch for updates
3. Subscribe to newsletters from:
   - MongoDB Atlas
   - Render
   - Netlify

### Getting Help

1. Check logs in Render/Netlify dashboard
2. Review MongoDB Atlas metrics
3. Test API endpoints with Postman
4. Check browser console for frontend errors

---

## Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string obtained
- [ ] Cloudinary account created
- [ ] Cloudinary credentials noted
- [ ] Backend deployed to Render
- [ ] Environment variables configured
- [ ] Backend health endpoint tested
- [ ] Frontend built successfully
- [ ] Frontend deployed to Netlify
- [ ] Frontend environment variable set
- [ ] Admin account created
- [ ] Student test account created
- [ ] Permission request tested
- [ ] Approval/rejection tested
- [ ] Notifications working
- [ ] File uploads working
- [ ] All pages accessible
- [ ] Mobile responsiveness verified

**Congratulations! Your E-Campus Approval System is now live! 🎉**
