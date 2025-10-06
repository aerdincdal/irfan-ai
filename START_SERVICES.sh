#!/bin/bash

# İrfan AI - Servis Başlatma Script'i
# Bu script backend ve frontend servislerini başlatır

echo "🚀 İrfan AI Servisleri Başlatılıyor..."
echo ""

# Renkli çıktılar için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Backend kontrolü
echo "${YELLOW}📡 Backend hazırlanıyor...${NC}"

cd irfan-ai/backend

# Virtual environment var mı kontrol et
if [ ! -d "venv" ]; then
    echo "${YELLOW}⚙️  Virtual environment oluşturuluyor...${NC}"
    python3 -m venv venv
fi

# Virtual environment aktif et
source venv/bin/activate

# Bağımlılıklar kurulu mu kontrol et
if [ ! -f "venv/bin/uvicorn" ]; then
    echo "${YELLOW}📦 Backend bağımlılıkları kuruluyor...${NC}"
    pip install -r requirements.txt
fi

# .env dosyası var mı kontrol et
if [ ! -f ".env" ]; then
    echo "${RED}❌ HATA: .env dosyası bulunamadı!${NC}"
    echo "Lütfen .env.example'ı kopyalayıp .env olarak kaydedin ve HF_TOKEN'ınızı ekleyin."
    exit 1
fi

echo "${GREEN}✅ Backend hazır!${NC}"
echo ""

# Backend'i arka planda başlat
echo "${YELLOW}🔥 Backend başlatılıyor (http://localhost:8000)...${NC}"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo "${GREEN}✅ Backend başlatıldı! (PID: $BACKEND_PID)${NC}"
echo ""

# Ana dizine dön
cd ../..

# 2. Frontend hazırlama
echo "${YELLOW}📱 Frontend hazırlanıyor...${NC}"

# Node modules var mı kontrol et
if [ ! -d "node_modules" ]; then
    echo "${YELLOW}📦 Frontend bağımlılıkları kuruluyor...${NC}"
    npm install
fi

# .env dosyası var mı kontrol et
if [ ! -f ".env" ]; then
    echo "${YELLOW}⚠️  UYARI: .env dosyası bulunamadı!${NC}"
    echo "BACKEND_URL varsayılan olarak http://localhost:8000 kullanılacak."
fi

echo "${GREEN}✅ Frontend hazır!${NC}"
echo ""

# Metro başlat
echo "${YELLOW}🔥 Metro bundler başlatılıyor...${NC}"
npx expo start &
METRO_PID=$!

echo "${GREEN}✅ Metro başlatıldı! (PID: $METRO_PID)${NC}"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "${GREEN}🎉 Tüm servisler başarıyla başlatıldı!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📡 Backend:  http://localhost:8000"
echo "📡 API Docs: http://localhost:8000/docs"
echo "📱 Metro:    Terminal'de QR kod görünecek"
echo ""
echo "${YELLOW}📲 iOS Simulator'da çalıştırmak için:${NC}"
echo "   Başka bir terminal açın ve şunu çalıştırın:"
echo "   ${GREEN}npm run ios${NC}"
echo ""
echo "${YELLOW}🛑 Servisleri durdurmak için:${NC}"
echo "   ${RED}kill $BACKEND_PID $METRO_PID${NC}"
echo "   veya bu terminalde CTRL+C basın"
echo ""

# Kullanıcı CTRL+C basana kadar bekle
trap "echo ''; echo '${YELLOW}🛑 Servisler durduruluyor...${NC}'; kill $BACKEND_PID $METRO_PID 2>/dev/null; echo '${GREEN}✅ Servisler durduruldu!${NC}'; exit 0" INT

echo "${YELLOW}Logları görmek için bekliyor... (CTRL+C ile çıkış)${NC}"
wait

