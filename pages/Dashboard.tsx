
import React, { useEffect, useState } from 'react';
import { db } from '../services/mockDb';
import { DashboardStats } from '../types';
import StatCard from '../components/StatCard';
import { 
  DollarSign, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Activity,
  ArrowRight,
  Plus,
  // Fix: Added CheckCircle2 to the imports from lucide-react
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    db.getDashboardStats().then(setStats);
  }, []);

  if (!stats) return <div className="p-8 text-slate-500">Loading intelligence...</div>;

  const hasData = stats.totalStockValue > 0 || stats.nearExpiryCount > 0 || stats.expiredCount > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Stock Intelligence</h2>
          <p className="text-slate-500 mt-1">Real-time overview of your pharmacy inventory and risks.</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last Synced</p>
          <p className="text-sm font-medium text-slate-900">Just Now</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Stock Value" 
          value={`$${stats.totalStockValue.toLocaleString()}`} 
          icon={<DollarSign size={24} />} 
          color="emerald"
        />
        <StatCard 
          title="Near Expiry" 
          value={stats.nearExpiryCount} 
          subValue="Expiring within 60 days"
          icon={<Clock size={24} />} 
          color="amber"
        />
        <StatCard 
          title="Expired Items" 
          value={stats.expiredCount} 
          subValue="Immediate action required"
          icon={<AlertTriangle size={24} />} 
          color="rose"
        />
        <StatCard 
          title="Slow Moving" 
          value={stats.slowMovingCount} 
          subValue="Inactivity threshold reached"
          icon={<TrendingUp size={24} />} 
          color="indigo"
        />
      </div>

      {!hasData ? (
        <div className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto">
            <Plus size={40} />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-bold text-slate-900">Your Inventory is Empty</h3>
            <p className="text-slate-500 mt-2">Start your demo by defining products in the Product Master and receiving stock via Goods Receiving.</p>
          </div>
          <div className="flex justify-center space-x-4">
            <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all">
              Add Products
            </button>
            <button className="px-6 py-3 bg-emerald-500 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all">
              Receive Stock
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-lg flex items-center space-x-2">
                <Activity size={20} className="text-emerald-500" />
                <span>Stock Movement Trends</span>
              </h3>
            </div>
            <div className="h-80 flex items-center justify-center text-slate-300 text-sm font-medium border-2 border-dashed border-slate-50 rounded-3xl">
              Chart data will populate as transactions occur.
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
            <h3 className="font-bold text-lg mb-6">Action Items</h3>
            <div className="flex-1 flex items-center justify-center text-center p-8 bg-slate-50 rounded-3xl">
              <div>
                <CheckCircle2 size={40} className="text-emerald-400 mx-auto mb-4" />
                <p className="text-sm font-bold text-slate-900">All Clear</p>
                <p className="text-xs text-slate-400 mt-1">No critical alerts detected.</p>
              </div>
            </div>
            <button className="mt-6 w-full py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold flex items-center justify-center space-x-2 hover:bg-slate-800 transition-colors">
              <span>Review All Alerts</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
