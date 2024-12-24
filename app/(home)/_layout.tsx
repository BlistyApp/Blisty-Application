import { TabBarIcon, TabBarLabel } from "@/components/icons/Icons";
import { Tabs, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useUserStore } from "@/stores/UserStore";
import { Loading } from "@/components/Loading";
import { useEffect, useState } from "react";
import { BackHandler } from "react-native";
import { ExitSurvey } from "../../components/ExitSurvey";
export default function TabsLayout() {
  const [loading, setLoading] = useState(true);
  const { user } = useUserStore();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const segments = useSegments();
  
  useEffect(() => {
    if (user?.role) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [user]);

  useEffect(() => {
    const backAction = () => {
      if (user?.uid !== null && segments[1] === "chats") {
        setIsVisible(true);
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [segments]);

  if (loading) return <Loading />;

  return (
    <SafeAreaProvider>
      <ExitSurvey
        isVisible={isVisible}
        closeSurvey={() => {
          setIsVisible(false);
          BackHandler.exitApp();
        }}
      />
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
