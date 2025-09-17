import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { FestivalImage } from '../../../types';

const { width } = Dimensions.get('window');

interface FestivalImageGalleryProps {
  images: FestivalImage[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
}

export const FestivalImageGallery: React.FC<FestivalImageGalleryProps> = ({
  images,
  activeIndex,
  onIndexChange,
}) => {
  const defaultImage = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';

  if (!images || images.length === 0) {
    return (
      <View style={styles.imageGallery}>
        <Image
          source={{ uri: defaultImage }}
          style={styles.galleryImage}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View style={styles.imageGallery}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          onIndexChange(index);
        }}
      >
        {images.map((image, index) => (
          <Image
            key={image.imageId}
            source={{ uri: image.imageUrl }}
            style={styles.galleryImage}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {images.length > 1 && (
        <View style={styles.imageIndicators}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === activeIndex && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageGallery: {
    position: 'relative',
  },
  galleryImage: {
    width: width,
    height: 250,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#FFFFFF',
  },
});