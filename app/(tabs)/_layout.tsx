import React from "react";
import { Image, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { Colors } from "../Data/Colors";
import Feather from "@expo/vector-icons/Feather";

export default function RootLayout() {
  return (
    
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.text,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopWidth: 0,
          height: 75,
          elevation: 4,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 4,
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/i1.png")}
              style={[
                styles.icon,
                focused && styles.iconActive
              ]}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Explore"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/i2.png")}
              style={[
                styles.icon,
                focused && styles.iconActive
              ]}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Recipe"
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={require("../../assets/images/i3.png")}
              style={[
                styles.icon,
                focused && styles.iconActive
              ]}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({focused }) => (
            <Image
              source={require("../../assets/images/i4.png")}
              style={[
                styles.icon,
                focused && styles.iconActive
              ]}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 28,
    height: 28,
    opacity: 0.6,
  },
  iconActive: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
});
