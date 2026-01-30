
import React, { useState, useEffect } from 'react';
import { db } from '../services/mockDb';
import { Product, StockBatch, StockStatus } from '../types';
import { ChevronDown, ChevronRight, AlertCircle, Info, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface InventoryItem extends Product {
  totalQty: number;
  batches: StockBatch[];
}

const StockInventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    db.getInventory().then(setInventory);
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getStockHealth = (qty: number, min: number) => {
    if (qty === 0) return { label: 'Out of Stock', color: 'bg-rose-50 text-rose-600 border-rose-100' };
    if (qty < min) return { label: 'Low Stock', color: 'bg-amber-50 text-amber-600 border-amber-100' };
    return { label: 'Healthy', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Current Inventory</h2>
          <p className="text-slate-500">Real-time stock levels and batch distribution across the facility.</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold flex items-center space-x-2 hover:bg-slate-50">
            <Filter size={16} />
            <span>Filter by Location</span>
          </button>
        </div>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="w-10 px-6 py-4"></th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">In Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Min Level</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Health Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {inventory.map((item) => {
                const isExpanded = expanded[item.id];
                const health = getStockHealth(item.totalQty, item.minStockLevel);
                
                return (
                  <React.Fragment key={item.id}>
                    <tr 
                      className="hover:bg-slate-50/30 transition-colors cursor-pointer"
                      onClick={() => toggleExpand(item.id)}
                    >
                      <td className="px-6 py-4">
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-xs text-slate-400">{item.strength} • {item.category}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-lg font-bold ${item.totalQty < item.minStockLevel ? 'text-rose-600' : 'text-slate-900'}`}>
                          {item.totalQty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-500 font-medium">
                        {item.minStockLevel}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${health.color}`}>
                          {health.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">
                        ${(item.totalQty * item.unitPrice).toLocaleString()}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="bg-slate-50/50 p-6">
                          <div className="bg-white rounded-2xl border border-slate-100 shadow-inner overflow-hidden">
                            <table className="w-full text-xs">
                              <thead className="bg-slate-50">
                                <tr>
                                  <th className="px-4 py-3 text-slate-400 uppercase">Batch #</th>
                                  <th className="px-4 py-3 text-slate-400 uppercase text-center">Expiry</th>
                                  <th className="px-4 py-3 text-slate-400 uppercase text-center">Quantity</th>
                                  <th className="px-4 py-3 text-slate-400 uppercase text-center">Status</th>
                                  <th className="px-4 py-3 text-slate-400 uppercase text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {item.batches.map(batch => {
                                  const isExpired = new Date(batch.expiryDate) < new Date();
                                  return (
                                    <tr key={batch.id} className="hover:bg-slate-50/50">
                                      <td className="px-4 py-3 font-bold">{batch.batchNumber}</td>
                                      <td className={`px-4 py-3 text-center ${isExpired ? 'text-rose-600 font-bold' : ''}`}>
                                        {format(new Date(batch.expiryDate), 'MMM dd, yyyy')}
                                        {isExpired && <span className="ml-1 text-[10px] bg-rose-100 px-1 rounded">EXPIRED</span>}
                                      </td>
                                      <td className="px-4 py-3 text-center font-medium">{batch.quantity}</td>
                                      <td className="px-4 py-3 text-center uppercase font-bold tracking-tight text-[10px]">
                                        <span className={batch.status === StockStatus.ACTIVE ? 'text-emerald-500' : 'text-rose-500'}>
                                          {batch.status}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 text-right">
                                        <button className="text-emerald-500 hover:underline">Transfer</button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockInventory;
