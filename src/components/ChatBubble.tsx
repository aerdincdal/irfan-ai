import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react-native";

interface ChatBubbleProps {
  message: string;
  type: "user" | "ai";
  timestamp?: string;
  citations?: string[];
}

export const ChatBubble = ({ message, type, timestamp, citations }: ChatBubbleProps) => {
  const isUser = type === "user";
  const [showCitations, setShowCitations] = useState(false);

  return (
    <View style={[styles.container, isUser ? styles.justifyEnd : styles.justifyStart]}>
      <View style={styles.bubbleWrapper}>
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
          <Text style={styles.messageText}>{message}</Text>
        </View>

        {/* Citations Section - Only for AI messages */}
        {!isUser && citations && citations.length > 0 && (
          <View style={styles.citationsContainer}>
            <TouchableOpacity
              style={styles.citationsHeader}
              onPress={() => setShowCitations(!showCitations)}
            >
              <View style={styles.citationsHeaderLeft}>
                <BookOpen size={12} color="#F2AE30" />
                <Text style={styles.citationsHeaderText}>
                  {citations.length} Kaynak
                </Text>
              </View>
              {showCitations ? (
                <ChevronUp size={14} color="#888" />
              ) : (
                <ChevronDown size={14} color="#888" />
              )}
            </TouchableOpacity>

            {showCitations && (
              <View style={styles.citationsList}>
                {citations.map((citation, index) => {
                  // Parse citation format: "source.pdf#chunk_123"
                  const parts = citation.split("#");
                  const source = parts[0] || citation;
                  const chunkId = parts[1] || "";

                  return (
                    <View key={index} style={styles.citationItem}>
                      <Text style={styles.citationBullet}>•</Text>
                      <View style={styles.citationContent}>
                        <Text style={styles.citationSource}>{source}</Text>
                        {chunkId && (
                          <Text style={styles.citationChunk}>({chunkId})</Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {timestamp && <Text style={styles.timestamp}>{timestamp}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 12,
    flexDirection: "row",
  },
  justifyEnd: {
    justifyContent: "flex-end",
  },
  justifyStart: {
    justifyContent: "flex-start",
  },
  bubbleWrapper: {
    flexDirection: "column",
    maxWidth: "85%",
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    minWidth: 40,
    flexShrink: 1,
  },
  bubbleUser: {
    backgroundColor: "#F2AE30",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  bubbleAI: {
    backgroundColor: "#1e1e1e",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: "#333",
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#FFF",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  timestamp: {
    fontSize: 10,
    color: "#666",
    paddingHorizontal: 4,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  citationsContainer: {
    marginTop: 8,
    backgroundColor: "#0a0a0a",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#222",
    overflow: "hidden",
  },
  citationsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  citationsHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  citationsHeaderText: {
    fontSize: 11,
    color: "#F2AE30",
    fontWeight: "600",
  },
  citationsList: {
    paddingHorizontal: 10,
    paddingBottom: 8,
    gap: 6,
  },
  citationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  citationBullet: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  citationContent: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
    gap: 4,
  },
  citationSource: {
    fontSize: 11,
    color: "#AAA",
    lineHeight: 16,
  },
  citationChunk: {
    fontSize: 10,
    color: "#666",
    fontStyle: "italic",
  },
});
