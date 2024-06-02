const admin = require("firebase-admin");
const serviceAccount = require("./test-cloudresume-firebase-adminsdk.json");

if (process.env.NODE_ENV === "test") {
  process.env.FIREBASE_STORAGE_EMULATOR_HOST = "localhost:9199";
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "cloudresume-testing.appspot.com",
});

const db = admin.firestore();
const storage = admin.storage().bucket();

module.exports = { db, storage };
