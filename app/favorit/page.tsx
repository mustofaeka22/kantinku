"use client";

import { useState, useEffect } from "react";
import { rupiah } from "@/data/menu";
import Link from "next/link";

interface MenuItem {
  id: number;
  nama: string;
  harga: number;
  kategori: string;
  stok: number;
}

export default function FavoritPage() {
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [favoritIds, setFavoritIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ambil data favorit dari localStorage secara aman di client-side
    const favData = localStorage.getItem("favorit");
    const initialFavs: number[] = favData ? JSON.parse(favData) : [];

    fetch("/api/menu")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat data menu.");
        return res.json();
      })
      .then((data) => {
        setMenuList(data);
        setFavoritIds(initialFavs);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-16 text-slate-500 font-medium">Memuat...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-600 font-medium">Terjadi kesalahan: {error}</div>;
  }

  const favoriteMenus = menuList.filter((m) => favoritIds.includes(m.id));

  if (favoriteMenus.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 bg-white border rounded-2xl shadow-sm space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Menu Favorit</h2>
        <p className="text-slate-500 font-medium">Belum ada menu favorit.</p>
        <Link
          href="/menu"
          className="inline-block bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-700 transition"
        >
          Jelajahi Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Menu Favorit</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {favoriteMenus.map((item) => (
          <div key={item.id} className="bg-white border rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-semibold">
                {item.kategori}
              </span>
              <h3 className="font-bold text-lg text-slate-900 mt-2">{item.nama}</h3>
              <p className="text-orange-600 font-bold mt-1">{rupiah(item.harga)}</p>
            </div>
            <Link
              href={`/menu/${item.id}`}
              className="block text-center bg-slate-100 hover:bg-orange-600 hover:text-white text-slate-700 py-2 rounded-xl text-sm font-semibold transition"
            >
              Lihat Detail
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}