
# 📧 Service d'E-mail Centralisé (API REST)

Ce service est une API Express sécurisée conçue pour centraliser l'envoi d'e-mails pour toutes vos applications (web, mobile, services internes). Il agit comme une passerelle pour protéger les informations d'identification de votre fournisseur d'e-mail et offre un point de contact unique, authentifié par des clés d'API.

---

## 🛠️ Installation

1.  **Cloner le dépôt :**
    ```bash
    git clone [VOTRE_DEPOT_GIT]
    cd [VOTRE_REPERTOIRE_API]
    ```

2.  **Installer les dépendances :**
    ```bash
    npm install
    ```
    *(Assurez-vous d'avoir installé `express`, `dotenv`, et `nodemailer` ou votre librairie d'e-mail)*

3.  **Créer le fichier d'environnement :**
    Créez un fichier nommé **`.env`** à la racine du projet et configurez-le (voir la section **Configuration**).

4.  **Démarrer le serveur :**
    ```bash
    node app.js
    # OU
    npm start 
    ```

---

## ⚙️ Configuration du Fichier `.env`

Le fichier `.env` est essentiel pour la sécurité et le bon fonctionnement. Il contient les informations d'authentification de votre fournisseur d'e-mail et les clés d'API autorisées.

```env
# Configuration de l'expéditeur (utilisé dans email_service.js)
EMAIL=votre_adresse_expediteur@domaine.com

# Clés d'API autorisées pour vos applications clientes (Web, Mobile, etc.).
# Les clés doivent être séparées par des virgules (SANS ESPACES autour de la virgule).
# Chaque clé est unique et identifie un client (ex: votre app web, votre service de paiement).
AUTHORIZED_API_KEYS=CLE_SECRETE_APP_WEB,CLE_SECRETE_APP_MOBILE,CLE_SECRETE_SERVICE_INTERNE
````

-----

## 🚀 Utilisation de l'API

L'API expose un seul endpoint principal sécurisé.

### 1\. Endpoint : `/sendemail`

  * **Méthode :** `POST`
  * **URL :** `http://localhost:3000/sendemail` (ou votre URL de production)
  * **Sécurité :** Requiert un header `x-api-key` valide.

#### 📝 Headers Obligatoires

| Header | Description | Exemple |
| :--- | :--- | :--- |
| `Content-Type` | Doit être JSON | `application/json` |
| `x-api-key` | Une des clés listées dans `AUTHORIZED_API_KEYS` | `CLE_SECRETE_APP_WEB` |

#### 📦 Corps de la Requête (JSON)

| Champ | Type | Obligatoire | Description |
| :--- | :--- | :--- | :--- |
| `email` | `string` | OUI | L'adresse e-mail du destinataire. |
| `subject` | `string` | OUI | Le sujet de l'e-mail. |
| `text` | `string` | OUI | Le corps de l'e-mail en format texte brut (Fall-back). |
| `html` | `string` | NON | Le corps de l'e-mail en format HTML enrichi. |

#### Exemple cURL (pour les tests)

```bash
curl -X POST 'http://localhost:3000/sendemail' \
-H 'Content-Type: application/json' \
-H 'x-api-key: CLE_SECRETE_APP_WEB' \
-d '{
    "email": "utilisateur@monapp.com",
    "subject": "Votre nouveau mot de passe",
    "text": "Voici votre code de réinitialisation: 123456.",
    "html": "<h3>Réinitialisation de Mot de Passe</h3><p>Votre code: <b>123456</b></p>"
}'
```

-----

## 💡 Codes de Réponse HTTP

Le service renvoie les codes de statut HTTP standards pour indiquer le succès ou l'échec de la requête.

| Code | Description | Signification |
| :--- | :--- | :--- |
| **`200 OK`** | Succès | L'e-mail a été accepté par le service et l'envoi a démarré. |
| **`400 Bad Request`** | Erreur de validation | Un champ obligatoire (`email`, `subject`, `text`) est manquant dans le corps JSON. |
| **`401 Unauthorized`** | Non autorisé | Le header `x-api-key` est manquant ou contient une clé invalide. |
| **`500 Internal Server Error`** | Erreur serveur | Problème interne (ex: échec de la connexion au service SMTP, erreur dans le fichier `email_service.js`). |

-----

## 🛠️ Extension et Débogage

1.  **Vérifiez les logs du serveur :** Le terminal où votre service Express s'exécute affichera les erreurs d'envoi ou les tentatives d'accès non autorisées.
2.  **Mettez à jour `email_service.js` :** Seul le fichier `./email_service.js` doit être modifié si vous changez de fournisseur d'e-mail (par exemple, de Nodemailer à SendGrid).

-----
