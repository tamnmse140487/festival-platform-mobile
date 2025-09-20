import React from "react";
import { View, TouchableOpacity, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../constants/Colors";

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
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

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
            color={s <= value ? colors.warning : colors.icon} 
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};
