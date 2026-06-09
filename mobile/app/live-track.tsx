import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

type TrackingData = {
  bookingId: string;
  busId: string;
  busName: string;
  busNumber: string;
  routeFrom: string;
  routeTo: string;
  departureTime: string;
  travelDate: string;
  currentLocation: {
    latitude: number;
    longitude: number;
    updatedAt: string;
  };
};

type Coordinate = {
  latitude: number;
  longitude: number;
};

const routeCoordinates: Record<string, Coordinate> = {
  elpitiya: { latitude: 6.2906, longitude: 80.1612 },
  colombo: { latitude: 6.9271, longitude: 79.8612 },
  galle: { latitude: 6.0535, longitude: 80.221 },
  matara: { latitude: 5.9549, longitude: 80.555 },
  kandy: { latitude: 7.2906, longitude: 80.6337 },
  kurunegala: { latitude: 7.4863, longitude: 80.3623 },
  negombo: { latitude: 7.2083, longitude: 79.8358 },
  anuradhapura: { latitude: 8.3114, longitude: 80.4037 },
};

const getCoordinate = (city?: string) => {
  if (!city) return null;
  return routeCoordinates[city.trim().toLowerCase()] || null;
};

export default function LiveTrack() {
  const { bookingId } = useLocalSearchParams<{
    bookingId: string;
  }>();

  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLocation = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await API.get(`/bookings/track/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTracking(res.data);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to load tracking"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();

    const interval = setInterval(() => {
      fetchLocation();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading || !tracking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1457D9" />
        <Text style={styles.loadingText}>Loading live location...</Text>
      </View>
    );
  }

  const busLocation = {
    latitude: tracking.currentLocation?.latitude || 6.9271,
    longitude: tracking.currentLocation?.longitude || 79.8612,
  };

  const startLocation = getCoordinate(tracking.routeFrom);
  const endLocation = getCoordinate(tracking.routeTo);

  const hasRouteLine = startLocation && endLocation;

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: busLocation.latitude,
          longitude: busLocation.longitude,
          latitudeDelta: hasRouteLine ? 0.9 : 0.04,
          longitudeDelta: hasRouteLine ? 0.9 : 0.04,
        }}
      >
        {startLocation && (
          <Marker
            coordinate={startLocation}
            title={tracking.routeFrom}
            description="Departure"
            pinColor="green"
          />
        )}

        {endLocation && (
          <Marker
            coordinate={endLocation}
            title={tracking.routeTo}
            description="Destination"
            pinColor="red"
          />
        )}

        {hasRouteLine && (
          <Polyline
            coordinates={[startLocation, endLocation]}
            strokeColor="#1457D9"
            strokeWidth={5}
          />
        )}

        <Marker
          coordinate={busLocation}
          title={tracking.busName}
          description={`${tracking.routeFrom} → ${tracking.routeTo}`}
        />
      </MapView>

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Live Bus Tracking</Text>

        <TouchableOpacity onPress={fetchLocation}>
          <Text style={styles.refresh}>↻</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.busName}>{tracking.busName}</Text>
            <Text style={styles.busNumber}>{tracking.busNumber}</Text>
          </View>

          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        <View style={styles.routeBox}>
          <Text style={styles.route}>
            {tracking.routeFrom} → {tracking.routeTo}
          </Text>
        </View>

        {!hasRouteLine && (
          <Text style={styles.routeNote}>
            Route line not available for this city pair. Add coordinates in
            routeCoordinates.
          </Text>
        )}

        <Info label="Travel Date" value={tracking.travelDate} />
        <Info label="Departure" value={tracking.departureTime} />
        <Info
          label="Last Updated"
          value={
            tracking.currentLocation?.updatedAt
              ? new Date(tracking.currentLocation.updatedAt).toLocaleTimeString()
              : "N/A"
          }
        />

        <TouchableOpacity style={styles.refreshButton} onPress={fetchLocation}>
          <Text style={styles.refreshText}>Refresh Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Info({ label, value }: any) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8FF",
  },

  map: {
    flex: 1,
  },

  topBar: {
    position: "absolute",
    top: 55,
    left: 18,
    right: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
  },

  back: {
    fontSize: 38,
    color: "#071A2F",
    fontWeight: "900",
  },

  title: {
    color: "#071A2F",
    fontSize: 18,
    fontWeight: "900",
  },

  refresh: {
    color: "#1457D9",
    fontSize: 28,
    fontWeight: "900",
  },

  infoCard: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  busName: {
    color: "#071A2F",
    fontSize: 22,
    fontWeight: "900",
  },

  busNumber: {
    color: "#667085",
    marginTop: 4,
    fontWeight: "700",
  },

  liveBadge: {
    backgroundColor: "#E2F8EF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    height: 32,
  },

  liveText: {
    color: "#00A86B",
    fontSize: 12,
    fontWeight: "900",
  },

  routeBox: {
    backgroundColor: "#1457D9",
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
  },

  route: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
  },

  routeNote: {
    color: "#F5A400",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "center",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 11,
  },

  label: {
    color: "#667085",
    fontSize: 14,
    fontWeight: "700",
  },

  value: {
    color: "#071A2F",
    fontSize: 14,
    fontWeight: "900",
  },

  refreshButton: {
    backgroundColor: "#1457D9",
    padding: 15,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 10,
  },

  refreshText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F4F8FF",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#667085",
    marginTop: 14,
    fontWeight: "800",
  },
});