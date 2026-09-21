export default function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      try {
        const result = reader.result;

        if (typeof result !== "string") {
          reject(new Error("Não foi possível converter o Blob para Base64."));
          return;
        }

        const separatorIndex = result.indexOf(",");

        if (separatorIndex === -1) {
          reject(new Error("Formato inválido de Data URL."));
          return;
        }

        const base64 = result.substring(separatorIndex + 1);

        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error("Erro ao ler o Blob."));
    };

    reader.readAsDataURL(blob);
  });
}
