# Student Activity Record Platform

A comprehensive full-stack web application for managing student achievements and activities. Students can upload their academic, co-curricular, and extracurricular achievements with supporting documentation, while teachers review and verify submissions, and administrators manage the overall system.

## 🚀 Features

- **Role-Based Access Control**: Student, Teacher, and Administrator roles with specific permissions
- **Achievement Management**: Upload, review, and track student activities with file attachments
- **Real-time Status Updates**: Live updates on submission status and approval process
- **Responsive Design**: Mobile-first design that works seamlessly across all devices
- **File Upload System**: Secure file handling with 5MB limit for PDFs and images
- **Dashboard Analytics**: Statistics and reporting capabilities for administrators
- **Authentication**: JWT-based secure authentication with password hashing
- **Complete Data Separation**: Isolated environments for demo (@example.com) and official (@satvirnagra.com) accounts
- **Student Information Display**: Shows student names with roll numbers (e.g., "Demo Student (DEMO001)")
- **Branch-Based Assignment**: Automatic teacher assignment based on student's branch/specialization
- **Department Analytics**: Real-time department comparison charts with authentic achievement data
- **MongoDB Integration**: Robust database with proper ObjectId handling and data filtering

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for development and build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation
- **Wouter** for client-side routing
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **TypeScript** (ES modules)
- **MongoDB** with Mongoose ODM
- **JWT** authentication with bcrypt
- **Multer** for file uploads
- **Zod** for validation

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (or MongoDB Atlas for production)
- npm or yarn package manager

## 🏃‍♂️ Quick Start

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-activity-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup** (required for production)
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your MongoDB connection string and other configuration values.

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5000`

## 👥 Demo Accounts

The platform includes pre-configured demo accounts for testing purposes. These accounts operate in complete isolation from official accounts.

### Demo Account Credentials
- **Demo Admin**: `demo.admin@example.com` / `demo123`
- **Demo Teacher**: `demo.teacher@example.com` / `demo123`  
- **Demo Student**: `demo.student@example.com` / `demo123`

### Demo Data
- Demo student profile: "Demo Student (DEMO001)" in Computer Science and Engineering
- 2 pre-uploaded achievements with verified status
- Complete branch-based teacher assignment system
- Isolated statistics and reporting

## 🏢 Official Accounts

Production accounts use the @satvirnagra.com domain and have complete data separation from demo accounts.

### Official Account Credentials
- **Admin**: `admin@satvirnagra.com` / `Admin@2025!`
- **Teacher 1**: `rajesh.kumar@satvirnagra.com` / `Teacher@2025!`
- **Teacher 2**: `priya.sharma@satvirnagra.com` / `Teacher@2025!`

### Data Isolation Features
- Demo accounts see only demo users, achievements, and statistics
- Official accounts see only production users, achievements, and statistics
- Complete separation in all API endpoints and database queries
- Independent department statistics and activity comparisons
- Separate user management interfaces for each account type

## 📊 Key Features Implemented

### Student Information Display
- Student names displayed with roll numbers: "Demo Student (DEMO001)"
- Branch specialization shown in user management: "Computer Science and Engineering"
- Course and year information: "B.Tech - Year third"

### Department Management
- Real-time department statistics with proper filtering
- Branch-based teacher specialization assignments
- Authentic achievement data in comparison charts
- Teacher workload balancing for student assignments

### Enhanced Security
- Complete data isolation between account types
- Protected admin accounts cannot be edited/deleted
- JWT-based authentication with bcrypt password hashing
- Rate limiting and CORS security headers

## 🚀 Getting Started

### Quick Start
1. Clone the repository and install dependencies
2. Configure environment variables (optional for development)  
3. Start the development server with `npm run dev`
4. Access the application at `http://localhost:5000` and use the appropriate credentials below

## 🔐 Account Credentials

### 🏢 **OFFICIAL PRODUCTION ACCOUNTS**
**⚠️ FOR REAL SYSTEM USE ONLY - DO NOT USE FOR TESTING**

- **Production Administrator**: `admin@satvirnagra.com` / `Admin@2025!`
  - Full system administration access
  - Real data management and user oversight
  - Production statistics and reporting

- **Production Teacher 1**: `rajesh.kumar@satvirnagra.com` / `Teacher@2025!`
  - Official teacher account for real student verification
  - Access to actual student submissions

- **Production Teacher 2**: `priya.sharma@satvirnagra.com` / `Teacher@2025!`
  - Official teacher account for real student verification
  - Access to actual student submissions

---

### 🧪 **DEMO TESTING ACCOUNTS**
**✅ SAFE FOR TESTING - NO IMPACT ON REAL DATA**

- **Demo Student**: `demo.student@example.com` / `demo123`
  - Test student functionality and submissions
  - Has 2 sample verified achievements for testing
  - Isolated from production data

- **Demo Teacher**: `demo.teacher@example.com` / `demo123`
  - Test teacher verification workflows
  - Can review demo student submissions
  - Isolated from production data

- **Demo Administrator**: `demo.admin@example.com` / `demo123`
  - Test admin features and system management
  - Views 2 total activities in statistics (demo data only)
  - Isolated from production data

---

### 📋 **Account Usage Guidelines**

**For Administrators:**
- Use **PRODUCTION accounts** for real system operations
- Use **DEMO accounts** for testing, demonstrations, and training
- Demo accounts have no impact on production statistics or data
- All charts and analytics reflect only production account activity

**For New Students:**
- Register directly through the registration page
- Use your own credentials for real submissions
- Do not use demo accounts for actual coursework

**Data Separation:**
- Production and demo accounts are completely isolated
- Statistics and reports show only real production data
- Demo activities do not appear in official system analytics

## 🚀 Deployment

### Deploy to Vercel (Recommended)

**Quick Deploy:**
```bash
npm i -g vercel
vercel login
vercel --prod
```

**Or use Vercel Dashboard:**
1. Visit [vercel.com/new](https://vercel.com/new) and import your repository
2. Configure environment variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
   NODE_ENV=production
   CORS_ORIGIN=https://your-app.vercel.app
   ```
3. Deploy automatically with included `vercel.json` configuration

### Deploy to Render

1. Visit [render.com](https://render.com) and create a new web service
2. Connect your repository
3. Configure build settings:
   - Build Command: `node scripts/build.js`
   - Start Command: `npm start`
4. Set environment variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
   NODE_ENV=production
   CORS_ORIGIN=https://your-app.onrender.com
   PORT=10000
   ```

### Database Setup (MongoDB Atlas)

1. Create account at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create free cluster (M0)
3. Create database user with read/write permissions
4. Set network access to `0.0.0.0/0` (allow all IPs)
5. Get connection string and use as `MONGODB_URI`

**Both platforms include:**
- Automatic HTTPS certificates
- Health check monitoring (`/api/health`)
- Environment variable management
- Auto-deploy on git push

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and configurations
│   │   └── hooks/          # Custom React hooks
│   └── index.html
├── server/                 # Backend Express application
│   ├── routes.ts           # API route definitions
│   ├── models.ts           # Mongoose data models
│   ├── database.ts         # Database connection
│   ├── storage.ts          # Storage interface
│   └── middleware/         # Express middleware
├── shared/                 # Shared TypeScript types
│   └── schema.ts           # Zod schemas and types
├── scripts/                # Build and deployment scripts
│   └── build.js            # Custom production build script
├── uploads/                # File upload directory
└── dist/                   # Production build output
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (standard build)
- `node scripts/build.js` - Custom build for deployment platforms
- `npm start` - Start production server
- `npm run check` - Type check with TypeScript

## 🗃 Database Schema

### Users
- Basic user information with role-based access (student, teacher, admin)
- Encrypted password storage with bcrypt
- JWT token-based authentication

### Student Profiles
- Extended profile information for students
- Academic and personal details
- Achievement history tracking

### Achievements
- Core entity for storing student activities
- File attachment support
- Status tracking (pending, approved, rejected)
- Teacher review and feedback system

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **File Upload Security**: File type and size validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive Zod schema validation

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - List users (admin only)
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user

### Achievements
- `GET /api/achievements` - List achievements
- `POST /api/achievements` - Create achievement
- `PUT /api/achievements/:id` - Update achievement
- `DELETE /api/achievements/:id` - Delete achievement

### Health Check
- `GET /api/health` - Application health status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Deployment Issues

**Build fails on Vercel/Render:**
- Ensure all dependencies are in `package.json`
- For Render: Use `node scripts/build.js` as build command
- Check that build works locally: `node scripts/build.js`
- Verify TypeScript compiles without errors: `npm run check`

**Database connection fails:**
- Verify MongoDB URI format is correct
- Check network access in MongoDB Atlas (allow 0.0.0.0/0)
- Ensure database user has read/write permissions

**API routes not working:**
- Check environment variables are set correctly
- Verify CORS_ORIGIN matches your deployment URL
- Test health endpoint: `https://your-app.com/api/health`

**File uploads not working:**
- Files must be under 5MB
- Only PDF, JPG, PNG formats allowed
- Check browser console for upload errors

### Development Issues

**Server won't start:**
```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Build issues:**
```bash
# Check TypeScript
npm run check

# Test build process
npm run build
```

### Support

If you encounter issues:
1. Check application logs in your deployment platform
2. Test the health endpoint: `/api/health`
3. Verify all environment variables are set
4. Try the demo accounts to test authentication

## 🔮 Roadmap

- [ ] Email notifications for status changes
- [ ] Advanced reporting and analytics
- [ ] Bulk upload functionality
- [ ] Mobile app development
- [ ] Integration with external systems
- [ ] Advanced search and filtering
- [ ] Document version control

---

**Built with ❤️ for educational institutions**