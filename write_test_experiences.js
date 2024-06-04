const { Firestore } = require("@google-cloud/firestore");

// Create a new client
const firestore = new Firestore({
  projectId: "cloudresume-e9e4e", // Replace with your actual project ID
});

// User ID and Job ID
const userId = "Rs6X53VQEL8JjRLCaxcy";
const jobId = "O7RhFYU4ZwerNZe4Pqwo"; // Replace with the actual jobId

// Experiences descriptions
const experiences = [
  "Created privilege escalation process for developers in production using API Gateway, Lambda (NodeJS), Step Functions, DynamoDB (Dynamoose), and assume roles all created via Terraform",
  "Created custom AWS Config rules to check S3 buckets, and other compliance issues and send alerts via Slack. I created this via Terraform, AWS Lambda (NodeJS), using the AWS SDK and Axios (for Slack alerting)",
  "Demonstrated new serverless Terraform module to replace the Serverless framework for the development team. Development team moved all Typescript lambdas from Serverless framework to Terraform based on my research and implementation",
  "Create Terraform modules for s3 buckets, and AWS SSO permission sets",
  "Created demo ECS Fargate cluster via Terraform for developers to use as a template to create a Wiremock set up",
  "Worked with Security to ensure PHI compliance over genetic data by changing multiple Terraform files in developers repositories to be compliant. As an example, adding private stanza for creation of S3 buckets",
  "Consolidated all users into specific AWS SSO groups with custom IAM policies applied",
  "Worked on demonstrating streamlined Github actions / workflow",
  "Troubleshot IAM permission issues for the Data Science team",
  "Helped implement AWS WAF in front of CloudFront/React sites",
  "Fix Disposable Cloud Environment build failures and wrote documentation on how to fix it",
  "Start documentation on all aspects of DevOps including accounts, contact information, root token location",
  "Work on refining DataDog to deliver better reporting for security and development teams",
];

async function addExperiences() {
  const batch = firestore.batch();

  experiences.forEach((description, index) => {
    const docRef = firestore.collection("experiences").doc(); // Auto-generate ID
    batch.set(docRef, {
      userId,
      jobId,
      description,
    });
  });

  try {
    await batch.commit();
    console.log("Experiences successfully written to Firestore!");
  } catch (error) {
    console.error("Error writing experiences to Firestore: ", error);
  }
}

addExperiences();
