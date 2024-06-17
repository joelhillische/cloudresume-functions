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

async function fourConvertDocs(fileName) {
  try {
    const cloudConvert = new CloudConvert(
      await getCloudConvertApiKey("SANDBOX_CLOUD_CONVERT_KEY"),
      true
    );

    const localPath = `/tmp/${fileName}`;
    const job = await cloudConvert.jobs.create({
      tasks: {
        "import-my-file": {
          operation: "import/upload",
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

    const uploadTask = job.tasks.filter(
      (task) => task.name === "import-my-file"
    )[0];

    console.log(localPath);

    const inputFile = fs.createReadStream(localPath);

    await cloudConvert.tasks.upload(uploadTask, inputFile, fileName);

    const exportPdfResult = await cloudConvert.tasks.wait(exportPdfTask.id);
    const exportTxtResult = await cloudConvert.tasks.wait(exportTxtTask.id);

    const cloudConvertPdfUrl =
      exportPdfResult.result?.files?.[0]?.url ?? "URL not available";
    const cloudConvertTextUrl =
      exportTxtResult.result?.files?.[0]?.url ?? "URL not available";

    console.log("PDF URL:", cloudConvertPdfUrl);
    console.log("Signed TXT URL:", cloudConvertTextUrl);

    const pdfViewUrl = await uploadToFirebaseStorage(
      cloudConvertPdfUrl,
      "docs/processed/output.pdf"
    );
    const txtViewUrl = await uploadToFirebaseStorage(
      cloudConvertTextUrl,
      "docs/processed/output.txt"
    );

    console.log(
      "Files successfully converted and uploaded to Firebase Storage"
    );

    console.log(`pdfviewurl: ${pdfViewUrl} txtviewurl: ${txtViewUrl}`);

    return { pdfViewUrl, txtViewUrl };
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
