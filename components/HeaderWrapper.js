"use client";
import dynamic from "next/dynamic";

const HeaderClient = dynamic(() => import("@/components/header"), { 
  ssr: false,
  loading: () => (
    <header style={{ height: 200, background: "var(--navy)", borderBottom: "1px solid var(--border)" }} />
  )
});

export default function HeaderWrapper(props) {
  return <HeaderClient {...props} />;
}
