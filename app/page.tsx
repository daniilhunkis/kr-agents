"use client";
import ProfileGate from "./components/ProfileGate";

export default function HomePage() {
  return (
    <ProfileGate>
      <div style={{padding:16}}>
        <h1>KR Agents</h1>
        <p>Добро пожаловать в мини-приложение для недвижимости.</p>
        <ul>
          <li>🏠 Поиск квартир</li>
          <li>📅 Запись на показы</li>
          <li>📢 Реклама объектов</li>
          <li>⚡ Экспресс-подборка</li>
        </ul>
      </div>
    </ProfileGate>
  );
}
