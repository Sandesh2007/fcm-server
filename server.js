const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert({
        type: process.env.FIREBASE_TYPE,
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace \n in the key
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        clientId: process.env.FIREBASE_CLIENT_ID,
        authUri: process.env.FIREBASE_AUTH_URI,
        tokenUri: process.env.FIREBASE_TOKEN_URI,
        authProviderCert: process.env.FIREBASE_AUTH_PROVIDER_CERT,
        clientCert: process.env.FIREBASE_CLIENT_CERT,
    }),
});

// Endpoint to send notifications
app.post('/send-notification', (req, res) => {
    console.log('Request Body:', req.body); // Log the incoming request body

    const { fcmToken, title, body } = req.body;

    // Check if the FCM token is present
    if (!fcmToken) {
        console.error('FCM token is missing');
        return res.status(400).send('FCM token is required');
    }

    const message = {
        notification: {
            title: title || 'Default Title',
            body: body || 'Default message body.',
        },
        token: fcmToken,
    };

    // Send a notification using FCM
    admin.messaging().send(message)
        .then((response) => {
            console.log('Successfully sent message:', response);
            res.status(200).send('Notification sent successfully');
        })
        .catch((error) => {
            console.error('Error sending message:', error);
            res.status(500).send('Error sending notification');
        });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
