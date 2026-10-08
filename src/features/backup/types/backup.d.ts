export interface BackupAdapter {
  upload(userId: string, data: string): Promise<void>;

  download(userId: string): Promise<string | null>;

  exists(userId: string): Promise<boolean>;

  delete(userId: string): Promise<void>;
}

export type TBackupRow = Record<string, unknown>;

export type TBackup = {
  version: 1;
  created_at: string;

  data: {
    categorias: TBackupRow[];
    produtos: TBackupRow[];
    faturas: TBackupRow[];
    vendas: TBackupRow[];
    itens_venda: TBackupRow[];
    pagamentos: TBackupRow[];
    movimentos_estoque: TBackupRow[];
    empresa: TBackupRow[];
  };
};
