import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAuth } from "../hooks/useAuth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ERROR_TITLE = "Hata";
const SUCCESS_TITLE = "Başarılı";

export const ForgotPassword = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const { resetPassword, loading } = useAuth();

  const isDisabled = loading || !EMAIL_REGEX.test(email.trim());

  const showAlert = (title: string, message: string, onPress?: () => void) =>
    Alert.alert(title, message, onPress ? [{ text: "Tamam", onPress }] : undefined);

  const sendResetEmail = async () => {
    if (!email.trim()) return showAlert(ERROR_TITLE, "Lütfen e-posta adresinizi giriniz.");
    if (!EMAIL_REGEX.test(email)) return showAlert(ERROR_TITLE, "Lütfen geçerli bir e-posta adresi giriniz.");

    const { error } = await resetPassword(email);

    if (!error) {
      showAlert(
        SUCCESS_TITLE,
        "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.",
        () => navigation.goBack()
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={styles.hitSlop}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#F2AE30" />
          </TouchableOpacity>

          <Text style={styles.title}>Şifremi Unuttum</Text>

          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="email" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="E-posta adresi"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#666"
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isDisabled && styles.buttonDisabled]}
            onPress={sendResetEmail}
            disabled={isDisabled}
          >
            {loading ? <ActivityIndicator color="#2e2e2e" /> : <Text style={styles.buttonText}>Gönder</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 24,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 30 : 10,
    left: 10,
    zIndex: 10,
    padding: 8,
  },
  hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
  title: {
    fontSize: 24,
    color: "#ccc",
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#2e2e2e",
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 14,
    paddingHorizontal: 12,
    backgroundColor: "#000",
    width: "85%",
    alignSelf: "center",
  },
  icon: { marginRight: 8 },
  input: { color: "#fff", flex: 1, height: 44, paddingLeft: 6 },
  button: {
    borderRadius: 18,
    backgroundColor: "#F2AE30",
    borderColor: "gray",
    width: "70%",
    alignSelf: "center",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#F2AE30",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});