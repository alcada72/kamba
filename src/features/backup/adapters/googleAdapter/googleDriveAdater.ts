import { GoogleAuthAdapter } from "@/features/auth/repositories/adapters/GoogleAuthAdapter";
import { BackupAdapter } from "../../types/backup";
import { createBackup } from "./services/createBackup.service";
import { deleteBackup } from "./services/deleteBackup.service";
import { downloadBackup } from "./services/downloadBackup.service";
import { findBackup } from "./services/findBackup.service";
import { updateBackup } from "./services/updateBackup.service";
const googleAuth = new GoogleAuthAdapter();
export class GoogleDriveAdapter implements BackupAdapter {
  async upload(userId: string = "", data: string): Promise<void> {
    const accessToken = await googleAuth.getAccessToken();

    const backup = await findBackup(accessToken);

    if (backup) {
      await this.updateFile(accessToken, backup.id, data);
    } else {
      await this.createFile(accessToken, data);
    }
  }

  async download(userId: string = ""): Promise<string | null> {
    const accessToken = await googleAuth.getAccessToken();

    const backup = await findBackup(accessToken);

    if (!backup) {
      return null;
    }

    return downloadBackup(accessToken, backup.id);
  }

  async exists(userId: string = ""): Promise<boolean> {
    const accessToken = await googleAuth.getAccessToken();

    const backup = await findBackup(accessToken);

    return !!backup;
  }

  async delete(userId: string = ""): Promise<void> {
    const accessToken = await googleAuth.getAccessToken();

    const backup = await findBackup(accessToken);

    if (!backup) {
      return;
    }

    await deleteBackup(accessToken, backup.id);
  }

  private async createFile(accessToken: string, data: string): Promise<void> {
    await createBackup(accessToken, data);
  }

  private async updateFile(
    accessToken: string,
    fileId: string,
    data: string,
  ): Promise<void> {
    await updateBackup(accessToken, fileId, data);
  }
}
