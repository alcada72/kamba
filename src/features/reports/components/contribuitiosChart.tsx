import formatDate from "@/shared/formate-date";
import getContributionLevel from "@/shared/getContribuitionLevel";
import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

const CELL_SIZE = 14;
const CELL_GAP = 4;

const colors = [
  "#E5E7EB", // 0 - sem vendas
  "#DCFCE7", // 1
  "#86EFAC", // 2-3
  "#22C55E", // 4-6
  "#15803D", // 7+
];

function createDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function getStartDate() {
  const today = new Date();

  // Aproximadamente 12 meses atrás
  const start = new Date(today.getFullYear(), today.getMonth() - 11, 1);

  // Volta para o domingo da semana
  start.setDate(start.getDate() - start.getDay());

  return start;
}

function getEndDate() {
  const today = new Date();

  // Avança para o sábado da semana atual
  const end = new Date(today);
  end.setDate(today.getDate() + (6 - today.getDay()));

  return end;
}

function createContributionMap(
  data: SaleQuantityByDay[],
): Map<string, ContributionDay> {
  const map = new Map<string, ContributionDay>();

  for (const item of data) {
    map.set(item.dia, {
      date: item.dia,
      quantity: item.quantidade_vendas,
      faturamento: item.faturamento,
      level: getContributionLevel(item.quantidade_vendas),
    });
  }

  return map;
}

function createWeeks(data: SaleQuantityByDay[]): ContributionDay[][] {
  const map = createContributionMap(data);

  const start = getStartDate();
  const end = getEndDate();

  const weeks: ContributionDay[][] = [];

  const current = new Date(start);

  let week: ContributionDay[] = [];

  while (current <= end) {
    const date = formatDate(current);

    const existing = map.get(date);

    week.push(
      existing ?? {
        date,
        quantity: 0,
        faturamento: 0,
        level: 0,
      },
    );

    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }

    current.setDate(current.getDate() + 1);
  }

  if (week.length > 0) {
    weeks.push(week);
  }

  return weeks;
}

function getMonthLabels(weeks: ContributionDay[][]) {
  const labels: {
    label: string;
    index: number;
  }[] = [];

  let lastMonth = -1;

  weeks.forEach((week, index) => {
    const date = createDate(week[0].date);
    const month = date.getMonth();

    if (month !== lastMonth) {
      labels.push({
        label: date.toLocaleDateString("pt-AO", {
          month: "short",
        }),
        index,
      });

      lastMonth = month;
    }
  });

  return labels;
}

function formatTooltipDate(date: string) {
  return createDate(date).toLocaleDateString("pt-AO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function SalesContributionChart({
  data,
}: SalesContributionChartProps) {
  const weeks = useMemo(() => {
    return createWeeks(data);
  }, [data]);

  const monthLabels = useMemo(() => {
    return getMonthLabels(weeks);
  }, [weeks]);

  return (
    <View className="rounded-2xl bg-white p-5">
      {/* Header */}
      <View className="mb-5">
        <Text className="text-lg font-bold text-gray-900">
          Atividade de vendas
        </Text>

        <Text className="mt-1 text-sm text-gray-500">
          Quantidade de vendas realizadas nos últimos meses.
        </Text>
      </View>

      {/* Gráfico */}
      <View>
        {/* Meses */}
        <View className="mb-2 ml-8 flex-row">
          {weeks.map((_, index) => {
            const month = monthLabels.find((item) => item.index === index);

            return (
              <View
                key={index}
                style={{
                  width: CELL_SIZE + CELL_GAP,
                }}
              >
                {month && (
                  <Text numberOfLines={1} className="text-[10px] text-gray-500">
                    {month.label}
                  </Text>
                )}
              </View>
            );
          })}
        </View>

        <View className="flex-row">
          {/* Dias da semana */}
          <View
            className="mr-2 justify-between"
            style={{
              height: 7 * CELL_SIZE + 6 * CELL_GAP,
            }}
          >
            <Text className="text-[10px] text-gray-500">Dom</Text>

            <Text className="text-[10px] text-gray-500">Qua</Text>

            <Text className="text-[10px] text-gray-500">Sáb</Text>
          </View>

          {/* Semanas */}
          <View className="flex-row">
            {weeks.map((week, weekIndex) => (
              <View
                key={weekIndex}
                className="mr-1"
                style={{
                  gap: CELL_GAP,
                }}
              >
                {week.map((day) => (
                  <Pressable
                    key={day.date}
                    onPress={() => {
                      console.log({
                        data: formatTooltipDate(day.date),
                        vendas: day.quantity,
                        faturamento: day.faturamento,
                      });
                    }}
                    className="rounded-[3px] border border-gray-700"
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      backgroundColor: colors[day.level],
                    }}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Legenda */}
      <View className="mt-5 flex-row items-center justify-end">
        <Text className="mr-2 text-xs text-gray-500">Menos</Text>

        {colors.map((color, index) => (
          <View
            key={index}
            className="mr-1 rounded-[3px] border-gray-700"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: color,
            }}
          />
        ))}

        <Text className="ml-1 text-xs text-gray-500">Mais</Text>
      </View>
    </View>
  );
}
