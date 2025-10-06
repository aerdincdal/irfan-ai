import React from "react"
import {
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native"

interface ScrollAreaProps extends ScrollViewProps {
  style?: ViewStyle
  contentContainerStyle?: ViewStyle
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({
  children,
  style,
  contentContainerStyle,
  ...props
}) => {
  return (
    <View style={[styles.wrapper, style]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator
        {...props}
      >
        {children}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    overflow: "hidden",
  },
  scroll: {
    flex: 1,
  },
})
