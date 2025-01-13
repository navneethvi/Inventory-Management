import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app';

// Convert Express app to Vercel-compatible handler
export default (req: VercelRequest, res: VercelResponse) => {
  app(req, res);
};
