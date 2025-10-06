import React from "react"
import { View, StyleSheet, ViewProps } from "react-native"

interface ProgressProps extends ViewProps {
  value: number // 0 - 100 arası
}

const Progress = React.forwardRef<View, ProgressProps>(({ value, style, ...props }, ref) => {
  const progress = Math.min(Math.max(value, 0), 100) // 0-100 arası sınırr

  return (
    <View
      ref={ref}
      style={[styles.root, style]}
      {...props}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: progress }}
    >
      <View style={[styles.indicator, { width: `${progress}%` }]} />
    </View>
  )
})
Progress.displayName = "Progress"

const styles = StyleSheet.create({
  root: {
    height: 16,
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 9999,
    overflow: "hidden",
  },
  indicator: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 9999,
   
  },
})

export { Progress }
