import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerRoutes } from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();
  
  // Trust proxy for production
  app.set('trust proxy', 1);
  
  // CORS configuration
  const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));
  
  // Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // Static files - serve from dist/public
  const publicPath = path.join(__dirname, '../dist/public');
  app.use(express.static(publicPath));
  
  // Uploads directory
  const uploadsPath = path.join(__dirname, '../uploads');
  app.use('/uploads', express.static(uploadsPath));
  
  // API routes
  registerRoutes(app);
  
  // Serve React app for all other routes (SPA fallback)
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
  
  return app;
}