const { oneGetData } = require("./oneGetData");
const { twoGetRecommendations } = require("./twoGetRecommendations");
const { threeGenerateDocs } = require("./threeGenerateDocs");
const { fourWriteDocs } = require("./fourWriteDocs");

async function executeSteps(data) {
  try {
    // Call stepOne
    const resultStepOne = await oneGetData(data);
    console.log("Step One Result:", resultStepOne);

    // Call stepTwo
    const resultStepTwo = await twoGetRecommendations(resultStepOne);
    console.log("Step Two Result:", resultStepTwo);

    // Call stepThree
    const resultStepThree = await threeGenerateDocs(resultStepTwo);
    console.log("Step Three Result:", resultStepThree);

    // Call stepFour
    const resultStepFour = await fourWriteDocs(resultStepThree);
    console.log("Step Four Result:", resultStepFour);

    return { status: "All steps complete", result: resultStepFour };
  } catch (error) {
    console.error("Error in executing steps:", error);
    throw new Error("Steps execution failed");
  }
}

exports.executeSteps = executeSteps;
