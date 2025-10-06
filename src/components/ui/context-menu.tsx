
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from "react-native";

type MenuItem = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

interface ContextMenuProps {
  triggerLabel: string;
  menuItems: MenuItem[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({ triggerLabel, menuItems }) => {
  const [visible, setVisible] = useState(false);

  function openMenu() {
    setVisible(true);
  }
  function closeMenu() {
    setVisible(false);
  }

  function onItemPress(action: () => void) {
    action();
    closeMenu();
  }

  return (
    <View>
      <TouchableOpacity onPress={openMenu} style={styles.triggerButton}>
        <Text style={styles.triggerText}>{triggerLabel}</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <Pressable style={styles.overlay} onPress={closeMenu} />

        <View style={styles.menuContainer}>
          {menuItems.map(({ label, onPress, disabled }, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => !disabled && onItemPress(onPress)}
              disabled={disabled}
              style={[styles.menuItem, disabled && styles.menuItemDisabled]}
            >
              <Text style={[styles.menuItemText, disabled && styles.disabledText]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  triggerButton: {
    padding: 12,
    backgroundColor: "#4f46e5", // Mor ton
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  triggerText: {
    color: "white",
    fontWeight: "600",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  menuContainer: {
    position: "absolute",
    top: 100,
    left: 20,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 8,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemDisabled: {
    opacity: 0.4,
  },
  menuItemText: {
    fontSize: 16,
  },
  disabledText: {
    color: "#999",
  },
});

export { ContextMenu };
