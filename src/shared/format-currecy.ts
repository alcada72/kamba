export default function formatCurrency(value: number, frcDgt = 0): string {
  return `${value.toLocaleString("pt-AO", {
    minimumFractionDigits: frcDgt,
    maximumFractionDigits: frcDgt,
  })} Kz`;
}
