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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (!success) {
      Alert.alert("Lỗi đăng nhập", "Email hoặc mật khẩu không chính xác");
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
              <View>
                <Image
                  source={require("../../assets/images/icon_food_festival.png")}
                  style={styles.headerIcon}
                />
              </View>
              <Text style={styles.title}>Festival Platform</Text>
            </TouchableOpacity>

            <Text style={styles.subtitle}>
              Khám phá lễ hội ẩm thực trường học
            </Text>
          </View>

          <View
            style={[styles.formContainer, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.formTitle, { color: colors.text }]}>
              Đăng nhập
            </Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Email</Text>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="Nhập email của bạn"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>
                Mật khẩu
              </Text>
              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="Nhập mật khẩu"
                secureTextEntry={true}
                showPasswordToggle={true}
              />
            </View>

            <TouchableOpacity
              onPress={() => router.push("/(auth)/forgot-password")}
              style={styles.linkWrapperRight}
            >
              <Text style={styles.linkText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <Button
              title="Đăng nhập"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />

            <TouchableOpacity
              onPress={() => router.replace("/(auth)/register")}
              style={styles.linkWrapper}
            >
              <Text style={styles.linkText}>
                Chưa có tài khoản?{" "}
                <Text style={styles.linkHighlight}>Đăng ký</Text>
              </Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  logoWrapper: {
    alignItems: "center",
  },

  headerIcon: {
    width: 100,
    height: 100,
  },
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
  },
  loginButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  demoInfo: {
    backgroundColor: "rgba(255,107,53,0.1)",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B35",
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  demoText: {
    fontSize: 13,
    fontFamily: "monospace",
  },
  linkWrapper: {
    marginTop: 12,
    marginBottom: 8,
  },

  linkWrapperRight: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },

  linkText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },

  linkHighlight: {
    fontWeight: "700",
    color: "#007AFF",
  },
});
