"use client";

import { useState, useEffect } from "react";
import { menu, rupiah } from "@/data/menu";
import Link from "next/link";

interface CartItem {
  id: number;
  jumlah: number;
}

export default function KeranjangPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoPesan, setPromoPesan] = useState("");

  const [metode, setMetode] = useState("sendiri");
  const [namaPemesan, setNamaPemesan] = useState("");
  const [kelasPemesan, setKelasPemesan] = useState("");
  const [struk, setStruk] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("keranjang");
    if (data) {
      setTimeout(() => {
        setCart(JSON.parse(data));
      }, 0);
    }
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("keranjang", JSON.stringify(newCart));
    window.dispatchEvent(new Event("keranjang-berubah"));
  };

  const handleUbahJumlah = (id: number, delta: number) => {
    const product = menu.find((m) => m.id === id);
    if (!product) return;

    const updated = cart.map((item) => {
      if (item.id === id) {
        const newQty = item.jumlah + delta;
        if (newQty < 1 || newQty > product.stok) return item;
        return { ...item, jumlah: newQty };
      }
      return item;
    });

    updateCart(updated);
  };

  const handleHapus = (id: number) => {
    const updated = cart.filter((item) => item.id !== id);
    updateCart(updated);
  };

  // Subtotal
  const subtotal = cart.reduce((acc, item) => {
    const p = menu.find((m) => m.id === item.id);
    return acc + (p ? p.harga * item.jumlah : 0);
  }, 0);

  const handlePakaiPromo = () => {
    const clean = promoInput.trim().toUpperCase();
    if (clean !== "HEMAT10") {
      setAppliedPromo(null);
      setPromoPesan("Kode promo tidak dikenal.");
      return;
    }

    if (subtotal < 20000) {
      setAppliedPromo(null);
      setPromoPesan("Promo HEMAT10 butuh belanja minimal Rp 20.000.");
      return;
    }

    setAppliedPromo("HEMAT10");
    setPromoPesan("Promo HEMAT10 dipakai: diskon 10%.");
  };

  // Hitung diskon secara terikat ke subtotal (tanpa butuh setState di useEffect)
  const isPromoValid = appliedPromo === "HEMAT10" && subtotal >= 20000;
  const diskon = isPromoValid ? Math.round(subtotal * 0.1) : 0;
  const ongkir = metode === "diantar" ? 2000 : 0;
  const total = subtotal - diskon + ongkir;

  const handlePesanSekarang = (e: React.FormEvent) => {
    e.preventDefault();

    if (namaPemesan.trim().length < 3) {
      alert("Nama pemesan minimal 3 huruf.");
      return;
    }

    if (metode === "diantar" && kelasPemesan.trim().length < 3) {
      alert("Kelas minimal 3 karakter.");
      return;
    }

    const hitungDiskon = diskon;
    const hitungTotal = total;

    const rincianMenu = cart
      .map((item) => {
        const p = menu.find((m) => m.id === item.id);
        return p ? `${p.nama} x${item.jumlah} = ${rupiah(p.harga * item.jumlah)}` : "";
      })
      .filter(Boolean)
      .join(", ");

    let teksStruk = `Terima kasih, ${namaPemesan}!\n\n`;
    teksStruk += `Pesanan: ${rincianMenu}\n`;
    teksStruk += `Subtotal: ${rupiah(subtotal)}\n`;
    if (hitungDiskon > 0) {
      teksStruk += `Diskon: -${rupiah(hitungDiskon)}\n`;
    }
    if (metode === "diantar") {
      teksStruk += `Ongkir antar ke ${kelasPemesan}: ${rupiah(2000)}\n`;
    } else {
      teksStruk += `Diambil sendiri di kantin\n`;
    }
    teksStruk += `Total bayar: ${rupiah(hitungTotal)}`;

    setStruk(teksStruk);

    const riwayatData = localStorage.getItem("riwayat");
    const riwayatList = riwayatData ? JSON.parse(riwayatData) : [];
    riwayatList.unshift({
      tanggal: new Date().toLocaleString("id-ID"),
      nama: namaPemesan,
      kelas: kelasPemesan,
      metode,
      items: cart,
      subtotal,
      diskon: hitungDiskon,
      total: hitungTotal,
    });
    localStorage.setItem("riwayat", JSON.stringify(riwayatList));

    localStorage.removeItem("keranjang");
    setCart([]);
    setAppliedPromo(null);
    setPromoInput("");
    setPromoPesan("");
    window.dispatchEvent(new Event("keranjang-berubah"));
  };

  if (cart.length === 0 && !struk) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 bg-white border rounded-2xl space-y-4 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">Keranjang</h2>
        <p className="text-slate-500 font-medium">Keranjang masih kosong.</p>
        <Link
          href="/menu"
          className="inline-block bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-700 transition"
        >
          Lihat Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Keranjang</h2>

      {struk ? (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl space-y-4 shadow-sm">
          <h3 className="text-lg font-bold text-emerald-800">🎉 Struk Pesanan</h3>
          <pre className="bg-white p-4 rounded-xl border text-sm text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">
            {struk}
          </pre>
          <button
            onClick={() => setStruk(null)}
            className="bg-orange-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-orange-700 transition cursor-pointer"
          >
            Pesan Lagi
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
            {cart.map((item) => {
              const product = menu.find((m) => m.id === item.id);
              if (!product) return null;
              return (
                <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                  <div>
                    <h4 className="font-bold text-slate-800">{product.nama}</h4>
                    <p className="text-xs text-slate-500">{rupiah(product.harga)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-lg bg-slate-50">
                      <button
                        onClick={() => handleUbahJumlah(item.id, -1)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 text-sm font-semibold">{item.jumlah}</span>
                      <button
                        onClick={() => handleUbahJumlah(item.id, 1)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold text-slate-800 text-sm min-w-[80px] text-right">
                      {rupiah(product.harga * item.jumlah)}
                    </span>
                    <button
                      onClick={() => handleHapus(item.id)}
                      className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1.5 rounded-lg font-semibold"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Kode promo</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Masukkan kode promo (contoh: HEMAT10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="button"
                  onClick={handlePakaiPromo}
                  className="bg-slate-800 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-slate-900 cursor-pointer"
                >
                  Pakai
                </button>
              </div>
              {promoPesan && (
                <p className={`text-xs font-medium ${isPromoValid ? "text-emerald-600" : "text-red-600"}`}>
                  {promoPesan}
                </p>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t">
              <label className="block text-xs font-semibold text-slate-700">Cara ambil</label>
              <div className="flex gap-6 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="metode"
                    value="sendiri"
                    checked={metode === "sendiri"}
                    onChange={() => setMetode("sendiri")}
                  />
                  Ambil sendiri
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="metode"
                    value="diantar"
                    checked={metode === "diantar"}
                    onChange={() => setMetode("diantar")}
                  />
                  Diantar (+Rp 2.000)
                </label>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{rupiah(subtotal)}</span>
              </div>
              {diskon > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Diskon (10%)</span>
                  <span>-{rupiah(diskon)}</span>
                </div>
              )}
              {metode === "diantar" && (
                <div className="flex justify-between text-slate-600">
                  <span>Ongkir</span>
                  <span>{rupiah(2000)}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-base text-slate-900 pt-2 border-t">
                <span>Total</span>
                <span className="text-orange-600">{rupiah(total)}</span>
              </div>
            </div>

            <form onSubmit={handlePesanSekarang} className="space-y-4 pt-2 border-t">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama pemesan</label>
                <input
                  type="text"
                  required
                  placeholder="Nama pemesan (min 3 huruf)"
                  value={namaPemesan}
                  onChange={(e) => setNamaPemesan(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {metode === "diantar" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas</label>
                  <input
                    type="text"
                    required
                    placeholder="Kelas (min 3 karakter)"
                    value={kelasPemesan}
                    onChange={(e) => setKelasPemesan(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
              >
                Pesan sekarang
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}