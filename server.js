import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const BASE_URL = process.env.NODE_ENV === 'production'
  ? process.env.VERCEL_URL  
  : `http://localhost:${PORT}`;  

app.use(cors());

app.get('/', (req, res) => {
  res.send(`Server on. Base URL: ${BASE_URL}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on ${BASE_URL}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});