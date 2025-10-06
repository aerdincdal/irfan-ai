import React, { useState } from "react"
import { View, Text, Pressable, StyleSheet } from "react-native"

type Option = {
  label: string
  value: string
}

interface RadioGroupProps {
  options: Option[]
  value: string
  onValueChange: (value: string) => void
  disabled?: boolean
}

export const RadioGroup = ({
  options,
  value,
  onValueChange,
  disabled,
}: RadioGroupProps) => {
  return (
    <View style={styles.group}>
      {options.map((option) => (
        <Pressable
          key={option.value}
          onPress={() => !disabled && onValueChange(option.value)}
          style={styles.item}
        >
          <View style={styles.circleOuter}>
            {value === option.value && <View style={styles.circleInner} />}
          </View>
          <Text style={styles.label}>{option.label}</Text>
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  group: {
    gap: 12,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  circleOuter: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#3b82f6", 
    alignItems: "center",
    justifyContent: "center",
  },
  circleInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#3b82f6",
  },
  label: {
    fontSize: 14,
    color: "#1f2937", 
  },
})
