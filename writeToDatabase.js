const admin = require("firebase-admin");

async function writeToDatabase(executeData) {
  try {
    console.log(executeData.pdfUrl);
    console.log(executeData.initialData.docId);

    const docId = executeData.initialData.docId;

    const pdfUrl = executeData.pdfUrl;
    const txtUrl = executeData.txtUrl;
    const docxUrl = executeData.docxUrl;

    // Reference to the document with the specific docId
    const generateResumeRef = await admin
      .firestore()
      .collection("generateResumes")
      .doc(docId);

    // Update the document with the provided data
    await generateResumeRef.update({
      pdfUrl,
      txtUrl,
      docxUrl,
      status: "completed",
    });

    console.log(executeData);

    // Create resume with all of the recommendations which are in the executeData variable

    await addOrUpdateResume(executeData);

    return true;
  } catch (error) {
    console.error(error);
  }
}

const addOrUpdateResume = async (executeData) => {
  const { jobId, userId } = executeData.initialData;
  const { docxUrl, pdfUrl, txtUrl } = executeData;

  const experiences = executeData.experiences || [];
  const activities = executeData.activities || [];
  const skills = executeData.skills || [];
  const educations = executeData.educations || [];
  const certifications = executeData.certifications || [];
  const description = executeData.description || "";
  const motto = executeData.motto || "";

  try {
    // Query to check if a resume with the same userId and jobId already exists
    const resumeQuerySnapshot = await admin
      .firestore()
      .collection("resumes")
      .where("userId", "==", userId)
      .where("jobId", "==", jobId)
      .get();

    if (resumeQuerySnapshot.empty) {
      // Add new resume if none exists with the same userId and jobId
      const resumeRef = await admin.firestore().collection("resumes").add({
        experiences: experiences,
        activities: activities,
        skills: skills,
        educations: educations,
        certifications: certifications,
        description: description,
        motto: motto,
        currentVersion: "v1",
        userId: userId,
        jobId: jobId, // Ensure jobId is included in the document
        docxUrl: docxUrl,
        txtUrl: txtUrl,
        pdfUrl: pdfUrl,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log("Resume added with ID:", resumeRef.id);
    } else {
      // If a resume with the same userId and jobId already exists
      const resumeDoc = resumeQuerySnapshot.docs[0];
      const resumeData = resumeDoc.data();

      // Calculate the new version number
      const currentVersion = parseInt(
        resumeData.currentVersion.replace("v", ""),
        10
      );
      const newVersion = `v${currentVersion + 1}`;

      // Create a subcollection called 'versions' if it doesn't already exist
      const versionRef = admin
        .firestore()
        .collection("resumes")
        .doc(resumeDoc.id)
        .collection("versions")
        .doc(resumeData.currentVersion);

      await versionRef.set({
        ...resumeData,
        versionCreatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Update the resume document with the new data and incremented version
      await resumeDoc.ref.update({
        experiences: experiences,
        activities: activities,
        skills: skills,
        educations: educations,
        certifications: certifications,
        description: description,
        motto: motto,
        currentVersion: newVersion,
        docxUrl: docxUrl,
        txtUrl: txtUrl,
        pdfUrl: pdfUrl,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(
        `Resume updated and versioned with new version: ${newVersion}`
      );
    }
  } catch (error) {
    console.error("Error adding or updating resume: ", error);
  }
};

exports.writeToDatabase = writeToDatabase;
