import React, { useState } from "react"
import { View, Text, TouchableOpacity, Modal, StyleSheet, Pressable } from "react-native"
import { ChevronRight, Check, Circle } from "lucide-react-native"

type MenuItem = {
  label: string
  onPress: () => void
  checked?: boolean
  isRadio?: boolean
  disabled?: boolean
  submenu?: MenuItem[]
}

type MenubarProps = {
  menuItems: MenuItem[]
}

export function Menubar({ menuItems }: MenubarProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  const openMenu = (index: number) => {
    setOpenIndex(index)
    setModalVisible(true)
  }

  const closeMenu = () => {
    setModalVisible(false)
    setOpenIndex(null)
  }

  return (
    <View style={styles.container}>
      {menuItems.map((item, i) => (
        <TouchableOpacity
          key={i}
          style={styles.trigger}
          onPress={() => openMenu(i)}
          disabled={item.disabled}
        >
          <Text style={[styles.triggerText, item.disabled && styles.disabled]}>{item.label}</Text>
          <ChevronRight size={16} />
        </TouchableOpacity>
      ))}

      <Modal transparent visible={modalVisible} animationType="fade" onRequestClose={closeMenu}>
        <Pressable style={styles.backdrop} onPress={closeMenu} />
        <View style={styles.menuContent}>
          {openIndex !== null &&
            menuItems[openIndex]?.submenu?.map((subItem, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.menuItem, subItem.disabled && styles.disabled]}
                onPress={() => {
                  if (!subItem.disabled) {
                    subItem.onPress()
                    closeMenu()
                  }
                }}
                disabled={subItem.disabled}
              >
                {subItem.isRadio && (
                  <View style={styles.iconContainer}>
                    {subItem.checked ? <Circle size={12} fill="black" /> : <Circle size={12} />}
                  </View>
                )}
                {subItem.checked && !subItem.isRadio && (
                  <View style={styles.iconContainer}>
                    <Check size={16} />
                  </View>
                )}
                <Text style={styles.menuText}>{subItem.label}</Text>
              </TouchableOpacity>
            ))}
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    padding: 8,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: "#eee",
    borderRadius: 4,
  },
  triggerText: {
    marginRight: 4,
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  menuContent: {
    position: "absolute",
    top: 50,
    left: 10,
    backgroundColor: "white",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  menuText: {
    fontSize: 16,
  },
  iconContainer: {
    marginRight: 8,
  },
})
