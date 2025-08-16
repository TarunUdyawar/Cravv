import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "../Data/Colors";
import Animated, { FadeIn, FadeInDown, FadeInRight } from "react-native-reanimated";
import CravvInputField from "../Components/CravvInputField";
import Button from "../Components/Button";
import { router } from "expo-router";
import { useAuth } from "../Context/AuthContext";

export default function SignIn() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const { SignIn: signin } = useAuth();

  const handleSignIn = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Sign In", "Fill all the Details");
        return;
      }
      setLoading(true);
      await signin(email, password);
      setLoading(false);
    } catch (error: any) {
      let msg = error.message;
      console.log(msg);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.Text
            entering={FadeInDown.delay(500).springify().damping(20)}
            style={{
              color: Colors.text,
              fontWeight: "900",
              fontSize: 20,
              marginTop: Platform.OS === "ios" ? 25 : 60,
              textAlign: "center",
            }}
          >
            Crave it. Cook it. Love it
          </Animated.Text>

          <Animated.View
            entering={FadeIn.delay(700)}
            style={{ position: "relative", alignItems: "center" }}
          >
            <Image
              source={require("../../assets/images/chef.png")}
              style={{
                height: 350,
                width: 250,
              }}
            />
          </Animated.View>

          <Animated.View entering={FadeInRight.delay(1000)} style={{ width: "90%" }}>
            <CravvInputField
              label="Enter Your Email"
              onChangeText={(e) => setEmail(e)}
            />
            <CravvInputField
              label="Enter Your Password"
              onChangeText={(e) => setPassword(e)}
              password
            />
            <Button title="Sign In" onPress={handleSignIn} loading={loading} />

            <View style={{ marginTop: -40 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "900",
                  textAlign: "center",
                }}
              >
                Don't Have An Account?{" "}
                <Text
                  style={{
                    color: Colors.primary,
                    fontWeight: "900",
                    fontSize: 15,
                  }}
                  onPress={() => router.replace("/(auth)/SignUp")}
                >
                  Sign Up
                </Text>
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
