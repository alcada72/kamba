import { SendEmailParams } from "@/features/email/types/email";

function base64UrlEncode(value: string): string {
  const bytes = new TextEncoder().encode(value);

  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function sendEmail(
  accessToken: string,
  params: SendEmailParams,
): Promise<void> {
  const mimeMessage = createMimeMessage(params);
  const raw = base64UrlEncode(mimeMessage);

  const response = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        raw,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(`Erro ao enviar e-mail: ${error}`);
  }
}

function createMimeMessage(params: SendEmailParams): string {
  const { to, subject, body, attachment } = params;

  const boundary = `----KambaAppBoundary${Date.now()}`;

  const message = [
    "MIME-Version: 1.0",
    "From: me",
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    body,
    "",
  ];

  if (attachment) {
    message.push(
      `--${boundary}`,
      `Content-Type: ${attachment.mimeType}; name="${attachment.filename}"`,
      `Content-Disposition: attachment; filename="${attachment.filename}"`,
      "Content-Transfer-Encoding: base64",
      "",
      attachment.base64,
      "",
    );
  }

  message.push(`--${boundary}--`);

  return message.join("\r\n");
}
