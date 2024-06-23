const admin = require("firebase-admin");
const { db, storage } = require("./firestoreSetup");
const testData = require("./testData");

async function getDownloadURL(fileName) {
  const bucket = admin.storage().bucket();
  const file = bucket.file(fileName);
  const [url] = await file.getSignedUrl({
    action: "read",
    expires: "03-17-2025", // Adjust the expiration date as needed
  });

  console.log("Download URL:", url);
}

async function addTestData() {
  for (const item of testData) {
    await db.collection(item.collection).doc(item.doc).set(item.data);
  }
}

async function removeTestData() {
  for (const item of testData) {
    await db.collection(item.collection).doc(item.doc).delete();
  }
}

beforeAll(async () => {
  await addTestData();
});

afterAll(async () => {
  await removeTestData();
  await admin.app().delete();
});

module.exports = { addTestData, removeTestData };
