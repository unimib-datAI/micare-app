import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const ImageButton = ({ imagePath, navigationPath }) => {
  const router = useRouter();

  const handlePress = () => {
    console.log("pushing path:", navigationPath);
    router.navigate(navigationPath);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View>
        <Image
          className="bg-gray-800"
          source={imagePath}
          style={{ width: 40, height: 40 }}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
};

export default ImageButton;
