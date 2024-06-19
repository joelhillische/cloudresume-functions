const admin = require("firebase-admin");
const serviceAccount = require("../cloudresume-service-account-key.json");

if (process.env.NODE_ENV === "test") {
  // process.env.FIREBASE_STORAGE_EMULATOR_HOST = "localhost:9199";
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "cloudresume-e9e4e.appspot.com",
});

const db = admin.firestore();
const storage = admin.storage().bucket();

module.exports = { db, storage };
