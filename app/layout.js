import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
    variable: "--font-noto-sans-jp",
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
});

export const metadata = {
    title: "演劇部メンバー管理アプリ",
    description: "演劇部のメンバーを簡単に管理できるアプリケーションです。",
};

export default function RootLayout({ children }) {
    return (
        <html lang="ja">
            <body className={`${notoSansJP.variable} antialiased`}>
                {children}
            </body>
        </html>
    );
}
