import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Menu, History, ArrowLeft } from "lucide-react-native";

interface HeaderProps {
  title?: string;
  onOpenMenu?: () => void;
  onOpenHistory?: () => void;
  onBack?: () => void;
  showMenu?: boolean;
  showHistory?: boolean;
  rightComponent?: React.ReactNode;
}

export const Header = ({
  title = "İrfan",
  onOpenMenu,
  onOpenHistory,
  onBack,
  showMenu,
  showHistory,
  rightComponent,
}: HeaderProps) => {
  return (
    <View style={styles.header}>
      {/* Sol kısım */}
      <View style={styles.left}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.iconButton}>
            <ArrowLeft color="#CCC" size={22} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Sağ kısım */}
      <View style={styles.right}>
        {showHistory && (
          <TouchableOpacity onPress={onOpenHistory} style={styles.iconButton}>
            <History color="#CCC" size={20} />
          </TouchableOpacity>
        )}
        {showMenu && (
          <TouchableOpacity onPress={onOpenMenu} style={styles.iconButton}>
            <Menu color="#CCC" size={20} />
          </TouchableOpacity>
        )}
        {rightComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1e1e1e",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 50,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#CCC",
    marginLeft: 6,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
    marginLeft: -4,
  },
});
