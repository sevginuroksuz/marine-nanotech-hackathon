"use client";
import dynamic from "next/dynamic";

const EmergencyModeClient = dynamic(() => import("@/components/EmergencyMode"), { 
  ssr: false,
  loading: () => null
});

export default function EmergencyModeWrapper(props) {
  return <EmergencyModeClient {...props} />;
}
