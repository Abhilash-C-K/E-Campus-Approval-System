# API Documentation - E-Campus Approval System

Base URL: `http://localhost:5000/api` (Development)  
Production URL: `https://your-backend-url.onrender.com/api`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User

**POST** `/auth/register`

Register a new user (student or admin).

**Content-Type**: `multipart/form-data`

**Request Body**:
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  role: "student", // or "admin"
  studentId: "STU001", // Required for students
  department: "Computer Science",
  digitalSignature: <file> // Image file
}
```

**Success Response** (201):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "studentId": "STU001",
  "department": "Computer Science",
  "digitalSignature": "https://cloudinary.com/...",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response** (400):
```json
{
  "message": "User already exists"
}
```

---

### Login User

**POST** `/auth/login`

Authenticate and login user.

**Content-Type**: `multipart/form-data`

**Request Body**:
```javascript
{
  email: "john@example.com",
  password: "password123",
  role: "student", // or "admin"
  digitalSignature: <file> // Optional - updates signature
}
```

**Success Response** (200):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "studentId": "STU001",
  "department": "Computer Science",
  "digitalSignature": "https://cloudinary.com/...",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response** (401):
```json
{
  "message": "Invalid credentials"
}
```

---

### Get Current User

**GET** `/auth/me`

Get currently logged-in user details.

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "studentId": "STU001",
  "department": "Computer Science",
  "digitalSignature": "https://cloudinary.com/...",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

### Update Digital Signature

**PUT** `/auth/signature`

Update user's digital signature.

**Headers**:
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body**:
```javascript
{
  digitalSignature: <file> // Image file
}
```

**Success Response** (200):
```json
{
  "message": "Signature updated successfully",
  "digitalSignature": "https://cloudinary.com/..."
}
```

---

## Permission Endpoints (Student)

### Create Permission Request

**POST** `/permissions`

Submit a new permission request.

**Headers**:
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body**:
```javascript
{
  category: "Events and Duty Leave",
  templateContent: "To,\nThe Principal...",
  reason: "Attending tech conference",
  fromDate: "2024-02-01",
  toDate: "2024-02-03",
  document: <file> // Optional PDF/Image
}
```

**Success Response** (201):
```json
{
  "message": "Permission request submitted successfully",
  "permission": {
    "_id": "507f1f77bcf86cd799439012",
    "studentId": "507f1f77bcf86cd799439011",
    "studentName": "John Doe",
    "studentEmail": "john@example.com",
    "category": "Events and Duty Leave",
    "templateContent": "To,\nThe Principal...",
    "reason": "Attending tech conference",
    "fromDate": "2024-02-01T00:00:00.000Z",
    "toDate": "2024-02-03T00:00:00.000Z",
    "status": "Pending",
    "studentSignature": "https://cloudinary.com/...",
    "documentFile": "https://cloudinary.com/...",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Get My Permissions

**GET** `/permissions/my-permissions`

Get all permission requests for current student.

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "studentId": "507f1f77bcf86cd799439011",
    "studentName": "John Doe",
    "category": "Events and Duty Leave",
    "status": "Approved",
    "fromDate": "2024-02-01T00:00:00.000Z",
    "toDate": "2024-02-03T00:00:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "approvedBy": "507f1f77bcf86cd799439013",
    "approvedByName": "Prof. Smith",
    "approvedDate": "2024-01-16T09:00:00.000Z"
  }
]
```

---

### Get Latest Status

**GET** `/permissions/status`

Get the latest permission request status.

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "studentId": "507f1f77bcf86cd799439011",
  "studentName": "John Doe",
  "studentEmail": "john@example.com",
  "category": "Events and Duty Leave",
  "templateContent": "To,\nThe Principal...",
  "reason": "Attending tech conference",
  "fromDate": "2024-02-01T00:00:00.000Z",
  "toDate": "2024-02-03T00:00:00.000Z",
  "status": "Approved",
  "studentSignature": "https://cloudinary.com/...",
  "documentFile": "https://cloudinary.com/...",
  "approvedBy": "507f1f77bcf86cd799439013",
  "approvedByName": "Prof. Smith",
  "approvedBySignature": "https://cloudinary.com/...",
  "approvedDate": "2024-01-16T09:00:00.000Z",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

### Get History

**GET** `/permissions/history`

Get all permission request history.

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "category": "Events and Duty Leave",
    "status": "Approved",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "approvedDate": "2024-01-16T09:00:00.000Z",
    "rejectionReason": null
  },
  {
    "_id": "507f1f77bcf86cd799439014",
    "category": "Scholarship",
    "status": "Rejected",
    "createdAt": "2024-01-10T10:30:00.000Z",
    "approvedDate": "2024-01-11T14:00:00.000Z",
    "rejectionReason": "Incomplete documentation"
  }
]
```

---

## Permission Endpoints (Admin)

### Get All Permissions

**GET** `/permissions/all`

Get all permission requests (admin only).

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "studentId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "studentId": "STU001",
      "department": "Computer Science"
    },
    "studentName": "John Doe",
    "studentEmail": "john@example.com",
    "category": "Events and Duty Leave",
    "templateContent": "To,\nThe Principal...",
    "reason": "Attending tech conference",
    "fromDate": "2024-02-01T00:00:00.000Z",
    "toDate": "2024-02-03T00:00:00.000Z",
    "status": "Pending",
    "studentSignature": "https://cloudinary.com/...",
    "documentFile": "https://cloudinary.com/...",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### Approve Permission

**PUT** `/permissions/:id/approve`

Approve a permission request (admin only).

**Headers**:
```
Authorization: Bearer <token>
```

**URL Parameters**:
- `id`: Permission ID

**Success Response** (200):
```json
{
  "message": "Permission approved successfully",
  "permission": {
    "_id": "507f1f77bcf86cd799439012",
    "status": "Approved",
    "approvedBy": "507f1f77bcf86cd799439013",
    "approvedByName": "Prof. Smith",
    "approvedBySignature": "https://cloudinary.com/...",
    "approvedDate": "2024-01-16T09:00:00.000Z"
  }
}
```

**Error Response** (404):
```json
{
  "message": "Permission not found"
}
```

---

### Reject Permission

**PUT** `/permissions/:id/reject`

Reject a permission request (admin only).

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters**:
- `id`: Permission ID

**Request Body**:
```json
{
  "rejectionReason": "Incomplete documentation"
}
```

**Success Response** (200):
```json
{
  "message": "Permission rejected successfully",
  "permission": {
    "_id": "507f1f77bcf86cd799439012",
    "status": "Rejected",
    "approvedBy": "507f1f77bcf86cd799439013",
    "approvedByName": "Prof. Smith",
    "approvedBySignature": "https://cloudinary.com/...",
    "approvedDate": "2024-01-16T09:00:00.000Z",
    "rejectionReason": "Incomplete documentation"
  }
}
```

---

### Get Permission by ID

**GET** `/permissions/:id`

Get details of a specific permission.

**Headers**:
```
Authorization: Bearer <token>
```

**URL Parameters**:
- `id`: Permission ID

**Success Response** (200):
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "studentId": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "studentId": "STU001",
    "department": "Computer Science"
  },
  "category": "Events and Duty Leave",
  "templateContent": "To,\nThe Principal...",
  "reason": "Attending tech conference",
  "status": "Approved",
  "approvedBy": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Prof. Smith",
    "email": "prof.smith@example.com"
  },
  "approvedByName": "Prof. Smith",
  "approvedDate": "2024-01-16T09:00:00.000Z"
}
```

---

## Notification Endpoints

### Get Notifications

**GET** `/notifications`

Get all notifications for current user.

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "userId": "507f1f77bcf86cd799439011",
    "message": "Your Events and Duty Leave request has been approved by Prof. Smith",
    "permissionId": "507f1f77bcf86cd799439012",
    "category": "Events and Duty Leave",
    "readStatus": false,
    "date": "2024-01-16T09:00:00.000Z"
  }
]
```

---

### Get Unread Count

**GET** `/notifications/unread-count`

Get count of unread notifications.

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
{
  "count": 3
}
```

---

### Mark as Read

**PUT** `/notifications/:id/read`

Mark a notification as read.

**Headers**:
```
Authorization: Bearer <token>
```

**URL Parameters**:
- `id`: Notification ID

**Success Response** (200):
```json
{
  "message": "Notification marked as read"
}
```

---

### Mark All as Read

**PUT** `/notifications/read-all`

Mark all notifications as read.

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
{
  "message": "All notifications marked as read"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Admin only."
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error",
  "error": "Error details (development only)"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding for production:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## Testing with Postman

### 1. Register/Login
1. POST to `/api/auth/register` or `/api/auth/login`
2. Copy the `token` from response
3. Save it as an environment variable

### 2. Make Authenticated Requests
1. Add header: `Authorization: Bearer <token>`
2. Make requests to protected endpoints

### 3. Test File Uploads
1. In Postman, select `form-data`
2. For file fields, select `File` type
3. Upload your file

---

## WebSocket Support (Future Enhancement)

For real-time notifications, consider implementing Socket.IO:

```javascript
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join', (userId) => {
    socket.join(userId);
  });
});

// Emit notification when permission is approved/rejected
io.to(studentId).emit('notification', notificationData);
```

---

## Security Considerations

1. **JWT Expiration**: Tokens expire in 30 days
2. **Password Hashing**: Bcrypt with salt rounds of 10
3. **File Upload**: Limited to 5MB, only images and PDFs
4. **CORS**: Configure allowed origins in production
5. **Environment Variables**: Never commit `.env` files
6. **Input Validation**: Validate all user inputs
7. **SQL Injection**: Protected by Mongoose ORM

---

## Support

For API issues or questions, check:
1. Server logs in Render dashboard
2. MongoDB Atlas logs
3. Network tab in browser DevTools
4. Postman console for request/response details
