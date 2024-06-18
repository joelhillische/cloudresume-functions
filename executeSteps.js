const { oneGetData } = require("./oneGetData");
const { twoGetRecommendations } = require("./twoGetRecommendations");
const { threeFillInTemplate } = require("./threeFillInTemplate");
const { fourConvertDocs } = require("./fourConvertDocs");

async function executeSteps(data) {
  let executeData = {};

  try {
    // Call stepOne
    const resultStepOne = await oneGetData(data, executeData);
    console.log("Step One Result:");
    console.dir(resultStepOne, { depth: null, colors: true });

    // Call stepTwo
    const resultStepTwo = await twoGetRecommendations(
      resultStepOne,
      executeData
    );
    console.log("Step Two Result:");
    console.dir(resultStepTwo, { depth: null, colors: true });

    // Call stepThree
    const resultStepThree = await threeFillInTemplate(
      resultStepTwo,
      executeData
    );
    console.log("Step Three Result:");
    console.dir(resultStepThree, { depth: null, colors: true });

    return { status: "All steps complete" };

    /*
    // Call stepFour
    const resultStepFour = await fourConvertDocs(resultStepThree);
    console.log("Step Four Result:");
    console.dir(resultStepFour, { depth: null, colors: true });

    return { status: "All steps complete", result: resultStepFour };
    */
  } catch (error) {
    console.error("Error in executing steps:", error);
    throw new Error("Steps execution failed");
  }
}

exports.executeSteps = executeSteps;
