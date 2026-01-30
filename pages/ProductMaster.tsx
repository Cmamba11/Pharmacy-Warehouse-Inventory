
import React, { useEffect, useState } from 'react';
import { db } from '../services/mockDb';
import { Product } from '../types';
import { Plus, Search, Filter, Edit2, Trash2, X, CheckCircle2 } from 'lucide-react';
import { CATEGORIES, DOSAGE_FORMS } from '../constants';

const ProductMaster: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form State
  const [form, setForm] = useState({
    name: '',
    category: CATEGORIES[0],
    dosageForm: DOSAGE_FORMS[0],
    strength: '',
    unitPrice: '',
    minStockLevel: ''
  });

  const fetchProducts = () => db.getProducts().then(setProducts);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.addProduct({
      name: form.name,
      category: form.category,
      dosageForm: form.dosageForm,
      strength: form.strength,
      unitPrice: parseFloat(form.unitPrice),
      minStockLevel: parseInt(form.minStockLevel)
    });
    setSuccess(true);
    fetchProducts();
    setTimeout(() => {
      setSuccess(false);
      setIsModalOpen(false);
      setForm({
        name: '',
        category: CATEGORIES[0],
        dosageForm: DOSAGE_FORMS[0],
        strength: '',
        unitPrice: '',
        minStockLevel: ''
      });
    }, 1500);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Product Master</h2>
          <p className="text-slate-500">Define pharmaceutical products before receiving stock.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          <Plus size={20} />
          <span>Add New Product</span>
        </button>
      </header>

      {/* Modal Backdrop */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-xl text-slate-900">Create New Product</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="p-8 space-y-5">
              {success ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Product Added!</h4>
                  <p className="text-slate-500">Inventory definition created successfully.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Drug Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Ibuprofen"
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</label>
                      <select 
                        value={form.category}
                        onChange={e => setForm({...form, category: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-sm"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dosage Form</label>
                      <select 
                        value={form.dosageForm}
                        onChange={e => setForm({...form, dosageForm: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-sm"
                      >
                        {DOSAGE_FORMS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Strength</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. 400mg"
                      value={form.strength}
                      onChange={e => setForm({...form, strength: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Unit Price ($)</label>
                      <input 
                        required
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        value={form.unitPrice}
                        onChange={e => setForm({...form, unitPrice: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Min Stock Level</label>
                      <input 
                        required
                        type="number" 
                        placeholder="100"
                        value={form.minStockLevel}
                        onChange={e => setForm({...form, minStockLevel: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                      Create Definition
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by drug name or category..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Drug Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Form & Strength</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Unit Price</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{p.name}</div>
                    <div className="text-xs text-slate-400">ID: {p.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {p.dosageForm} • {p.strength}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">
                    ${p.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="p-2 text-slate-400 hover:text-emerald-500 transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="p-20 text-center">
              <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                <Plus size={32} />
              </div>
              <p className="text-slate-500 font-medium">No products defined yet.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-4 text-emerald-600 font-bold hover:underline text-sm"
              >
                Define your first product
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductMaster;
