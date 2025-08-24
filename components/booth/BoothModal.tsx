import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui';
import { boothService } from '../../services/boothService';
import { Booth, BoothMenuItem, BoothImage } from '../../types';
import { Colors } from '../../constants/Colors';

interface BoothModalProps {
  visible: boolean;
  locationId: number | null;
  locationName: string;
  onClose: () => void;
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return 'Đang hoạt động';
    default:
      return 'Chưa mở';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return '#059669';
    default:
      return '#6B7280';
  }
};

export const BoothModal: React.FC<BoothModalProps> = ({
  visible,
  locationId,
  locationName,
  onClose,
}) => {
  const [booth, setBooth] = useState<Booth | null>(null);
  const [menuItems, setMenuItems] = useState<BoothMenuItem[]>([]);
  const [menuImages, setMenuImages] = useState<Record<number, BoothImage[]>>({});
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    if (visible && locationId) {
      loadBoothData();
    }
  }, [visible, locationId]);

  const loadBoothData = async () => {
    if (!locationId) return;
    
    setLoading(true);
    try {
      const boothData = await boothService.getBoothByLocationId(locationId);
      setBooth(boothData);
      
      if (boothData) {
        const menuItemsData = await boothService.getBoothMenuItems(boothData.boothId);
        setMenuItems(menuItemsData);
        
        const imagesData: Record<number, BoothImage[]> = {};
        await Promise.all(
          menuItemsData.map(async (item) => {
            const images = await boothService.getBoothMenuItemImages(item.boothMenuItemId);
            imagesData[item.boothMenuItemId] = images;
          })
        );
        setMenuImages(imagesData);
      }
    } catch (error) {
      console.error('Failed to load booth data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('vi-VN')} VNĐ`;
  };

  const renderMenuItem = (item: BoothMenuItem) => {
    const images = menuImages[item.boothMenuItemId] || [];
    const primaryImage = images[0]?.imageUrl || 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';

    return (
      <Card key={item.boothMenuItemId} style={styles.menuItemCard}>
        <View style={styles.menuItemContent}>
          <Image
            source={{ uri: primaryImage }}
            style={styles.menuItemImage}
            resizeMode="cover"
          />
          <View style={styles.menuItemInfo}>
            <View style={styles.menuItemHeader}>
              <Text style={[styles.menuItemName, { color: colors.text }]}>
                {item.menuItem.itemName}
              </Text>
              <View style={[
                styles.itemTypeIcon,
                { backgroundColor: item.menuItem.itemType === 'food' ? '#FEF3C7' : '#E0F2FE' }
              ]}>
                <Ionicons
                  name={item.menuItem.itemType === 'food' ? 'restaurant' : 'cafe'}
                  size={14}
                  color={item.menuItem.itemType === 'food' ? '#D97706' : '#0284C7'}
                />
              </View>
            </View>
            
            {item.menuItem.description && (
              <Text style={[styles.menuItemDescription, { color: colors.icon }]}>
                {item.menuItem.description}
              </Text>
            )}
            
            <View style={styles.priceRow}>
              <Text style={[styles.customPrice, { color: colors.primary }]}>
                {formatPrice(item.customPrice)}
              </Text>
             
            </View>
            
            <View style={styles.quantityRow}>
              <Ionicons name="cube-outline" size={16} color={colors.icon} />
              <Text style={[styles.quantityText, { color: colors.icon }]}>
                Giới hạn: {item.quantityLimit} {item.remainingQuantity !== null && `• Còn: ${item.remainingQuantity}`}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View style={styles.headerContent}>
            <View>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                Thông tin gian hàng
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.icon }]}>
                Vị trí: {locationName}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeButton, { backgroundColor: colors.border }]}
            >
              <Ionicons name="close" size={24} color={colors.icon} />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.icon }]}>
              Đang tải thông tin gian hàng...
            </Text>
          </View>
        ) : booth ? (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Card style={styles.boothInfoCard}>
              <View style={styles.boothHeader}>
                <View style={styles.boothTitleRow}>
                  <Text style={[styles.boothName, { color: colors.text }]}>
                    {booth.boothName}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booth.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(booth.status)}</Text>
                  </View>
                </View>
                <Text style={[styles.boothDescription, { color: colors.icon }]}>
                  {booth.description}
                </Text>
              </View>
              
              <View style={[styles.boothInfoRow, { borderTopColor: colors.border }]}>
                <View style={styles.infoItem}>
                  <Ionicons name="storefront-outline" size={20} color={colors.primary} />
                  <Text style={[styles.infoLabel, { color: colors.text }]}>Loại gian hàng</Text>
                  <Text style={[styles.infoValue, { color: colors.icon }]}>
                    {booth.boothType === 'food' ? 'Đồ ăn' : 'Đồ uống'}
                  </Text>
                </View>
              </View>
            </Card>

            <View style={styles.menuSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Thực đơn ({menuItems.length} món)
              </Text>
              {menuItems.map(renderMenuItem)}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={64} color={colors.icon} />
            <Text style={[styles.errorText, { color: colors.text }]}>
              Không tìm thấy thông tin gian hàng
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
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
  boothInfoCard: {
    marginBottom: 20,
  },
  boothHeader: {
    marginBottom: 16,
  },
  boothTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  boothName: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  boothDescription: {
    fontSize: 15,
    lineHeight: 20,
  },
  boothInfoRow: {
    borderTopWidth: 1,
    paddingTop: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
  },
  menuSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  menuItemCard: {
    marginBottom: 12,
    padding: 12,
  },
  menuItemContent: {
    flexDirection: 'row',
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  itemTypeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemDescription: {
    fontSize: 13,
    lineHeight: 16,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  customPrice: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 12,
    marginLeft: 4,
  },
});