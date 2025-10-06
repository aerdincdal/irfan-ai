import React from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigations/RootNavigator";

export default function TermsOfService() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <ArrowLeft size={24} color="#888" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Kullanım Şartları</Text>

        <View style={styles.panel}>
          <Section
            title="1. Hizmet Tanımı"
            content="İrfan, yapay zeka destekli İslami bilgiler asistanıdır. Uygulama, Kur'an-ı Kerim, hadisler ve İslami ilimler hakkında bilgi sağlar."
          />
          <Section
            title="2. Kullanım Koşulları"
            content="Uygulamamızı kullanırken İslami değerlere uygun davranmanızı, saygılı bir dil kullanmanızı ve hizmetimizi kötüye kullanmamanızı rica ederiz."
          />
          <Section
            title="3. İçerik Sorumluluğu"
            content="Uygulama tarafından sağlanan bilgiler referans amaçlıdır. Önemli dini konularda mutlaka uzman din alimlerine danışınız."
          />
          <Section
            title="4. Değişiklikler"
            content="Bu kullanım şartları herhangi bir zamanda güncellenebilir. Değişiklikler uygulama içinde duyurulacaktır."
          />
        </View>
      </View>
    </ScrollView>
  );
}

const Section = ({ title, content }: { title: string; content: string }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionContent}>{content}</Text>
  </View>
);

const STATUSBAR_HEIGHT = Platform.OS === "android" ? StatusBar.currentHeight || 24 : 44;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 24,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",  
    alignItems: "center",      
    paddingTop: Platform.OS === "ios" ? STATUSBAR_HEIGHT + 20 : STATUSBAR_HEIGHT + 10,
    paddingBottom: 40,
  },
  backButton: {
    position: "absolute",
    top: STATUSBAR_HEIGHT + 20,
    left: -2,
    zIndex: 10,
    padding: 4,
  },
  content: {
    maxWidth: 700,
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
    color: "#F2AE30",
  },
  panel: {
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#CCCCCC",
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 22,
    color: "#888",
  },
});
