import { useUserStore } from "@/stores/UserStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import "../styles/global.css";
import { Loading } from "@/components/Loading";

export default function Index() {
  const { user } = useUserStore();
  const [initializing, setInitializing] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!initializing) {
      if (user === null) {
        router.replace("/welcome");
      }
    }
  }, [user, initializing]);

  useEffect(() => {
    setInitializing(false);
  }, []);

  return <Loading />;
}
