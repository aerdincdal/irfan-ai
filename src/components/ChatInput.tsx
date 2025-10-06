import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage("");
      Keyboard.dismiss();
    }
  };

  const isSendDisabled = disabled || !message.trim();

  return (
    <View style={styles.container}>
      <TextInput
  style={styles.textInput}
  multiline={false} // <-- burayı false yaptık
  placeholder="İslami bir konu hakkında soru sorun..."
  placeholderTextColor="#666"
  value={message}
  onChangeText={setMessage}
  editable={!disabled}
  returnKeyType="send"
  onSubmitEditing={handleSubmit}
  blurOnSubmit={false}
/>
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isSendDisabled}
        style={[
          styles.sendButton,
          isSendDisabled && styles.sendButtonDisabled,
        ]}
      >
        <Ionicons name="send" size={24} color="#2e2e2e" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#000",
    backgroundColor: "#000",
    alignItems: "flex-end",
  },
  textInput: {
    flex: 1,
    minHeight: 52,
    maxHeight: 128,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#000",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#999",
    fontSize: 16,
    color: "#ccc",
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#F2AE30",
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  sendButtonDisabled: {
    backgroundColor: "#999",
  },
});
