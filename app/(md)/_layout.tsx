import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="md" />
      <Stack.Screen name="suggestioninf" options={{ headerShown: false }} />
      <Stack.Screen name="contactinf" options={{ headerShown: false }} />
    </Stack>
  );
}
