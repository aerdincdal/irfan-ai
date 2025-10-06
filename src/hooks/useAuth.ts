import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../integrations/supabase/client";
import { useToast } from "./usetoast";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Session kontrolü
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    fetchSession();

    // Auth state listener
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast({ title: "Kayıt Başarılı", description: "Hesabınız oluşturuldu." });
      return { error: null };
    } catch (error: any) {
      toast({ title: "Kayıt Hatası", description: error.message });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({ title: "Giriş Başarılı", description: "Hoş geldiniz!" });
      return { error: null };
    } catch (error: any) {
      toast({ title: "Giriş Hatası", description: error.message });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({ title: "Çıkış Yapıldı", description: "Güvenle çıkış yaptınız." });
      setUser(null);
      setSession(null);
    } catch (error: any) {
      toast({ title: "Çıkış Hatası", description: error.message });
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'irfan://auth/callback',
        },
      });
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      toast({ title: "Google Giriş Hatası", description: error.message });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'irfan://reset-password',
      });
      if (error) throw error;
      toast({ title: "E-posta Gönderildi", description: "Şifre sıfırlama linki e-postanıza gönderildi." });
      return { error: null };
    } catch (error: any) {
      toast({ title: "Hata", description: error.message });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  return { user, session, loading, signUp, signIn, signOut, signInWithGoogle, resetPassword };
};
