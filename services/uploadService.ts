const uploadImageToCloudinary = async (file: any, folder = "avatars") => {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      type: file.mimeType || 'image/jpeg',
      name: file.fileName || 'image.jpg',
    } as any);
    formData.append("upload_preset", process.env.EXPO_PUBLIC_UPLOAD_PRESET!);
    formData.append("folder", folder);

    const cloud_name = process.env.EXPO_PUBLIC_CLOUD_NAME;

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      {
        method: "POST",
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
      originalName: file.fileName || 'image.jpg',
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const uploadService = {
  uploadAvatarImage: async (file: any) => {
    try {
      const uploadResult = await uploadImageToCloudinary(file, "avatars");
      return uploadResult.url;
    } catch (error) {
      console.error("Upload failed:", error);
      throw new Error("Không thể tải ảnh lên. Vui lòng thử lại.");
    }
  },
};