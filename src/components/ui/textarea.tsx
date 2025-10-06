import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";

interface TextareaProps extends TextInputProps {
  // React Native TextInput özellikleri
}

const Textarea = React.forwardRef<TextInput, TextareaProps>(
  ({ style, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        multiline
        style={[styles.textarea, style]}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

const styles = StyleSheet.create({
  textarea: {
    minHeight: 80,
    width: "100%",
    paddingHorizontal: 16, // px-4 = 16px
    paddingVertical: 12, // py-3 = 12px
    fontSize: 14, // text-sm yaklaşık
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.1)", // glass-input hissi için yarı şeffaf
    color: "#000", // Text rengi, isteğe göre değiştirilebilir
    // placeholder renk ve diğer durumlar react-native'de farklı yönetilir
  },
});

export { Textarea };
