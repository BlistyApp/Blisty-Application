import { Tabs } from "expo-router";
import { TabBarIcon, TabBarLabel } from "@/components/icons/Icons";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function TabsLayout() {
  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="chats"
          options={{
            title: "Chat",
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name="message1" focused={focused} />
            ),
            tabBarLabel: ({ focused, children }) => (
              <TabBarLabel focused={focused}>{children}</TabBarLabel>
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "Perfil",
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name="home" focused={focused} />
            ),
            tabBarLabel: ({ children, focused }) => (
              <TabBarLabel focused={focused}>{children}</TabBarLabel>
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
