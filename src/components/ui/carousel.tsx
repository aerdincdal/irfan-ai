import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { ArrowLeft, ArrowRight } from 'lucide-react-native'; 

type CarouselProps = {
  data: any[];
  renderItem: ({ item, index }: { item: any; index: number }) => React.ReactElement;
  width?: number;
  height?: number;
};

export function CustomCarousel({
  data,
  renderItem,
  width = Dimensions.get('window').width,
  height = 200,
}: CarouselProps) {
  const carouselRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollNext = () => {
    if (currentIndex < data.length - 1) {
      carouselRef.current?.scrollTo({ index: currentIndex + 1 });
    }
  };

  const scrollPrev = () => {
    if (currentIndex > 0) {
      carouselRef.current?.scrollTo({ index: currentIndex - 1 });
    }
  };

  return (
    <View style={{ width, height }}>
      <Carousel
        ref={carouselRef}
        loop={false}
        width={width}
        height={height}
        data={data}
        onSnapToItem={setCurrentIndex}
        renderItem={renderItem}
      />

      <TouchableOpacity
        style={[styles.button, { left: 10 }]}
        disabled={currentIndex === 0}
        onPress={scrollPrev}
      >
        <ArrowLeft size={24} color={currentIndex === 0 ? '#ccc' : '#000'} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { right: 10 }]}
        disabled={currentIndex === data.length - 1}
        onPress={scrollNext}
      >
        <ArrowRight size={24} color={currentIndex === data.length - 1 ? '#ccc' : '#000'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: '50%',
    marginTop: -24,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 24,
    padding: 6,
    zIndex: 100,
  },
});
