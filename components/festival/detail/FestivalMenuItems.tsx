import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../ui';
import { FestivalMenu, MenuItem } from '../../../types';
import { Colors } from '../../../constants/Colors';

interface FestivalMenuItemsProps {
  menus: FestivalMenu[];
}

export const FestivalMenuItems: React.FC<FestivalMenuItemsProps> = ({ menus }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const formatPrice = (min: number, max: number) => {
    if (min === max) return `${min.toLocaleString('vi-VN')} VNĐ`;
    return `${min.toLocaleString('vi-VN')} - ${max.toLocaleString('vi-VN')} VNĐ`;
  };

  if (!menus || menus.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Thực đơn</Text>
      {menus.map((menu) => (
        <Card key={menu.menuId} style={styles.menuCard}>
          <Text style={[styles.menuTitle, { color: colors.text }]}>
            {menu.menuName}
          </Text>
          <Text style={[styles.menuDescription, { color: colors.icon }]}>
            {menu.description}
          </Text>
          
          <View style={styles.menuItems}>
            {menu.menuItems.map((item: MenuItem, index: number) => (
              <View key={item.itemId}>
                <View style={styles.menuItem}>
                  <View style={styles.menuItemLeft}>
                    <View style={[
                      styles.itemTypeIcon,
                      { backgroundColor: item.itemType === 'food' ? '#FEF3C7' : '#E0F2FE' }
                    ]}>
                      <Ionicons
                        name={item.itemType === 'food' ? 'restaurant' : 'cafe'}
                        size={16}
                        color={item.itemType === 'food' ? '#D97706' : '#0284C7'}
                      />
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemName, { color: colors.text }]}>
                        {item.itemName}
                      </Text>
                      <Text style={[styles.itemDescription, { color: colors.icon }]}>
                        {item.description}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.itemPrice, { color: colors.primary }]}>
                    {formatPrice(item.minPrice, item.maxPrice)}
                  </Text>
                </View>
                {index < menu.menuItems.length - 1 && (
                  <View style={[styles.itemDivider, { backgroundColor: colors.border }]} />
                )}
              </View>
            ))}
          </View>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  menuCard: {
    marginBottom: 16,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  menuDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  menuItems: {
    marginTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
  },
  itemDivider: {
    height: 1,
    marginLeft: 44,
  },
});