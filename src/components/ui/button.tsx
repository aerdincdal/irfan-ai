import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
} from "react-native";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  children: React.ReactNode;
}

const variantStyles = StyleSheet.create({
  default: {
    backgroundColor: "#e0e0e0",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  destructive: {
    backgroundColor: "#ff4d4f",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#a0a0a0",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  secondary: {
    backgroundColor: "rgba(108, 99, 255, 0.5)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  ghost: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
});

const sizeStyles = StyleSheet.create({
  default: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  sm: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  lg: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  icon: {
    height: 40,
    width: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});

const textVariantStyles = StyleSheet.create({
  default: { color: "#000" },
  destructive: { color: "#fff" },
  outline: { color: "#555" },
  secondary: { color: "#eee" },
  ghost: { color: "#555" },
  link: { color: "#1e90ff", textDecorationLine: "underline" },
});

export function Button({
  variant = "default",
  size = "default",
  onPress,
  disabled,
  style,
  textStyle,
  children,
}: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      style={[
        variantStyles[variant],
        sizeStyles[size],
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      <Text style={[textVariantStyles[variant], textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
}
