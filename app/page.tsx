import Link from "next/link";

export default function Home() {
  return (
    <div className="py-12 px-4 text-center max-w-3xl mx-auto space-y-6">
      <div className="inline-block bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
        Selamat Datang di KantinKu 🍔
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
        Pesan Makanan & Minuman Kantin Lebih Cepat & Praktis
      </h1>
      <p className="text-slate-600 text-base sm:text-lg">
        Nikmati berbagai menu makanan dan camilan lezat langsung dari kantin sekolah tanpa perlu mengantre panjang.
      </p>
      <div className="pt-4">
        <Link
          href="/menu"
          className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-orange-200 transition-all text-base"
        >
          Jelajahi Menu Kantin Sekarang →
        </Link>
      </div>
    </div>
  );
}