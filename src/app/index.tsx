import { assetsPath } from "@/shared/assets";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Image, Text, View } from "react-native";

export default function App() {
  useEffect(() => {
    const interval = setTimeout(() => {
      router.replace("/(private)");
    }, 2000);

    return () => {
      clearTimeout(interval);
    };
  }, []);

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-primary">
      <StatusBar style={"light"} />
      <Image source={assetsPath.logo} style={{ width: 60, height: 60 }} />
      <Text className="text-secondary text-3xl  font-black">KAMBA</Text>
    </View>
  );
}
