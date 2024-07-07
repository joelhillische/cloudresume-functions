const fs = require("fs");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const admin = require("firebase-admin");

async function fillInTemplate(executeData) {
  try {
    const templateId = executeData.initialData.templateId;

    const outputLocation = executeData.initialData.outputLocation;

    const templatePath = `docs/templates/${templateId}/template.docx`;
    const localOutputPath = "/tmp/output.docx";
    const remoteOutputPath = `${outputLocation}/output.docx`;

    // Download the DOCX template from Firebase Storage
    const localTemplatePath = await downloadFromFirebaseStorage(templatePath);

    // Load the docx file as binary content
    const content = fs.readFileSync(localTemplatePath, "binary");

    // Create a zip file from the binary content
    const zip = new PizZip(content);

    // Create a docxtemplater instance from the zip file
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    const data = {
      activities: executeData.activities,
      certifications: executeData.certifications,
      educations: executeData.educations,
      email: executeData.email,
      experiences: executeData.experiences,
      highlights: executeData.highlights,
      motto: executeData.motto,
      name: executeData.name,
      phoneNumber: executeData.phoneNumber,
      skills: executeData.skills,
      hasActivities: executeData.activities.length > 0,
      hasCertifications: executeData.certifications.length > 0,
      hasEducations: executeData.educations.length > 0,
      hasEmail: executeData.email !== null,
      hasExperiences: executeData.experiences.length > 0,
      hasJobs: executeData.jobs.length > 0,
      hasSkills: executeData.skills.length > 0,
      hasName: executeData.name !== null,
      hasPhoneNumber: executeData.phoneNumber !== null,
      hasHighlights: executeData.highlights !== null,
      hasMotto: executeData.motto !== null, // Add hasMotto condition
    };

    // Render the document using the data
    doc.render(data);

    // Generate the output file as a buffer
    const buf = doc.getZip().generate({ type: "nodebuffer" });

    // Write the buffer to a file
    fs.writeFileSync(localOutputPath, buf);

    console.log(`Document generated successfully at ${localOutputPath}`);

    // Upload the DOCX file to Firebase Storage
    const url = await uploadToFirebaseStorage(
      localOutputPath,
      remoteOutputPath
    );

    executeData.docxUrl = url;

    console.log("This is the docx url");
    console.log(url);

    return true;
  } catch (error) {
    console.error("Error generating DOCX:", error);
  }
}

async function downloadFromFirebaseStorage(filePath) {
  const bucket = admin.storage().bucket();
  const localPath = `/tmp/${filePath.split("/").pop()}`;

  await bucket.file(filePath).download({ destination: localPath });
  console.log(`File downloaded from Firebase Storage to ${localPath}`);

  return localPath;
}

async function uploadToFirebaseStorage(localPath, destination) {
  try {
    const bucket = admin.storage().bucket();
    const [file] = await bucket.upload(localPath, {
      destination: destination,
    });
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: "03-01-2500", // set a far future expiration date
    });

    console.log(`File uploaded to Firebase Storage at ${destination}`);
    console.log(`View URL: ${url}`);

    return url;
  } catch (error) {
    console.error("Error uploading to Firebase Storage:", error);
  }
}

exports.fillInTemplate = fillInTemplate;
