import React, { useRef } from "react";
import { View, PanResponder, Animated, StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export const ResizablePanelGroup = ({ left, right }: { left: React.ReactNode; right: React.ReactNode }) => {
  const pan = useRef(new Animated.ValueXY({ x: screenWidth / 2, y: 0 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        let newX = gestureState.moveX;
        if (newX > 100 && newX < screenWidth - 100) {
          pan.setValue({ x: newX, y: 0 });
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.panel, { width: pan.x }]}>
        {left}
      </Animated.View>

      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.handle, { left: pan.x }]}
      >
        <View style={styles.handleBar} />
      </Animated.View>

      <Animated.View style={[styles.panel, { flex: 1 }]}>
        {right}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
  },
  panel: {
    backgroundColor: "#f4f4f5",
    height: "100%",
  },
  handle: {
    position: "absolute",
    top: 0,
    width: 16,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  handleBar: {
    width: 4,
    height: 40,
    backgroundColor: "#a1a1aa",
    borderRadius: 2,
  },
});
