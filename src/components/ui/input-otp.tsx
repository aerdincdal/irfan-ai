import React, { useState, useEffect, useRef } from "react";
import { View, TextInput, StyleSheet, Text, TextInputProps } from "react-native";

interface OTPInputProps {
  length?: number;
  onChangeOTP?: (otp: string) => void;
  containerStyle?: object;
  inputStyle?: object;
}

export const OTPInput = ({
  length = 4,
  onChangeOTP,
  containerStyle,
  inputStyle,
}: OTPInputProps) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));

  
  const inputsRef = useRef<Array<TextInput | null>>(
    Array(length).fill(null)
  );

  useEffect(() => {
    onChangeOTP && onChangeOTP(otp.join(""));
  }, [otp, onChangeOTP]);

  const focusNext = (index: number) => {
    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleChange = (text: string, index: number) => {
    if (/^\d?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (text !== "") {
        focusNext(index);
      }
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {Array(length)
        .fill(0)
        .map((_, i) => (
          <TextInput
            key={i}
            ref={(ref) => {
              inputsRef.current[i] = ref;
            }}
            style={[styles.input, inputStyle]}
            keyboardType="number-pad"
            maxLength={1}
            value={otp[i]}
            onChangeText={(text) => handleChange(text, i)}
            autoFocus={i === 0}
            textAlign="center"
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 50,
    height: 50,
    borderRadius: 8,
    fontSize: 20,
    marginRight: 10,
  },
});
