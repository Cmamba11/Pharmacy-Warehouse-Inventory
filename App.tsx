
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ProductMaster from './pages/ProductMaster';
import GoodsReceiving from './pages/GoodsReceiving';
import StockInventory from './pages/StockInventory';
import ExpiryIntelligence from './pages/ExpiryIntelligence';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [userProfile, setUserProfile] = useState({
    fullName: 'Alice Manager',
    role: 'Pharmacist',
    email: 'alice@pharma.com'
  });

  const renderPage = () => {
    switch (currentPath) {
      case '/': 
        return <Dashboard />;
      case '/products': 
        return <ProductMaster />;
      case '/grn':
        return <GoodsReceiving />;
      case '/inventory':
        return <StockInventory />;
      case '/expiry':
        return <ExpiryIntelligence />;
      case '/reports':
        return <Reports />;
      case '/settings':
        return (
          <Settings 
            userProfile={userProfile} 
            onUpdateProfile={(updated) => setUserProfile({ ...userProfile, ...updated })} 
          />
        );
      default: return (
        <div className="h-full flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 text-4xl">
            <div className="animate-pulse">🚧</div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-900">Page Under Construction</h2>
            <p className="text-slate-500 max-w-xs">This module is part of the ongoing Phase 2 implementation. Check back soon!</p>
          </div>
          <button 
            onClick={() => setCurrentPath('/')}
            className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
          >
            Return to Command Center
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar 
        currentPath={currentPath} 
        onNavigate={setCurrentPath} 
        userProfile={userProfile}
      />
      
      <main className="pl-64 min-h-screen">
        <div className="max-w-[1400px] mx-auto p-8 lg:p-12">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;
