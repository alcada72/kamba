import React from "react";
import { Text, View } from "react-native";
type Props = {
  title: string;
  value: string | number;
};
export const ResumeCard = ({ title, value }: Props) => {
  return (
    <View className="mb-4 w-[48%] rounded-2xl bg-white p-4 border border-dotted border-primary">
      <Text className="text-sm font-medium text-gray-500">{title}</Text>

      <Text numberOfLines={1} className="mt-2 text-xl font-bold text-gray-900">
        {value}
      </Text>
    </View>
  );
};
