"use client";
import { motion } from "framer-motion";

export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: "#1f2b3a",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
      }}
    >
      {children}
    </motion.div>
  );
}
