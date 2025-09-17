import React from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { Festival } from "../../../types";
import { Colors } from "../../../constants/Colors";

interface FestivalHeaderProps {
  festival: Festival;
}

export const FestivalHeader: React.FC<FestivalHeaderProps> = ({ festival }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "#166534";
      case "ongoing":
        return "#1E40AF";
      case "draft":
        return "#1F2937";
      case "completed":
        return "#5B21B6";
      case "cancelled":
        return "#991B1B";
      default:
        return "#D3D3D3";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "published":
        return "Đang công bố";
      case "ongoing":
        return "Đang diễn ra";
      case "draft":
        return "Bản nháp";
      case "completed":
        return "Đã kết thúc";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  return (
    <View style={styles.titleSection}>
      <Text style={[styles.title, { color: colors.text }]}>
        {festival.festivalName}
      </Text>
      <Text style={[styles.theme, { color: colors.icon }]}>
        {festival.theme}
      </Text>
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(festival.status) },
        ]}
      >
        <Text style={styles.statusText}>
          {getStatusText(festival.status)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
    lineHeight: 34,
  },
  theme: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 12,
    lineHeight: 22,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});