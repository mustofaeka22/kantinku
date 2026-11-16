"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { rupiah } from "@/data/menu";

// Tipe data sesuaikan dengan aplikasi kamu
interface CartItem {
  id: number;
  nama: string;
  harga: number;
  jumlah: number;
}

export default function KeranjangPage() {
  const [isSuccess, setIsSuccess] = useState(true); // contoh state struk aktif
  const [namaPemesan, setNamaPemesan] = useState("epunk");
  const [metode, setMetode] = useState("ambil"); // "ambil" atau "diantar"
  const [kelas, setKelas] = useState("XII RPL 1");
  const [items, setItems] = useState<CartItem[]>([
    { id: 3, nama: "Es Teh Manis", harga: 3000, jumlah: 2 },
  ]);

  const subtotal = items.reduce((acc, curr) => acc + curr.harga * curr.jumlah, 0);

  // --- TAMPILAN STRUK SETELAH CHECKOUT SUKSES ---
  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto py-8 px-4">
        <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
          {/* Hiasan Badge Status Atas */}
          <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-5">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold">
                ✓
              </span>
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg">Pesanan Berhasil!</h3>
                <p className="text-xs text-slate-500">Terima kasih, <span className="font-semibold text-slate-700">{namaPemesan}</span></p>
              </div>
            </div>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1 rounded-full font-bold">
              🎉 Lunas / Siap
            </span>
          </div>

          {/* Rincian Pesanan */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detail Pesanan</p>
            <div className="bg-slate-50 rounded-2xl p-4 space-y-3 border border-slate-100">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-bold text-slate-800">{item.nama}</p>
                    <p className="text-xs text-slate-500">{item.jumlah}x @ {rupiah(item.harga)}</p>
                  </div>
                  <span className="font-bold text-slate-700">{rupiah(item.harga * item.jumlah)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pengiriman & Total */}
          <div className="space-y-2 border-t border-slate-100 pt-4 text-sm">
            <div className="flex justify-between text-slate-500 text-xs">
              <span>Metode Ambil/Antar</span>
              <span className="font-semibold text-slate-700">
                {metode === "diantar" ? `Diantar ke ${kelas}` : "Ambil sendiri di kantin"}
              </span>
            </div>
            <div className="flex justify-between text-slate-500 text-xs">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-700">{rupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-dashed border-slate-200">
              <span className="font-extrabold text-slate-800 text-base">Total Bayar</span>
              <span className="font-extrabold text-orange-600 text-xl">{rupiah(subtotal)}</span>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="pt-2">
            <Link
              href="/menu"
              className="block w-full text-center bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-2xl shadow-lg shadow-orange-600/20 transition transform active:scale-95"
            >
              Pesan Lagi 🚀
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}