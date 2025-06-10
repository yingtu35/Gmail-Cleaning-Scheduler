'use server'

import { subscribe } from "@/libs/aws/sns";
import log from "@/utils/log";

export async function subscribeEmailNotification(email: string) {
    // subscribe the email
    const response = await subscribe(email);
    if (response.$metadata.httpStatusCode !== 200) {
      log.error("error subscribing", response);
      throw new Error("Subscription to email notifications failed. Please check server logs for details.");
    }
    return;
} 