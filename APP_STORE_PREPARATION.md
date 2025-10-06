# İrfan - App Store Hazırlık Listesi

## 📋 Ön Hazırlık

### 1. Apple Developer Hesabı
- [ ] Apple Developer Program üyeliği ($99/yıl)
- [ ] App Store Connect hesabı oluşturuldu
- [ ] Team ID ve certificates hazırlandı

### 2. Yasal Gereklilikler
- [ ] Privacy Policy web sayfası hazırlandı
- [ ] Terms of Service web sayfası hazırlandı
- [ ] Support website/email hazırlandı
- [ ] KVKK uyumluluğu sağlandı

---

## 🎨 Görsel Materyaller

### App Icon
- [ ] **1024x1024 px** App Icon (PNG, no transparency, no rounded corners)
- [ ] **180x180 px** iPhone App Icon
- [ ] **120x120 px** iPhone Spotlight Icon
- [ ] **87x87 px** iPhone Settings Icon

### Ekran Görüntüleri

#### iPhone (Zorunlu - En az 1 set)
- [ ] **6.5" (1242 x 2688 px)** - iPhone 14 Pro Max, 13 Pro Max, 12 Pro Max
  - Ana ekran
  - Sohbet ekranı
  - Cevap örneği
  - Sohbet geçmişi
  - Ayarlar
  
- [ ] **6.7" (1290 x 2796 px)** - iPhone 15 Pro Max, 15 Plus
- [ ] **5.5" (1242 x 2208 px)** - iPhone 8 Plus (opsiyonel)

#### iPad (Önerilen)
- [ ] **12.9" (2048 x 2732 px)** - iPad Pro 12.9"
- [ ] **11" (1668 x 2388 px)** - iPad Pro 11"

### Tanıtım Videosu (Opsiyonel)
- [ ] 15-30 saniye tanıtım videosu
- [ ] App Preview format: H.264/HEVC, Stereo AAC audio

---

## 🛠️ Teknik Hazırlık

### Kod ve Build

- [x] TypeScript hatalarını düzelt
- [ ] Linter hatalarını düzelt
- [ ] Production build test et
- [ ] Memory leaks kontrol et
- [ ] Crash analytics entegre et (Firebase Crashlytics önerilir)

### Build Configuration

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo
eas login

# 3. Configure build
eas build:configure

# 4. Create iOS build
eas build --platform ios --profile production
```

### app.json Kontrol Listesi

- [x] **name:** "İrfan"
- [x] **slug:** "irfan"
- [x] **version:** "1.0.0"
- [x] **bundleIdentifier:** "com.irfan.app"
- [x] **buildNumber:** "1"
- [ ] **privacyManifests:** Tracking izinleri tanımla
- [x] **infoPlist:** NSCameraUsageDescription, NSPhotoLibraryUsageDescription

### Environment Variables

- [ ] **.env** dosyası production için hazır
  - [ ] SUPABASE_URL (production)
  - [ ] SUPABASE_ANON_KEY (production)
  - [ ] BACKEND_URL (production)
  - [ ] HF_TOKEN (production)

---

## 🔐 Güvenlik ve Gizlilik

### Supabase
- [ ] Row Level Security (RLS) policies aktif
- [ ] Production API keys kullan
- [ ] Rate limiting yapılandır
- [ ] Email confirmation aktif

### Backend
- [ ] Production sunucusu hazır (Railway/Heroku/AWS)
- [ ] SSL/HTTPS aktif
- [ ] CORS ayarları production URL'leri içeriyor
- [ ] Rate limiting ve DDoS koruması

### Veri Gizliliği
- [ ] User data encryption
- [ ] Secure token storage (SecureStore/Keychain)
- [ ] HTTPS-only communication
- [ ] No sensitive data in logs

---

## 📝 App Store Connect Ayarları

### App Information
- [ ] **Name:** İrfan
- [ ] **Subtitle:** Kur'an, Hadis ve İslami İlimler Rehberi
- [ ] **Category:** Education
- [ ] **Price:** Free
- [ ] **Age Rating:** 4+

### Version Information
- [ ] **Version:** 1.0.0
- [ ] **Build Number:** 1
- [ ] **What's New:** Release notes hazırlandı
- [ ] **Keywords:** Anahtar kelimeler girildi
- [ ] **Description:** Uygulama açıklaması girildi
- [ ] **Promotional Text:** Tanıtım metni girildi

### Contact Information
- [ ] **Support URL:** https://irfan-app.com/support
- [ ] **Marketing URL:** https://irfan-app.com
- [ ] **Privacy Policy URL:** https://irfan-app.com/privacy
- [ ] **Support Email:** support@irfan-app.com

### App Review Information
- [ ] **Contact Information:** İsim, telefon, email
- [ ] **Demo Account:** Test için demo hesap bilgileri
- [ ] **Notes:** Reviewers için özel notlar

---

## 🧪 Test Süreci

### Internal Testing (TestFlight)
- [ ] TestFlight ile internal beta test
- [ ] 5-10 kişilik test grubu
- [ ] Bug raporlarını topla ve düzelt
- [ ] Performance test (memory, CPU, battery)

### External Testing (TestFlight)
- [ ] 20-50 kişilik external beta test
- [ ] Gerçek kullanıcı geri bildirimleri
- [ ] UI/UX iyileştirmeleri
- [ ] Final bug fixes

### Checklist
- [ ] Tüm özellikler çalışıyor
- [ ] Crash yok
- [ ] Tüm ekranlar doğru görünüyor
- [ ] Network hatalarında graceful degradation
- [ ] Offline mode çalışıyor (demo mode)
- [ ] Deep linking çalışıyor (password reset)
- [ ] Push notifications (eğer varsa)

---

## 📤 Submission Süreci

### 1. Build Yükleme
```bash
# Production build
eas build --platform ios --profile production

# Build tamamlandığında
eas submit --platform ios
```

### 2. App Store Connect Submission
1. App Store Connect'e giriş yap
2. "My Apps" > "İrfan" seç
3. Yeni version oluştur (1.0.0)
4. Build seç
5. Metadata doldur
6. Screenshots yükle
7. "Submit for Review" tıkla

### 3. Review Notları
```
Test Hesabı:
Email: test@irfan-app.com
Şifre: Test123!

Uygulama Özellikleri:
- İslami yapay zeka asistanı
- Kur'an, Hadis ve İslami kaynaklara dayalı
- RAG (Retrieval-Augmented Generation) teknolojisi
- Kullanıcı sohbet geçmişi
- Offline demo mode mevcut

Not: Backend API bazen yavaş yanıt verebilir, bu durumda demo mode aktif olur.
```

---

## ⏱️ Bekleme Süreleri

- **Initial Review:** 24-48 saat (ortalama)
- **Re-submission (eğer reddedilirse):** 24 saat
- **Approval sonrası yayın:** Anında veya programlanmış tarih

---

## 🚨 Olası Red Nedenleri ve Çözümler

### 1. Eksik Metadata
**Sorun:** Privacy Policy veya Support URL eksik  
**Çözüm:** Web sayfası oluştur ve linkleri ekle

### 2. Crash veya Bug
**Sorun:** Uygulama crash oluyor  
**Çözüm:** Tüm crash'leri düzelt, try-catch ekle

### 3. Guideline İhlali
**Sorun:** App Store Guidelines'a uyumsuz  
**Çözüm:** Guidelines'ı oku ve uyumlu hale getir

### 4. Design Issues
**Sorun:** UI/UX kalitesiz  
**Çözüm:** Apple Human Interface Guidelines'a uygun tasarım

### 5. Performance Issues
**Sorun:** Yavaş veya donuyor  
**Çözüm:** Optimize et, loading states ekle

---

## 📊 Post-Launch

- [ ] Analytics entegre et (Firebase Analytics önerilir)
- [ ] Kullanıcı geri bildirimlerini takip et
- [ ] Bug raporlarını çöz
- [ ] Version 1.1.0 için feature roadmap hazırla
- [ ] Marketing ve tanıtım planı

---

## 📞 İletişim

**Sorunlar için:**
- Apple Developer Support: https://developer.apple.com/support/
- Expo Support: https://expo.dev/support
- Supabase Support: https://supabase.com/support

**Yararlı Linkler:**
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)

