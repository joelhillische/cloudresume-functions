const functions = require("firebase-functions");
const axios = require("axios");

/*
{
      experiences: {
        rankings: [
          {
            Rank: 1,
            Text: 'The ideal candidate will have a strong background in technology and a proven track record in programming technology-related challenges.',
            Reason: 'This experience directly aligns with the job description provided, as it highlights the importance of having a strong background in technology and programming skills, which are essential for optimizing systems and conducting research.'
          },
          {
            Rank: 2,
            Text: 'This role involves conducting research, optimizing systems, streamlining operations.',
            Reason: 'While this update provides a general overview of the job description, it lacks specific details or examples of relevant experiences. Therefore, it is ranked lower than the experience that directly addresses the required skills and qualifications.'
          },
          {
            Rank: 3,
            Text: "List of Experiences and Updates for Job ID O7RhFYU4ZwerNZe4Pqwo: 'This is just a test description. This is just a test description. This is just a test description. This is just a test description. This is just a test description'",
            Reason: "This update does not provide any relevant information or examples of experiences related to the job description. It is ranked the lowest as it does not contribute to assessing the candidate's qualifications for the role."
          }
        ]
      },
      jobId: '2KY1wbFT6DlAO0iWBnY5',
      userId: 'Rs6X53VQEL8JjRLCaxcy'
    }
*/

async function threeGenerateDocs(twoGetRecommendations) {
  /*
  return {
    experiences: newExperiences,
    jobId,
    userId,
  };
  */

  const { experiences, jobId, userId } = twoGetRecommendations;

  console.log(experiences);
  console.log(jobId);

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
