import React from "react";
import { View, ViewProps, StyleProp, ViewStyle } from "react-native";

interface AspectRatioProps extends ViewProps {
  ratio?: number; 
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const AspectRatio = ({ ratio = 1, style, children, ...props }: AspectRatioProps) => {
  return (
    <View
      style={[
        { aspectRatio: ratio },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

export { AspectRatio };
