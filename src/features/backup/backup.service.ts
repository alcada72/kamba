import { BackupAdapter } from "./types/backup";

export class BackupService {
  constructor(private readonly adapter: BackupAdapter) {}

  async backup(userId: string, data: string): Promise<void> {
    await this.adapter.upload(userId, data);
  }

  async restore(userId: string): Promise<string | null> {
    return await this.adapter.download(userId);
  }
}
