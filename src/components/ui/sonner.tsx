// components/ui/toaster-native.tsx
import Toast, {
  BaseToast,
  ErrorToast,
  ToastConfig,
} from "react-native-toast-message"
import { StyleSheet, ColorSchemeName, useColorScheme } from "react-native"
import React from "react"

const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={[styles.toast, styles.success]}
      contentContainerStyle={styles.content}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={[styles.toast, styles.error]}
      text1Style={styles.errorText1}
      text2Style={styles.errorText2}
    />
  ),
}

export const Toaster = () => {
  const theme: ColorSchemeName = useColorScheme()

  return <Toast config={toastConfig} />
}

export { Toast } 

const styles = StyleSheet.create({
  toast: {
    borderLeftWidth: 4,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  success: {
    borderLeftColor: "#22c55e",
    backgroundColor: "#ecfdf5",
  },
  error: {
    borderLeftColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  content: {
    paddingHorizontal: 12,
  },
  text1: {
    fontSize: 15,
    fontWeight: "600",
    color: "#166534",
  },
  text2: {
    fontSize: 13,
    color: "#166534",
  },
  errorText1: {
    fontSize: 15,
    fontWeight: "600",
    color: "#991b1b",
  },
  errorText2: {
    fontSize: 13,
    color: "#991b1b",
  },
})
