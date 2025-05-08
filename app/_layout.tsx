import { Stack } from "expo-router";
import NutritionistProvider  from "./contexts/NutritionistContext";
import PatientProvider from "./contexts/PatientContext";

export default function RootLayout() {
  return (
    <NutritionistProvider>
      <PatientProvider>
        <Stack />
      </PatientProvider>
    </NutritionistProvider>
  );
}
