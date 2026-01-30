
export enum UserRole {
  WAREHOUSE_OFFICER = 'WAREHOUSE_OFFICER',
  PHARMACIST_MANAGER = 'PHARMACIST_MANAGER',
  ACCOUNTANT = 'ACCOUNTANT',
  ADMIN = 'ADMIN'
}

export enum TransactionType {
  GRN = 'GRN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  TRANSFER_IN = 'TRANSFER_IN',
  WHOLESALE_ISSUE = 'WHOLESALE_ISSUE',
  ADJUSTMENT_ADD = 'ADJUSTMENT_ADD',
  ADJUSTMENT_SUB = 'ADJUSTMENT_SUB',
  EXPIRY_WRITE_OFF = 'EXPIRY_WRITE_OFF'
}

export enum StockStatus {
  ACTIVE = 'ACTIVE',
  QUARANTINE = 'QUARANTINE',
  EXPIRED = 'EXPIRED',
  DISPOSED = 'DISPOSED'
}

export interface Product {
  id: string;
  name: string;
  strength: string;
  dosageForm: string;
  category: string;
  unitPrice: number;
  minStockLevel: number;
  isActive: boolean;
  createdAt: string;
}

export interface StockBatch {
  id: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  status: StockStatus;
  productId: string;
  locationId?: string;
}

export interface StockLedger {
  id: string;
  type: TransactionType;
  quantity: number;
  referenceDoc?: string;
  reason?: string;
  timestamp: string;
  productId: string;
  batchId: string;
  locationId?: string;
  userId: string;
  createdBy: string;
}

export interface DashboardStats {
  totalStockValue: number;
  nearExpiryCount: number;
  expiredCount: number;
  slowMovingCount: number;
  deadStockCount: number;
}
