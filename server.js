import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createTransport } from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const BASE_URL = process.env.NODE_ENV === 'production'
  ? process.env.VERCEL_URL  
  : `http://localhost:${PORT}`;  

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send(`Server on. Base URL: ${BASE_URL}`);
});

const transporter = createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  },
  debug: true, // show debug output
  logger: true // log information in console
});

app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;

    console.log('Attempting to send email with the following config:');
    console.log('MAILTRAP_USER:', process.env.MAILTRAP_USER);
    console.log('MAILTRAP_PASS:', process.env.MAILTRAP_PASS ? '[REDACTED]' : 'Not set');

    const info = await transporter.sendMail({
      from: '"Votre Nom" <your-email@example.com>',
      to,
      subject,
      text,
      html
    });

    console.log('Message sent: %s', info.messageId);
    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on ${BASE_URL}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});