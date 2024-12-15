import { useUserStore } from "@/stores/UserStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import "../styles/global.css";
import { Loading } from "@/components/Loading";
import { useErrorStore } from "@/stores/ErrorsStore";

export default function Index() {
  const { user } = useUserStore();
  const [initializing, setInitializing] = useState(true);
  const { error } = useErrorStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    if (!initializing) {
      if (error) {
        if (error.code === "network-request-failed") {
          router.replace("/noconnection");
          return;
        }
        router.replace("/error");
        return;
      }

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
