import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Platform,
} from "react-native";
import { X, ChevronDown, Check } from "lucide-react-native";


interface SelectProps<T> {
  options: T[];
  selectedValue: T | null;
  onValueChange: (value: T) => void;
  placeholder?: string;
  label?: string;
  keyExtractor: (item: T) => string;
  renderLabel?: (item: T) => React.ReactNode;
  disabled?: boolean;
}

export function Select<T>({
  options,
  selectedValue,
  onValueChange,
  placeholder = "Seçiniz",
  label,
  keyExtractor,
  renderLabel,
  disabled,
}: SelectProps<T>) {
  const [modalVisible, setModalVisible] = useState(false);

  const onSelect = (item: T) => {
    onValueChange(item);
    setModalVisible(false);
  };

  const displayLabel = selectedValue
    ? renderLabel
      ? renderLabel(selectedValue)
      : String(selectedValue)
    : placeholder;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[styles.trigger, disabled && styles.disabled]}
        onPress={() => !disabled && setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text
          numberOfLines={1}
          style={[styles.triggerText, !selectedValue && styles.placeholder]}
        >
          {displayLabel}
        </Text>
        <ChevronDown size={20} color={disabled ? "#ccc" : "#000"} />
      </TouchableOpacity>

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        />

        <View style={styles.modalContent}>
          <FlatList
            data={options}
            keyExtractor={keyExtractor}
            keyboardShouldPersistTaps="handled"
            style={{ maxHeight: 300 }}
            renderItem={({ item }) => {
              const isSelected = selectedValue === item;
              return (
                <TouchableOpacity
                  style={[
                    styles.item,
                    isSelected && styles.itemSelected,
                  ]}
                  onPress={() => onSelect(item)}
                >
                  <Text
                    style={[
                      styles.itemText,
                      isSelected && styles.itemTextSelected,
                    ]}
                  >
                    {renderLabel ? renderLabel(item) : String(item)}
                  </Text>
                  {isSelected && <Check size={18} color="#336699" />}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 40,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  triggerText: {
    fontSize: 14,
    color: "#000",
    flex: 1,
  },
  placeholder: {
    color: "#888",
  },
  disabled: {
    backgroundColor: "#eee",
    borderColor: "#ddd",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000066",
  },
  modalContent: {
    position: "absolute",
    top: Platform.OS === "ios" ? 90 : 70,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemSelected: {
    backgroundColor: "#e1e7f9",
  },
  itemText: {
    fontSize: 14,
    color: "#000",
  },
  itemTextSelected: {
    fontWeight: "700",
    color: "#336699",
  },
});
