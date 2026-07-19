import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppProvider, useApp } from '@/src/store/AppContext';
import { colors } from '@/src/theme/colors';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

function RootNav() {
  const { hydrated } = useApp();

  useEffect(() => {
    if (hydrated) SplashScreen.hideAsync();
  }, [hydrated]);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.navy }}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="splash" />
        <Stack.Screen name="language" />
        <Stack.Screen name="home" />
        <Stack.Screen name="company" />
        <Stack.Screen name="future" />
        <Stack.Screen name="anthem" />
        <Stack.Screen name="contact" />
        <Stack.Screen name="guide" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="consent" />
        <Stack.Screen name="registration-intro" />
        <Stack.Screen name="registration" />
        <Stack.Screen name="confirmation" />
        <Stack.Screen name="otp" />
        <Stack.Screen name="success" />
        <Stack.Screen name="learn" />
        <Stack.Screen name="support" />
        <Stack.Screen name="job/[id]" />
        <Stack.Screen name="apply/[id]" />
        <Stack.Screen name="(main)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <RootNav />
      </AppProvider>
    </GestureHandlerRootView>
  );
}
