import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  style?: object;
}

export const Checkbox = ({ checked, onChange, disabled, style }: CheckboxProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, checked && styles.checked, disabled && styles.disabled, style]}
      onPress={() => !disabled && onChange(!checked)}
      activeOpacity={0.8}
      disabled={disabled}
    >
      {checked && <Check size={16} color="white" />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: "#336699",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  checked: {
    backgroundColor: "#336699",
  },
  disabled: {
    opacity: 0.5,
  },
});
