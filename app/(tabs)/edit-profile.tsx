import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  useColorScheme,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Button, Input } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { accountService } from '../../services/accountService';
import { uploadService } from '../../services/uploadService';
import { Colors } from '../../constants/Colors';

export default function EditProfileScreen() {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [className, setClassName] = useState(user?.className || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Lỗi', 'Cần cấp quyền truy cập thư viện ảnh');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setSelectedImage({
        uri: asset.uri,
        mimeType: asset.mimeType,
        fileName: asset.fileName || 'avatar.jpg',
      });
      setAvatarUrl(asset.uri);
    }
  };

  const handleSave = async () => {
    if (!user || !fullName || !phoneNumber) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setLoading(true);
    
    try {
      let finalAvatarUrl = avatarUrl;

      if (selectedImage) {
        try {
          finalAvatarUrl = await uploadService.uploadAvatarImage(selectedImage);
        } catch (error) {
          Alert.alert('Lỗi', 'Không thể tải ảnh lên. Vui lòng thử lại.');
          setLoading(false);
          return;
        }
      }

      const updateData: any = {};
      
      if (fullName !== user.fullName) updateData.fullName = fullName;
      if (phoneNumber !== user.phoneNumber) updateData.phoneNumber = phoneNumber;
      if (finalAvatarUrl !== user.avatarUrl) updateData.avatarUrl = finalAvatarUrl;
      if ((className || '') !== (user.className || '')) updateData.className = className || '';
      
      if (Object.keys(updateData).length === 0) {
        Alert.alert('Thông báo', 'Không có thay đổi nào để cập nhật');
        setLoading(false);
        return;
      }

      updateData.status = user.status;
      updateData.updatedAt = new Date().toISOString();

      const success = await accountService.updateProfile(user.id, updateData);
      
      if (success) {
        updateUser({
          ...user,
          fullName,
          phoneNumber,
          className,
          avatarUrl: finalAvatarUrl,
          updatedAt: updateData.updatedAt,
        });
        
        Alert.alert('Thành công', 'Cập nhật thông tin thành công', [
          { text: 'OK', onPress: () => router.navigate("profile") }
        ]);
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật thông tin');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi cập nhật');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          Không tìm thấy thông tin người dùng
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            onPress={() => router.navigate("profile")}
            style={[styles.backButton, { backgroundColor: colors.border }]}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Chỉnh sửa hồ sơ
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: colors.secondary }]}>
                  <Ionicons name="person" size={40} color={colors.primary} />
                </View>
              )}
              <TouchableOpacity 
                style={[styles.editAvatarButton, { backgroundColor: colors.primary }]}
                onPress={pickImage}
              >
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Họ và tên <Text style={styles.required}>*</Text>
              </Text>
              <Input
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nhập họ và tên"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Email <Text style={styles.required}>*</Text>
              </Text>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="Nhập địa chỉ email"
                keyboardType="email-address"
                style={styles.input}
                disabled
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Số điện thoại <Text style={styles.required}>*</Text>
              </Text>
              <Input
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Lớp
              </Text>
              <Input
                value={className}
                onChangeText={setClassName}
                placeholder="Nhập lớp học (tùy chọn)"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.buttonSection}>
            <Button
              title="Lưu thay đổi"
              onPress={handleSave}
              loading={loading}
              style={styles.saveButton}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarContainer: {
    position: 'relative',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  formSection: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  required: {
    color: '#DC2626',
  },
  input: {
    fontSize: 16,
  },
  buttonSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  saveButton: {
    marginBottom: 8,
  },
  cancelButton: {
    marginBottom: 20,
  },
});