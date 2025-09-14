import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
  Image,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Input } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { Colors } from "../../constants/Colors";

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, loading } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu và xác nhận mật khẩu không khớp");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    const ok = await register({ email, password, fullName, phoneNumber });
    if (!ok) {
      Alert.alert("Đăng ký thất bại", "Vui lòng kiểm tra lại thông tin.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <LinearGradient
        colors={[colors.primary, colors.accent]}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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
            <Text style={styles.subtitle}>Tạo tài khoản mới</Text>
          </View>

          <View
            style={[styles.formContainer, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.formTitle, { color: colors.text }]}>
              Đăng ký
            </Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>
                Họ và tên *
              </Text>
              <Input
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nhập họ tên"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>
                Số điện thoại
              </Text>
              <Input
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>
                Email *
              </Text>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="Nhập email"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>
                Mật khẩu *
              </Text>
              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                secureTextEntry={true}
                showPasswordToggle={true}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>
                Nhập lại mật khẩu *
              </Text>
              <Input
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Nhập lại mật khẩu"
                secureTextEntry={true}
                showPasswordToggle={true}
              />
            </View>

            <Button
              title="Tạo tài khoản"
              onPress={handleRegister}
              loading={loading}
              style={styles.loginButton}
            />

            <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
              <Text style={[styles.linkText, { color: colors.text }]}>
                Đã có tài khoản?{" "}
                <Text style={styles.linkTextBold}>Đăng nhập</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Thêm khoảng trống để tránh bị che bởi bàn phím */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  logoWrapper: {
    alignItems: "center",
  },
  headerIcon: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
  },
  formContainer: {
    borderRadius: 20,
    padding: 25,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  loginButton: {
    marginTop: 15,
    marginBottom: 20,
  },
  linkText: {
    textAlign: "center",
    fontSize: 16,
  },
  linkTextBold: {
    fontWeight: "700",
  },
  bottomSpacer: {
    height: 50,
  },
});
