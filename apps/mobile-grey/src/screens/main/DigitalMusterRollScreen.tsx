import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Worker, 
  AttendanceRecord, 
  AttendanceSummary, 
  MarkAttendanceRequest 
} from '../../services/attendanceService';
import AttendanceService from '../../services/attendanceService';
import SyncStatusIndicator from '../../components/SyncStatusIndicator';
import { commonStyles, theme } from '../../styles/common';

const translations = {
  english: {
    title: 'Digital Muster Roll',
    subtitle: 'Track daily worker attendance',
    todayAttendance: 'Today\'s Attendance',
    selectDate: 'Select Date',
    workers: 'Workers',
    present: 'Present',
    absent: 'Absent',
    markAll: 'Mark All',
    markAllPresent: 'Mark All Present',
    markAllAbsent: 'Mark All Absent',
    attendanceMarked: 'Attendance Marked',
    totalWorkers: 'Total Workers',
    attendanceRate: 'Attendance Rate',
    refresh: 'Refresh',
    statistics: 'Statistics',
    weeklyTrend: 'Weekly Trend',
    workerStats: 'Worker Statistics',
    lastWeek: 'Last 7 Days',
    noWorkers: 'No workers found',
    loadingWorkers: 'Loading workers...',
    markingAttendance: 'Marking attendance...',
    errorTitle: 'Error',
    errorMessage: 'Failed to mark attendance. Please try again.',
    confirmMarkAll: 'Confirm Bulk Action',
    confirmMarkAllMessage: 'Are you sure you want to mark all workers as',
    cancel: 'Cancel',
    confirm: 'Confirm',
    attendanceOptions: 'Attendance Options',
    close: 'Close',
    days: 'days',
    percentage: 'percentage',
  },
  hindi: {
    title: 'डिजिटल मस्टर रोल',
    subtitle: 'दैनिक कर्मचारी उपस्थिति ट्रैक करें',
    todayAttendance: 'आज की उपस्थिति',
    selectDate: 'दिनांक चुनें',
    workers: 'कर्मचारी',
    present: 'उपस्थित',
    absent: 'अनुपस्थित',
    markAll: 'सभी को चिह्नित करें',
    markAllPresent: 'सभी को उपस्थित चिह्नित करें',
    markAllAbsent: 'सभी को अनुपस्थित चिह्नित करें',
    attendanceMarked: 'उपस्थिति चिह्नित',
    totalWorkers: 'कुल कर्मचारी',
    attendanceRate: 'उपस्थिति दर',
    refresh: 'रीफ्रेश',
    statistics: 'आंकड़े',
    weeklyTrend: 'साप्ताहिक रुझान',
    workerStats: 'कर्मचारी आंकड़े',
    lastWeek: 'पिछले 7 दिन',
    noWorkers: 'कोई कर्मचारी नहीं मिला',
    loadingWorkers: 'कर्मचारी लोड हो रहे हैं...',
    markingAttendance: 'उपस्थिति चिह्नित की जा रही है...',
    errorTitle: 'त्रुटि',
    errorMessage: 'उपस्थिति चिह्नित करने में असफल। कृपया पुनः प्रयास करें।',
    confirmMarkAll: 'बल्क एक्शन की पुष्टि करें',
    confirmMarkAllMessage: 'क्या आप सुनिश्चित हैं कि आप सभी कर्मचारियों को चिह्नित करना चाहते हैं',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    attendanceOptions: 'उपस्थिति विकल्प',
    close: 'बंद करें',
    days: 'दिन',
    percentage: 'प्रतिशत',
  },
  bengali: {
    title: 'ডিজিটাল মাস্টার রোল',
    subtitle: 'দৈনিক কর্মী উপস্থিতি ট্র্যাক করুন',
    todayAttendance: 'আজকের উপস্থিতি',
    selectDate: 'তারিখ নির্বাচন করুন',
    workers: 'কর্মীরা',
    present: 'উপস্থিত',
    absent: 'অনুপস্থিত',
    markAll: 'সবাইকে চিহ্নিত করুন',
    markAllPresent: 'সবাইকে উপস্থিত চিহ্নিত করুন',
    markAllAbsent: 'সবাইকে অনুপস্থিত চিহ্নিত করুন',
    attendanceMarked: 'উপস্থিতি চিহ্নিত',
    totalWorkers: 'মোট কর্মী',
    attendanceRate: 'উপস্থিতির হার',
    refresh: 'রিফ্রেশ',
    statistics: 'পরিসংখ্যান',
    weeklyTrend: 'সাপ্তাহিক ট্রেন্ড',
    workerStats: 'কর্মী পরিসংখ্যান',
    lastWeek: 'গত ৭ দিন',
    noWorkers: 'কোন কর্মী পাওয়া যায়নি',
    loadingWorkers: 'কর্মী লোড হচ্ছে...',
    markingAttendance: 'উপস্থিতি চিহ্নিত করা হচ্ছে...',
    errorTitle: 'ত্রুটি',
    errorMessage: 'উপস্থিতি চিহ্নিত করতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।',
    confirmMarkAll: 'বাল্ক অ্যাকশন নিশ্চিত করুন',
    confirmMarkAllMessage: 'আপনি কি নিশ্চিত যে আপনি সব কর্মীকে চিহ্নিত করতে চান',
    cancel: 'বাতিল',
    confirm: 'নিশ্চিত',
    attendanceOptions: 'উপস্থিতির বিকল্প',
    close: 'বন্ধ',
    days: 'দিন',
    percentage: 'শতাংশ',
  },
};

// Updated to only include present and absent
type AttendanceStatus = 'present' | 'absent';

interface WorkerWithAttendance extends Worker {
  attendanceStatus?: AttendanceStatus;
  attendanceRecord?: AttendanceRecord;
}

interface AttendanceOption {
  status: AttendanceStatus;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
}

const DigitalMusterRollScreen: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [workers, setWorkers] = useState<WorkerWithAttendance[]>([]);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [markingAttendance, setMarkingAttendance] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<WorkerWithAttendance | null>(null);
  const [showAttendanceOptions, setShowAttendanceOptions] = useState(false);

  const contractorId = 'contractor_123'; // TODO: Get from auth context
  const jobId = 'job_001'; // TODO: Get from current job context

  // Load workers and attendance data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load workers
      const workersData = await AttendanceService.getWorkers(contractorId, jobId);
      
      // Load attendance records for selected date
      const attendanceRecords = await AttendanceService.getAttendanceByDate(
        contractorId,
        selectedDate,
        jobId
      );
      
      // Combine workers with their attendance status
      const workersWithAttendance: WorkerWithAttendance[] = workersData.map((worker: Worker) => {
        const attendanceRecord = attendanceRecords.find((record: AttendanceRecord) => record.workerId === worker.id);
        // Convert any non-standard status to 'absent' for simplified view
        let status: AttendanceStatus = 'absent';
        if (attendanceRecord?.status === 'present') {
          status = 'present';
        }
        return {
          ...worker,
          attendanceStatus: status,
          attendanceRecord,
        };
      });
      
      setWorkers(workersWithAttendance);
      
      // Load attendance summary for the last week
      const endDate = selectedDate;
      const startDate = new Date(selectedDate);
      startDate.setDate(startDate.getDate() - 6);
      
      const summary = await AttendanceService.getAttendanceSummary(
        contractorId,
        startDate.toISOString().split('T')[0],
        endDate,
        jobId
      );
      
      setAttendanceSummary(summary);
    } catch (error) {
      console.error('Error loading attendance data:', error);
      Alert.alert(t.errorTitle, t.errorMessage);
    } finally {
      setLoading(false);
    }
  }, [contractorId, jobId, selectedDate, t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  }, [loadData]);

  // Mark worker attendance
  const markWorkerAttendance = async (worker: WorkerWithAttendance, status: AttendanceStatus) => {
    try {
      setMarkingAttendance(true);
      
      const request: MarkAttendanceRequest = {
        workerId: worker.id,
        date: selectedDate,
        status: status, // Only 'present' or 'absent' now
        checkInTime: status === 'present' ? new Date().toLocaleTimeString() : undefined,
      };
      
      await AttendanceService.markAttendance(request, contractorId, jobId);
      
      // Update local state
      setWorkers(prevWorkers =>
        prevWorkers.map(w =>
          w.id === worker.id
            ? { ...w, attendanceStatus: status }
            : w
        )
      );
      
      // Reload data to get updated summary
      await loadData();
      
    } catch (error) {
      console.error('Error marking attendance:', error);
      Alert.alert(t.errorTitle, t.errorMessage);
    } finally {
      setMarkingAttendance(false);
    }
  };

  // Mark all workers with same status
  const markAllAttendance = (status: AttendanceStatus) => {
    Alert.alert(
      t.confirmMarkAll,
      `${t.confirmMarkAllMessage} ${status === 'present' ? t.present : t.absent}?`,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.confirm,
          onPress: async () => {
            try {
              setMarkingAttendance(true);
              
              for (const worker of workers) {
                const request: MarkAttendanceRequest = {
                  workerId: worker.id,
                  date: selectedDate,
                  status: status,
                  checkInTime: status === 'present' ? new Date().toLocaleTimeString() : undefined,
                };
                
                await AttendanceService.markAttendance(request, contractorId, jobId);
              }
              
              // Reload data after bulk operation
              await loadData();
              
            } catch (error) {
              console.error('Error in bulk attendance marking:', error);
              Alert.alert(t.errorTitle, t.errorMessage);
            } finally {
              setMarkingAttendance(false);
            }
          },
        },
      ]
    );
  };

  // Handle worker press to show attendance options
  const handleWorkerPress = (worker: WorkerWithAttendance) => {
    setSelectedWorker(worker);
    setShowAttendanceOptions(true);
  };

  // Get status color for UI
  const getStatusColor = (status: AttendanceStatus): string => {
    switch (status) {
      case 'present':
        return '#4CAF50';
      case 'absent':
        return '#F44336';
      default:
        return '#A0AEC0';
    }
  };

  // Get status icon
  const getStatusIcon = (status: AttendanceStatus): keyof typeof MaterialIcons.glyphMap => {
    switch (status) {
      case 'present':
        return 'check-circle';
      case 'absent':
        return 'cancel';
      default:
        return 'help-outline';
    }
  };

  // Handle date change from picker
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      setSelectedDate(dateString);
    }
  };

  // Handle date picker dismiss on iOS
  const handleDatePickerDismiss = () => {
    setShowDatePicker(false);
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateString === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (dateString === yesterday.toISOString().split('T')[0]) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    }
  };

  // Render worker item
  const renderWorkerItem = ({ item: worker }: { item: WorkerWithAttendance }) => (
    <TouchableOpacity
      style={styles.workerCard}
      onPress={() => handleWorkerPress(worker)}
    >
      <View style={styles.workerInfo}>
        <View style={styles.workerHeader}>
          <Text style={styles.workerName}>{worker.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(worker.attendanceStatus || 'absent') }]}>
            <MaterialIcons
              name={getStatusIcon(worker.attendanceStatus || 'absent')}
              size={16}
              color="#FFFFFF"
            />
            <Text style={styles.statusText}>
              {worker.attendanceStatus === 'present' ? t.present : t.absent}
            </Text>
          </View>
        </View>
        
        <View style={styles.workerDetails}>
          <Text style={styles.workerPhone}>{worker.phoneNumber}</Text>
          <Text style={styles.workerSkills}>
            {worker.skillset?.join(', ') || 'No skills listed'}
          </Text>
        </View>
        
        {worker.attendanceRecord?.checkInTime && (
          <Text style={styles.checkInTime}>
            Check-in: {worker.attendanceRecord.checkInTime}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  // Render attendance summary card
  const renderSummaryCard = () => {
    if (!attendanceSummary) return null;
    
    return (
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>{t.todayAttendance}</Text>
          <TouchableOpacity onPress={() => setShowStatistics(true)}>
            <MaterialIcons name="bar-chart" size={24} color="#2563EB" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{attendanceSummary.totalWorkers}</Text>
            <Text style={styles.statLabel}>{t.totalWorkers}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#4CAF50' }]}>
              {attendanceSummary.presentToday}
            </Text>
            <Text style={styles.statLabel}>{t.present}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#F44336' }]}>
              {attendanceSummary.absentToday}
            </Text>
            <Text style={styles.statLabel}>{t.absent}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#2563EB' }]}>
              {Math.round(attendanceSummary.attendancePercentage)}%
            </Text>
            <Text style={styles.statLabel}>{t.attendanceRate}</Text>
          </View>
        </View>
      </View>
    );
  };

  // Render date selector
  const renderDateSelector = () => (
    <View style={styles.dateSelector}>
      <TouchableOpacity
        style={styles.dateSelectorButton}
        onPress={() => setShowDatePicker(true)}
      >
        <MaterialIcons name="calendar-today" size={20} color="#2563EB" />
        <Text style={styles.dateSelectorText}>{formatDate(selectedDate)}</Text>
        <MaterialIcons name="keyboard-arrow-down" size={20} color="#2563EB" />
      </TouchableOpacity>
    </View>
  );

  // Render bulk action buttons
  const renderBulkActions = () => (
    <View style={styles.bulkActions}>
      <TouchableOpacity
        style={[styles.bulkButton, styles.presentButton]}
        onPress={() => markAllAttendance('present')}
        disabled={markingAttendance}
      >
        <MaterialIcons name="check-circle" size={20} color="#FFFFFF" />
        <Text style={styles.bulkButtonText}>{t.markAllPresent}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.bulkButton, styles.absentButton]}
        onPress={() => markAllAttendance('absent')}
        disabled={markingAttendance}
      >
        <MaterialIcons name="cancel" size={20} color="#FFFFFF" />
        <Text style={styles.bulkButtonText}>{t.markAllAbsent}</Text>
      </TouchableOpacity>
    </View>
  );

  // Render attendance options modal - updated to only show present/absent
  const renderAttendanceOptionsModal = () => (
    <Modal
      visible={showAttendanceOptions}
      transparent
      animationType="slide"
      onRequestClose={() => setShowAttendanceOptions(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.optionsModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t.attendanceOptions}</Text>
            <TouchableOpacity onPress={() => setShowAttendanceOptions(false)}>
              <MaterialIcons name="close" size={24} color="#666666" />
            </TouchableOpacity>
          </View>
          
          {selectedWorker && (
            <View style={styles.modalContent}>
              <Text style={styles.workerNameModal}>{selectedWorker.name}</Text>
              
              <View style={styles.optionsList}>
                {(() => {
                  const attendanceOptions: AttendanceOption[] = [
                    { status: 'present', label: t.present, icon: 'check-circle' as keyof typeof MaterialIcons.glyphMap, color: '#4CAF50' },
                    { status: 'absent', label: t.absent, icon: 'cancel' as keyof typeof MaterialIcons.glyphMap, color: '#F44336' },
                  ];
                  
                  return attendanceOptions.map((option) => (
                    <TouchableOpacity
                      key={option.status}
                      style={[
                        styles.optionItem,
                        selectedWorker.attendanceStatus === option.status && styles.optionItemSelected
                      ]}
                      onPress={() => {
                        markWorkerAttendance(selectedWorker, option.status);
                        setShowAttendanceOptions(false);
                      }}
                    >
                      <MaterialIcons name={option.icon} size={24} color={option.color} />
                      <Text style={[styles.optionLabel, { color: option.color }]}>
                        {option.label}
                      </Text>
                      {selectedWorker.attendanceStatus === option.status && (
                        <MaterialIcons name="check" size={20} color={option.color} />
                      )}
                    </TouchableOpacity>
                  ));
                })()}
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>{t.loadingWorkers}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.subtitle}>{t.subtitle}</Text>
        </View>
        <View style={styles.headerActions}>
          <SyncStatusIndicator style={styles.syncIndicator} />
          <TouchableOpacity onPress={handleRefresh} disabled={refreshing}>
            <MaterialIcons 
              name="refresh" 
              size={24} 
              color={refreshing ? theme.colors.secondary : theme.colors.primary} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {renderSummaryCard()}
      {renderDateSelector()}
      {renderBulkActions()}

      <View style={styles.workersSection}>
        <Text style={styles.sectionTitle}>
          {t.workers} ({workers.length})
        </Text>
        
        {workers.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="people-outline" size={64} color={theme.colors.secondary} />
            <Text style={styles.emptyText}>{t.noWorkers}</Text>
          </View>
        ) : (
          <FlatList
            data={workers}
            renderItem={renderWorkerItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            contentContainerStyle={styles.workersList}
          />
        )}
      </View>

      {renderAttendanceOptionsModal()}

      {markingAttendance && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>{t.markingAttendance}</Text>
          </View>
        </View>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={new Date(selectedDate)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
          style={Platform.OS === 'ios' ? styles.datePickerIOS : undefined}
        />
      )}

      {Platform.OS === 'ios' && showDatePicker && (
        <View style={styles.iosDatePickerContainer}>
          <View style={styles.iosDatePickerHeader}>
            <TouchableOpacity onPress={handleDatePickerDismiss}>
              <Text style={styles.iosDatePickerButton}>{t.cancel}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDatePickerDismiss}>
              <Text style={[styles.iosDatePickerButton, styles.iosDatePickerDone]}>{t.confirm}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 10,
  },
  title: {
    ...theme.typography.h2,
  },
  subtitle: {
    ...theme.typography.body,
    fontSize: 14,
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    ...theme.typography.h3,
    fontSize: 18,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  dateSelector: {
    marginBottom: 20,
  },
  dateSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dateSelectorText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 8,
  },
  bulkActions: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  bulkButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  presentButton: {
    backgroundColor: theme.colors.success,
  },
  absentButton: {
    backgroundColor: theme.colors.error,
  },
  bulkButtonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  workersSection: {
    flex: 1,
  },
  sectionTitle: {
    ...theme.typography.h3,
    marginBottom: 12,
  },
  workersList: {
    paddingBottom: 20,
  },
  workerCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  workerInfo: {
    flex: 1,
  },
  workerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workerName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  workerDetails: {
    marginBottom: 8,
  },
  workerPhone: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  workerSkills: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  checkInTime: {
    fontSize: 12,
    color: theme.colors.success,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 12,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  optionsModal: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    ...theme.typography.h3,
  },
  modalContent: {
    padding: 20,
    paddingTop: 0,
  },
  workerNameModal: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsList: {
    gap: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    gap: 12,
  },
  optionItemSelected: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  syncIndicator: {
    marginRight: 10,
  },
  datePickerIOS: {
    width: 240,
    height: 200,
    padding: 10,
  },
  iosDatePickerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  iosDatePickerHeader: {
    backgroundColor: '#000',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iosDatePickerButton: {
    color: theme.colors.white,
    fontSize: 16,
  },
  iosDatePickerDone: {
    fontWeight: 'bold',
  },
});

export default DigitalMusterRollScreen; 