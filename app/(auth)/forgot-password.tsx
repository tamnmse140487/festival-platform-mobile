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
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Input } from "../../components/ui";
import { Colors } from "../../constants/Colors";
import { apiService } from "../../services/apiService";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert("Lỗi", "Vui lòng nhập email");
      return;
    }
    try {
      setLoading(true);
      const res = await apiService.sendOtp(email.trim());
      if (!res?.success) {
        Alert.alert("Không thể gửi OTP", res?.message || "Vui lòng thử lại.");
        return;
      }
      router.push({
        pathname: "/(auth)/verify-otp",
        params: { email: email.trim() },
      });
    } catch (e) {
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi gửi OTP.");
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
            <Text style={styles.subtitle}>Khôi phục mật khẩu</Text>
          </View>

          <View
            style={[styles.formContainer, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.formTitle, { color: colors.text }]}>
              Xác thực email
            </Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Email</Text>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="Vui lòng nhập email của bạn"
                keyboardType="email-address"
              />
            </View>

            <Button title="Gửi OTP" onPress={handleSendOtp} loading={loading} />
            <TouchableOpacity
              onPress={() => router.replace("/(auth)/login")}
              style={{ marginTop: 16 }}
            >
              <Text style={{ textAlign: "center", color: colors.text }}>
                Quay lại đăng nhập
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
