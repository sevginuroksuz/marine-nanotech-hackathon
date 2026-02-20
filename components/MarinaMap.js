"use client";
import { useState, useEffect, useRef } from "react";
import { useT } from "@/lib/i18n";
import styles from "./MarinaMap.module.css";

const MARINAS = [
  { id: 1, name: "Port Vell, Barcelona", lat: 41.3756, lng: 2.1825, status: "available", eta: "45 min" },
  { id: 2, name: "Marina Ibiza", lat: 38.9067, lng: 1.4365, status: "available", eta: "30 min" },
  { id: 3, name: "Port Adriano, Mallorca", lat: 39.4873, lng: 2.4688, status: "available", eta: "35 min" },
  { id: 4, name: "Real Club Náutico, Valencia", lat: 39.4571, lng: -0.3256, status: "available", eta: "50 min" },
  { id: 5, name: "Marina Marbella", lat: 36.5098, lng: -4.8820, status: "available", eta: "40 min" },
  { id: 6, name: "Puerto Banús, Marbella", lat: 36.4858, lng: -4.9529, status: "available", eta: "40 min" },
  { id: 7, name: "Marina Alicante", lat: 38.3386, lng: -0.4881, status: "available", eta: "55 min" },
  { id: 8, name: "Port Vauban, Antibes", lat: 43.5804, lng: 7.1289, status: "comingSoon", eta: "—" },
  { id: 9, name: "Port de Monaco", lat: 43.7352, lng: 7.4202, status: "comingSoon", eta: "—" },
  { id: 10, name: "Marina di Porto Cervo", lat: 41.1377, lng: 9.5354, status: "comingSoon", eta: "—" },
  { id: 11, name: "Port Olimpic, Barcelona", lat: 41.3862, lng: 2.2015, status: "available", eta: "45 min" },
  { id: 12, name: "Marina Trogir, Croatia", lat: 43.5171, lng: 16.2503, status: "comingSoon", eta: "—" },
];

export default function MarinaMap({ onSelectMarina, onClose }) {
  const { t } = useT();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selectedMarina, setSelectedMarina] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Dynamically load Leaflet CSS + JS
    if (typeof window === "undefined") return;

    const loadLeaflet = async () => {
      // Load CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Load JS
      if (!window.L) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      initMap();
    };

    loadLeaflet().catch(console.error);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const initMap = () => {
    if (!mapRef.current || !window.L) return;

    const L = window.L;
    const map = L.map(mapRef.current, {
      center: [39.5, 3.0],
      zoom: 6,
      zoomControl: false,
      attributionControl: false,
    });

    // Dark-themed tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Zoom control on the right
    L.control.zoom({ position: "topright" }).addTo(map);

    // Add marina markers
    MARINAS.forEach((marina) => {
      const isAvailable = marina.status === "available";
      
      const icon = L.divIcon({
        className: "marina-marker",
        html: `<div style="
          width: 32px; height: 32px; 
          border-radius: 50%; 
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          background: ${isAvailable ? "rgba(34, 211, 238, 0.2)" : "rgba(148, 163, 184, 0.15)"};
          border: 2px solid ${isAvailable ? "#22d3ee" : "#475569"};
          box-shadow: 0 2px 8px ${isAvailable ? "rgba(34, 211, 238, 0.3)" : "rgba(0,0,0,0.3)"};
          cursor: pointer;
          transition: transform 0.15s;
        ">⚓</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([marina.lat, marina.lng], { icon }).addTo(map);
      
      marker.on("click", () => {
        setSelectedMarina(marina);
        map.flyTo([marina.lat, marina.lng], 12, { duration: 0.8 });
      });
    });

    mapInstanceRef.current = map;
    setMapLoaded(true);

    // Fix map size after animation
    setTimeout(() => map.invalidateSize(), 400);
  };

  const handleSelect = () => {
    if (selectedMarina && selectedMarina.status === "available") {
      onSelectMarina?.(selectedMarina.name);
      onClose?.();
    }
  };

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.modal} role="dialog" aria-label={t("marina.title")} aria-modal="true">
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{t("marina.title")}</h2>
            <p className={styles.subtitle}>{t("marina.subtitle")}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label={t("marina.close")}>
            ✕
          </button>
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={styles.dotAvailable} />
            {t("marina.available")}
          </span>
          <span className={styles.legendItem}>
            <span className={styles.dotComingSoon} />
            {t("marina.comingSoon")}
          </span>
        </div>

        {/* Map Container */}
        <div className={styles.mapContainer}>
          <div ref={mapRef} className={styles.map} />
          {!mapLoaded && (
            <div className={styles.mapLoading}>
              <div className={styles.spinner} />
              <span>{t("app.loading")}</span>
            </div>
          )}
        </div>

        {/* Selected Marina Info */}
        {selectedMarina && (
          <div className={`${styles.marinaInfo} ${selectedMarina.status === "available" ? styles.marinaAvailable : styles.marinaComingSoon}`}>
            <div className={styles.marinaDetails}>
              <h3 className={styles.marinaName}>⚓ {selectedMarina.name}</h3>
              <div className={styles.marinaStats}>
                <span className={`${styles.statusBadge} ${selectedMarina.status === "available" ? styles.badgeAvailable : styles.badgeComingSoon}`}>
                  {selectedMarina.status === "available" ? t("marina.available") : t("marina.comingSoon")}
                </span>
                {selectedMarina.status === "available" && (
                  <span className={styles.eta}>
                    🕐 {t("marina.estimatedTime", { time: selectedMarina.eta })}
                  </span>
                )}
              </div>
            </div>
            {selectedMarina.status === "available" && (
              <button className={styles.selectBtn} onClick={handleSelect}>
                {t("marina.selectMarina")}
              </button>
            )}
          </div>
        )}

        {/* Marina List */}
        <div className={styles.marinaList}>
          {MARINAS.filter(m => m.status === "available").map((m) => (
            <button
              key={m.id}
              className={`${styles.marinaListItem} ${selectedMarina?.id === m.id ? styles.marinaListActive : ""}`}
              onClick={() => {
                setSelectedMarina(m);
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.flyTo([m.lat, m.lng], 12, { duration: 0.8 });
                }
              }}
            >
              <span className={styles.marinaListName}>⚓ {m.name}</span>
              <span className={styles.marinaListEta}>🕐 {m.eta}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
