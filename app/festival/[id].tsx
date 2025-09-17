import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
  Alert,
  Text,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FestivalImageGallery } from "../../components/festival/detail/FestivalImageGallery";
import { FestivalMenuItems } from "../../components/festival/detail/FestivalMenuItems";
import { FestivalMapSection } from "../../components/festival/detail/FestivalMapSection";
import { FestivalHeader } from "../../components/festival/detail/FestivalHeader";
import { FestivalRegistration } from "../../components/festival/detail/FestivalRegistration";
import { FestivalInfo } from "../../components/festival/detail/FestivalInfo";
import { FestivalReviewForm } from "../../components/festival/detail/FestivalReviewForm";
import { FestivalReviewsList } from "../../components/festival/detail/FestivalReviewsList";
import { festivalService } from "../../services/festivalService";
import { festivalParticipantsService } from "../../services/festivalParticipantsService";
import { reviewsService } from "../../services/reviewsService";
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

  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [myReview, setMyReview] = useState<any | null>(null);
  const [ratingInput, setRatingInput] = useState<number>(0);
  const [commentInput, setCommentInput] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);

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

  const loadReviews = async () => {
    if (!id) return;
    setReviewsLoading(true);
    try {
      const res: any = await reviewsService.getByFestivalId(parseInt(id));
      const list = res?.data ?? res ?? [];
      setReviews(list);

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
    if (!user?.id) return;

    try {
      const result =
        await festivalParticipantsService.getFestivalParticipantsByAccIdAndFeslId(
          parseInt(id),
          user.id
        );

      if (result) {
        setIsParticipating(true);
      } else {
        setIsParticipating(false);
      }
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
          reviewId: myReview.id,
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

  const handleDeleteMyReview = async () => {
    if (!myReview) return;
    Alert.alert("Xoá đánh giá", "Bạn chắc chắn muốn xoá đánh giá của mình?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            const res: any = await reviewsService.delete(myReview.id);
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

  const handleEditReview = (review: any) => {
    setMyReview(review);
    setRatingInput(review.rating);
    setCommentInput(review.comment || "");
    setEditing(true);
  };

  const handleDeleteReview = (review: any) => {
    setMyReview(review);
    handleDeleteMyReview();
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

        <FestivalReviewsList
          reviews={reviews}
          reviewsLoading={reviewsLoading}
          userId={user?.id}
          editing={editing}
          onEditReview={handleEditReview}
          onDeleteReview={handleDeleteReview}
        />
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
});
