import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Image,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../ui";
import { apiService } from "../../services/apiService";
import { Colors } from "../../constants/Colors";
import { FestivalBasic, FestivalImage, School } from "../../types";

interface FestivalCardProps {
  festival: FestivalBasic;
  onPress: () => void;
}

export const FestivalCard: React.FC<FestivalCardProps> = ({
  festival,
  onPress,
}) => {
  const [festivalImage, setFestivalImage] = useState<string>("");
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const defaultImage =
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const [imagesResponse, schoolResponse] = await Promise.all([
          apiService.getFestivalImages(festival.festivalId) as Promise<
            FestivalImage[]
          >,
          apiService.getSchoolById(festival.schoolId) as Promise<School[]>,
        ]);

        if (!isMounted) return;

        if (imagesResponse?.length)
          setFestivalImage(imagesResponse[0].imageUrl);
        if (schoolResponse?.length) setSchool(schoolResponse[0]);
      } catch (error) {
        console.error("Failed to load festival data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [festival.festivalId, festival.schoolId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

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

  const Skeleton = ({
    height,
    width,
    radius = 6,
  }: {
    height: number;
    width: number | string;
    radius?: number;
  }) => (
    <View
      style={{
        height,
        width: typeof width === "string" ? undefined : width,
        borderRadius: radius,
        backgroundColor:
          colorScheme === "dark" ? "rgba(255,255,255,0.08)" : "#eee",
        ...(typeof width === "string" ? { alignSelf: "stretch" } : {}),
      }}
    />
  );

  return (
    <Card onPress={onPress} style={styles.container}>
      <View style={styles.imageContainer}>
        {loading ? (
          <View style={styles.imageSkeleton} />
        ) : (
          <Image
            source={{ uri: festivalImage || defaultImage }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        {loading && (
          <View style={styles.loadingOverlay}>
            <View
              style={[
                styles.loadingIndicator,
                { backgroundColor: "rgba(0,0,0,0.35)" },
              ]}
            >
              <ActivityIndicator size="small" color="#fff" />
            </View>
          </View>
        )}

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.imageOverlay}
        >
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
        </LinearGradient>
      </View>

      <View style={styles.content}>
        {loading ? (
          <>
            <Skeleton height={20} width="75%" />
            <View style={{ height: 8 }} />
            <Skeleton height={14} width="50%" />
          </>
        ) : (
          <>
            <Text
              style={[styles.title, { color: colors.text }]}
              numberOfLines={2}
            >
              {festival.festivalName}
            </Text>
            <Text
              style={[styles.theme, { color: colors.icon }]}
              numberOfLines={1}
            >
              {festival.theme}
            </Text>
          </>
        )}

        {loading ? (
          <View
            style={[
              styles.schoolContainer,
              { backgroundColor: colors.secondary },
            ]}
          >
            <View style={styles.schoolContent}>
              <Skeleton height={28} width={28} radius={14} />
              <View style={{ width: 8 }} />
              <View style={{ flex: 1 }}>
                <Skeleton height={12} width="70%" />
                <View style={{ height: 6 }} />
                <Skeleton height={10} width="55%" />
              </View>
            </View>
          </View>
        ) : (
          school && (
            <View
              style={[
                styles.schoolContainer,
                { backgroundColor: colors.secondary },
              ]}
            >
              <View style={styles.schoolContent}>
                {school.logoUrl ? (
                  <Image
                    source={{ uri: school.logoUrl }}
                    style={styles.schoolLogo}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={[
                      styles.schoolLogoPlaceholder,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Ionicons name="school" size={14} color="#FFFFFF" />
                  </View>
                )}
                <View style={styles.schoolInfo}>
                  <Text
                    style={[styles.schoolName, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {school.schoolName}
                  </Text>
                  <Text
                    style={[styles.schoolAddress, { color: colors.icon }]}
                    numberOfLines={1}
                  >
                    {school.address}
                  </Text>
                </View>
              </View>
            </View>
          )
        )}

        <View style={styles.detailsSection}>
          {loading ? (
            <>
              <Skeleton height={12} width="60%" />
              <View style={{ height: 8 }} />
              <Skeleton height={12} width="70%" />
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={colors.icon}
                />
                <Text style={[styles.infoText, { color: colors.icon }]}>
                  {formatDate(festival.startDate)} -{" "}
                  {formatDate(festival.endDate)}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={colors.icon}
                />
                <Text
                  style={[styles.infoText, { color: colors.icon }]}
                  numberOfLines={1}
                >
                  {festival.location}
                </Text>
              </View>
            </>
          )}
        </View>

        {loading ? (
          <View
            style={[styles.statsContainer, { borderTopColor: colors.border }]}
          >
            <Skeleton height={18} width="25%" />
            <View
              style={[styles.statDivider, { backgroundColor: colors.border }]}
            />
            <Skeleton height={18} width="25%" />
          </View>
        ) : (
          <View
            style={[styles.statsContainer, { borderTopColor: colors.border }]}
          >
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {festival.registeredFoodBooths}/{festival.maxFoodBooths}
              </Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>
                Gian hàng ăn
              </Text>
            </View>

            <View
              style={[styles.statDivider, { backgroundColor: colors.border }]}
            />

            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {festival.registeredBeverageBooths}/{festival.maxBeverageBooths}
              </Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>
                Gian hàng uống
              </Text>
            </View>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: "hidden",
    padding: 0,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 200,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 12,
  },
  loadingOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  loadingIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 6,
    lineHeight: 24,
  },
  theme: {
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 12,
    lineHeight: 18,
  },
  schoolContainer: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  schoolContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  schoolLogo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  schoolLogoPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  schoolInfo: {
    flex: 1,
  },
  schoolName: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 1,
  },
  schoolAddress: {
    fontSize: 11,
  },
  detailsSection: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 13,
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    paddingTop: 12,
    borderTopWidth: 1,
  },
  imageSkeleton: {
    width: "100%",
    height: 200,
    backgroundColor: "#e0e0e0",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: 30,
    marginHorizontal: 16,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
    textAlign: "center",
  },
});
