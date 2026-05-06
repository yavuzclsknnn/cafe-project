'use client';
import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const load = () => fetch("/api/menu").then(r => r.json()).then(setCategories);
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!newName) return;
    await fetch("/api/admin/categories", { method: "POST", body: JSON.stringify({ name: newName }) });
    setNewName(""); load();
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 mb-8">Kategoriler</h1>
      
      <div className="flex flex-col sm:flex-row gap-3 mb-8 bg-white p-2 rounded-2xl border border-zinc-200">
        <input 
          className="flex-1 p-3 bg-transparent outline-none font-medium text-zinc-800" 
          value={newName} onChange={e => setNewName(e.target.value)} placeholder="Yeni kategori adı..." 
        />
        <button onClick={handleAdd} className="w-full sm:w-auto bg-zinc-900 text-white px-8 py-3 rounded-xl font-bold active:scale-95">Ekle</button>
      </div>

      <div className="grid gap-3">
        {categories.map((c: any) => (
          <div key={c.id} className="bg-white p-4 border border-zinc-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="w-full">
              {editingId === c.id ? (
                <input 
                  className="w-full border-b-2 border-zinc-900 outline-none p-1 font-bold text-zinc-800"
                  value={editValue} onChange={e => setEditValue(e.target.value)} autoFocus
                />
              ) : (
                <span className="font-bold text-zinc-800 text-lg">{c.name}</span>
              )}
            </div>

            <div className="flex w-full sm:w-auto gap-2">
              {editingId === c.id ? (
                <button onClick={() => { /* update api fetch */ setEditingId(null); load(); }} className="flex-1 sm:flex-none bg-zinc-900 text-white px-5 py-2 rounded-lg font-bold text-sm">Bitti</button>
              ) : (
                <button onClick={() => { setEditingId(c.id); setEditValue(c.name); }} className="flex-1 sm:flex-none bg-amber-50 text-amber-600 border border-amber-200 px-4 py-2 rounded-lg font-bold text-sm">Düzenle</button>
              )}
              <button onClick={() => { /* delete api fetch */ load(); }} className="flex-1 sm:flex-none bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg font-bold text-sm">Sil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}