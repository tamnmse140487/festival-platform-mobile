import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  useColorScheme,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button, Input } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { accountService } from "../../services/accountService";
import { Colors } from "../../constants/Colors";

export default function ChangePasswordScreen() {
  const { user, logout } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const validatePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return false;
    }

    if (newPassword.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 6 ký tự");
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return false;
    }

    if (oldPassword === newPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới phải khác mật khẩu cũ");
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!user || !validatePassword()) return;

    setLoading(true);

    try {
      const success = await accountService.changePassword(
        user.id,
        oldPassword,
        newPassword
      );

      if (success) {
        Alert.alert(
          "Thành công",
          "Đổi mật khẩu thành công, vui lòng đăng nhập lại!",
          [
            {
              text: "OK",
              onPress: async () => {
                await logout();
                router.replace("/(auth)/login");
              },
            },
          ]
        );
      } else {
        Alert.alert("Lỗi", "Mật khẩu cũ không chính xác hoặc có lỗi xảy ra");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Đã có lỗi xảy ra khi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          Vui lòng đăng nhập để thay đổi mật khẩu
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.navigate("profile")}
            style={[styles.backButton, { backgroundColor: colors.border }]}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Đổi mật khẩu
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.infoSection}>
            <View
              style={[styles.infoCard, { backgroundColor: colors.secondary }]}
            >
              <Ionicons
                name="information-circle"
                size={24}
                color={colors.primary}
              />
              <Text style={[styles.infoText, { color: colors.text }]}>
                Để bảo mật tài khoản, vui lòng nhập mật khẩu cũ và tạo mật khẩu
                mới có ít nhất 6 ký tự.
              </Text>
            </View>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Mật khẩu hiện tại <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.passwordInputContainer}>
                <Input
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  placeholder="Nhập mật khẩu hiện tại"
                  secureTextEntry={!showOldPassword}
                  style={[styles.passwordInput, { paddingRight: 50 }]}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowOldPassword(!showOldPassword)}
                >
                  <Ionicons
                    name={showOldPassword ? "eye-off" : "eye"}
                    size={20}
                    color={colors.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Mật khẩu mới <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.passwordInputContainer}>
                <Input
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                  secureTextEntry={!showNewPassword}
                  style={[styles.passwordInput, { paddingRight: 50 }]}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Ionicons
                    name={showNewPassword ? "eye-off" : "eye"}
                    size={20}
                    color={colors.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Xác nhận mật khẩu mới <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.passwordInputContainer}>
                <Input
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Nhập lại mật khẩu mới"
                  secureTextEntry={!showConfirmPassword}
                  style={[styles.passwordInput, { paddingRight: 50 }]}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={20}
                    color={colors.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.buttonSection}>
            <Button
              title="Đổi mật khẩu"
              onPress={handleChangePassword}
              loading={loading}
              style={styles.changeButton}
            />

            <Button
              title="Hủy"
              onPress={() => router.navigate("profile")}
              variant="outline"
              style={styles.cancelButton}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    paddingTop: 20,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  errorText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  infoCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    alignItems: "flex-start",
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  formSection: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  required: {
    color: "#DC2626",
  },
  passwordInputContainer: {
    position: "relative",
  },
  passwordInput: {
    fontSize: 16,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 12,
    padding: 4,
  },
  buttonSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  changeButton: {
    marginBottom: 8,
  },
  cancelButton: {
    marginBottom: 20,
  },
});
