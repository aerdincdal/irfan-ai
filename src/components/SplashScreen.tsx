import React, { useEffect, useState, useRef } from "react";
import { View, Text, Animated, StyleSheet, Image } from "react-native";

const bismillahCalligraphy = require("../assets/bismillah-calligraphy.png");

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [showBismillah, setShowBismillah] = useState(false);
  const [showLogo, setShowLogo] = useState(false);

  const bismillahOpacity = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowBismillah(true);
      Animated.timing(bismillahOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 0.3,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.7,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, 500);

    const timer2 = setTimeout(() => {
      setShowLogo(true);
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 1500);

    const timer3 = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      glowOpacity.stopAnimation();
    };
  }, [bismillahOpacity, logoOpacity, glowOpacity, onComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {showBismillah && (
          <Animated.View style={[styles.bismillahWrapper, { opacity: bismillahOpacity }]}>
            <Animated.View style={[styles.glowEffect, { opacity: glowOpacity }]} />
            <Image source={bismillahCalligraphy} style={styles.bismillahImage} resizeMode="contain" />
          </Animated.View>
        )}

        {showLogo && (
          <Animated.View style={[styles.logoContainer, { opacity: logoOpacity }]}>
          
            <View style={styles.subtitleWrapper}>
       
              <Text style={styles.logoSubtitle}>Yapay Zekâ Destekli İslami Rehber</Text>
            </View>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  bismillahWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  glowEffect: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 20,
    backgroundColor: "#F2AE30",
    opacity: 0.7,
    shadowColor: "#F2AE30",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 30,
    shadowOpacity: 1,
    elevation: 20,
  },
  bismillahImage: {
    width: 200,
    height: 200,
    borderRadius: 20,
  },
  logoContainer: {
    alignItems: "center",
  },
  
  subtitleWrapper: {
    position: "relative",
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
  },
 
  logoSubtitle: {
    fontSize: 14,
    color: "#CCCCCC",
    fontStyle: "italic",
    paddingHorizontal: 8,
    textAlign: "center",
  },
});
