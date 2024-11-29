const admin = require("firebase-admin");

// Verifica si Firebase ya está inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://node-firebase-example-fd01e-default-rtdb.firebaseio.com",
  });
}

const db = admin.firestore();

module.exports ={admin, db};
