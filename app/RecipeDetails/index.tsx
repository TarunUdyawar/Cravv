import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Colors } from "../Data/Colors";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../Config/FirebaseConfig";
import { useAuth } from "../Context/AuthContext";

export default function RecipeDetails() {
  const { Recipe } = useLocalSearchParams();
  const RecipeDetail = JSON.parse(Recipe as string);
  // console.log(RecipeDetail);
  const { user } = useAuth();

const handleSaveRecipe = async () => {
  try {
    if (!user) {
      alert("Please log in to save recipes.");
      return;
    }

    await setDoc(
      doc(firestore, "users", user.uid, "savedRecipes", RecipeDetail.id),
      {
        ...RecipeDetail,
        savedAt: new Date().toISOString(),
      }
    );

    alert("Recipe saved successfully! 💾");
  } catch (error) {
    console.error("Error saving recipe:", error);
    alert("Failed to save recipe.");
  }
};

  const handleShareRecipe = async () => {
  try {
    await Share.share({
      message: `🍲 ${RecipeDetail.name}\n\n🔥 ${RecipeDetail.calories} Calories\n⏱ ${RecipeDetail.cookTime} mins\n\nCheck out this recipe on Cravv!`,
    });
  } catch (error) {
    console.error("Error sharing:", error);
  }
};

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <Image
          source={{
            uri: RecipeDetail.imageUrl
          }}
          style={styles.recipeImage}
        />

{/* .replace(
              "ai-guru-lab-images/",
              "ai-guru-lab-images%2F"
            ), */}
     
        <Animated.View entering={FadeInDown.delay(500).springify().damping(20)}>
          <Animated.Text
            entering={FadeInRight.delay(600).springify().damping(12)}
            style={styles.title}
          >
            {RecipeDetail.name}
          </Animated.Text>

    
          <Animated.View
            entering={FadeInRight.delay(600).springify().damping(30)}
            style={styles.infoRow}
          >
            <Text style={styles.infoText}>
              🔥 {RecipeDetail.calories} Calories
            </Text>
            <Text style={styles.infoText}>⏱ {RecipeDetail.cookTime} mins</Text>
            <Text style={styles.infoText}>🍽 Serves {RecipeDetail.serveTo}</Text>
          </Animated.View>

          <Text style={styles.sectionTitle}>🛒 Ingredients</Text>
          {RecipeDetail.ingredients.map((item: any, index: number) => (
            <View key={index} style={styles.ingredientItem}>
              <Text style={styles.ingredientIcon}>{item.icon}</Text>
              <Text style={styles.ingredientText}>
                {item.quantity} {item.ingredient}
              </Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>📖 Instructions</Text>
          {RecipeDetail.steps.map((step: string, index: number) => (
            <View key={index} style={styles.stepItem}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </Animated.View>
        <View style={styles.buttonRow}>
  <TouchableOpacity style={styles.saveBtn} onPress={handleSaveRecipe}>
    <Text style={styles.btnText}>💾 Save</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.shareBtn} onPress={handleShareRecipe}>
    <Text style={styles.btnText}>📤 Share</Text>
  </TouchableOpacity>
</View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
  },
  recipeImage: {
    width: "100%",
    height: 250,
    borderRadius: 15,
      marginTop: Platform.OS=='ios' ? 10:35,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.text,
    marginTop: 15,
  },
  infoRow: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "space-between",
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 12,
  },
  infoText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginTop: 20,
    marginBottom: 10,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  ingredientIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  ingredientText: {
    color: Colors.text,
    fontSize: 16,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 10,
  },
  stepNumber: {
    backgroundColor: Colors.primary,
    color: "#fff",
    fontWeight: "bold",
    borderRadius: 50,
    width: 26,
    height: 26,
    textAlign: "center",
    lineHeight: 26,
    marginRight: 10,
  },
  stepText: {
    flex: 1,
    color: Colors.text,
    fontSize: 15,
  },
  buttonRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginVertical: 20,
  paddingBottom: Platform.OS=='android' ? 20: 0
},
saveBtn: {
  flex: 1,
  backgroundColor: Colors.primary,
  padding: 12,
  borderRadius: 10,
  marginRight: 8,
  alignItems: "center",
},
shareBtn: {
  flex: 1,
  backgroundColor: Colors.primary,
  padding: 12,
  borderRadius: 10,
  marginLeft: 8,
  alignItems: "center",
},
btnText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 16,
},

});
