import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Image,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CheckBox from "expo-checkbox";

import { useAuth } from "../hooks/useAuth";

const irfanLogo = require("../assets/irfan-logo.png");
const googleIcon = require("../assets/social.png");

export const AuthScreen = ({ navigation }: any) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { signIn, signUp, signInWithGoogle, loading } = useAuth();

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 4000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 4000, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  const handleSubmit = useCallback(async () => {
    if (isSignUp && !acceptedTerms) {
      Alert.alert("Hata", "Lütfen Gizlilik Politikası ve Kullanım Koşullarını kabul edin.", [
        { text: "Tamam" },
      ]);
      return;
    }

    if (!email.trim() || !password.trim()) return;

    if (isSignUp && password.length < 6) {
      Alert.alert("Hata", "Şifre en az 6 karakter olmalıdır", [{ text: "Tamam" }]);
      return;
    }

    try {
      const { error } = isSignUp ? await signUp(email, password) : await signIn(email, password);

      if (!error) {
        navigation.navigate("Chat");
      } else {
        const msg = (error.message || "").toLowerCase();
        let errorMessage = "Bir hata oluştu";

        if (msg.includes("invalid login credentials")) errorMessage = "Geçersiz giriş bilgileri";
        else if (msg.includes("user not found")) errorMessage = "Kullanıcı bulunamadı";
        else if (msg.includes("wrong password")) errorMessage = "Hatalı şifre";
        else if (msg.includes("email already in use")) errorMessage = "Bu e-posta zaten kullanılıyor";
        else if (msg.includes("weak password")) errorMessage = "Şifre çok zayıf";
        else if (msg.length > 0) errorMessage = error.message;

        Alert.alert("Hata", errorMessage, [{ text: "Tamam" }]);
      }
    } catch (err: any) {
      Alert.alert("Hata", err.message || "Bir hata oluştu", [{ text: "Tamam" }]);
    }
  }, [email, password, isSignUp, acceptedTerms, signIn, signUp, navigation]);

  const handleForgotPassword = useCallback(() => {
    navigation.navigate("ForgotPassword");
  }, [navigation]);

  const isDisabled = loading || !email.trim() || !password.trim();

  return (
    <>
      <StatusBar style="light" hidden={false} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContentContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <View style={styles.headerContainer}>
                <View style={styles.logoContainer}>
                  <Animated.View
                    style={[
                      styles.glowEffect,
                      {
                        opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] }),
                        transform: [
                          {
                            scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }),
                          },
                        ],
                      },
                    ]}
                  />
                  <Image source={irfanLogo} style={styles.logo} resizeMode="contain" />
                </View>
                <Label style={styles.arabicTitle}>بسم الله الرحمن الرحيم</Label>
                <Label style={styles.subtitle}>
                  {isSignUp ? "Yeni hesap oluşturun" : "Hesabınıza giriş yapın"}
                </Label>
              </View>

              <View style={styles.inputsWrapper}>
                <View style={styles.authInputGroup}>
                  <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons name="email" size={20} color="#666" style={styles.inputIcon} />
                    <Input
                      placeholder="E-posta adresi"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                      style={styles.input}
                    />
                  </View>

                  <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
                    <Input
                      placeholder="Şifre"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      style={styles.input}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showHideButton}>
                      <MaterialCommunityIcons name={showPassword ? "eye-off" : "eye"} size={20} color="#666" />
                    </TouchableOpacity>
                  </View>

                  {!isSignUp && (
                    <View style={styles.forgotWrapper}>
                      <Button variant="link" size="default" onPress={handleForgotPassword} textStyle={styles.forgotText}>
                        Şifremi Unuttum
                      </Button>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.authOptionsContainer}>
                <Button
                  variant="default"
                  size="lg"
                  onPress={handleSubmit}
                  disabled={isDisabled}
                  style={isDisabled ? [styles.button, styles.buttonDisabled] : styles.button}
                  textStyle={styles.buttonText}
                >
                  {loading ? <ActivityIndicator color="#CCC" /> : isSignUp ? "Hesap Oluştur" : "Giriş Yap"}
                </Button>

                <View style={styles.dividerWithText}>
                  <View style={styles.line} />
                  <Label style={styles.orText}>veya</Label>
                  <View style={styles.line} />
                </View>

                <TouchableOpacity
                  style={styles.googleButton}
                  onPress={async () => {
                    const { error } = await signInWithGoogle();
                    if (error) Alert.alert("Hata", "Google ile giriş yapılamadı.", [{ text: "Tamam" }]);
                  }}
                  disabled={loading}
                >
                  <Image source={googleIcon} style={{ width: 20, height: 20, marginRight: 8 }} />
                  <Label style={styles.googleButtonText}>
                    Google {isSignUp ? "ile Kayıt Ol" : "ile Giriş Yap"}
                  </Label>
                </TouchableOpacity>
              </View>

              <View style={styles.bottomContainer}>
                <Button variant="link" size="default" onPress={() => setIsSignUp(!isSignUp)} textStyle={styles.toggleText}>
                  {isSignUp ? "Zaten hesabınız var mı? Giriş yapın" : "Hesabınız yok mu? Kayıt olun"}
                </Button>

                {isSignUp && (
                  <View style={{ marginTop: 25, alignItems: "center", paddingHorizontal: 31 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <CheckBox
                        value={acceptedTerms}
                        onValueChange={setAcceptedTerms}
                        color={acceptedTerms ? "#F2AE30" : "#666"}
                        style={styles.checkbox}
                      />
                      <Text style={{ color: "#666", fontSize: 10, marginLeft: 8, flex: 1 }}>
                        Kayıt olarak{" "}
                        <Text
                          style={{ color: "#ccc", textDecorationLine: "underline" }}
                          onPress={() => navigation.navigate("PrivacyPolicy")}
                        >
                          Gizlilik Politikası
                        </Text>{" "}
                        ve{" "}
                        <Text
                          style={{ color: "#ccc", textDecorationLine: "underline" }}
                          onPress={() => navigation.navigate("TermsOfService")}
                        >
                          Kullanım Koşulları
                        </Text>{" "}
                        ’nı kabul etmiş olursunuz.
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },
  flex: { flex: 1 },
  scrollContentContainer: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 20 },
  container: { flex: 1, justifyContent: "center", backgroundColor: "#000" },
  headerContainer: { marginTop: 40 },
  logoContainer: { alignSelf: "center", justifyContent: "center", alignItems: "center", marginBottom: 30 },
  glowEffect: { position: "absolute", width: 110, height: 110, borderRadius: 20, backgroundColor: "#F2AE30", shadowColor: "#F2AE30", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 25, elevation: 20 },
  logo: { width: 100, height: 100, borderRadius: 18 },
  arabicTitle: { fontSize: 24, fontWeight: "bold", textAlign: "center", color: "#F2AE30", fontFamily: "Arial", marginBottom: 20 },
  subtitle: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 24 },
  inputsWrapper: { marginTop: 20 },
  authInputGroup: { marginBottom: 16 },
  inputWrapper: { flexDirection: "row", alignItems: "center", borderColor: "#2e2e2e", borderWidth: 1, borderRadius: 16, marginBottom: 12, paddingHorizontal: 14, backgroundColor: "#000" },
  inputIcon: { marginRight: -5 },
  input: { color: "#CCC", flex: 1, height: 44, backgroundColor: "transparent", borderWidth: 0, padding: 0 },
  showHideButton: { paddingHorizontal: 8 },
  forgotWrapper: { alignSelf: "flex-end", marginBottom: 15, marginRight: 2 },
  forgotText: { color: "#666", fontSize: 12, marginTop: -25 },
  authOptionsContainer: { alignItems: "center", marginTop: -14, marginBottom: 10 },
  button: { borderRadius: 18, backgroundColor: "#F2AE30", borderColor: "gray", width: "80%" },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: "#FFF", fontWeight: "600", fontSize: 16, textAlign: "center" },
  dividerWithText: { flexDirection: "row", alignItems: "center", width: "80%", marginVertical: 16 },
  line: { flex: 1, height: 1, backgroundColor: "#2e2e2e" },
  orText: { marginHorizontal: 8, color: "#666", fontSize: 12, fontWeight: "500" },
  googleButton: { flexDirection: "row", borderRadius: 40, paddingVertical: 6, paddingHorizontal: 12, justifyContent: "center", alignItems: "center", backgroundColor: "#000", borderColor: "#2e2e2e", borderWidth: 1 },
  googleButtonText: { fontSize: 12, fontWeight: "600", color: "#666" },
  bottomContainer: { paddingHorizontal: 24, paddingVertical: 4, backgroundColor: "#000", alignItems: "center" },
  toggleButton: { alignSelf: "center", marginTop: 12 },
  toggleText: { color: "#CCC", fontSize: 14 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: "#666", marginLeft: 5 }
});
