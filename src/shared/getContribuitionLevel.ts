export default function getContributionLevel(quantity: number) {
  if (quantity === 0) return 0;
  if (quantity <= 1) return 1;
  if (quantity <= 3) return 2;
  if (quantity <= 6) return 3;

  return 4;
}
