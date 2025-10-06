# İrfan AI - Hızlı Başlatma Komutları

## 🚀 Projeyi Çalıştırma

### Terminal 1: Backend Başlatma

Backend'i başlatmak için bu komutları **ilk terminal**'de çalıştırın:

```bash
cd /Users/aerdincdal/Downloads/irfan-ai-main/irfan-ai/backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Not:** İlk çalıştırmada bağımlılıklar kurulacağı için biraz zaman alabilir. Sonraki çalıştırmalarda sadece bu komutu kullanın:

```bash
cd /Users/aerdincdal/Downloads/irfan-ai-main/irfan-ai/backend && source venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend çalıştığında:
- ✅ API: http://localhost:8000
- ✅ Swagger Docs: http://localhost:8000/docs

---

### Terminal 2: Frontend (React Native) Başlatma

Frontend'i başlatmak için **yeni bir terminal** açın ve bu komutu çalıştırın:

```bash
cd /Users/aerdincdal/Downloads/irfan-ai-main && npm start
```

Metro bundler açıldığında:
- **iOS Simulator için:** Terminalde `i` tuşuna basın
- **Android Emulator için:** Terminalde `a` tuşuna basın
- **QR Kod ile:** Expo Go uygulamasıyla QR kodu tarayın

---

## 📱 iOS Simulator'da Direkt Açma

Eğer doğrudan iOS Simulator'da açmak isterseniz:

```bash
cd /Users/aerdincdal/Downloads/irfan-ai-main && npx expo run:ios
```

---

## 🎯 Tek Komutla Her İkisini Birden (Opsiyonel)

Her iki servisi arka planda başlatmak için:

```bash
cd /Users/aerdincdal/Downloads/irfan-ai-main && (cd irfan-ai/backend && source venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &) && npm start
```

---

## 🛑 Servisleri Durdurma

Çalışan servisleri durdurmak için:

1. **Her terminalde:** `CTRL + C` basın

2. **Arka planda çalışanları durdurmak için:**
```bash
pkill -f uvicorn
pkill -f "node.*expo"
```

---

## 🔧 Environment Variables

### Backend (.env)

Backend klasöründe `.env` dosyası oluşturun:

```bash
cd /Users/aerdincdal/Downloads/irfan-ai-main/irfan-ai/backend
nano .env
```

İçeriği:
```env
HF_TOKEN=hf_your_hugging_face_token_here
HF_API_BASE=https://router.huggingface.co/v1
MODEL=openai/gpt-oss-120b:novita
DATABASE_URL=sqlite:///./app_data/irfan.sqlite3
```

### Frontend (.env)

Proje ana dizininde `.env` dosyası oluşturun:

```bash
cd /Users/aerdincdal/Downloads/irfan-ai-main
nano .env
```

İçeriği:
```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
BACKEND_URL=http://localhost:8000
```

---

## ✅ Kontrol Listesi

Başlatmadan önce:

- [ ] Python 3.8+ kurulu mu? → `python3 --version`
- [ ] Node.js kurulu mu? → `node --version`
- [ ] npm kurulu mu? → `npm --version`
- [ ] Backend .env dosyası hazır mı?
- [ ] Frontend .env dosyası hazır mı?
- [ ] Port 8000 boş mu? → `lsof -i :8000`
- [ ] Xcode kurulu mu? (iOS için)

---

## 📚 Faydalı Komutlar

### Backend için:
```bash
# Health check
curl http://localhost:8000/api/health

# API dokumentasyonu
open http://localhost:8000/docs
```

### Frontend için:
```bash
# Cache temizleme
npx expo start -c

# iOS build
npx expo run:ios

# Android build
npx expo run:android

# TypeScript hatalarını kontrol et
npx tsc --noEmit
```

### Xcode için:
```bash
# Xcode workspace'i aç
open /Users/aerdincdal/Downloads/irfan-ai-main/ios/rfan.xcworkspace

# Pod'ları güncelle
cd /Users/aerdincdal/Downloads/irfan-ai-main/ios && pod install
```

---

## 🐛 Sorun Giderme

### Backend başlamıyor
```bash
# Virtual environment'i yeniden oluştur
cd /Users/aerdincdal/Downloads/irfan-ai-main/irfan-ai/backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Frontend başlamıyor
```bash
# Node modules'ü temizle ve yeniden kur
cd /Users/aerdincdal/Downloads/irfan-ai-main
rm -rf node_modules package-lock.json
npm install
```

### Port zaten kullanımda
```bash
# Port 8000'i kullanan process'i bul ve durdur
lsof -ti:8000 | xargs kill -9

# Port 19000'i kullanan process'i bul ve durdur (Metro)
lsof -ti:19000 | xargs kill -9
```

### iOS build hatası
```bash
# Pod cache temizle
cd /Users/aerdincdal/Downloads/irfan-ai-main/ios
pod deintegrate
pod cache clean --all
pod install

# Xcode build folder temizle
rm -rf ~/Library/Developer/Xcode/DerivedData/*
```

---

## 🎉 Başarılı Başlatma

Her şey çalıştığında görecekleriniz:

**Terminal 1 (Backend):**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using watchfiles
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
✅ Startup completed successfully!
INFO:     Application startup complete.
```

**Terminal 2 (Frontend):**
```
Starting Metro Bundler
› Metro waiting on exp://192.168.1.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web
```

🚀 **Artık uygulama çalışıyor!**

