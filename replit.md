# Student Activity Record Platform

## Overview

This is a full-stack web application for managing student achievements and activities. Students can upload their academic, co-curricular, and extracurricular achievements with supporting documentation. Teachers can review and verify these submissions, while administrators manage the overall system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for development and production builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: Zustand for auth state, TanStack Query for server state
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ES modules)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt for password hashing
- **File Upload**: Multer for handling file uploads
- **Validation**: Zod schemas for request validation

## Key Components

### Database Schema
- **Users**: Base user table with role-based access (student, teacher, admin)
- **Student Profiles**: Extended profile information for students
- **Achievements**: Core entity for storing student activities and achievements

### Authentication System
- JWT-based authentication with role-based access control
- Protected routes for different user types
- Persistent login state using localStorage

### File Management
- File upload system for achievement proofs (PDF, images)
- 5MB file size limit
- Secure file storage with unique naming

### User Interface Components
- Responsive design using Tailwind CSS
- Professional theme with accessible color scheme
- Mobile-friendly navigation with collapsible sidebar
- Form components with validation feedback

## Data Flow

1. **User Authentication**: Login/registration flows with JWT token management
2. **Student Workflow**: Upload achievements → Teacher review → Status updates
3. **Teacher Workflow**: Review submissions → Approve/reject with feedback
4. **Admin Workflow**: Manage users → View system statistics → Generate reports

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM, React Hook Form)
- TanStack Query for server state management
- Radix UI components for accessible UI primitives
- Tailwind CSS for styling
- Lucide React for icons

### Backend Dependencies
- Express.js for API server
- Mongoose ODM with MongoDB adapter
- MongoDB for database hosting
- Multer for file uploads
- bcrypt for password hashing
- jsonwebtoken for authentication

## Deployment Strategy

### Development Setup
- Vite dev server for frontend development
- tsx for TypeScript execution in development
- Hot module replacement for fast development cycles

### Production Build
- Vite builds frontend assets to `dist/public`
- esbuild bundles server code to `dist/server/index.js`
- Single production server serves both API and static files

### Database Management
- Mongoose models defined in `server/models.ts`
- Database schema defined in `shared/schema.ts`
- Environment-based database URL configuration (MONGODB_URI)

### Key Features
- Role-based dashboards for different user types
- Real-time status updates for achievement submissions
- File upload and management system
- Responsive design for mobile and desktop
- Statistics and reporting capabilities

The application follows a standard full-stack pattern with clear separation between client and server code, shared type definitions, and a robust authentication system.

## Deployment Configuration

### Vercel Deployment Ready
- ✓ Created `vercel.json` configuration for full-stack deployment
- ✓ Set up proper routing for API and static files
- ✓ Configured build process for client and server
- ✓ Added `.vercelignore` for clean deployments
- ✓ Created comprehensive deployment guide with step-by-step instructions
- ✓ Configured environment variables handling
- ✓ Added database connection setup for production

### Deployment Files
- `vercel.json` - Main Vercel configuration
- `DEPLOYMENT_GUIDE.md` - Complete deployment instructions
- `.vercelignore` - Files to exclude from deployment
- `build.js` - Custom build script for production

### Environment Variables Needed
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Set to "production"
- `CORS_ORIGIN` - Frontend URL for CORS configuration

## Recent Changes: Latest modifications with dates

### January 2025 - MongoDB Integration & Render Deployment Ready
- ✓ Created comprehensive MongoDB setup guide (MONGODB_SETUP.md)
- ✓ Added environment variable configuration template (.env.example)
- ✓ Prepared complete Render deployment guide (RENDER_DEPLOYMENT_GUIDE.md)
- ✓ Configured hybrid storage system (MongoDB + fallback memory storage)
- ✓ Migration from Replit Agent to standard Replit completed successfully
- ✓ Application ready for production deployment with existing MongoDB database
- ✓ File upload system configured for /uploads directory with 5MB limit
- ✓ JWT authentication system ready for production configuration

### January 2025 - Deployment Ready for Vercel & Render (Docker-free)
- ✓ Optimized deployment configurations for Vercel and Render without Docker dependencies
- ✓ Consolidated all deployment information into README.md for single-source documentation
- ✓ Updated vercel.json with proper serverless function configuration
- ✓ Simplified render.yaml for Node.js web service deployment
- ✓ Verified production build works correctly with health check endpoint
- ✓ Removed all unnecessary files: Docker files, separate deployment guides, build scripts
- ✓ Enhanced README.md with complete deployment instructions, troubleshooting, and demo accounts
- ✓ Tested both frontend and backend build processes successfully
- ✓ Ensured fallback memory storage works for development and testing
- ✓ Production build generates correct file structure: dist/public + dist/index.js
- ✓ Clean project structure with only essential files for deployment

### January 2025 - Code Cleanup and Production Ready
- ✓ Removed all unnecessary documentation files and extra code
- ✓ Simplified storage implementation to use MongoDB only
- ✓ Cleaned up fallback storage and hybrid systems
- ✓ Removed unused imports and dependencies
- ✓ Streamlined codebase for production deployment
- ✓ Verified build process working correctly (39.2KB backend bundle)
- ✓ Application tested and fully operational
- ✓ Ready for clean deployment on Render

### January 2025 - Production-Ready Deployment Configuration
- ✓ Created comprehensive deployment configurations for Vercel and Render
- ✓ Built proper README.md with complete project documentation
- ✓ Added deployment guide with step-by-step instructions for multiple platforms
- ✓ Created deployment checklist for production verification
- ✓ Configured Docker support with multi-stage build process
- ✓ Added environment variable examples and security guidelines
- ✓ Verified build process works correctly (frontend + backend bundling)
- ✓ Tested production deployment with health check endpoint
- ✓ Created build scripts and automation for deployment platforms
- ✓ Added proper .vercelignore and .dockerignore files
- ✓ Enhanced vercel.json with correct routing and build configuration
- ✓ Added render.yaml for automatic Render deployments
- ✓ Documented all deployment platforms: Vercel, Render, Railway, Heroku
- ✓ Created comprehensive troubleshooting guide for common deployment issues

### January 2025 - Complete Clean Application Setup & Deployment Ready
- ✓ Removed all Replit-specific dependencies and code (@replit packages)
- ✓ Implemented clean Node.js/Express server setup without Replit dependencies
- ✓ Created robust fallback memory storage system for development
- ✓ Fixed all mobile responsiveness issues with proper Lucide icons
- ✓ Replaced all Material Icons with Lucide React icons for consistency
- ✓ Verified authentication system works for all user roles (student, teacher, admin)
- ✓ Confirmed API endpoints function correctly with JWT authentication
- ✓ Health check endpoint operational
- ✓ Mobile-first design with collapsible sidebar and touch-friendly navigation
- ✓ Application runs cleanly without any Replit-specific code
- ✓ Database gracefully falls back to in-memory storage when MongoDB unavailable
- ✓ All demo accounts (student@example.com, teacher@example.com, admin@example.com) working with password123
- ✓ Hidden marketing content from login page in mobile view for cleaner UX
- ✓ Created comprehensive deployment configurations for both Render and Vercel
- ✓ Built production-ready build system with proper static file handling
- ✓ Configured CORS and security settings for production deployment
- ✓ Created detailed deployment guides (RENDER_DEPLOYMENT.md, VERCEL_DEPLOYMENT.md)
- ✓ Verified build system works correctly with client and server bundling

### January 2025 - MongoDB Migration & Mobile Optimization
- ✓ Successfully migrated from PostgreSQL/Drizzle to MongoDB/Mongoose
- ✓ Updated database schema to use MongoDB ObjectIds
- ✓ Implemented MongoDB storage layer with proper error handling
- ✓ Added database connection management with graceful error handling
- ✓ Verified mobile responsiveness across all components
- ✓ Confirmed responsive design works on both desktop and mobile devices
- ✓ Mobile-first layout with collapsible sidebar and touch-friendly navigation
- ✓ Responsive grid layouts using Tailwind CSS breakpoints
- ✓ Mobile-optimized forms and components throughout the application

### January 2025 - Vercel Deployment Ready
- ✓ Created serverless API structure at `/api/index.ts` for Vercel
- ✓ Updated vercel.json with proper build configuration
- ✓ Added comprehensive Vercel deployment guide
- ✓ Created .vercelignore for clean deployments
- ✓ Fixed build process to work with Vercel's system
- ✓ Set up proper environment variable configuration

### January 2025 - Deployment Configuration & UI Improvements
- ✓ Prepared complete Vercel deployment configuration
- ✓ Removed "Demo Accounts" tab from login page for cleaner UI
- ✓ Maintained demo account buttons in LoginForm component
- ✓ Created comprehensive deployment guide with database setup
- ✓ Added production build configuration and scripts

### January 2025 - Comprehensive Codebase Improvements
- ✓ Created comprehensive constants library with API endpoints and configuration
- ✓ Implemented enhanced validation schemas with better error messages
- ✓ Added optimistic mutations for better user experience
- ✓ Created debounce hooks for performance optimization
- ✓ Built local storage hooks for persistent client state
- ✓ Enhanced loading states with professional spinner components
- ✓ Added comprehensive error boundary for better error handling
- ✓ Implemented connection status monitoring with real-time feedback
- ✓ Created reusable pagination components with proper navigation
- ✓ Built empty state components for better UX
- ✓ Added data table components with loading and error states
- ✓ Enhanced server security with rate limiting and input validation
- ✓ Implemented proper CORS and security headers
- ✓ Added comprehensive error handling middleware
- ✓ Fixed trust proxy configuration for rate limiting
- ✓ Improved async error handling with proper wrapper functions
- ✓ Added mobile responsiveness hooks
- ✓ Created network status monitoring for offline support

### January 2025 - Final Production Setup & Clean Code Migration
- ✓ Removed all demo/fake data from the system
- ✓ Eliminated demo account system that interfered with real users
- ✓ Created official production credentials for admin and teachers
- ✓ Set up proper authentication system with bcrypt password hashing
- ✓ Students can now register independently without demo interference
- ✓ Updated README with official credentials and deployment instructions
- ✓ Cleaned up login form by removing demo account buttons
- ✓ Established secure production-ready authentication flow
- ✓ Created official accounts: admin@satvirnagra.com, rajesh.kumar@satvirnagra.com, priya.sharma@satvirnagra.com

### January 2025 - Project Migration to Replit Environment Completed
- ✓ Successfully migrated project from Replit Agent to standard Replit environment
- ✓ Removed and reinstalled Replit-specific dependencies for compatibility
- ✓ Fixed build directory structure and dependencies
- ✓ Ensured proper client/server separation with security practices
- ✓ Application now runs cleanly on Replit with Express server on port 5000
- ✓ Configured standard build process for production deployment
- ✓ Configured Render deployment with health check endpoint
- ✓ Verified production build works correctly (39.2KB backend bundle)
- ✓ Application tested and fully operational
- ✓ Ready for clean deployment on Render
- ✓ Removed unused files and cleaned up project structure
- ✓ Created permanent solution for deployment path mismatch with custom build script
- ✓ Build script now creates both dist/index.js and dist/server/index.js for compatibility
- ✓ Fixed static file serving path issue preventing frontend from loading on Render
- ✓ Corrected path from '../dist/public' to '../public' for dist/server/index.js execution
- ✓ Development workflow uses Vite dev server for frontend hot reloading
- ✓ All packages properly installed and configured
- ✓ Application verified working with all core features functional
- ✓ Improved mobile login page centering for perfect vertical and horizontal alignment
- ✓ Verified health check endpoint working correctly
- ✓ Confirmed fallback memory storage system operational
- ✓ Replaced all Material Icons with Lucide React icons for consistency
- ✓ Implemented comprehensive responsive design with proper breakpoints
- ✓ Added responsive text sizing, button sizes, and touch targets
- ✓ Improved component spacing and padding for all device sizes
- ✓ Created responsive utility classes for consistent design patterns
- ✓ Optimized dashboard layout with proper grid systems for mobile, tablet, and desktop
- ✓ Enhanced Quick Actions and StatCard components with responsive sizing

### December 2024 - Connectivity Improvements
- Enhanced TanStack Query configuration with retry logic and exponential backoff
- Added 30-second timeout for all network requests
- Implemented connection status indicator in sidebar
- Added health check endpoint (/api/health) for monitoring connectivity
- Created error boundary component for better error handling
- Improved cache management with 5-minute stale time and 10-minute garbage collection
- Added background refetching on window focus and reconnection