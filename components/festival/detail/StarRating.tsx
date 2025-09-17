import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StarRatingProps {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readonly?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  size = 20,
  readonly = false,
}) => {
  const stars = [1, 2, 3, 4, 5];
  
  return (
    <View style={{ flexDirection: "row" }}>
      {stars.map((s) => (
        <TouchableOpacity
          key={s}
          onPress={() => !readonly && onChange?.(s)}
          disabled={readonly}
          style={{ paddingHorizontal: 2 }}
        >
          <Ionicons
            name={s <= value ? "star" : "star-outline"}
            size={size}
            color={s <= value ? "#f59e0b" : "#9ca3af"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};