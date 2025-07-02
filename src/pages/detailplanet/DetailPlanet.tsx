import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { fetchDetailPlanets } from "../../services/detailplanet/DetailPlanet";
import { ActivityIndicator, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RouteParams = {
  planetId: number;
};

type DetailPlanet = {
  created: string;
  edited: string;
  climate: string;
  surface_water: string;
  name: string;
  diameter: string;
  rotation_period: string;
  terrain: string;
  gravity: string;
  orbital_period: string;
  population: string;
  url: string;
};

export default function DetailPlanetScreen() {
  const route = useRoute();
  const { planetId } = route.params as RouteParams;

  const [detailPlanet, setDetailPlanet] = useState<DetailPlanet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadDetailPlanet(planetId);
  }, []);

  const loadDetailPlanet = async (planetId: number) => {
    try {
      const data = await fetchDetailPlanets(planetId);
      setDetailPlanet(data.result.properties);
    } catch (error) {
      console.error("Error fetching detail planets:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderRow = (label: string, value: string) => (
    <View style={styles.row}>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text style={styles.cellValue}>{value}</Text>
    </View>
  );

  const handleBookmark = async () => {
    try {
      const existing = await AsyncStorage.getItem("bookmarkedPlanets");
      const parsed: number[] = existing ? JSON.parse(existing) : [];

      if (!parsed.includes(planetId)) {
        parsed.push(planetId);
        await AsyncStorage.setItem("bookmarkedPlanets", JSON.stringify(parsed));
        Alert.alert("Success", "Planet bookmarked!");
      } else {
        Alert.alert("Info", "Planet already bookmarked.");
      }
    } catch (error) {
    Alert.alert("Error", "Something went wrong while bookmarking.");
    }
  };

  if (loading || !detailPlanet) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BFFF" />
        <Text>Loading detail planets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{detailPlanet.name}</Text>
      <View style={styles.table}>
        {renderRow("Climate", detailPlanet.climate)}
        {renderRow("Diameter", detailPlanet.diameter)}
        {renderRow("Gravity", detailPlanet.gravity)}
        {renderRow("Terrain", detailPlanet.terrain)}
        {renderRow("Surface Water", detailPlanet.surface_water)}
        {renderRow("Population", detailPlanet.population)}
        {renderRow("Rotation Period", detailPlanet.rotation_period)}
        {renderRow("Orbital Period", detailPlanet.orbital_period)}
        {renderRow("Created", detailPlanet.created)}
        {renderRow("Edited", detailPlanet.edited)}
      </View>
      <Button
        mode="contained"
        onPress={handleBookmark}
        style={{ marginTop: 16 }}
      >
        Bookmark
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f4f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  table: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cellLabel: {
    fontWeight: "bold",
    flex: 1,
    color: "#333",
  },
  cellValue: {
    flex: 1,
    textAlign: "right",
    color: "#555",
  },
});
