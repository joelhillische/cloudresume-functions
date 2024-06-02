const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    storageBucket: "your-project-id.appspot.com", // Replace with your Firebase project ID
  });
}

const bucket = admin.storage().bucket();

async function fourWriteDocs(threeGenerateDocs) {
  const { docmosisResponse, userId, jobId } = threeGenerateDocs;
  const resumeId = `${userId}_${jobId}`;
  const resumeRef = admin.firestore().collection("resumes").doc(resumeId);

  try {
    const doc = await resumeRef.get();
    let versionId;

    const updatedAt = admin.firestore.FieldValue.serverTimestamp();

    const newResumeData = {
      userId,
      updatedAt,
      createdAt: doc.exists ? doc.data().createdAt : updatedAt,
      status: "active",
      space: "generated",
    };

    if (doc.exists) {
      const version = {
        updatedAt: updatedAt,
      };

      // Save the current version to the versions subcollection
      const versionRef = await resumeRef.collection("versions").add(version);
      versionId = versionRef.id;

      // Save an example string to a temporary file
      const exampleString =
        "This is an example string to represent the PDF content.";
      const outputFileName = `${userId}_${jobId}_${versionId}.pdf`;
      const tempFilePath = path.join("/tmp", outputFileName);
      fs.writeFileSync(tempFilePath, exampleString);

      // Upload the file to Firebase Storage
      await bucket.upload(tempFilePath, {
        destination: `resumes/${userId}_${jobId}/versions/${versionId}.txt`,
        metadata: {
          contentType: "text/plain",
        },
      });

      // Get the download URL of the uploaded file
      const pdfRef = bucket.file(
        `resumes/${userId}_${jobId}/versions/${versionId}.pdf`
      );
      const [pdfURL] = await pdfRef.getSignedUrl({
        action: "read",
        expires: "03-01-2500", // Set expiration as needed
      });

      // Update the version document with the file URL
      await versionRef.update({ pdfURL });

      // Delete the temporary file
      fs.unlinkSync(tempFilePath);

      // Update the resume with new data
      await resumeRef.update(newResumeData);
    } else {
      // If the document does not exist, create it with the new data
      await resumeRef.set(newResumeData);

      // Save an example string to a temporary file
      const exampleString =
        "This is an example string to represent the PDF content.";
      const outputFileName = `${userId}_${jobId}_initial.pdf`;
      const tempFilePath = path.join("/tmp", outputFileName);
      // fs.writeFileSync(tempFilePath, exampleString);

      fs.writeFileSync(tempFilePath, exampleString, "utf8");

      // Upload the file to Firebase Storage
      await bucket.upload(tempFilePath, {
        destination: `resumes/${userId}_${jobId}/initial.txt`,
        metadata: {
          contentType: "text/plain",
        },
      });

      // Get the download URL of the uploaded file
      const pdfRef = bucket.file(`resumes/${userId}_${jobId}/initial.txt`);
      const [pdfURL] = await pdfRef.getSignedUrl({
        action: "read",
        expires: "03-01-2500", // Set expiration as needed
      });

      // Save the initial version with the PDF URL
      const version = {
        updatedAt: updatedAt,
        pdfURL,
      };
      await resumeRef.collection("versions").add(version);

      // Delete the temporary file
      fs.unlinkSync(tempFilePath);
    }

    // Return the result or any other necessary information
    return "Resume version saved and example string uploaded successfully";
  } catch (error) {
    console.error("Error in fourWriteDocs:", error);
    return `Error in fourWriteDocs: ${error.message}`;
  }
}

exports.fourWriteDocs = fourWriteDocs;
