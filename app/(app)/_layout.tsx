import { Redirect, Slot } from "expo-router";
import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function AppLayout() {
  const { state } = useContext(AuthContext);
  if (!state.isSignedIn) {
    return <Redirect href="/login" />;
  }

  return <Slot />;
}
