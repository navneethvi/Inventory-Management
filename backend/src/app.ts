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

export const filePath = path.join(process.cwd(), 'src', 'data', 'sample-data-v2.csv');

app.use((req, res, next) => {
  console.log('Request Origin:', req.headers.origin);
  next();
});

app.use(cors(corsOptions));
app.use(express.json());

app.get('/api', (req: Request, res: Response) => {
  res.json('Hello, world!');
});

app.use('/api/inventory', router)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
