"use client";
import { useState, useRef } from "react";
import styles from "./PullToRefresh.module.css";

export default function PullToRefresh({ onRefresh, isRefreshing, children }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const startYRef = useRef(0);
  const containerRef = useRef(null);

  const PULL_THRESHOLD = 60; // pixels to trigger refresh
  const REFRESH_THRESHOLD = 80; // max pull distance

  const handleTouchStart = (e) => {
    if (isRefreshing || window.scrollY > 0) return;
    startYRef.current = e.touches[0].clientY;
    setIsPulling(true);
  };

  const handleTouchMove = (e) => {
    if (!isPulling || isRefreshing || window.scrollY > 0) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;

    // Only allow pulling down (positive diff)
    if (diff > 0) {
      e.preventDefault();
      const pullDistance = Math.min(diff, REFRESH_THRESHOLD);
      setPullDistance(pullDistance);

      if (pullDistance >= PULL_THRESHOLD) {
        setShouldRefresh(true);
      } else {
        setShouldRefresh(false);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsPulling(false);

    if (shouldRefresh) {
      onRefresh();
      setShouldRefresh(false);
    }

    // Animate back
    setPullDistance(0);
  };

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={styles.indicator}
        style={{
          transform: `translateY(${Math.min(pullDistance, 60)}px)`,
          opacity: Math.min(pullDistance / PULL_THRESHOLD, 1),
        }}
      >
        <svg
          className={`${styles.spinner} ${isRefreshing ? styles.spinnerSpinning : ''}`}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 15m0 0A8.001 8.001 0 0015.356 2m1.925 2H21M9 14l-4 4" />
        </svg>
        <span className={styles.refreshText}>
          {pullDistance > 30 ? "Release to refresh" : pullDistance > 0 ? "Pull to refresh" : ""}
        </span>
      </div>
      <div
        className={styles.content}
        style={{
          transform: `translateY(${pullDistance}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
