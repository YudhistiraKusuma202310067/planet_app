import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Button, Card } from "react-native-paper";
import { fetchDataPlanets } from "../../services/planetscreen/PlanetsScreenService";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SearchBar } from "react-native-elements";


type Planet = {
  uid: string;
  name: string;
  url: string;
};

type RootStackParamList = {
  PlanetsScreen: undefined;
  PlanetDetail: { planetId: string };
};

export default function PlanetsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [planets, setPlanets] = useState<Planet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPlanets();
  }, []);

  const fetchPlanets = async () => {
    try {
      const data = await fetchDataPlanets();
      setPlanets(data.results);
    } catch (error) {
      console.error("Error fetching planets:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderPlanetCard = ({ item }: { item: Planet }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("PlanetDetail", { planetId: item.uid })
      }
    >
      <Card style={styles.card}>
        <Card.Title title={item.name} />
      </Card>
    </TouchableOpacity>
  );

  // const updateSearch = (data : string) => {
  //   planets.filter((planet) => planet.name == '%'data
  // }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BFFF" />
        <Text>Loading planets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("Bookmarks")}
        style={{ marginBottom: 16 }}
      >
        Go to Bookmarks
      </Button>

      {/* <SearchBar
        placeholder="Type Here..."
        onChangeText={this.updateSearch(data)}
        // value={search}
      /> */}

      <FlatList
        data={planets}
        keyExtractor={(item) => item.uid}
        renderItem={renderPlanetCard}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
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
    marginBottom: 10,
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
});
