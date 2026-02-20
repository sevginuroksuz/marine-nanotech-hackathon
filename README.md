<div align="center">

#  Yachtdrop  Marine Delivery Platform

** Live Demo: [https://yachtdrop-sevgi-nur-oksuzs-projects.vercel.app](https://yachtdrop-sevgi-nur-oksuzs-projects.vercel.app)**

> Marine Nanotech Hackathon 2025 Submission

[![TR](https://img.shields.io/badge/lang-TR-red.svg)](./README.tr.md)
[![EN](https://img.shields.io/badge/lang-EN-blue.svg)](./README.md)

</div>

---

## What is Yachtdrop?

**Yachtdrop** is a mobile-first e-commerce and delivery platform built specifically for marina and yacht owners. Customers can order marine supplies, food, beverages, and nautical equipment directly to their boat  or pick up from the marina store.

Built for the **Marine Nanotech Hackathon**, the app solves a real problem: getting essential supplies to boats anchored in marinas quickly and conveniently, without leaving the vessel.

---

##  Features

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

---

##  Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14.2 (App Router) |
| Styling | CSS Modules (mobile-first) |
| State | Zustand |
| Data | Live scraper from nautichandler.com + fallback JSON |
| Deployment | Vercel |
| PWA | Custom service worker + Web App Manifest |

---

##  Running Locally

```bash
git clone https://github.com/sevginuroksuz/marine-nanotech-hackathon.git
cd marine-nanotech-hackathon
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

##  Project Structure

```
yachtdrop/
 app/              # Next.js pages & API routes
    api/          # Backend API (products, orders, payment)
    products/     # Product detail page
    my-orders/    # Order history
    track/        # Order tracking
    payment/      # Payment flow
 components/       # Reusable UI components
 lib/              # Utilities (scraper, store, cache)
 data/             # Fallback product data
 public/           # Static files (icons, manifest, sw.js)
```

---

<div align="center">
<i>Built with  for Marine Nanotech Hackathon 2025</i>
</div>

