import { file_name } from "@/features/backup/const/file_name";

export async function createBackup(
  accessToken: string,
  data: string,
): Promise<void> {
  const metadata = {
    name: `${file_name}.json`,
    parents: ["appDataFolder"],
    mimeType: "application/json",
  };

  const boundary = `${file_name}_boundary`;

  const body =
    `--${boundary}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: application/json\r\n\r\n` +
    `${data}\r\n` +
    `--${boundary}--`;

  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body,
    },
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(`Erro ao criar backup: ${response.status} - ${error}`);
  }
}
