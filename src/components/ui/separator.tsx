import React from "react"
import { View, StyleProp, ViewStyle } from "react-native"

interface SeparatorProps {
  orientation?: "horizontal" | "vertical"
  thickness?: number
  length?: number | string
  color?: string
  style?: StyleProp<ViewStyle>
}

export const Separator: React.FC<SeparatorProps> = ({
  orientation = "horizontal",
  thickness = 1,
  length = "100%",
  color = "#e5e7eb",
  style,
}) => {
  const isHorizontal = orientation === "horizontal"


  const lengthValue = typeof length === "string" ? (length as any) : length

  return (
    <View
      style={[
        {
          backgroundColor: color,
          width: isHorizontal ? lengthValue : thickness,
          height: isHorizontal ? thickness : lengthValue,
        },
        style,
      ]}
    />
  )
}
