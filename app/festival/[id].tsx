import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui';
import { FestivalImageGallery } from '../../components/festival/FestivalImageGallery';
import { FestivalMenuItems } from '../../components/festival/FestivalMenuItems';
import { FestivalMapSection } from '../../components/festival/FestivalMapSection';
import { festivalService } from '../../services/festivalService';
import { Festival } from '../../types';
import { Colors } from '../../constants/Colors';

export default function FestivalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [festival, setFestival] = useState<Festival | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    loadFestival();
  }, [id]);

  const loadFestival = async () => {
    if (!id) return;
    
    try {
      const data = await festivalService.getFestivalById(parseInt(id));
      setFestival(data);
    } catch (error) {
      console.error('Failed to load festival:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return '#059669';
      case 'draft': return '#D97706';
      case 'completed': return '#0284C7';
      case 'cancelled': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Đang diễn ra';
      case 'draft': return 'Bản nháp';
      case 'completed': return 'Đã kết thúc';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.icon }]}>
          Đang tải thông tin lễ hội...
        </Text>
      </View>
    );
  }

  if (!festival) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.icon} />
        <Text style={[styles.errorText, { color: colors.text }]}>
          Không tìm thấy thông tin lễ hội
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <FestivalImageGallery
        images={festival.images}
        activeIndex={activeImageIndex}
        onIndexChange={setActiveImageIndex}
      />
      
      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: colors.text }]}>
            {festival.festivalName}
          </Text>
          <Text style={[styles.theme, { color: colors.icon }]}>
            {festival.theme}
          </Text>
          
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(festival.status) }
          ]}>
            <Text style={styles.statusText}>
              {getStatusText(festival.status)}
            </Text>
          </View>
        </View>

        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>
                Thời gian diễn ra
              </Text>
              <Text style={[styles.infoValue, { color: colors.icon }]}>
                {formatDate(festival.startDate)}
              </Text>
              <Text style={[styles.infoValue, { color: colors.icon }]}>
                đến {formatDate(festival.endDate)}
              </Text>
            </View>
          </View>

          <View style={[styles.infoDivider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>
                Địa điểm
              </Text>
              <Text style={[styles.infoValue, { color: colors.icon }]}>
                {festival.location}
              </Text>
            </View>
          </View>

          <View style={[styles.infoDivider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>
                Thời gian đăng ký
              </Text>
              <Text style={[styles.infoValue, { color: colors.icon }]}>
                Từ {formatDate(festival.registrationStartDate)}
              </Text>
              <Text style={[styles.infoValue, { color: colors.icon }]}>
                đến {formatDate(festival.registrationEndDate)}
              </Text>
            </View>
          </View>
        </Card>

        <Card style={styles.descriptionCard}>
          <Text style={[styles.descriptionTitle, { color: colors.text }]}>
            Mô tả lễ hội
          </Text>
          <Text style={[styles.description, { color: colors.icon }]}>
            {festival.description}
          </Text>
        </Card>

        <FestivalMenuItems menus={festival.festivalMenus} />
        
        <FestivalMapSection maps={festival.festivalMaps} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    lineHeight: 34,
  },
  theme: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 12,
    lineHeight: 22,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoDivider: {
    height: 1,
    marginLeft: 32,
  },
  descriptionCard: {
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
});