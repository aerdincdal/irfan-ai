# İrfan - Build ve Deploy Talimatları

## 📋 Ön Gereksinimler

### Gerekli Yazılımlar
- **Node.js** 18+ ([nodejs.org](https://nodejs.org/))
- **npm** veya **yarn**
- **Expo CLI** (`npm install -g expo-cli`)
- **EAS CLI** (`npm install -g eas-cli`)
- **Xcode** 15+ (iOS build için - sadece macOS)
- **CocoaPods** (iOS için - `sudo gem install cocoapods`)

### Hesaplar
- Expo hesabı ([expo.dev](https://expo.dev/))
- Apple Developer hesabı ($99/yıl) - iOS için
- Supabase hesabı ([supabase.com](https://supabase.com/))
- HuggingFace hesabı ([huggingface.co](https://huggingface.co/))

---

## 🚀 Backend Setup

### 1. Backend Dizinine Git
```bash
cd irfan-ai/backend
```

### 2. Virtual Environment Oluştur
```bash
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 3. Bağımlılıkları Yükle
```bash
pip install -r requirements.txt
```

### 4. Environment Variables Ayarla
`.env` dosyası oluştur:
```bash
cp .env.example .env
```

`.env` dosyasını düzenle:
```env
HF_TOKEN=your_huggingface_token
HF_API_BASE=https://router.huggingface.co/v1
MODEL=openai/gpt-oss-120b:novita
TEMPERATURE=0.2
TOP_P=0.95
MAX_TOKENS=512
DATABASE_URL=sqlite:///./app_data/irfan.sqlite3
CORS_ORIGINS=*
```

### 5. PDF Kaynaklarını Ekle
```bash
# PDF'leri uploads klasörüne kopyala
cp your-pdfs/*.pdf uploads/pdf/kuran/
cp your-pdfs/*.pdf uploads/pdf/hadis/
# vb...
```

### 6. Backend'i Başlat
```bash
# Development
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production (Gunicorn ile)
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### 7. Backend'i Deploy Et (Railway Örneği)
```bash
# Railway CLI kur
npm install -g @railway/cli

# Login
railway login

# Deploy
cd irfan-ai/backend
railway up
```

---

## 📱 Frontend Setup

### 1. Proje Dizinine Dön
```bash
cd ../..  # irfan-ai root dizinine dön
```

### 2. Bağımlılıkları Yükle
```bash
npm install
# veya
yarn install
```

### 3. Environment Variables Ayarla
`.env` dosyası oluştur (root dizinde):
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
BACKEND_URL=https://your-backend-url.railway.app
HF_TOKEN=your-huggingface-token
```

### 4. Supabase Setup

#### Supabase Projesini Oluştur
1. [supabase.com](https://supabase.com/) üzerinde yeni proje oluştur
2. Project Settings > API'den URL ve anon key'i kopyala

#### Migration'ları Çalıştır
```bash
cd supabase

# Supabase CLI kur (ilk kez)
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 5. Development Modda Çalıştır
```bash
# Expo development server
npm start

# iOS simulator
npm run ios

# Android emulator
npm run android
```

---

## 🏗️ Production Build

### iOS Build (EAS)

#### 1. EAS CLI'ı Yapılandır
```bash
# EAS login
eas login

# EAS projesini bağla
eas build:configure
```

#### 2. Credentials Ayarla
```bash
# iOS credentials oluştur
eas credentials

# Veya otomatik
eas build --platform ios --profile production
```

#### 3. Build Oluştur
```bash
# Preview build (internal testing)
eas build --platform ios --profile preview

# Production build (App Store)
eas build --platform ios --profile production
```

#### 4. Build'i İzle
```bash
# Build sayfasını aç
eas build:list

# Detayları göster
eas build:view <build-id>
```

---

## 📤 App Store Submission

### 1. Build'i İndir ve Test Et
```bash
# Build tamamlandığında
eas build:download --platform ios

# TestFlight'a yükle
eas submit --platform ios
```

### 2. App Store Connect'te Ayarla
1. [App Store Connect](https://appstoreconnect.apple.com/) aç
2. "My Apps" > "+" > "New App" tıkla
3. App bilgilerini doldur:
   - **Name:** İrfan
   - **Primary Language:** Turkish
   - **Bundle ID:** com.irfan.app
   - **SKU:** irfan-app-001

4. Version Information:
   - **What's New:** Release notes
   - **Description:** APP_STORE_METADATA.md'den kopyala
   - **Keywords:** Anahtar kelimeleri gir
   - **Screenshots:** Ekran görüntülerini yükle
   - **App Icon:** 1024x1024 icon yükle

5. Pricing and Availability:
   - **Price:** Free
   - **Availability:** All countries (veya seçili ülkeler)

6. App Review Information:
   - Demo account bilgileri
   - Review notları

7. "Submit for Review" tıkla

---

## 🧪 Testing

### Unit Tests
```bash
# Frontend tests
npm test

# Backend tests
cd irfan-ai/backend
pytest
```

### E2E Tests
```bash
# Detox ile (opsiyonel)
npm run test:e2e
```

### Manual Testing Checklist
- [ ] Kullanıcı kaydı ve girişi
- [ ] Chat fonksiyonu
- [ ] Sohbet geçmişi
- [ ] Session limiti (30)
- [ ] Offline mode (demo)
- [ ] Deep linking (password reset)
- [ ] iOS farklı cihazlarda test
- [ ] iPad desteği
- [ ] Dark mode
- [ ] Network hatası durumları

---

## 🔧 Troubleshooting

### Build Hataları

**Hata:** "Could not find matching eas.json configuration"
```bash
# Çözüm
eas build:configure
```

**Hata:** "iOS Bundle Identifier mismatch"
```bash
# app.json'da bundleIdentifier kontrol et
# eas.json'da da aynı olmalı
```

**Hata:** "Provisioning profile doesn't include signing certificate"
```bash
# Credentials'ı temizle ve yeniden oluştur
eas credentials
```

### Runtime Hataları

**Backend bağlantı hatası:**
- `.env` dosyasındaki `BACKEND_URL`'i kontrol et
- Backend'in çalıştığından emin ol
- CORS ayarlarını kontrol et

**Supabase hatası:**
- Supabase credentials'ları kontrol et
- RLS policies'leri kontrol et
- Migration'ların çalıştığından emin ol

---

## 📊 Analytics ve Monitoring

### Firebase Setup (Önerilen)
```bash
# Firebase CLI kur
npm install -g firebase-tools

# Firebase projesini bağla
firebase login
firebase init

# Analytics ekle
expo install @react-native-firebase/app @react-native-firebase/analytics
```

### Sentry Setup (Crash Reporting)
```bash
npm install @sentry/react-native

# Sentry init
npx @sentry/wizard -i reactNative
```

---

## 🔄 Continuous Deployment

### GitHub Actions ile Otomatik Build

`.github/workflows/build.yml` oluştur:
```yaml
name: EAS Build
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx eas-cli build --platform all --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

---

## 📝 Version Management

### Yeni Version Çıkarma
```bash
# Version bump
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# app.json'da version ve buildNumber'ı manuel güncelle
# iOS buildNumber her build'de artmalı

# Build
eas build --platform ios --profile production

# Submit
eas submit --platform ios
```

---

## 🆘 Destek

**Sorun yaşıyorsanız:**
- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Apple Developer Forums](https://developer.apple.com/forums/)
- [Supabase Docs](https://supabase.com/docs)

**İletişim:**
- Email: support@irfan-app.com
- GitHub Issues: https://github.com/your-repo/irfan-ai/issues

