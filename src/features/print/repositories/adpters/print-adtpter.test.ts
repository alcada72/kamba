import { Empresa } from "@/features/enterprise/types/enterprise";
import { DadosFatura, IPrint } from "../../types";

class PrinterAdapterTeste implements IPrint<null> {
  print(data: DadosFatura, enterprise: Empresa, printer: null): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findAllDevicesPrint(): Promise<null[]> {
    throw new Error("Method not implemented.");
  }
}

export default PrinterAdapterTeste;
