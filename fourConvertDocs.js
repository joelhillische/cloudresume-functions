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

async function fourConvertDocs(executeData) {
  try {
    const cloudConvert = new CloudConvert(
      await getCloudConvertApiKey("SANDBOX_CLOUD_CONVERT_KEY"),
      true
    );

    let docxUrl = executeData.docxUrl;

    if (process.env.NODE_ENV === "test") {
      // Retrieve secret from environment variables
      docxUrl =
        "https://storage.googleapis.com/cloudresume-e9e4e.appspot.com/docs/originals/testoutput.docx?GoogleAccessId=firebase-adminsdk-i0nhm%40cloudresume-e9e4e.iam.gserviceaccount.com&Expires=1742187600&Signature=lrVvXzRCaJlbFHwC1Lcgu9fPv497Zh1Tro7znTXJ9fNLCmH2pwoQMEuTw%2BVXt6cCQVASwFY%2BFGi1nvhplOhESCYcr%2F2r8HDlYXmtrHkdmnmnLXdDgJRAqZ1hq02Aqmg%2FAlOW0pbuD6bzX%2BUWWjXT1qGQllvucvgr%2Bc9A3sl4jRVTF6yfT%2FLzH3x5y0y2LohuwxgfOIIF4k9byC6RRQx9crde9Z4tOeP3TIkB9csD5rmpNOlIIEUqF8ZkyzotpP3KV34kcVv4UKaLDpISlR1I%2BUg%2BCg0HxuXkwTn7z1oO7Ep%2BxLUhpnLo8gl5mV9QpTnYqx8dJOHZRSH9pg1ZDSk0Rg%3D%3D";
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

    const pdfUrl = await uploadToFirebaseStorage(
      cloudConvertPdfUrl,
      "docs/processed/output.pdf"
    );
    const txtUrl = await uploadToFirebaseStorage(
      cloudConvertTxtUrl,
      "docs/processed/output.txt"
    );

    console.log(
      "Files successfully converted and uploaded to Firebase Storage"
    );

    executeData.pdfUrl = pdfUrl;
    executeData.txtUrl = txtUrl;

    console.log(
      "This is output from threeFillInTemplate!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    );

    console.log(pdfUrl, txtUrl);

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

exports.fourConvertDocs = fourConvertDocs;
