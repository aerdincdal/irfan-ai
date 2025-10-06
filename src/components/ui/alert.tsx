import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

type AlertProps = React.ComponentProps<typeof View> & {
  variant?: "default" | "destructive";
};

const Alert = React.forwardRef<View, AlertProps>(
  ({ style, variant = "default", ...props }, ref) => {
    // variant'a göre style seç
    const variantStyle = variant === "destructive" ? styles.destructive : styles.default;

    return <View ref={ref} style={[styles.alert, variantStyle, style]} {...props} />;
  }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<Text, React.ComponentProps<typeof Text>>(
  ({ style, ...props }, ref) => {
    return <Text ref={ref} style={[styles.title, style]} {...props} />;
  }
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<Text, React.ComponentProps<typeof Text>>(
  ({ style, ...props }, ref) => {
    return <Text ref={ref} style={[styles.description, style]} {...props} />;
  }
);
AlertDescription.displayName = "AlertDescription";

interface Style {
  alert: ViewStyle;
  default: ViewStyle;
  destructive: ViewStyle;
  title: TextStyle;
  description: TextStyle;
}

const styles = StyleSheet.create<Style>({
  alert: {
    position: "relative",
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  default: {
    backgroundColor: "#f9fafb", 
    borderColor: "#d1d5db", 
  },
  destructive: {
    backgroundColor: "#fee2e2", 
    borderColor: "#dc2626", 
  },
  title: {
    marginBottom: 4,
    fontWeight: "600",
    fontSize: 16,
    color: "#111827", 
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6b7280", 
  },
});

export { Alert, AlertTitle, AlertDescription };
