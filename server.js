import express from 'express';
import { createHmac } from 'crypto';
import cors from 'cors';
import dotenv from 'dotenv';

// Chargement des variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Utilisation de CORS pour permettre les requêtes entre origines différentes (cross-origin)
app.use(cors());

// Clé secrète pour générer le HMAC (récupérée depuis les variables d'environnement)
const SECRET_KEY = process.env.SECRET_KEY;

// Vérification de la présence de la clé secrète
if (!SECRET_KEY) {
  console.error('ERROR: SECRET_KEY is not set in environment variables');
  process.exit(1);
}

// Endpoint pour générer un hash HMAC
app.get('/generate-hmac', (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  // Génération du hash HMAC avec l'ID utilisateur et la clé secrète
  const hash = createHmac('sha256', SECRET_KEY)
    .update(userId)
    .digest('hex');

  // Renvoi du hash au frontend
  res.json({ hmac: hash });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});