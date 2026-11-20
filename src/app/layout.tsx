import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "메모",
  description: "메모 앱",
  applicationName: "메모",
  // iOS 홈 화면에서 주소창 없이 열리고, 아이콘 아래 이름이 '메모'로 보인다
  appleWebApp: { capable: true, title: "메모", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

// surface/page 색을 상태 표시줄에 맞춘다 (Light / Dark)
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f4f6" },
    { media: "(prefers-color-scheme: dark)", color: "#101014" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
