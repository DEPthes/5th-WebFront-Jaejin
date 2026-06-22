import "./globals.css";

export const metadata = {
  title: "틱택토",
  description: "React로 만든 틱택토 게임",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
