#  Yachtdrop  Marine Delivery Platform

> **Marine Nanotech Hackathon 2025 Submission**

###  Live Demo: [https://yachtdrop-zeta.vercel.app](https://yachtdrop-zeta.vercel.app)

---

##  English

### What is Yachtdrop?

**Yachtdrop** is a mobile-first e-commerce and delivery platform built specifically for marina and yacht owners. It allows customers to order marine supplies, food, beverages, and nautical equipment directly to their boat  or pick up from the marina store.

Built for the **Marine Nanotech Hackathon**, the app solves a real problem: getting essential supplies to boats anchored in marinas quickly and conveniently, without leaving the vessel.

###  Features

| Feature | Description |
|---|---|
|  **Live Product Catalog** | Real-time products scraped from nautichandler.com with images, prices, and descriptions |
|  **Search & Filter** | Instant search + category filtering across all products |
|  **Shopping Cart** | Full cart management with quantity controls and swipe-to-delete |
|  **Boat Delivery** | Enter your boat name, marina name, and berth/mooring number |
|  **Marina Pickup** | Choose marina pickup as an alternative to delivery |
|  **Marina Map** | Interactive map showing marina location, berths, and facility points |
|  **Order Tracking** | Real-time order status tracker (YD-XXXXX order numbers) |
|  **Voice Search** | Web Speech API powered voice search for hands-free browsing |
|  **Emergency Mode** | One-tap emergency order flow for urgent supplies |
|  **PWA** | Installable as a native app on iOS and Android |
|  **Infinite Scroll** | Seamless product browsing with skeleton loaders |
|  **Pull to Refresh** | Native mobile pull-to-refresh gesture support |
|  **My Orders** | Full order history and detail view |
|  **Mock Checkout** | Complete checkout flow with order confirmation screen |

###  Tech Stack

- **Framework:** Next.js 14.2 (App Router)
- **Styling:** CSS Modules (mobile-first)
- **State Management:** Zustand
- **Data:** Live scraper from nautichandler.com + fallback JSON
- **Deployment:** Vercel
- **PWA:** Custom service worker + Web App Manifest

###  Running Locally

```bash
git clone https://github.com/sevginuroksuz/marine-nanotech-hackathon.git
cd marine-nanotech-hackathon
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

##  Türkçe

### Yachtdrop Nedir?

**Yachtdrop**, marina ve yat sahipleri için tasarlanmış, mobil öncelikli bir e-ticaret ve teslimat platformudur. Müşteriler, deniz malzemeleri, yiyecek, içecek ve nautik ekipmanları doğrudan teknelerine sipariş edebilir ya da marina mağazasından teslim alabilirler.

**Marine Nanotech Hackathon** için geliştirilmiş olan bu uygulama, marinalardaki teknelere hızlı ve pratik bir şekilde temel malzeme ulaştırma sorununu çözmektedir.

###  Özellikler

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

###  Teknoloji Yığını

- **Framework:** Next.js 14.2 (App Router)
- **Stil:** CSS Modules (mobil öncelikli)
- **State Yönetimi:** Zustand
- **Veri:** nautichandler.com canlı scraper + yedek JSON
- **Deployment:** Vercel
- **PWA:** Özel service worker + Web App Manifest

###  Yerel Çalıştırma

```bash
git clone https://github.com/sevginuroksuz/marine-nanotech-hackathon.git
cd marine-nanotech-hackathon
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) adresini tarayıcınızda açın.

---

##  Proje Yapısı / Project Structure

```
yachtdrop/
 app/              # Next.js sayfa ve API routeları / Pages & API routes
    api/          # Backend API (products, orders, payment)
    products/     # Ürün detay sayfası / Product detail
    my-orders/    # Sipariş geçmişi / Order history
    track/        # Sipariş takibi / Order tracking
    payment/      # Ödeme akışı / Payment flow
 components/       # Yeniden kullanılabilir bileşenler / Reusable UI components
 lib/              # Yardımcı fonksiyonlar / Utilities (scraper, store, cache)
 data/             # Yedek ürün verisi / Fallback product data
 public/           # Statik dosyalar / Static files (icons, manifest, sw.js)
```

---

*Built with  for Marine Nanotech Hackathon 2025*
