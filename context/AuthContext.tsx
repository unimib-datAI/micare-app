import React, { createContext, useEffect, useMemo, useState } from "react";
import {
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from "expo-auth-session";
import { storage } from "../utils/storage";

const initialState = {
  isSignedIn: storage.getBoolean("isSignedIn") || false,
  accessToken: storage.getString("accessToken") || null,
  refreshToken: storage.getString("refreshToken") || null,
  idToken: storage.getString("idToken") || null,
  userInfo: JSON.parse(storage.getString("userInfo") || "{}") || null,
  coneyToken: storage.getString("coneyToken") || null,
};

const AuthContext = createContext({
  state: initialState,
  signIn: () => {},
  signOut: () => {},
  // eslint-disable-next-line no-unused-vars
  hasRole: (role) => false,
  refreshConeyToken: () => {},
});

const AuthProvider = ({ children }) => {
  const discovery = useAutoDiscovery(process.env.EXPO_PUBLIC_KEYCLOAK_URL);
  const redirectUri = makeRedirectUri({
    scheme: "micare",
    path: "index",
  });
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID,
      redirectUri: redirectUri,
      scopes: ["openid", "profile"],
    },
    discovery
  );

  const [authState, setAuthState] = useState(initialState);

  const saveAuthState = (newState) => {
    if (newState.isSignedIn !== undefined) {
      storage.set("isSignedIn", newState.isSignedIn);
    }
    if (newState.accessToken !== undefined) {
      if (newState.accessToken === null) {
        storage.delete("accessToken");
      } else {
        storage.set("accessToken", newState.accessToken);
      }
    }
    if (newState.refreshToken !== undefined) {
      if (newState.refreshToken === null) {
        storage.delete("refreshToken");
      } else {
        storage.set("refreshToken", newState.refreshToken);
      }
    }
    if (newState.idToken !== undefined) {
      if (newState.idToken === null) {
        storage.delete("idToken");
      } else {
        storage.set("idToken", newState.idToken);
      }
    }
    if (newState.userInfo !== undefined) {
      if (newState.userInfo === null) {
        storage.delete("userInfo");
      } else {
        storage.set("userInfo", JSON.stringify(newState.userInfo));
      }
    }
    setAuthState(newState);
  };

  const authContext = useMemo(
    () => ({
      state: authState,
      signIn: () => {
        try {
          promptAsync();
        } catch (e) {
          console.warn("Error signing in", e);
        }
      },
      signOut: async () => {
        try {
          const idToken = authState.idToken;
          await fetch(
            `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/logout?id_token_hint=${idToken}`
          );
          const newState = {
            isSignedIn: false,
            accessToken: null,
            refreshToken: null,
            idToken: null,
            userInfo: null,
          };
          saveAuthState(newState);
        } catch (e) {
          console.warn("error during signout", e);
        }
      },
      refreshConeyToken: async () => {
        console.log("Refreshing coney token");
        const url =
          process.env.EXPO_PUBLIC_CONEY_BASE_URL + "coney-api/authenticate";
        console.log("URL:", url);
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `${process.env.EXPO_PUBLIC_CONEY_USER}:${process.env.EXPO_PUBLIC_CONEY_PASS}`,
          },
        });
        console.log("Response AuthContext:", response);
        if (response.ok) {
          const payload = await response.json();
          console.log("Coney token AuthContext:", payload.token);
          saveAuthState({
            ...authState,
            coneyToken: payload.token,
          });
        } else {
          console.warn("Error refreshing coney token: ", response);
        }
      },
      hasRole: (role) => authState.userInfo?.roles.indexOf(role) !== -1,
    }),
    [authState, promptAsync]
  );

  useEffect(() => {
    const getToken = async ({ code, codeVerifier, redirectUri }) => {
      try {
        const formData = new URLSearchParams({
          grant_type: "authorization_code",
          client_id: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID,
          client_secret: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_SECRET,
          code: code,
          code_verifier: codeVerifier,
          redirect_uri: redirectUri,
        }).toString();

        const response = await fetch(
          `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/token`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData,
          }
        );
        if (response.ok) {
          const payload = await response.json();
          saveAuthState({
            ...authState,
            isSignedIn: true,
            accessToken: payload.access_token,
            refreshToken: payload.refresh_token,
            idToken: payload.id_token,
          });
        } else {
          console.warn("getToken error: ", response);
        }
      } catch (e) {
        console.warn("error getting token", e);
      }
    };
    if (response?.type === "success") {
      const { code } = response.params;
      getToken({
        code,
        codeVerifier: request?.codeVerifier,
        redirectUri,
      });
    } else if (response?.type === "error") {
      console.warn("Authentication error: ", response.error);
    }
  }, [redirectUri, request?.codeVerifier, response]);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const accessToken = authState.accessToken;
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/userinfo`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + accessToken,
              Accept: "application/json",
            },
          }
        );
        if (response.ok) {
          console.log("User info response:", response);
          const payload = await response.json();
          saveAuthState({
            ...authState,
            userInfo: {
              username: payload.preferred_username,
              givenName: payload.given_name,
              familyName: payload.family_name,
              email: payload.email,
              roles: payload.roles,
            },
          });
        }
      } catch (e) {
        console.warn("error getting user info:", e);
      }
    };
    if (authState.isSignedIn) {
      getUserInfo();
    }
  }, [authState.accessToken, authState.isSignedIn]);

  return (
    <AuthContext.Provider
      // @ts-ignore
      value={authContext}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
