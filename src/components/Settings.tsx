import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  SafeAreaView,
  Platform,
} from "react-native";

import {
  User,
  Shield,
  FileText,
  LogOut,
  ExternalLink,
  Trash2,
} from "lucide-react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigations/RootNavigator";
import { Header } from "../components/Header";
import { useAuth } from "../hooks/useAuth";

interface SettingsProps {
  onBack: () => void;
  onLogout?: () => void;
}

export const Settings = ({ onBack, onLogout }: SettingsProps) => {
  const { user, signOut } = useAuth();
  const [feedback, setFeedback] = useState("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert("Veriler Temizlendi", "Tüm uygulama verileri silindi.");
    } catch (error) {
      Alert.alert("Hata", "Veriler temizlenirken bir hata oluştu.");
    }
  };

  const submitFeedback = () => {
    if (!feedback.trim()) return;
    Alert.alert("Geri Bildirim Gönderildi");
    setFeedback("");
  };

  const handleLogout = async () => {
    try {
      await signOut();
      onLogout?.();
    } catch (error) {
      Alert.alert("Hata", "Çıkış işlemi başarısız oldu.");
    }
  };

  const openUrl = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Hata", "Bağlantı açılamıyor: " + url);
    }
  };

  // Kullanıcı bilgilerini al
  const userEmail = user?.email || "";
  const userName = user?.user_metadata?.full_name || userEmail.split("@")[0] || "";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="Ayarlar" onBack={onBack}  />

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
        >
          {/* Profil Bilgileri */}
          <View style={styles.panel}>
            <View style={styles.sectionHeader}>
              <User size={20} color="#F2AE30" />
              <Text style={styles.sectionTitle}>Profil Bilgileri</Text>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-posta Adresi</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={userEmail}
                editable={false}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Görünen Ad</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={userName}
                editable={false}
              />
            </View>
          </View>

          {/* Geri Bildirim */}
          <View style={styles.panel}>
            <View style={styles.sectionHeader}>
              <FileText size={20} color="#F2AE30" />
              <Text style={styles.sectionTitle}>Geri Bildirim</Text>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Görüş ve Önerileriniz</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="İrfan hakkındaki görüşlerinizi bizimle paylaşın..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={5}
                value={feedback}
                onChangeText={setFeedback}
              />
            </View>
            <TouchableOpacity
              onPress={submitFeedback}
              disabled={!feedback.trim()}
              style={[styles.button, !feedback.trim() && styles.buttonDisabled]}
            >
              <Text style={styles.buttonText}>Geri Bildirim Gönder</Text>
            </TouchableOpacity>
          </View>

          {/* Hukuki */}
          <View style={styles.panel}>
            <View style={styles.sectionHeader}>
              <Shield size={20} color="#F2AE30" />
              <Text style={styles.sectionTitle}>Hukuki</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("PrivacyPolicy")}
              style={[styles.outlineButton, Platform.OS === "ios" && { overflow: "hidden" }]}
            >
              <Text style={styles.outlineButtonText}>Gizlilik Politikası</Text>
              <ExternalLink size={16} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("TermsOfService")}
              style={[styles.outlineButton, Platform.OS === "ios" && { overflow: "hidden" }]}
            >
              <Text style={styles.outlineButtonText}>Kullanım Şartları</Text>
              <ExternalLink size={16} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Tehlikeli Bölge */}
          <View style={[styles.panel, styles.dangerZone]}>
            <Text style={[styles.sectionTitle, styles.dangerTitle]}>Tehlikeli Bölge</Text>
            <TouchableOpacity
              onPress={clearAllData}
              style={[styles.outlineButton, styles.dangerButton, Platform.OS === "ios" && { overflow: "hidden" }]}
            >
              <Trash2 size={16} color="#d9534f" />
              <Text style={[styles.dangerButtonText, { marginLeft: 8 }]}>Tüm Verileri Sil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              style={[styles.outlineButton, styles.dangerButton, Platform.OS === "ios" && { overflow: "hidden" }]}
            >
              <LogOut size={16} color="#d9534f" />
              <Text style={[styles.dangerButtonText, { marginLeft: 8 }]}>Çıkış Yap</Text>
            </TouchableOpacity>
          </View>

          {/* Bilgi */}
          <View style={styles.dedicationContainer}>
            <Text style={styles.dedicationText}>irfan, bir Anekron A.Ş uygulamasıdır.</Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },
  container: { flex: 1, backgroundColor: "#000" },
  content: { padding: 16, paddingTop: Platform.OS === "ios" ? 20 : 56 },

  panel: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#336699",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },

  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#F2AE30", marginLeft: 6 },

  inputGroup: { marginBottom: 16 },

  label: { fontSize: 14, color: "#666", marginBottom: 6 },

  input: {
    borderWidth: 1,
    borderColor: "#2e2e2e",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#000",
    color: "#CCC",
  },

  disabledInput: { backgroundColor: "#000", color: "#888" },

  textarea: { height: 100, textAlignVertical: "top" },

  button: { backgroundColor: "#F2AE30", paddingVertical: 14, borderRadius: 8, alignItems: "center" },

  buttonSecondary: { backgroundColor: "#666" },

  buttonDisabled: { opacity: 0.5 },

  buttonText: { color: "#000", fontWeight: "600", fontSize: 16 },

  buttonRow: { flexDirection: "row", gap: 12, marginBottom: 12 },

  helpText: { fontSize: 12, color: "#555", marginTop: 4, fontStyle: "italic" },

  outlineButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2e2e2e",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 12,
  },

  outlineButtonText: { color: "#666", fontSize: 16, fontWeight: "600" },

  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },

  infoLabel: { color: "#666", fontSize: 14 },

  infoValue: { color: "#666", fontSize: 14, fontWeight: "500" },

  dangerZone: { borderColor: "#d9534f", borderWidth: 1 },

  dangerTitle: { color: "#d9534f" },

  dangerButton: { borderColor: "#d9534f", marginBottom: 12 },

  dangerButtonText: { color: "#d9534f", fontWeight: "600", fontSize: 16 },

  dedicationContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    marginTop: 20,
  },

  dedicationText: {
    fontSize: 11,
    color: "#555",
    fontStyle: "italic",
    textAlign: "center",
    opacity: 0.7,
  },
});


