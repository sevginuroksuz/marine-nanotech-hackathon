"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./VoiceSearch.module.css";
import { useT } from "@/lib/i18n";

export default function VoiceSearch({ onResult }) {
  const { t } = useT();
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(null);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const onResultRef = useRef(onResult);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    // Check support ONLY in browser
    if (typeof window === "undefined") return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const isSupported = !!SpeechRecognition;
    setSupported(isSupported);
    console.log("Voice Search support:", isSupported);
    
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser");
      return;
    }
    
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        console.log("Speech recognition started");
      };

      recognition.onresult = (event) => {
        console.log("Result received:", event);
        const result = event.results[event.results.length - 1];
        const text = result[0].transcript;
        console.log("Transcript:", text, "isFinal:", result.isFinal);
        setTranscript(text);
        if (result.isFinal) {
          console.log("Final result, calling onResult:", text);
          onResultRef.current?.(text);
          setListening(false);
          setTranscript("");
        }
      };

      recognition.onerror = (event) => {
        if (event.error === "aborted") {
          console.log("Speech recognition aborted (expected when stopping)");
        } else {
          console.error("Speech recognition error:", event.error);
        }
        setListening(false);
        setTranscript("");
      };

      recognition.onend = () => {
        console.log("Speech recognition ended");
        setListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.error("Failed to initialize speech recognition:", err);
      setSupported(false);
    }

    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const toggle = async () => {
    console.log("Toggle called, listening:", listening, "supported:", supported);
    if (supported === false) {
      console.warn("Speech Recognition not supported");
      return;
    }

    if (listening) {
      console.log("Stopping recognition");
      recognitionRef.current?.stop();
      setListening(false);
      setTranscript("");
    } else {
      try {
        console.log("Starting recognition");
        setTranscript("");
        recognitionRef.current?.start();
        setListening(true);
        console.log("Recognition started successfully");
      } catch (err) {
        console.error("Failed to start recognition:", err);
        setListening(false);
      }
    }
  };

  // Debug: show render status
  useEffect(() => {
    console.log("VoiceSearch render - supported:", supported);
  }, [supported]);

  // Don't render if not supported OR still checking (hydration mismatch prevention)
  if (supported === null) {
    console.log("VoiceSearch: supported is null, not rendering");
    return null;
  }
  if (supported === false) {
    console.log("VoiceSearch: not supported, not rendering");
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.micBtn} ${listening ? styles.micActive : ""}`}
        onClick={toggle}
        aria-label={listening ? t("search.listening") : t("search.voiceSearch")}
        title={t("search.voiceSearch")}
        type="button"
      >
        {listening ? (
          <div className={styles.pulseRing}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/>
              <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        )}
      </button>
      {listening && transcript && (
        <div className={styles.transcriptBubble}>
          {transcript}
        </div>
      )}
    </div>
  );
}
