import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, GestureResponderEvent } from "react-native";
import { ChevronRight, MoreHorizontal } from "lucide-react-native"; 

interface BreadcrumbProps {
  children: React.ReactNode;
  accessibilityLabel?: string;
}

export function Breadcrumb({ children, accessibilityLabel = "breadcrumb navigation" }: BreadcrumbProps) {
  return (
    <View
      
      accessibilityLabel={accessibilityLabel}
      style={styles.nav}
    >
      {children}
    </View>
  );
}

export function BreadcrumbList({ children }: { children: React.ReactNode }) {
  return <View style={styles.list}>{children}</View>;
}

export function BreadcrumbItem({ children }: { children: React.ReactNode }) {
  return <View style={styles.item}>{children}</View>;
}

interface BreadcrumbLinkProps {
  onPress?: (event: GestureResponderEvent) => void;
  children: React.ReactNode;
  disabled?: boolean;
  style?: object;
}

export function BreadcrumbLink({ onPress, children, disabled = false, style }: BreadcrumbLinkProps) {
  if (disabled) {
    return <Text style={[styles.link, styles.disabledLink, style]}>{children}</Text>;
  }
  return (
    <TouchableOpacity onPress={onPress} accessibilityRole="link" style={style}>
      <Text style={styles.link}>{children}</Text>
    </TouchableOpacity>
  );
}

export function BreadcrumbPage({ children }: { children: React.ReactNode }) {
  return (
    <Text
      accessibilityState={{ selected: true }} 
      style={styles.currentPage}
    >
      {children}
    </Text>
  );
}

export function BreadcrumbSeparator() {
  return (
    <View accessible={false} style={styles.separator}>
      <ChevronRight size={16} color="#6b7280" />
    </View>
  );
}

export function BreadcrumbEllipsis() {
  return (
    <View accessible={false} style={styles.ellipsis}>
      <MoreHorizontal size={16} color="#6b7280" />
      <Text style={styles.srOnly}>More</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8, 
  },
  link: {
    color: "#6b7280", 
    fontSize: 14,
  },
  disabledLink: {
    color: "#374151", 
    fontWeight: "normal",
  },
  currentPage: {
    color: "#111827", 
    fontWeight: "normal",
    fontSize: 14,
  },
  separator: {
    marginHorizontal: 4,
    justifyContent: "center",
  },
  ellipsis: {
    height: 36,
    width: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  srOnly: {
    position: "absolute",
    width: 1,
    height: 1,
    margin: -1,
    overflow: "hidden",
  },
});
