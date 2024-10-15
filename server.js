require('dotenv').config();
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// Firebase Admin SDK setup using environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT,
  }),
});

// Sample route to send a notification
app.post('/send-notification', (req, res) => {
  const { fcmToken, title, body } = req.body;

  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: fcmToken, // User's FCM token received from Android app
  };

  // Send notification using Firebase Admin SDK
  admin.messaging().send(message)
    .then((response) => {
      console.log('Notification sent successfully:', response);
      res.status(200).send('Notification sent successfully!');
    })
    .catch((error) => {
      console.error('Error sending notification:', error);
      res.status(500).send('Error sending notification');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
