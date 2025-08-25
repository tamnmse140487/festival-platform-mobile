import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../components/ui";
import { FestivalImageGallery } from "../../components/festival/FestivalImageGallery";
import { FestivalMenuItems } from "../../components/festival/FestivalMenuItems";
import { FestivalMapSection } from "../../components/festival/FestivalMapSection";
import { festivalService } from "../../services/festivalService";
import { festivalParticipantsService } from "../../services/festivalParticipantsService";
import { Festival } from "../../types";
import { Colors } from "../../constants/Colors";
import { useAuth } from "@/context/AuthContext";

export default function FestivalDetailScreen() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [festival, setFestival] = useState<Festival | null>(null);
  const [loading, setLoading] = useState(true);
  const [isParticipating, setIsParticipating] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  useEffect(() => {
    loadFestival();
    // checkParticipationStatus();
  }, [id]);

  const loadFestival = async () => {
    if (!id) return;

    try {
      const data = await festivalService.getFestivalById(parseInt(id));
      setFestival(data);
    } catch (error) {
      console.error("Failed to load festival:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkParticipationStatus = async () => {
    if (!user?.id) return;

    try {
      const result =
        await festivalParticipantsService.getFestivalParticipantsByAccountId(
          parseInt(id),
          user.id
        );
      setIsParticipating(result);
    } catch (error) {
      console.error("Failed to check participation status:", error);
    }
  };

  const handleRegistrationToggle = async () => {
    if (!user?.id || !id) {
      Alert.alert("Vui lòng đăng nhập để tham gia lễ hội");
      return;
    }

    setRegistrationLoading(true);

    try {
      if (isParticipating) {
        const result =
          await festivalParticipantsService.deleteFestivalParticipant(
            parseInt(id),
            user.id
          );

        if (result) {
          setIsParticipating(false);
          Alert.alert("Thành công", "Đã hủy tham gia lễ hội thành công!");
        } else {
          Alert.alert("Lỗi", "Không thể hủy tham gia lễ hội");
        }
      } else {
        const result =
          await festivalParticipantsService.createFestivalParticipant(
            parseInt(id),
            user.id
          );

        if (result) {
          setIsParticipating(true);
          Alert.alert("Thành công", "Đăng ký tham gia lễ hội thành công!");
        } else {
          Alert.alert("Lỗi", "Không thể đăng ký tham gia lễ hội");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setRegistrationLoading(false);
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "#059669";
      case "draft":
        return "#6B7280";
      case "completed":
        return "#0284C7";
      case "cancelled":
        return "#DC2626";
      default:
        return "#D97706";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "published":
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

    if (festival.status !== "published") {
      return { canRegister: false, message: "Lễ hội chưa mở đăng ký" };
    }

    if (now < registrationStart) {
      return {
        canRegister: false,
        message: `Chưa tới thời gian đăng ký (từ ${formatDate(
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

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.icon }]}>
          Đang tải thông tin lễ hội...
        </Text>
      </View>
    );
  }

  if (!festival) {
    return (
      <View
        style={[styles.errorContainer, { backgroundColor: colors.background }]}
      >
        <Ionicons name="alert-circle-outline" size={64} color={colors.icon} />
        <Text style={[styles.errorText, { color: colors.text }]}>
          Không tìm thấy thông tin lễ hội
        </Text>
      </View>
    );
  }

  const registrationStatus = getRegistrationStatus();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <FestivalImageGallery
        images={festival.images}
        activeIndex={activeImageIndex}
        onIndexChange={setActiveImageIndex}
      />

      <View style={styles.content}>
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
            onPress={handleRegistrationToggle}
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
                    ? "Hủy tham gia lễ hội"
                    : "Đăng ký tham gia lễ hội"}
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

        <FestivalMenuItems menus={festival.festivalMenus} />

        <FestivalMapSection maps={festival.festivalMaps} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
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
