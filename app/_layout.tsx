import { Slot } from "expo-router";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { clientPersister } from "../utils/storage";
import { queryClient } from "../utils/queryClient";
import { SafeAreaView } from "react-native";
import { AuthProvider } from "../context/AuthContext";
import "../global.css";

export default function RootLayout() {
  //const pathname = usePathname();
  //console.log("path:", pathname);
  return (
    <AuthProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: clientPersister }}
      >
        <SafeAreaView>
          <Slot />
        </SafeAreaView>
      </PersistQueryClientProvider>
    </AuthProvider>
  );
}
