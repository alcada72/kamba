export async function deleteBackup(
  accessToken: string,
  backupId: string,
): Promise<void> {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${backupId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(`Erro ao excluir backup: ${response.status} - ${error}`);
  }
}
