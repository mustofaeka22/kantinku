"use client";

import { useState, useMemo } from "react";
import { menu } from "@/data/menu";
import MenuCard from "@/components/MenuCard";

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [sort, setSort] = useState("awal");

  // Filter & Urutkan Menu Bersamaan
  const filteredMenu = useMemo(() => {
    let result = [...menu];

    // Filter Pencarian Nama
    if (search.trim() !== "") {
      result = result.filter((item) =>
        item.nama.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter Kategori
    if (kategori !== "Semua") {
      result = result.filter((item) => item.kategori === kategori);
    }

    // Pengurutan (Sorting)
    if (sort === "termurah") {
      result.sort((a, b) => a.harga - b.harga);
    } else if (sort === "termahal") {
      result.sort((a, b) => b.harga - a.harga);
    } else if (sort === "az") {
      result.sort((a, b) => a.nama.localeCompare(b.nama));
    }

    return result;
  }, [search, kategori, sort]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Katalog Menu Kantin</h2>
        <p className="text-slate-600 text-sm">Temukan makanan dan minuman favoritmu hari ini.</p>
      </div>

      {/* Bar Pencarian, Kategori, & Urutan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border shadow-sm">
        {/* Kotak Cari */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Cari Menu</label>
          <input
            type="text"
            placeholder="Cari nama menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Pilihan Kategori */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Kategori</label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Makanan">Makanan</option>
            <option value="Minuman">Minuman</option>
            <option value="Camilan">Camilan</option>
          </select>
        </div>

        {/* Pilihan Urutan */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Urutkan</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="awal">Urutan Awal</option>
            <option value="termurah">Harga Termurah</option>
            <option value="termahal">Harga Termahal</option>
            <option value="az">Nama A–Z</option>
          </select>
        </div>
      </div>

      {/* Grid Hasil Menu / Pesan Jika Kosong */}
      {filteredMenu.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMenu.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border">
          <p className="text-slate-500 font-medium">Menu tidak ditemukan.</p>
        </div>
      )}
    </div>
  );
}