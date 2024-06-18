const admin = require("firebase-admin");
const { db, storage } = require("./firestoreSetup");
const testData = require("./testData");
const fs = require("fs");
const path = require("path");

// Function to upload file to Firebase Storage
async function uploadFile(filePath, destination) {
  await storage.upload(filePath, {
    destination,
  });
}

async function addTestData() {
  for (const item of testData) {
    await db.collection(item.collection).doc(item.doc).set(item.data);
  }

  // Example file upload
  const filePath = path.join(__dirname, "input.docx"); // path to your file
  const destination = "docs/templates/input.docx"; // destination in the storage
  await uploadFile(filePath, destination);
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

  // Example file removal
  await storage.file("docs/templates/input.docx").delete();
  await storage.file("docs/originals/output.docx").delete();
});

module.exports = { addTestData, removeTestData };
