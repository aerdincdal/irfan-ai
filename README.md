# İrfan - İslami Yapay Zeka Asistanı

Kur'an-ı Kerim, hadisler ve İslami ilimler hakkında bilgi sağlayan yapay zeka destekli mobil uygulama.

## 🚀 Özellikler

### Frontend (React Native)
- ✅ Kullanıcı kimlik doğrulama (Supabase Auth)
- ✅ Chat geçmişi ve session yönetimi
- ✅ Modern ve minimal UI/UX
- ✅ iOS ve Android desteği
- ✅ Deep linking desteği (şifre sıfırlama)
- ✅ Offline demo modu (fallback)
- ✅ Citations (kaynak gösterimi)
- ✅ Backend connection status indicator
- ✅ Runtime backend configuration

### Backend (FastAPI + RAG)
- ✅ RAG System (FAISS + BM25 hybrid retrieval)
- ✅ HuggingFace LLM integration
- ✅ Guardrails (prompt injection, domain validation)
- ✅ Multi-language support (TR, AR, both)
- ✅ Session management
- ✅ Automatic PDF ingestion
- ✅ Source citations
- ✅ RESTful API

## 📋 Gereksinimler

- Node.js 18+ 
- npm veya yarn
- Expo CLI
- iOS: Xcode 15+ (Simulator için)
- Android: Android Studio

## 🛠️ Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Environment Variables

Proje root'unda bir `.env` dosyası oluşturun:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
BACKEND_URL=your_backend_api_url
```

### 3. Uygulamayı Başlatın

#### Development Mode (Expo Go)
```bash
npm start
# veya
npx expo start
```

#### iOS Simulator (Xcode gerekli)
```bash
npm run ios
```

#### Android Emulator
```bash
npm run android
```

## 🏗️ Proje Yapısı

```
irfan/
├── src/
│   ├── assets/          # Görseller ve ikonlar
│   ├── components/      # React bileşenleri
│   │   ├── ui/         # UI kit bileşenleri
│   │   ├── AuthScreen.tsx
│   │   ├── ChatBubble.tsx
│   │   └── ...
│   ├── hooks/          # Custom React hooks
│   ├── integrations/   # Supabase entegrasyonu
│   ├── lib/            # Yardımcı fonksiyonlar
│   ├── navigations/    # React Navigation yapılandırması
│   ├── pages/          # Sayfa bileşenleri
│   ├── services/       # API servisleri
│   └── types/          # TypeScript type tanımlamaları
├── app.json            # Expo yapılandırması
├── babel.config.js     # Babel yapılandırması
└── package.json        # NPM bağımlılıkları
```

## 🔧 Yapılandırma

### Backend Setup

1. **Backend'i Başlatın**
   ```bash
   cd irfan-ai/backend
   
   # Virtual environment
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   
   # Dependencies
   pip install -r requirements.txt
   
   # Environment
   cp .env.example .env
   # HF_TOKEN'ınızı ekleyin
   
   # Run
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **PDF'leri Yükleyin**
   ```bash
   # uploads/pdf/ klasörüne İslami kaynaklarınızı koyun
   cp your-books.pdf irfan-ai/backend/uploads/pdf/
   
   # Backend restart ile otomatik ingest olur
   ```

### Mobile App Configuration

**Seçenek 1: Build-time (Environment Variable)**
```bash
# .env dosyasını düzenleyin
BACKEND_URL=http://localhost:8000  # Geliştirme
# veya
BACKEND_URL=https://your-backend.railway.app  # Production
```

**Seçenek 2: Runtime (Önerilen)**
- Uygulamayı başlatın
- Settings > Backend Ayarları
- Backend URL'i girin (örn: `http://localhost:8000` veya production URL)
- "Test Et" ile bağlantıyı doğrulayın
- "Kaydet"

### Backend API Endpoints

**API Endpoint:**
- `POST /api/irfan/chat` - Soru-cevap endpoint'i

**Request Format:**
```json
{
  "query": "string",
  "session_id": "uuid",
  "stream": false,
  "language": "tr",
  "temperature": 0.2,
  "top_p": 0.95,
  "max_tokens": 800
}
```

**Response Format:**
```json
{
  "answer": "string",
  "sources": ["string"],
  "confidence": 0.8,
  "category": "quran" | "hadith" | "fiqh" | "dua" | "general"
}
```

### Supabase Veritabanı

Gerekli tablolar:
- `profiles` - Kullanıcı profilleri
- `chat_sessions` - Chat oturumları
- `chat_messages` - Mesajlar

Migration dosyaları `supabase/migrations/` dizininde bulunmaktadır.

## 📱 App Store Hazırlık Checklist

### ✅ Tamamlanan

- [x] Babel config (react-native-dotenv)
- [x] Environment variables güvenliği
- [x] iOS bundle identifier: `com.irfan.app`
- [x] Privacy descriptions (NSCameraUsageDescription, etc.)
- [x] Privacy Policy & Terms of Service sayfaları
- [x] Deep linking yapılandırması
- [x] Splash screen ve app icon
- [x] Dependencies güncel

### ⏳ Yapılacaklar

- [ ] Xcode kurulumu (iOS build için)
- [ ] Backend API bağlantısı test
- [ ] App Store Connect hesabı
- [ ] Production build ve test
- [ ] App Store Screenshots
- [ ] App Store açıklaması hazırlama

## 🧪 Test

### Demo Modu

Backend bağlantısı olmadan uygulama demo modda çalışır. Bazı örnek sorular:

- "Namaz nedir?"
- "Kur'an hakkında bilgi ver"
- "Dua öğret"

### Gerçek Backend Testi

1. Settings'den backend URL'i ayarlayın
2. API Key varsa ekleyin
3. Chat sayfasından soru sorun

## 📦 Build

### Development Build
```bash
npx expo prebuild
```

### Production Build (EAS)
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

## 🔐 Güvenlik

- ✅ API keys `.env` dosyasında
- ✅ `.env` dosyası `.gitignore`'da
- ✅ Supabase RLS (Row Level Security) aktif
- ✅ HTTPS zorunlu

## 📄 Lisans

Bu proje özel bir projedir ve tüm hakları saklıdır.

---

**Not:** iOS Simulator'da çalıştırmak için Xcode'un tam sürümü gereklidir. Command Line Tools yeterli değildir.

