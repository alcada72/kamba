import { EmailAdapter, SendEmailParams } from "../../types/email";

export default class EmailService {
  constructor(private readonly adapter: EmailAdapter) {}

  /**
   * =============================
   * sendEmail
   * =============================
   * Metodo para enviar email idependente da implementação
   */
  public async sendEmail(prmt: SendEmailParams) {
    await this.adapter.send(prmt);
  }
}
