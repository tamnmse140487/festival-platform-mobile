import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.border,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const FestivalCardSkeleton: React.FC = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.cardContainer, { backgroundColor: colors.surface }]}>
      <SkeletonLoader width="100%" height={200} borderRadius={0} />
      
      <View style={styles.cardContent}>
        <SkeletonLoader width="80%" height={20} borderRadius={4} style={styles.titleSkeleton} />
        <SkeletonLoader width="60%" height={16} borderRadius={4} style={styles.themeSkeleton} />
        
        <View style={[styles.schoolSkeleton, { backgroundColor: colors.secondary }]}>
          <SkeletonLoader width={28} height={28} borderRadius={14} />
          <View style={styles.schoolTextSkeleton}>
            <SkeletonLoader width="70%" height={14} borderRadius={4} />
            <SkeletonLoader width="50%" height={12} borderRadius={4} style={{ marginTop: 4 }} />
          </View>
        </View>

        <View style={styles.infoSkeleton}>
          <SkeletonLoader width="100%" height={14} borderRadius={4} />
          <SkeletonLoader width="85%" height={14} borderRadius={4} style={{ marginTop: 6 }} />
        </View>

        <View style={[styles.statsSkeleton, { borderTopColor: colors.border }]}>
          <View style={styles.statItemSkeleton}>
            <SkeletonLoader width={40} height={16} borderRadius={4} />
            <SkeletonLoader width={60} height={12} borderRadius={4} style={{ marginTop: 4 }} />
          </View>
          <View style={styles.statItemSkeleton}>
            <SkeletonLoader width={40} height={16} borderRadius={4} />
            <SkeletonLoader width={60} height={12} borderRadius={4} style={{ marginTop: 4 }} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E5E7EB',
  },
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
  },
  titleSkeleton: {
    marginBottom: 6,
  },
  themeSkeleton: {
    marginBottom: 12,
  },
  schoolSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  schoolTextSkeleton: {
    flex: 1,
    marginLeft: 8,
  },
  infoSkeleton: {
    marginBottom: 12,
  },
  statsSkeleton: {
    flexDirection: 'row',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  statItemSkeleton: {
    flex: 1,
    alignItems: 'center',
  },
});