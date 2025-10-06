// components/ui/skeleton-native.tsx
import React, { useEffect, useRef } from "react"
import { Animated, View, StyleSheet, ViewStyle } from "react-native"

interface SkeletonProps {
  style?: ViewStyle
}

export const Skeleton = ({ style }: SkeletonProps) => {
  const opacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [opacity])

  return (
    <Animated.View style={[styles.skeleton, { opacity }, style]} />
  )
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    height: 20,
    width: "100%",
  },
})
