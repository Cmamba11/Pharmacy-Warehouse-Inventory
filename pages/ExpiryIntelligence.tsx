
import React, { useState, useEffect } from 'react';
import { db } from '../services/mockDb';
import { StockBatch, Product } from '../types';
import { AlertTriangle, Clock, ShieldAlert, CheckCircle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const ExpiryIntelligence: React.FC = () => {
  const [batches, setBatches] = useState<(StockBatch & { product?: Product })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const inventory = await db.getInventory();
      const allBatches = inventory.flatMap(item => 
        item.batches.map(b => ({ ...b, product: item }))
      );
      // Sort by expiry date ascending
      allBatches.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
      setBatches(allBatches);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getRiskCategory = (date: string) => {
    const diff = differenceInDays(new Date(date), new Date());
    if (diff < 0) return { label: 'Expired', color: 'rose', icon: <ShieldAlert size={20} /> };
    if (diff < 30) return { label: 'Critical', color: 'amber', icon: <AlertTriangle size={20} /> };
    if (diff < 90) return { label: 'Near Expiry', color: 'blue', icon: <Clock size={20} /> };
    return { label: 'Safe', color: 'emerald', icon: <CheckCircle size={20} /> };
  };

  if (loading) return <div className="p-8 text-slate-500">Scanning dates...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Expiry Intelligence</h2>
        <p className="text-slate-500 mt-1">Predictive analysis and alerts for expiring pharmaceutical assets.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
            <ShieldAlert className="text-rose-500" />
            <span>High Risk & Expired Batches</span>
          </h3>
          <div className="space-y-3">
            {batches.filter(b => differenceInDays(new Date(b.expiryDate), new Date()) < 30).map(batch => {
              const risk = getRiskCategory(batch.expiryDate);
              const colors = {
                rose: 'bg-rose-50 border-rose-100 text-rose-900',
                amber: 'bg-amber-50 border-amber-100 text-amber-900',
                blue: 'bg-blue-50 border-blue-100 text-blue-900',
                emerald: 'bg-emerald-50 border-emerald-100 text-emerald-900'
              };
              
              return (
                <div key={batch.id} className={`p-5 rounded-3xl border ${colors[risk.color as keyof typeof colors]} flex justify-between items-center group`}>
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-2xl bg-white shadow-sm`}>{risk.icon}</div>
                    <div>
                      <h4 className="font-bold">{batch.product?.name} ({batch.batchNumber})</h4>
                      <p className="text-xs opacity-70 mt-1 uppercase font-bold tracking-widest">
                        Expires: {format(new Date(batch.expiryDate), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black">{batch.quantity}</div>
                    <div className="text-[10px] uppercase font-bold tracking-tighter opacity-60">Qty Remaining</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <h3 className="text-lg font-bold mb-6">Action Dashboard</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div>
                <p className="text-sm font-bold text-slate-700">Expiry Write-off Pending</p>
                <p className="text-xs text-slate-500">Review expired batches for disposal.</p>
              </div>
              <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800">
                Process All
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div>
                <p className="text-sm font-bold text-slate-700">Near-Expiry Promotion</p>
                <p className="text-xs text-slate-500">Apply discounts to batches within 90 days.</p>
              </div>
              <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800">
                View Batches
              </button>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-50">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">Expiry Distribution</h4>
            <div className="flex space-x-2 h-4 rounded-full overflow-hidden bg-slate-100">
              <div className="bg-rose-500 h-full" style={{ width: '15%' }}></div>
              <div className="bg-amber-500 h-full" style={{ width: '25%' }}></div>
              <div className="bg-blue-500 h-full" style={{ width: '35%' }}></div>
              <div className="bg-emerald-500 h-full flex-1"></div>
            </div>
            <div className="grid grid-cols-4 mt-3 text-[10px] font-bold text-slate-400 uppercase text-center">
              <span>Expired</span>
              <span>&lt;30d</span>
              <span>&lt;90d</span>
              <span>Safe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpiryIntelligence;
