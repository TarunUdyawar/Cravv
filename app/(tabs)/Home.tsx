import React, { useRef, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../Data/Colors";
import { useAuth } from "../Context/AuthContext";
import "react-native-url-polyfill/auto";
import { run } from "../Services/AiApi";
import { setDoc, doc } from "firebase/firestore";
import { firestore } from "../Config/FirebaseConfig";
import { router } from "expo-router";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import BrandingMarquee from "../BrandingMarquee";

global.Blob = Blob;

const getPollinationsImageUrl = (prompt: string, width = 512, height = 512) => {
  const baseUrl = "https://pollinations.ai/p/";
  const encodedPrompt = encodeURIComponent(prompt);
  return `${baseUrl}${encodedPrompt}?width=${width}&height=${height}`;
};

export default function Home() {
  const { user } = useAuth();
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRecipe, setShowRecipe] = useState<any[]>([]);
  const [fullRecipe, setFullRecipe] = useState<any>(null);

  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["50%", "80%"];

  const categories = [
    { name: "Breakfast", icon: require("../../assets/images/breakfast.png") },
    { name: "Lunch", icon: require("../../assets/images/lunch.png") },
    { name: "Salad", icon: require("../../assets/images/salad.png") },
    { name: "Dinner", icon: require("../../assets/images/dinner.png") },
    { name: "Dessert", icon: require("../../assets/images/dessert.png") },
    { name: "Drink", icon: require("../../assets/images/drink.png") },
  ];

  const generateRecipe = async () => {
    if (!userInput.trim()) {
      Alert.alert("Error", "Please enter ingredients or a recipe idea.");
      return;
    }

    const prompt = `
You are a strict JSON generator. Output ONLY valid JSON.
Generate 5 unique variations of the dish "${userInput}".
[
  {"name": "Variation 1 Name", "description": "Short description of this variation"},
  {"name": "Variation 2 Name", "description": "Short description of this variation"},
  {"name": "Variation 3 Name", "description": "Short description of this variation"}
  {"name": "Variation 4 Name", "description": "Short description of this variation"}
  {"name": "Variation 5 Name", "description": "Short description of this variation"}
]
`;

    setLoading(true);
    setTimeout(async () => {
      try {
        const result = await run(prompt);
        if (!result) {
          Alert.alert("AI Error", "No response from AI.");
          return;
        }

        let parsed;
        try {
          parsed = JSON.parse(result.trim());
        } catch {
          const match = result.match(/\[.*\]/s);
          if (match) parsed = JSON.parse(match[0]);
          else {
            Alert.alert("Error", "No valid JSON found in AI response.");
            return;
          }
        }

        setShowRecipe(parsed);
        sheetRef.current?.expand();
      } catch (err: any) {
        Alert.alert("Error", err?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }, 0);
  };

  const generateFullRecipe = async (option: any) => {
    sheetRef.current?.close();

    const PROMPT = `
You are a strict JSON generator. Output ONLY valid JSON.
Recipe Name: ${option?.name}
Description: ${option?.description}
GENERATE_COMPLETE_RECIPE:
{
"name" : Name of the Recipe,
"category": "Breakfast | Lunch | Dinner | Salad | Drink | Dessert",
"ingredients": [
  { "ingredient": "string", "icon": "emoji", "quantity": "string" }
],
"steps": ["Step 1", "Step 2", "..."],
"calories": number,
"cookTime": number,
"serveTo": number,
"imagePrompt": "string"
}
`;

    try {
      setLoading(true);
      const result = await run(PROMPT);
      if (!result) {
        Alert.alert(
          "AI Error",
          "No response from AI. Check API key or rate limits."
        );
        return;
      }

      let parsed;
      try {
        parsed = JSON.parse(result.trim());
      } catch {
        const match = result.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
        else {
          Alert.alert("Error", "No valid JSON found in AI response.");
          return;
        }
      }

      parsed.imageUrl = getPollinationsImageUrl(parsed.imagePrompt, 512, 512);
      setFullRecipe(parsed);
      saveRecipeToDB(parsed);

      router.push({
        pathname: "/RecipeDetails",
        params: { Recipe: JSON.stringify(parsed) },
      });
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const saveRecipeToDB = async (parsed: any) => {
    try {
      await setDoc(doc(firestore, "recipes", parsed?.imagePrompt), {
        name: parsed?.name,
        category: parsed?.category,
        ingredients: parsed?.ingredients || [],
        steps: parsed?.steps || [],
        calories: parsed?.calories || 0,
        cookTime: parsed?.cookTime || 0,
        serveTo: parsed?.serveTo || 0,
        imagePrompt: parsed?.imagePrompt || "",
        imageUrl: parsed?.imageUrl || "",
        createdAt: new Date().toISOString(),
        createdBy: user?.uid || null,
      });
    } catch (error) {
      console.error("Error saving recipe to Firestore:", error);
    }
  };

  const renderRecipeItem = useCallback(
    ({ item }: { item: any }) => (
      <TouchableOpacity
        style={styles.recipeCard}
        onPress={() => generateFullRecipe(item)}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.recipeTitle}>{item.name}</Text>
          <Text style={styles.recipeDesc}>{item.description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
      </TouchableOpacity>
    ),
    []
  );

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <SafeAreaView>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.welcome}>Hi, {user?.name} 👋</Text>
            {user?.image ? (
              <Image source={{ uri: user.image }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="person" size={22} color="#fff" />
              </View>
            )}
          </View>

          {/* Recipe Input */}
          <View style={styles.inputCard}>
            <Image
              source={require("../../assets/images/pan.gif")}
              style={styles.gifImage}
              contentFit="contain"
              autoplay
            />
            <Text style={styles.cardTitle}>
              Tell us your idea, we’ll cook the recipe.
            </Text>
            <Text style={styles.label}>Enter Ingredients or Recipe Idea</Text>
            <TextInput
              placeholder="E.g. chicken, garlic, butter..."
              placeholderTextColor="#999"
              style={styles.input}
              value={userInput}
              onChangeText={setUserInput}
            />
            <TouchableOpacity
              style={styles.generateBtn}
              onPress={generateRecipe}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="sparkles" size={18} color="#fff" />
                  <Text style={styles.generateText}>Generate Recipe</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categories}>
            {categories.map((cat, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.categoryCard}
                onPress={() =>
                  router.push({
                    pathname: "/Recipe-By-Category",
                    params: { categoryName: cat?.name },
                  })
                }
              >
                <Image source={cat.icon} style={styles.categoryImage} />
                <Text style={styles.categoryText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <BrandingMarquee />
        </SafeAreaView>
      </ScrollView>

      {/* Gorhom Bottom Sheet */}
      <BottomSheet ref={sheetRef} index={-1} snapPoints={snapPoints}>
        <View style={{ padding: 16 }}>
          <Text style={styles.sheetTitle}>Select Recipes 🍽️</Text>
        </View>
        <BottomSheetFlatList
          data={showRecipe}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={renderRecipeItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        />
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Platform.OS == "ios" ? 20 : 35,
    marginBottom: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
    lineHeight: 32,
    letterSpacing: 0.5,
  },
  profileImage: { width: 40, height: 40, borderRadius: 20 },
  placeholderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  inputCard: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 24,
  },
  gifImage: { height: 100, width: 100, alignSelf: "center", marginTop: -10 },
  cardTitle: {
    fontWeight: "900",
    fontSize: 15,
    textAlign: "center",
    marginVertical: 8,
  },
  label: { fontSize: 14, color: Colors.text, marginBottom: 8 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
    fontSize: 14,
    color: Colors.text,
  },
  generateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  generateText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
    color: Colors.text,
    lineHeight: 28,
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryCard: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    backgroundColor: Colors.card,
    height: "100%",
  },
  categoryImage: { width: 60, height: 60, resizeMode: "contain" },
  categoryText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.text,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
    color: Colors.text,
    lineHeight: 26,
  },
  recipeCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#eee",
    gap: 10,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    lineHeight: 22,
  },
  recipeDesc: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
    fontWeight: "500",
    lineHeight: 18,
  },
});
