import { DadosFatura, IPrint } from "../../types";

class PrinterAdapterTeste implements IPrint<null> {
  constructor() {}
  print(data: DadosFatura, printer: null): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findAllDevicesPrint(): Promise<null[]> {
    throw new Error("Method not implemented.");
  }
}

export default PrinterAdapterTeste;
