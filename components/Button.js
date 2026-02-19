"use client";
import { useRef, useState } from "react";
import styles from "./Button.module.css";

export default function Button({ children, onClick, variant = "primary", size = "md", loading = false, disabled = false, ...props }) {
  const buttonRef = useRef(null);
  const [ripple, setRipple] = useState(null);

  const handleClick = (e) => {
    if (disabled || loading) return;

    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    // Ripple effect
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;

    const rippleEl = document.createElement("span");
    rippleEl.className = styles.ripple;
    rippleEl.style.left = `${x - size / 2}px`;
    rippleEl.style.top = `${y - size / 2}px`;
    rippleEl.style.width = `${size}px`;
    rippleEl.style.height = `${size}px`;

    buttonRef.current.appendChild(rippleEl);

    setTimeout(() => {
      rippleEl.style.opacity = "0";
    }, 500);

    setTimeout(() => {
      rippleEl.remove();
    }, 800);

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      ref={buttonRef}
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${loading ? styles.loading : ""} ${disabled ? styles.disabled : ""}`}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className={styles.spinner} />
      ) : (
        <>
          {children}
          {ripple && <span className={styles.ripple} style={ripple.style} />}
        </>
      )}
    </button>
  );
}
