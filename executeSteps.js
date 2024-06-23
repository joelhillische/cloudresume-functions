const { getInitialData } = require("./getInitialData");
const { getRecommendations } = require("./getRecommendations");
const { fillInTemplate } = require("./fillInTemplate");
const { convertDocs } = require("./convertDocs");
const { createResumeInDatabase } = require("./createResumeInDatabase");
const { writeUrlsToDatabase } = require("./writeUrlsToDatabase");

async function executeSteps(data) {
  let executeData = {
    initialData: data,
  };

  try {
    // This gets all exps, jobs, etc. belonging to a user that was based into the initial execute steps
    await getInitialData(executeData);

    // This calls Open AI with the experiences and updates (for now)
    await getRecommendations(executeData);

    // This writes the resume to the database
    await createResumeInDatabase(executeData);

    // Creates docx by filling in the template
    await fillInTemplate(executeData);

    // Call to cloudconvert and writes pdf, txt to executeData
    await convertDocs(executeData);

    console.log(executeData);

    await writeUrlsToDatabase(executeData);

    const pdfUrl = executeData.pdfUrl;
    const txtUrl = executeData.txtUrl;
    const docxUrl = executeData.docxUrl;

    return {
      status: "All steps complete",
      pdfUrl: pdfUrl,
      txtUrl: txtUrl,
      docxUrl: docxUrl,
    };
  } catch (error) {
    console.error("Error in executing steps:", error);
    throw new Error("Steps execution failed");
  }
}

exports.executeSteps = executeSteps;
