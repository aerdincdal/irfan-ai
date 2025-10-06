import React, { useState, forwardRef, ReactNode } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";

import { cn } from '../../lib/utils';

import { Button } from "./button";


interface AlertDialogProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

const AlertDialog = ({ visible, onClose, children }: AlertDialogProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>{children}</View>
      </View>
    </Modal>
  );
};

const AlertDialogHeader = ({ children, style }: { children: ReactNode; style?: any }) => (
  <View style={[styles.header, style]}>{children}</View>
);

const AlertDialogFooter = ({ children, style }: { children: ReactNode; style?: any }) => (
  <View style={[styles.footer, style]}>{children}</View>
);

const AlertDialogTitle = forwardRef<Text, { children: ReactNode; style?: any }>(
  ({ children, style }, ref) => (
    <Text ref={ref} style={[styles.title, style]}>
      {children}
    </Text>
  )
);

const AlertDialogDescription = forwardRef<Text, { children: ReactNode; style?: any }>(
  ({ children, style }, ref) => (
    <Text ref={ref} style={[styles.description, style]}>
      {children}
    </Text>
  )
);

interface AlertDialogButtonProps {
  onPress?: (event: GestureResponderEvent) => void;
  children: ReactNode;
  variant?: "default" | "outline";
  style?: any;
}

const AlertDialogAction = forwardRef<View, AlertDialogButtonProps>(
  ({ onPress, children, variant = "default", style }, ref) => (
    <Pressable
      ref={ref}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === "outline" ? styles.buttonOutline : styles.buttonDefault,
        pressed && styles.buttonPressed,
        style,
      ]}
    >
      <Text style={variant === "outline" ? styles.buttonTextOutline : styles.buttonTextDefault}>
        {children}
      </Text>
    </Pressable>
  )
);

const AlertDialogCancel = forwardRef<View, AlertDialogButtonProps>(
  ({ onPress, children, style }, ref) => (
    <AlertDialogAction
      ref={ref}
      onPress={onPress}
      variant="outline"
      style={[styles.cancelButton, style]}
    >
      {children}
    </AlertDialogAction>
  )
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    marginBottom: 12,
    alignItems: "center",
  },
  footer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    minWidth: 80,
    alignItems: "center",
  },
  buttonDefault: {
    backgroundColor: "#3b82f6", // blue-500
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: "#3b82f6",
    backgroundColor: "transparent",
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonTextDefault: {
    color: "white",
    fontWeight: "600",
  },
  buttonTextOutline: {
    color: "#3b82f6",
    fontWeight: "600",
  },
  cancelButton: {
    marginLeft: 10,
  },
});

export {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
