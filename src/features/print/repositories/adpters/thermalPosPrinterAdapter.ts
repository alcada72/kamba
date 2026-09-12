import {
  ReactNativePosPrinter,
  ThermalPrinterDevice,
} from "react-native-thermal-pos-printer";

import formatCurrency from "@/shared/format-currecy";
import { requestBluetoothPermissions } from "@/shared/requestePermisionBluth";
import { DadosFatura, FacturaLargura, IPrint } from "../../types";

export class ThermalPosPrinterAdapter implements IPrint<ThermalPrinterDevice> {
  private readonly largura: FacturaLargura = "58mm";

  async print(data: DadosFatura, printer: ThermalPrinterDevice): Promise<void> {
    let connected = false;

    try {
      await this.init();

      if (!(await printer.isConnected())) {
        await this.connect(printer);
        connected = true;
      }

      await this.printHeader();

      await this.printSaleInfo(data);

      await this.printItems(data);

      await this.printTotals(data);

      await this.printPayment(data);

      await this.printFooter();

      const status = await printer.getStatus();

      if (!status.online) {
        throw new Error("A impressora está offline.");
      }

      if (status.paperOut) {
        throw new Error("A impressora está sem papel.");
      }

      await printer.printText("\n\n\n");

      await ReactNativePosPrinter.cutPaper();
    } catch (error) {
      console.error("Erro ao imprimir:", error);

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Erro ao imprimir a fatura.");
    } finally {
      if (connected) {
        try {
          await this.disconnect(printer);
        } catch (error) {
          console.error("Erro ao desconectar a impressora:", error);
        }
      }
    }
  }

  async findAllDevicesPrint(): Promise<ThermalPrinterDevice[]> {
    try {
      await this.init();

      const granted = await requestBluetoothPermissions();

      if (!granted) {
        throw new Error("Permissão Bluetooth não concedida.");
      }

      return await ReactNativePosPrinter.getDeviceList();
    } catch (error) {
      console.error("Erro ao procurar impressoras:", error);

      throw new Error("Não foi possível encontrar as impressoras.");
    }
  }

  private async printHeader(): Promise<void> {
    await ReactNativePosPrinter.printText("MINHA LOJA", {
      align: "CENTER",
      size: 18,
      bold: true,
      fontType: "A",
    });

    await ReactNativePosPrinter.printText("FATURA", {
      align: "CENTER",
      size: 12,
      bold: true,
      fontType: "A",
    });

    await ReactNativePosPrinter.newLine();
  }

  private async printSaleInfo(data: DadosFatura): Promise<void> {
    await ReactNativePosPrinter.printText(`Venda: ${data.saleId}`, {
      align: "LEFT",
      size: 9,
      fontType: "A",
    });

    await ReactNativePosPrinter.printText(`Data: ${data.date}`, {
      align: "LEFT",
      size: 9,
      fontType: "A",
    });

    await ReactNativePosPrinter.printText(this.separator(), {
      align: "CENTER",
      size: 8,
      fontType: "A",
    });
  }

  private async printItems(data: DadosFatura): Promise<void> {
    await ReactNativePosPrinter.printText(
      this.formatColumns("Produto", "Qtd", "Total"),
      {
        align: "LEFT",
        size: 9,
        bold: true,
        fontType: "A",
      },
    );

    await ReactNativePosPrinter.printText(this.separator(), {
      align: "CENTER",
      size: 8,
      fontType: "A",
    });

    for (const item of data.items) {
      await ReactNativePosPrinter.printText(
        this.formatItem(item.name, item.quantity, item.subtotal),
        {
          align: "LEFT",
          size: 9,
          fontType: "A",
        },
      );
    }

    await ReactNativePosPrinter.printText(this.separator(), {
      align: "CENTER",
      size: 8,
      fontType: "A",
    });
  }

  private async printTotals(data: DadosFatura): Promise<void> {
    const subtotal = data.items.reduce((sum, item) => sum + item.subtotal, 0);

    await ReactNativePosPrinter.printText(
      `Subtotal: ${this.formatMoney(subtotal)}`,
      {
        align: "RIGHT",
        size: 9,
        fontType: "A",
      },
    );

    if (data.discount && data.discount > 0) {
      await ReactNativePosPrinter.printText(
        `Desconto: -${this.formatMoney(data.discount)}`,
        {
          align: "RIGHT",
          size: 9,
          fontType: "A",
        },
      );
    }

    await ReactNativePosPrinter.printText(
      `TOTAL: ${this.formatMoney(data.total)}`,
      {
        align: "RIGHT",
        size: 14,
        bold: true,
        fontType: "A",
      },
    );

    await ReactNativePosPrinter.newLine();
  }

  private async printPayment(data: DadosFatura): Promise<void> {
    await ReactNativePosPrinter.printText(`Pagamento: ${data.paymentMethod}`, {
      align: "LEFT",
      size: 9,
      fontType: "A",
    });

    await ReactNativePosPrinter.printText(
      `Pago: ${this.formatMoney(data.paidAmount)}`,
      {
        align: "RIGHT",
        size: 9,
        fontType: "A",
      },
    );

    if (data.change > 0) {
      await ReactNativePosPrinter.printText(
        `Troco: ${this.formatMoney(data.change)}`,
        {
          align: "RIGHT",
          size: 9,
          bold: true,
          fontType: "A",
        },
      );
    }

    await ReactNativePosPrinter.newLine();
  }

  private async printFooter(): Promise<void> {
    await ReactNativePosPrinter.printText("Obrigado pela preferência!", {
      align: "CENTER",
      size: 10,
      bold: true,
      fontType: "A",
    });

    await ReactNativePosPrinter.printText("Volte sempre.", {
      align: "CENTER",
      size: 9,
      fontType: "A",
    });
  }

  private formatItem(name: string, quantity: number, subtotal: number): string {
    const width = this.getLineWidth();

    const quantityText = String(quantity);

    const totalText = this.formatMoney(subtotal);

    /*
     * Reserva espaço para:
     *
     * produto + quantidade + total
     */
    const productWidth = width - quantityText.length - totalText.length - 4;

    const product = this.truncate(name, Math.max(productWidth, 5));

    return (
      product.padEnd(productWidth) +
      quantityText.padStart(4) +
      " " +
      totalText.padStart(totalText.length)
    );
  }

  private formatColumns(
    product: string,
    quantity: string,
    total: string,
  ): string {
    const width = this.getLineWidth();

    const quantityWidth = 4;
    const totalWidth = 10;

    const productWidth = width - quantityWidth - totalWidth;

    return (
      product.substring(0, productWidth).padEnd(productWidth) +
      quantity.substring(0, quantityWidth).padStart(quantityWidth) +
      total.substring(0, totalWidth).padStart(totalWidth)
    );
  }

  private getLineWidth(): number {
    return this.largura === "80mm" ? 48 : 32;
  }

  private separator(): string {
    return "-".repeat(this.getLineWidth());
  }

  private truncate(value: string, maxLength: number): string {
    if (value.length <= maxLength) {
      return value;
    }

    return `${value.substring(0, maxLength - 3)}...`;
  }

  private formatMoney(value: number): string {
    return formatCurrency(value);
  }

  private async connect(device: ThermalPrinterDevice): Promise<void> {
    try {
      await device.connect();
    } catch (error) {
      console.error(`Erro ao conectar em ${device.getName()}:`, error);

      throw new Error(`Não foi possível conectar  ${device.getName() || ""}.`);
    }
  }

  private async disconnect(device: ThermalPrinterDevice): Promise<void> {
    try {
      if (await device.isConnected()) {
        await device.disconnect();
      }
    } catch (error) {
      console.error(`Erro ao desconectar ${device.getName()}:`, error);
    }
  }

  private async init(): Promise<void> {
    await ReactNativePosPrinter.init();
  }
}
