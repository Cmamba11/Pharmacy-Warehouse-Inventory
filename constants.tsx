
import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  History, 
  AlertTriangle, 
  Settings, 
  BarChart3, 
  ClipboardList 
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
  { name: 'Product Master', path: '/products', icon: <Package size={20} /> },
  { name: 'Goods Receiving', path: '/grn', icon: <ClipboardList size={20} /> },
  { name: 'Stock Inventory', path: '/inventory', icon: <History size={20} /> },
  { name: 'Expiry Intelligence', path: '/expiry', icon: <AlertTriangle size={20} /> },
  { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} /> },
  { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
];

export const CATEGORIES = [
  'Antibiotic', 'Analgesic', 'Antihistamine', 'Antiseptic', 'Cardiovascular', 'Dermatological', 'Gastrointestinal'
];

export const DOSAGE_FORMS = [
  'Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Cream', 'Drops'
];
