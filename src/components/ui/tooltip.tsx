import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  sideOffset?: number;
}

export function Tooltip({
  children,
  content,
  sideOffset = 8,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [triggerLayout, setTriggerLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const showTooltip = () => setVisible(true);
  const hideTooltip = () => setVisible(false);

  return (
    <>
      <Pressable
        onPressIn={showTooltip}
        onPressOut={hideTooltip}
        onLayout={(e) => setTriggerLayout(e.nativeEvent.layout)}
      >
        {children}
      </Pressable>

      <Modal transparent visible={visible} onRequestClose={hideTooltip}>
        <TouchableWithoutFeedback onPress={hideTooltip}>
          <View style={styles.modalOverlay}>
            {triggerLayout && (
              <View
                style={[
                  styles.tooltipContainer,
                  {
                    top: triggerLayout.y - sideOffset - 40,
                    left: Math.min(
                      triggerLayout.x,
                      Dimensions.get("window").width - 200
                    ),
                  },
                ]}
              >
                <Text style={styles.tooltipText}>{content}</Text>
                <View style={styles.tooltipArrow} />
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  tooltipContainer: {
    position: "absolute",
    maxWidth: 200,
    backgroundColor: "#333",
    borderRadius: 6,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipText: {
    color: "#fff",
    fontSize: 14,
  },
  tooltipArrow: {
    position: "absolute",
    bottom: -6,
    left: 12,
    width: 12,
    height: 6,
    backgroundColor: "transparent",
    borderTopWidth: 6,
    borderTopColor: "#333",
    borderLeftWidth: 6,
    borderLeftColor: "transparent",
    borderRightWidth: 6,
    borderRightColor: "transparent",
  },
});
