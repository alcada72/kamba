import { useAuthState } from "@/features/auth/store/auth.store";
import { UserRepository } from "@/features/profile/repositories/userRepositories";
import { User } from "@/features/profile/types/user";
import { GeneralHeader } from "@/shared/components/general_header";
import { KeysBoardComponent, PIN_LENGTH } from "@/shared/components/keysBoards";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colos";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

type Step = "create" | "confirm";

export default function ActiveCodeScreen() {
  const [code, setCode] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [step, setStep] = useState<Step>("create");
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState<User | null>(null);

  const { activeTrunckedApp, setActiveTrunckedApp } = useAuthState();
  const db = useSQLiteContext();

  const userRepositorie = new UserRepository(db);
  const currentCode = step === "create" ? code : confirmCode;
  const isComplete = currentCode.length === PIN_LENGTH;

  const lang = useLanguageStore((stt) => stt.lang);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const res = await userRepositorie.getFrist(1);
      setUserData(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTextChange = (value: React.SetStateAction<string>) => {
    setMessage("");

    if (value.length > PIN_LENGTH) return;

    if (step === "create") {
      setCode(value);
    } else {
      setConfirmCode(value);
    }
  };

  const handleDelete = (value: React.SetStateAction<string>) => {
    setMessage("");

    if (step === "create") {
      setCode(value);
    } else {
      setConfirmCode(value);
    }
  };

  const handleEnter = async () => {
    setMessage("");

    if (step === "create") {
      if (!isComplete) {
        setMessage(
          t("activeCodeEnterDigits", lang).replace(
            "{length}",
            String(PIN_LENGTH),
          ),
        );
        return;
      }

      setConfirmCode("");
      setStep("confirm");

      return;
    }

    if (!isComplete) {
      setMessage(
        t("activeCodeConfirmDigits", lang).replace(
          "{length}",
          String(PIN_LENGTH),
        ),
      );
      return;
    }

    const errorMessage = t("activeCodeMismatch", lang);

    if (code !== confirmCode) {
      setMessage(errorMessage);

      Alert.alert(t("error", lang), errorMessage, [
        {
          text: "OK",
          onPress: handleBack,
        },
      ]);

      return;
    } else if (userData?.senha !== code || activeTrunckedApp) {
      return;
    }

    console.log("PIN confirmado:", code);

    try {
      const res = await userRepositorie.update(
        {
          senha: activeTrunckedApp ? undefined : code,
        },
        1,
      );

      if (!res?.lastInsertRowId) {
        Alert.alert(t("error", lang), errorMessage, [
          {
            text: "OK",
            onPress: handleBack,
          },
        ]);
      } else {
        Alert.alert(t("success", lang), t("savedSuccessfully", lang), [
          {
            text: "OK",
            onPress: () => {
              setActiveTrunckedApp(!activeTrunckedApp);
              router.back();
            },
          },
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    setMessage("");
    setConfirmCode("");
    setCode("");
    setStep("create");
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <GeneralHeader>
        <View className="items-center justify-center py-2">
          <Text className="text-white text-2xl font-bold">
            {activeTrunckedApp
              ? t("disableCodeTitle", lang)
              : t("activeCodeTitle", lang)}
          </Text>

          <Text className="text-white/70 text-sm mt-1">
            {t(
              step === "create"
                ? "activeCodeCreateSubtitle"
                : "activeCodeConfirmSubtitle",
              lang,
            )}
          </Text>
        </View>
      </GeneralHeader>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-end",
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-6 pb-6">
          <View className="flex-row justify-center items-center gap-2 mb-7">
            <View
              className={`h-1.5 w-12 rounded-full ${
                step === "create" ? "bg-primary" : "bg-primaryAccent"
              }`}
            />

            <View
              className={`h-1.5 w-12 rounded-full ${
                step === "confirm" ? "bg-primary" : "bg-primaryAccent"
              }`}
            />
          </View>

          <View className="items-center mb-8">
            <Text className="text-text text-2xl font-bold text-center">
              {t(
                step === "create"
                  ? "activeCodeCreateTitle"
                  : "activeCodeConfirmTitle",
                lang,
              )}
            </Text>

            <Text className="text-text text-base text-center mt-2">
              {t(
                step === "create"
                  ? "activeCodeCreateDescription"
                  : "activeCodeConfirmDescription",
                lang,
              ).replace("{length}", String(PIN_LENGTH))}
            </Text>
          </View>

          <View className="flex-row gap-4 items-center justify-center mb-6">
            {Array.from({ length: PIN_LENGTH }).map((_, index) => {
              const filled = index < currentCode.length;

              return (
                <View
                  key={index}
                  className={`h-9 w-9 rounded-full ${
                    filled
                      ? "bg-primary border-2 border-secondary"
                      : "bg-gray-700"
                  }`}
                />
              );
            })}
          </View>

          <View className="h-8 items-center justify-center mb-4">
            {message ? (
              <Text className="text-red-400 text-sm text-center font-medium">
                {message}
              </Text>
            ) : (
              <Text className="text-gray-400 text-sm">
                {currentCode.length}/{PIN_LENGTH}
              </Text>
            )}
          </View>

          {step === "confirm" && (
            <Pressable onPress={handleBack} className="items-center mb-3">
              <Text className="text-secondary text-lg font-semibold">
                {t("activeCodeChange", lang)}
              </Text>
            </Pressable>
          )}
        </View>

        <View
          className="rounded-t-[32px] px-3 pt-4 pb-6"
          style={{
            backgroundColor: colors.primaryAccent,
          }}
        >
          <KeysBoardComponent
            onTextChange={handleTextChange}
            onDelete={handleDelete}
            onEnter={handleEnter}
            disable={!isComplete}
          />
        </View>
      </ScrollView>
    </View>
  );
}
