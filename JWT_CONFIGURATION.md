# JWT Token Configuration

## Current JWT Secret
Your application is now configured with a secure JWT secret key:

```
JWT_SECRET=1612d80669f1a4ef7035361f5405161f337c267e1159ed7c5022042a2e7eb567
```

## JWT Token Details

### Security Features:
- **64-character hex string**: Cryptographically secure random generation
- **256-bit security**: Strong encryption for token signing
- **24-hour expiration**: Tokens expire after 24 hours for security
- **HS256 algorithm**: Industry standard HMAC SHA-256 signing

### Token Structure:
```json
{
  "id": "user_id_here",
  "email": "user@example.com",
  "role": "student|teacher|admin",
  "name": "User Name",
  "iat": 1752838075,
  "exp": 1752924475
}
```

## Environment Variables for Production

### For Render Deployment:
```
MONGODB_URI=mongodb+srv://satbirsingh:Nobody.1234@cluster0.psbseon.mongodb.net/student-activity-platform
JWT_SECRET=1612d80669f1a4ef7035361f5405161f337c267e1159ed7c5022042a2e7eb567
NODE_ENV=production
CORS_ORIGIN=https://your-app-name.onrender.com
```

### For Local Development:
```
MONGODB_URI=mongodb+srv://satbirsingh:Nobody.1234@cluster0.psbseon.mongodb.net/student-activity-platform
JWT_SECRET=1612d80669f1a4ef7035361f5405161f337c267e1159ed7c5022042a2e7eb567
NODE_ENV=development
PORT=5000
```

## How JWT Works in Your Application

1. **User Login**: User provides email/password
2. **Authentication**: Server verifies credentials against MongoDB
3. **Token Generation**: Server creates JWT with user info and signs it
4. **Token Response**: Client receives token and stores it
5. **Authenticated Requests**: Client sends token in Authorization header
6. **Token Verification**: Server validates token on protected routes

## Protected Routes
These routes require valid JWT tokens:
- `/api/users` - User management (admin only)
- `/api/achievements` - Achievement management
- `/api/statistics` - Statistics (admin/teacher)
- `/api/profile` - User profile operations

## Security Best Practices
- JWT secret is never exposed to client-side code
- Tokens expire after 24 hours
- Rate limiting prevents brute force attacks
- CORS configured for production domains
- HTTPS required in production (handled by Render)

Your JWT authentication system is now production-ready and secure.