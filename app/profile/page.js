"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const QUICK_ACTIONS = [
  { icon: "📦", title: "Track Orders", subtitle: "Find your shipments", href: "/track" },
  { icon: "📋", title: "My Orders", subtitle: "Order history & status", href: "/my-orders" },
  { icon: "🛍️", title: "Continue Shopping", subtitle: "Browse products", href: "/" },
];

const HELP_LINKS = [
  { icon: "❓", label: "FAQs", href: "/faq" },
  { icon: "📧", label: "Contact Support", href: "/contact" },
  { icon: "📋", label: "Terms & Privacy", href: "/terms" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [appInfo, setAppInfo] = useState({
    version: "0.1.0",
    buildDate: "2026-02-19",
  });
  const translate = (t) => t;

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    console.log(`User response: ${outcome}`);
    setInstallPrompt(null);
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>{translate("⚓ Profile")}</h1>
        <p>{translate("Your Yachtdrop Account")}</p>
      </header>

      <div className={styles.content}>
        {/* PWA Install Section */}
        {installPrompt && !isInstalled && (
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.icon}>📱</span>
              <h2>{translate("Install App")}</h2>
            </div>
            <p className={styles.cardDescription}>
              {translate("Install Yachtdrop on your device for instant access without opening a browser.")}
            </p>
            <button className={styles.primaryBtn} onClick={handleInstallApp}>
              {translate("Install Now")}
            </button>
          </section>
        )}

        {isInstalled && (
          <section className={styles.card}>
            <div className={styles.cardContent}>
              <span className={styles.icon}>✅</span>
              <h3>{translate("App Installed")}</h3>
              <p className={styles.smallText}>{translate("You're using Yachtdrop as an app!")}</p>
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>{translate("Quick Actions")}</h2>
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.title}
              className={styles.actionBtn}
              onClick={() => router.push(action.href)}
            >
              <span>{action.icon}</span>
              <div className={styles.actionContent}>
                <div className={styles.actionTitle}>{translate(action.title)}</div>
                <div className={styles.actionSubtitle}>{translate(action.subtitle)}</div>
              </div>
              <span className={styles.arrow}>→</span>
            </button>
          ))}
        </section>

        {/* Information Section */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>{translate("About")}</h2>
          <div className={styles.infoRow}>
            <span>{translate("App Name")}</span>
            <span className={styles.infoValue}>Yachtdrop</span>
          </div>
          <div className={styles.infoRow}>
            <span>{translate("Version")}</span>
            <span className={styles.infoValue}>{appInfo.version}</span>
          </div>
          <div className={styles.infoRow}>
            <span>{translate("Build Date")}</span>
            <span className={styles.infoValue}>{appInfo.buildDate}</span>
          </div>
        </section>

        {/* Help & Support */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>{translate("Help & Support")}</h2>
          {HELP_LINKS.map((link) => (
            <button key={link.href} className={styles.linkBtn} onClick={() => router.push(link.href)}>
              <span>{link.icon}</span> {translate(link.label)}
            </button>
          ))}
        </section>

        {/* Footer Info */}
        <div className={styles.footer}>
          <p>{translate("Made for sailors, by sailing enthusiasts 🌊")}</p>
          <p className={styles.smallText}>{translate("Optimized for mobile • Offline-capable • Ultra-fast")}</p>
        </div>
      </div>
    </main>
  );
}
