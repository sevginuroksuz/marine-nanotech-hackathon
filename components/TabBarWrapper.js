"use client";
import dynamic from "next/dynamic";

const TabBar = dynamic(() => import("@/components/TabBar"), { ssr: false });

export default function TabBarWrapper() {
  return <TabBar />;
}
