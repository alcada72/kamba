import { GoogleAuthAdapter } from "@/features/auth/repositories/adapters/GoogleAuthAdapter";

import { EmailAdapter, SendEmailParams } from "../../types/email";
import { sendEmail } from "./services/sendEmail.service";

const googleAuth = new GoogleAuthAdapter();

export class GmailAdapter implements EmailAdapter {
  async send({
    to,
    body,
    subject,
    attachment,
  }: SendEmailParams): Promise<void> {
    const accessToken = await googleAuth.getAccessToken();

    await sendEmail(accessToken, {
      to,
      subject,
      body,
      attachment,
    });
  }
}
