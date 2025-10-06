# İrfan AI - Hızlı Başlangıç Rehberi

## 🚀 Tek Komutla Başlatma

### 1. Backend + Metro'yu Birlikte Başlat

```bash
./START_SERVICES.sh
```

Bu script otomatik olarak:
- ✅ Backend'i başlatır (http://localhost:8000)
- ✅ Metro bundler'ı başlatır
- ✅ Gerekli kontrolleri yapar

---

## 📱 Manuel Başlatma (Adım Adım)

### Adım 1: Backend'i Başlat

```bash
# Terminal 1
cd irfan-ai/backend

# Virtual environment aktif et
source venv/bin/activate

# Backend'i başlat
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Başarılı çıktı:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

✅ Backend hazır: http://localhost:8000
📚 API Docs: http://localhost:8000/docs

---

### Adım 2: Metro Bundler'ı Başlat

```bash
# Terminal 2 (ana dizinde)
npm start
# veya
npx expo start
```

**QR kod görünecek** - iOS Simulator'da çalıştırmak için:

```bash
# Terminal 3
npm run ios
```

---

## 🔧 Gerekli Ayarlar

### Backend .env Dosyası

```bash
cd irfan-ai/backend
cp .env.example .env
nano .env
```

**Minimum gerekli:**
```env
HF_TOKEN=your_huggingface_token_here
```

HuggingFace token almak için:
1. https://huggingface.co/ hesap oluştur
2. Settings > Access Tokens
3. "New token" oluştur (Read yetkisi yeterli)

---

### Frontend .env Dosyası (Opsiyonel)

```bash
# Ana dizinde
cp .env.example .env
nano .env
```

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
BACKEND_URL=http://localhost:8000
HF_TOKEN=your_huggingface_token
```

**Not:** BACKEND_URL varsayılan olarak `http://localhost:8000` kullanılır.

---

## ✅ Test Etme

### 1. Backend Testi

Tarayıcıda aç:
```
http://localhost:8000/api/health
```

Başarılı yanıt:
```json
{
  "status": "ok",
  "time": "2025-01-02T...",
  "model": "openai/gpt-oss-120b:novita",
  "hf_api_base": "https://router.huggingface.co/v1"
}
```

### 2. iOS Simulator Testi

```bash
npm run ios
```

Simulator açılacak ve uygulama yüklenecek.

---

## 🎯 İlk Kullanım

1. **Kayıt Ol / Giriş Yap**
   - Email ve şifre ile kayıt ol
   - Email doğrulama gerekebilir (Supabase ayarlarına göre)

2. **Sohbet Başlat**
   - Ana ekranda örnek sorulardan birine tıkla
   - veya kendi sorunuzu yazın

3. **Streaming Yanıt**
   - LLM yanıtı kelime kelime ekrana gelecek
   - Markdown formatları otomatik temizlenir
   - Maksimum 512 token yanıt

---

## 🐛 Sorun Giderme

### Backend başlamıyor

**Hata:** `ModuleNotFoundError: No module named 'uvicorn'`

**Çözüm:**
```bash
cd irfan-ai/backend
source venv/bin/activate
pip install -r requirements.txt
```

---

### "Backend URL yapılandırılmamış" hatası

**Çözüm 1:** .env dosyası oluştur
```bash
echo "BACKEND_URL=http://localhost:8000" > .env
```

**Çözüm 2:** islamicApi.ts'de zaten varsayılan var, app'i yeniden başlat

---

### iOS Simulator açılmıyor

**Gerekli:** Xcode 15+ kurulu olmalı

**Çözüm:**
```bash
# Xcode command line tools kur
sudo xcode-select --install

# Pods kur
cd ios
pod install
cd ..

# Tekrar dene
npm run ios
```

---

### Streaming çalışmıyor

**Kontroller:**
1. Backend çalışıyor mu? → http://localhost:8000/api/health
2. .env dosyasında BACKEND_URL doğru mu?
3. Console'da hata var mı? → Chrome DevTools / Safari Web Inspector

---

## 📊 Logları Görme

### Backend Logs
Backend terminal'inde tüm API istekleri görünür:
```
INFO:     127.0.0.1:52891 - "POST /api/irfan/chat HTTP/1.1" 200 OK
```

### Frontend Logs
Metro terminal'inde veya Xcode console'unda:
```
LOG  Streaming error: ...
```

---

## 🛑 Servisleri Durdurma

**Tüm servisleri durdur:**
```bash
# START_SERVICES.sh kullandıysanız
CTRL + C

# Manuel başlattıysanız
# Her terminal'de CTRL + C
```

**Process'leri kontrol et:**
```bash
# Backend process'i bul
ps aux | grep uvicorn

# Metro process'i bul  
ps aux | grep expo

# Öldür (PID ile)
kill <PID>
```

---

## 🎬 Özet Komutlar

### Tek komutla başlat:
```bash
./START_SERVICES.sh
```

### Manuel 3 adımda başlat:
```bash
# Terminal 1: Backend
cd irfan-ai/backend && source venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Metro
npm start

# Terminal 3: iOS
npm run ios
```

---

## 📞 Yardım

Sorun yaşıyorsanız:
1. Bu README'yi baştan sona okuyun
2. `BUILD_INSTRUCTIONS.md` dosyasına bakın
3. Backend loglarını kontrol edin
4. Frontend console'unu kontrol edin

**Backend API Dökümantasyonu:**
http://localhost:8000/docs

---

Mutlu kodlamalar! 🎉

