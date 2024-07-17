const admin = require("firebase-admin");

async function writeUrlsToDatabase(executeData) {
  try {
    const docxUrl = executeData.docxUrl || "";
    const txtUrl = executeData.txtUrl || "";
    const pdfUrl = executeData.pdfUrl || "";

    // Query to check if a resume with the same userId and jobId already exists
    const resumeDoc = await admin
      .firestore()
      .collection("resumes")
      .doc(executeData.resumeId)
      .get();

    if (!resumeDoc.exists) {
      // If a resume with the same userId and jobId does not exist
      console.log("Resume document does not exist.");
    } else {
      // Construct the update object dynamically
      const updateData = {};
      if (docxUrl) updateData.docxUrl = docxUrl;
      if (pdfUrl) updateData.pdfUrl = pdfUrl;
      if (txtUrl) updateData.txtUrl = txtUrl;

      // We don't increment the resume version number because this is part of the initial resume add
      await resumeDoc.ref.update(updateData);
    }

    return true;
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return false;
  }
}

exports.writeUrlsToDatabase = writeUrlsToDatabase;
