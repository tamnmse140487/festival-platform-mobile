import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../ui";
import { BoothModal } from "../../booth/BoothModal";
import { FestivalMap } from "../../../types";
import { Colors } from "../../../constants/Colors";

interface FestivalMapSectionProps {
  maps: FestivalMap[];
}

export const FestivalMapSection: React.FC<FestivalMapSectionProps> = ({
  maps,
}) => {
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );
  const [selectedLocationName, setSelectedLocationName] = useState("");
  const [boothModalVisible, setBoothModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const handleLocationPress = (
    locationId: number,
    locationName: string,
    coordinates: string,
    isOccupied: boolean
  ) => {
    if (isOccupied) {
      setSelectedLocationId(locationId);
      setSelectedLocationName(`${locationName} - ${coordinates}`);
      setBoothModalVisible(true);
    }
  };

  const renderLocationItem = (location: any) => (
    <TouchableOpacity
      key={location.locationId}
      style={[
        styles.locationItem,
        !location.isOccupied && styles.locationItemDisabled,
      ]}
      onPress={() =>
        handleLocationPress(
          location.locationId,
          location.locationName,
          location.coordinates,
          location.isOccupied
        )
      }
      disabled={!location.isOccupied}
    >
      <View
        style={[
          styles.locationStatus,
          {
            backgroundColor: location.isOccupied
              ? colors.error
              : colors.success,
          },
        ]}
      />
      <Text style={[styles.locationText, { color: colors.text }]}>
        {location.locationName} - {location.coordinates}
      </Text>
      <View
        style={[
          styles.locationPill,
          location.isOccupied
            ? {
                backgroundColor: colors.errorSoftBg,
                borderColor: colors.errorSoftBorder,
              }
            : {
                backgroundColor: colors.successSoftBg,
                borderColor: colors.successSoftBorder,
              },
        ]}
      >
        <Ionicons
          name={location.isOccupied ? "lock-closed" : "checkmark-circle"}
          size={14}
          color={
            location.isOccupied ? colors.errorSoftText : colors.successSoftText
          }
          style={{ marginRight: 6 }}
        />
        <Text
          style={[
            styles.locationPillText,
            {
              color: location.isOccupied
                ? colors.errorSoftText
                : colors.successSoftText,
            },
          ]}
        >
          {location.isOccupied ? "ĐÃ THUÊ" : "CÒN TRỐNG"}
        </Text>
      </View>
      {location.isOccupied && (
        <Ionicons name="chevron-forward" size={16} color={colors.icon} />
      )}
    </TouchableOpacity>
  );

  if (!maps || maps.length === 0) return null;

  return (
    <>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Bản đồ lễ hội
        </Text>
        {maps.map((map) => (
          <Card key={map.mapId} style={styles.mapCard}>
            <Text style={[styles.mapTitle, { color: colors.text }]}>
              {map.mapName}
            </Text>
            <Image
              source={{ uri: map.mapUrl }}
              style={styles.mapImage}
              resizeMode="contain"
            />
            <View style={styles.locationsInfo}>
              <Text style={[styles.locationsTitle, { color: colors.text }]}>
                Vị trí gian hàng:
              </Text>
              <View style={styles.locationsList}>
                {map.locations.map(renderLocationItem)}
              </View>
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <Ionicons
                    name="information-circle-outline"
                    size={16}
                    color={colors.icon}
                  />
                  <Text style={[styles.legendText, { color: colors.icon }]}>
                    Chạm vào vị trí đã thuê để xem thông tin gian hàng
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        ))}
      </View>

      <BoothModal
        visible={boothModalVisible}
        locationId={selectedLocationId}
        locationName={selectedLocationName}
        onClose={() => setBoothModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  mapCard: {
    marginBottom: 16,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  mapImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  locationsInfo: {
    marginTop: 8,
  },
  locationsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  locationsList: {
    gap: 8,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 8,
  },
  locationItemDisabled: {
    opacity: 0.7,
  },
  locationStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
  },
  locationPillText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  legendContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendText: {
    marginLeft: 8,
    fontSize: 13,
    fontStyle: "italic",
  },
});
