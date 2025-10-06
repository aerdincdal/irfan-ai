import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";

interface LabelProps extends TextProps {
  disabled?: boolean;
  
}

export const Label = React.forwardRef<Text, LabelProps>(
  ({ style, disabled, children, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        style={[styles.label, disabled && styles.disabled, style]}
        {...props}
      >
        {children}
      </Text>
    );
  }
);

Label.displayName = "Label";

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "500", 
    color: "#000", 
  },
  disabled: {
    opacity: 0.7,
  },
});
