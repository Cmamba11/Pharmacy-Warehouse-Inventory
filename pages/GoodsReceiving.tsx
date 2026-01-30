
import React, { useState, useEffect } from 'react';
import { db } from '../services/mockDb';
import { Product } from '../types';
import { Package, Calendar, Hash, Clipboard, CheckCircle2 } from 'lucide-react';

const GoodsReceiving: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    productId: '',
    batchNumber: '',
    expiryDate: '',
    quantity: '',
    referenceDoc: ''
  });

  useEffect(() => {
    db.getProducts().then(setProducts);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productId || !form.batchNumber || !form.expiryDate || !form.quantity) return;

    setLoading(true);
    try {
      await db.addGRN({
        productId: form.productId,
        batchNumber: form.batchNumber,
        expiryDate: form.expiryDate,
        quantity: parseInt(form.quantity),
        referenceDoc: form.referenceDoc
      });
      setSuccess(true);
      setForm({ productId: '', batchNumber: '', expiryDate: '', quantity: '', referenceDoc: '' });
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Goods Receiving</h2>
        <p className="text-slate-500 mt-1">Record incoming stock deliveries and generate GRN vouchers.</p>
      </header>

      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-2xl flex items-center space-x-3 animate-in zoom-in duration-300">
          <CheckCircle2 size={24} />
          <span className="font-bold">Stock recorded successfully! Inventory has been updated.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center space-x-2">
              <Package size={16} className="text-slate-400" />
              <span>Select Product</span>
            </label>
            <select 
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 text-sm"
              value={form.productId}
              onChange={e => setForm({...form, productId: e.target.value})}
              required
            >
              <option value="">Choose a product...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.strength})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center space-x-2">
              <Clipboard size={16} className="text-slate-400" />
              <span>Reference Doc (Invoice #)</span>
            </label>
            <input 
              type="text"
              placeholder="e.g. INV-2025-001"
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 text-sm"
              value={form.referenceDoc}
              onChange={e => setForm({...form, referenceDoc: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center space-x-2">
              <Hash size={16} className="text-slate-400" />
              <span>Batch Number</span>
            </label>
            <input 
              type="text"
              placeholder="e.g. BATCH-X99"
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 text-sm"
              value={form.batchNumber}
              onChange={e => setForm({...form, batchNumber: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center space-x-2">
              <Calendar size={16} className="text-slate-400" />
              <span>Expiry Date</span>
            </label>
            <input 
              type="date"
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 text-sm"
              value={form.expiryDate}
              onChange={e => setForm({...form, expiryDate: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center space-x-2">
              <span className="text-slate-400 font-bold">#</span>
              <span>Quantity</span>
            </label>
            <input 
              type="number"
              placeholder="Amount received"
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 text-sm"
              value={form.quantity}
              onChange={e => setForm({...form, quantity: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-50 flex justify-end">
          <button 
            type="submit"
            disabled={loading}
            className="bg-emerald-500 text-white px-10 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <CheckCircle2 size={20} />
            )}
            <span>Process Receipt</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoodsReceiving;
