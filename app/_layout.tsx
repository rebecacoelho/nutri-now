import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import NutritionistProvider from "./contexts/NutritionistContext";
import PatientProvider from "./contexts/PatientContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <NutritionistProvider>
        <PatientProvider>
          <Stack
            screenOptions={{
              headerShown: true,
              headerStyle: {
                backgroundColor: "#fff",
              },
              headerTitleStyle: {
                fontWeight: "bold",
              },
              contentStyle: {
                backgroundColor: "#f8f8f8",
              },
            }}
          />
        </PatientProvider>
      </NutritionistProvider>
    </SafeAreaProvider>
  );
}