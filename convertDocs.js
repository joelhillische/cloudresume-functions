const CloudConvert = require("cloudconvert");
const admin = require("firebase-admin");
const axios = require("axios");
const fs = require("fs");

require("dotenv").config();

const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const client = new SecretManagerServiceClient();

async function getCloudConvertApiKey(name) {
  if (process.env.NODE_ENV === "test") {
    // Retrieve secret from environment variables
    return process.env[name];
  } else {
    // Retrieve secret from Google Cloud Secret Manager
    const [version] = await client.accessSecretVersion({
      name: `projects/cloudresume-e9e4e/secrets/SANDBOX_CLOUD_CONVERT_KEY/versions/latest`,
    });
    const payload = version.payload.data.toString("utf8");
    return payload;
  }
}

async function convertDocs(executeData) {
  try {
    let cloudConvert;

    let docxUrl = executeData.docxUrl;

    if (process.env.NODE_ENV === "test") {
      cloudConvert = new CloudConvert(
        await getCloudConvertApiKey("SANDBOX_CLOUD_CONVERT_KEY"),
        true
      );
      // Retrieve secret from environment variables
      docxUrl =
        "https://firebasestorage.googleapis.com/v0/b/cloudresume-e9e4e.appspot.com/o/docs%2Ftests%2Foutput.docx?alt=media&token=1060e828-8121-4b23-9a23-863e43b60b52";
    }

    console.log(`docxUrl: ${docxUrl}`);

    const job = await cloudConvert.jobs.create({
      tasks: {
        "import-my-file": {
          operation: "import/url",
          url: docxUrl,
        },
        "convert-to-pdf": {
          operation: "convert",
          input: "import-my-file",
          output_format: "pdf",
        },
        "convert-to-txt": {
          operation: "convert",
          input: "import-my-file",
          output_format: "txt",
        },
        "convert-to-rtf": {
          operation: "convert",
          input: "import-my-file",
          output_format: "rtf",
        },
        "export-pdf": {
          operation: "export/url",
          input: "convert-to-pdf",
        },
        "export-txt": {
          operation: "export/url",
          input: "convert-to-txt",
        },
      },
    });

    const exportPdfTask = job.tasks.find((task) => task.name === "export-pdf");
    const exportTxtTask = job.tasks.find((task) => task.name === "export-txt");

    // Wait for the tasks to complete
    const exportPdfResult = await cloudConvert.tasks.wait(exportPdfTask.id);
    const exportTxtResult = await cloudConvert.tasks.wait(exportTxtTask.id);

    const cloudConvertPdfUrl =
      exportPdfResult.result?.files?.[0]?.url ?? "URL not available";
    const cloudConvertTxtUrl =
      exportTxtResult.result?.files?.[0]?.url ?? "URL not available";

    const outputLocation = executeData.initialData.outputLocation;

    const pdfUrl = await uploadToFirebaseStorage(
      cloudConvertPdfUrl,
      `${outputLocation}/output.pdf`
    );
    const txtUrl = await uploadToFirebaseStorage(
      cloudConvertTxtUrl,
      `{outputLocation}/output.txt`
    );

    executeData.pdfUrl = pdfUrl;
    executeData.txtUrl = txtUrl;

    console.log(
      "This is output from threeFillInTemplate!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    );

    console.log(`pdfUrl: ${pdfUrl}`);
    console.log(`txtUrl: ${txtUrl}`);

    return true;
  } catch (error) {
    console.error("Error converting file with CloudConvert:", error);
    throw error;
  }
}

async function uploadToFirebaseStorage(fileUrl, destination) {
  try {
    const bucket = admin.storage().bucket();
    const response = await axios.get(fileUrl, { responseType: "stream" });
    const file = bucket.file(destination);
    const stream = file.createWriteStream();

    response.data.pipe(stream);

    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    const [url] = await file.getSignedUrl({
      action: "read",
      expires: "03-01-2500", // set a far future expiration date
    });

    console.log(`File uploaded to Firebase Storage at ${destination}`);
    return url;
  } catch (error) {
    console.error("Error uploading to Firebase Storage:", error);
    throw error;
  }
}

exports.convertDocs = convertDocs;
