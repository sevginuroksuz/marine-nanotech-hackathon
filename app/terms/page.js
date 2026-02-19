"use client";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function TermsPage() {
  const router = useRouter();

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.back()} aria-label="Go back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1>📋 Legal</h1>
        <p>Terms & Privacy</p>
      </header>

      <div className={styles.content}>
        {/* Terms of Service */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Terms of Service</h2>
          
          <div className={styles.section}>
            <h3>1. Introduction</h3>
            <p>Welcome to Yachtdrop. By using our platform, you agree to these terms and conditions. Yachtdrop operates an online chandlery marketplace connecting yacht crews with marine parts and supplies.</p>
          </div>

          <div className={styles.section}>
            <h3>2. Services</h3>
            <p>Yachtdrop provides a platform for browsing, ordering, and receiving marine supplies. We offer two fulfilment options:</p>
            <ul>
              <li><strong>Delivery to Boat</strong> — Direct delivery to your berth or pontoon at the specified marina.</li>
              <li><strong>Marina Pickup</strong> — Collection from a designated pickup point at the selected marina.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3>3. Orders & Payment</h3>
            <p>All orders are subject to product availability. Prices are displayed in Euros (€) and include applicable taxes. Payment is processed securely at checkout. Once confirmed, you will receive an order number for tracking.</p>
          </div>

          <div className={styles.section}>
            <h3>4. Delivery</h3>
            <p>Delivery times depend on product availability and location. We operate across major marinas in Spain. Accurate marina name and berth/pontoon information is required for delivery orders.</p>
          </div>

          <div className={styles.section}>
            <h3>5. Returns & Refunds</h3>
            <p>Unused items in original packaging may be returned within 14 days of delivery. Contact info@yachtdrop.com to initiate a return. Refunds will be processed to the original payment method within 5-10 business days.</p>
          </div>

          <div className={styles.section}>
            <h3>6. Limitation of Liability</h3>
            <p>Yachtdrop acts as a marketplace connecting buyers with marine suppliers. While we ensure product quality, installation and use of marine equipment is the responsibility of the buyer. Always follow manufacturer guidelines.</p>
          </div>
        </section>

        {/* Privacy Policy */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Privacy Policy</h2>

          <div className={styles.section}>
            <h3>Data We Collect</h3>
            <p>When you use Yachtdrop, we may collect:</p>
            <ul>
              <li>Name and contact details (email, phone)</li>
              <li>Delivery information (marina, berth)</li>
              <li>Order history and preferences</li>
              <li>Device and browser information for optimization</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3>How We Use Your Data</h3>
            <ul>
              <li>Processing and delivering your orders</li>
              <li>Sending order confirmations and status updates</li>
              <li>Improving our platform and user experience</li>
              <li>Customer support and communication</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3>Data Protection</h3>
            <p>Your data is stored securely and never sold to third parties. We comply with GDPR and applicable data protection regulations. You may request access to, correction of, or deletion of your personal data at any time.</p>
          </div>

          <div className={styles.section}>
            <h3>Cookies</h3>
            <p>We use essential cookies to maintain your shopping session and preferences. No tracking cookies are used without your consent.</p>
          </div>

          <div className={styles.section}>
            <h3>Contact for Privacy Inquiries</h3>
            <p>For any privacy-related questions, contact us at:</p>
            <p><strong>Email:</strong> info@yachtdrop.com</p>
            <p><strong>Address:</strong> Av. Tomàs Blanes Tolosa, 41, 07181 Costa d'en Blanes, Illes Balears</p>
          </div>
        </section>

        {/* Footer */}
        <div className={styles.footer}>
          <p>Last updated: February 2026</p>
          <p>© 2026 Yachtdrop. All rights reserved.</p>
        </div>
      </div>
    </main>
  );
}
