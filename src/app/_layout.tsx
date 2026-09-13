import { InitDatabase } from "@/databases/init";
import { useAuthState } from "@/features/auth/store/auth.store";
import { assetsPath } from "@/shared/assets";
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
    "856020489210-0fb7trui84gvjiskt11uog3cvucpcual.apps.googleusercontent.com",
  scopes: ["https://www.googleapis.com/auth/drive.appdata"],
  offlineAccess: false,
});

export default function RootLayout() {
  const { isLogged, isTrunckedApp, activeTrunckedApp } = useAuthState();

  const segments = useSegments();

  const pathname = usePathname();

  const lastPrivateRoute = useRef<string | null>(null);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isLogged) {
      return;
    }

    if (pathname.startsWith("/private")) {
      lastPrivateRoute.current = pathname;
    }
  }, [pathname, isLogged]);

  useEffect(() => {
    const unsubscribe = useAuthState.persist.onFinishHydration(() => {
      setIsReady(true);
    });

    if (useAuthState.persist.hasHydrated()) {
      setIsReady(true);
    }

    return unsubscribe;
  }, []);

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
      if (segments[1] !== "truncked") {
        router.replace("/(auth)/truncked");
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
  }, [isReady, isLogged, isTrunckedApp, segments, pathname, activeTrunckedApp]);

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
