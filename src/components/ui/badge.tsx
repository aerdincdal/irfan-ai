import React from "react";
import { Text, StyleSheet, View, ViewStyle, TextStyle } from "react-native";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface BadgeProps {
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children: React.ReactNode;
}

const colors = {
  default: {
    backgroundColor: "#3b82f6", 
    borderColor: "transparent",
    textColor: "#ffffff", 
    hoverBg: "#2563eb", 
  },
  secondary: {
    backgroundColor: "#64748b", 
    borderColor: "transparent",
    textColor: "#f1f5f9", 
    hoverBg: "#475569",
  },
  destructive: {
    backgroundColor: "#ef4444", 
    borderColor: "transparent",
    textColor: "#ffffff", 
    hoverBg: "#dc2626",
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: "#000000", 
    textColor: "#000000",
  },
};

export function Badge({
  variant = "default",
  style,
  textStyle,
  children,
}: BadgeProps) {
  const variantColors = colors[variant];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: variantColors.backgroundColor,
          borderColor: variantColors.borderColor,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: variantColors.textColor }, textStyle]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 9999,
    paddingHorizontal: 10, 
    paddingVertical: 2, 
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12, 
    fontWeight: "600", 
  },
});
