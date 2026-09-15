import { useAuthState } from "@/features/auth/store/auth.store";
import colors from "@/theme/colos";
import { Stack } from "expo-router";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

const INACTIVITY_TIMEOUT = 60 * 1000;

export default function RootLayout() {
  const { isLogged, isTrunckedApp, setTruncked, setInactiveAt, inactiveAt } =
    useAuthState();

  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const inactiveAtRef = useRef<number | null>(inactiveAt);

  useEffect(() => {
    inactiveAtRef.current = inactiveAt;
  }, [inactiveAt]);

  useEffect(() => {
    if (!isLogged || isTrunckedApp) {
      return;
    }

    const handleAppStateChange = (nextState: AppStateStatus) => {
      const previousState = appStateRef.current;

      const wasActive = previousState === "active";

      const isInactive = nextState === "background" || nextState === "inactive";

      if (wasActive && isInactive) {
        const timestamp = Date.now();

        inactiveAtRef.current = timestamp;
        setInactiveAt(timestamp);
      }

      if (nextState === "active") {
        const inactiveAt = inactiveAtRef.current;

        if (inactiveAt !== null) {
          const elapsed = Date.now() - inactiveAt;

          if (elapsed >= INACTIVITY_TIMEOUT) {
            setTruncked(true);
          }
        }

        inactiveAtRef.current = null;
        setInactiveAt(null);
      }

      appStateRef.current = nextState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [isLogged, isTrunckedApp, setInactiveAt, setTruncked]);

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
