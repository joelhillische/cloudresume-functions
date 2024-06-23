const { getInitialData } = require("./getInitialData");
const { getRecommendations } = require("./getRecommendations");
const { fillInTemplate } = require("./fillInTemplate");
const { convertDocs } = require("./convertDocs");
const { gatherData } = require("./gatherData");
const { writeToDatabase } = require("./writeToDatabase");

async function executeSteps(data) {
  let executeData = {
    initialData: data,
  };

  try {
    // Call stepOne
    const resultStepOne = await getInitialData(executeData);

    // Call stepTwo
    const resultStepTwo = await getRecommendations(resultStepOne);

    await gatherData(executeData);

    // Creates docx by filling in the template
    await fillInTemplate(resultStepTwo, executeData);

    // Call to cloudconvert and writes pdf, txt to executeData
    await convertDocs(executeData);

    const urls = await writeToDatabase(executeData);

    return { status: "All steps complete", ...urls };
  } catch (error) {
    console.error("Error in executing steps:", error);
    throw new Error("Steps execution failed");
  }
}

exports.executeSteps = executeSteps;
