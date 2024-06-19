const { oneGetData } = require("./oneGetData");
const { twoGetRecommendations } = require("./twoGetRecommendations");
const { threeFillInTemplate } = require("./threeFillInTemplate");
const { fourConvertDocs } = require("./fourConvertDocs");
const { fiveWriteToDatabase } = require("./fiveWriteToDatabase");

async function executeSteps(data) {
  let executeData = {
    initialData: data,
  };

  try {
    // Call stepOne
    const resultStepOne = await oneGetData(executeData);

    // Call stepTwo
    const resultStepTwo = await twoGetRecommendations(resultStepOne);

    // Call stepThree
    await threeFillInTemplate(resultStepTwo, executeData);

    // Call stepFour
    await fourConvertDocs(executeData);

    await fiveWriteToDatabase(executeData);

    return { status: "All steps complete" };
  } catch (error) {
    console.error("Error in executing steps:", error);
    throw new Error("Steps execution failed");
  }
}

exports.executeSteps = executeSteps;
