import {
  BadgeCheck,
  BrickWall,
  Download,
  MonitorSmartphone,
  Package,
  Pill,
  QrCode,
  ShoppingBasket,
} from "lucide-react";

const businesses = [
  {
    number: "01",
    title: "Apotek",
    icon: Pill,
    description:
      "Kelola obat dan produk kesehatan dengan lebih teratur. Pantau stok, harga, kategori, satuan, transaksi, hingga status kadaluarsa dalam satu sistem.",
  },
  {
    number: "02",
    title: "Minimarket",
    icon: ShoppingBasket,
    description:
      "Cocok untuk minimarket, toko kelontong, grosir, kosmetik, dan usaha sejenis. Kelola produk, stok, harga jual, serta transaksi dengan sederhana.",
  },
  {
    number: "03",
    title: "Toko Bangunan",
    icon: BrickWall,
    description:
      "Kelola berbagai material dan perlengkapan bangunan dengan dukungan satuan yang fleksibel seperti kg, sak, dus, batang, dan lainnya.",
  },
];

const features = [
  {
    title: "Sederhana dan mudah digunakan",
    icon: BadgeCheck,
    description:
      "Tampilan dirancang sederhana agar mudah dipahami dan digunakan tanpa proses belajar yang rumit.",
  },
  {
    title: "Import & Export Data",
    icon: Download,
    description:
      "Kelola data produk dengan lebih cepat tanpa harus memasukkan barang satu per satu dan simpan data usaha kapan saja.",
  },
  {
    title: "Satuan & Tipe Barang Fleksibel",
    icon: Package,
    description:
      "Sesuaikan satuan dan tipe barang dengan kebutuhan usaha, mulai dari pcs, kg, liter, botol, strip, dus, hingga variasi produk seperti Lipstik A, Lipstik B, dan lainnya.",
  },
  {
    title: "Pembayaran QRIS",
    icon: QrCode,
    description:
      "Sediakan pilihan pembayaran QRIS untuk memudahkan pelanggan melakukan transaksi secara digital.",
  },
  {
    title: "Nyaman di Berbagai Perangkat",
    icon: MonitorSmartphone,
    description:
      "Responsive untuk mobile, tablet, dan desktop sehingga dapat digunakan sesuai kebutuhan usaha.",
  },
  {
    title: "Siap Digunakan Seperti Aplikasi",
    icon: MonitorSmartphone,
    description:
      "Mendukung PWA sehingga dapat digunakan layaknya aplikasi di perangkat mobile tanpa perlu instalasi dari Play Store.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-slate-50 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-violet-500">
            Satu Platform, Berbagai Kebutuhan
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Dibuat untuk membantu berbagai jenis usaha
          </h2>

          <p className="mt-4 leading-7 text-slate-500">
            Kelola produk, stok, penjualan, dan aktivitas usaha dalam satu
            platform yang sederhana dan mudah digunakan.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {businesses.map((business) => {
            const Icon = business.icon;

            return (
              <div
                key={business.number}
                className="group rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>

                  <span className="text-sm font-medium text-slate-400">
                    {business.number}
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-semibold text-violet-500">
                  {business.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {business.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-20 grid gap-x-8 gap-y-12 border-t border-slate-200 pt-12 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div key={feature.title}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-700">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>

                <h3 className="font-semibold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
