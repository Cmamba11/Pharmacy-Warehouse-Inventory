
import React, { useEffect, useState } from 'react';
import { db } from '../services/mockDb';
import { TransactionType } from '../types';
import { 
  FileText, 
  Download, 
  BarChart2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { format } from 'date-fns';

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

const Reports: React.FC = () => {
  const [ledger, setLedger] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    db.getLedger().then(setLedger);
    db.getConsumptionByCategory().then(setChartData);
  }, []);

  const filteredLedger = ledger.filter(entry => 
    entry.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.referenceDoc?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reports & Analytics</h2>
          <p className="text-slate-500 mt-1">Audit trails, consumption patterns, and financial summaries.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold flex items-center space-x-2 hover:bg-slate-50 transition-colors">
            <Calendar size={18} />
            <span>Select Range</span>
          </button>
          <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center space-x-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
            <Download size={18} />
            <span>Export CSV</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-lg flex items-center space-x-2">
              <BarChart2 size={20} className="text-emerald-500" />
              <span>Volume by Category (Monthly)</span>
            </h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-lg mb-6">Summary Metrics</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Stock Turnover</p>
                <p className="text-xl font-black text-emerald-900">4.2x</p>
              </div>
              <ArrowUpRight className="text-emerald-500" />
            </div>
            <div className="flex justify-between items-center p-4 bg-rose-50 rounded-2xl border border-rose-100">
              <div>
                <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Monthly Loss</p>
                <p className="text-xl font-black text-rose-900">$1,420</p>
              </div>
              <ArrowDownLeft className="text-rose-500" />
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Orders Fulfilled</p>
                <p className="text-xl font-black text-slate-900">842</p>
              </div>
              <FileText className="text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-lg">Transaction History</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search history..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Qty</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ref Doc</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLedger.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors text-xs">
                  <td className="px-6 py-4 text-slate-500">
                    {format(new Date(entry.timestamp), 'MMM dd, HH:mm')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter text-[9px] ${
                      entry.type === TransactionType.GRN ? 'bg-emerald-100 text-emerald-700' : 
                      entry.type === TransactionType.WHOLESALE_ISSUE ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {entry.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">{entry.productName}</td>
                  <td className="px-6 py-4 text-center font-bold">{entry.quantity}</td>
                  <td className="px-6 py-4 text-slate-400 font-mono">{entry.referenceDoc || '-'}</td>
                  <td className="px-6 py-4 font-medium text-slate-600">{entry.createdBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
