import { ActivityIndicator, FlatList, Image, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Colors } from "../Data/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../Config/FirebaseConfig";
import { LinearGradient } from "expo-linear-gradient";

export default function RecipeByCategory() {
  const { categoryName } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);

 useEffect(()=>{
     const fetchRecipe = async()=>{
    try {
        const q = query(collection(firestore,'recipes'),where('category','==',categoryName))
        const querySnapshot = await getDocs(q)
        let data = [];
         querySnapshot.forEach((doc)=>{
            data.push({id : doc.id,...doc.data()})
         })
         setRecipes(data)
        //  console.log(data)
        }
     catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipe()
 },[categoryName])

  const renderRecipeCard = ({ item }) => (
   <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={()=>router.push({
    pathname : '/RecipeDetails',
    params : {
      Recipe : JSON.stringify(item)
    }
   })}>
    <Image source={{ uri: item.imageUrl }} style={styles.image} />
    
    {/* Gradient Overlay */}
    <LinearGradient
      colors={["transparent", "rgba(0,0,0,0.6)"]}
      style={styles.gradientOverlay}
    />

    {/* Text */}
    <Text style={styles.cardTitle} numberOfLines={2}>
      {item.name}
    </Text>
  </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      
    <View style={styles.headerRow}>
  <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
    <Ionicons name="chevron-back" size={22} color={Colors.primary} />
  </TouchableOpacity>

  <View style={styles.categoryBadge}>
    <Ionicons name="fast-food-outline" size={18} color={Colors.primary} />
    <Text style={styles.headerTitle}>{categoryName} Recipes</Text>
  </View>
</View>


      {loading ? (
        <ActivityIndicator size="large" color={Colors.accent} style={{ marginTop: 30 }} />
      ) : recipes.length === 0 ? (
        <Text style={styles.noData}>No recipes found in this category</Text>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={renderRecipeCard}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" ,margin: 10,marginBottom:'-10'}}
          showsVerticalScrollIndicator={false}
          
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent:'flex-start',
    marginLeft :20,
      marginTop: Platform.OS=='ios' ? 0:35,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.card,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginLeft: 8,
   
  },
  noData: {
    textAlign: "center",
    color: Colors.text,
    fontSize: 16,
    marginTop: 40,
    fontWeight:'900'
  },
  card: {
  width: "48%",
  borderRadius: 18,
  overflow: "hidden",
  backgroundColor: Colors.card,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 6,
  elevation: 4,
  marginBottom: 18,
  transform: [{ scale: 1 }],
  
},
image: {
  width: "100%",
  height: 180,
  resizeMode: "cover",
},
gradientOverlay: {
  ...StyleSheet.absoluteFillObject,
  justifyContent: "flex-end",
  padding: 10,
},
cardTitle: {
  position: "absolute",
  bottom: 12,
  left: 10,
  right: 10,
  fontSize: 15,
  fontWeight: "700",
  color: "#fff",
  lineHeight: 20,
  textShadowColor: "rgba(0,0,0,0.4)",
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 3,
},

  categoryBadge: {
  flexDirection: "row",
  alignItems: "center",
//   backgroundColor: Colors.card,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 20,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 3,
  elevation: 2,
  marginLeft: 10,
},


});
