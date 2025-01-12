import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './routes';

const app = express();
const port = 3000;

const corsOptions = {
  origin: [
    'https://inventory-frontend-wheat.vercel.app',
    'https://inventory-ec0e4zbvc-navneethvis-projects.vercel.app',
  ],  methods: ['GET'],
};

app.use(cors(corsOptions))
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.use('/api/inventory', router)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
