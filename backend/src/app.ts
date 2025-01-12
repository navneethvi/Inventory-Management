import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import router from './routes';

const app = express();
const port = 3000;

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export const filePath = path.join(process.cwd(), 'public', 'data', 'sample-data-v2.csv');
console.log("Current working directory:", process.cwd());

app.use((req, res, next) => {
  console.log('Request Origin:', req.headers.origin);
  next();
});

app.use(cors(corsOptions));
app.use(express.json());

app.get('/api', (req: Request, res: Response) => {
  res.json('Hello, world!');
});

app.use('/api/inventory', router);

module.exports = (req: Request, res: Response) => {
  app(req, res); 
};
