'use client';
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', price: '', description: '', categoryId: '' });

  const loadData = async () => {
    const res = await fetch("/api/menu");
    const data = await res.json();
    setCategories(data);
    setProducts(data.flatMap((c: any) => c.products || []));
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const body = editId ? { id: editId, ...formData } : formData;
    const res = await fetch('/api/admin/products', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) { setShowModal(false); setEditId(null); loadData(); }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Silmek istediğinize emin misiniz?")) {
      await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      loadData();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4">
      {/* Başlık Alanı - Mobilde alt alta, PC'de yan yana */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900">Ürün Yönetimi</h1>
        <button 
          onClick={() => { setEditId(null); setFormData({name:'', price:'', description:'', categoryId:''}); setShowModal(true); }}
          className="w-full sm:w-auto bg-zinc-900 text-white px-6 py-3 rounded-xl font-bold active:scale-95 transition-all"
        >
          + Yeni Ürün
        </button>
      </div>

      <div className="grid gap-4">
        {products.map((p: any) => (
          <div key={p.id} className="bg-white border border-zinc-200 p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-zinc-800 text-lg">{p.name}</h3>
              <p className="text-zinc-500 text-sm line-clamp-2">{p.description || 'Açıklama yok'}</p>
              <div className="mt-2 text-zinc-900 font-black bg-zinc-100 inline-block px-3 py-1 rounded-lg text-sm">
                {p.price}₺
              </div>
            </div>
            
            {/* Butonlar Mobilde yan yana yayılır */}
            <div className="flex w-full sm:w-auto gap-2 border-t sm:border-none pt-3 sm:pt-0">
              <button 
                onClick={() => { setEditId(p.id); setFormData({name:p.name, price:p.price, description:p.description, categoryId:p.category_id}); setShowModal(true); }}
                className="flex-1 sm:flex-none bg-amber-50 text-amber-600 border border-amber-200 px-4 py-2.5 rounded-xl font-bold text-sm"
              >
                Düzenle
              </button>
              <button 
                onClick={() => handleDelete(p.id)}
                className="flex-1 sm:flex-none bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-xl font-bold text-sm"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal - Mobilde tam ekran, PC'de ortalanmış */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 sm:p-8 animate-in slide-in-from-bottom sm:zoom-in duration-300">
            <h2 className="text-xl font-black mb-6">{editId ? 'Düzenle' : 'Yeni Ürün'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input className="w-full border p-3 rounded-xl outline-none focus:border-zinc-900" placeholder="Ürün Adı" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <input className="w-full border p-3 rounded-xl outline-none focus:border-zinc-900" type="number" placeholder="Fiyat" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
              <select className="w-full border p-3 rounded-xl outline-none focus:border-zinc-900" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} required>
                <option value="">Kategori Seçin</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <textarea className="w-full border p-3 rounded-xl outline-none focus:border-zinc-900" placeholder="Açıklama" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 font-bold text-zinc-500 bg-zinc-100 rounded-xl">İptal</button>
                <button type="submit" className="flex-1 py-3 font-bold text-white bg-zinc-900 rounded-xl shadow-lg">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}