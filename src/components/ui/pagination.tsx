import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react-native";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
 
  const pages = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "ellipsis", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(
        1,
        "ellipsis",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pages.push(
        1,
        "ellipsis",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "ellipsis",
        totalPages
      );
    }
  }

  return (
    <View
      style={styles.container}
      accessibilityRole={"navigation" as any}
      accessibilityLabel="Pagination Navigation"
    >
      <TouchableOpacity
        style={[styles.button, currentPage === 1 && styles.disabled]}
        onPress={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        accessibilityLabel="Go to previous page"
      >
        <ChevronLeft color={currentPage === 1 ? "#999" : "#000"} size={20} />
        <Text style={[styles.buttonText, currentPage === 1 && styles.disabledText]}>
          Previous
        </Text>
      </TouchableOpacity>

      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <View key={`ellipsis-${index}`} style={styles.ellipsis}>
            <MoreHorizontal color="#666" size={20} />
          </View>
        ) : (
          <TouchableOpacity
            key={page}
            style={[styles.pageItem, page === currentPage && styles.activePage]}
            onPress={() => onPageChange(Number(page))}
            accessibilityRole="button"
            accessibilityState={{ selected: page === currentPage }}
            accessibilityLabel={
              page === currentPage
                ? `Current page, page ${page}`
                : `Go to page ${page}`
            }
          >
            <Text style={[styles.pageText, page === currentPage && styles.activePageText]}>
              {page}
            </Text>
          </TouchableOpacity>
        )
      )}

      <TouchableOpacity
        style={[styles.button, currentPage === totalPages && styles.disabled]}
        onPress={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        accessibilityLabel="Go to next page"
      >
        <Text style={[styles.buttonText, currentPage === totalPages && styles.disabledText]}>
          Next
        </Text>
        <ChevronRight color={currentPage === totalPages ? "#999" : "#000"} size={20} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#eee",
    marginRight: 8,
  },
  buttonText: {
    marginHorizontal: 4,
    fontSize: 14,
    color: "#000",
  },
  disabled: {
    backgroundColor: "#ddd",
  },
  disabledText: {
    color: "#999",
  },
  pageItem: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    marginRight: 8,
  },
  pageText: {
    fontSize: 14,
    color: "#000",
  },
  activePage: {
    backgroundColor: "#2563eb", 
  },
  activePageText: {
    color: "white",
    fontWeight: "bold",
  },
  ellipsis: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
});
