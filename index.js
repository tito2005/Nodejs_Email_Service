require("dotenv").config();
const express = require("express");
const sendEmail = require("./email_service"); // Assurez-vous que ce fichier existe
const app = express();

app.use(express.json());

// 📝 Conversion des clés du .env en tableau
const VALID_API_KEYS = process.env.AUTHORIZED_API_KEYS
  ? process.env.AUTHORIZED_API_KEYS.split(',').map(key => key.trim())
  : [];

// 🔑 Middleware pour la vérification de la Clé API 
const apiKeyAuth = (req, res, next) => {
  // Récupère la clé d'API dans l'en-tête 'x-api-key' ou 'authorization'
  const apiKey = req.headers['x-api-key'] || req.headers['authorization'];
  
  // Vérifie si la clé fournie est incluse dans le tableau des clés valides
  if (apiKey && VALID_API_KEYS.includes(apiKey)) {
    next(); 
  } else {
    console.log(`Tentative d'accès non autorisée.`);
    res.status(401).json({ error: "Accès non autorisé. Clé API manquante ou invalide." });
  }
};

// ---------------------------
// --- ROUTES DE L'API ---
// ---------------------------

app.route("/").get((req, res) => {
  res.send("Welcome to localhost:3000 channel");
});

// 🚀 Route sécurisée pour l'envoi d'e-mail avec contenu dynamique
app.route("/sendemail").post(apiKeyAuth, (req, res) => {
  try {
    // Extraction des champs requis du corps de la requête
    const { email, subject, text, html } = req.body;
    
    // 🛑 Vérification des champs obligatoires
    if (!email || !subject || !text) {
        return res.status(400).json({ error: "Les champs 'email', 'subject' et 'text' sont obligatoires dans le corps de la requête." });
    }

    // Construction de l'objet d'options pour le service d'e-mail
    const options = {
      from: process.env.EMAIL,
      to: email,         // Cible de l'e-mail
      subject: subject,   // Sujet dynamique
      text: text,         // Corps en texte brut dynamique
      ...(html && { html: html }), // Ajout optionnel du corps en HTML
    };
    
    // Appel à la fonction d'envoi d'e-mail
    sendEmail(options);
    
    res.status(200).json("Email a été envoyé avec succès.");
  } catch (err) {
    console.error("Erreur lors de l'envoi de l'e-mail:", err);
    res.status(500).json("Erreur interne rencontrée!!");
  }
});

app.listen(3000, () => {
  if (VALID_API_KEYS.length === 0) {
      console.warn("ATTENTION: Aucune clé d'API valide n'a été chargée. La route /sendemail est non sécurisée.");
  }
  console.log("Server a démarré sur le port 3000");
});
