import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Search } from "lucide-react-native";

interface CommandItem {
  id: string;
  label: string;
  shortcut?: string;
  onSelect: () => void;
}

interface CommandDialogProps {
  visible: boolean;
  onClose: () => void;
  data: CommandItem[];
}

export const CommandDialog = ({ visible, onClose, data }: CommandDialogProps) => {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState<CommandItem[]>(data);

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter((item) =>
          item.label.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  }, [query, data]);

  const renderItem = ({ item }: { item: CommandItem }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        item.onSelect();
        onClose();
      }}
      activeOpacity={0.7}
    >
      <Text style={styles.itemLabel}>{item.label}</Text>
      {item.shortcut && (
        <Text style={styles.itemShortcut}>{item.shortcut}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.overlay} />

        <View style={styles.dialog}>
          <View style={styles.inputWrapper}>
            <Search color="#888" size={20} />
            <TextInput
              placeholder="Search commands..."
              style={styles.input}
              value={query}
              onChangeText={setQuery}
              autoFocus
              placeholderTextColor="#888"
              clearButtonMode="while-editing"
            />
          </View>

          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No results found.</Text>
            }
            keyboardShouldPersistTaps="handled"
            style={styles.list}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  dialog: {
    width: "90%",
    maxHeight: "70%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 10,
    zIndex: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  list: {
    maxHeight: 300,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  itemLabel: {
    fontSize: 16,
    color: "#333",
  },
  itemShortcut: {
    fontSize: 12,
    color: "#888",
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    paddingVertical: 20,
    color: "#888",
  },
});
