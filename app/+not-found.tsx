import { Link } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NotFound = () => {
  return (
    <SafeAreaView className="bg-zinc-500">
      <Text className="text-white">404 not found</Text>
      <Link href="/">Go Home</Link>
    </SafeAreaView>
  );
};

export default NotFound;
