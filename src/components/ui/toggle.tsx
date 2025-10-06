import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from "react-native";

type Variant = "default" | "outline";
type Size = "default" | "sm" | "lg";

interface ToggleProps extends TouchableOpacityProps {
  variant?: Variant;
  size?: Size;
  selected?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Toggle = React.forwardRef<React.ElementRef<typeof TouchableOpacity>, ToggleProps>(
  (
    {
      variant = "default",
      size = "default",
      selected = false,
      children,
      style,
      textStyle,
      onPress,
      ...props
    },
    ref
  ) => {
    const { containerStyle, textStyles } = getToggleStyles(selected, variant, size);

    return (
      <TouchableOpacity
        ref={ref}
        onPress={onPress}
        style={[containerStyle, style]}
        activeOpacity={0.7}
        {...props}
      >
        <Text style={[textStyles, textStyle]}>{children}</Text>
      </TouchableOpacity>
    );
  }
);

Toggle.displayName = "Toggle";

function getToggleStyles(selected: boolean, variant: Variant, size: Size) {
  let containerStyle: ViewStyle = {
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: variant === "outline" ? 1 : 0,
    borderColor: variant === "outline" ? (selected ? "#4f46e5" : "#d1d5db") : "transparent",
    backgroundColor: selected ? "#4f46e5" : "transparent", 
    paddingHorizontal: 12,
  };

  switch (size) {
    case "sm":
      containerStyle.height = 36;
      containerStyle.paddingHorizontal = 10;
      break;
    case "lg":
      containerStyle.height = 44;
      containerStyle.paddingHorizontal = 20;
      break;
    default:
      containerStyle.height = 40;
      containerStyle.paddingHorizontal = 12;
  }

  let textStyles: TextStyle = {
    fontWeight: "500",
    fontSize: 14,
    color: selected ? "#fff" : variant === "outline" ? "#374151" : "#6b7280",
  };

  return { containerStyle, textStyles };
}

export { Toggle };
