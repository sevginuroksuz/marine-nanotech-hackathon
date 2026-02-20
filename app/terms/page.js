"use client";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const TERMS_SECTIONS = [
  {
    title: "1. Introduction",
    body:
      "Welcome to Yachtdrop. By using our platform, you agree to these terms and conditions. Yachtdrop operates an online chandlery marketplace connecting yacht crews with marine parts and supplies.",
  },
  {
    title: "2. Services",
    body: "Yachtdrop provides a platform for browsing, ordering, and receiving marine supplies. We offer two fulfilment options:",
    bullets: [
      { title: "Delivery to Boat", body: "Direct delivery to your berth or pontoon at the specified marina." },
      { title: "Marina Pickup", body: "Collection from a designated pickup point at the selected marina." },
    ],
  },
  {
    title: "3. Orders & Payment",
    body:
      "All orders are subject to product availability. Prices are displayed in Euros (€) and include applicable taxes. Payment is processed securely at checkout. Once confirmed, you will receive an order number for tracking.",
  },
  {
    title: "4. Delivery",
    body:
      "Delivery times depend on product availability and location. We operate across major marinas in Spain. Accurate marina name and berth/pontoon information is required for delivery orders.",
  },
  {
    title: "5. Returns & Refunds",
    body:
      "Unused items in original packaging may be returned within 14 days of delivery. Contact info@yachtdrop.com to initiate a return. Refunds will be processed to the original payment method within 5-10 business days.",
  },
  {
    title: "6. Limitation of Liability",
    body:
      "Yachtdrop acts as a marketplace connecting buyers with marine suppliers. While we ensure product quality, installation and use of marine equipment is the responsibility of the buyer. Always follow manufacturer guidelines.",
  },
];

const PRIVACY_SECTIONS = [
  {
    title: "Data We Collect",
    intro: "When you use Yachtdrop, we may collect:",
    bullets: [
      "Name and contact details (email, phone)",
      "Delivery information (marina, berth)",
      "Order history and preferences",
      "Device and browser information for optimization",
    ],
  },
  {
    title: "How We Use Your Data",
    bullets: [
      "Processing and delivering your orders",
      "Sending order confirmations and status updates",
      "Improving our platform and user experience",
      "Customer support and communication",
    ],
  },
  {
    title: "Data Protection",
    body:
      "Your data is stored securely and never sold to third parties. We comply with GDPR and applicable data protection regulations. You may request access to, correction of, or deletion of your personal data at any time.",
  },
  {
    title: "Cookies",
    body: "We use essential cookies to maintain your shopping session and preferences. No tracking cookies are used without your consent.",
  },
  {
    title: "Contact for Privacy Inquiries",
    paragraphs: ["For any privacy-related questions, contact us at:"],
    contact: [
      { label: "Email:", value: "info@yachtdrop.com" },
      { label: "Address:", value: "Av. Tomàs Blanes Tolosa, 41, 07181 Costa d'en Blanes, Illes Balears" },
    ],
  },
];

export default function TermsPage() {
  const router = useRouter();
  const translate = (t) => t;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.back()} aria-label={translate("Go back")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1>{translate("📋 Legal")}</h1>
        <p>{translate("Terms & Privacy")}</p>
      </header>

      <div className={styles.content}>
        {/* Terms of Service */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>{translate("Terms of Service")}</h2>

          {TERMS_SECTIONS.map((section) => (
            <div key={section.title} className={styles.section}>
              <h3>{translate(section.title)}</h3>
              {section.body && <p>{translate(section.body)}</p>}
              {section.bullets && (
                <ul>
                  {section.bullets.map((item) => (
                    <li key={item.title}>
                      <strong>{translate(item.title)}</strong> — {translate(item.body)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>

        {/* Privacy Policy */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>{translate("Privacy Policy")}</h2>

          {PRIVACY_SECTIONS.map((section) => (
            <div key={section.title} className={styles.section}>
              <h3>{translate(section.title)}</h3>
              {section.intro && <p>{translate(section.intro)}</p>}
              {section.body && <p>{translate(section.body)}</p>}
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{translate(paragraph)}</p>
              ))}
              {section.bullets && (
                <ul>
                  {section.bullets.map((item) => (
                    <li key={item}>{translate(item)}</li>
                  ))}
                </ul>
              )}
              {section.contact?.map((detail) => (
                <p key={detail.label}>
                  <strong>{translate(detail.label)}</strong> {detail.value}
                </p>
              ))}
            </div>
          ))}
        </section>

        {/* Footer */}
        <div className={styles.footer}>
          <p>{translate("Last updated: February 2026")}</p>
          <p>{translate("© 2026 Yachtdrop. All rights reserved.")}</p>
        </div>
      </div>
    </main>
  );
}
