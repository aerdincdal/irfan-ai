import React, { useState, useRef, useEffect, ReactNode } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  Platform,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ArrowRight, ArrowLeft } from "lucide-react-native";

const slides = [
  {
    id: 1,
    title: "İrfan'a Hoş Geldiniz",
    titleArabic: "أهلاً وسهلاً بكم في إرفان",
    subtitle: '"Maneviyat yolculuğunuzda size özel rehber"',
    description: "İslami bilgilere modern ve akıcı bir şekilde ulaşın.",
    image: require("../assets/irfan-logo.png"),
  },
  {
    id: 2,
    title: "Keşfet ve Öğren",
    titleArabic: "اكتشف وتعلم",
    subtitle: '"Ayetleri keşfedin, hadislerle derinleşin."',
    description: "Tefsirlerin sırlarını keşfedin, İslami ilimleri öğrenin.",
    image: require("../assets/kesfet.png"),
  },
  {
    id: 3,
    title: "Gizli İlimler Hazinesi",
    titleArabic: "كنز العلوم الخفية",
    subtitle: '"Manevi rehberlik ve özel anlar için dua koleksiyonu."',
    description:
      "Gizli İlimler Hazinesi kitabı, kadim bilgiler ve manevi öğretileri sizlere sunuyor.",
    image: require("../assets/gizli.png"),
  },
  {
    id: 4,
    title: "Hemen Başlayın",
    titleArabic: "ابدأ الآن",
    subtitle: '"İslami bilgiye dair sorularınızı sorun."',
    description: "Yapay zeka destekli rehberinizle sohbete başlayın.",
    image: require("../assets/mosque-silhouette.png"),
  },
];

interface GlowButtonProps {
  children: ReactNode;
  onPress: () => void;
  style?: Animated.AnimatedProps<any> | any;
  glowOpacity: Animated.AnimatedInterpolation<number>;
}

const GlowButton = ({ children, onPress, style, glowOpacity }: GlowButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.glowButtonContainer, style]}>
      <Animated.View style={[styles.glowEffect, { opacity: glowOpacity }]} />
      {children}
    </TouchableOpacity>
  );
};

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [glowAnim]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const slide = slides[currentSlide];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
    else onComplete();
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  return (
    <>
      <StatusBar style="light" translucent backgroundColor="#000" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.skipButton} onPress={onComplete}>
            <Text style={styles.skipText}>Geç</Text>
          </TouchableOpacity>

          <View style={[styles.contentWrapper, { minHeight: height * 0.7 }]}>
            <View style={styles.imageWrapper}>
              <Animated.View style={[styles.imageGlow, { opacity: glowOpacity }]} />
              <Image source={slide.image} style={styles.image} resizeMode="contain" />
            </View>

            <View style={styles.arabicTitleWrapper}>
              <Text
                style={[
                  styles.titleArabic,
                  Platform.OS === "android" && { fontFamily: "sans-serif" },
                ]}
              >
                {slide.titleArabic}
              </Text>
            </View>

            <View style={styles.pagination}>
              {slides.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === currentSlide ? styles.activeDot : styles.inactiveDot]}
                />
              ))}
            </View>

            <View style={styles.navButtons}>
              {currentSlide === 0 ? (
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <GlowButton onPress={nextSlide} glowOpacity={glowOpacity}>
                    <ArrowRight size={20} color="#F2AE30" />
                  </GlowButton>
                </View>
              ) : (
                <>
                  <GlowButton
                    onPress={prevSlide}
                    style={{ marginRight: 30 }}
                    glowOpacity={glowOpacity}
                  >
                    <ArrowLeft size={20} color="#F2AE30" />
                  </GlowButton>
                  <GlowButton onPress={nextSlide} glowOpacity={glowOpacity}>
                    <ArrowRight size={20} color="#F2AE30" />
                  </GlowButton>
                </>
              )}
            </View>

            <View style={styles.titleWrapper}>
              <Text style={styles.title}>{slide.title}</Text>
            </View>

            <View style={styles.textBox}>
              <Text style={styles.subtitle}>{slide.subtitle}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  skipButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 40 : 20,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    color: "#666",
    fontSize: 16,
  },
  imageWrapper: {
    position: "relative",
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  imageGlow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 20,
    backgroundColor: "#F2AE30",
    shadowColor: "#F2AE30",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 30,
    shadowOpacity: 1,
    elevation: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 20,
  },
  arabicTitleWrapper: {
    marginBottom: 25,
    paddingHorizontal: 10,
    alignSelf: "stretch",
  },
  titleArabic: {
    fontSize: 28,
    fontWeight: "700",
    color: "#F2AE30",
    fontFamily: "Arial",
    textAlign: "center",
  },
  pagination: {
    flexDirection: "row",
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#F2AE30",
  },
  inactiveDot: {
    backgroundColor: "#CCCCCC",
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 15,
    marginTop: 14,
    marginBottom: 24,
  },
  glowButtonContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: 45,
    height: 45,
    borderRadius: 22.5,
    ...Platform.select({
      ios: {
        shadowColor: "#F2AE30",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
        overflow: "hidden",
      },
    }),
  },
  glowEffect: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 50,
    backgroundColor: "rgba(242, 174, 48, 0.4)",
  },
  titleWrapper: {
    marginTop: 18,
    marginBottom: 5,
    paddingHorizontal: 10,
    alignSelf: "stretch",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#F2AE30",
    textAlign: "center",
    marginBottom: 15,
    fontStyle: "italic",
  },
  textBox: {
    height: 100, 
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  subtitle: {
    fontSize: 13.6,
    fontWeight: "bold",
    color: "#CCCCCC",
    marginBottom: 10,
    textAlign: "center",
    fontStyle: "italic",
  },
  description: {
    fontSize: 12.6,
    color: "#666",
    fontWeight: "bold",
    textAlign: "center",
    fontStyle: "italic",
  },
}); 