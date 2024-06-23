const fs = require("fs");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const admin = require("firebase-admin");

async function threeFillInTemplate(resultStepTwo, executeData) {
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
      experiences: [
        {
          job_title: "Some job title",
          company: "Some company",
          location: "This is a location",
          descriptions: [
            { text: "This is some text" },
            { text: "This is some other text" },
          ],
        },
        {
          job_title: "Job title 2",
          company: "Some 2 company",
          location: "This is a 2nd location",
          descriptions: [
            { text: "This is some text" },
            { text: "This is some other text" },
          ],
        },
        {
          job_title: "Job title 3",
          company: "Some 3 company",
          location: "This is a 3rd location",
          descriptions: [
            { text: "This is some text" },
            { text: "This is some other text" },
          ],
        },
      ],
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

exports.threeFillInTemplate = threeFillInTemplate;
