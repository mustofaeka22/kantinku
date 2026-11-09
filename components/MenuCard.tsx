import Link from "next/link";
import { Menu, rupiah } from "@/data/menu";

export default function MenuCard({ item }: { item: Menu }) {
  const isHabis = item.stok === 0;

  return (
    <div className="border rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-semibold">
            {item.kategori}
          </span>
          {isHabis ? (
            <span className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-bold">
              Habis
            </span>
          ) : (
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
              Stok: {item.stok}
            </span>
          )}
        </div>
        <h3 className="font-bold text-lg text-slate-800 mt-1">{item.nama}</h3>
        <p className="text-orange-600 font-bold mt-1 text-base">{rupiah(item.harga)}</p>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <Link
          href={`/menu/${item.id}`}
          className="text-xs font-semibold text-slate-600 hover:text-orange-600 transition"
        >
          Lihat Detail →
        </Link>
        <button
          disabled={isHabis}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
            isHabis
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-orange-600 text-white hover:bg-orange-700 shadow-sm"
          }`}
        >
          {isHabis ? "Kosong" : "Pesan"}
        </button>
      </div>
    </div>
  );
}