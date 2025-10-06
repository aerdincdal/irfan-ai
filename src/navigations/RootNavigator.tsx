import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      const value = await AsyncStorage.getItem("hasOnboarded");
      setHasOnboarded(value === "true");
    };
    checkOnboarding();
  }, []);

  return (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Splash"
        children={(props) => (
          <SplashScreen
            {...props}
            onComplete={() => {
              if (hasOnboarded) {
                props.navigation.replace("Auth");
              } else {
                props.navigation.replace("Onboarding");
              }
            }}
          />
        )}
      />
      <Stack.Screen
        name="Onboarding"
        children={(props) => (
          <Onboarding
            {...props}
            onComplete={async () => {
              await AsyncStorage.setItem("hasOnboarded", "true");
              props.navigation.replace("Auth");
            }}
          />
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
