import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PlanetsScreen from "../pages/planetscreen/PlanetsScreen";
import DetailPlanet from "../pages/detailplanet/DetailPlanet";
import BookmarkScreen from "../pages/bookmarkscreen/BookmarkScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="PlanetsScreen">
                <Stack.Screen name="PlanetsScreen" component={PlanetsScreen} options={{ title: 'List Plannet' }}/>
                <Stack.Screen name="PlanetDetail" component={DetailPlanet} options={{ title: 'Detail Planet' }}/>
                <Stack.Screen name="Bookmarks" component={BookmarkScreen} options={{ title: 'Bookmark' }}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}