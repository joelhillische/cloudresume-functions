const generatePrompts = require("./generatePrompts");
const rankExperiences = require("./rankExperiences");

async function twoGetRecommendations(oneGetData, executeData) {
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

  // This called the OpenAI API
  // const rankedExperiences = await rankExperiences(prompts);

  const rankedExperiences = {
    experiences: {
      O7RhFYU4ZwerNZe4Pqwo: [
        "JxAETuUDUcJwgyUl16hK",
        "ORG0Wj3PiMqP6E6nRIXK",
        "dy863GIzR9UXMXMOInwL",
        "RDDPw9Rdoag7HvGHoUoK",
        "OTl2W48GhmjbGHR0BpZl",
        "6JkJlhGONGGPKATsAHKS",
        "eyY4KfdjaEJwimvM6cP7",
        "Hw83GC0uEth009wOy4tT",
        "M0CxqHVbV5bBQSWgSf2y",
        "4eV2B0RJVzYwSxl0HqCL",
      ],
      anotherjob: ["ZK0ssLxhgssOb6eXuFwg", "wGE8Oj4SWIrFA7I81Mln"],
    },
  };

  // Dummy logic for step two
  return {
    experiences: rankedExperiences,
    jobId,
    userId,
  };
}

exports.twoGetRecommendations = twoGetRecommendations;
