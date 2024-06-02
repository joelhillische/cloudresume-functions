const admin = require('firebase-admin');
const db = require('./firestoreSetup');
const testData = require('./testData');

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

