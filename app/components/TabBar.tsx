"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Search,
  CalendarDays,
  Megaphone,
  Building2,
} from "lucide-react";

export default function TabBar() {
  const pathname = usePathname();
  const tabs = [
    { href: "/", label: "Главная", icon: Home },
    { href: "/search", label: "Поиск", icon: Search },
    { href: "/showings", label: "Показы", icon: CalendarDays },
    { href: "/ads", label: "Реклама", icon: Megaphone },
    { href: "/objects", label: "Объекты", icon: Building2 },
  ];

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        background: "#1f2b3a",
        borderTop: "1px solid #2a3542",
        padding: "8px 0",
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        zIndex: 50,
      }}
    >
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              textAlign: "center",
              flex: 1,
              color: active ? "#2da5ff" : "#cfd6df",
              textDecoration: "none",
              fontSize: "12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              position: "relative",
              transition: "color 0.3s",
            }}
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
            >
              <Icon size={22} strokeWidth={2} />
              <span>{tab.label}</span>
              {active && (
                <motion.div
                  layoutId="underline"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: 24,
                    height: 2,
                    background: "#2da5ff",
                    borderRadius: 4,
                  }}
                />
              )}
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}
