import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../Data/Colors";
import { collection, doc, getDocs } from "firebase/firestore";
import { firestore } from "../Config/FirebaseConfig";
import { router } from "expo-router";

export default function Explore() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllRecipes();
  }, []);
  const fetchAllRecipes = async () => {
    try {
      setLoading(true);
      const docSnap = await getDocs(collection(firestore, "recipes"));
      let data = [];
      docSnap.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setRecipes(data);
      setLoading(false);
      // console.log(recipes);
    } catch (error: any) {
      console.log(error.message);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🍽️ Browse Recipes</Text>
      <FlatList
        data={recipes}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={fetchAllRecipes}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/RecipeDetails",
                params: { Recipe: JSON.stringify(item) },
              })
            }
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={styles.title}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.text,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: "center",
    marginBottom: 20,
      marginTop: Platform.OS=='ios' ? 0:35,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 180,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
  },
});
