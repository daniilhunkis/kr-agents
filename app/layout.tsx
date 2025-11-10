import "./styles/globals.css";
import Link from "next/link";

export const metadata = {
  title: "KR Agents",
  description: "Мини-приложение для агентов",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
      </head>
      <body>
        <main style={{ paddingBottom: "60px", minHeight: "100vh" }}>
          {children}
        </main>
        <nav>
          <Link href="/">🏠</Link>
          <Link href="/search">🔍</Link>
          <Link href="/ads">📢</Link>
          <Link href="/objects">🏗️</Link>
          <Link href="/showings">📅</Link>
        </nav>
      </body>
    </html>
  );
}
