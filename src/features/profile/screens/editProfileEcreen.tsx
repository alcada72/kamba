import { GeneralHeader } from "@/shared/components/general_header";
import { Text, View } from "react-native";

export default function EditProfileScreen() {
  return (
    <View className="flex-1 bg-background">
      <GeneralHeader>
        <Text className="text-secondary font-bold text-2xl">Editar perfil</Text>
      </GeneralHeader>
      <Text>Editar perfil</Text>
    </View>
  );
}
