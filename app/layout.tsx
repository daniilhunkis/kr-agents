import "./styles/globals.css";
import Link from "next/link";

export const metadata = {
  title: "KR Agents",
  description: "Mini-app для недвижимости",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
      </head>
      <body style={{display:"flex",flexDirection:"column",minHeight:"100vh", background:"#fff"}}>
        <main style={{flex:1}}>{children}</main>
        <nav style={{
          display:"flex",
          gap:16,
          justifyContent:"space-around",
          borderTop:"1px solid #eee",
          padding:"10px 12px",
          background:"#f7f7f7"
        }}>
          <Link href="/">Главная</Link>
          <Link href="/search">Поиск</Link>
          <Link href="/showings">Показы</Link>
          <Link href="/ads">Реклама</Link>
          <Link href="/objects">Объекты</Link>
        </nav>
      </body>
    </html>
  );
}
