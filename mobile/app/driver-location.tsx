import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

export default function DriverLocation() {
  const { busId } = useLocalSearchParams<{
    busId?: string;
  }>();

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(false);

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Denied", "Location permission is required");
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const lat = location.coords.latitude;
    const lng = location.coords.longitude;

    setLatitude(lat);
    setLongitude(lng);

    return { latitude: lat, longitude: lng };
  };

  const updateLocation = async () => {
    if (!busId) {
      Alert.alert("Error", "Bus ID not found");
      return;
    }

    try {
      setSending(true);

      const currentLocation = await getCurrentLocation();

      if (!currentLocation) return;

      const token = await AsyncStorage.getItem("ownerToken");

      await API.put(
        `/buses/location/${busId}`,
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Bus location updated");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update location"
      );
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    let interval: any;

    if (autoUpdate) {
      updateLocation();

      interval = setInterval(() => {
        updateLocation();
      }, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoUpdate]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          Driver Location
        </Text>

        <Text style={styles.gps}>📍</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.icon}>🚌</Text>

        <Text style={styles.cardTitle}>
          Update Bus Live Location
        </Text>

        <Text style={styles.cardText}>
          Share current GPS location so passengers can track the booked bus live.
        </Text>

        <View style={styles.locationBox}>
          <Text style={styles.locationLabel}>
            Latitude
          </Text>
          <Text style={styles.locationValue}>
            {latitude || "Not updated"}
          </Text>

          <Text style={styles.locationLabel}>
            Longitude
          </Text>
          <Text style={styles.locationValue}>
            {longitude || "Not updated"}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.updateButton,
            sending && styles.disabledButton,
          ]}
          onPress={updateLocation}
          disabled={sending}
        >
          {sending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.updateText}>
              Update Current Location
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.autoButton,
            autoUpdate && styles.autoActive,
          ]}
          onPress={() => setAutoUpdate(!autoUpdate)}
        >
          <Text
            style={[
              styles.autoText,
              autoUpdate && styles.autoActiveText,
            ]}
          >
            {autoUpdate
              ? "Stop Auto Update"
              : "Start Auto Update"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.note}>
        Auto update sends location every 10 seconds.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8FF",
    paddingTop: 55,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 26,
  },

  back: {
    fontSize: 42,
    color: "#071A2F",
    fontWeight: "900",
  },

  title: {
    color: "#071A2F",
    fontSize: 23,
    fontWeight: "900",
  },

  gps: {
    fontSize: 24,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 26,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },

  icon: {
    fontSize: 62,
    marginBottom: 16,
  },

  cardTitle: {
    color: "#071A2F",
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
  },

  cardText: {
    color: "#667085",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 23,
    marginTop: 10,
    marginBottom: 24,
  },

  locationBox: {
    width: "100%",
    backgroundColor: "#F8FBFF",
    borderRadius: 22,
    padding: 18,
    marginBottom: 22,
  },

  locationLabel: {
    color: "#667085",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 8,
  },

  locationValue: {
    color: "#071A2F",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 4,
  },

  updateButton: {
    width: "100%",
    backgroundColor: "#1457D9",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 12,
  },

  disabledButton: {
    opacity: 0.7,
  },

  updateText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  autoButton: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#1457D9",
    padding: 15,
    borderRadius: 18,
    alignItems: "center",
  },

  autoActive: {
    backgroundColor: "#071A2F",
    borderColor: "#071A2F",
  },

  autoText: {
    color: "#1457D9",
    fontSize: 16,
    fontWeight: "900",
  },

  autoActiveText: {
    color: "#FFD447",
  },

  note: {
    color: "#667085",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "700",
  },
});