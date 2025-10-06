# Supabase Ayarları - Eksik Yapılandırmalar

## 1. Şifremi Unuttum (Reset Password) Email Template

Supabase Dashboard > Authentication > Email Templates > Reset Password

**Email Template**'i şu şekilde ayarlayın:

```
Subject: Şifre Sıfırlama - İrfan AI

Merhaba,

Şifre sıfırlama talebi aldık. Eğer bu talebi siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz.

Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:

{{ .ConfirmationURL }}

Link 60 dakika boyunca geçerlidir.

Saygılarımızla,
İrfan AI Ekibi
```

**URL Configuration:**
- Redirect URL: `irfan://reset-password`
- Site URL: `irfan://`

## 2. Google OAuth Aktifleştirme

### Adım 1: Google Cloud Console
1. [Google Cloud Console](https://console.cloud.google.com/) gidin
2. Yeni proje oluşturun: "Irfan AI"
3. APIs & Services > Credentials
4. "Create Credentials" > "OAuth 2.0 Client ID"
5. Application type: "iOS"
   - Bundle ID: `com.irfan.app`
6. "Create"
7. Client ID'yi kopyalayın

### Adım 2: Supabase Dashboard
1. Authentication > Providers > Google
2. "Enable Google provider" açın
3. Client ID yapıştırın
4. Client Secret yapıştırın (Google Console'dan)
5. Authorized redirect URLs:
   ```
   https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
   ```
6. "Save"

### Adım 3: Google OAuth Consent Screen
1. Google Cloud Console > APIs & Services > OAuth consent screen
2. User Type: External
3. App name: İrfan AI
4. User support email: [email]
5. Developer contact: [email]
6. Scopes: email, profile, openid
7. Test users: Ekleyin (development için)
8. "Save and Continue"

## 3. Email Confirmation (Kayıt Sonrası)

Supabase Dashboard > Authentication > Providers > Email

- "Confirm email" seçeneğini KAPATIN (hızlı test için)
- Veya açık bırakıp email template'i düzenleyin

## 4. Site URL ve Redirect URLs

Supabase Dashboard > Authentication > URL Configuration

**Site URL:**
```
irfan://
```

**Redirect URLs:**
```
irfan://auth/callback
irfan://reset-password
http://localhost:8081
exp://localhost:8081
```

## Test Etme

### Reset Password
1. Uygulamada "Şifremi Unuttum"a tıklayın
2. Email girin
3. Supabase email template'den link gelecek
4. Link tıklanınca uygulama açılacak
5. Yeni şifre girin

### Google Sign In
1. AuthScreen'de "Google ile Devam Et"e tıklayın
2. Google OAuth sayfası açılacak
3. Hesap seçin
4. Uygulama açılıp giriş yapılacak

## Notlar
- Production için Google OAuth consent screen'i publish edin
- Email template'leri istediğiniz gibi özelleştirin
- Test users ekleyin (development için)

