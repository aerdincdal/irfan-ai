import { StyleSheet, StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';

type NamedStyle = ViewStyle | TextStyle | ImageStyle;
type Style = StyleProp<NamedStyle>;

export function cn(...inputs: Style[]): Style {

  return StyleSheet.flatten(inputs);
}
export function someUtil() {
  
  console.log("someUtil çalıştı");
}
