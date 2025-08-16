import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Marquee } from "@animatereactnative/marquee";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "./Data/Colors";
import { router } from "expo-router";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import Button from "./Components/Button";
import { useAuth } from "./Context/AuthContext";
import { Image } from "expo-image";

export default function Landing() {
  // useEffect(() => {
  //   setTimeout(() => {
  //     router.replace('/(auth)/SignUp')
  //   }, 1000);
  // }, []);

  const {LogIn} = useAuth()
  const [loading,setLoading] = useState(false)

  const handleGetStarted = ()=>{
setLoading(true)
LogIn()
setLoading(false)
//  router.replace('/(auth)/SignUp')
  }

  return (
    <GestureHandlerRootView>
      <View
        style={{
          // flex:1,
          backgroundColor: Colors.background,
        }}
      >
        <View
          style={
            {
              // height: 20
            }
          }
        >
          <Marquee spacing={20} speed={1}>
            <Image
              source={require("../assets/images/f1.png")}
              style={{
                height: 100,
                width: 100,
                // transform:[{rotate:'-14deg'}]
              }}
            />
          </Marquee>
          <Marquee spacing={20} speed={1}>
            <Image
              source={require("../assets/images/f2.png")}
              style={{
                height: 100,
                width: 100,
                // transform:[{rotate:'-14deg'}]
              }}
            />
          </Marquee>
          <Marquee spacing={20} speed={1}>
            <Image
              source={require("../assets/images/f3.png")}
              style={{
                height: 100,
                width: 100,
                // transform:[{rotate:'-14deg'}]
              }}
            />
          </Marquee>
          <Marquee spacing={20} speed={1}>
            <Image
              source={require("../assets/images/f4.png")}
              style={{
                height: 100,
                width: 100,
                // transform:[{rotate:'-14deg'}]
              }}
            />
          </Marquee>
        </View>
      </View>
      <View style={{
        backgroundColor:Colors.background
      }}>
        <Image
          // entering={FadeInRight.delay(1000).springify().damping(13)}
          source={require("../assets/images/splash.gif")}
          style={{
            height: 250,
            width: 250,
            margin: "auto",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.background,
          }}
          autoplay
          // loop
        />
      </View>
      <View
        style={{
          backgroundColor: Colors.background,
          flex: 1,
        }}
      >
        <Text
          style={{
            color: Colors.text,
            fontWeight: "900",
            textAlign: "center",
            marginTop: -30,
            fontSize: 20,
          }}
        >
          <Text
            style={{
              color: Colors.primary,
              fontWeight: "900",
              textAlign: "center",
              marginTop: 30,
              fontSize: 20,
            }}
          >
            Cravv
          </Text>{" "}
          – Feed Your Inner Foodie
        </Text>
      </View>
      <View style={{
        backgroundColor: Colors.background,
      marginBottom: 40
      }}>
        <Button title="Get Started" onPress={handleGetStarted} loading={loading}/>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});
