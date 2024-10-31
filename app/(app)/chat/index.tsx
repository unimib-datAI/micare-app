import { SafeAreaView, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { AuthContext } from "../../../context/AuthContext";
import { useContext, useEffect } from "react";
//import ChatWebView from "../../../components/home/chatWebView";

const fetchData = async (token) => {
  const url =
    process.env.EXPO_PUBLIC_CONEY_BASE_URL +
    "coney-api/conversations/ce03a6f4aa69409eb713bd27989f88ac/sharinglinks";
  const payload = JSON.stringify([
    {
      sharingLinkParams: {
        userId: "User1234",
        meta1: "",
        meta2: "",
        noRepeat: false,
      },
      sharingLinkBaseUrl:
        "https://knowledge.c-innovationhub.com/dipps/chat/?d=",
    },
  ]);
  console.log("URL:", url);
  console.log("Token:", token);
  console.log("Payload:", payload);
  const response = await fetch(url, {
    method: "POST",
    body: payload,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("Response:", response);
  const json = await response.json();
  console.log("Response logged json:", json);
  return json;
};
export default function Chat() {
  const { state, refreshConeyToken } = useContext(AuthContext);
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const adjustedHeight = height - insets.top - insets.bottom;

  console.log("Chat! Height:", adjustedHeight);
  const handleMessage = (event) => {
    //console.log("Event:", event);
    const { data } = event.nativeEvent;
    console.log("Received message:", data);
  };
  if (state.coneyToken === null) {
    refreshConeyToken();
  }
  useEffect(() => {
    if (state.coneyToken != null) {
      const r = fetchData(state.coneyToken);
      console.log("Response:", r);
    }
  }, [state.coneyToken]);

  //window.addEventListener("message", handleMessage);

  const injectedJavaScript = `
    (function() {
    window.addEventListener("message", function(event) {
      const e = JSON.stringify(event.data);
      window.ReactNativeWebView.postMessage(e);
    });
  })();
  `;

  return (
    <SafeAreaView className="bg-white">
      <WebView
        style={{ minHeight: adjustedHeight, minWidth: "100%" }}
        originWhitelist={["*"]}
        source={{
          uri: "https://knowledge.c-innovationhub.com/dipps/chat/?d=T6QexsICi1QxzG21-ZDake29qazHyrGcc8m95Dpe2Lv5xbwM_x9UT881RoIch69XcHitZ-vej_zWM9f6sMatkA==",
        }}
        onMessage={handleMessage}
        injectedJavaScript={injectedJavaScript}
      />
    </SafeAreaView>
  );
}
