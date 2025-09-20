import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Festival } from "../../../types";
import { Colors } from "../../../constants/Colors";

interface FestivalRegistrationProps {
  festival: Festival;
  isParticipating: boolean;
  registrationLoading: boolean;
  onToggleRegistration: () => void;
}

export const FestivalRegistration: React.FC<FestivalRegistrationProps> = ({
  festival,
  isParticipating,
  registrationLoading,
  onToggleRegistration,
}) => {
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

  const canRegister = () => {
    if (!festival) return false;
    const now = new Date();
    const registrationStart = new Date(festival.registrationStartDate);
    const registrationEnd = new Date(festival.registrationEndDate);
    return (
      festival.status === "published" &&
      now >= registrationStart &&
      now <= registrationEnd
    );
  };

  const getRegistrationStatus = () => {
    if (!festival) return { canRegister: false, message: "" };

    const now = new Date();
    const registrationStart = new Date(festival.registrationStartDate);
    const registrationEnd = new Date(festival.registrationEndDate);

    if (now < registrationStart) {
      return {
        canRegister: false,
        message: `Chưa tới thời gian quan tâm (từ ${formatDate(
          festival.registrationStartDate
        )})`,
      };
    }

    if (now > registrationEnd) {
      return {
        canRegister: false,
        message: `Đã hết thời gian đăng ký (đến ${formatDate(
          festival.registrationEndDate
        )})`,
      };
    }

    return { canRegister: true, message: "" };
  };

  const registrationStatus = getRegistrationStatus();

  return (
    <View style={styles.registrationSection}>
      <TouchableOpacity
        style={[
          styles.registrationButton,
          {
            backgroundColor: isParticipating
              ? colors.error
              : colors.primary,
            opacity:
              !registrationStatus.canRegister && !isParticipating ? 0.5 : 1,
          },
        ]}
        onPress={onToggleRegistration}
        disabled={
          registrationLoading ||
          (!registrationStatus.canRegister && !isParticipating)
        }
      >
        {registrationLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <View style={styles.buttonContent}>
            <Ionicons
              name={isParticipating ? "close-circle" : "checkmark-circle"}
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.registrationButtonText}>
              {isParticipating
                ? "Bỏ quan tâm lễ hội"
                : "Quan tâm lễ hội"}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {!registrationStatus.canRegister &&
        !isParticipating &&
        registrationStatus.message && (
          <View
            style={[
              styles.registrationNotice,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={colors.icon}
            />
            <Text
              style={[
                styles.registrationNoticeText,
                { color: colors.icon },
              ]}
            >
              {registrationStatus.message}
            </Text>
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  registrationSection: {
    marginBottom: 20,
  },
  registrationButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  registrationButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  registrationNotice: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  registrationNoticeText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
});