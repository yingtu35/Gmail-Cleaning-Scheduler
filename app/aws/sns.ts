import { snsClient as client } from '@/app/aws/client';
import { 
  SubscribeCommand, 
  SubscribeCommandInput,
  SubscribeCommandOutput,
 } from '@aws-sdk/client-sns';
 import log from '@/app/utils/log';

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
  log.debug("Subscription response:", response);
  return response;
 }