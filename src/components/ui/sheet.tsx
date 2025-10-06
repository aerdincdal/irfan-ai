import React, { useState, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import { X } from "lucide-react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface SheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number; // genişlik, default 75% ekran
  overlayColor?: string;
  sheetStyle?: ViewStyle;
}

export function Sheet({
  visible,
  onClose,
  children,
  width = SCREEN_WIDTH * 0.75,
  overlayColor = "rgba(0,0,0,0.5)",
  sheetStyle,
}: SheetProps) {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // açılırken animasyon
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // kapanırken animasyon
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, animation]);

 
  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [width, 0],
  });

 
  const overlayOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { backgroundColor: overlayColor, opacity: overlayOpacity }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.sheet,
          { width, transform: [{ translateX }] },
          sheetStyle,
        ]}
      >
        <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
          <X size={24} color="#000" />
        </TouchableOpacity>
        {children}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
  },
  sheet: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: -3, height: 0 },
    elevation: 5,
    padding: 16,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 4,
  },
});
