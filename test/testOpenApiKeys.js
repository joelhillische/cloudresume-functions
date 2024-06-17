require("dotenv").config();

// Replace with your OpenAI API key
const apiKey = process.env["OPENAI_API_KEY"];

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: apiKey,
});

const jobDescription = `Position Summary:
    Support and work alongside a cross-functional engineering team on the latest technologies
    Work collaboratively with multiple agile teams to help deliver end-to-end products and features, seeing them through from conception to delivery
    Enable our product development team to deliver new code daily through Continuous Integration and Deployment Pipelines.
    Design and implement secure automation solutions for development, testing, and production environments
    Manage our continuous integration and delivery pipeline to maximize efficiency
    Create, maintain, and iterate on our CI/CD processes for new and existing services`;

const items = [
  "Created custom AWS Config rules to check S3 buckets, and other compliance issues and send alerts via Slack. I created this via Terraform, AWS Lambda (NodeJS), using the AWS SDK and Axios (for Slack alerting)",
  "Demonstrated new serverless Terraform module to replace the Serverless framework for the development team. Development team moved all Typescript lambdas from Serverless framework to Terraform based on my research",
  "Created privilege escalation process for developers in production using API Gateway, Lambda (NodeJS), Step Functions, DynamoDB (Dynamoose), and assume roles all created via Terraform",
];

async function main() {
  const prompt = `
  Job Description:
  ${jobDescription}

  List of Experiences and Updates:
  ${items.map((item) => `  "${item}"`).join(",\n")}

  Rank these experiences and updates from most to least relevant for the job description provided. Return the rankings in JSON format as an array of objects.  Also, add why.  The output should look like the following.
  {
    rankings: [
    {rank: <rank>, text: <item text>, reason: <reason>}, ...]
  }
  `;

  console.log(`This is what the prompt looks like ${prompt}`);

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

  // Log the parsed object to the console
  console.log(contentObject);
}

/*
{
  id: 'chatcmpl-9U0fDynKyLS3c7FPC4RuuGTBnH3kK',
  object: 'chat.completion',
  created: 1716939419,
  model: 'gpt-3.5-turbo-0125',
  choices: [
    {
      index: 0,
      message: [Object],
      logprobs: null,
      finish_reason: 'stop'
    }
  ],
  usage: { prompt_tokens: 289, completion_tokens: 162, total_tokens: 451 },
  system_fingerprint: null
}
{
  role: 'assistant',
  content: '[\n' +
    '  { "experience": "Created privilege escalation process for developers in production using API Gateway, Lambda (NodeJS), Step Functions, DynamoDB (Dynamoose), and assume roles all created via Terraform", "rank": 1 },\n' +
    '  { "experience": "Created custom AWS Config rules to check S3 buckets, and other compliance issues and send alerts via Slack. I created this via Terraform, AWS Lambda (NodeJS), using the AWS SDK and Axios (for Slack alerting)", "rank": 2 },\n' +
    '  { "experience": "Demonstrated new serverless Terraform module to replace the Serverless framework for the development team. Development team moved all Typescript lambdas from Serverless framework to Terraform based on my research and implementation", "rank": 3 }\n' +
    ']'
}
*/

main();
