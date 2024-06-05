const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const serviceAccount = require("./cloudresume-service-account-key.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function exportFirestoreData() {
  const collections = [
    "activities",
    "certifications",
    "educations",
    "allJobs",
    "experiences",
    "generateResumes",
    "personals",
    "resumes",
    "searches",
    "skills",
    "updates",
    "users",
  ];

  const data = [];

  for (const collectionName of collections) {
    const collectionRef = db.collection(collectionName);
    const snapshot = await collectionRef.get();

    snapshot.forEach((doc) => {
      data.push({
        collection: collectionName,
        doc: doc.id,
        data: doc.data(),
      });
    });
  }

  const outputPath = path.resolve(__dirname, "./test/testData.js");
  fs.writeFileSync(
    outputPath,
    `module.exports = ${JSON.stringify(data, null, 2)};`
  );
  console.log("Data exported to test/testData.js");
}

exportFirestoreData().catch((error) => {
  console.error("Error exporting Firestore data:", error);
});
