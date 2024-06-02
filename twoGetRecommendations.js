const generatePrompts = require("./generatePrompts");
const rankExperiences = require("./rankExperiences");

async function twoGetRecommendations(oneGetData) {
  /*
  return {
    jobId,
    userId,
    jobData,
    userData,
  };
  */

  const { userId, jobId, userData, jobData } = oneGetData;

  const jobDescription = jobData.description;

  const updates = userData.updates;

  const experiences = userData.experiences;

  const prompts = generatePrompts(jobDescription, experiences, updates);

  const rankedExperiences = rankExperiences(prompts);

  // Dummy logic for step two
  return {
    experiences: rankedExperiences,
    jobId,
    userId,
  };
}

exports.twoGetRecommendations = twoGetRecommendations;
