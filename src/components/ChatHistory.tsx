import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "../hooks/usetoast";
import { useAuth } from "../hooks/useAuth";
import { useDatabase } from "../hooks/useDatabase";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigations/RootNavigator";
import { Header } from "../components/Header";
import { Swipeable } from "react-native-gesture-handler";

interface ChatSession {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  messageCount: number;
}

type Props = NativeStackScreenProps<RootStackParamList, "ChatHistory">;

export const ChatHistory = ({ navigation }: Props) => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const database = useDatabase(user?.id);

  console.log("🔑 ChatHistory - User:", user ? `ID: ${user.id}` : "Giriş yapılmadı");

  const loadChatHistory = async () => {
    setIsLoading(true);
    try {
      if (!user) {
        console.log("❌ Kullanıcı bulunamadı, sohbet geçmişi yüklenemedi");
        setChatSessions([]);
        setIsLoading(false);
        return;
      }

      console.log("🔍 Sohbet geçmişi yükleniyor... User ID:", user.id);
      
      // Supabase'den gerçek chat session'larını çek
      const sessions = await database.getChatSessions();
      
      console.log("📦 Supabase'den gelen session'lar:", sessions.length, sessions);
      
      // Format dönüşümü yap
      const formattedSessions = sessions.map((session) => {
        const timestamp = formatTimestamp(session.created_at);
        return {
          id: session.id,
          title: session.title || "Yeni Sohbet",
          preview: session.preview || "Sohbet başlatıldı",
          timestamp,
          messageCount: session.message_count || 0,
        };
      });
      
      console.log("✅ Formatlanmış session'lar:", formattedSessions.length);
      setChatSessions(formattedSessions);
    } catch (error) {
      console.error("❌ Sohbet geçmişi yüklenirken hata:", error);
      toast({
        title: "Hata",
        description: "Sohbet geçmişi yüklenirken hata oluştu.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChatHistory();
  }, [user?.id]);

  const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} dakika önce`;
    } else if (diffHours < 24) {
      return `${diffHours} saat önce`;
    } else if (diffDays < 7) {
      return `${diffDays} gün önce`;
    } else {
      return date.toLocaleDateString("tr-TR");
    }
  };

  const deleteChatSession = useCallback(
    async (chatId: string) => {
      if (!user) return;
      
      const success = await database.deleteChatSession(chatId);
      if (success) {
        const updated = chatSessions.filter((chat) => chat.id !== chatId);
        setChatSessions(updated);
      }
    },
    [chatSessions, database, user]
  );

  const clearAllHistory = () => {
    Alert.alert(
      "Onayla",
      "Tüm sohbet geçmişini silmek istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            if (!user) return;
            
            const success = await database.clearAllChatSessions();
            if (success) {
              setChatSessions([]);
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderRightActions = useCallback(
    (chatId: string) => (
      <TouchableOpacity
        style={styles.swipeDeleteButton}
        onPress={() => deleteChatSession(chatId)}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="trash-outline" size={24} color="#fff" />
        <Text style={styles.swipeDeleteText}>Sil</Text>
      </TouchableOpacity>
    ),
    [deleteChatSession]
  );

  const handleSelectChat = (sessionId: string) => {
    console.log("🎯 Sohbet seçildi:", sessionId);
    
    // Chat ekranına dön ve session ID'yi parametre olarak gönder
    // goBack yerine navigate kullanarak stack'te Chat zaten varsa parametreyi güncelle
    navigation.navigate('Chat', { sessionId });
  };

  const renderItem = useCallback(
    ({ item }: { item: ChatSession }) => (
      <Swipeable renderRightActions={() => renderRightActions(item.id)} overshootRight={false}>
        <TouchableOpacity
          style={styles.chatItem}
          onPress={() => handleSelectChat(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.chatInfo}>
            <Text style={styles.chatTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.chatPreview} numberOfLines={2}>
              {item.preview}
            </Text>
            <View style={styles.chatMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={12} color="#888" />
                <Text style={styles.metaText}>{item.timestamp}</Text>
              </View>
              <Text style={styles.metaText}>{item.messageCount} mesaj</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    ),
    [renderRightActions, navigation]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header
          title="Sohbet Geçmişi"
          onBack={handleBack}
         
          showMenu={false}
          showHistory={false}
          rightComponent={
            chatSessions.length > 0 && (
              <TouchableOpacity
                onPress={clearAllHistory}
                style={styles.clearAllButton}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="trash-outline" size={20} color="#b22222" />
              </TouchableOpacity>
            )
          }
        />

        <View style={styles.content}>
          {!user ? (
            <View style={styles.emptyWrapper}>
              <View style={styles.emptyIconWrapper}>
                <Ionicons name="person-outline" size={40} color="#aaa" />
              </View>
              <Text style={styles.emptyTitle}>Giriş Yapın</Text>
              <Text style={styles.emptyText}>Sohbet geçmişinizi görmek için giriş yapmalısınız</Text>
              <TouchableOpacity 
                style={styles.loginButton}
                onPress={() => navigation.navigate("Auth")}
              >
                <Text style={styles.loginButtonText}>Giriş Yap</Text>
              </TouchableOpacity>
            </View>
          ) : isLoading ? (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size="large" color="#336699" />
              <Text style={styles.loadingText}>Sohbet geçmişi yükleniyor...</Text>
            </View>
          ) : chatSessions.length === 0 ? (
            <View style={styles.emptyWrapper}>
              <View style={styles.emptyIconWrapper}>
                <Ionicons name="chatbubble-ellipses-outline" size={40} color="#aaa" />
              </View>
              <Text style={styles.emptyTitle}>Henüz Sohbet Yok</Text>
              <Text style={styles.emptyText}>İlk sorunuzu sorarak sohbete başlayın</Text>
            </View>
          ) : (
            <FlatList
              data={chatSessions}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              style={{ flex: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },
  container: { flex: 1, backgroundColor: "#000" },

  clearAllButton: {
    padding: 8,
    marginRight: 8,
  },

  content: { flex: 1 },

  loadingWrapper: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#666" },

  emptyWrapper: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  emptyIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: { fontSize: 20, fontWeight: "600", marginBottom: 8, color: "#ccc" },
  emptyText: { fontSize: 14, color: "#888", textAlign: "center", marginBottom: 20 },

  loginButton: {
    backgroundColor: "#F2AE30",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  loginButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },

  listContent: { padding: 12, paddingBottom: 32 },

  chatItem: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  chatInfo: { flex: 1, marginRight: 8 },

  chatTitle: { fontWeight: "700", fontSize: 16, color: "#fff" },

  chatPreview: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 4,
  },

  chatMeta: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },

  metaText: { fontSize: 12, color: "#888", marginLeft: 4 },

  swipeDeleteButton: {
    backgroundColor: "#b22222",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    marginTop: 6,
    marginBottom: 6,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },

  swipeDeleteText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
});
