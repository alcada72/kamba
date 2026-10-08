import { IEmailAdapter, SendEmailParams } from "../../types/email";

class EmailAdapterTeste implements IEmailAdapter {
  constructor() {}
  send(params: SendEmailParams): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export default EmailAdapterTeste;
