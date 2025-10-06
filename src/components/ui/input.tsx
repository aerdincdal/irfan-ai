import React, { forwardRef } from "react";
import { TextInput, TextInputProps, StyleSheet } from "react-native";

interface InputProps extends TextInputProps {}

const Input = forwardRef<TextInput, InputProps>(({ style, ...props }, ref) => {
  return (
    <TextInput
      ref={ref}
      style={[styles.input, style]}
      {...props}
      placeholderTextColor="#666"
      editable={props.editable !== false} 
    />
  );
});

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    color: "#000",
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});

Input.displayName = "Input";

export { Input };
