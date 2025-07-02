import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchDetailPlanets } from '../../services/detailplanet/DetailPlanet';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Planet = {
  name: string;
  climate: string;
  uid: string;
};

type RootStackParamList = {
  PlanetsScreen: undefined;
  PlanetDetail: { planetId: string };
};

export default function BookmarkScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [bookmarkedPlanets, setBookmarkedPlanets] = useState<Planet[]>([]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const stored = await AsyncStorage.getItem('bookmarkedPlanets');
      const ids: number[] = stored ? JSON.parse(stored) : [];

      const planetPromises = ids.map(async (id) => {
        const data = await fetchDetailPlanets(id);
        return {
          name: data.result.properties.name,
          climate: data.result.properties.climate,
          uid: data.result.uid
        };
      });

      const planets = await Promise.all(planetPromises);
      setBookmarkedPlanets(planets);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const renderItem = ({ item }: { item: Planet }) => (
    <TouchableOpacity onPress={() => navigation.navigate('PlanetDetail', { planetId: item.uid })}>
      <Card style={styles.card}>
        <Card.Title title={item.name} />
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookmarked Planets</Text>
      <FlatList
        data={bookmarkedPlanets}
        keyExtractor={(item) => item.uid}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 3,
  },
});
