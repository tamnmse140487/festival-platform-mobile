import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FestivalImageGallery } from "../../components/festival/detail/FestivalImageGallery";
import { FestivalMenuItems } from "../../components/festival/detail/FestivalMenuItems";
import { FestivalMapSection } from "../../components/festival/detail/FestivalMapSection";
import { FestivalHeader } from "../../components/festival/detail/FestivalHeader";
import { FestivalRegistration } from "../../components/festival/detail/FestivalRegistration";
import { FestivalInfo } from "../../components/festival/detail/FestivalInfo";
import { FestivalReviewForm } from "../../components/festival/detail/FestivalReviewForm";
import { festivalService } from "../../services/festivalService";
import { festivalParticipantsService } from "../../services/festivalParticipantsService";
import { reviewsService } from "../../services/reviewsService";
import { Festival } from "../../types";
import { Colors } from "../../constants/Colors";
import { useAuth } from "@/context/AuthContext";
import { StarRating } from "../../components/festival/detail/StarRating";
import { useLocalSearchParams } from "expo-router";
import { apiService } from "@/services/apiService";
type UserInfo = { fullName: string; avatarUrl?: string };

export default function FestivalDetailScreen() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [festival, setFestival] = useState<Festival | null>(null);
  const [loading, setLoading] = useState(true);
  const [isParticipating, setIsParticipating] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [userMap, setUserMap] = useState<Record<number, UserInfo>>({});

  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [myReview, setMyReview] = useState<any | null>(null);
  const [ratingInput, setRatingInput] = useState<number>(0);
  const [commentInput, setCommentInput] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  useEffect(() => {
    loadFestival();
    checkParticipationStatus();
    loadReviews();
  }, [id, user?.id]);

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

  const hydrateUserNames = async (items: any[]) => {
    const needIds = Array.from(new Set(items.map((r) => r.accountId))).filter(
      (id) => !userMap[id]
    );

    if (needIds.length === 0) return;

    try {
      const chunks = await Promise.all(
        needIds.map(async (id) => {
          const userDataResponse = (await apiService.getUserById(id)) as UserInfo[];
          const userData = userDataResponse?.[0];
          return userData
            ? ([
                id,
                { fullName: userData.fullName, avatarUrl: userData.avatarUrl },
              ] as const)
            : ([id, { fullName: `User #${id}` }] as const);
        })
      );

      setUserMap((prev) => {
        const next = { ...prev };
        for (const [id, info] of chunks) next[id] = info;
        return next;
      });
    } catch (e) {
      setUserMap((prev) => {
        const next = { ...prev };
        for (const id of needIds)
          if (!next[id]) next[id] = { fullName: `User #${id}` };
        return next;
      });
      console.error("hydrateUserNames error:", e);
    }
  };

  const loadReviews = async () => {
    if (!id) return;
    setReviewsLoading(true);
    try {
      const res: any = await reviewsService.getByFestivalId(parseInt(id));
      const list = res?.data ?? res ?? [];
      setReviews(list);

      hydrateUserNames(list);

      if (user?.id) {
        const mine = list.find((r: any) => r.accountId === user.id);
        setMyReview(mine || null);
        if (mine) {
          setRatingInput(mine.rating);
          setCommentInput(mine.comment ?? "");
        } else {
          setRatingInput(0);
          setCommentInput("");
        }
      }
    } catch (e) {
      console.error("Failed to load reviews:", e);
    } finally {
      setReviewsLoading(false);
    }
  };

  const checkParticipationStatus = async () => {
    if (!user?.id || !id) return;
    try {
      const result =
        await festivalParticipantsService.getFestivalParticipantsByAccIdAndFeslId(
          parseInt(id),
          user.id
        );
      setIsParticipating(result.length > 0);
    } catch (error) {
      console.error("Failed to check participation status:", error);
    }
  };

  const handleRegistrationToggle = async () => {
    if (!user?.id || !id) {
      Alert.alert("Vui lòng đăng nhập để quan tâm lễ hội");
      return;
    }
    setRegistrationLoading(true);
    try {
      if (isParticipating) {
        const ok = await festivalParticipantsService.deleteFestivalParticipant(
          parseInt(id),
          user.id
        );
        if (ok) setIsParticipating(false);
        else Alert.alert("Lỗi", "Không thể bỏ quan tâm lễ hội");
      } else {
        const res = await festivalParticipantsService.createFestivalParticipant(
          parseInt(id),
          user.id
        );
        if (res?.success === false) Alert.alert("Lỗi", `${res?.detail}`);
        else setIsParticipating(true);
      }
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user?.id || !id) {
      Alert.alert("Vui lòng đăng nhập để viết đánh giá");
      return;
    }
    if (!ratingInput || ratingInput < 1) {
      Alert.alert("Vui lòng chọn số sao (ít nhất 1)");
      return;
    }
    setSubmitting(true);
    try {
      if (editing && myReview) {
        const res: any = await reviewsService.update({
          reviewId: myReview.id ?? myReview.reviewId,
          rating: ratingInput,
          comment: commentInput,
        });
        if (res?.success === false)
          throw new Error(res?.message || "Update failed");
        Alert.alert("Thành công", "Đã cập nhật đánh giá");
      } else {
        const res: any = await reviewsService.create({
          festivalId: parseInt(id),
          accountId: user.id,
          rating: ratingInput,
          comment: commentInput,
        });
        if (res?.success === false)
          throw new Error(res?.message || "Create failed");
        Alert.alert("Thành công", "Đã gửi đánh giá");
      }
      setEditing(false);
      await loadReviews();
    } catch (e: any) {
      console.error("Submit review error:", e);
      Alert.alert("Lỗi", e?.message || "Không thể gửi đánh giá");
    } finally {
      setSubmitting(false);
    }
  };

  const startEditMyReview = () => {
    if (!myReview) return;
    setRatingInput(myReview.rating);
    setCommentInput(myReview.comment || "");
    setEditing(true);
  };

  const cancelEditReview = () => {
    setEditing(false);
    if (myReview) {
      setRatingInput(myReview.rating);
      setCommentInput(myReview.comment || "");
    } else {
      setRatingInput(0);
      setCommentInput("");
    }
  };

  const handleEditReview = (review: any) => {
    setMyReview(review);
    setRatingInput(review.rating);
    setCommentInput(review.comment || "");
    setEditing(true);
  };

  const handleDeleteMyReview = async () => {
    if (!myReview) return;
    Alert.alert("Xoá đánh giá", "Bạn chắc chắn muốn xoá đánh giá của mình?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            const res: any = await reviewsService.delete(
              myReview.id ?? myReview.reviewId
            );
            if (res?.success === false)
              throw new Error(res?.message || "Delete failed");
            Alert.alert("Đã xoá", "Đánh giá của bạn đã được xoá");
            setMyReview(null);
            setRatingInput(0);
            setCommentInput("");
            setEditing(false);
            await loadReviews();
          } catch (e: any) {
            console.error("Delete review error:", e);
            Alert.alert("Lỗi", e?.message || "Không thể xoá đánh giá");
          }
        },
      },
    ]);
  };

  const handleDeleteReview = (review: any) => {
    setMyReview(review);
    handleDeleteMyReview();
  };

  const reviewKeyExtractor = (item: any, index: number) =>
    String(
      item.reviewId ??
        item.id ??
        `${item.accountId}-${item.festivalId}-${
          item.updatedAt || item.createdAt || index
        }`
    );

  const formatVietnamTime = (input?: string | number | Date) => {
    const base = input ? new Date(input) : new Date();
    const t = base.getTime() + 7 * 60 * 60 * 1000;
    return new Date(t).toLocaleString("vi-VN", {
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
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

  const EditedBadge = ({ colors }: { colors: any }) => (
    <View
      style={{
        marginLeft: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 999,
        backgroundColor: colors.warningSoftBg,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.warningSoftBorder,
      }}
    >
      <Text
        style={{
          fontSize: 10,
          fontWeight: "600",
          color: colors.warningSoftText,
        }}
      >
        Đã chỉnh sửa
      </Text>
    </View>
  );

  return (
    <FlatList
      data={reviews}
      keyExtractor={reviewKeyExtractor}
      contentContainerStyle={{
        paddingBottom: 24,
        backgroundColor: colors.background,
      }}
      renderItem={({ item: rv }) => (
        <View
          style={{
            marginHorizontal: 16,
            marginTop: 12,
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 12,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
            ...(colorScheme === "light"
              ? {
                  shadowColor: colors.shadow,
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 2,
                }
              : {}),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <StarRating value={rv.rating} readonly size={18} />
            <Text style={{ marginLeft: 8, color: colors.icon, fontSize: 12 }}>
              {formatVietnamTime(rv.updatedAt || rv.createdAt || Date.now())}
            </Text>
            {rv.isEdit ? <EditedBadge colors={colors} /> : null}
          </View>

          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
          >
            {userMap[rv.accountId]?.avatarUrl ? (
              <Image
                source={{ uri: userMap[rv.accountId]?.avatarUrl }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  marginRight: 8,
                  backgroundColor: colors.border,
                }}
              />
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={32}
                color={colors.icon}
                style={{ marginRight: 8 }}
              />
            )}

            <Text style={{ color: colors.text, fontWeight: "600" }}>
              {userMap[rv.accountId]?.fullName ?? `User #${rv.accountId}`}
            </Text>
          </View>

          {!!rv.comment && (
            <Text style={{ color: colors.icon, marginTop: 6, lineHeight: 20 }}>
              {rv.comment}
            </Text>
          )}
        </View>
      )}
      ListHeaderComponent={
        <View style={{ padding: 16, backgroundColor: colors.background }}>
          <FestivalImageGallery
            images={festival.images}
            activeIndex={0}
            onIndexChange={() => {}}
          />

          <View style={{ marginTop: 16 }}>
            <FestivalHeader festival={festival} />

            <FestivalRegistration
              festival={festival}
              isParticipating={isParticipating}
              registrationLoading={registrationLoading}
              onToggleRegistration={handleRegistrationToggle}
            />

            <FestivalInfo festival={festival} />

            <FestivalMenuItems menus={festival.festivalMenus} />

            <FestivalMapSection maps={festival.festivalMaps} />

            <FestivalReviewForm
              myReview={myReview}
              editing={editing}
              ratingInput={ratingInput}
              commentInput={commentInput}
              submitting={submitting}
              onRatingChange={setRatingInput}
              onCommentChange={setCommentInput}
              onSubmit={handleSubmitReview}
              onStartEdit={startEditMyReview}
              onCancelEdit={cancelEditReview}
              onDelete={handleDeleteMyReview}
            />

            <Text
              style={[styles.infoLabel, { color: colors.text, marginTop: 16 }]}
            >
              Tất cả đánh giá ({reviews?.length || 0})
            </Text>
          </View>
        </View>
      }
      ListEmptyComponent={
        !reviewsLoading ? (
          <Text
            style={{ color: colors.icon, paddingHorizontal: 16, marginTop: 8 }}
          >
            Chưa có đánh giá nào.
          </Text>
        ) : null
      }
      ListFooterComponent={
        reviewsLoading ? (
          <View style={{ paddingVertical: 16, alignItems: "center" }}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <View style={{ height: 16 }} />
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: { marginTop: 16, fontSize: 16, textAlign: "center" },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: { fontSize: 18, textAlign: "center", marginTop: 16 },
  infoLabel: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});
