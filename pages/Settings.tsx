
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  Globe, 
  Shield, 
  Database, 
  Save,
  Moon,
  ChevronRight,
  Mail,
  Smartphone,
  AlertTriangle,
  Lock,
  Clock,
  Languages,
  DollarSign,
  CheckCircle2,
  XCircle,
  Loader2,
  Sun
} from 'lucide-react';

type TabType = 'profile' | 'notifications' | 'localization' | 'security';

interface SettingsProps {
  userProfile: {
    fullName: string;
    email: string;
    role: string;
  };
  onUpdateProfile: (updated: { fullName?: string; email?: string }) => void;
}

// Comprehensive Global Currency List
const ALL_CURRENCIES = [
  "AFN - Afghan Afghani", "ALL - Albanian Lek", "DZD - Algerian Dinar", "AOA - Angolan Kwanza", "ARS - Argentine Peso", 
  "AMD - Armenian Dram", "AWG - Aruban Florin", "AUD - Australian Dollar", "AZN - Azerbaijani Manat", "BSD - Bahamian Dollar", 
  "BHD - Bahraini Dinar", "BDT - Bangladeshi Taka", "BBD - Barbadian Dollar", "BYN - Belarusian Ruble", "BZD - Belize Dollar", 
  "BMD - Bermudian Dollar", "BTN - Bhutanese Ngultrum", "BOB - Bolivian Boliviano", "BAM - Bosnia-Herzegovina Mark", "BWP - Botswana Pula", 
  "BRL - Brazilian Real", "GBP - British Pound", "BND - Brunei Dollar", "BGN - Bulgarian Lev", "BIF - Burundian Franc", 
  "KHR - Cambodian Riel", "CAD - Canadian Dollar", "CVE - Cape Verdean Escudo", "KYD - Cayman Islands Dollar", "XAF - Central African CFA Franc", 
  "XPF - CFP Franc", "CLP - Chilean Peso", "CNY - Chinese Yuan", "COP - Colombian Peso", "KMF - Comorian Franc", 
  "CDF - Congolese Franc", "CRC - Costa Rican Colón", "HRK - Croatian Kuna", "CUP - Cuban Peso", "CZK - Czech Koruna", 
  "DKK - Danish Krone", "DJF - Djiboutian Franc", "DOP - Dominican Peso", "XCD - East Caribbean Dollar", "EGP - Egyptian Pound", 
  "ERN - Eritrean Nakfa", "ETB - Ethiopian Birr", "EUR - Euro", "FKP - Falkland Islands Pound", "FJD - Fijian Dollar", 
  "GMD - Gambian Dalasi", "GEL - Georgian Lari", "GHS - Ghanaian Cedi", "GIP - Gibraltar Pound", "GTQ - Guatemalan Quetzal", 
  "GNF - Guinean Franc", "GYD - Guyanese Dollar", "HTG - Haitian Gourde", "HNL - Honduran Lempira", "HKD - Hong Kong Dollar", 
  "HUF - Hungarian Forint", "ISK - Icelandic Króna", "INR - Indian Rupee", "IDR - Indonesian Rupiah", "IRR - Iranian Rial", 
  "IQD - Iraqi Dinar", "ILS - Israeli Shekel", "JMD - Jamaican Dollar", "JPY - Japanese Yen", "JOD - Jordanian Dinar", 
  "KZT - Kazakhstani Tenge", "KES - Kenyan Shilling", "KWD - Kuwaiti Dinar", "KGS - Kyrgyzstani Som", "LAK - Lao Kip", 
  "LBP - Lebanese Pound", "LSL - Lesotho Loti", "LRD - Liberian Dollar", "LYD - Libyan Dinar", "MOP - Macanese Pataca", 
  "MKD - Macedonian Denar", "MGA - Malagasy Ariary", "MWK - Malawian Kwacha", "MYR - Malaysian Ringgit", "MVR - Maldivian Rufiyaa", 
  "MRU - Mauritanian Ouguiya", "MUR - Mauritian Rupee", "MXN - Mexican Peso", "MDL - Moldovan Leu", "MNT - Mongolian Tögrög", 
  "MAD - Moroccan Dirham", "MZN - Mozambican Metical", "MMK - Myanmar Kyat", "NAD - Namibian Dollar", "NPR - Nepalese Rupee", 
  "ANG - Netherlands Antillean Guilder", "NZD - New Zealand Dollar", "NIO - Nicaraguan Córdoba", "NGN - Nigerian Naira", "NOK - Norwegian Krone", 
  "OMR - Omani Rial", "PKR - Pakistani Rupee", "PAB - Panamanian Balboa", "PGK - Papua New Guinean Kina", "PYG - Paraguayan Guaraní", 
  "PEN - Peruvian Sol", "PHP - Philippine Peso", "PLN - Polish Złoty", "QAR - Qatari Riyal", "RON - Romanian Leu", 
  "RUB - Russian Ruble", "RWF - Rwandan Franc", "SAR - Saudi Riyal", "RSD - Serbian Dinar", "SCR - Seychellois Rupee", 
  "SLL - Sierra Leonean Leone", "SGD - Singapore Dollar", "SBD - Solomon Islands Dollar", "SOS - Somali Shilling", "ZAR - South African Rand", 
  "KRW - South Korean Won", "LKR - Sri Lankan Rupee", "SDG - Sudanese Pound", "SRD - Surinamese Dollar", "SZL - Swazi Lilangeni", 
  "SEK - Swedish Krona", "CHF - Swiss Franc", "SYP - Syrian Pound", "TWD - New Taiwan Dollar", "TJS - Tajikistani Somoni", 
  "TZS - Tanzanian Shilling", "THB - Thai Baht", "TOP - Tongan Paʻanga", "TTD - Trinidad and Tobago Dollar", "TND - Tunisian Dinar", 
  "TRY - Turkish Lira", "TMT - Turkmenistani Manat", "UGX - Ugandan Shilling", "UAH - Ukrainian Hryvnia", "AED - United Arab Emirates Dirham", 
  "UYU - Uruguayan Peso", "UZS - Uzbekistani Som", "VUV - Vanuatu Vatu", "VES - Venezuelan Bolívar", "VND - Vietnamese Đồng", 
  "YER - Yemeni Rial", "ZMW - Zambian Kwacha", "ZWL - Zimbabwean Dollar"
];

const Settings: React.FC<SettingsProps> = ({ userProfile, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [saveStatus, setSaveStatus] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);

  // Global Settings State
  const [config, setConfig] = useState({
    fullName: userProfile.fullName,
    email: userProfile.email,
    darkMode: false,
    emailSummaries: true,
    smsAlerts: false,
    expiryWarnings: true,
    expiryThreshold: 60,
    language: 'English (US)',
    currency: 'USD - US Dollar',
    timezone: '(UTC-05:00) Eastern Time',
    dateFormat: 'DD/MM/YYYY',
    twoFactor: true,
    sessionTimeout: 'After 15 minutes of inactivity'
  });

  // Password State
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  // Update local form state when userProfile prop changes
  useEffect(() => {
    setConfig(prev => ({
      ...prev,
      fullName: userProfile.fullName,
      email: userProfile.email
    }));
  }, [userProfile]);

  // Apply dark mode effect
  useEffect(() => {
    if (config.darkMode) {
      document.documentElement.classList.add('dark-mode-sim');
    } else {
      document.documentElement.classList.remove('dark-mode-sim');
    }
  }, [config.darkMode]);

  const handleToggle = (key: keyof typeof config) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
    showFeedback(`Preference updated: ${key}`, 'success');
  };

  const handleSelect = (key: keyof typeof config, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    showFeedback(`${key} changed to ${value}`, 'info');
  };

  const showFeedback = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setSaveStatus({ msg, type });
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ 
      fullName: config.fullName, 
      email: config.email 
    });
    showFeedback("Profile details saved successfully!", "success");
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.current !== 'admin123') {
      showFeedback("Current password incorrect!", "error");
      return;
    }
    if (passwords.new.length < 8) {
      showFeedback("New password must be at least 8 characters!", "error");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      showFeedback("New passwords do not match!", "error");
      return;
    }
    showFeedback("Security credentials updated successfully!", "success");
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const startBackup = () => {
    if (isBackingUp) return;
    setIsBackingUp(true);
    setBackupProgress(0);
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          showFeedback("Cloud backup completed successfully!", "success");
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  const Switch = ({ active, onToggle, color = "emerald" }: { active: boolean, onToggle: () => void, color?: string }) => {
    const colorMap: Record<string, string> = {
      emerald: 'bg-emerald-500',
      indigo: 'bg-indigo-500',
      blue: 'bg-blue-500',
      rose: 'bg-rose-500',
      slate: 'bg-slate-900'
    };
    return (
      <button 
        onClick={onToggle}
        className={`w-12 h-6 rounded-full relative transition-all duration-300 ${active ? colorMap[color] : 'bg-slate-300'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${active ? 'right-1' : 'left-1'}`}></div>
      </button>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <h3 className="font-bold text-lg border-b border-slate-50 pb-4">Personal Details</h3>
              <div className="flex items-center space-x-6">
                <div className="relative group">
                  <img src="https://picsum.photos/100/100?seed=user" className="w-20 h-20 rounded-3xl border-4 border-slate-50 shadow-inner transition-transform group-hover:scale-105" alt="Profile" />
                  <button className="absolute -bottom-2 -right-2 p-2 bg-slate-900 text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
                    <Save size={14} />
                  </button>
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-bold text-slate-900">{userProfile.fullName}</h4>
                  <p className="text-sm text-slate-500">{userProfile.role} • Main Branch</p>
                  <button onClick={() => showFeedback("Browser file selector triggered...", "info")} className="text-xs font-bold text-emerald-600 hover:underline">Edit Photo</button>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    value={config.fullName} 
                    onChange={e => handleSelect('fullName', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                  <input 
                    type="email" 
                    value={config.email} 
                    onChange={e => handleSelect('email', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none" 
                  />
                </div>
                <div className="md:col-span-2 pt-2">
                   <button type="submit" className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center space-x-2">
                    <Save size={16} />
                    <span>Save Changes</span>
                   </button>
                </div>
              </form>
            </section>

            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <h3 className="font-bold text-lg border-b border-slate-50 pb-4">Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl transition-all duration-500 ${config.darkMode ? 'bg-slate-900 text-amber-400 shadow-lg shadow-slate-900/40' : 'bg-indigo-50 text-indigo-600'}`}>
                      {config.darkMode ? <Moon size={18} /> : <Sun size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold">Dark Mode Simulation</p>
                      <p className="text-xs text-slate-500">Toggle system-wide UI appearance.</p>
                    </div>
                  </div>
                  <Switch active={config.darkMode} onToggle={() => handleToggle('darkMode')} color="slate" />
                </div>
              </div>
            </section>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <h3 className="font-bold text-lg border-b border-slate-50 pb-4">Alert Configurations</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Mail size={18} /></div>
                    <div>
                      <p className="text-sm font-bold">Email Summaries</p>
                      <p className="text-xs text-slate-500">Weekly inventory health reports</p>
                    </div>
                  </div>
                  <Switch active={config.emailSummaries} onToggle={() => handleToggle('emailSummaries')} color="blue" />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Smartphone size={18} /></div>
                    <div>
                      <p className="text-sm font-bold">SMS Critical Alerts</p>
                      <p className="text-xs text-slate-500">Instant texts for stock-outs</p>
                    </div>
                  </div>
                  <Switch active={config.smsAlerts} onToggle={() => handleToggle('smsAlerts')} color="emerald" />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-rose-200 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><AlertTriangle size={18} /></div>
                    <div>
                      <p className="text-sm font-bold">Expiry Warnings</p>
                      <p className="text-xs text-slate-500">Notify when items reach threshold</p>
                    </div>
                  </div>
                  <Switch active={config.expiryWarnings} onToggle={() => handleToggle('expiryWarnings')} color="rose" />
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Expiry Threshold (Days)</label>
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{config.expiryThreshold}D</span>
                </div>
                <div className="flex items-center space-x-4">
                  <input 
                    type="range" 
                    min="7" 
                    max="180" 
                    value={config.expiryThreshold} 
                    onChange={(e) => handleSelect('expiryThreshold', parseInt(e.target.value))}
                    className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
                  />
                </div>
              </div>
            </section>
          </div>
        );

      case 'localization':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <h3 className="font-bold text-lg border-b border-slate-50 pb-4">Regional Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                    <Languages size={14} />
                    <span>Display Language</span>
                  </label>
                  <select 
                    value={config.language}
                    onChange={(e) => handleSelect('language', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  >
                    <option>English (US)</option>
                    <option>French (FR)</option>
                    <option>Spanish (ES)</option>
                    <option>Arabic (AE)</option>
                    <option>Chinese (Mandarin)</option>
                    <option>Portuguese (BR)</option>
                    <option>German (DE)</option>
                    <option>Russian (RU)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                    <DollarSign size={14} />
                    <span>Primary Currency</span>
                  </label>
                  <select 
                    value={config.currency}
                    onChange={(e) => handleSelect('currency', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none h-[42px]"
                  >
                    {ALL_CURRENCIES.map(curr => <option key={curr} value={curr}>{curr}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                    <Clock size={14} />
                    <span>Timezone</span>
                  </label>
                  <select 
                    value={config.timezone}
                    onChange={(e) => handleSelect('timezone', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  >
                    <option>(UTC-05:00) Eastern Time</option>
                    <option>(UTC-08:00) Pacific Time</option>
                    <option>(UTC+00:00) Greenwich Mean Time</option>
                    <option>(UTC+01:00) West Central Africa</option>
                    <option>(UTC+02:00) Cairo</option>
                    <option>(UTC+05:30) Mumbai</option>
                    <option>(UTC+08:00) Singapore Standard Time</option>
                    <option>(UTC+09:00) Tokyo</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date Format</label>
                  <select 
                    value={config.dateFormat}
                    onChange={(e) => handleSelect('dateFormat', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  >
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                    <option>MMM dd, yyyy</option>
                  </select>
                </div>
              </div>
            </section>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <h3 className="font-bold text-lg border-b border-slate-50 pb-4">Security Credentials</h3>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input 
                      type="password" 
                      placeholder="Type 'admin123' to test" 
                      value={passwords.current}
                      onChange={e => setPasswords({...passwords, current: e.target.value})}
                      className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" 
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">New Password</label>
                    <input 
                      type="password" 
                      placeholder="Min 8 characters" 
                      value={passwords.new}
                      onChange={e => setPasswords({...passwords, new: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" 
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Confirm New Password</label>
                    <input 
                      type="password" 
                      placeholder="Match new password" 
                      value={passwords.confirm}
                      onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" 
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95">
                  Update Password
                </button>
              </form>
            </section>

            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <h3 className="font-bold text-lg border-b border-slate-50 pb-4">Access Control</h3>
              <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 hover:border-emerald-300 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl"><Shield size={18} /></div>
                  <div>
                    <p className="text-sm font-bold">Two-Factor Authentication</p>
                    <p className="text-xs text-emerald-600">Secure your account with multi-step verification.</p>
                  </div>
                </div>
                <Switch active={config.twoFactor} onToggle={() => handleToggle('twoFactor')} color="emerald" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                  <Clock size={14} />
                  <span>Auto Session Timeout</span>
                </label>
                <select 
                  value={config.sessionTimeout}
                  onChange={(e) => handleSelect('sessionTimeout', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none"
                >
                  <option>After 15 minutes of inactivity</option>
                  <option>After 30 minutes of inactivity</option>
                  <option>After 1 hour of inactivity</option>
                  <option>After 4 hours of inactivity</option>
                  <option>Never (Not Recommended)</option>
                </select>
              </div>
            </section>
          </div>
        );
    }
  };

  const navItems = [
    { id: 'profile' as TabType, icon: <User size={18} />, label: 'Profile' },
    { id: 'notifications' as TabType, icon: <Bell size={18} />, label: 'Notifications' },
    { id: 'localization' as TabType, icon: <Globe size={18} />, label: 'Localization' },
    { id: 'security' as TabType, icon: <Shield size={18} />, label: 'Security' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 relative">
      {/* Visual Feedback Notifications */}
      {saveStatus && (
        <div className="fixed top-8 right-8 z-50 animate-in slide-in-from-right-10 duration-300">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 border ${
            saveStatus.type === 'success' ? 'bg-emerald-500 border-emerald-400' : 
            saveStatus.type === 'error' ? 'bg-rose-500 border-rose-400' : 'bg-slate-900 border-slate-700'
          } text-white`}>
            {saveStatus.type === 'success' && <CheckCircle2 size={20} />}
            {saveStatus.type === 'error' && <XCircle size={20} />}
            {saveStatus.type === 'info' && <Loader2 size={20} className="animate-spin" />}
            <span className="font-bold text-sm">{saveStatus.msg}</span>
          </div>
        </div>
      )}

      <header>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Settings</h2>
        <p className="text-slate-500 mt-1">Configure your workspace preferences and security protocols.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <aside className="space-y-2">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-white shadow-sm border border-slate-100 text-emerald-600 font-bold' 
                    : 'text-slate-500 hover:bg-white hover:shadow-sm font-medium'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 space-y-4 px-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Maintenance</h4>
            <div className="space-y-2">
              <button 
                disabled={isBackingUp}
                onClick={startBackup}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all group relative overflow-hidden ${
                  isBackingUp ? 'bg-slate-100 cursor-not-allowed' : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                {isBackingUp && (
                  <div 
                    className="absolute inset-y-0 left-0 bg-emerald-100 transition-all duration-300" 
                    style={{ width: `${backupProgress}%` }}
                  />
                )}
                <div className="flex items-center space-x-3 z-10">
                  <Database size={16} className={`transition-colors ${isBackingUp ? 'text-emerald-500' : 'text-slate-400 group-hover:text-emerald-500'}`} />
                  <span className={`text-xs font-bold ${isBackingUp ? 'text-emerald-700' : 'text-slate-700'}`}>
                    {isBackingUp ? `Backing up... ${backupProgress}%` : 'Cloud Backup'}
                  </span>
                </div>
                {!isBackingUp && <ChevronRight size={14} className="text-slate-300 z-10" />}
              </button>
              
              <button 
                onClick={() => showFeedback("System cache cleared successfully!", "success")}
                className="w-full flex items-center space-x-3 p-3 bg-slate-50 hover:bg-rose-50 rounded-2xl transition-all group"
              >
                <div className="p-1 rounded-lg bg-slate-100 group-hover:bg-rose-100 transition-colors">
                  <XCircle size={14} className="text-slate-400 group-hover:text-rose-500" />
                </div>
                <span className="text-xs font-bold text-slate-700 group-hover:text-rose-600">Clear Cache</span>
              </button>
            </div>
          </div>
        </aside>

        <div className="md:col-span-2">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
