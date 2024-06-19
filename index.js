const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp({
  storageBucket: "cloudresume-e9e4e.appspot.com", // Replace with your Firebase project ID
});

const { executeSteps } = require("./executeSteps");

exports.generateResume = functions.firestore
  .document("generateResumes/{docId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();

    const numberOfPages = data.numberOfPages || 2;
    const obfuscateId = data.obfuscateId || null;
    const documentTypes = data.documentTypes || ["pdf", "txt", "docx"];
    const jobId = data.jobId;
    const userId = data.userId;
    // const version = `${jobId}_${userId}`;

    // Ensure jobId and userId are present
    if (!jobId || !userId) {
      console.error("jobId and userId are required");
      return null;
    }

    try {
      const result = await executeSteps({
        numberOfPages: numberOfPages,
        obfuscateId: obfuscateId,
        documentTypes: documentTypes,
        jobId: jobId,
        userId,
        docId,
      });
      console.log("Steps execution result:", result);
    } catch (error) {
      console.error("Error in generateResume function", error);
    }

    return null;
  });
