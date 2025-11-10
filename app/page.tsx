"use client";

import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    // Telegram WebApp API — настройка цветов
    // @ts-ignore
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.setHeaderColor("#2da5ff");
      tg.setBackgroundColor("#ffffff");
    }
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ color: "#2da5ff", fontSize: "22px" }}>KR Agents</h1>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        Добро пожаловать 👋<br />
        Умное приложение для агентов недвижимости в Краснодаре.
      </p>
      <div className="card">
        <h2>Мои объекты</h2>
        <p>Просматривай, редактируй и делись объявлениями прямо из Telegram.</p>
        <button>Открыть объекты</button>
      </div>

      <div className="card">
        <h2>Заявки клиентов</h2>
        <p>Следи за запросами, статусами и показывай нужные варианты быстрее.</p>
        <button>Перейти к заявкам</button>
      </div>
    </div>
  );
}
