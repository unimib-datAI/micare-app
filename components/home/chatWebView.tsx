import React, { Component } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

class ChatWebView extends Component {
  render() {
    return (
      <View className="flex-1">
        <WebView
          className="min-h-96 flex-1"
          source={{
            uri: "https://knowledge.c-innovationhub.com/dipps/chat/?d=T6QexsICi1QxzG21-ZDake29qazHyrGcc8m95Dpe2Lv5xbwM_x9UT881RoIch69XcHitZ-vej_zWM9f6sMatkA==",
          }}
        />
      </View>
    );
  }
}

export default ChatWebView;
