type ContributionDay = {
  date: string;
  quantity: number;
  faturamento: number;
  level: 0 | 1 | 2 | 3 | 4;
};

type SaleQuantityByDay = {
  dia: string;
  quantidade_vendas: number;
  faturamento: number;
};

type SalesContributionChartProps = {
  data: SaleQuantityByDay[];
};
