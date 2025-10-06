import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from "../integrations/supabase/client";
import { useToast } from '../hooks/usetoast';


interface ChatSession {
  id: string;
  title: string;
  preview: string | null;
  created_at: string;
  message_count: number;
}

interface Message {
  id: string;
  content: string;
  message_type: 'user' | 'ai';
  created_at: string;
}


interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
}

export const useDatabase = (userId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // ----- Local cache helpers (offline/fallback) -----
  const sessionsKey = userId ? `chat_sessions_${userId}` : undefined;
  const messagesKey = (sessionId: string) => (userId ? `messages_${userId}_${sessionId}` : undefined);

  const loadSessionsLocal = async (): Promise<ChatSession[]> => {
    if (!sessionsKey) return [];
    try {
      const raw = await AsyncStorage.getItem(sessionsKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveSessionsLocal = async (sessions: ChatSession[]) => {
    if (!sessionsKey) return;
    try { await AsyncStorage.setItem(sessionsKey, JSON.stringify(sessions)); } catch {}
  };

  const loadMessagesLocal = async (sessionId: string): Promise<Message[]> => {
    const key = messagesKey(sessionId);
    if (!key) return [];
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  };

  const appendMessageLocal = async (sessionId: string, msg: Message) => {
    const key = messagesKey(sessionId);
    if (!key) return;
    const arr = await loadMessagesLocal(sessionId);
    arr.push(msg);
    try { await AsyncStorage.setItem(key, JSON.stringify(arr)); } catch {}
  };

  const getUserProfile = async (): Promise<Profile | null> => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const getChatSessions = async (): Promise<ChatSession[]> => {
    if (!userId) {
      console.log("⚠️ getChatSessions: userId yok");
      return [];
    }

    try {
      setLoading(true);
      console.log("📡 Supabase'den session'lar çekiliyor... User ID:", userId);
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .select(`
          id,
          title,
          preview,
          created_at,
          messages(count)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("❌ Supabase error (getChatSessions):", error);
        throw error;
      }

      console.log("📦 Supabase'den gelen ham data:", data);

      const result = data?.map((session: any) => ({
        ...session,
        message_count: session.messages?.[0]?.count || 0,
      })) || [];
      
      console.log("✅ İşlenmiş session'lar:", result);
      // Cache'e yaz
      await saveSessionsLocal(result);
      return result;
    } catch (error: any) {
      console.error('❌ Error fetching chat sessions:', {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
      });
      // Fallback: local cache
      const cached = await loadSessionsLocal();
      if (cached.length) {
        console.log('ℹ️ getChatSessions: local cache kullanıldı', cached.length);
      }
      return cached;
    } finally {
      setLoading(false);
    }
  };

  const createChatSession = async (title: string, preview: string): Promise<string | null> => {
    if (!userId) {
      console.log('❌ createChatSession: userId yok!');
      return null;
    }

    try {
      console.log('🆕 Session oluşturuluyor:', { userId, title, preview });
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: userId,
          title,
          preview,
        })
        .select('id')
        .single();

      if (error) {
        console.log('❌ Supabase INSERT error (chat_sessions):', JSON.stringify(error, null, 2));
        throw error;
      }
      
      console.log('✅ Session oluşturuldu:', data);
      // Cache'e ekle
      const list = await loadSessionsLocal();
      list.unshift({ id: data.id, title, preview, created_at: new Date().toISOString(), message_count: 0 });
      await saveSessionsLocal(list);
      return data.id;
    } catch (error: any) {
      console.log('❌ Error creating chat session:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        full: JSON.stringify(error)
      });
      // Fallback: local session oluştur
      const localId = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
      const list = await loadSessionsLocal();
      list.unshift({ id: localId, title, preview, created_at: new Date().toISOString(), message_count: 0 });
      await saveSessionsLocal(list);
      console.log('🗂️ Local session oluşturuldu:', localId);
      return localId;
    }
  };

  const saveMessage = async (sessionId: string, content: string, messageType: 'user' | 'ai'): Promise<boolean> => {
    if (!userId) {
      console.error('❌ saveMessage: userId yok!');
      return false;
    }

    // Boş AI cevabını kaydetmeyelim
    if (messageType === 'ai' && (!content || content.trim().length === 0)) {
      console.log('ℹ️ Boş AI içeriği kaydedilmedi');
      return true; // UI akışını bloklamamak için true döndürüyoruz
    }

    try {
      console.log('💾 saveMessage çağrıldı:', { sessionId, userId, messageType, contentLength: content.length });
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          session_id: sessionId,
          user_id: userId,
          content,
          message_type: messageType,
        })
        .select();

      if (error) {
        console.error('❌ Supabase INSERT error (messages):', error);
        throw error;
      }
      
      console.log('✅ Mesaj kaydedildi:', data);
      return true;
    } catch (error: any) {
      console.error('❌ Error saving message:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      // Fallback: local'e ekle
      const msg: Message = { id: `${Date.now()}`, content, message_type: messageType, created_at: new Date().toISOString() };
      await appendMessageLocal(sessionId, msg);
      console.log('🗂️ Mesaj local cache\'e eklendi');
      return true;
    }
  };

  const getChatMessages = async (sessionId: string): Promise<Message[]> => {
    if (!userId) return [];

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      const arr = (data || []).map(msg => ({
        ...msg,
        message_type: msg.message_type as 'user' | 'ai',
      }));
      // Cache'e yaz
      try { await AsyncStorage.setItem(messagesKey(sessionId)!, JSON.stringify(arr)); } catch {}
      return arr;
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      // Fallback: local cache
      const cached = await loadMessagesLocal(sessionId);
      if (cached.length) {
        console.log('ℹ️ getChatMessages: local cache kullanıldı', cached.length);
      }
      return cached;
    }
  };

  const deleteChatSession = async (sessionId: string): Promise<boolean> => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Sohbet Silindi",
        description: "Sohbet başarıyla silindi.",
      });

      return true;
    } catch (error: any) {
      console.error('Error deleting chat session:', error);
      toast({
        title: "Hata",
        description: "Sohbet silinemedi.",
      });
      return false;
    }
  };

  const clearAllChatSessions = async (): Promise<boolean> => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Tüm Sohbetler Silindi",
        description: "Tüm sohbet geçmişi temizlendi.",
      });

      return true;
    } catch (error: any) {
      console.error('Error clearing chat sessions:', error);
      toast({
        title: "Hata",
        description: "Sohbet geçmişi temizlenemedi.",
      });
      return false;
    }
  };

  return {
    loading,
    getUserProfile,
    getChatSessions,
    createChatSession,
    saveMessage,
    getChatMessages,
    deleteChatSession,
    clearAllChatSessions,
  };
};


