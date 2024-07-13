import React, { useState } from "react";
import { Alert, StyleSheet, View, AppState, SafeAreaView, TouchableOpacity } from "react-native";
import { supabase } from "../lib/supabase";
import { Button, Input } from "@rneui/themed";
import { useRouter } from "expo-router";


AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
    const router = useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
      router.replace('/')
      return
    }
    setLoading(false);
    router.replace('/home')
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error){
      Alert.alert(error.message);
      router.replace('/')
      return
    } 
    setLoading(false);
    router.replace('/home')
  }

  return (
    <SafeAreaView className="bg-[#1d1e24] flex-col h-full pt-32">
    <View className="mt-20 p-2">
      <View className="mt-5 p-1">
        <Input
          inputStyle={{color: "#C8C8C8" }}
          leftIcon={{ type: "font-awesome", name: "envelope", color: "#C8C8C8" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View className="p-1">
        <Input
          inputStyle={{color: "#C8C8C8" }}
          leftIcon={{ type: "font-awesome", name: "lock", color: "#C8C8C8" }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View className="pt-1 pb-1 mt-6">
        <Button
        buttonStyle={{ backgroundColor: "#007aff" }}
          title="Sign in"
          disabled={loading}
          onPress={() => signInWithEmail()}
        />
      </View>
      <View className="pt-1 pb-1 ">
        <Button
          buttonStyle={{ backgroundColor: "#007aff" }}
          title="Sign up"
          disabled={loading}
          onPress={() => signUpWithEmail()}
        />
      </View>
      <View className="pt-1 pb-1 ">
        <Button
          buttonStyle={{ backgroundColor: "#007aff" }}
          title="home"
          disabled={loading}
          onPress={() => router.replace('/home')}
        />
      </View>
    </View>
    </SafeAreaView>
  );
}

