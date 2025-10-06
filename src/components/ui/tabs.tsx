import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface TabsProps {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

interface TabsListProps {
  children: React.ReactElement<TabsTriggerProps>[]; 
  style?: ViewStyle;
  activeValue: string;
  onChange: (value: string) => void;
}

interface TabsTriggerProps {
  value: string;
  activeValue: string;
  onPress: (value: string) => void;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

interface TabsContentProps {
  value: string;
  activeValue: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue = "", onValueChange, children }) => {
  const [activeValue, setActiveValue] = useState(defaultValue);

  const handleChange = (value: string) => {
    setActiveValue(value);
    if (onValueChange) onValueChange(value);
  };

  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    
    return React.cloneElement(child as React.ReactElement<any>, {
      activeValue,
      onChange: handleChange,
      onValueChange: handleChange,
    });
  });
};

export const TabsList: React.FC<TabsListProps> = ({ children, style, activeValue, onChange }) => {
  return (
    <View style={[styles.tabsList, style]}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        
        return React.cloneElement(child as React.ReactElement<TabsTriggerProps>, { activeValue, onPress: onChange });
      })}
    </View>
  );
};

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  activeValue,
  onPress,
  children,
  style,
  textStyle,
  disabled = false,
}) => {
  const isActive = value === activeValue;

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => onPress(value)}
      style={[styles.tabTrigger, isActive && styles.tabTriggerActive, style, disabled && styles.disabled]}
    >
      <Text style={[styles.tabText, isActive && styles.tabTextActive, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
};

export const TabsContent: React.FC<TabsContentProps> = ({ value, activeValue, children, style }) => {
  if (value !== activeValue) return null;
  return <View style={[styles.tabsContent, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  tabsList: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 4,
    justifyContent: "center",
  },
  tabTrigger: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: "transparent",
  },
  tabTriggerActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  tabTextActive: {
    color: "#111827",
  },
  tabsContent: {
    marginTop: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});
