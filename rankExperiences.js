const { Configuration, OpenAIApi } = require("openai");

const admin = require("firebase-admin");

async function rankExperiences(prompt) {
  /*
    // Access the secret
const secret = await admin
  .secretManager()
  .accessSecretVersion({
    name: "projects/cloudresume-e9e4e/secrets/OPENAI_API_KEY/versions/latest",
  })
  .then((result) => result.payload.data.toString("utf8"));

const configuration = new Configuration({
  apiKey: secret,
});

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
      temperature: 0,
    });
  
    // Extract the content from the response
    const contentString = completion.choices[0].message.content;
  
    // Parse the JSON string to an object
    const contentObject = JSON.parse(contentString);
  
    return contentObject;
    */

  const newExperiences = {
    rankings: [
      {
        rank: 1,
        text: "Created privilege escalation process for developers in production using API Gateway, Lambda (NodeJS), Step Functions, DynamoDB (Dynamoose), and assume roles all created via Terraform",
        reason:
          "This experience directly aligns with the job description by showcasing the ability to design and implement secure automation solutions for development, testing, and production environments, as well as managing continuous integration and delivery pipelines.",
      },
      {
        rank: 2,
        text: "Created custom AWS Config rules to check S3 buckets, and other compliance issues and send alerts via Slack. I created this via Terraform, AWS Lambda (NodeJS), using the AWS SDK and Axios (for Slack alerting)",
        reason:
          "This experience demonstrates the ability to create and maintain CI/CD processes for new and existing services, as well as enabling the product development team to deliver new code daily through automation solutions.",
      },
      {
        rank: 3,
        text: "Demonstrated new serverless Terraform module to replace the Serverless framework for the development team. Development team moved all Typescript lambdas from Serverless framework to Terraform based on my research",
        reason:
          "While this experience showcases proficiency in Terraform and serverless technologies, it is slightly less relevant to the job description compared to the other experiences listed.",
      },
    ],
  };

  return newExperiences;
}

// export default rankExperiences;

module.exports = rankExperiences;
