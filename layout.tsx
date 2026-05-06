'use client';
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname(); // Aktif sayfayı boyamak için

  const handleLogout = async () => {
    if (!confirm("Çıkış yapmak istediğinize emin misiniz?")) return;
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('admin_logged_in');
    router.push('/admin/login');
  };

  // Menü elemanları için yardımcı bileşen
  const NavLink = ({ href, icon, children }: { href: string, icon: string, children: React.ReactNode }) => {
    const isActive = pathname === href;
    return (
      <Link 
        href={href} 
        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
          isActive 
          ? 'bg-white text-zinc-900 shadow-sm' 
          : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
        }`}
      >
        <span>{icon}</span>
        <span className="text-sm sm:text-base">{children}</span>
      </Link>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-50 text-zinc-900">
      
      {/* SIDEBAR / TOPBAR */}
      <aside className="w-full md:w-64 bg-zinc-950 md:min-h-screen p-4 md:p-6 flex flex-col border-b md:border-r border-zinc-800 sticky top-0 z-40">
        
        <div className="flex items-center justify-between md:flex-col md:items-start mb-0 md:mb-10">
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-white tracking-tighter">ADMIN <span className="text-zinc-500">PANEL</span></h1>
            <p className="hidden md:block text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Yönetim Merkezi</p>
          </div>

          {/* Mobilde Çıkış Butonu (İkon Halinde) */}
          <button 
            onClick={handleLogout}
            className="md:hidden p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
          >
            🚪
          </button>
        </div>

        {/* Navigasyon - Mobilde Yan yana, PC'de Alt alta */}
        <nav className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0 overflow-x-auto no-scrollbar pb-2 md:pb-0">
          <NavLink href="/admin/products" icon="📦">Ürünler</NavLink>
          <NavLink href="/admin/categories" icon="🗂">Kategoriler</NavLink>
          <NavLink href="/admin/reorder" icon="↕️">Sıralama</NavLink>
        </nav>

        {/* Masaüstü Çıkış Butonu (En Altta) */}
        <button 
          onClick={handleLogout}
          className="hidden md:flex mt-auto items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl font-bold transition-all"
        >
          <span>🚪</span>
          <span>Güvenli Çıkış</span>
        </button>
      </aside>

      {/* ANA İÇERİK ALANI */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 lg:p-12 overflow-x-hidden">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}