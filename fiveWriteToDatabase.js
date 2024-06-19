const admin = require("firebase-admin");

async function fiveWriteToDatabase(executeData) {
  try {
    console.log(executeData.pdfUrl);
    console.log(executeData.initialData.docId);

    const docId = executeData.initialData.docId;

    const pdfUrl = executeData.pdfUrl;
    const txtUrl = executeData.txtUrl;
    const docxUrl = executeData.docxUrl;

    // Reference to the document with the specific docId
    const docRef = await admin
      .firestore()
      .collection("generateResumes")
      .doc(docId);

    // Update the document with the provided data
    await docRef.update({ pdfUrl, txtUrl, docxUrl, status: "completed" });

    return true;
  } catch (error) {
    console.error(error);
  }
}

exports.fiveWriteToDatabase = fiveWriteToDatabase;
