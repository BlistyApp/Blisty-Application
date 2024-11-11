import { TabBarIcon, TabBarLabel } from "@/components/icons/Icons";
import { Tabs } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useUserStore } from "@/stores/UserStore";
import { Loading } from "@/components/Loading";
import { useEffect, useState } from "react";
export default function TabsLayout() {
  const [loading, setLoading] = useState(true);
  const { user } = useUserStore();

  useEffect(() => {
    if (user?.role) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [user]);

  if (loading) return <Loading />;

  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
      >
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
