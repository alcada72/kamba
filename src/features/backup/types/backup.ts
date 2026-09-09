export interface BackupAdapter {
  upload(userId: string, data: string): Promise<void>;

  download(userId: string): Promise<string | null>;

  exists(userId: string): Promise<boolean>;

  delete(userId: string): Promise<void>;
}
