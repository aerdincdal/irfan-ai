import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Keyboard } from "react-native";
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
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          multiline
          placeholder="İslami bir konu hakkında soru sorun..."
          placeholderTextColor="#666"
          value={message}
          onChangeText={setMessage}
          editable={!disabled}
          returnKeyType="send"
          onSubmitEditing={handleSubmit}
          blurOnSubmit={false}
          scrollEnabled={true} 
        />
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isSendDisabled}
        style={[styles.sendButton, isSendDisabled && styles.sendButtonDisabled]}
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
    borderTopColor: "#222",
    backgroundColor: "#000",
    alignItems: "flex-end",
  },
  inputWrapper: {
    flex: 1,
    height: 52, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#444",
    backgroundColor: "#000",
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#ccc",
    textAlignVertical: "top",
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
