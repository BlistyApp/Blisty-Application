import { useCredentialStore } from "@/stores/CredentialStore";
import { useFirebaseStore } from "@/stores/FirebaseStore";
import { useEffect, useState } from "react";

import { useUserStore } from "@/stores/UserStore";
import {
  router,
  Stack,
  useSegments,
  useRootNavigationState,
} from "expo-router";
import { Loading } from "@/components/Loading";
import BlistyError from "@/lib/blistyError";
import { useErrorStore } from "@/stores/ErrorsStore";
import { useAppKeyStore } from "@/stores/AppKeyStore";

export default function RootLayout() {
  const { getCredentials, decrypt } = useCredentialStore();
  const { initFirebase, fbAuth, updateUser } = useFirebaseStore(
    (state) => state
  );
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const { setUser, clearUser, user } = useUserStore();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const { setError, error } = useErrorStore((state) => state);
  const { appKey } = useAppKeyStore((state) => state);

  
  useEffect(() => {
    setLoading(true);
  }, [appKey]);


  const onAuthStateChanged = (user: any) => {
    if (user) {
      console.log("User is signed in", user);
      setUser({
        email: user.email,
        name: user.displayName,
        profilePic: user.photoURL,
        uid: user.uid,
      });
    } else {
      console.log("User is signed out");
      clearUser();
    }
    setLoading(false);

  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        //console.log("INITIALIZE AUTH");
        await getCredentials();
        await decrypt();
        initFirebase();
      } catch (e) {
        console.error(e);
        setLoading(false);
        if (e instanceof BlistyError) {
          if (e.code === "auth/network-request-failed") {
            setError({ code: "network-request-failed" });
            return;
          }
        }

        if (e instanceof TypeError) {
          if (e.message === "Network request failed") {
            setError({ code: "network-request-failed" });
            return;
          }
        }
        setError({ code: "default" });
      }
    };
    initializeAuth();
  }, [appKey]);

  useEffect(() => {
    if (fbAuth) {
      fbAuth.onAuthStateChanged(onAuthStateChanged);
    }
  }, [fbAuth, appKey]);

  useEffect(() => {
    const getUserInf = async () => {

      if (fbAuth && user) {
        try {
          if (navigationState?.key) {
            console.log(segments);

            if (
              (segments[0] === "error" || segments[0] === "noconnection") &&
              error
            )
              return;

            const inProtectedPage =
              segments[0] === "(home)" || segments[0] === "(md)";
            if (user && !inProtectedPage) {
              await updateUser();
              //console.log("changing page");
              router.replace("/(home)/chats");
            } else if (!user && inProtectedPage) {
              router.replace("/welcome");
            }
          }
        } catch (e) {
          console.error(e);
          if (e instanceof BlistyError) {
            if (e.code === "auth/network-request-failed") {
              setError({ code: "network-request-failed" });
              return;
            }
          }
          setError({ code: "error-in-logging" });
          return;
        }
      }
    };
    if(initializing === false && loading === false) getUserInf();
  }, [navigationState?.key, segments, user, initializing, loading]);

/*   useEffect(() => {
    console.log(loading, initializing);
  }, [loading, initializing]); */

  useEffect(() => {
    setInitializing(false);
  }, []);

  if (loading || initializing) {
    return <Loading />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="welcome"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(home)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(md)" options={{ headerShown: false }} />
      <Stack.Screen name="error" options={{ headerShown: false }} />
      <Stack.Screen name="noconnection" options={{ headerShown: false }} />
    </Stack>
  );
}
