require("dotenv").config();

const { OpenAI } = require("openai");

const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const client = new SecretManagerServiceClient();

async function getSecret(name) {
  if (process.env.NODE_ENV === "test") {
    // Retrieve secret from environment variables
    return process.env[name];
  } else {
    // Retrieve secret from Google Cloud Secret Manager
    const [version] = await client.accessSecretVersion({
      name: `projects/cloudresume-e9e4e/secrets/OPENAI_API_KEY/versions/latest`,
    });
    const payload = version.payload.data.toString("utf8");
    return payload;
  }
}

async function rankExperiences(prompt) {
  console.log(prompt);

  const openai = new OpenAI({
    apiKey: await getSecret("OPENAI_API_KEY"), // This is the default and can be omitted
  });

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
    temperature: 0,
  });

  // console.dir(completion, { depth: null, colors: true });

  // Extract the content from the response
  const contentString = completion.choices[0].message.content;

  // Parse the JSON string to an object
  const experienceRanking = JSON.parse(contentString);

  return experienceRanking;
}

module.exports = rankExperiences;
