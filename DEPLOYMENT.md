# İrfan AI - Production Deployment Guide

## 📦 Tek Paket Deployment Stratejisi

Bu guide, İrfan AI uygulamasını backend ile birlikte tek bir production ortamında deploy etmek için hazırlanmıştır.

## 🏗️ Mimari Genel Bakış

```
┌─────────────────────────────────────────┐
│   React Native App (iOS/Android)        │
│   - Supabase Auth                       │
│   - Local caching                       │
│   - Offline fallback                    │
└──────────────┬──────────────────────────┘
               │ HTTPS
┌──────────────▼──────────────────────────┐
│   FastAPI Backend (irfan-ai)            │
│   - Port: 8000                          │
│   - RAG System (FAISS + BM25)          │
│   - HuggingFace LLM                    │
│   - SQLite (local sessions)            │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   Supabase (Production DB)              │
│   - User authentication                 │
│   - Chat history persistence            │
│   - User profiles                       │
└─────────────────────────────────────────┘
```

## 🚀 Backend Deployment

### Seçenek 1: Railway.app (Önerilen)

1. **Railway Hesabı Oluşturun**
   ```bash
   # Railway CLI yükleyin
   npm install -g @railway/cli
   railway login
   ```

2. **Backend'i Hazırlayın**
   ```bash
   cd irfan-ai/backend
   
   # .env dosyası oluşturun
   cat > .env << EOF
   HF_TOKEN=your_huggingface_token
   DATABASE_URL=sqlite:///./app_data/irfan.sqlite3
   CORS_ORIGINS=["*"]
   EOF
   ```

3. **Deploy Edin**
   ```bash
   railway init
   railway up
   
   # Domain alın
   railway domain
   ```

4. **Health Check**
   ```bash
   curl https://your-app.railway.app/api/health
   ```

### Seçenek 2: Render.com

1. **Render'da Yeni Web Service Oluşturun**
   - Repository: GitHub repo'nuzu bağlayın
   - Root Directory: `irfan-ai/backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

2. **Environment Variables**
   ```
   HF_TOKEN=your_token
   DATABASE_URL=sqlite:///./app_data/irfan.sqlite3
   ```

### Seçenek 3: Docker + VPS

1. **Dockerfile Oluşturun**
   ```dockerfile
   FROM python:3.11-slim
   
   WORKDIR /app
   
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   
   # NLTK data
   RUN python -c "import nltk; nltk.download('punkt')"
   
   COPY app ./app
   COPY data ./data
   
   EXPOSE 8000
   
   CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

2. **Build & Run**
   ```bash
   docker build -t irfan-ai .
   docker run -p 8000:8000 \
     -e HF_TOKEN=your_token \
     -v $(pwd)/app_data:/app/app_data \
     irfan-ai
   ```

## 📱 Mobil App Deployment

### 1. Backend URL Konfigürasyonu

Mobil uygulamada backend URL'i ayarlamak için iki yol:

**A. Environment Variable (Build-time)**
```bash
# .env dosyasını güncelleyin
BACKEND_URL=https://your-backend.railway.app
HF_TOKEN=your_token_optional
```

**B. Runtime Configuration (Önerilen)**
- Kullanıcılar Settings > Backend Ayarları'ndan URL'i girebilir
- Demo mode otomatik fallback

### 2. iOS Build

```bash
# Development build
npx expo prebuild --platform ios
cd ios
pod install
cd ..
npx expo run:ios

# Production build (EAS)
eas build --platform ios --profile production
```

### 3. Android Build

```bash
# Development
npx expo run:android

# Production (EAS)
eas build --platform android --profile production
```

### 4. App Store Submission

**iOS:**
1. Xcode'da provisioning profiles ayarlayın
2. Archive oluşturun
3. App Store Connect'e yükleyin
4. Metadata ve screenshots ekleyin
5. Review'a gönderin

**Android:**
1. AAB dosyasını Google Play Console'a yükleyin
2. Store listing'i tamamlayın
3. Internal test'e gönderin
4. Production'a promote edin

## 🔒 Güvenlik Checklist

### Backend
- [ ] HF_TOKEN environment variable olarak saklanıyor
- [ ] CORS ayarları production domain'e kısıtlandı
- [ ] Rate limiting aktif
- [ ] HTTPS zorunlu
- [ ] Guardrails aktif (prompt injection, domain check)

### Mobile App
- [ ] API keys `.env` dosyasında ve `.gitignore`'da
- [ ] Backend URL runtime'da değiştirilebilir
- [ ] SSL pinning (opsiyonel, advanced)
- [ ] Supabase RLS (Row Level Security) aktif

## 📊 Monitoring & Logs

### Backend Monitoring

**Railway:**
```bash
railway logs
```

**Render:**
- Dashboard > Logs sekmesi

**Custom VPS:**
```bash
# PM2 ile
pm2 logs irfan-ai

# Docker ile
docker logs -f container_id
```

### Mobile App Analytics

**Sentry Integration (Önerilen)**
```bash
npm install @sentry/react-native
```

```typescript
// App.tsx'e ekleyin
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: __DEV__ ? "development" : "production",
});
```

## 🧪 Production Testing

### 1. Backend Health Check
```bash
curl https://your-backend.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "time": "2025-01-23T...",
  "model": "openai/gpt-oss-120b:novita",
  "hf_api_base": "https://router.huggingface.co/v1"
}
```

### 2. Chat Test
```bash
curl -X POST https://your-backend.com/api/irfan/chat \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Namaz nedir?",
    "language": "tr",
    "temperature": 0.2
  }'
```

### 3. Mobile App Test
1. Settings'den backend URL'i ayarlayın
2. "Test Et" butonuna basın
3. Chat'te bir soru sorun
4. Citations'ları kontrol edin

## 🔄 Update Strategy

### Backend Updates
```bash
# Railway
railway up

# Render
# Git push yapın, otomatik deploy olur

# Docker
docker build -t irfan-ai:v1.1 .
docker stop irfan-ai
docker run ... irfan-ai:v1.1
```

### Mobile App Updates

**Minor Updates (Bug fixes):**
- Code push kullanın (OTA updates)

**Major Updates (Native changes):**
```bash
eas build --platform all
eas submit --platform all
```

## 💰 Maliyet Tahmini

### Backend (Aylık)
- Railway Starter: $5/month (500 saat)
- Railway Pro: $20/month (sınırsız)
- Render Free: $0 (750 saat/month)
- Render Starter: $7/month (sınırsız)
- VPS (DigitalOcean): $6-12/month

### Mobile App
- Apple Developer: $99/year
- Google Play: $25 (one-time)
- EAS Build: Free (limited) / $29/month (unlimited)

### API Costs
- HuggingFace Inference: Pay-per-use veya Subscription
- Supabase: Free tier / $25/month (Pro)

**Total Minimum:** ~$15-20/month

## 🆘 Troubleshooting

### Backend Hatası
```bash
# Logs kontrol edin
railway logs --tail 100

# Health check
curl https://your-backend.com/api/health
```

### Mobile App Bağlanamıyor
1. Backend URL'i kontrol edin (https:// ile başlamalı)
2. CORS ayarlarını kontrol edin
3. Firewall/network kontrolü
4. Demo modu test edin

### RAG Sonuçları Boş
1. `data/` klasöründe PDF'ler var mı?
2. FAISS index oluşturuldu mu?
3. Backend startup logs'ta "Auto-ingest" mesajını kontrol edin

## 📚 Ek Kaynaklar

- [Railway Docs](https://docs.railway.app)
- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [Supabase Docs](https://supabase.com/docs)
- [HuggingFace Inference](https://huggingface.co/docs/api-inference)

## 🎯 Production Checklist

- [ ] Backend deployed ve çalışıyor
- [ ] Health endpoint erişilebilir
- [ ] PDF'ler yüklendi ve index oluşturuldu
- [ ] Supabase production instance ayarlı
- [ ] Mobile app backend URL'i ayarlı
- [ ] iOS build test edildi
- [ ] Android build test edildi
- [ ] App Store/Play Store metadata hazır
- [ ] Privacy Policy & Terms aktif
- [ ] Monitoring kuruldu
- [ ] Backup stratejisi belirlendi

---

**Son Güncelleme:** 23 Ocak 2025
**Versiyon:** 1.0.0

