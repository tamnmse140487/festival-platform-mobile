import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  useColorScheme,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { FestivalCard } from "../../components/festival/FestivalCard";
import { useAuth } from "../../context/AuthContext";
import { festivalService } from "../../services/festivalService";
import { FestivalBasic } from "../../types";
import { Colors } from "../../constants/Colors";
import { SkeletonLoader } from "@/components/loading/SkeletonLoader";

export default function HomeScreen() {
  const [festivals, setFestivals] = useState<FestivalBasic[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  useEffect(() => {
    loadFestivals();
  }, []);

  const loadFestivals = async () => {
    try {
      const data = await festivalService.getAllFestivals();
      setFestivals(data);
    } catch (error) {
      console.error("Failed to load festivals:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFestivals();
    setRefreshing(false);
  };

  const renderFestival = ({ item }: { item: FestivalBasic }) => (
    <FestivalCard
      festival={item}
      onPress={() => router.push(`/festival/${item.festivalId}`)}
    />
  );

  const renderHeader = () => (
    <SafeAreaView style={{ backgroundColor: colors.primary, paddingTop: 15 }}>
      <LinearGradient
        colors={[colors.primary, colors.accent]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Image
              source={require("../../assets/images/icon_food_festival.png")}
              style={styles.headerIcon}
            />
            <View style={styles.headerText}>
              <Text style={styles.appName}>Festival Platform</Text>
              <Text style={styles.subtitle}>Khám phá lễ hội ẩm thực</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/(auth)/login")}
          >
            {user ? (
              <View style={styles.userAvatar}>
                <Ionicons name="person" size={20} color="#FFFFFF" />
              </View>
            ) : (
              <View style={styles.loginButtonContent}>
                <Ionicons name="log-in-outline" size={20} color="#FFFFFF" />
                <Text style={styles.loginButtonText}>Đăng nhập</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );

  const renderStats = () => {
    const activeFestivals = festivals.filter(
      (f) => f.status === "published"
    ).length;
    const totalFestivals = festivals.length;

    return (
      <View
        style={[styles.statsContainer, { backgroundColor: colors.surface }]}
      >
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {activeFestivals}
          </Text>
          <Text style={[styles.statLabel, { color: colors.icon }]}>
            Đang diễn ra
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {totalFestivals}
          </Text>
          <Text style={[styles.statLabel, { color: colors.icon }]}>
            Tổng lễ hội
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={festivals}
        renderItem={renderFestival}
        keyExtractor={(item) => item.festivalId.toString()}
        ListHeaderComponent={
          <View>
            {renderHeader()}
            {renderStats()}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Các lễ hội hiện có
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerIcon: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  appName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginTop: 2,
  },
  loginButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  loginButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: -15,
    borderRadius: 12,
    padding: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
});
