const generatePrompts = require("./generatePrompts");
const rankExperiences = require("./rankExperiences");

async function getRecommendations(executeData) {
  const { userId, jobId } = executeData.initialData;

  const updates = executeData.updates;

  const experiences = executeData.experiences;

  const jobDescription = executeData.jobData.description;

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
    },
  };

  // executeData.experiences =

  return true;
}

exports.getRecommendations = getRecommendations;
