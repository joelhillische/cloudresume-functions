const fs = require("fs");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const admin = require("firebase-admin");

async function threeFillInTemplate(resultStepTwo, executeData) {
  const templatePath = "docs/templates/input.docx";
  const localOutputPath = "/tmp/output.docx";
  const remoteOutputPath = "docs/originals/output.docx";

  try {
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
      experience: "John Doe",
      test: "123 Main St, Anytown, USA",
      title: "This is a job title!",
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

exports.threeFillInTemplate = threeFillInTemplate;
