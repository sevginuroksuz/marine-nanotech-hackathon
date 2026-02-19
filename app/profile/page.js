"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function ProfilePage() {
  const router = useRouter();
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [appInfo, setAppInfo] = useState({
    version: "0.1.0",
    buildDate: "2026-02-19",
  });

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
        <h1>⚓ Profile</h1>
        <p>Your Yachtdrop Account</p>
      </header>

      <div className={styles.content}>
        {/* PWA Install Section */}
        {installPrompt && !isInstalled && (
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.icon}>📱</span>
              <h2>Install App</h2>
            </div>
            <p className={styles.cardDescription}>
              Install Yachtdrop on your device for instant access without opening a browser.
            </p>
            <button className={styles.primaryBtn} onClick={handleInstallApp}>
              Install Now
            </button>
          </section>
        )}

        {isInstalled && (
          <section className={styles.card}>
            <div className={styles.cardContent}>
              <span className={styles.icon}>✅</span>
              <h3>App Installed</h3>
              <p className={styles.smallText}>You're using Yachtdrop as an app!</p>
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <button 
            className={styles.actionBtn}
            onClick={() => router.push("/track")}
          >
            <span>📦</span>
            <div className={styles.actionContent}>
              <div className={styles.actionTitle}>Track Orders</div>
              <div className={styles.actionSubtitle}>Find your shipments</div>
            </div>
            <span className={styles.arrow}>→</span>
          </button>
          <button 
            className={styles.actionBtn}
            onClick={() => router.push("/my-orders")}
          >
            <span>📋</span>
            <div className={styles.actionContent}>
              <div className={styles.actionTitle}>My Orders</div>
              <div className={styles.actionSubtitle}>Order history & status</div>
            </div>
            <span className={styles.arrow}>→</span>
          </button>
          <button 
            className={styles.actionBtn}
            onClick={() => router.push("/")}
          >
            <span>🛍️</span>
            <div className={styles.actionContent}>
              <div className={styles.actionTitle}>Continue Shopping</div>
              <div className={styles.actionSubtitle}>Browse products</div>
            </div>
            <span className={styles.arrow}>→</span>
          </button>
        </section>

        {/* Information Section */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>About</h2>
          <div className={styles.infoRow}>
            <span>App Name</span>
            <span className={styles.infoValue}>Yachtdrop</span>
          </div>
          <div className={styles.infoRow}>
            <span>Version</span>
            <span className={styles.infoValue}>{appInfo.version}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Build Date</span>
            <span className={styles.infoValue}>{appInfo.buildDate}</span>
          </div>
        </section>

        {/* Help & Support */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Help & Support</h2>
          <button className={styles.linkBtn}>
            <span>❓</span> FAQs
          </button>
          <button className={styles.linkBtn}>
            <span>📧</span> Contact Support
          </button>
          <button className={styles.linkBtn}>
            <span>📋</span> Terms & Privacy
          </button>
        </section>

        {/* Footer Info */}
        <div className={styles.footer}>
          <p>Made for sailors, by sailing enthusiasts 🌊</p>
          <p className={styles.smallText}>Optimized for mobile • Offline-capable • Ultra-fast</p>
        </div>
      </div>
    </main>
  );
}
