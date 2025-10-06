import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../integrations/supabase/client";

import { SplashScreen } from "../components/SplashScreen";
import { Onboarding } from "../components/Onboarding";
import { AuthScreen } from "../components/AuthScreen";
import { ForgotPassword } from "../components/ForgotPassword";
import { ResetPassword } from "../components/ResetPassword";
import { Chat } from "../pages/Chat";
import { ChatHistory } from "../components/ChatHistory";
import { Settings } from "../components/Settings";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsOfService from "../pages/TermsOfService";

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  Chat: { sessionId?: string; initialPrompt?: string } | undefined;
  ChatHistory: undefined;
  Settings: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    checkInitialRoute();
  }, []);

  const checkInitialRoute = async () => {
    try {
      // Onboarding tamamlandı mı kontrol et
      const hasCompletedOnboarding = await AsyncStorage.getItem("hasCompletedOnboarding");
      
      // Kullanıcı giriş yapmış mı kontrol et
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!hasCompletedOnboarding) {
        // İlk kez açılıyor, onboarding göster
        setInitialRoute("Splash");
      } else if (!session) {
        // Onboarding yapılmış ama giriş yapılmamış
        setInitialRoute("Auth");
      } else {
        // Her şey tamam, direkt Chat'e git
        setInitialRoute("Chat");
      }
    } catch (error) {
      console.error("Initial route check error:", error);
      setInitialRoute("Splash");
    }
  };

  if (!initialRoute) {
    // Loading state - boş ekran göster
    return null;
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Splash"
        children={(props) => (
          <SplashScreen {...props} onComplete={() => props.navigation.navigate("Onboarding")} />
        )}
      />
      <Stack.Screen
        name="Onboarding"
        children={(props) => (
          <Onboarding {...props} onComplete={async () => {
            await AsyncStorage.setItem("hasCompletedOnboarding", "true");
            props.navigation.navigate("Auth");
          }} />
        )}
      />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="ChatHistory" component={ChatHistory} />
      <Stack.Screen
        name="Settings"
        children={(props) => (
          <Settings
            {...props}
            onBack={() => props.navigation.goBack()}
            onLogout={() => props.navigation.navigate("Auth")}
           
          />
        )}
      />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="TermsOfService" component={TermsOfService} />
    </Stack.Navigator>
  );
};
