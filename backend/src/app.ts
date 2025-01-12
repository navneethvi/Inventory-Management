import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './routes';

const app = express();
const port = 3000;

const corsOptions = {
  origin: [
    'https://inventory-frontend-wheat.vercel.app', // Frontend URL
    'https://inventory-frontend-pb73ndv9h-navneethvis-projects.vercel.app', // Additional frontend (if any)
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};


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
