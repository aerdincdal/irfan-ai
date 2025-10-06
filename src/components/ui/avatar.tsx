import React from "react";
import { View, Image, Text, StyleSheet, StyleProp, ViewStyle, ImageStyle, TextStyle } from "react-native";

interface AvatarProps {
  uri?: string;
  fallbackText?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  fallbackTextStyle?: StyleProp<TextStyle>;
}

const Avatar: React.FC<AvatarProps> = ({
  uri,
  fallbackText = "?",
  size = 40,
  style,
  imageStyle,
  fallbackTextStyle,
}) => {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }, style]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, { borderRadius: size / 2 }, imageStyle]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.fallback, { borderRadius: size / 2 }]}>
          <Text style={[styles.fallbackText, fallbackTextStyle]}>{fallbackText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: "#ccc", 
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#bbb",
  },
  fallbackText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Avatar;
