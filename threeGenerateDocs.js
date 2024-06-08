const axios = require("axios");
const fs = require("fs").promises;

// Function to generate document using Docmosis API
async function generateDocument(
  docmosisServer,
  apiKey,
  templateName,
  outputName,
  templateData
) {
  const url = `${docmosisServer}/render`;
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "stream",
  };

  const data = JSON.stringify({
    accessKey: `${apiKey}`,
    templateName: templateName,
    outputName: outputName,
    data: JSON.stringify(templateData),
  });

  try {
    const response = await axios.post(url, data, {
      headers,
    });

    console.log("Document generated successfully!");

    return response;
  } catch (error) {
    console.error(
      "Failed to generate document:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

async function threeGenerateDocs(twoGetRecommendations, executeData) {
  try {
    const { experiences, jobId, userId } = twoGetRecommendations;

    console.log("We are printing out the executeData information!!!!!!");
    console.dir(executeData, { depth: null, colors: true });

    // We take the experiences and write them to a pdf/doc using docmosis

    const templateName = "samples/WelcomeTemplate.docx";
    const docmosisServer = "https://us1.dws4.docmosis.com/api";
    const apiKey =
      "NjNkNjhkNjMtNjJlMC00OGZhLWJlMDEtNDAzN2ZhYjg2NWJlOjE0ODgwMDQ3NzE";

    const outputName = "test.pdf";

    const templateData = {
      title: "Welcome to Docmosis in the Cloud",
      messages: [
        { msg: "This cloud experience is better than I thought." },
        { msg: "The sun is shining." },
        { msg: "Right, now back to work." },
      ],
    };

    /*
    const docmosisResponse = await generateDocument(
      docmosisServer,
      apiKey,
      templateName,
      outputName,
      templateData
    );

    console.log("typeof docmosis response ");
    console.log(typeof docmosisResponse.data);
    */

    const options = {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "stream",
    };

    const response = await axios.post(
      `${docmosisServer}/render`,
      JSON.stringify(templateData),
      options
    );
    if (response.status === 200) {
      const file = fs.createWriteStream(output);
      response.data.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(output, "created");
      });
    } else {
      console.log("Error response:", response.status, response.statusText);
    }

    // Dummy logic for step three
    return {
      // docmosisResponse,
      jobId,
      userId,
    };
  } catch (error) {
    console.error("An error occurred in threeGenerateDocs:", error);
    throw error; // re-throw the error if you want to handle it further up the call stack
  }
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
