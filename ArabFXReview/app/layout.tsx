import "@/styles/globals.css";
import LegalNotice from "@/components/LegalNotice";

export const metadata = {
  title: "ArabFXReview",
  description: "منصة عربية متخصصة في تقييم شركات الفوركس والمحتوى التعليمي",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <header className="bg-white border-b">
          <div className="container mx-auto p-4 flex items-center justify-between">
            <h1 className="font-bold">ArabFXReview</h1>
            <nav>
              <a href="/ar/brokers" className="mx-2 text-sm">شركات التداول</a>
              <a href="/ar/news" className="mx-2 text-sm">الأخبار والإعلانات</a>
            </nav>
          </div>
        </header>

        <main className="container mx-auto p-6">{children}</main>

        <footer className="container mx-auto p-6 border-t">
          <LegalNotice />
          <p className="text-xs text-gray-500 mt-2">© {new Date().getFullYear()} ArabFXReview</p>
        </footer>
      </body>
    </html>
  );
}
