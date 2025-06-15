// SyncService.ts - Comprehensive offline synchronization service
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export interface SyncQueueItem {
  id: string;
  type: 'verification' | 'attendance' | 'analytics';
  action: 'create' | 'update' | 'delete';
  data: any;
  endpoint: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  retryCount: number;
  maxRetries: number;
  lastError?: string;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
}

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingItems: number;
  lastSyncTime?: string;
  failedItems: number;
  isBackgroundSyncEnabled: boolean;
}

export interface ConflictResolution {
  strategy: 'client-wins' | 'server-wins' | 'merge' | 'manual';
  conflictId: string;
  localData: any;
  serverData: any;
  resolvedData?: any;
}

export interface AnalyticsEvent {
  id: string;
  event: string;
  data: any;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

class SyncService {
  private static instance: SyncService;
  private syncQueue: SyncQueueItem[] = [];
  private analyticsQueue: AnalyticsEvent[] = [];
  private isOnline: boolean = true;
  private isSyncing: boolean = false;
  private syncListeners: ((status: SyncStatus) => void)[] = [];
  private baseUrl: string = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
  
  private readonly storageKeys = {
    syncQueue: 'sync_queue',
    analyticsQueue: 'analytics_queue',
    lastSyncTime: 'last_sync_time',
    offlineData: 'offline_data',
  };

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  private constructor() {
    this.initializeService();
  }

  // Initialize the sync service
  private async initializeService(): Promise<void> {
    try {
      // Load persisted sync queue
      await this.loadSyncQueue();
      
      // Load analytics queue
      await this.loadAnalyticsQueue();
      
      // Set up network listener
      this.setupNetworkListener();
      
      // Set up background sync
      this.setupBackgroundSync();
      
      console.log('SyncService initialized successfully');
    } catch (error) {
      console.error('Error initializing SyncService:', error);
    }
  }

  // Set up network connectivity listener
  private setupNetworkListener(): void {
    NetInfo.addEventListener((state: NetInfoState) => {
      const wasOffline = !this.isOnline;
      this.isOnline = !!state.isConnected;
      
      console.log('Network status changed:', { 
        isConnected: this.isOnline,
        type: state.type,
        isInternetReachable: state.isInternetReachable 
      });
      
      // If we just came back online, start syncing
      if (wasOffline && this.isOnline) {
        console.log('Connection restored, starting sync...');
        this.startSync();
      }
      
      this.notifyListeners();
    });
  }

  // Set up background sync (runs periodically when online)
  private setupBackgroundSync(): void {
    setInterval(async () => {
      if (this.isOnline && !this.isSyncing && this.syncQueue.length > 0) {
        console.log('Background sync triggered');
        await this.startSync();
      }
    }, 30000); // Check every 30 seconds
  }

  // Add item to sync queue
  async addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retryCount' | 'status'>): Promise<string> {
    const queueItem: SyncQueueItem = {
      ...item,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      retryCount: 0,
      status: 'pending',
    };
    
    this.syncQueue.push(queueItem);
    await this.saveSyncQueue();
    
    // If online, start immediate sync for high priority items
    if (this.isOnline && item.priority === 'high' && !this.isSyncing) {
      this.startSync();
    }
    
    this.notifyListeners();
    
    return queueItem.id;
  }

  // Add analytics event to queue
  async addAnalyticsEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<void> {
    const analyticsEvent: AnalyticsEvent = {
      ...event,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
    };
    
    this.analyticsQueue.push(analyticsEvent);
    await this.saveAnalyticsQueue();
    
    // If online, try to send analytics immediately
    if (this.isOnline) {
      this.syncAnalyticsEvents();
    }
  }

  // Start synchronization process
  async startSync(): Promise<void> {
    if (this.isSyncing || !this.isOnline) {
      return;
    }
    
    this.isSyncing = true;
    this.notifyListeners();
    
    try {
      console.log(`Starting sync with ${this.syncQueue.length} items in queue`);
      
      // Process items by priority
      const prioritizedQueue = this.syncQueue
        .filter(item => item.status === 'pending' || item.status === 'failed')
        .sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
      
      for (const item of prioritizedQueue) {
        if (!this.isOnline) {
          console.log('Lost connection during sync, stopping...');
          break;
        }
        
        await this.syncItem(item);
      }
      
      // Sync analytics events
      await this.syncAnalyticsEvents();
      
      // Clean up completed items
      await this.cleanupCompletedItems();
      
      // Update last sync time
      await AsyncStorage.setItem(this.storageKeys.lastSyncTime, new Date().toISOString());
      
      console.log('Sync completed successfully');
      
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.isSyncing = false;
      this.notifyListeners();
    }
  }

  // Sync individual item
  private async syncItem(item: SyncQueueItem): Promise<void> {
    try {
      item.status = 'syncing';
      await this.saveSyncQueue();
      
      console.log(`Syncing item: ${item.type} - ${item.action} (${item.id})`);
      
      const response = await this.makeApiRequest(item);
      
      if (response.ok) {
        item.status = 'completed';
        console.log(`Successfully synced item: ${item.id}`);
        
        // Handle conflict resolution if needed
        if (response.status === 409) {
          const conflictData = await response.json();
          await this.handleConflict(item, conflictData);
        }
      } else {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
    } catch (error) {
      console.error('Error syncing item:', error);
      
      item.retryCount++;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      item.lastError = errorMessage;
      
      if (item.retryCount >= item.maxRetries) {
        item.status = 'failed';
      } else {
        // Exponential backoff for retry
        setTimeout(() => {
          this.syncItem(item);
        }, Math.pow(2, item.retryCount) * 1000);
      }
    }
    
    await this.saveSyncQueue();
  }

  // Make API request for sync item
  private async makeApiRequest(item: SyncQueueItem): Promise<Response> {
    const url = `${this.baseUrl}${item.endpoint}`;
    const method = this.getHttpMethod(item.action);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add authentication headers if available
    const authToken = await AsyncStorage.getItem('auth_token');
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
    
    const config: RequestInit = {
      method,
      headers,
    };
    
    if (method !== 'GET' && method !== 'DELETE') {
      config.body = JSON.stringify(item.data);
    }
    
    return fetch(url, config);
  }

  // Sync analytics events
  private async syncAnalyticsEvents(): Promise<void> {
    if (this.analyticsQueue.length === 0) {
      return;
    }
    
    try {
      console.log(`Syncing ${this.analyticsQueue.length} analytics events`);
      
      const response = await fetch(`${this.baseUrl}/analytics/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: this.analyticsQueue }),
      });
      
      if (response.ok) {
        console.log('Analytics events synced successfully');
        this.analyticsQueue = [];
        await this.saveAnalyticsQueue();
      } else {
        console.error('Failed to sync analytics events:', response.status);
      }
      
    } catch (error) {
      console.error('Error syncing analytics events:', error);
    }
  }

  // Handle conflict resolution
  private async handleConflict(item: SyncQueueItem, conflictData: any): Promise<void> {
    console.log(`Handling conflict for item ${item.id}`);
    
    // Default strategy: client wins for now
    // In a real implementation, this would be more sophisticated
    const resolution: ConflictResolution = {
      strategy: 'client-wins',
      conflictId: this.generateId(),
      localData: item.data,
      serverData: conflictData.serverData,
      resolvedData: item.data, // Client wins
    };
    
    // Log conflict for analytics
    await this.addAnalyticsEvent({
      event: 'ConflictResolved',
      data: {
        itemType: item.type,
        strategy: resolution.strategy,
        conflictId: resolution.conflictId,
      },
    });
    
    console.log('Conflict resolved using client-wins strategy');
  }

  // Clean up completed items from sync queue
  private async cleanupCompletedItems(): Promise<void> {
    const completedItems = this.syncQueue.filter(item => item.status === 'completed');
    
    if (completedItems.length > 0) {
      this.syncQueue = this.syncQueue.filter(item => item.status !== 'completed');
      await this.saveSyncQueue();
      
      console.log(`Cleaned up ${completedItems.length} completed sync items`);
    }
  }

  // Get current sync status
  getSyncStatus(): SyncStatus {
    const pendingItems = this.syncQueue.filter(item => 
      item.status === 'pending' || item.status === 'syncing'
    ).length;
    
    const failedItems = this.syncQueue.filter(item => 
      item.status === 'failed'
    ).length;
    
    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      pendingItems,
      failedItems,
      isBackgroundSyncEnabled: true,
    };
  }

  // Subscribe to sync status changes
  addSyncListener(listener: (status: SyncStatus) => void): () => void {
    this.syncListeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.syncListeners.indexOf(listener);
      if (index > -1) {
        this.syncListeners.splice(index, 1);
      }
    };
  }

  // Notify all listeners of status changes
  private notifyListeners(): void {
    const status = this.getSyncStatus();
    this.syncListeners.forEach(listener => listener(status));
  }

  // Force retry failed items
  async retryFailedItems(): Promise<void> {
    const failedItems = this.syncQueue.filter(item => item.status === 'failed');
    
    for (const item of failedItems) {
      item.status = 'pending';
      item.retryCount = 0;
      item.lastError = undefined;
    }
    
    await this.saveSyncQueue();
    
    if (this.isOnline) {
      this.startSync();
    }
  }

  // Clear all sync data (for debugging/reset)
  async clearSyncData(): Promise<void> {
    this.syncQueue = [];
    this.analyticsQueue = [];
    
    await Promise.all([
      AsyncStorage.removeItem(this.storageKeys.syncQueue),
      AsyncStorage.removeItem(this.storageKeys.analyticsQueue),
      AsyncStorage.removeItem(this.storageKeys.lastSyncTime),
    ]);
    
    this.notifyListeners();
    console.log('Sync data cleared');
  }

  // Load sync queue from storage
  private async loadSyncQueue(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem(this.storageKeys.syncQueue);
      if (data) {
        this.syncQueue = JSON.parse(data);
        console.log(`Loaded ${this.syncQueue.length} items from sync queue`);
      }
    } catch (error) {
      console.error('Error loading sync queue:', error);
    }
  }

  // Save sync queue to storage
  private async saveSyncQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.storageKeys.syncQueue, JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Error saving sync queue:', error);
    }
  }

  // Load analytics queue from storage
  private async loadAnalyticsQueue(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem(this.storageKeys.analyticsQueue);
      if (data) {
        this.analyticsQueue = JSON.parse(data);
        console.log(`Loaded ${this.analyticsQueue.length} analytics events from queue`);
      }
    } catch (error) {
      console.error('Error loading analytics queue:', error);
    }
  }

  // Save analytics queue to storage
  private async saveAnalyticsQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.storageKeys.analyticsQueue, JSON.stringify(this.analyticsQueue));
    } catch (error) {
      console.error('Error saving analytics queue:', error);
    }
  }

  // Helper method to get HTTP method from action
  private getHttpMethod(action: string): string {
    switch (action) {
      case 'create': return 'POST';
      case 'update': return 'PUT';
      case 'delete': return 'DELETE';
      default: return 'GET';
    }
  }

  // Generate unique ID
  private generateId(): string {
    return `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get pending items by type
  getPendingItemsByType(type: string): SyncQueueItem[] {
    return this.syncQueue.filter(item => 
      item.type === type && (item.status === 'pending' || item.status === 'failed')
    );
  }

  // Get failed items
  getFailedItems(): SyncQueueItem[] {
    return this.syncQueue.filter(item => item.status === 'failed');
  }

  // Check if service is online
  isServiceOnline(): boolean {
    return this.isOnline;
  }

  // Manual sync trigger
  async manualSync(): Promise<void> {
    if (!this.isOnline) {
      throw new Error('Cannot sync while offline');
    }
    
    await this.startSync();
  }
}

export default SyncService.getInstance(); 