import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "../Data/Colors";
import CravvInputField from "../Components/CravvInputField";
import Button from "../Components/Button";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../Context/AuthContext";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
} from "react-native-reanimated";
import { router } from "expo-router";

export default function SignUp() {
  const { SignUp: signup } = useAuth();

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);

  const uploadToCloudinary = async (image: string) => {
    let form = new FormData();
    form.append("file", {
      uri: image,
      name: "profile.jpg",
      type: "image/jpeg",
    } as any);
    form.append("upload_preset", "UniVibe");

    try {
      let response = await fetch(
        "https://api.cloudinary.com/v1_1/dlykbkq5h/image/upload",
        {
          method: "POST",
          body: form,
        }
      );
      if (response) {
        let data = await response.json();
        return data?.secure_url;
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleSignUp = async () => {
    try {
      if (!name || !email || !password) {
        Alert.alert("Sign Up", "Fill all the Details");
        return;
      }
      setLoading(true);
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadToCloudinary(image);
        if (!imageUrl) {
          Alert.alert("Signup", "Image upload failed");
          setLoading(false);
          return;
        }
      }
      await signup(email, password, name, imageUrl);
      setLoading(false);
    } catch (error: any) {
      console.log(error.message);
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.Text
            entering={FadeInDown.delay(500).springify().damping(20)}
            style={{
              color: Colors.text,
              fontWeight: "900",
              fontSize: 20,
              marginTop: Platform.OS == "ios" ? 25 : 60,
              textAlign: "center",
            }}
          >
            Unlock the Magic of Every Meal.
          </Animated.Text>

          {/* Profile Image */}
          <Animated.View
            entering={FadeIn.delay(700)}
            style={{ position: "relative", alignItems: "center" }}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 99,
                  marginTop: 40,
                }}
              />
            ) : (
              <>
                <Image
                  source={require("../../assets/images/profile.png")}
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 99,
                    marginTop: 40,
                  }}
                />
                <TouchableOpacity
                  onPress={pickImage}
                  style={{
                    position: "absolute",
                    bottom: 10,
                    backgroundColor: Colors.primary,
                    borderRadius: 20,
                    height: 28,
                    width: 28,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 2,
                    borderColor: Colors.background,
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>

          {/* Form Fields */}
          <Animated.View
            entering={FadeInRight.delay(1000)}
            style={{ width: "100%", paddingHorizontal: 20 }}
          >
            <CravvInputField
              label="Enter Your Name"
              onChangeText={(e) => setName(e)}
            />
            <CravvInputField
              label="Enter Your Email"
              onChangeText={(e) => setEmail(e)}
            />
            <CravvInputField
              label="Enter Your Password"
              onChangeText={(e) => setPassword(e)}
              password
            />
            <Button title="Sign Up" onPress={handleSignUp} loading={loading} />

            <View style={{ marginTop: -40 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "900",
                  textAlign: "center",
                }}
              >
                Already Have An Account?{" "}
                <Text
                  style={{
                    color: Colors.primary,
                    fontWeight: "900",
                    fontSize: 15,
                  }}
                  onPress={() => router.replace("/(auth)/SignIn")}
                >
                  Sign In
                </Text>
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({});
