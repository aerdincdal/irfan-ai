import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { ChevronDown } from "lucide-react-native";


export function NavigationMenu({ children }: { children: React.ReactNode }) {
  return <View style={styles.menuContainer}>{children}</View>;
}

export function NavigationMenuList({
  children,
}: {
  children: React.ReactNode;
}) {
  return <View style={styles.menuList}>{children}</View>;
}

export function NavigationMenuItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return <View style={styles.menuItem}>{children}</View>;
}

export function NavigationMenuTrigger({
  title,
  onPress,
  expanded,
}: {
  title: string;
  onPress: () => void;
  expanded: boolean;
}) {
  return (
    <TouchableOpacity style={styles.trigger} onPress={onPress}>
      <Text style={styles.triggerText}>{title}</Text>
      <ChevronDown
        width={16}
        height={16}
        color="#333"
        style={{ transform: [{ rotate: expanded ? "180deg" : "0deg" }] }}
      />
    </TouchableOpacity>
  );
}

export function NavigationMenuContent({
  visible,
  children,
}: {
  visible: boolean;
  children: React.ReactNode;
}) {
  
  if (!visible) return null;
  return <View style={styles.menuContent}>{children}</View>;
}

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: "row",
    justifyContent: "center",
    zIndex: 10,
  },
  menuList: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItem: {
    marginHorizontal: 8,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
  },
  triggerText: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 4,
  },
  menuContent: {
    position: "absolute",
    top: 40,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
});
