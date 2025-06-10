'use server'

import { subscribe } from "@/libs/aws/sns";

export async function subscribeEmailNotification(email: string) {
    // subscribe the email
    const response = await subscribe(email);
    if (response.$metadata.httpStatusCode !== 200) {
      console.error("error subscribing", response);
      throw new Error("Error subscribing");
    }
    return;
} 