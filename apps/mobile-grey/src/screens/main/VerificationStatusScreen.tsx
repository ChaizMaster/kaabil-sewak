import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLanguage } from '../../context/LanguageContext';
import VerificationService, { VerificationRecord } from '../../services/verificationService';

const translations = {
  english: {
    title: 'Verification Records',
    subtitle: 'Manage worker verifications and track status',
    noRecords: 'No verification records found',
    noRecordsDescription: 'Start verifying workers to see their records here',
    stats: 'Statistics',
    total: 'Total',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    thisWeek: 'This Week',
    refresh: 'Pull to refresh',
    retry: 'Retry',
    delete: 'Delete',
    details: 'Details',
    deleteConfirm: 'Delete Verification',
    deleteMessage: 'Are you sure you want to delete this verification record?',
    cancel: 'Cancel',
    confirm: 'Delete',
    retryConfirm: 'Retry Upload',
    retryMessage: 'This will retry uploading the verification data. Continue?',
    statusPending: 'Pending Upload',
    statusUploading: 'Uploading',
    statusUploaded: 'Uploaded',
    statusReviewed: 'Under Review',
    statusApproved: 'Approved',
    statusRejected: 'Rejected',
    uploadProgress: 'Upload Progress',
    workerName: 'Worker',
    photos: 'Photos',
    documents: 'Documents',
    idType: 'ID Type',
    createdAt: 'Created',
    error: 'Error',
    retryFailed: 'Failed to retry verification upload',
    deleteFailed: 'Failed to delete verification record',
    loadFailed: 'Failed to load verification records',
  },
  hindi: {
    title: 'सत्यापन रिकॉर्ड',
    subtitle: 'कर्मचारी सत्यापन प्रबंधित करें और स्थिति ट्रैक करें',
    noRecords: 'कोई सत्यापन रिकॉर्ड नहीं मिला',
    noRecordsDescription: 'उनके रिकॉर्ड यहां देखने के लिए कर्मचारियों का सत्यापन शुरू करें',
    stats: 'आंकड़े',
    total: 'कुल',
    pending: 'लंबित',
    approved: 'स्वीकृत',
    rejected: 'अस्वीकृत',
    thisWeek: 'इस सप्ताह',
    refresh: 'रिफ्रेश करने के लिए खींचें',
    retry: 'पुनः प्रयास',
    delete: 'हटाएं',
    details: 'विवरण',
    deleteConfirm: 'सत्यापन हटाएं',
    deleteMessage: 'क्या आप वाकई इस सत्यापन रिकॉर्ड को हटाना चाहते हैं?',
    cancel: 'रद्द करें',
    confirm: 'हटाएं',
    retryConfirm: 'अपलोड पुनः प्रयास',
    retryMessage: 'यह सत्यापन डेटा अपलोड करने का पुनः प्रयास करेगा। जारी रखें?',
    statusPending: 'अपलोड लंबित',
    statusUploading: 'अपलोड हो रहा है',
    statusUploaded: 'अपलोड किया गया',
    statusReviewed: 'समीक्षाधीन',
    statusApproved: 'स्वीकृत',
    statusRejected: 'अस्वीकृत',
    uploadProgress: 'अपलोड प्रगति',
    workerName: 'कर्मचारी',
    photos: 'फोटो',
    documents: 'दस्तावेज़',
    idType: 'आईडी प्रकार',
    createdAt: 'बनाया गया',
    error: 'त्रुटि',
    retryFailed: 'सत्यापन अपलोड पुनः प्रयास विफल',
    deleteFailed: 'सत्यापन रिकॉर्ड हटाने में विफल',
    loadFailed: 'सत्यापन रिकॉर्ड लोड करने में विफल',
  },
  bengali: {
    title: 'যাচাইকরণ রেকর্ড',
    subtitle: 'কর্মী যাচাইকরণ পরিচালনা করুন এবং অবস্থা ট্র্যাক করুন',
    noRecords: 'কোনো যাচাইকরণ রেকর্ড পাওয়া যায়নি',
    noRecordsDescription: 'তাদের রেকর্ড এখানে দেখতে কর্মীদের যাচাই করা শুরু করুন',
    stats: 'পরিসংখ্যান',
    total: 'মোট',
    pending: 'অপেক্ষমান',
    approved: 'অনুমোদিত',
    rejected: 'প্রত্যাখ্যাত',
    thisWeek: 'এই সপ্তাহে',
    refresh: 'রিফ্রেশ করতে টানুন',
    retry: 'আবার চেষ্টা',
    delete: 'মুছুন',
    details: 'বিবরণ',
    deleteConfirm: 'যাচাইকরণ মুছুন',
    deleteMessage: 'আপনি কি সত্যিই এই যাচাইকরণ রেকর্ডটি মুছতে চান?',
    cancel: 'বাতিল',
    confirm: 'মুছুন',
    retryConfirm: 'আপলোড পুনরায় চেষ্টা',
    retryMessage: 'এটি যাচাইকরণ ডেটা আপলোড করার পুনরায় চেষ্টা করবে। চালিয়ে যান?',
    statusPending: 'আপলোড অপেক্ষমান',
    statusUploading: 'আপলোড হচ্ছে',
    statusUploaded: 'আপলোড হয়েছে',
    statusReviewed: 'পর্যালোচনাধীন',
    statusApproved: 'অনুমোদিত',
    statusRejected: 'প্রত্যাখ্যাত',
    uploadProgress: 'আপলোড অগ্রগতি',
    workerName: 'কর্মী',
    photos: 'ছবি',
    documents: 'নথি',
    idType: 'আইডি প্রকার',
    createdAt: 'তৈরি',
    error: 'ত্রুটি',
    retryFailed: 'যাচাইকরণ আপলোড পুনরায় চেষ্টা ব্যর্থ',
    deleteFailed: 'যাচাইকরণ রেকর্ড মুছতে ব্যর্থ',
    loadFailed: 'যাচাইকরণ রেকর্ড লোড করতে ব্যর্থ',
  },
};

const VerificationStatusScreen: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [verifications, setVerifications] = useState<VerificationRecord[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    thisWeek: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState<VerificationRecord | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const contractorId = 'contractor_demo_123'; // This would come from auth context

  const loadVerifications = useCallback(async () => {
    try {
      const [verificationsData, statsData] = await Promise.all([
        VerificationService.getVerifications(contractorId),
        VerificationService.getVerificationStats(contractorId),
      ]);
      
      setVerifications(verificationsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load verifications:', error);
      Alert.alert(t.error, t.loadFailed);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [contractorId, t.error, t.loadFailed]);

  useEffect(() => {
    loadVerifications();
  }, [loadVerifications]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadVerifications();
  };

  const handleRetryVerification = (verification: VerificationRecord) => {
    Alert.alert(
      t.retryConfirm,
      t.retryMessage,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.retry,
          onPress: async () => {
            try {
              await VerificationService.retryVerification(verification.id);
              loadVerifications();
            } catch (error) {
              Alert.alert(t.error, t.retryFailed);
            }
          },
        },
      ]
    );
  };

  const handleDeleteVerification = (verification: VerificationRecord) => {
    Alert.alert(
      t.deleteConfirm,
      t.deleteMessage,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.confirm,
          style: 'destructive',
          onPress: async () => {
            try {
              await VerificationService.deleteVerification(verification.id);
              loadVerifications();
            } catch (error) {
              Alert.alert(t.error, t.deleteFailed);
            }
          },
        },
      ]
    );
  };

  const handleShowDetails = (verification: VerificationRecord) => {
    setSelectedVerification(verification);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status: VerificationRecord['status']) => {
    switch (status) {
      case 'pending':
        return '#FFA500';
      case 'uploading':
        return '#2196F3';
      case 'uploaded':
        return '#9C27B0';
      case 'reviewed':
        return '#FF9800';
      case 'approved':
        return '#4CAF50';
      case 'rejected':
        return '#F44336';
      default:
        return '#666666';
    }
  };

  const getStatusText = (status: VerificationRecord['status']) => {
    switch (status) {
      case 'pending':
        return t.statusPending;
      case 'uploading':
        return t.statusUploading;
      case 'uploaded':
        return t.statusUploaded;
      case 'reviewed':
        return t.statusReviewed;
      case 'approved':
        return t.statusApproved;
      case 'rejected':
        return t.statusRejected;
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'english' ? 'en-US' : 'hi-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderStatsCard = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.statsTitle}>{t.stats}</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>{t.total}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#FFA500' }]}>{stats.pending}</Text>
          <Text style={styles.statLabel}>{t.pending}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{stats.approved}</Text>
          <Text style={styles.statLabel}>{t.approved}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#F44336' }]}>{stats.rejected}</Text>
          <Text style={styles.statLabel}>{t.rejected}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#2196F3' }]}>{stats.thisWeek}</Text>
          <Text style={styles.statLabel}>{t.thisWeek}</Text>
        </View>
      </View>
    </View>
  );

  const renderVerificationCard = (verification: VerificationRecord) => (
    <View key={verification.id} style={styles.verificationCard}>
      <View style={styles.verificationHeader}>
        <View style={styles.verificationInfo}>
          <Text style={styles.workerName}>{verification.workerName}</Text>
          <Text style={styles.verificationDate}>{formatDate(verification.createdAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(verification.status) }]}>
          <Text style={styles.statusText}>{getStatusText(verification.status)}</Text>
        </View>
      </View>

      <View style={styles.verificationDetails}>
        <View style={styles.detailItem}>
          <MaterialIcons name="camera-alt" size={16} color="#A0AEC0" />
          <Text style={styles.detailText}>{verification.photos.length} {t.photos}</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialIcons name="credit-card" size={16} color="#A0AEC0" />
          <Text style={styles.detailText}>{verification.documents.length} {t.documents}</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialIcons name="badge" size={16} color="#A0AEC0" />
          <Text style={styles.detailText}>{verification.formData.idType}</Text>
        </View>
      </View>

      {verification.status === 'uploading' && verification.uploadProgress !== undefined && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{t.uploadProgress}: {verification.uploadProgress}%</Text>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${verification.uploadProgress}%` }]} 
            />
          </View>
        </View>
      )}

      <View style={styles.verificationActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleShowDetails(verification)}
        >
          <MaterialIcons name="info" size={16} color="#2196F3" />
          <Text style={styles.actionButtonText}>{t.details}</Text>
        </TouchableOpacity>

        {verification.status === 'pending' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleRetryVerification(verification)}
          >
            <MaterialIcons name="refresh" size={16} color="#FF9800" />
            <Text style={styles.actionButtonText}>{t.retry}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteVerification(verification)}
        >
          <MaterialIcons name="delete" size={16} color="#F44336" />
          <Text style={styles.actionButtonText}>{t.delete}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDetailsModal = () => (
    <Modal
      visible={showDetailsModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowDetailsModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{t.details}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowDetailsModal(false)}
          >
            <MaterialIcons name="close" size={24} color="#A0AEC0" />
          </TouchableOpacity>
        </View>

        {selectedVerification && (
          <ScrollView style={styles.modalContent}>
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>{t.workerName}</Text>
              <Text style={styles.modalSectionText}>{selectedVerification.workerName}</Text>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Status</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedVerification.status) }]}>
                <Text style={styles.statusText}>{getStatusText(selectedVerification.status)}</Text>
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>{t.idType}</Text>
              <Text style={styles.modalSectionText}>{selectedVerification.formData.idType}</Text>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>ID Number</Text>
              <Text style={styles.modalSectionText}>{selectedVerification.formData.idNumber}</Text>
            </View>

            {selectedVerification.formData.bankAccountNumber && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Bank Account</Text>
                <Text style={styles.modalSectionText}>{selectedVerification.formData.bankAccountNumber}</Text>
              </View>
            )}

            {selectedVerification.formData.upiId && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>UPI ID</Text>
                <Text style={styles.modalSectionText}>{selectedVerification.formData.upiId}</Text>
              </View>
            )}

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>{t.createdAt}</Text>
              <Text style={styles.modalSectionText}>{formatDate(selectedVerification.createdAt)}</Text>
            </View>

            {selectedVerification.rejectionReason && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Rejection Reason</Text>
                <Text style={[styles.modalSectionText, { color: '#F44336' }]}>
                  {selectedVerification.rejectionReason}
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="verified-user" size={64} color="#A0AEC0" />
      <Text style={styles.emptyTitle}>{t.noRecords}</Text>
      <Text style={styles.emptyDescription}>{t.noRecordsDescription}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {renderStatsCard()}

        {verifications.length === 0 && !isLoading ? (
          renderEmptyState()
        ) : (
          <View style={styles.verificationsContainer}>
            {verifications.map(renderVerificationCard)}
          </View>
        )}
      </ScrollView>

      {renderDetailsModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F0F4F8',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0AEC0',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    backgroundColor: '#1A2942',
    margin: 20,
    borderRadius: 12,
    padding: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F0F4F8',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    width: '18%',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F0F4F8',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#A0AEC0',
    textAlign: 'center',
  },
  verificationsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  verificationCard: {
    backgroundColor: '#1A2942',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  verificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  verificationInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F0F4F8',
    marginBottom: 4,
  },
  verificationDate: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  verificationDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#A0AEC0',
    marginLeft: 4,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressText: {
    fontSize: 12,
    color: '#A0AEC0',
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2D3748',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 2,
  },
  verificationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
    marginTop: 4,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#A0AEC0',
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F0F4F8',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0A192F',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F0F4F8',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F0F4F8',
    marginBottom: 8,
  },
  modalSectionText: {
    fontSize: 16,
    color: '#A0AEC0',
    lineHeight: 24,
  },
});

export default VerificationStatusScreen; 