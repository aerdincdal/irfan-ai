import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from "react-native";
import { Feather } from "@expo/vector-icons";


if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type AccordionItemProps = {
  title: string;
  children: React.ReactNode;
};

export function AccordionItem({ title, children }: AccordionItemProps) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    // layout animasyonunu çalıştır
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [open]);

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setOpen(!open)}
        style={styles.header}
      >
        <Text style={styles.headerText}>{title}</Text>
        <Feather
          name="chevron-down"
          size={20}
          style={[
            styles.icon,
            open && { transform: [{ rotate: "180deg" }] },
          ]}
        />
      </TouchableOpacity>

      {open && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerText: {
    fontWeight: "600",
    fontSize: 16,
  },
  icon: {
    color: "#333",
    
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
});
