'use client';
import { useEffect, useState } from "react";

export default function ReorderPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const res = await fetch("/api/menu");
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  // Genel Kaydetme Fonksiyonu
  const saveOrder = async (type: 'products' | 'categories', sortedItems: any[]) => {
    const sortedData = sortedItems.map((item, idx) => ({ id: item.id, sort_order: idx }));
    await fetch('/api/admin/reorder', {
      method: 'POST',
      body: JSON.stringify({ type, sortedData })
    });
    loadData();
  };

  // Ürün Sıralama
  const moveProduct = (direction: 'up' | 'down', catIndex: number, prodIndex: number) => {
    const newData = [...data];
    const products = [...newData[catIndex].products];
    if ((direction === 'up' && prodIndex === 0) || (direction === 'down' && prodIndex === products.length - 1)) return;

    const target = direction === 'up' ? prodIndex - 1 : prodIndex + 1;
    [products[prodIndex], products[target]] = [products[target], products[prodIndex]];
    
    saveOrder('products', products);
  };

  // Kategori Sıralama
  const moveCategory = (direction: 'up' | 'down', index: number) => {
    const newData = [...data];
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === newData.length - 1)) return;

    const target = direction === 'up' ? index - 1 : index + 1;
    [newData[index], newData[target]] = [newData[target], newData[index]];

    saveOrder('categories', newData);
  };

  if (loading) return <div className="p-10 text-center font-bold text-zinc-400">Yükleniyor...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Sıralama Yönetimi</h1>
        <p className="text-zinc-500 text-sm mt-2">Müşterilerin gördüğü menü sırasını buradan belirleyebilirsiniz.</p>
      </div>

      <div className="space-y-12">
        {data.map((category, catIdx) => (
          <div key={category.id} className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
            {/* Kategori Başlığı ve Sıralama Butonları */}
            <div className="bg-zinc-50 p-4 border-b border-zinc-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="bg-zinc-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">
                  {catIdx + 1}
                </span>
                <h2 className="font-black text-zinc-800 uppercase tracking-wider">{category.name}</h2>
              </div>
              <div className="flex gap-1">
                <button onClick={() => moveCategory('up', catIdx)} className="p-2 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-600">▲</button>
                <button onClick={() => moveCategory('down', catIdx)} className="p-2 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-600">▼</button>
              </div>
            </div>

            {/* Ürün Listesi */}
            <div className="p-4 space-y-2">
              {category.products?.map((product: any, prodIdx: number) => (
                <div key={product.id} className="flex justify-between items-center p-3 hover:bg-zinc-50 rounded-xl border border-transparent hover:border-zinc-100 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col text-[10px] text-zinc-300 group-hover:text-zinc-500 transition-colors">
                      <button onClick={() => moveProduct('up', catIdx, prodIdx)}>▲</button>
                      <button onClick={() => moveProduct('down', catIdx, prodIdx)}>▼</button>
                    </div>
                    <span className="font-bold text-zinc-700">{product.name}</span>
                  </div>
                  <span className="text-xs font-black text-zinc-400 bg-zinc-100 px-2 py-1 rounded-md">
                    {product.price}₺
                  </span>
                </div>
              ))}
              {(!category.products || category.products.length === 0) && (
                <p className="text-center text-zinc-400 text-sm py-4 italic">Bu kategoride henüz ürün yok.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}