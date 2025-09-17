import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Card } from "../../../components/ui";
import { StarRating } from "./StarRating";
import { Colors } from "../../../constants/Colors";

interface FestivalReviewFormProps {
  myReview: any;
  editing: boolean;
  ratingInput: number;
  commentInput: string;
  submitting: boolean;
  onRatingChange: (rating: number) => void;
  onCommentChange: (comment: string) => void;
  onSubmit: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
}

export const FestivalReviewForm: React.FC<FestivalReviewFormProps> = ({
  myReview,
  editing,
  ratingInput,
  commentInput,
  submitting,
  onRatingChange,
  onCommentChange,
  onSubmit,
  onStartEdit,
  onCancelEdit,
  onDelete,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <>
      <Card style={{ marginBottom: 24, padding: 12 }}>
        <Text style={[styles.descriptionTitle, { color: colors.text }]}>
          Đánh giá
        </Text>

        <View style={{ marginTop: 12 }}>
          <Text style={[styles.infoLabel, { color: colors.text }]}>
            {myReview && !editing
              ? "Đánh giá của bạn"
              : editing
              ? "Sửa đánh giá"
              : "Viết đánh giá"}
          </Text>

          <View style={{ marginTop: 8, marginBottom: 8 }}>
            <StarRating
              value={ratingInput}
              onChange={onRatingChange}
              size={24}
              readonly={false}
            />
          </View>
        </View>

        <TextInput
          value={commentInput}
          onChangeText={onCommentChange}
          placeholder="Chia sẻ cảm nhận của bạn..."
          placeholderTextColor={colors.icon}
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            padding: 12,
            color: colors.text,
            minHeight: 44,
          }}
          multiline
        />

        <View style={{ marginTop: 8 }}>
          <Text style={{ display: "none" }}> </Text>
        </View>
      </Card>

      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <TouchableOpacity
          onPress={onSubmit}
          disabled={submitting || (!editing && !!myReview && !editing)}
          style={[
            styles.button,
            {
              backgroundColor:
                editing || !myReview ? colors.primary : "#9ca3af",
            },
          ]}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {editing
                ? "Cập nhật"
                : myReview
                ? "Đã gửi đánh giá"
                : "Gửi đánh giá"}
            </Text>
          )}
        </TouchableOpacity>

        {myReview && !editing && (
          <>
            <View style={{ width: 10 }} />
            <TouchableOpacity
              onPress={onStartEdit}
              style={[styles.button, { backgroundColor: "#2563eb" }]}
            >
              <Text style={styles.buttonText}>Sửa</Text>
            </TouchableOpacity>
            <View style={{ width: 10 }} />
            <TouchableOpacity
              onPress={onDelete}
              style={[styles.button, { backgroundColor: colors.error }]}
            >
              <Text style={styles.buttonText}>Xoá</Text>
            </TouchableOpacity>
          </>
        )}

        {editing && (
          <>
            <View style={{ width: 10 }} />
            <TouchableOpacity
              onPress={onCancelEdit}
              style={[styles.button, { backgroundColor: "#6b7280" }]}
            >
              <Text style={styles.buttonText}>Huỷ</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});