import React from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../../components/ui";
import { Festival } from "../../../types";
import { Colors } from "../../../constants/Colors";

interface FestivalInfoProps {
  festival: Festival;
}

export const FestivalInfo: React.FC<FestivalInfoProps> = ({ festival }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons
            name="calendar-outline"
            size={20}
            color={colors.primary}
          />
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: colors.text }]}>
              Thời gian diễn ra
            </Text>
            <Text style={[styles.infoValue, { color: colors.icon }]}>
              {formatDate(festival.startDate)}
            </Text>
            <Text style={[styles.infoValue, { color: colors.icon }]}>
              đến {formatDate(festival.endDate)}
            </Text>
          </View>
        </View>

        <View
          style={[styles.infoDivider, { backgroundColor: colors.border }]}
        />

        <View style={styles.infoRow}>
          <Ionicons
            name="location-outline"
            size={20}
            color={colors.primary}
          />
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: colors.text }]}>
              Địa điểm
            </Text>
            <Text style={[styles.infoValue, { color: colors.icon }]}>
              {festival.location}
            </Text>
          </View>
        </View>

        <View
          style={[styles.infoDivider, { backgroundColor: colors.border }]}
        />

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={20} color={colors.primary} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: colors.text }]}>
              Thời gian đăng ký
            </Text>
            <Text style={[styles.infoValue, { color: colors.icon }]}>
              Từ {formatDate(festival.registrationStartDate)}
            </Text>
            <Text style={[styles.infoValue, { color: colors.icon }]}>
              đến {formatDate(festival.registrationEndDate)}
            </Text>
          </View>
        </View>
      </Card>

      <Card style={styles.descriptionCard}>
        <Text style={[styles.descriptionTitle, { color: colors.text }]}>
          Mô tả lễ hội
        </Text>
        <Text style={[styles.description, { color: colors.icon }]}>
          {festival.description}
        </Text>
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoDivider: {
    height: 1,
    marginLeft: 32,
  },
  descriptionCard: {
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
});