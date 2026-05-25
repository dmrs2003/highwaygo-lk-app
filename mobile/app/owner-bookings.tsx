import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

type OwnerBooking = {
  _id: string;
  seatNumbers: number[];
  travelDate: string;
  totalAmount: number;
  status: string;
  userId?: {
    name: string;
    email: string;
    phone?: string;
  };
  busId?: {
    busName: string;
    busNumber: string;
    routeFrom: string;
    routeTo: string;
    departureTime: string;
  };
};

export default function OwnerBookings() {
  const [bookings, setBookings] = useState<OwnerBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOwnerBookings = async () => {
    try {
      const token = await AsyncStorage.getItem("ownerToken");

      const res = await API.get("/bookings/owner-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(res.data);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to load owner bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  const totalRevenue = bookings.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Owner Bookings</Text>

        <Text style={styles.icon}>🎫</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{bookings.length}</Text>
          <Text style={styles.statLabel}>Bookings</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>LKR {totalRevenue}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
      </View>

      {loading ? (
        <Text style={styles.loading}>Loading bookings...</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.busName}>
                    {item.busId?.busName || "Bus"}
                  </Text>

                  <Text style={styles.busNumber}>
                    {item.busId?.busNumber || "N/A"}
                  </Text>
                </View>

                <Text style={styles.status}>{item.status}</Text>
              </View>

              <View style={styles.routeBox}>
                <Text style={styles.route}>
                  {item.busId?.routeFrom} → {item.busId?.routeTo}
                </Text>
              </View>

              <Info label="Passenger" value={item.userId?.name || "N/A"} />
              <Info label="Email" value={item.userId?.email || "N/A"} />
              <Info label="Travel Date" value={item.travelDate} />
              <Info label="Seats" value={item.seatNumbers.join(", ")} />
              <Info label="Departure" value={item.busId?.departureTime || "N/A"} />
              <Info label="Amount" value={`LKR ${item.totalAmount}`} />
            </View>
          )}
        />
      )}
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
    paddingTop: 55,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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

  icon: {
    fontSize: 24,
  },

  statsRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 22,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },

  statValue: {
    color: "#1457D9",
    fontSize: 22,
    fontWeight: "900",
  },

  statLabel: {
    color: "#667085",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 5,
  },

  loading: {
    color: "#667085",
    textAlign: "center",
    marginTop: 40,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
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
    borderRadius: 20,
    padding: 15,
    marginBottom: 16,
  },

  route: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
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
    maxWidth: "60%",
    textAlign: "right",
  },
});