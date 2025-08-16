import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Colors } from "../Data/Colors";
import { useAuth } from "../Context/AuthContext";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { auth } from "../Config/FirebaseConfig";
import { router } from "expo-router";

export default function ProfileScreen() {
  const { user } = useAuth();
  console.log(user);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/(auth)/SignIn')
  };

  const handleNav = async()=>{
     Alert.alert('Logout', 'Are You Sure You Want to Logout',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Logout', style: 'destructive',onPress:()=> handleLogout()}
      ]
    )
  }

  const menuItems = [
    {
      title: "Create New Recipe",
      icon: <AntDesign name="pluscircleo" size={22} color={Colors.primary} />,
      onPress: () => router.replace('/(tabs)/Home'),
    },
    {
      title: "My Recipes",
      icon: <Feather name="book-open" size={22} color={Colors.primary} />,
      onPress: () => router.replace('/(tabs)/Recipe')
    },
    {
      title: "Browse More Recipes",
      icon: (
        <MaterialCommunityIcons
          name="magnify"
          size={22}
          color={Colors.primary}
        />
      ),
      onPress: () => router.replace('/(tabs)/Explore')
    },
    {
      title: "Logout",
      icon: <AntDesign name="logout" size={22} color={Colors.primary} />,
      onPress : handleNav
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: user?.image,
          }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{user?.name || "User"}</Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            {item.icon}
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 40,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    color: Colors.text,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
  },
  menu: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
    color: Colors.text,
  },
});
