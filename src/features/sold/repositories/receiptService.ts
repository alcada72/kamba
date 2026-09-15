import * as Print from "expo-print";
import { PrintOptions, ReceiptData } from "../types/factura";

export class ReceiptService {
  static async print(sale: ReceiptData, options: PrintOptions = {}) {
    const width = options.width ?? "80mm";

    const itemsHtml = sale.items
      .map(
        (item) => `
          <tr>
            <td class="product">
              ${this.escapeHtml(item.name)}
            </td>

            <td class="quantity">
              ${item.quantity}
            </td>

            <td class="price">
              ${this.formatMoney(item.subtotal)}
            </td>
          </tr>
        `,
      )
      .join("");

    const discount = sale.discount ?? 0;

    const html = `
      <!DOCTYPE html>

      <html>
        <head>
          <meta charset="UTF-8" />

          <style>
            @page {
              size: ${width} auto;
              margin: 0;
            }

            * {
              box-sizing: border-box;
            }

            html,
            body {
              margin: 0;
              padding: 0;
              width: ${width};
              background: white;
            }

            body {
              font-family: Arial, sans-serif;
              color: #222;
              font-size: 12px;
              padding: 4mm;
            }

            .header {
              text-align: center;
            }

            .store-name {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 4px;
            }

            .receipt-title {
              font-size: 13px;
              font-weight: bold;
            }

            .info {
              margin-top: 4px;
              font-size: 11px;
            }

            .line {
              border-top: 1px dashed #555;
              margin: 10px 0;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            td {
              padding: 4px 0;
              vertical-align: top;
            }

            .product {
              width: 55%;
              text-align: left;
              word-break: break-word;
            }

            .quantity {
              width: 15%;
              text-align: center;
            }

            .price {
              width: 30%;
              text-align: right;
              white-space: nowrap;
            }

            .total-row td {
              padding-top: 6px;
            }

            .total-label {
              font-size: 17px;
              font-weight: bold;
            }

            .total-value {
              font-size: 17px;
              font-weight: bold;
              text-align: right;
              white-space: nowrap;
            }

            .payment td {
              padding: 3px 0;
            }

            .footer {
              margin-top: 20px;
              text-align: center;
              font-size: 11px;
            }

            .thanks {
              font-weight: bold;
              margin-bottom: 5px;
            }
          </style>
        </head>

        <body>

          <!-- CABEÇALHO -->

          <div class="header">

            <div class="store-name">
              MINHA LOJA
            </div>

            <div class="receipt-title">
              RECIBO DE VENDA
            </div>

            <div class="info">
              Venda Nº ${sale.saleId}
            </div>

            <div class="info">
              ${this.escapeHtml(sale.date)}
            </div>

          </div>

          <div class="line"></div>

          <!-- PRODUTOS -->

          <table>

            <tr>
              <td class="product">
                Produto
              </td>

              <td class="quantity">
                Qtd
              </td>

              <td class="price">
                Total
              </td>
            </tr>

            ${itemsHtml}

          </table>

          <div class="line"></div>

          <!-- TOTAIS -->

          <table>

            ${
              discount > 0
                ? `
                  <tr>
                    <td>
                      Subtotal
                    </td>

                    <td class="price">
                      ${this.formatMoney(sale.total + discount)}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      Desconto
                    </td>

                    <td class="price">
                      -${this.formatMoney(discount)}
                    </td>
                  </tr>
                `
                : ""
            }

            <tr class="total-row">

              <td class="total-label">
                TOTAL
              </td>

              <td class="total-value">
                ${this.formatMoney(sale.total)}
              </td>

            </tr>

          </table>

          <div class="line"></div>

          <!-- PAGAMENTO -->

          <table class="payment">

            <tr>
              <td>
                Pagamento
              </td>

              <td class="price">
                ${this.escapeHtml(sale.paymentMethod)}
              </td>
            </tr>

            <tr>
              <td>
                Valor pago
              </td>

              <td class="price">
                ${this.formatMoney(sale.paidAmount)}
              </td>
            </tr>

            <tr>
              <td>
                Troco
              </td>

              <td class="price">
                ${this.formatMoney(sale.change)}
              </td>
            </tr>

          </table>

          <!-- RODAPÉ -->

          <div class="footer">

            <div class="thanks">
              Obrigado pela preferência!
            </div>

            <div>
              Volte sempre.
            </div>

          </div>

        </body>
      </html>
    `;

    await Print.printAsync({
      html,
    });
  }

  private static formatMoney(value: number): string {
    return `${value.toLocaleString("pt-AO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} Kz`;
  }

  private static escapeHtml(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
