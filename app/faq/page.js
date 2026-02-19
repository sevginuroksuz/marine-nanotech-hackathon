"use client";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const FAQS = [
  {
    q: "What is Yachtdrop?",
    a: "Yachtdrop is a mobile-first online chandlery that lets yacht crews order marine parts and supplies for delivery directly to their boat in the marina, or request pickup from a nearby location."
  },
  {
    q: "How does delivery work?",
    a: "Select 'Delivery to Boat' at checkout, enter your marina name and berth/pontoon number. We'll deliver directly to your vessel. Delivery times vary by location and product availability."
  },
  {
    q: "Can I pick up my order instead?",
    a: "Yes! Choose 'Marina Pickup' at checkout and select your nearest marina from the list. You'll receive a notification when your order is ready for collection."
  },
  {
    q: "Where do the products come from?",
    a: "We source our products from trusted marine suppliers including Nautichandler, ensuring quality parts and competitive pricing for all your boating needs."
  },
  {
    q: "What areas do you cover?",
    a: "We currently operate across major marinas in Spain including Barcelona, Ibiza, Mallorca, Valencia, Marbella, and Alicante. We're expanding to more locations soon."
  },
  {
    q: "How can I track my order?",
    a: "After placing your order, you'll receive an order number (e.g. YD-12345). Use this on the 'Track' page, or check 'My Orders' with your phone number to see all your orders and their status."
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards through our secure payment system. Payment is processed at checkout."
  },
  {
    q: "Can I cancel or modify my order?",
    a: "Please contact us as soon as possible at info@yachtdrop.com. We'll do our best to accommodate changes before the order is dispatched."
  },
  {
    q: "Is there a minimum order amount?",
    a: "No minimum order. Order as little or as much as you need — even a single part."
  },
  {
    q: "Do you offer returns?",
    a: "Yes, unused items in original packaging can be returned within 14 days. Contact support@yachtdrop.com to initiate a return."
  },
];

export default function FAQPage() {
  const router = useRouter();

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.back()} aria-label="Go back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1>❓ FAQs</h1>
        <p>Frequently Asked Questions</p>
      </header>

      <div className={styles.content}>
        {FAQS.map((faq, i) => (
          <details key={i} className={styles.faqItem}>
            <summary className={styles.faqQuestion}>
              <span>{faq.q}</span>
              <svg className={styles.chevron} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </summary>
            <p className={styles.faqAnswer}>{faq.a}</p>
          </details>
        ))}

        <div className={styles.helpBox}>
          <span className={styles.helpIcon}>💬</span>
          <p>Still have questions?</p>
          <button className={styles.helpBtn} onClick={() => router.push("/contact")}>
            Contact Support
          </button>
        </div>
      </div>
    </main>
  );
}
