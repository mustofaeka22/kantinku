"use client";

import { use, useState, useEffect, Suspense } from "react";
import { menu, rupiah } from "@/data/menu";
import { notFound } from "next/navigation";
import Link from "next/link";

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

function DetailContent({ params }: DetailPageProps) {
  const resolvedParams = use(params);
  const numericId = parseInt(resolvedParams.id, 10);
  const item = menu.find((m) => m.id === numericId);

  if (!item) {
    notFound();
  }

  const isHabis = item.stok === 0;
  const [jumlah, setJumlah] = useState<number>(1);
  const [isFavorit, setIsFavorit] = useState<boolean>(false);

  useEffect(() => {
    const favData = localStorage.getItem("favorit");
    if (favData) {
      const favList: number[] = JSON.parse(favData);
      const isFav = favList.includes(item.id);
      setTimeout(() => {
        setIsFavorit(isFav);
      }, 0);
    }
  }, [item.id]);

  const toggleFavorit = () => {
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

  const handleTambahKeranjang = () => {
    const data = localStorage.getItem("keranjang");
    const cart = data ? JSON.parse(data) : [];
    const existingIndex = cart.findIndex((i: { id: number }) => i.id === item.id);
    const currentQtyInCart = existingIndex !== -1 ? cart[existingIndex].jumlah : 0;

    if (currentQtyInCart + jumlah > item.stok) {
      alert(`Jumlah melebihi stok (${item.stok}).`);
      return;
    }

    if (existingIndex !== -1) {
      cart[existingIndex].jumlah += jumlah;
    } else {
      cart.push({ id: item.id, jumlah });
    }

    localStorage.setItem("keranjang", JSON.stringify(cart));
    window.dispatchEvent(new Event("keranjang-berubah"));
    alert("Ditambahkan ke keranjang.");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <Link href="/menu" className="text-sm font-semibold text-orange-600 hover:underline">
          ← Kembali ke Katalog
        </Link>
        <button
          onClick={toggleFavorit}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition border ${
            isFavorit
              ? "bg-rose-50 text-rose-600 border-rose-200"
              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
          }`}
        >
          {isFavorit ? "♥ Favorit" : "♡ Tambah favorit"}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b">
        <div>
          <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold">
            {item.kategori}
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">{item.nama}</h1>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-orange-600">{rupiah(item.harga)}</p>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold mt-1 inline-block ${
            isHabis ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
          }`}>
            {isHabis ? "Menu ini habis." : `Stok: ${item.stok}`}
          </span>
        </div>
      </div>

      {isHabis ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-bold text-center">
          Menu ini habis.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-slate-700">Jumlah:</label>
            <div className="flex items-center border rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => setJumlah(Math.max(1, jumlah - 1))}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
              >
                -
              </button>
              <span className="px-4 py-1 font-semibold text-sm min-w-[40px] text-center">
                {jumlah}
              </span>
              <button
                onClick={() => setJumlah(Math.min(item.stok, jumlah + 1))}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
              >
                +
              </button>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Total harga: <strong className="text-slate-800">{rupiah(item.harga * jumlah)}</strong>
            </span>
          </div>

          <button
            onClick={handleTambahKeranjang}
            className="w-full py-3 rounded-xl font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-md transition active:scale-95 cursor-pointer"
          >
            Tambah ke keranjang
          </button>
        </div>
      )}
    </div>
  );
}

export default function MenuDetail(props: DetailPageProps) {
  return (
    <Suspense fallback={<div className="text-center py-12 text-slate-500">Memuat detail menu...</div>}>
      <DetailContent {...props} />
    </Suspense>
  );
}