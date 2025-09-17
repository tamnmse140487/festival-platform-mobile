import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
  Image,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Input } from "../../components/ui";
import { Colors } from "../../constants/Colors";
import { apiService } from "../../services/apiService";

export default function VerifyOtpScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const handleVerify = async () => {
    if (!otp) {
      Alert.alert("Lỗi", "Vui lòng nhập mã OTP");
      return;
    }
    try {
      setLoading(true);

      const res = await apiService.verifyOtp(String(email || ""), otp.trim());
      if (!res?.success) {
        Alert.alert(
          "Xác minh thất bại",
          res?.message || "Mã OTP không hợp lệ."
        );
        return;
      }

      Alert.alert(
        "Thành công",
        "Mật khẩu mới đã được gửi tới email của bạn. Vui lòng kiểm tra hộp thư và đăng nhập lại.",
        [{ text: "OK", onPress: () => router.replace("/(auth)/login") }]
      );
    } catch (e) {
      Alert.alert("Lỗi", "Không thể xác minh OTP. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={[colors.primary, colors.accent]}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.logoWrapper}
              onPress={() => router.replace("/(tabs)")}
            >
              <Image
                source={require("../../assets/images/icon_food_festival.png")}
                style={styles.headerIcon}
              />
              <Text style={styles.title}>Festival Platform</Text>
            </TouchableOpacity>
            <Text style={styles.subtitle}>Nhập mã OTP đã gửi tới email</Text>
            {!!email && (
              <Text style={{ color: "#fff", marginTop: 6 }}>
                {String(email)}
              </Text>
            )}
          </View>

          <View
            style={[styles.formContainer, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.formTitle, { color: colors.text }]}>
              Xác minh OTP
            </Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Mã OTP</Text>
              <Input
                value={otp}
                onChangeText={setOtp}
                placeholder="Nhập mã OTP (6 số)"
                keyboardType="numeric"
              />
            </View>

            <Button title="Xác minh" onPress={handleVerify} loading={loading} />

            <TouchableOpacity
              onPress={() => router.replace("/(auth)/forgot-password")}
              style={{ marginTop: 16 }}
            >
              <Text style={{ textAlign: "center", color: colors.text }}>
                Gửi lại OTP
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  header: { alignItems: "center", justifyContent: "center", marginBottom: 40 },
  logoWrapper: { alignItems: "center" },
  headerIcon: { width: 100, height: 100 },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
  },
  formContainer: {
    borderRadius: 20,
    padding: 30,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
});
