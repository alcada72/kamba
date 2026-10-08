import { DadosFatura, IPrint } from "../../types";

export class PrinterService<TPrinter> {
  constructor(private readonly iPrint: IPrint<TPrinter>) {}

  public async print(data: DadosFatura, device: TPrinter): Promise<void> {
    if (!device) {
      throw new Error("Nenhuma impressora selecionada.");
    }

    if (!data.items.length) {
      throw new Error("A fatura não possui itens.");
    }

    if (data.total < 0) {
      throw new Error("O total da fatura é inválido.");
    }

    await this.iPrint.print(data, device);
  }

  public async findAllPrinters(): Promise<TPrinter[]> {
    return this.iPrint.findAllDevicesPrint();
  }
}
