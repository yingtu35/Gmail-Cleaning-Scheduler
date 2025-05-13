// Define the base configuration type
interface AwsClientConfig {
  region: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
  };
}

const DEFAULT_REGION = 'us-west-2';

// Initialize with the base region
const awsClientOptions: AwsClientConfig = {
  region: process.env.AWS_SDK_REGION || DEFAULT_REGION,
};

// Check if running in a production environment
if (process.env.NODE_ENV === 'production') {
  const accessKeyId = process.env.AWS_SDK_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SDK_SECRET_ACCESS_KEY;
  const sessionToken = process.env.AWS_SDK_SESSION_TOKEN; // Optional, for temporary credentials

  if (accessKeyId && secretAccessKey) {
    awsClientOptions.credentials = {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    };
    if (sessionToken) {
      awsClientOptions.credentials.sessionToken = sessionToken;
    }
    // Optional: Log that production credentials are being used
    // console.log("AWS SDK: Using credentials from production environment variables.");
  } else {
    console.error("AWS SDK: NODE_ENV is 'production', but AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY environment variables are missing. SDK will attempt fallback.");
  }
} else {
  // In non-production environments (e.g., local development),
  // we don't explicitly set 'credentials'. The AWS SDK will then use its
  // default credential provider chain (e.g., ~/.aws/credentials, instance profiles, etc.).
  console.log("AWS SDK: Not in production. Using default credential provider chain.");
}

export const config = awsClientOptions;