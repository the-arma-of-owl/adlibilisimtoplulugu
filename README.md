(Vibe Coding)# 🎯 CodeSpark Night - Adli Bilişim Topluluğu

Siber güvenlik alanında kariyer yönlendirmesi için interaktif test uygulaması.

## 🚀 Hızlı Başlangıç

### Yerel Geliştirme

```bash
# Bağımlılıkları yükle
npm install

# .env dosyası oluştur
cp .env.example .env
# .env dosyasını düzenle ve admin bilgilerini ayarla

# Sunucuyu başlat
npm start
```

Tarayıcıda `http://localhost:3000` adresine git.

## 📦 Deployment

Detaylı deployment rehberi için [DEPLOYMENT.md](./DEPLOYMENT.md) dosyasına bak.

### Hızlı Deployment (Railway)

1. GitHub'a push et
2. https://railway.app → "Deploy from GitHub"
3. Environment variables ekle:
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `PORT=3000`
4. ✅ Hazır!

## 📁 Proje Yapısı

```
├── public/              # Frontend dosyaları
│   ├── index.html      # Ana sayfa
│   ├── codesparknight.html  # Test sayfası
│   ├── adminpanel.html # Admin paneli
│   ├── codefest.html   # Projeksiyon ekranı
│   ├── css/            # Stil dosyaları
│   └── js/             # JavaScript dosyaları
├── data/               # Veritabanı (JSON)
│   └── users.json      # Kullanıcı verileri
├── server.js           # Express server
├── .env                # Environment variables (git'te yok)
└── package.json        # Bağımlılıklar
```

## 🔐 Güvenlik

- Admin şifresi `.env` dosyasında saklanır
- `.env` dosyası Git'e commit edilmez
- Production'da mutlaka güçlü şifre kullan!

## 📝 Özellikler

- ✅ 25 soruluk siber güvenlik testi
- ✅ 6 farklı alan yönlendirmesi
- ✅ Admin paneli (onaylama/silme)
- ✅ Projeksiyon ekranı (renkli kutucuklar)
- ✅ Material Design 3 teması
- ✅ Responsive tasarım

## 🛠️ Teknolojiler

- Node.js + Express
- Vanilla JavaScript
- HTML5 + CSS3
- JSON Database

## 📄 Lisans

ISC
