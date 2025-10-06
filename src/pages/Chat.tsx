import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Image,
  Animated,
  useWindowDimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ChatBubble } from "../components/ChatBubble";
import { ChatInput } from "../components/ChatInput";
import { useToast } from "../hooks/usetoast";
import { useAuth } from "../hooks/useAuth";
import { useDatabase } from "../hooks/useDatabase";
import { islamicApiService } from "../services/islamicApi";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigations/RootNavigator";
import { History, Menu } from "lucide-react-native";

const irfanLogo = require("../assets/kuran.png");

const prompts = [
  { title: "Kur'an Tefsiri", subtitle: "Ayetlerin sırlarını ve hikmetlerini öğrenin." },
  { title: "Kutsal Dualar", subtitle: "Maneviyatınızı güçlendiren özel dua koleksiyonu." },
  { title: "Hadis Kaynağı", subtitle: "Sahih hadisler hakkında güvenilir bilgiler." },
  { title: "Namaz Rehberi", subtitle: "Doğru ve bilinçli ibadet için güvenilir kaynak." },
];

interface Message {
  id: string;
  text: string;
  type: "user" | "ai";
  timestamp: string;
  citations?: string[];
}

// Markdown temizleme fonksiyonu
const cleanMarkdown = (text: string): string => {
  if (!text) return text;
  
  // TABLO FORMATLARI TEMİZLE (ÖNCELİKLİ)
  // Tablo ayırıcı satırlarını kaldır (|---|---|)
  text = text.replace(/^\s*\|[\s\-\:\|]+\|\s*$/gm, '');
  
  // Tablo satırlarını normal metne çevir (| col1 | col2 | -> col1 col2)
  text = text.replace(/^\s*\|(.+)\|\s*$/gm, (match, content) => {
    const cells = content.split('|').map((c: string) => c.trim()).filter((c: string) => c);
    return cells.join(' ');
  });
  
  // Kalan pipe karakterlerini temizle
  text = text.replace(/\|/g, '');
  
  // Bold/italic temizle
  text = text.replace(/\*\*\*(.+?)\*\*\*/g, '$1');
  text = text.replace(/\*\*(.+?)\*\*\*/g, '$1');
  text = text.replace(/\*(.+?)\*/g, '$1');
  text = text.replace(/__(.+?)__/g, '$1');
  text = text.replace(/_(.+?)_/g, '$1');
  
  // Liste işaretlerini temizle
  text = text.replace(/^\s*[-•*]\s+/gm, '');
  text = text.replace(/^\s*\d+[\.\)]\s+/gm, '');
  
  // Başlıkları temizle
  text = text.replace(/^#+\s+/gm, '');
  
  // Çoklu boşlukları temizle
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.replace(/ {2,}/g, ' ');
  
  return text.trim();
};

export function Chat({ route }: any) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const cardWidth = (width - 64) / 2;

  const { toast } = useToast();
  const { user } = useAuth();
  const database = useDatabase(user?.id);

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const pulseAnim = useRef(new Animated.Value(0)).current;

  const getCurrentTimeStamp = () =>
    new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  // Eski sohbeti yükle
  const loadChatSession = useCallback(async (sessionId: string) => {
    console.log("📥 loadChatSession çağrıldı - Session ID:", sessionId, "User:", user?.id);
    
    if (!user) {
      console.log("⚠️ User yok, sohbet yüklenemedi");
      return;
    }
    
    setIsLoadingHistory(true);
    try {
      console.log("🔍 Mesajlar yükleniyor...");
      const chatMessages = await database.getChatMessages(sessionId);
      console.log("📦 Yüklenen mesaj sayısı:", chatMessages.length);
      
      const formattedMessages: Message[] = chatMessages.map((msg, index) => ({
        id: `${msg.id}-${index}`,
        text: cleanMarkdown(msg.content),
        type: msg.message_type,
        timestamp: new Date(msg.created_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
        citations: [],
      }));
      
      setMessages(formattedMessages);
      setCurrentSessionId(sessionId);
      
      console.log("✅ Sohbet yüklendi:", formattedMessages.length, "mesaj");
      
      toast({
        title: "Sohbet Yüklendi",
        description: `${formattedMessages.length} mesaj yüklendi`,
      });
    } catch (error) {
      console.error("❌ Sohbet yükleme hatası:", error);
      toast({
        title: "Hata",
        description: "Sohbet yüklenemedi",
      });
    } finally {
      setIsLoadingHistory(false);
    }
  }, [user, database, toast]);

  // Route parametresinden gelen sessionId'yi yükle
  useEffect(() => {
    const sessionId = route?.params?.sessionId;
    console.log("📍 Route params sessionId:", sessionId, "Current:", currentSessionId);
    
    if (sessionId && sessionId !== 'undefined') {
      // Session ID değişmişse veya ilk yükleme ise, sohbeti yükle
      if (sessionId !== currentSessionId) {
        console.log("🔄 Eski sohbet yükleniyor...", sessionId);
        loadChatSession(sessionId);
      } else {
        console.log("ℹ️ Session zaten yüklü:", sessionId);
      }
    } else {
      console.log("ℹ️ Route'da session ID yok, yeni sohbet modu");
    }
  }, [route?.params?.sessionId, loadChatSession, currentSessionId]);

  // Yeni sohbet başlat
  const startNewChat = useCallback(() => {
    console.log("🆕 Yeni sohbet başlatılıyor...");
    
    // Tüm state'leri temizle
    setMessages([]);
    setCurrentSessionId(null);
    setIsLoadingHistory(false);
    setIsLoading(false);
    
    // Route parametrelerini temizle (navigation state'i sıfırla)
    navigation.setParams({ sessionId: undefined } as any);
    
    console.log("✅ Yeni sohbet hazır - Tüm state temizlendi");
    
    toast({
      title: "Yeni Sohbet",
      description: "Yeni bir sohbet başlattınız",
    });
  }, [toast, navigation]);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        text,
        type: "user",
        timestamp: getCurrentTimeStamp(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        let sessionId = currentSessionId;
        
        // İlk mesaj ise yeni session oluştur
        if (!sessionId) {
          if (user) {
            console.log("🔄 Yeni session oluşturuluyor... User ID:", user.id);
            sessionId = await database.createChatSession(text.substring(0, 50), text);
            console.log("✅ Session oluşturuldu:", sessionId);
            setCurrentSessionId(sessionId);
          } else {
            // User yoksa geçici session ID oluştur (demo mode)
            console.log("⚠️ Demo mode: Geçici session ID oluşturuluyor");
            sessionId = islamicApiService.generateUUID();
            setCurrentSessionId(sessionId);
          }
        }

        // Boş AI mesajı oluştur (streaming için)
        const aiMessageId = (Date.now() + 1).toString();
        const aiMessage: Message = {
          id: aiMessageId,
          text: "",
          type: "ai",
          timestamp: getCurrentTimeStamp(),
          citations: [],
        };
        
        setMessages((prev) => [...prev, aiMessage]);

        // Backend'den cevap al (non-streaming mode - React Native uyumlu)
        try {
          const response = await islamicApiService.chat({
            query: text,
            session_id: sessionId,
            user_id: user?.id || "anonymous",
            language: "tr",
          });

          if (response.success && response.data) {
            const fullResponse = cleanMarkdown(response.data.content);
            
            // AI mesajını güncelle
            setMessages((prev) => 
              prev.map((msg) => 
                msg.id === aiMessageId 
                  ? { 
                      ...msg, 
                      text: fullResponse,
                      citations: response.data.citations || []
                    }
                  : msg
              )
            );

            // Supabase'e kaydet
            if (sessionId && user) {
              console.log("💾 Mesajlar Supabase'e kaydediliyor... Session ID:", sessionId);
              const userSaved = await database.saveMessage(sessionId, text, "user");
              const aiSaved = await database.saveMessage(sessionId, fullResponse, "ai");
              console.log("✅ Mesajlar kaydedildi:", { userSaved, aiSaved });
            } else {
              console.log("⚠️ Mesajlar kaydedilmedi - Session ID:", sessionId, "User:", user?.id);
            }
          } else {
            throw new Error(response.error || "Backend'den cevap alınamadı");
          }

        } catch (streamError) {
          console.error("Streaming error:", streamError);
          
          // Hata mesajı göster
          setMessages((prev) => 
            prev.map((msg) => 
              msg.id === aiMessageId 
                ? { 
                    ...msg, 
                    text: `⚠️ Bağlantı hatası: ${streamError instanceof Error ? streamError.message : "Backend'e ulaşılamıyor"}\n\nLütfen:\n1. Backend servisinin çalıştığından emin olun\n2. .env dosyasında BACKEND_URL'in doğru olduğunu kontrol edin\n3. İnternet bağlantınızı kontrol edin` 
                  }
                : msg
            )
          );
          
          toast({ 
            title: "Bağlantı Hatası", 
            description: "Backend'e bağlanılamadı. Lütfen backend servisini başlatın." 
          });
        }
        
      } catch (error) {
        console.error("Chat error:", error);
        
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `⚠️ Hata: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`,
          type: "ai",
          timestamp: getCurrentTimeStamp(),
        };
        
        setMessages((prev) => [...prev, errorMessage]);
        
        toast({ 
          title: "Hata", 
          description: "Bir hata oluştu." 
        });
      } finally {
        setIsLoading(false);
      }
    },
    [currentSessionId, user, database, toast, isLoading]
  );

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            {/* Header */}
            <View
              style={{
                paddingTop: insets.top + 10,
                paddingHorizontal: 16,
                backgroundColor: "#000",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                <Menu color="#CCC" size={20} />
              </TouchableOpacity>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={styles.headerTitle}>İrfan AI</Text>
                {messages.length > 0 && (
                  <TouchableOpacity 
                    onPress={startNewChat}
                    style={{ 
                      backgroundColor: "#F2AE30", 
                      paddingHorizontal: 8, 
                      paddingVertical: 4, 
                      borderRadius: 6 
                    }}
                  >
                    <Text style={{ fontSize: 12, color: "#000", fontWeight: "600" }}>Yeni</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity onPress={() => navigation.navigate("ChatHistory")}>
                <History color="#CCC" size={20} />
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <ScrollView
              ref={scrollRef}
              contentContainerStyle={[styles.messagesContainer, { justifyContent: "flex-end" }]}
              keyboardShouldPersistTaps="handled"
            >
              {isLoadingHistory ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#F2AE30" />
                  <Text style={styles.loadingText}>Sohbet yükleniyor...</Text>
                </View>
              ) : messages.length === 0 ? (
                <View style={{ marginBottom: 95, alignItems: "center" }}>
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
                    <Image source={irfanLogo} style={styles.logo} />
                  </View>

                  <Text style={styles.arabicTitle}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</Text>
                  <Text style={styles.title}>Yapay Zekâ Destekli İslami Rehberiniz</Text>
                  <Text style={styles.subtitle}>"İslam'ın derinliklerindeki bilgileri kolayca keşfedin."</Text>

                  <View style={[styles.grid, { justifyContent: "center", alignItems: "center" }]}>
                    {prompts.map((p) => (
                      <TouchableOpacity
                        key={p.title}
                        style={[styles.card, { width: cardWidth }]}
                        onPress={() => handleSendMessage(p.title)}
                      >
                        <Text style={styles.cardTitle}>{p.title}</Text>
                        <Text style={styles.cardSubtitle}>{p.subtitle}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : (
                messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message.text}
                    type={message.type}
                    timestamp={message.timestamp}
                    citations={message.citations}
                  />
                ))
              )}

              {isLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#F2AE30" />
                  <Text style={styles.loadingText}>İrfan düşünüyor...</Text>
                </View>
              )}
            </ScrollView>

            {/* Input */}
            <View style={{ backgroundColor: "#000" }}>
              <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  inner: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "flex-end",
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 0,
    justifyContent: "flex-end",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F2AE30",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: "#888",
    fontStyle: "italic",
  },
  logoContainer: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 18,
  },
  glowEffect: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 20,
    backgroundColor: "#F2AE30",
    shadowColor: "#F2AE30",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 20,
  },
  arabicTitle: {
    fontSize: 25,
    color: "#F2AE30",
    marginBottom: 12,
    textAlign: "center",
    writingDirection: "rtl",
    fontFamily: "Arial",
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: "bold",
    color: "#F2AE30",
    marginBottom: 8,
    textShadowColor: "#F2AE3080",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 12,
    color: "#CCC",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginHorizontal: -8,
  },
  card: {
    backgroundColor: "#000",
    borderWidth: 0.5,
    borderColor: "#666",
    borderRadius: 12,
    padding: 20,
    height: 95,
    justifyContent: "center",
    transform: [{ scale: 0.9 }],
    marginHorizontal: 1,
    marginVertical: 4,
  },
  cardTitle: {
    fontWeight: "600",
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#666",
  },
});
