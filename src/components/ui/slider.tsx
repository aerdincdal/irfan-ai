
import React from "react"
import { View, StyleSheet } from "react-native"
import Slider from "@react-native-community/slider"

interface SliderNativeProps {
  value: number
  onValueChange: (value: number) => void
  minimumValue?: number
  maximumValue?: number
  step?: number
  disabled?: boolean
}

export const SliderNative = ({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  disabled = false,
}: SliderNativeProps) => {
  return (
    <View style={styles.container}>
      <Slider
        style={{ flex: 1 }}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        value={value}
        step={step}
        onValueChange={onValueChange}
        disabled={disabled}
        minimumTrackTintColor="#2563eb" 
        maximumTrackTintColor="#e5e7eb" 
        thumbTintColor="#ffffff"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 40,
    justifyContent: "center",
  },
})
