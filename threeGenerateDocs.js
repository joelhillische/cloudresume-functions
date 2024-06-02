const functions = require("firebase-functions");
const axios = require("axios");

async function threeGenerateDocs(twoGetRecommendations) {
  /*
  return {
    experiences: newExperiences,
    jobId,
    userId,
  };
  */

  const { experiences, jobId, userId } = twoGetRecommendations;

  // We take the experiences and write them to a pdf/doc using docmosis

  // We return the value as a file and send it on
  const docmosisResponse = "";

  // Dummy logic for step three
  return {
    docmosisResponse,
    jobId,
    userId,
  };
}

async function writeDataToFileAndUpload(data, bucketName, fileName) {
  // Write data to a text file
  const filePath = "./temp.txt";
  fs.writeFileSync(filePath, data, "utf8");

  // Upload the file to Google Cloud Storage with metadata
  await storage.bucket(bucketName).upload(filePath, {
    destination: fileName,
    metadata: {
      contentType: "text/plain",
    },
  });

  console.log(`${filePath} uploaded to ${bucketName} as ${fileName}`);
}

exports.threeGenerateDocs = threeGenerateDocs;
