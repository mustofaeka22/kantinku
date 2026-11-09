"use client";

import { useState, useEffect } from "react";
import { rupiah } from "@/data/menu";
import Link from "next/link";

interface RiwayatItem {
  tanggal: string;
  nama: string;
  kelas: string;
  metode: string;
  items: { id: number; jumlah: number }[];
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

  if (riwayatList.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 bg-white border rounded-2xl shadow-sm space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Riwayat Pesanan</h2>
        <p className="text-slate-500 font-medium">Belum ada pesanan.</p>
        <Link
          href="/menu"
          className="inline-block bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-700 transition"
        >
          Pesan Menu Sekarang
        </Link>
      </div>
    );
  }

  const totalSemuaBelanja = riwayatList.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-2xl font-bold text-slate-800">Riwayat Pesanan</h2>
        <div className="bg-orange-50 border border-orange-200 text-orange-800 text-xs px-4 py-2 rounded-xl font-medium">
          Ringkasan: <strong>{riwayatList.length} pesanan</strong> | Total belanja: <strong>{rupiah(totalSemuaBelanja)}</strong>
        </div>
      </div>

      <div className="space-y-4">
        {riwayatList.map((item, index) => (
          <div key={index} className="bg-white border rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-500 border-b pb-2">
              <span className="font-semibold text-slate-700">{item.tanggal}</span>
              <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-medium">
                {item.metode === "diantar" ? `Diantar ke ${item.kelas}` : "Ambil sendiri"}
              </span>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800">Pemesan: {item.nama}</p>
              <p className="text-xs text-slate-500 mt-1">Jumlah jenis menu: {item.items.length} item</p>
            </div>

            <div className="flex justify-between items-center pt-2 border-t font-extrabold text-sm">
              <span className="text-slate-600">Total Bayar:</span>
              <span className="text-orange-600">{rupiah(item.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}