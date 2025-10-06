import React from "react";
import { View, Text, StyleSheet, ViewProps, TextProps } from "react-native";

type CardProps = ViewProps;

const Card = React.forwardRef<View, CardProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.card, style]} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<View, ViewProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.cardHeader, style]} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<Text, TextProps>(({ style, children, ...props }, ref) => (
  <Text ref={ref} style={[styles.cardTitle, style]} {...props}>
    {children}
  </Text>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<Text, TextProps>(({ style, children, ...props }, ref) => (
  <Text ref={ref} style={[styles.cardDescription, style]} {...props}>
    {children}
  </Text>
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<View, ViewProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.cardContent, style]} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<View, ViewProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.cardFooter, style]} {...props} />
));
CardFooter.displayName = "CardFooter";

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc", 
    backgroundColor: "#fff", 
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3, 
  },
  cardHeader: {
    padding: 24,
    paddingBottom: 12,
    flexDirection: "column",
    gap: 6,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 28,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666", 
  },
  cardContent: {
    padding: 24,
    paddingTop: 0,
  },
  cardFooter: {
    padding: 24,
    paddingTop: 0,
    flexDirection: "row",
    alignItems: "center",
  },
});

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
