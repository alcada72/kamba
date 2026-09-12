export interface BackupAdapter {
  upload(userId: string, data: string): Promise<void>;

  download(userId: string): Promise<string | null>;

  exists(userId: string): Promise<boolean>;

  delete(userId: string): Promise<void>;
}

export type TBackup = {
  version: number;
  created_at: string;
  data: {
    usuarios: unknown[];
    categorias: unknown[];
    produtos: unknown[];
    faturas: unknown[];
    vendas: unknown[];
    itens_venda: unknown[];
    pagamentos: unknown[];
    movimentos_estoque: unknown[];
  };
};
