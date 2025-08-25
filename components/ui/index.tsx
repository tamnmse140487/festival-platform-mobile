import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "react-native";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const sizeStyle: ViewStyle =
    size === "small"
      ? styles.buttonSmall
      : size === "large"
      ? styles.buttonLarge
      : styles.buttonMedium;

  const textSizeStyle: TextStyle =
    size === "small"
      ? styles.buttonTextSmall
      : size === "large"
      ? styles.buttonTextLarge
      : styles.buttonTextMedium;

  const buttonStyles: StyleProp<ViewStyle> = [
    styles.button,
    sizeStyle,
    variant === "primary" && { backgroundColor: colors.primary },
    variant === "secondary" && { backgroundColor: colors.secondary },
    variant === "outline" && {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: colors.primary,
    },
    disabled && styles.buttonDisabled,
    style,
  ];

  const textStyles: StyleProp<TextStyle> = [
    styles.buttonText,
    textSizeStyle,
    variant === "primary" ? { color: "#FFFFFF" } : { color: colors.primary },
    disabled && styles.buttonTextDisabled,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? "#FFFFFF" : colors.primary}
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  multiline?: boolean;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  style,
  disabled = false,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const inputStyles: StyleProp<TextStyle> = [
    styles.input,
    {
      borderColor: colors.border,
      backgroundColor: colors.surface,
      color: colors.text,
    },
    multiline && { height: numberOfLines * 20 + 20 },
    disabled &&
      (colorScheme === "dark"
        ? styles.inputDisabledDark
        : styles.inputDisabledLight),
    style,
  ];

  return (
    <TextInput
      style={inputStyles}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.icon}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
      editable={!disabled}
    />
  );
};

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, style, onPress }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const cardStyle: StyleProp<ViewStyle> = [
    styles.card,
    { backgroundColor: colors.surface, shadowColor: colors.shadow },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.9}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  } as ViewStyle,
  buttonSmall: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  } as ViewStyle,
  buttonMedium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  } as ViewStyle,
  buttonLarge: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  } as ViewStyle,
  buttonDisabled: {
    opacity: 0.6,
  } as ViewStyle,
  buttonText: {
    fontWeight: "600",
  } as TextStyle,
  buttonTextSmall: {
    fontSize: 14,
  } as TextStyle,
  buttonTextMedium: {
    fontSize: 16,
  } as TextStyle,
  buttonTextLarge: {
    fontSize: 18,
  } as TextStyle,
  buttonTextDisabled: {
    opacity: 0.6,
  } as TextStyle,
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  } as TextStyle,
  inputDisabledLight: {
    backgroundColor: "#F3F4F6",
    color: "#9CA3AF",
  } as TextStyle,
  inputDisabledDark: {
    backgroundColor: "#2D2D2D",
    color: "#6B7280",
  } as TextStyle,
  card: {
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,
});
