# Uploads Klasörü

Bu klasör, PDF formatındaki İslami kaynakların yüklenmesi için kullanılır.

## Yapı

```
uploads/
├── pdf/
│   ├── kuran/          # Kur'an tefsiri ve meal kitapları
│   ├── hadis/          # Hadis kitapları (Buhari, Müslim, vb.)
│   ├── gizli-ilimler/  # Mustafa İloğlu - Gizli İlimler Hazinesi
│   └── havas/          # Havas ve ruhaniyat kitapları
```

## Kullanım

1. PDF dosyalarınızı ilgili kategoriye yerleştirin
2. Backend'i yeniden başlatın veya `/api/reindex` endpoint'ini çağırın
3. Sistem otomatik olarak PDF'leri metin formatına çevirir ve indeksler

## Otomatik İşleme

- Yeni/değişen PDF'ler otomatik tespit edilir
- `.txt` formatına dönüştürülür ve `data/` klasörüne kaydedilir
- BM25 ve FAISS indeksleri yeniden oluşturulur

