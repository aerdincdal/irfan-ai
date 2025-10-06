import React, { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native"
import { Check, ChevronRight, Circle } from "lucide-react-native"

type MenuItem = {
  label: string
  onPress?: () => void
  checked?: boolean
  isRadio?: boolean
  disabled?: boolean
  submenu?: MenuItem[]
}

type DropdownMenuProps = {
  triggerLabel: string
  items: MenuItem[]
}

export function DropdownMenu({ triggerLabel, items }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const [submenuItems, setSubmenuItems] = useState<MenuItem[] | null>(null)

  const openSubmenu = (submenu: MenuItem[]) => {
    setSubmenuItems(submenu)
  }
  const closeSubmenu = () => setSubmenuItems(null)

  return (
    <View>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Text>{triggerLabel}</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => {
        setOpen(false)
        closeSubmenu()
      }}>
        <TouchableOpacity style={styles.backdrop} onPress={() => {
          setOpen(false)
          closeSubmenu()
        }} />

        <View style={styles.menu}>
          <ScrollView>
            {(submenuItems ?? items).map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.menuItem,
                  item.disabled && styles.disabled,
                ]}
                onPress={() => {
                  if (item.disabled) return
                  if (item.submenu) {
                    openSubmenu(item.submenu)
                  } else {
                    item.onPress?.()
                    setOpen(false)
                    closeSubmenu()
                  }
                }}
              >
                {item.isRadio && (
                  <View style={styles.icon}>
                    {item.checked ? <Circle size={14} fill="black" /> : <Circle size={14} />}
                  </View>
                )}
                {item.checked && !item.isRadio && (
                  <View style={styles.icon}>
                    <Check size={16} />
                  </View>
                )}
                <Text style={styles.menuText}>{item.label}</Text>
                {item.submenu && <ChevronRight size={16} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  trigger: {
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  menu: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    elevation: 4,
    maxHeight: "60%",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
  },
  disabled: {
    opacity: 0.4,
  },
  icon: {
    marginRight: 8,
  },
})
