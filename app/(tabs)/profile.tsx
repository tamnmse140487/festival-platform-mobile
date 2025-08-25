import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  useColorScheme,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Button, Card } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { Colors } from "../../constants/Colors";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const handleLogin = () => {
    router.push("/(auth)/login");
  };

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        onPress: async () => {
          await logout();
          router.replace("/");
        },
        style: "destructive",
      },
    ]);
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={[colors.primary, colors.accent]}
          style={styles.header}
        >
          <SafeAreaView>
            <View style={styles.guestHeaderContent}>
              <View style={styles.guestAvatarContainer}>
                <Ionicons name="person" size={50} color="#FFFFFF" />
              </View>
              <Text style={styles.guestTitle}>Chưa đăng nhập</Text>
              <Text style={styles.guestSubtitle}>
                Đăng nhập để xem thông tin cá nhân
              </Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.guestContent}>
          <Card style={styles.guestCard}>
            <Ionicons
              name="log-in"
              size={48}
              color={colors.primary}
              style={styles.guestIcon}
            />
            <Text style={[styles.guestCardTitle, { color: colors.text }]}>
              Đăng nhập ngay
            </Text>
            <Text style={[styles.guestCardDescription, { color: colors.icon }]}>
              Đăng nhập để truy cập thông tin cá nhân, theo dõi lễ hội yêu thích
              và nhiều tính năng khác.
            </Text>
            <Button
              title="Đăng nhập"
              onPress={handleLogin}
              style={styles.loginButton}
            />
          </Card>
        </View>
      </View>
    );
  }

  const profileSections = [
    {
      title: "Thông tin cá nhân",
      items: [
        { icon: "person-outline", label: "Họ và tên", value: user?.fullName },
        { icon: "mail-outline", label: "Email", value: user?.email },
        {
          icon: "call-outline",
          label: "Số điện thoại",
          value: user?.phoneNumber,
        },
        { icon: "school-outline", label: "Lớp", value: user?.className },
      ],
    },
    {
      title: "Tài khoản",
      items: [
        {
          icon: "wallet-outline",
          label: "Số dư",
          value:
            user?.balance != null 
              ? `${user.balance.toLocaleString("vi-VN")} VNĐ`
              : "Chưa có ví",
        },
        {
          icon: "shield-checkmark-outline",
          label: "Trạng thái",
          value: user?.status ? "Hoạt động" : "Tạm khóa",
        },
      ],
    },
  ];

  const actionItems = [
    {
      icon: "create-outline",
      label: "Chỉnh sửa hồ sơ",
      color: colors.primary,
      backgroundColor: colors.secondary,
      onPress: () => router.push("/(tabs)/edit-profile"),
    },
    {
      icon: "key-outline",
      label: "Đổi mật khẩu",
      color: "#059669",
      backgroundColor: "#DCFCE7",
      onPress: () => router.push("/(tabs)/change-password"),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[colors.primary, colors.accent]}
          style={styles.header}
        >
          <SafeAreaView>
            <View style={styles.headerContent}>
              <View style={styles.avatarContainer}>
                {user?.avatarUrl ? (
                  <Image
                    source={{ uri: user.avatarUrl }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={50} color="#FFFFFF" />
                  </View>
                )}
              </View>
              <Text style={styles.name}>{user?.fullName}</Text>
              <Text style={styles.email}>{user?.email}</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Hành động nhanh
            </Text>
            <Card style={styles.actionsCard}>
              {actionItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.actionRow,
                    index < actionItems.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    },
                  ]}
                  onPress={item.onPress}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: item.backgroundColor },
                    ]}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={item.color}
                    />
                  </View>
                  <Text style={[styles.actionLabel, { color: colors.text }]}>
                    {item.label}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.icon}
                  />
                </TouchableOpacity>
              ))}
            </Card>
          </View>

          {profileSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {section.title}
              </Text>
              <Card style={styles.sectionCard}>
                {section.items.map((item, itemIndex) => (
                  <View key={itemIndex}>
                    <View style={styles.infoRow}>
                      <View style={styles.infoLeft}>
                        <View
                          style={[
                            styles.iconContainer,
                            { backgroundColor: colors.secondary },
                          ]}
                        >
                          <Ionicons
                            name={item.icon as any}
                            size={20}
                            color={colors.primary}
                          />
                        </View>
                        <Text
                          style={[styles.infoLabel, { color: colors.text }]}
                        >
                          {item.label}
                        </Text>
                      </View>
                      <Text style={[styles.infoValue, { color: colors.icon }]}>
                        {item.value || "Chưa cập nhật"}
                      </Text>
                    </View>
                    {itemIndex < section.items.length - 1 && (
                      <View
                        style={[
                          styles.divider,
                          { backgroundColor: colors.border },
                        ]}
                      />
                    )}
                  </View>
                ))}
              </Card>
            </View>
          ))}

          <Button
            title="Đăng xuất"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 40,
  },
  headerContent: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  guestHeaderContent: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  guestAvatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  email: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginTop: 4,
  },
  guestSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginTop: 4,
  },
  content: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  guestContent: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  guestCard: {
    alignItems: "center",
    paddingVertical: 40,
  },
  guestIcon: {
    marginBottom: 20,
  },
  guestCardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  guestCardDescription: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  loginButton: {
    width: "100%",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    paddingTop: 20,
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 20,
    marginBottom: 12,
  },
  actionsCard: {
    marginHorizontal: 16,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  sectionCard: {
    marginHorizontal: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    textAlign: "right",
    flex: 1,
  },
  divider: {
    height: 1,
    marginLeft: 52,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 40,
  },
});
