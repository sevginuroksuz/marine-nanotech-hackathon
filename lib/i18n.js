"use client";

// English source copy — single source of truth for all UI text.
const EN_COPY = {
  app: {
    title: "Yachtdrop",
    subtitle: "Parts delivered to your berth",
    loading: "Loading...",
    offline: "Using cached data (offline mode)",
  },
  nav: {
    browse: "Browse",
    cart: "Cart",
    orders: "Orders",
    profile: "Profile",
  },
  search: {
    placeholder: "Search anchors, safety gear, engine parts…",
    clear: "Clear search",
    voiceSearch: "Voice search",
    listening: "Listening...",
    voiceNotSupported: "Voice search not supported in this browser",
  },
  categories: {
    all: "All",
    anchoring: "Anchoring & Docking",
    navigation: "Navigation",
    safety: "Safety",
    electrics: "Electrics",
    motor: "Motor",
    ropes: "Ropes",
    maintenance: "Maintenance",
  },
  products: {
    count: "{count} product",
    countPlural: "{count} products",
    noResults: "No results found",
    endOfList: "— You've reached the end —",
    nothingFound: "Nothing found",
    tryDifferent: "Try a different search or category",
    new: "New",
    outOfStock: "Out of Stock",
    addToCart: "Add {name} to cart",
    addedToCart: "{name} added to cart",
  },
  cart: {
    title: "Cart",
    empty: "Your cart is empty",
    close: "Close cart",
    total: "Total",
    checkout: "Checkout →",
    items: "{count} items",
  },
  checkout: {
    deliveryToBoat: "🚤 Delivery to Boat",
    marinaPickup: "📍 Marina Pickup",
    yourName: "Your name",
    namePlaceholder: "Captain's name",
    email: "Email",
    emailPlaceholder: "captain@example.com",
    phone: "Phone",
    phonePlaceholder: "+34 600 000 000",
    marinaName: "Marina name",
    marinaPlaceholder: "e.g. Port Vell",
    berthPontoon: "Berth / Pontoon",
    berthPlaceholder: "e.g. Pontoon B, Berth 12",
    pickupLocation: "Pickup location",
    selectMarina: "Select marina…",
    placeOrder: "🛒 Place Order",
    processing: "Processing...",
    errors: {
      name: "Please enter your name.",
      email: "Please enter a valid email.",
      marina: "Please enter a marina name.",
      berth: "Please enter your berth or pontoon.",
      pickupMarina: "Please select a pickup marina.",
      generic: "Something went wrong. Please try again.",
    },
  },
  success: {
    title: "Order Confirmed!",
    orderNum: "Order #{orderNumber}",
    message: "Your parts are on their way.\nWe'll deliver to your berth shortly.",
    trackOrder: "Track Your Order",
    continueShopping: "Continue Shopping",
    shareOrder: "Share Order Details",
  },
  track: {
    back: "← Back",
    title: "Track Your Order",
    subtitle: "Find your delivery status",
    byPhone: "📱 Phone Number",
    byOrder: "🔢 Order Number",
    phoneLabel: "Phone Number",
    phonePlaceholder: "+34 600 123 456",
    phoneHint: "Enter the phone number you used when placing your order",
    orderLabel: "Order Number",
    orderPlaceholder: "YD-12345",
    orderHint: "Your order number starts with YD- followed by 5 digits",
    viewMyOrders: "View My Orders",
    trackOrder: "Track Order",
    searching: "Searching...",
    orderNotFound: "Order not found",
    noOrdersFound: "No orders found for this phone number",
    connectionError: "Unable to connect. Please try again.",
    tipTitle: "💡 Tip",
    tipPhone: "Using your phone number, you can view all your orders in one place.",
    tipOrder: "You can find your order number in the confirmation screen or email.",
  },
  profile: {
    title: "⚓ Profile",
    subtitle: "Your Yachtdrop Account",
    installApp: "Install App",
    installDescription: "Install Yachtdrop on your device for instant access without opening a browser.",
    installNow: "Install Now",
    appInstalled: "App Installed",
    appInstalledDesc: "You're using Yachtdrop as an app!",
    quickActions: "Quick Actions",
    trackOrders: "Track Orders",
    findShipments: "Find your shipments",
    myOrders: "My Orders",
    orderHistory: "Order history & status",
    continueShopping: "Continue Shopping",
    browseProducts: "Browse products",
    about: "About",
    appName: "App Name",
    version: "Version",
    buildDate: "Build Date",
    helpSupport: "Help & Support",
    faqs: "FAQs",
    contactSupport: "Contact Support",
    termsPrivacy: "Terms & Privacy",
    footer: "Made for sailors, by sailing enthusiasts 🌊",
    footerSub: "Optimized for mobile • Offline-capable • Ultra-fast",
  },
  contact: {
    title: "📧 Contact",
    subtitle: "Get in touch with Yachtdrop",
    email: "Email",
    phone: "Phone",
    address: "Address",
  },
  faq: {
    title: "❓ FAQs",
    subtitle: "Frequently Asked Questions",
    stillQuestions: "Still have questions?",
    contactSupport: "Contact Support",
  },
  emergency: {
    button: "🚨 Emergency",
    title: "🚨 Emergency Supplies",
    subtitle: "Critical safety equipment — fast delivery",
    quickOrder: "⚡ Quick Order All Safety Essentials",
    addAll: "Add All to Cart",
    close: "Close",
    categories: "Life jackets, flares, first aid, fire extinguishers",
    added: "Emergency items added to cart!",
    noProducts: "No emergency products available right now",
  },
  marina: {
    title: "🗺️ Marina Map",
    subtitle: "Find delivery locations",
    deliveryZone: "Delivery Zone",
    estimatedTime: "Est. delivery: {time}",
    selectMarina: "Select this marina",
    close: "Close map",
    yourLocation: "Your Location",
    available: "Available",
    comingSoon: "Coming Soon",
  },
  language: {
    title: "Language",
    en: "English",
    es: "Español",
    tr: "Türkçe",
    fr: "Français",
  },
};

function resolveKey(key) {
  const parts = key.split(".");
  let val = EN_COPY;
  for (const p of parts) {
    val = val?.[p];
  }
  return typeof val === "string" ? val : undefined;
}

function interpolate(str, params = {}) {
  if (typeof str !== "string") return str;
  return str.replace(/\{(\w+)\}/g, (_, p) => (params[p] !== undefined ? params[p] : `{${p}}`));
}

// Hook for components — returns English text directly.
export function useT() {
  const t = (key, params = {}) => {
    const base = resolveKey(key) || key;
    return interpolate(base, params);
  };
  return { t };
}
