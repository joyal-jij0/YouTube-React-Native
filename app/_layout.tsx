import {Stack} from 'expo-router'

export default function RootLayout(){
    return(
        <Stack>
            <Stack.Screen name="index" options={{headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{headerShown: false}} />
            <Stack.Screen name="playback/[id]" options={{headerShown: false}}/>
            <Stack.Screen name="search/index" options={{headerShown: false}} />
        </Stack>
    )
}