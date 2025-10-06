import React from "react";
import { View, Text, ScrollView, StyleSheet, ViewProps, TextProps } from "react-native";

const Table: React.FC<ViewProps> = ({ children, style, ...props }) => (
  <ScrollView horizontal style={[styles.tableWrapper, style]} {...props}>
    <View style={styles.table}>{children}</View>
  </ScrollView>
);

const TableHeader: React.FC<ViewProps> = ({ children, style, ...props }) => (
  <View style={[styles.tableHeader, style]} {...props}>
    {children}
  </View>
);

const TableBody: React.FC<ViewProps> = ({ children, style, ...props }) => (
  <View style={[styles.tableBody, style]} {...props}>
    {children}
  </View>
);

const TableFooter: React.FC<ViewProps> = ({ children, style, ...props }) => (
  <View style={[styles.tableFooter, style]} {...props}>
    {children}
  </View>
);

const TableRow: React.FC<ViewProps> = ({ children, style, ...props }) => (
  <View style={[styles.tableRow, style]} {...props}>
    {children}
  </View>
);

const TableHead: React.FC<TextProps> = ({ children, style, ...props }) => (
  <Text style={[styles.tableHead, style]} {...props}>
    {children}
  </Text>
);

const TableCell: React.FC<TextProps> = ({ children, style, ...props }) => (
  <Text style={[styles.tableCell, style]} {...props}>
    {children}
  </Text>
);

const TableCaption: React.FC<TextProps> = ({ children, style, ...props }) => (
  <Text style={[styles.tableCaption, style]} {...props}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  tableWrapper: {
    width: "100%",
  },
  table: {
    minWidth: 600,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f3f4f6", 
  },
  tableBody: {},
  tableFooter: {
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#e5e7eb", 
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  tableHead: {
    flex: 1,
    padding: 12,
    fontWeight: "600",
    color: "#6b7280", 
    textAlign: "left",
  },
  tableCell: {
    flex: 1,
    padding: 12,
    textAlign: "left",
    color: "#111827", 
  },
  tableCaption: {
    marginTop: 8,
    fontSize: 14,
    color: "#6b7280",
  },
});

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
