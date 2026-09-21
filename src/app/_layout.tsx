import { InitDatabase } from "@/databases/init";
import { useAuthState } from "@/features/auth/store/auth.store";
import { useBackupStore } from "@/features/backup/store/backup.store";
import { assetsPath } from "@/shared/assets";
import { hydrateStores } from "@/shared/helpers/hydrateStores";
import colors from "@/theme/colos";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router, Stack, usePathname, useSegments } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { Suspense, useEffect, useRef, useState } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "./global.css";

GoogleSignin.configure({
  webClientId:
    "898877283535-ibbhnhkgrbomi4mvh2tq08cfqu3m2a62.apps.googleusercontent.com",
  iosClientId:
    "898877283535-7gmm7qcq9u4rdhpsf1i4jai0ob85f0nr.apps.googleusercontent.com",
  scopes: [
    "https://www.googleapis.com/auth/drive.appdata",
    "https://www.googleapis.com/auth/gmail.send",
  ],
});

export default function RootLayout() {
  const { isLogged, isTrunckedApp } = useAuthState();

  const { downloadBackupIsCompleted } = useBackupStore();

  const segments = useSegments();
  const pathname = usePathname();

  const lastPrivateRoute = useRef<string | null>(null);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    hydrateStores().then(() => {
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isLogged) {
      return;
    }

    if (segments[0] === "(private)") {
      lastPrivateRoute.current = pathname;
    }
  }, [segments, pathname, isLogged]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const currentGroup = segments[0];

    if (!isLogged) {
      if (currentGroup !== "(auth)") {
        router.replace("/(auth)");
      }

      return;
    }

    if (isTrunckedApp) {
      if (currentGroup !== "truncked") {
        router.replace("/(auth)/truncked");
      }

      return;
    }

    if (!downloadBackupIsCompleted) {
      if (pathname !== "/settings/backup/restore") {
        router.replace("/(private)/settings/backup/restore");
      }

      return;
    }

    if (currentGroup === "(auth)" && lastPrivateRoute.current) {
      router.replace(lastPrivateRoute.current as any);

      return;
    }

    if (currentGroup !== "(private)") {
      router.replace("/(private)");

      return;
    }
  }, [
    isReady,
    isLogged,
    isTrunckedApp,
    downloadBackupIsCompleted,
    segments,
    pathname,
  ]);

  if (!isReady) {
    return <SuspenseComponent />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.primary,
        }}
      >
        <StatusBar style="light" />

        <Suspense fallback={<SuspenseComponent />}>
          <SQLiteProvider
            databaseName="kambaDb.db"
            onInit={InitDatabase}
            useSuspense
          >
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor: colors.background,
                  flex: 1,
                },
              }}
            />
          </SQLiteProvider>
        </Suspense>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function SuspenseComponent() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-primary">
      <Image
        source={assetsPath.logo}
        style={{
          width: 90,
          height: 90,
        }}
      />

      <Text className="text-secondary text-3xl font-bold">KAMBA</Text>
    </View>
  );
}
