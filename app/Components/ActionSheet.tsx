import React, { useMemo, useRef, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import BottomSheet, {
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import { Colors } from "../Data/Colors";

type Recipe = {
  title: string;
  description: string;
  image?: string;
  onPress?: () => void;
};

type Props = {
  recipes: Recipe[];
  sheetRef: React.Ref<BottomSheet>;
  snapPoints?: string[];
};

export default function RecipeBottomSheet({
  recipes,
  sheetRef,
  snapPoints = ["50%", "80%"],
}: Props) {
  const handlePress = useCallback(
    (recipe: Recipe) => {
      recipe.onPress?.();
      sheetRef && sheetRef.current?.close();
    },
    [sheetRef]
  );

  const renderItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.image} />
      )}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <BottomSheet ref={sheetRef} index={-1} snapPoints={snapPoints}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Select Recipes 🍽️</Text>
      </View>
      <BottomSheetFlatList
        data={recipes}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
  },
  card: {
    marginVertical: 8,
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 12,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "900",
    color: Colors.text,
  },
  desc: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
    fontWeight: "700",
  },
});
