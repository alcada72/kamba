import colors from "@/theme/colos";
import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export const keysBoards: (string | number)[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  ["DEL", 0, "OK"],
];

export const PIN_LENGTH = 6;

interface Props {
  onTextChange: (value: React.SetStateAction<string>) => void;
  onDelete: (value: React.SetStateAction<string>) => void;
  onEnter: () => void;
  disable?: boolean;
}

export const KeysBoardComponent = ({
  onTextChange,
  onEnter,
  onDelete,
  disable,
}: Props) => {
  const handleKeyPress = (key: number | string) => {
    if (key === "DEL") {
      onDelete((prev) => prev.slice(0, -1));
      return;
    }

    if (key === "OK") {
      if (disable) return;
      onEnter();
      return;
    }

    onTextChange((prev) => {
      if (prev.length >= PIN_LENGTH) {
        return prev;
      }

      return prev + String(key);
    });
  };

  return (
    <View className="items-center p-5 bg-transparent">
      {keysBoards.map((row, rowIndex) => (
        <View
          key={rowIndex}
          className="w-full  flex-row items-center justify-between "
        >
          {row.map((key) => {
            return (
              <Pressable
                key={key}
                disabled={key === "OK" && disable}
                onPress={() => handleKeyPress(key)}
                className="flex-1 items-center justify-center rounded-lg p-4 active:bg-white/20"
              >
                <Text className={`font-black text-4xl text-white`}>
                  {key === "DEL" ? (
                    <Feather name="delete" size={25} color={colors.error} />
                  ) : key === "OK" ? (
                    <Feather name="check" size={25} color={colors.white} />
                  ) : (
                    key
                  )}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
};
