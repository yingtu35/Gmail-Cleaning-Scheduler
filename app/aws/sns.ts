import { snsClient as client } from '@/app/aws/client';
import { 
  SubscribeCommand, 
  SubscribeCommandInput,
  SubscribeCommandOutput,
  ConfirmSubscriptionCommand,
  ConfirmSubscriptionCommandInput,
  ConfirmSubscriptionCommandOutput
 } from '@aws-sdk/client-sns';

 export const subscribe = async (email: string) => {
  const filterPolicy = {
    emailAddress: [email],
    event: ["deletion_success", "deletion_failure"],
  };

  const input: SubscribeCommandInput = {
    Protocol: "email",
    TopicArn: process.env.SNS_TOPIC_ARN,
    Endpoint: email,
    Attributes: {
      FilterPolicy: JSON.stringify(filterPolicy),
    }
  };
  const command = new SubscribeCommand(input);
  const response: SubscribeCommandOutput = await client.send(command);
  console.log("Subscription response:", response);
  return response;
 }

 export const confirmSubscription = async (token: string) => {
  const input: ConfirmSubscriptionCommandInput = {
    Token: token,
    TopicArn: process.env.SNS_TOPIC_ARN,
  };
  const command = new ConfirmSubscriptionCommand(input);
  const response: ConfirmSubscriptionCommandOutput = await client.send(command);
  return response;
 }
