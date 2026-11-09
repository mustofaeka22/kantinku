"use client";

import { useState, useEffect } from "react";
import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [totalItem, setTotalItem] = useState<number>(0);

  useEffect(() => {
    const hitung = () => {
      const data = localStorage.getItem("keranjang");
      if (data) {
        const parsed = JSON.parse(data);
        const total = parsed.reduce((acc: number, item: { jumlah: number }) => acc + item.jumlah, 0);
        setTotalItem(total);
      } else {
        setTotalItem(0);
      }
    };

    hitung();
    window.addEventListener("keranjang-berubah", hitung);

    return () => {
      window.removeEventListener("keranjang-berubah", hitung);
    };
  }, []);

  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans">
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-4">
            
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl">🍔</span>
              <span className="font-extrabold text-xl bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                KantinKu
              </span>
            </Link>
            
            <nav className="flex items-center gap-1 sm:gap-2 bg-slate-100/80 p-1 rounded-full border text-sm font-medium">
              <Link href="/" className="px-4 py-1.5 rounded-full text-slate-600 hover:text-orange-600 hover:bg-white transition">
                Beranda
              </Link>
              <Link href="/menu" className="px-4 py-1.5 rounded-full text-slate-600 hover:text-orange-600 hover:bg-white transition">
                Menu
              </Link>
              <Link href="/favorit" className="px-4 py-1.5 rounded-full text-slate-600 hover:text-orange-600 hover:bg-white transition">
                Favorit
              </Link>
              <Link href="/keranjang" className="px-4 py-1.5 rounded-full text-slate-600 hover:text-orange-600 hover:bg-white transition">
                Keranjang{totalItem > 0 ? ` (${totalItem})` : ""}
              </Link>
              <Link href="/riwayat" className="px-4 py-1.5 rounded-full text-slate-600 hover:text-orange-600 hover:bg-white transition">
                Riwayat
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-grow max-w-6xl w-full mx-auto p-6 sm:p-8">
          {children}
        </main>

        <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
          <p>© 2026 KantinKu</p>
        </footer>
      </body>
    </html>
  );
}