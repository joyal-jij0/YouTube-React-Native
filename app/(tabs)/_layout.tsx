import { Tabs } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
export default function TabsLayout() {
    return (
        <Tabs  screenOptions={{
            headerShown: false,
            tabBarStyle:{
                backgroundColor: "#1d1e24"

        }}}>
            <Tabs.Screen
                name='home'
                options={{
                    tabBarLabel: 'Home',
                    tabBarShowLabel: false,
                    tabBarIcon: ({focused}) => <AntDesign name="home" size={32} color={focused ? "#007aff": "white"} />
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    tabBarLabel: 'Profile',
                    tabBarShowLabel: false,
                    tabBarIcon:  ({focused}) => <FontAwesome name="user-o" size={32} color={focused ? "#007aff": "white"} />
                }}
            />
        </Tabs>
    )
}