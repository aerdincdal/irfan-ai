import React, { forwardRef } from "react"
import { Switch as RNSwitch, View, StyleSheet, Platform } from "react-native"

interface SwitchProps {
  value: boolean
  onValueChange?: (value: boolean) => void
  disabled?: boolean
  style?: object
}

const Switch = forwardRef<RNSwitch, SwitchProps>(({ value, onValueChange, disabled, style }, ref) => {
  return (
    <View style={[styles.switchContainer, style]}>
      <RNSwitch
        ref={ref}
        trackColor={{ false: "#d1d5db", true: "#2563eb" }}
        thumbColor={Platform.OS === "android" ? (value ? "#3b82f6" : "#f9fafb") : undefined} 
        ios_backgroundColor="#d1d5db"
        onValueChange={onValueChange}
        value={value}
        disabled={disabled}
        style={styles.switch}
      />
    </View>
  )
})

Switch.displayName = "Switch"

const styles = StyleSheet.create({
  switchContainer: {
    width: 44, 
    height: 24, 
    borderRadius: 24 / 2,
    justifyContent: "center",
  },
  switch: {
   
  },
})

export { Switch }
