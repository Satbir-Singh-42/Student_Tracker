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

3. **Environment setup** (optional for development)
   ```bash
   cp .env.example .env
   ```
   
   For local development, the app will automatically use in-memory storage if MongoDB is not available.

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open http://localhost:5000 in your browser
   - Use demo accounts to test functionality

### Demo Accounts

The application includes pre-configured demo accounts for testing:

- **Student**: `student@example.com` / `password123`
- **Teacher**: `teacher@example.com` / `password123` 
- **Administrator**: `admin@example.com` / `password123`

## 🚀 Deployment

### Deploy to Vercel (Recommended for Frontend-heavy apps)

**Quick Deploy:**
```bash
npm i -g vercel
vercel login
vercel --prod
```

**Or use Vercel Dashboard:**
1. Visit [vercel.com/new](https://vercel.com/new) and import your repository
2. Configure environment variables (see detailed guide: [VERCEL_DEPLOY.md](VERCEL_DEPLOY.md))
3. Deploy automatically with included `vercel.json` configuration

### Deploy to Render (Recommended for Backend-heavy apps)

**Quick Deploy:**
1. Visit [render.com](https://render.com) and create a new web service
2. Connect your repository
3. Configure build settings:
   - Build Command: `npm run build`
   - Start Command: `npm start`
4. Set environment variables (see detailed guide: [RENDER_DEPLOY.md](RENDER_DEPLOY.md))

**Both platforms include:**
- Automatic HTTPS certificates
- Health check monitoring
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
├── uploads/                # File upload directory
└── dist/                   # Production build output
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
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

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) section for existing solutions
2. Create a new issue with detailed description
3. Include error logs and environment details

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