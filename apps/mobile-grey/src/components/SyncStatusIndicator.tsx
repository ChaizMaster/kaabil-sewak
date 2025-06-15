import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import SyncService, { SyncStatus, SyncQueueItem } from '../services/syncService';

const translations = {
  english: {
    online: 'Online',
    offline: 'Offline',
    syncing: 'Syncing...',
    syncComplete: 'Sync Complete',
    pendingItems: 'pending item(s)',
    failedItems: 'failed item(s)',
    syncStatus: 'Sync Status',
    retryFailed: 'Retry Failed',
    clearData: 'Clear Sync Data',
    manualSync: 'Manual Sync',
    lastSync: 'Last sync:',
    never: 'Never',
    close: 'Close',
    confirmClear: 'Clear Sync Data?',
    confirmClearMessage: 'This will remove all pending sync items. Are you sure?',
    cancel: 'Cancel',
    confirm: 'Confirm',
    syncFailed: 'Sync Failed',
    syncSuccess: 'Sync Completed',
    noInternet: 'No internet connection',
    backgroundSync: 'Background sync enabled',
  },
  hindi: {
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',
    syncing: 'सिंक हो रहा है...',
    syncComplete: 'सिंक पूरा',
    pendingItems: 'लंबित आइटम',
    failedItems: 'असफल आइटम',
    syncStatus: 'सिंक स्थिति',
    retryFailed: 'असफल पुनः प्रयास',
    clearData: 'सिंक डेटा साफ़ करें',
    manualSync: 'मैन्युअल सिंक',
    lastSync: 'अंतिम सिंक:',
    never: 'कभी नहीं',
    close: 'बंद करें',
    confirmClear: 'सिंक डेटा साफ़ करें?',
    confirmClearMessage: 'यह सभी लंबित सिंक आइटम हटा देगा। क्या आप सुनिश्चित हैं?',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    syncFailed: 'सिंक असफल',
    syncSuccess: 'सिंक पूरा हुआ',
    noInternet: 'इंटरनेट कनेक्शन नहीं',
    backgroundSync: 'बैकग्राउंड सिंक सक्षम',
  },
  bengali: {
    online: 'অনলাইন',
    offline: 'অফলাইন',
    syncing: 'সিঙ্ক হচ্ছে...',
    syncComplete: 'সিঙ্ক সম্পূর্ণ',
    pendingItems: 'মুলতুবি আইটেম',
    failedItems: 'ব্যর্থ আইটেম',
    syncStatus: 'সিঙ্ক অবস্থা',
    retryFailed: 'ব্যর্থ পুনরায় চেষ্টা',
    clearData: 'সিঙ্ক ডেটা সাফ করুন',
    manualSync: 'ম্যানুয়াল সিঙ্ক',
    lastSync: 'শেষ সিঙ্ক:',
    never: 'কখনো না',
    close: 'বন্ধ',
    confirmClear: 'সিঙ্ক ডেটা সাফ করবেন?',
    confirmClearMessage: 'এটি সমস্ত মুলতুবি সিঙ্ক আইটেম সরিয়ে দেবে। আপনি কি নিশ্চিত?',
    cancel: 'বাতিল',
    confirm: 'নিশ্চিত',
    syncFailed: 'সিঙ্ক ব্যর্থ',
    syncSuccess: 'সিঙ্ক সম্পূর্ণ',
    noInternet: 'ইন্টারনেট সংযোগ নেই',
    backgroundSync: 'ব্যাকগ্রাউন্ড সিঙ্ক সক্রিয়',
  },
};

interface SyncStatusIndicatorProps {
  style?: any;
  showDetails?: boolean;
}

const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({ 
  style, 
  showDetails = false 
}) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(SyncService.getSyncStatus());
  const [showModal, setShowModal] = useState(false);
  const [failedItems, setFailedItems] = useState<SyncQueueItem[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to sync status changes
    const unsubscribe = SyncService.addSyncListener((status) => {
      setSyncStatus(status);
    });

    // Load failed items and last sync time
    loadSyncDetails();

    return unsubscribe;
  }, []);

  const loadSyncDetails = async () => {
    const failed = SyncService.getFailedItems();
    setFailedItems(failed);
    
    // Load last sync time from AsyncStorage
    try {
      const lastSync = await AsyncStorage.getItem('last_sync_time');
      setLastSyncTime(lastSync);
    } catch (error) {
      console.error('Error loading last sync time:', error);
    }
  };

  const handleRetryFailed = async () => {
    try {
      await SyncService.retryFailedItems();
      Alert.alert(t.syncSuccess, 'Failed items queued for retry');
      setShowModal(false);
    } catch (error) {
      Alert.alert(t.syncFailed, 'Failed to retry items');
    }
  };

  const handleManualSync = async () => {
    try {
      await SyncService.manualSync();
      Alert.alert(t.syncSuccess, 'Manual sync completed');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Manual sync failed';
      Alert.alert(t.syncFailed, errorMessage);
    }
  };

  const handleClearSyncData = () => {
    Alert.alert(
      t.confirmClear,
      t.confirmClearMessage,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.confirm,
          style: 'destructive',
          onPress: async () => {
            await SyncService.clearSyncData();
            setShowModal(false);
            Alert.alert(t.syncSuccess, 'Sync data cleared');
          },
        },
      ]
    );
  };

  const getStatusColor = (): string => {
    if (!syncStatus.isOnline) return '#F44336'; // Red for offline
    if (syncStatus.isSyncing) return '#FF9800'; // Orange for syncing
    if (syncStatus.failedItems > 0) return '#F44336'; // Red for failed items
    if (syncStatus.pendingItems > 0) return '#2196F3'; // Blue for pending
    return '#4CAF50'; // Green for all synced
  };

  const getStatusIcon = (): keyof typeof MaterialIcons.glyphMap => {
    if (!syncStatus.isOnline) return 'cloud-off';
    if (syncStatus.isSyncing) return 'cloud-sync';
    if (syncStatus.failedItems > 0) return 'cloud-off';
    if (syncStatus.pendingItems > 0) return 'cloud-queue';
    return 'cloud-done';
  };

  const getStatusText = (): string => {
    if (!syncStatus.isOnline) return t.offline;
    if (syncStatus.isSyncing) return t.syncing;
    if (syncStatus.failedItems > 0) return `${syncStatus.failedItems} ${t.failedItems}`;
    if (syncStatus.pendingItems > 0) return `${syncStatus.pendingItems} ${t.pendingItems}`;
    return t.online;
  };

  const formatLastSyncTime = (timestamp: string | null): string => {
    if (!timestamp) return t.never;
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const renderDetailedModal = () => (
    <Modal
      visible={showModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t.syncStatus}</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <MaterialIcons name="close" size={24} color="#A0AEC0" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            {/* Connection Status */}
            <View style={styles.statusRow}>
              <MaterialIcons 
                name={getStatusIcon()} 
                size={24} 
                color={getStatusColor()} 
              />
              <View style={styles.statusInfo}>
                <Text style={styles.statusLabel}>
                  {syncStatus.isOnline ? t.online : t.offline}
                </Text>
                <Text style={styles.statusDescription}>
                  {syncStatus.isOnline ? t.backgroundSync : t.noInternet}
                </Text>
              </View>
            </View>

            {/* Sync Progress */}
            {syncStatus.isSyncing && (
              <View style={styles.statusRow}>
                <ActivityIndicator size="small" color="#2563EB" />
                <View style={styles.statusInfo}>
                  <Text style={styles.statusLabel}>{t.syncing}</Text>
                  <Text style={styles.statusDescription}>
                    {syncStatus.pendingItems} items remaining
                  </Text>
                </View>
              </View>
            )}

            {/* Pending Items */}
            {syncStatus.pendingItems > 0 && (
              <View style={styles.statusRow}>
                <MaterialIcons name="cloud-queue" size={24} color="#2196F3" />
                <View style={styles.statusInfo}>
                  <Text style={styles.statusLabel}>
                    {syncStatus.pendingItems} {t.pendingItems}
                  </Text>
                  <Text style={styles.statusDescription}>
                    Waiting for sync
                  </Text>
                </View>
              </View>
            )}

            {/* Failed Items */}
            {syncStatus.failedItems > 0 && (
              <View style={styles.statusRow}>
                <MaterialIcons name="error" size={24} color="#F44336" />
                <View style={styles.statusInfo}>
                  <Text style={styles.statusLabel}>
                    {syncStatus.failedItems} {t.failedItems}
                  </Text>
                  <Text style={styles.statusDescription}>
                    Requires manual retry
                  </Text>
                </View>
              </View>
            )}

            {/* Last Sync Time */}
            <View style={styles.statusRow}>
              <MaterialIcons name="schedule" size={24} color="#A0AEC0" />
              <View style={styles.statusInfo}>
                <Text style={styles.statusLabel}>{t.lastSync}</Text>
                <Text style={styles.statusDescription}>
                  {formatLastSyncTime(lastSyncTime)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.modalActions}>
            {syncStatus.isOnline && (
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton]}
                onPress={handleManualSync}
                disabled={syncStatus.isSyncing}
              >
                <MaterialIcons name="sync" size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>{t.manualSync}</Text>
              </TouchableOpacity>
            )}

            {syncStatus.failedItems > 0 && (
              <TouchableOpacity
                style={[styles.actionButton, styles.warningButton]}
                onPress={handleRetryFailed}
              >
                <MaterialIcons name="refresh" size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>{t.retryFailed}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.actionButton, styles.dangerButton]}
              onPress={handleClearSyncData}
            >
              <MaterialIcons name="clear-all" size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>{t.clearData}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (showDetails) {
    return (
      <>
        <TouchableOpacity
          style={[styles.detailedContainer, style]}
          onPress={() => setShowModal(true)}
        >
          <View style={styles.statusIndicator}>
            <MaterialIcons 
              name={getStatusIcon()} 
              size={20} 
              color={getStatusColor()} 
            />
            {syncStatus.isSyncing && (
              <ActivityIndicator 
                size="small" 
                color={getStatusColor()} 
                style={styles.spinnerOverlay}
              />
            )}
          </View>
          <View style={styles.statusDetails}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
            <Text style={styles.lastSyncText}>
              {t.lastSync} {formatLastSyncTime(lastSyncTime)}
            </Text>
          </View>
        </TouchableOpacity>
        {renderDetailedModal()}
      </>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.simpleContainer, style]}
      onPress={() => setShowModal(true)}
    >
      <MaterialIcons 
        name={getStatusIcon()} 
        size={16} 
        color={getStatusColor()} 
      />
      {syncStatus.isSyncing && (
        <ActivityIndicator 
          size="small" 
          color={getStatusColor()} 
          style={styles.spinnerOverlay}
        />
      )}
      {renderDetailedModal()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  simpleContainer: {
    position: 'relative',
    padding: 8,
  },
  detailedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A2942',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  statusIndicator: {
    position: 'relative',
    marginRight: 12,
  },
  spinnerOverlay: {
    position: 'absolute',
    top: -2,
    left: -2,
  },
  statusDetails: {
    flex: 1,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F0F4F8',
  },
  lastSyncText: {
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1A2942',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F0F4F8',
  },
  modalBody: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusInfo: {
    marginLeft: 12,
    flex: 1,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F0F4F8',
  },
  statusDescription: {
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 2,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8,
    padding: 20,
    paddingTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
  },
  warningButton: {
    backgroundColor: '#F59E0B',
  },
  dangerButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SyncStatusIndicator; 