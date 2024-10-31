import { useContext } from "react";
import { View, Text } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import ImageButton from "../ImageButton";
function Header() {
  const { state } = useContext(AuthContext);

  return (
    <View className="flex flex-col flex-grow">
      <View className="flex flex-row flex-wrap">
        <View className="w-1/4 p-2 bg-gray-200">
          <ImageButton
            imagePath={require("../../static/notification.png")}
            navigationPath="/notification"
          />
        </View>
        <View className="w-1/2 p-2 bg-gray-200">
          <Text className="text-center">Ciao {state.userInfo.givenName}</Text>
        </View>
        <View className="w-1/4 p-2 bg-gray-200">
          <ImageButton
            imagePath={require("../../static/chat.png")}
            navigationPath="/chat"
          />
        </View>
      </View>
    </View>
  );
}

export default Header;
