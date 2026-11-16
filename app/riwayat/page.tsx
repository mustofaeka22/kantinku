"use client";

import { useState, useEffect } from "react";
import { rupiah } from "@/data/menu";
import Link from "next/link";

interface RiwayatItem {
  tanggal: string;
  nama: string;
  kelas: string;
  metode: string;
  items: { id: number; nama?: string; harga?: number; jumlah: number }[];
  total: number;
}

export default function RiwayatPage() {
  const [riwayatList, setRiwayatList] = useState<RiwayatItem[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("riwayat");
    if (data) {
      const parsed = JSON.parse(data);
      setTimeout(() => {
        setRiwayatList(parsed);
      }, 0);
    }
  }, []);

  const handleHapusRiwayat = () => {
    if (confirm("Apakah kamu yakin ingin menghapus seluruh riwayat pesanan?")) {
      localStorage.removeItem("riwayat");
      setRiwayatList([]);
    }
  };

  if (riwayatList.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 px-4 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4">
        <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center text-2xl mx-auto font-bold">
          📦
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Riwayat Pesanan Kosong</h2>
        <p className="text-slate-500 text-sm font-normal">Belum ada riwayat transaksi yang tercatat di perangkat ini.</p>
        <div>
          <Link
            href="/menu"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-2xl text-sm font-semibold hover:bg-orange-700 shadow-lg shadow-orange-600/20 transition"
          >
            Pesan Menu Sekarang 🚀
          </Link>
        </div>
      </div>
    );
  }

  const totalSemuaBelanja = riwayatList.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header Halaman */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Riwayat Pesanan</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Total Transaksi: <strong className="text-slate-700 font-semibold">{riwayatList.length} pesanan</strong> | Akumulasi Belanja: <strong className="text-orange-600 font-bold">{rupiah(totalSemuaBelanja)}</strong>
          </p>
        </div>

        <button
          onClick={handleHapusRiwayat}
          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-2"
        >
          🗑️ Hapus Semua Riwayat
        </button>
      </div>

      {/* Daftar Kartu Riwayat */}
      <div className="space-y-4">
        {riwayatList.map((item, index) => (
          <div key={index} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4 hover:shadow-md transition">
            {/* Bagian Atas: Tanggal & Metode */}
            <div className="flex justify-between items-center text-xs border-b border-dashed border-slate-200 pb-3">
              <span className="font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                📅 {item.tanggal}
              </span>
              <span className={`px-3 py-1 rounded-full font-semibold ${item.metode === "diantar" ? "bg-orange-50 text-orange-600 border border-orange-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
                {item.metode === "diantar" ? `🛵 Diantar ke ${item.kelas}` : "🏃 Ambil Sendiri"}
              </span>
            </div>

            {/* Informasi Pemesan */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Pemesan</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">{item.nama}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Jumlah Item</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{item.items.reduce((a, c) => a + c.jumlah, 0)} Porsi</p>
              </div>
            </div>

            {/* Bagian Bawah: Total Bayar */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <span className="text-slate-500 text-xs font-semibold">Total Pembayaran</span>
              <span className="text-orange-600 font-extrabold text-lg">{rupiah(item.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}