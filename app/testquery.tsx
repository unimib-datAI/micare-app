import React from "react";
import { useQuery } from "@tanstack/react-query";
import { View, Text } from "react-native";
import { Link } from "expo-router";

const fetchUser = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
  return response.json();
};

export default function UserComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      <Text>Name: {data.name}</Text>
      <Text>Email: {data.email}</Text>
      <Link href="/" className="text-blue-600 text-2xl">
        Back
      </Link>
    </View>
  );
}
