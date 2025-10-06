import React, { useEffect, useState } from "react";
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
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Linking from "expo-linking";

import { supabase } from "../lib/supabase";

export const ResetPassword = ({ navigation }: any) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const getTokenFromUrl = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        // console.log("Initial URL:", url);
        const hash = url.split("#")[1];
        if (hash) {
          const params = new URLSearchParams(hash);
          const token = params.get("access_token");
          const type = params.get("type");

          if (token && type === "recovery") {
            supabase.auth
              .setSession({
                access_token: token,
                refresh_token: token,
              })
              .then(({ error }) => {
                if (error) {
                  Alert.alert("Hata", "Oturum başlatılamadı.");
                } else {
                  setSessionReady(true);
                }
              });
          } else {
            Alert.alert("Hata", "Geçersiz şifre sıfırlama bağlantısı.");
          }
        } else {
          Alert.alert("Hata", "Şifre sıfırlama linki geçersiz.");
        }
      } else {
        Alert.alert("Hata", "Şifre sıfırlama linki bulunamadı.");
      }
    };

    getTokenFromUrl();
  }, []);

  const handleResetPassword = async () => {
    if (password.length < 6) {
      Alert.alert("Hata", "Şifre en az 6 karakter olmalıdır.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler eşleşmiyor.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      Alert.alert("Hata", error.message);
    } else {
      Alert.alert("Başarılı", "Şifreniz başarıyla güncellendi.", [
        {
          text: "Tamam",
          onPress: () => navigation.navigate("Auth"),
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#F2AE30"
            />
          </TouchableOpacity>

          <Text style={styles.title}>Yeni Şifre Belirle</Text>

          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons
              name="lock"
              size={20}
              color="#999"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Yeni şifre"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              <MaterialCommunityIcons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons
              name="lock-check"
              size={20}
              color="#999"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Şifre (Tekrar)"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeButton}
            >
              <MaterialCommunityIcons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              !sessionReady && { opacity: 0.5 },
            ]}
            onPress={handleResetPassword}
            disabled={!sessionReady}
          >
            <Text style={styles.buttonText}>Şifreyi Güncelle</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    top: 10,
    left: 10,
    zIndex: 1,
    padding: 8,
  },
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
    marginBottom: 16,
    backgroundColor: "#000",
    paddingHorizontal: 12,
    height: 45,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    color: "#fff",
    flex: 1,
    height: "100%",
  },
  eyeButton: {
    paddingHorizontal: 8,
  },
  button: {
    borderRadius: 18,
    backgroundColor: "#F2AE30",
    borderColor: "gray",
    width: "80%",
    alignSelf: "center",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#2e2e2e",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",



    
  },
});