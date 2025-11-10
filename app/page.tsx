"use client";
import Card from "./components/Card";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h2 style={{ marginBottom: 16, color: "#2da5ff" }}>Главная</h2>
      <Card>Добро пожаловать в KR Agents 🎯</Card>
      <Card>Здесь будут появляться актуальные предложения и объекты</Card>
      <Card>Вы можете перейти в раздел “Поиск”, чтобы найти клиентов или ЖК</Card>
    </motion.div>
  );
}
