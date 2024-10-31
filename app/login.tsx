import React, { useContext, useEffect } from "react";
import { Button } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const { state, signIn } = useContext(AuthContext);
  useEffect(() => {
    if (state.isSignedIn) {
      router.replace("/");
    }
  }, [state]);

  const handleSignIn = async () => {
    signIn();
  };

  return (
    <SafeAreaView>
      <Button onPress={handleSignIn} title={"Sign in"} />
    </SafeAreaView>
  );
}
