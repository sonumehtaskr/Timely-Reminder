import { useColorScheme } from 'react-native';

import { Stack } from "expo-router";

// SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (<>
    {/* <AnimatedSplashOverlay /> */}
    <Stack initialRouteName='index' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="add-reminder"
        // options={{
        //   presentation: 'fullScreenModal',
        // }}
      />
    </Stack>
  </>
  );
}
