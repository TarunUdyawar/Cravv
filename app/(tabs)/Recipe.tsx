import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Platform,
} from "react-native";
import { useAuth } from "../Context/AuthContext";
import { firestore } from "../Config/FirebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Colors } from "../Data/Colors";
import { useRouter } from "expo-router";

export default function SavedRecipes() {
  const { user } = useAuth();
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true); // initial loading
  const [refreshing, setRefreshing] = useState(false); // pull-to-refresh state

  const loadRecipes = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true); // only show big loader when not refreshing
    try {
      const snap = await getDocs(
        collection(firestore, "users", user.uid, "savedRecipes")
      );
      setRecipes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    }
    if (isRefresh) setRefreshing(false);
    if (!isRefresh) setLoading(false);
  };

  const removeRecipe = async (id) => {
    await deleteDoc(doc(firestore, "users", user.uid, "savedRecipes", id));
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  if (loading) return <Loader />;
  if (!recipes.length) return <Empty />;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>💾 Saved Recipes</Text>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
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
            <Image
              source={{
                uri: item.imageUrl.replace(
                  "ai-guru-lab-images/",
                  "ai-guru-lab-images%2F"
                ),
              }}
              style={styles.image}
            />
            <View style={styles.info}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.meta}>
                ⏱ {item.cookTime} min | 🔥 {item.calories} cal
              </Text>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeRecipe(item.id)}
              >
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadRecipes(true);
            }}
            colors={[Colors.primary]}
          />
        }
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}

const Loader = () => (
  <View style={styles.center}>
    <ActivityIndicator size="large" color={Colors.primary} />
  </View>
);

const Empty = () => (
  <View style={styles.center}>
    <Text style={styles.emptyText}>💾 No saved recipes yet!</Text>
    <Text style={styles.subText}>Save recipes to see them here.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  emptyText: { fontSize: 18, fontWeight: "bold", color: Colors.primary },
  subText: { fontSize: 14, color: "#666", marginTop: 5 },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.text,
    textAlign: "center",
    marginVertical: 20,
      marginTop: Platform.OS=='ios' ? 0:35,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 2,
  },
  image: { width: "100%", height: 180 },
  info: { padding: 12 },
  title: { fontSize: 18, fontWeight: "bold", color: "#333" },
  meta: { fontSize: 14, color: "#666", marginVertical: 4 },
  removeBtn: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
  },
  removeText: { color: "#fff", fontWeight: "bold" },
});
