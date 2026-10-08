import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { Empresa } from "@/features/enterprise/types/enterprise";
import formatCurrency from "@/shared/format-currecy";
import { DadosFatura, IPrint } from "../../types";

export class ExpoPrintAdapter implements IPrint<null> {
  async print(
    data: DadosFatura,
    enterprise: Empresa,
    _printer: null,
  ): Promise<void> {
    try {
      const html = this.buildHtml(data, enterprise);

      await Print.printAsync({
        html,
      });
    } catch (error) {
      console.error("Erro ao imprimir documento A4:", error);

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Não foi possível imprimir o documento.");
    }
  }

  async share(data: DadosFatura, enterprise: Empresa): Promise<void> {
    try {
      const canShare = await Sharing.isAvailableAsync();

      if (!canShare) {
        throw new Error("A partilha não está disponível neste dispositivo.");
      }

      const uri = await this.printToFile(data, enterprise);

      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Partilhar A Fatura de Compra",
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      console.error("Erro ao partilhar documento:", error);

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Não foi possível partilhar o documento.");
    }
  }

  async printToFile(data: DadosFatura, enterprise: Empresa) {
    const html = this.buildHtml(data, enterprise);

    const { uri } = await Print.printToFileAsync({
      html,
    });

    return uri;
  }

  async findAllDevicesPrint(): Promise<null[]> {
    return [null];
  }

  /**
   * buildHtml
   * @param data
   * @returns
   */
  private buildHtml(data: DadosFatura, enterprise: Empresa): string {
    const itemsHtml = data.items
      .map(
        (item) => `
          <tr> 
            <td class="product">
              ${this.escapeHtml(item.name)}
            </td>

            <td class="quantity">
              ${item.quantity}
            </td>

            <td class="unit-price">
              ${this.formatMoney(item.price)}
            </td>

            <td class="subtotal">
              ${this.formatMoney(item.subtotal)}
            </td>
          </tr>
        `,
      )
      .join("");

    const subtotal = data.items.reduce((sum, item) => sum + item.subtotal, 0);

    const discount = data.discount ?? 0;

    return ` 
      <!doctype html>
      <html lang="pt">
        <head>
          <meta charset="UTF-8" />

          <style>
            @page {
              size: A4;
              margin: 20mm;
            }

            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }

            html,
            body {
              background: #ffffff;
            }

            body {
              font-family: Arial, Helvetica, sans-serif;
              color: #222222;
              font-size: 12px;
              line-height: 1.4;
            }

            .document {
              width: 100%;
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              padding-bottom: 10px;
              border-bottom: 1px solid #222;
            }
            .sub-header {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: start;
              gap: 0;
              margin-top: 5px;
            }

            .sub-header p {
              color: #7e7e7edd;
            }

            .company {
              width: 60%;
            }

            .company-name {
              font-size: 18px;
              font-weight: bold;
            }

            .company-info {
              font-size: 11px;
              color: #555;
              line-height: 1.6;
            }

            .invoice {
              width: 35%;
              text-align: right;
            }

            .invoice-title {
              font-size: 15px;
              font-weight: bold;
              color: #063023;
            }

            .invoice-info {
              font-size: 11px;
              color: #555;
              line-height: 1.6;
            }

            .sale-info {
              margin-top: 20px;
              margin-bottom: 20px;
            }

            .sale-info table {
              width: 100%;
            }

            .sale-info td {
              padding: 5px 0;
            }

            .label {
              font-weight: bold;
              color: #444;
            }

            .items {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }

            .items th {
              background: #254f42a9;
              border-top: 1px solid #ccc;
              border-bottom: 1px solid #ccc;
              padding: 10px 8px;
              font-size: 11px;
              text-transform: uppercase;
              text-align: left;
            }

            .items td {
              padding: 10px 8px;
              border-bottom: 1px solid #e5e5e5;
              vertical-align: top;
            }

            .product {
              width: 50%;
            }

            .quantity {
              width: 10%;
              text-align: center;
            }

            .unit-price {
              width: 20%;
              text-align: right;
              white-space: nowrap;
            }

            .subtotal {
              width: 20%;
              text-align: right;
              white-space: nowrap;
            }

            .totals-container {
              display: flex;
              justify-content: flex-start;
              margin-top: 25px;
            }

            .totals {
              width: 300px;
            }

            .totals table {
              width: 100%;
              border-collapse: collapse;
            }

            .totals td {
              padding: 7px 0;
            }

            .totals .label {
              text-align: left;
            }

            .totals .value {
              text-align: right;
              white-space: nowrap;
            }

            .total {
              border-top: 1px solid #222;
              margin-top: 8px;
              padding-top: 10px;
            }

            .total td {
              font-size: 15px;
              font-weight: bold;
            }

            .payment {
              margin-top: 30px;
              padding: 10px 15px;
              background: #254f428f;
              border: 1px solid #2e2e2e;
            }

            .payment-title {
              font-size: 13px;
              font-weight: bold;
              margin-bottom: 5px;
            }

            .payment table {
              width: 100%;
            }

            .payment td {
              padding: 4px 0;
            }

            .payment .value {
              text-align: right;
              font-weight: bold;
            }

            .footer {
              margin-top: 40px;
              padding-top: 15px;
              border-top: 1px solid #ddd;
              text-align: center;
              color: #666;
              font-size: 11px;
            }

            .thanks {
              font-size: 13px;
              font-weight: bold;
              color: #222;
              margin-bottom: 5px;
            }

            @media print {
              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
            }
          </style>
        </head>

        <body>
          <div class="document">
            <div class="header">
              <div class="company">
                <div class="company-name">${enterprise.nome}</div>

                <div class="company-info">
                  NIF: ${enterprise.nif}<br />
                  ${enterprise.endereco}<br />
                  Telefone: ${enterprise.telefone}
                </div>
              </div>

              <div class="invoice">
                <div class="invoice-title">FATURA DIGITAL</div>

                <div class="invoice-info">
                  Venda Nº ${data.saleId}<br />
                  Data: ${this.escapeHtml(data.date)}
                </div>
              </div>
            </div>

            <div class="sub-header">
              <p>
                Esta fatura foi gerada automaticamente pelo
                <strong>Kamba App</strong>
              </p>
            </div>

            <div class="sale-info">
              <table>
                <tr>
                  <td class="label">Cliente</td>

                  <td>Cliente Final</td>

                  <td class="label">Forma de pagamento</td>

                  <td>${this.escapeHtml(data.paymentMethod)}</td>
                </tr>
              </table>
            </div>

            <table class="items">
              <thead>
                <tr>
                  <th class="product">Produto</th>

                  <th class="quantity">Qtd.</th>

                  <th class="unit-price">Preço Unit.</th>

                  <th class="subtotal">Subtotal</th>
                </tr>
              </thead>

              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="totals-container">
              <div class="totals">
                <table>
                  <tr>
                    <td class="label">Subtotal</td>

                    <td class="value">${this.formatMoney(subtotal)}</td>
                  </tr>

                  ${
                    discount > 0
                      ? `
                  <tr>
                    <td class="label">Desconto</td>

                    <td class="value">-${this.formatMoney(discount)}</td>
                  </tr>
                  `
                      : ""
                  }

                  <tr class="total">
                    <td class="label">TOTAL</td>

                    <td class="value">${this.formatMoney(data.total)}</td>
                  </tr>
                </table>
              </div>
            </div>

            <div class="payment">
              <div class="payment-title">Informação de pagamento</div>

              <table>
                <tr>
                  <td>Forma de pagamento</td>

                  <td class="value">${this.escapeHtml(data.paymentMethod)}</td>
                </tr>

                <tr>
                  <td>Valor pago</td>

                  <td class="value">${this.formatMoney(data.paidAmount)}</td>
                </tr>

                <tr>
                  <td>Troco</td>

                  <td class="value">${this.formatMoney(data.change)}</td>
                </tr>
              </table>
            </div>

            <div class="footer">
              <div class="thanks">Obrigado pela preferência!</div>

              <div>Volte sempre.</div>
            </div>
          </div>
        </body>
      </html>

              
              
    `;
  }

  private formatMoney(value: number): string {
    return formatCurrency(value);
  }

  /**
   * escapeHtml
   * @param value
   * @returns
   */
  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

export const expoPrintAdapter = new ExpoPrintAdapter();
