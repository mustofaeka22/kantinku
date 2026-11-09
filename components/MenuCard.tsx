"use client";

import Link from "next/link";
import { rupiah } from "@/data/menu";
import { useState, useEffect } from "react";

interface MenuItem {
  id: number;
  nama: string;
  harga: number;
  kategori: string;
  stok: number;
}

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const isHabis = item.stok === 0;
  const [isFavorit, setIsFavorit] = useState(false);

  useEffect(() => {
    const favData = localStorage.getItem("favorit");
    if (favData) {
      const favList: number[] = JSON.parse(favData);
      setIsFavorit(favList.includes(item.id));
    }
  }, [item.id]);

  const toggleFavorit = (e: React.MouseEvent) => {
    e.preventDefault(); // Mencegah klik nyasar ke link detail
    const favData = localStorage.getItem("favorit");
    let favList: number[] = favData ? JSON.parse(favData) : [];

    if (isFavorit) {
      favList = favList.filter((id) => id !== item.id);
      setIsFavorit(false);
    } else {
      favList.push(item.id);
      setIsFavorit(true);
    }

    localStorage.setItem("favorit", JSON.stringify(favList));
  };

  return (
    <div
      className={`border rounded-2xl p-5 shadow-sm flex flex-col justify-between transition relative ${
        isHabis ? "bg-slate-100 opacity-75" : "bg-white"
      }`}
    >
      {/* TOMBOL IKON FAVORIT DI POJOK KANAN ATAS */}
      <button
        onClick={toggleFavorit}
        className={`absolute top-4 right-4 p-2 rounded-full text-sm transition border ${
          isFavorit
            ? "bg-rose-50 text-rose-600 border-rose-200"
            : "bg-white text-slate-400 border-slate-200 hover:text-rose-500"
        }`}
        title="Simpan ke favorit"
      >
        {isFavorit ? "♥" : "♡"}
      </button>

      <div>
        <span className="text-xs bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full font-semibold">
          {item.kategori}
        </span>
        <h3
          className={`font-bold text-lg mt-2 pr-8 ${
            isHabis ? "text-slate-500" : "text-slate-900"
          }`}
        >
          {item.nama}
        </h3>
        <p className="text-orange-600 font-bold mt-1">{rupiah(item.harga)}</p>

        {/* Status Stok */}
        <span
          className={`text-xs mt-2 inline-block font-semibold ${
            isHabis ? "text-red-600" : "text-emerald-600"
          }`}
        >
          {isHabis ? "Menu ini habis" : `Stok: ${item.stok}`}
        </span>
      </div>

      {/* Tombol Aksi */}
      {isHabis ? (
        <button
          disabled
          className="mt-4 w-full bg-slate-300 text-slate-500 py-2 rounded-xl text-sm font-semibold cursor-not-allowed"
        >
          Habis
        </button>
      ) : (
        <Link
          href={`/menu/${item.id}`}
          className="mt-4 block text-center bg-slate-100 hover:bg-orange-600 hover:text-white text-slate-700 py-2 rounded-xl text-sm font-semibold transition"
        >
          Lihat Detail
        </Link>
      )}
    </div>
  );
}