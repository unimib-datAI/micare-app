import { Button } from "react-native";
import { Link, router } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/home/header";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const { signOut } = useContext(AuthContext);
  const handleSignOut = async () => {
    signOut();
    router.replace("/login");
  };
  return (
    <SafeAreaView>
      <Header />
      <Button onPress={handleSignOut} title="Sign out" />
      <Link href="/testquery" className="text-blue-800 text-2xl">
        Test query
      </Link>
    </SafeAreaView>
  );
}
