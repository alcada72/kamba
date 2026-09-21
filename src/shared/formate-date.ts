export default function formatDate(value: string | Date): string {
  const date =
    typeof value === "string"
      ? new Date(value.replace(" ", "T"))
      : value.toISOString().split("T")[0];

  return date.toLocaleString("pt-AO", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
