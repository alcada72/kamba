export interface SendEmailParams {
  to: string;
  subject: string;
  body: string;
  attachment?: {
    filename: string;
    base64: string;
    mimeType: string;
  };
}

export interface EmailAdapter {
  send(params: SendEmailParams): Promise<void>;
}
