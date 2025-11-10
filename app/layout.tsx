import "./styles/globals.css";
import TabBar from "./components/TabBar";

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
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          background: "#18212d",
          margin: 0,
          paddingBottom: "60px",
          color: "#fff",
          fontFamily:
            "'Inter', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        }}
      >
        <main style={{ flex: 1, padding: "16px", paddingTop: "24px" }}>
          {children}
        </main>
        <TabBar />
      </body>
    </html>
  );
}
