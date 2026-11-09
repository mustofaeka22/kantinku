"use client";

import { useState, useEffect } from "react";
import MenuCard from "@/components/MenuCard";
import Link from "next/link";

interface MenuItem {
  id: number;
  nama: string;
  harga: number;
  kategori: string;
  stok: number;
}

export default function FavoritPage() {
  const [favoritItems, setFavoritItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    // Ambil data menu asli dari localStorage atau data statis
    const favData = localStorage.getItem("favorit");
    const allMenu: MenuItem[] = [
      { id: 1, nama: "Nasi Goreng Spesial", harga: 12000, kategori: "Makanan", stok: 15 },
      { id: 2, nama: "Mie Ayam", harga: 10000, kategori: "Makanan", stok: 0 },
      { id: 3, nama: "Es Teh Manis", harga: 3000, kategori: "Minuman", stok: 40 },
      { id: 4, nama: "Jus Alpukat", harga: 8000, kategori: "Minuman", stok: 8 },
      { id: 5, nama: "Pisang Goreng", harga: 5000, kategori: "Camilan", stok: 20 },
      { id: 6, nama: "Risol Mayo", harga: 4000, kategori: "Camilan", stok: 3 },
    ];

    if (favData) {
      const favIds: number[] = JSON.parse(favData);
      const filtered = allMenu.filter((item) => favIds.includes(item.id));
      setFavoritItems(filtered);
    }
  }, []);

  if (favoritItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 bg-white border rounded-2xl shadow-sm space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Menu Favorit</h2>
        <p className="text-slate-500 font-medium">Belum ada menu yang difavoritkan.</p>
        <Link
          href="/menu"
          className="inline-block bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-700 transition"
        >
          Cari Menu Favoritmu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Menu Favorit</h2>
        <p className="text-xs text-slate-500 mt-1">Daftar menu makanan dan minuman pilihanmu.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {favoritItems.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}