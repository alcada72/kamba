export async function updateBackup(
  accessToken: string,
  fileId: string,
  data: string,
): Promise<void> {
  const response = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: data,
    },
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(`Erro ao atualizar backup: ${response.status} - ${error}`);
  }
}
