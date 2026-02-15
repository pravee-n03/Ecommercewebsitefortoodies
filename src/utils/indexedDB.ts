// IndexedDB for storing large uncompressed design files
const DB_NAME = 'ToodiesDesignStudio';
const DB_VERSION = 1;
const STORE_NAME = 'designs';

interface DesignData {
  id: string;
  userId: string;
  productId: string;
  name: string;
  timestamp: number;
  
  // High-quality uncompressed data
  fullResolutionSnapshot: string; // PNG base64 - full quality
  originalMockup: string; // Original mockup image
  designLayers: Array<{
    id: string;
    originalImage: string; // PNG base64 - no compression
    // Absolute canvas coordinates
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    opacity: number;
    blendMode?: string;
    // Relative to mockup/printable area
    relativeX?: number; // % from left
    relativeY?: number; // % from top
    relativeWidth?: number; // % of printable width
    relativeHeight?: number; // % of printable height
    // Printing info
    printingMethodId: string;
    printingMethodName?: string;
    printingCost?: number;
  }>;
  
  // Mockup positioning metadata
  mockupBounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  
  printableArea?: {
    x: number; // Left edge of printable area on canvas
    y: number; // Top edge of printable area on canvas
    width: number; // Width of printable area
    height: number; // Height of printable area
  };
  
  // Product details
  productName: string;
  color: string;
  size: string;
  fabric: string;
  printingMethod: string;
  printingCost: number;
  basePrice: number;
  
  // Canvas metadata for perfect recreation
  canvasWidth: number;
  canvasHeight: number;
  canvasScale: number;
  
  // Status & tracking
  paymentStatus: 'unpaid' | 'paid' | 'submitted';
  orderId?: string;
  orderNumber?: string; // Human-readable order number
  paymentId?: string;
  figmaFileUrl?: string;
  isLocked: boolean;
  
  // Customer info
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  deliveryAddress?: string;
}

class DesignDatabase {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          objectStore.createIndex('userId', 'userId', { unique: false });
          objectStore.createIndex('paymentStatus', 'paymentStatus', { unique: false });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async saveDesign(design: DesignData): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(design);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getDesign(id: string): Promise<DesignData | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getUserDesigns(userId: string): Promise<DesignData[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteDesign(id: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateDesignStatus(id: string, status: 'unpaid' | 'paid' | 'submitted', additionalData?: Partial<DesignData>): Promise<void> {
    if (!this.db) await this.init();
    
    const design = await this.getDesign(id);
    if (!design) throw new Error('Design not found');

    design.paymentStatus = status;
    if (additionalData) {
      Object.assign(design, additionalData);
    }

    await this.saveDesign(design);
  }

  async getAllDesigns(): Promise<DesignData[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }
}

export const designDB = new DesignDatabase();
export type { DesignData };