import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Marquee } from "@animatereactnative/marquee";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "./Data/Colors";

export default function BrandingMarquee() {
  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <Marquee spacing={60} speed={1.5}>
          <Text style={styles.text}>
            🍽️ Cravv – <Text style={styles.highlight}>Cook, Share, Explore</Text> 🍳  
            <Text style={styles.subText}>   •   Designed & Developed by CodeWithTarun 💻</Text>
          </Text>
        </Marquee>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#fffaf5", // soft warm cream
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    // elevation: 3,
    marginTop: 20,
    // borderWidth: 1,
    // borderColor: "#ffe3d4",
  },
  text: {
    fontWeight: "900",
    fontSize: 18,
    color: Colors.primary, // appetizing orange
    letterSpacing: 1,
  },
  highlight: {
    color: "#ff944d", // slightly lighter orange for emphasis
  },
  subText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#8e8e8e",
    letterSpacing: 0.5,
  },
});
