
import { 
  Product, 
  StockBatch, 
  StockLedger, 
  StockStatus, 
  TransactionType,
  DashboardStats 
} from '../types';
import { addDays, subDays } from 'date-fns';

// Starting with an empty database for the user's demo
const MOCK_PRODUCTS: Product[] = [];
const MOCK_BATCHES: StockBatch[] = [];
const MOCK_LEDGER: StockLedger[] = [];

class MockDatabase {
  private products = [...MOCK_PRODUCTS];
  private batches = [...MOCK_BATCHES];
  private ledger = [...MOCK_LEDGER];

  async getProducts() { return [...this.products]; }
  
  async addProduct(data: Omit<Product, 'id' | 'createdAt' | 'isActive'>) {
    const newProduct: Product = {
      ...data,
      id: `p${this.products.length + 1}`,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async getInventory() {
    return this.products.map(p => {
      const pBatches = this.batches.filter(b => b.productId === p.id);
      const totalQty = pBatches.reduce((sum, b) => (b.status === StockStatus.ACTIVE ? sum + b.quantity : sum), 0);
      return { ...p, totalQty, batches: pBatches };
    });
  }

  async getLedger() {
    return this.ledger.map(entry => {
      const product = this.products.find(p => p.id === entry.productId);
      const batch = this.batches.find(b => b.id === entry.batchId);
      return { ...entry, productName: product?.name, batchNumber: batch?.batchNumber };
    });
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const now = new Date();
    const nearExpiryDate = addDays(now, 60);
    
    const nearExpiry = this.batches.filter(b => {
      const expiry = new Date(b.expiryDate);
      return expiry > now && expiry <= nearExpiryDate && b.status === StockStatus.ACTIVE;
    });

    const expired = this.batches.filter(b => new Date(b.expiryDate) < now || b.status === StockStatus.EXPIRED);
    
    const totalValue = this.batches.reduce((acc, b) => {
      const prod = this.products.find(p => p.id === b.productId);
      return acc + (b.quantity * (prod?.unitPrice || 0));
    }, 0);

    return {
      totalStockValue: totalValue,
      nearExpiryCount: nearExpiry.length,
      expiredCount: expired.length,
      slowMovingCount: 0,
      deadStockCount: 0
    };
  }

  async addGRN(data: { productId: string, batchNumber: string, expiryDate: string, quantity: number, referenceDoc: string }) {
    const newBatchId = `b${this.batches.length + 1}`;
    
    const newBatch: StockBatch = {
      id: newBatchId,
      batchNumber: data.batchNumber,
      expiryDate: data.expiryDate,
      quantity: data.quantity,
      status: StockStatus.ACTIVE,
      productId: data.productId
    };

    this.batches.push(newBatch);
    this.ledger.push({
      id: `l${this.ledger.length + 1}`,
      type: TransactionType.GRN,
      quantity: data.quantity,
      referenceDoc: data.referenceDoc,
      timestamp: new Date().toISOString(),
      productId: data.productId,
      batchId: newBatch.id,
      userId: 'admin',
      createdBy: 'Admin'
    });
    
    return newBatch;
  }

  async getConsumptionByCategory() {
    const categories = Array.from(new Set(this.products.map(p => p.category)));
    if (categories.length === 0) return [];
    return categories.map(cat => {
      const prods = this.products.filter(p => p.category === cat);
      const consumption = this.ledger
        .filter(l => prods.some(p => p.id === l.productId) && l.type === TransactionType.WHOLESALE_ISSUE)
        .reduce((sum, l) => sum + l.quantity, 0);
      return { name: cat, value: consumption };
    });
  }
}

export const db = new MockDatabase();
