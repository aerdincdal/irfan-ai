import React, { createContext, useContext } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

type Variant = "default" | "outline" | "ghost"; // Örnek varyantlar
type Size = "sm" | "default" | "lg";

interface ToggleGroupContextType {
  variant?: Variant;
  size?: Size;
}

const ToggleGroupContext = createContext<ToggleGroupContextType>({
  variant: "default",
  size: "default",
});

interface ToggleGroupProps {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  variant = "default",
  size = "default",
  children,
  style,
  ...props
}) => {
  return (
    <ToggleGroupContext.Provider value={{ variant, size }}>
      <View
        style={[styles.toggleGroupContainer, style]}
        {...props}
      >
        {children}
      </View>
    </ToggleGroupContext.Provider>
  );
};

interface ToggleGroupItemProps {
  value: string;
  selected: boolean;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const ToggleGroupItem: React.FC<ToggleGroupItemProps> = ({
  value,
  selected,
  onPress,
  variant,
  size,
  children,
  style,
  textStyle,
  ...props
}) => {
  const context = useContext(ToggleGroupContext);

  // variant ve size önceliği context'ten, yoksa props'tan al
  const appliedVariant = context.variant || variant || "default";
  const appliedSize = context.size || size || "default";

  // Stil hesaplama fonksiyonu
  const { containerStyle, textStyles } = getToggleStyles(
    selected,
    appliedVariant,
    appliedSize
  );

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[containerStyle, style]}
      {...props}
    >
      <Text style={[textStyles, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
};

// Stil fonksiyonu - toggleVariants mantığını taklit ediyoruz
function getToggleStyles(
  selected: boolean,
  variant: Variant,
  size: Size
) {
  // Temel stiller
  const baseContainer = {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 1,
    marginHorizontal: 4,
  } as ViewStyle;

  const baseText = {
    fontWeight: "500",
  } as TextStyle;

  // Variant ve selected durumuna göre container
  let containerStyle: ViewStyle = { ...baseContainer };
  let textStyles: TextStyle = { ...baseText };

  // Size’a göre padding ve fontSize
  switch (size) {
    case "sm":
      containerStyle.paddingVertical = 6;
      containerStyle.paddingHorizontal = 12;
      textStyles.fontSize = 12;
      break;
    case "lg":
      containerStyle.paddingVertical = 14;
      containerStyle.paddingHorizontal = 24;
      textStyles.fontSize = 18;
      break;
    default:
      containerStyle.paddingVertical = 10;
      containerStyle.paddingHorizontal = 16;
      textStyles.fontSize = 14;
      break;
  }

  // Variant ve seçili durumuna göre renkler
  switch (variant) {
    case "outline":
      containerStyle.borderColor = selected ? "#4f46e5" : "#d1d5db";
      containerStyle.backgroundColor = selected ? "#c7d2fe" : "transparent";
      textStyles.color = selected ? "#3730a3" : "#374151";
      break;

    case "ghost":
      containerStyle.borderColor = "transparent";
      containerStyle.backgroundColor = selected ? "#e0e7ff" : "transparent";
      textStyles.color = selected ? "#4338ca" : "#6b7280";
      break;

    default: // default variant
      containerStyle.borderColor = selected ? "#4f46e5" : "#d1d5db";
      containerStyle.backgroundColor = selected ? "#4f46e5" : "transparent";
      textStyles.color = selected ? "white" : "#374151";
      break;
  }

  return { containerStyle, textStyles };
}

const styles = StyleSheet.create({
  toggleGroupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
