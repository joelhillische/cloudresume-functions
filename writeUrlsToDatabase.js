const admin = require("firebase-admin");

async function writeUrlsToDatabase(executeData) {
  try {
    const docxUrl = executeData.docxUrl;
    const txtUrl = executeData.txtUrl;
    const pdfUrl = executeData.pdfUrl;

    console.log(docxUrl);

    const userId = executeData.initialData.userId;
    const jobId = executeData.initialData.jobId;

    // Query to check if a resume with the same userId and jobId already exists
    const resumeQuerySnapshot = await admin
      .firestore()
      .collection("resumes")
      .where("userId", "==", userId)
      .where("jobId", "==", jobId)
      .get();

    if (resumeQuerySnapshot.empty) {
      // If a resume with the same userId and jobId already exists
      const resumeDoc = resumeQuerySnapshot.docs[0];

      // We don't increment the resume version number because this is part of the initial resume add
      await resumeDoc.ref.update({
        docxUrl,
        pdfUrl,
        txtUrl,
      });
    }

    return true;
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return false;
  }
}

exports.writeUrlsToDatabase = writeUrlsToDatabase;
