// Extend the Express Request interface
declare namespace Express {
  interface Request {
    user?: any;
    file?: any;
  }
}