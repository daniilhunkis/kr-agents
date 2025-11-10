"use client";
import Card from "../components/Card";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h2 style={{ marginBottom: 16, color: "#2da5ff" }}>Раздел в разработке</h2>
      <Card>Функционал этого раздела появится скоро 🚧</Card>
    </motion.div>
  );
}
