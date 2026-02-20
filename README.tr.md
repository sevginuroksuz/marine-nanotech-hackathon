<div align="center">

#  Yachtdrop  Denizcilik Teslimat Platformu

** Canlı Demo: [https://yachtdrop-sevgi-nur-oksuzs-projects.vercel.app](https://yachtdrop-sevgi-nur-oksuzs-projects.vercel.app)**

> Marine Nanotech Hackathon 2025 Projesi

[![TR](https://img.shields.io/badge/lang-TR-red.svg)](./README.tr.md)
[![EN](https://img.shields.io/badge/lang-EN-blue.svg)](./README.md)

</div>

---

## Yachtdrop Nedir?

**Yachtdrop**, marina ve yat sahipleri için tasarlanmış, mobil öncelikli bir e-ticaret ve teslimat platformudur. Müşteriler, deniz malzemeleri, yiyecek, içecek ve nautik ekipmanları doğrudan teknelerine sipariş edebilir ya da marina mağazasından teslim alabilirler.

**Marine Nanotech Hackathon** için geliştirilmiş olan bu uygulama, marinalardaki teknelere hızlı ve pratik bir şekilde temel malzeme ulaştırma sorununu çözmektedir.

---

##  Özellikler

| Özellik | Açıklama |
|---|---|
|  **Canlı Ürün Kataloğu** | nautichandler.com'dan gerçek zamanlı çekilen ürünler  görsel, fiyat ve açıklama ile |
|  **Arama & Filtre** | Anlık arama ve kategori filtrelemesi |
|  **Alışveriş Sepeti** | Miktar kontrolü ve kaydırarak silme özellikli sepet yönetimi |
|  **Tekneye Teslimat** | Tekne adı, marina adı ve yanaşma yeri bilgisi girişi |
|  **Marinadan Teslim Al** | Teslimat yerine marinadan alma seçeneği |
|  **Marina Haritası** | Marina konumunu, rıhtımları ve tesisleri gösteren interaktif harita |
|  **Sipariş Takibi** | Gerçek zamanlı sipariş durumu takibi (YD-XXXXX numaraları) |
|  **Sesli Arama** | Web Speech API ile elleri serbest sesli arama |
|  **Acil Mod** | Acil ihtiyaçlar için tek dokunuşla hızlı sipariş akışı |
|  **PWA** | iOS ve Android'e yüklenebilir uygulama deneyimi |
|  **Sonsuz Kaydırma** | İskelet yükleyicili kesintisiz ürün gezintisi |
|  **Yenile (Çek-Bırak)** | Doğal mobil çekip bırakma ile yenileme |
|  **Siparişlerim** | Tüm sipariş geçmişi ve detay görünümü |
|  **Ödeme Simülasyonu** | Sipariş onay ekranlı tam ödeme akışı |

---

##  Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 14.2 (App Router) |
| Stil | CSS Modules (mobil öncelikli) |
| State Yönetimi | Zustand |
| Veri | nautichandler.com canlı scraper + yedek JSON |
| Deployment | Vercel |
| PWA | Özel service worker + Web App Manifest |

---

##  Yerel Çalıştırma

```bash
git clone https://github.com/sevginuroksuz/marine-nanotech-hackathon.git
cd marine-nanotech-hackathon
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) adresini tarayıcınızda açın.

---

##  Proje Yapısı

```
yachtdrop/
 app/              # Next.js sayfa ve API routeları
    api/          # Backend API (products, orders, payment)
    products/     # Ürün detay sayfası
    my-orders/    # Sipariş geçmişi
    track/        # Sipariş takibi
    payment/      # Ödeme akışı
 components/       # Yeniden kullanılabilir bileşenler
 lib/              # Yardımcı fonksiyonlar (scraper, store, cache)
 data/             # Yedek ürün verisi
 public/           # Statik dosyalar (ikonlar, manifest, sw.js)
```

---

<div align="center">
<i>Marine Nanotech Hackathon 2025 için  ile yapıldı</i>
</div>

