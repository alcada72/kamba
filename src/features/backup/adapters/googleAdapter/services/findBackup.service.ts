export async function findBackup(accessToken: string) {
  const query = "name = 'kamba-backup.json' and trashed = false";

  const params = new URLSearchParams({
    q: query,
    spaces: "appDataFolder",
    fields: "files(id,name,modifiedTime)",
  });

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(`Erro ao procurar backup: ${response.status} - ${error}`);
  }

  const result = await response.json();

  return result.files?.[0] ?? null;
}
