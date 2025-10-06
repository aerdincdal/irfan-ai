
## Irfan Chat API (Mobil Entegrasyon için Hazır)

Bu servis, mobil uygulamanızda gerçek senaryoda 50.000+ eş zamanlı kullanıcıya hizmet verebilecek şekilde
streaming destekli sohbet, oturum/geçmiş yönetimi, PDF tabanlı RAG (otomatik ingest) ve domain guardrails içerir.

### Hızlı Başlangıç
1) Ortam
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export HF_TOKEN=hf_...    # .env de de tanımlayabilirsiniz
```

2) Çalıştırma
```bash
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

3) Sağlık
```bash
curl http://127.0.0.1:8000/api/health
```

### Oturum / Geçmiş
- Mobilde her cihaz kendi `session_id`'sini üretip saklar (örn. UUID4). Server yeni ID gelirse otomatik oluşturur.
- Endpoint’ler:
  - POST `/api/sessions` -> yeni oturum (opsiyonel; doğrudan `session_id` oluşturup kullanabilirsiniz)
  - GET `/api/sessions/{session_id}/messages` -> geçmişi getir
  - POST `/api/sessions/{session_id}/reset` -> geçmişi temizle
  - DELETE `/api/sessions/{session_id}` -> oturumu sil

### Sohbet Endpoint’i
POST `/api/irfan/chat`
Body:
```json
{
  "query": "Fatihanın tefsirinden ana başlıklar?",
  "session_id": "<cihazda-saklanan-uuid>",
  "stream": true,
  "language": "tr",  // tr|ar|both|auto
  "temperature": 0.2,
  "top_p": 0.95,
  "max_tokens": 800
}
```
- `stream: true` ise SSE akışı döner (`text/event-stream`) ve satırlar `data: {"token","done"}` formatındadır.

### RAG (PDF + Hibrit Arama)
- Klasörler:
  - Ham PDF: `backend/uploads/pdf/<kategori>/`
  - Metin kaynakları: `backend/app/data/{kuran,hadis,gizli-ilimler,havas}`
- Otomatik ingest: Sunucu açılışında `uploads/pdf` taranır, yeni/değişen PDF’ler `.txt`e dönüştürülür,
  ilgili klasöre yazılır ve BM25 + FAISS indeksleri yeniden kurulur.
- Hibrit arama: FAISS (SentenceTransformers) + BM25 sonuçları birleştirilir; kategori sinyaliyle doğru klasörden bağlam çekilir.

### Guardrails
- Domain kısıtı: Kur’an/tefsir, sahih hadis, Gizli İlimler/Havas. Küçük sohbetlere kısa Türkçe yanıt verilir.
- Ayet/Dua isteklerinde iki dilli çıktı (Arapça metin + Türkçe açıklama). Diğer her şeyde Türkçe.

### Mobil (React Native) Entegrasyon Önerisi
- Session ID üretimi: `react-native-uuid` veya `crypto.randomUUID()` ile bir kez üretip `AsyncStorage`’da saklayın.
- Streaming okuma (özet):
```javascript
const resp = await fetch(`${API_BASE}/api/irfan/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query, session_id, stream: true, language: 'tr' })
});
const reader = resp.body.getReader();
const decoder = new TextDecoder('utf-8');
let buffer = '';
for (;;) {
  const { value, done } = await reader.read();
  if (done) break;
  buffer += decoder.decode(value, { stream: true });
  for (const chunk of buffer.split('

')) {
    if (!chunk.startsWith('data:')) continue;
    const jsonStr = chunk.replace(/^data:\s*/, '').trim();
    if (!jsonStr) continue;
    const payload = JSON.parse(jsonStr);
    if (payload.token) appendToUI(payload.token);
    if (payload.done) finish(payload);
  }
  buffer = '';
}
```
- History/Gestures: Uygulamada gestures tabında `GET /api/sessions/{id}/messages` ile mesajları listeleyin.
  Silme/Reset için ilgili endpoint’leri çağırın. UI tarafında sanal liste/virtualization kullanın.

### Ölçeklenebilirlik
- Uvicorn + FastAPI tek instans ile binlerce SSE’yi kaldırabilir; 50k eşzamanlı için birden çok instans + reverse proxy (Nginx) önerilir.
- DB: Varsayılan SQLite (WAL) ile concurrency iyileştirildi. Prod’da harici Postgres önerilir.
- FAISS ve ST modeli bellek kullanır; büyük veri için instans başına bellek planlayın ve gerektiğinde shard/ayrık servis mimarisi düşünün.

### Ortam Değişkenleri (.env)
- `HF_TOKEN=hf_...`
- `HF_API_BASE` (opsiyonel, varsayılan `https://router.huggingface.co/v1`)
- `MODEL` (opsiyonel, varsayılan `openai/gpt-oss-120b:novita`)
- `DATABASE_URL` (opsiyonel, varsayılan `sqlite:///./app_data/irfan.sqlite3`)

