import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  Linking,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

type Booking = {
  _id: string;
  seatNumbers: number[];
  travelDate: string;
  totalAmount: number;
  status: string;
  busId: {
    _id: string;
    busName: string;
    busNumber: string;
    routeFrom: string;
    routeTo: string;
    departureTime: string;
    arrivalTime?: string;
    imageUrl?: string;
  };
};

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await API.get("/bookings/my-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(res.data);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to load bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async (bookingId: string) => {
    try {
      const receiptUrl = `${API.defaults.baseURL}/bookings/receipt/${bookingId}`;
      await Linking.openURL(receiptUrl);
    } catch (error: any) {
      Alert.alert("Error", "Failed to open receipt");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings 🎫</Text>

      <Text style={styles.subtitle}>
        View your confirmed tickets, receipts and live bus tracking.
      </Text>

      {loading ? (
        <Text style={styles.loading}>Loading bookings...</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No bookings found</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.busId?.imageUrl && (
                <Image
                  source={{ uri: item.busId.imageUrl }}
                  style={styles.busImage}
                  resizeMode="cover"
                />
              )}

              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.busName}>{item.busId?.busName}</Text>
                  <Text style={styles.busNumber}>{item.busId?.busNumber}</Text>
                </View>

                <Text style={styles.status}>{item.status}</Text>
              </View>

              <View style={styles.routeBox}>
                <View>
                  <Text style={styles.city}>{item.busId?.routeFrom}</Text>
                  <Text style={styles.small}>From</Text>
                </View>

                <Text style={styles.arrow}>→</Text>

                <View>
                  <Text style={styles.city}>{item.busId?.routeTo}</Text>
                  <Text style={styles.small}>To</Text>
                </View>
              </View>

              <InfoRow label="Travel Date" value={item.travelDate} />
              <InfoRow label="Seats" value={item.seatNumbers.join(", ")} />
              <InfoRow label="Departure" value={item.busId?.departureTime} />
              <InfoRow label="Amount" value={`LKR ${item.totalAmount}`} />

              <View style={styles.qrBox}>
                <Text style={styles.qrText}>▦ ▦ ▦ ▦</Text>
                <Text style={styles.qrSub}>Ticket ID: {item._id.slice(-8)}</Text>
              </View>

              <TouchableOpacity
                style={styles.trackButton}
                onPress={() =>
                  router.push(`/live-track?bookingId=${item._id}` as any)
                }
              >
                <Text style={styles.trackText}>📍 Live Track Bus</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => downloadReceipt(item._id)}
              >
                <Text style={styles.downloadText}>Download Receipt PDF</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

function InfoRow({ label, value }: any) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "N/A"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8FF",
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  title: {
    color: "#071A2F",
    fontSize: 32,
    fontWeight: "900",
  },

  subtitle: {
    color: "#667085",
    fontSize: 15,
    marginTop: 8,
    marginBottom: 22,
  },

  loading: {
    color: "#667085",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },

  emptyText: {
    color: "#667085",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    fontWeight: "800",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },

  busImage: {
    width: "100%",
    height: 170,
    borderRadius: 22,
    marginBottom: 16,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  busName: {
    color: "#071A2F",
    fontSize: 20,
    fontWeight: "900",
  },

  busNumber: {
    color: "#667085",
    marginTop: 4,
    fontWeight: "700",
  },

  status: {
    backgroundColor: "#E2F8EF",
    color: "#00A86B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    height: 30,
  },

  routeBox: {
    backgroundColor: "#1457D9",
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  city: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  small: {
    color: "#CFE0FF",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "700",
  },

  arrow: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  label: {
    color: "#667085",
    fontSize: 14,
    fontWeight: "700",
  },

  value: {
    color: "#071A2F",
    fontSize: 15,
    fontWeight: "900",
  },

  qrBox: {
    backgroundColor: "#F8FBFF",
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 16,
  },

  qrText: {
    color: "#071A2F",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 4,
  },

  qrSub: {
    color: "#667085",
    marginTop: 8,
    fontSize: 13,
    fontWeight: "700",
  },

  trackButton: {
    backgroundColor: "#071A2F",
    padding: 15,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 12,
  },

  trackText: {
    color: "#FFD447",
    fontSize: 16,
    fontWeight: "900",
  },

  downloadButton: {
    backgroundColor: "#1457D9",
    padding: 15,
    borderRadius: 18,
    alignItems: "center",
  },

  downloadText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});