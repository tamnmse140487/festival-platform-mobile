import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { StarRating } from "./StarRating";
import { Colors } from "../../../constants/Colors";

interface FestivalReviewsListProps {
  reviews: any[];
  reviewsLoading: boolean;
  userId?: number;
  editing: boolean;
  onEditReview: (review: any) => void;
  onDeleteReview: (review: any) => void;
}

export const FestivalReviewsList: React.FC<FestivalReviewsListProps> = ({
  reviews,
  reviewsLoading,
  userId,
  editing,
  onEditReview,
  onDeleteReview,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View style={{ marginTop: 16 }}>
      <Text style={[styles.infoLabel, { color: colors.text }]}>
        Tất cả đánh giá ({reviews?.length || 0})
      </Text>

      {reviewsLoading ? (
        <View style={{ paddingVertical: 16, alignItems: "center" }}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : reviews?.length ? (
        reviews.map((rv: any) => (
          <View
            key={rv.id}
            style={{
              borderTopWidth: 1,
              borderTopColor: colors.border,
              paddingVertical: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <StarRating value={rv.rating} readonly size={18} />
              <Text
                style={{ marginLeft: 8, color: colors.icon, fontSize: 12 }}
              >
                {new Date(
                  rv.updatedAt || rv.createdAt || Date.now()
                ).toLocaleString("vi-VN")}
              </Text>
            </View>
            <Text style={{ color: colors.text, fontWeight: "600" }}>
              {rv.accountFullName || `User #${rv.accountId}`}
            </Text>
            {!!rv.comment && (
              <Text
                style={{ color: colors.icon, marginTop: 4, lineHeight: 20 }}
              >
                {rv.comment}
              </Text>
            )}

            {userId === rv.accountId && !editing && (
              <View style={{ flexDirection: "row", marginTop: 8 }}>
                <TouchableOpacity
                  onPress={() => onEditReview(rv)}
                  style={[styles.button, { backgroundColor: "#2563eb" }]}
                >
                  <Text style={styles.buttonText}>Sửa</Text>
                </TouchableOpacity>
                <View style={{ width: 8 }} />
                <TouchableOpacity
                  onPress={() => onDeleteReview(rv)}
                  style={[styles.button, { backgroundColor: colors.error }]}
                >
                  <Text style={styles.buttonText}>Xoá</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
      ) : (
        <Text style={{ color: colors.icon, marginTop: 8 }}>
          Chưa có đánh giá nào.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});