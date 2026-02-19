"use client";
import { useState, useRef } from "react";
import styles from "./SwipeableCartItem.module.css";

export default function SwipeableCartItem({ item, onRemove, children }) {
  const [swipeX, setSwipeX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const itemRef = useRef(null);
  const startXRef = useRef(0);

  const handleTouchStart = (e) => {
    startXRef.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;

    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;

    // Only allow swipe to the left (negative)
    if (diff < 0) {
      setSwipeX(Math.max(diff, -100)); // Max swipe of -100px
    }
  };

  const handleTouchEnd = () => {
    if (swipeX < -60) {
      // Swipe threshold reached, remove item
      handleRemove();
    } else {
      // Snap back
      setSwipeX(0);
    }
    setIsSwiping(false);
  };

  const handleRemove = () => {
    setIsDeleted(true);
    setTimeout(() => {
      onRemove();
    }, 300); // Wait for animation
  };

  return (
    <div
      ref={itemRef}
      className={`${styles.swipeItem} ${isDeleted ? styles.swipeItemDeleted : ""}`}
      style={{ transform: `translateX(${swipeX}px)` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.swipeAction}>
        <button
          className={styles.deleteBtn}
          onClick={handleRemove}
          aria-label={`Remove ${item.name}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 0-2-2h4a2 2 0 0 0 2 2v2"/>
          </svg>
        </button>
      </div>
      <div className={styles.itemContent}>
        {children}
      </div>
    </div>
  );
}
