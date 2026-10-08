import colors from "@/theme/colos";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
          flex: 1,
        },
      }}
    />
  );
}
