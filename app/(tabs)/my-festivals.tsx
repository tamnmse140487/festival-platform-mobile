import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  useColorScheme,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { festivalParticipantsService } from "../../services/festivalParticipantsService";
import { FestivalBasic } from "../../types";
import { FestivalCard } from "../../components/festival/FestivalCard";
import { Colors } from "../../constants/Colors";
import { router } from "expo-router";

const ORDER: Record<"published" | "ongoing" | "completed", number> = {
  published: 0,
  ongoing: 1,
  completed: 2,
};

export default function MyFestivalsScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [data, setData] = useState<FestivalBasic[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const loadData = async () => {
    if (!user?.id) {
      setData([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);

      // gọi service, backend trả về mảng participant
      const list: any[] =
        await festivalParticipantsService.getMyParticipatingFestivals(user.id);

      // map sang festival object
      const festivals: FestivalBasic[] = (Array.isArray(list) ? list : [])
        .map((p: any) => p.festival)
        .filter(Boolean);

      // lọc status
      const filtered = festivals.filter((f) =>
        ["published", "ongoing", "completed"].includes(f.status as any)
      );

      // sort
      const sorted = filtered.sort(
        (a, b) =>
          (ORDER[a.status as keyof typeof ORDER] ?? 99) -
          (ORDER[b.status as keyof typeof ORDER] ?? 99)
      );

      setData(sorted);
    } catch (e) {
      console.error("Load my festivals error:", e);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: FestivalBasic }) => (
    <FestivalCard
      festival={item}
      onPress={() => router.push(`/festival/${item.festivalId}`)}
    />
  );

  const Empty = useMemo(
    () => (
      <View style={styles.emptyBox}>
        <Text style={[styles.emptyText, { color: colors.icon }]}>
          Bạn chưa đăng ký tham gia lễ hội nào.
        </Text>
      </View>
    ),
    [colors.icon]
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>
          Lễ hội đã đăng ký
        </Text>

        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.festivalId.toString()}
          ListEmptyComponent={!loading ? Empty : null}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: 20, minHeight: 200 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: 20,
    flex: 1,
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 12,
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
  },
});
