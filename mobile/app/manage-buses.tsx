import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { router } from "expo-router";
import API from "../services/api";

type Bus = {
  _id: string;
  busName: string;
  busNumber: string;
  routeFrom: string;
  routeTo: string;
  departureTime: string;
  arrivalTime?: string;
  price: number;
  totalSeats: number;
  imageUrl: string;
};

export default function ManageBuses() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBuses = async () => {
    try {
      const res = await API.get("/buses");
      setBuses(res.data);
    } catch (error: any) {
      Alert.alert("Error", "Failed to load buses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Manage Buses</Text>

        <TouchableOpacity onPress={() => router.push("/add-bus")}>
          <Text style={styles.add}>＋</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        View, edit and manage your bus schedules
      </Text>

      {loading ? (
        <Text style={styles.loading}>Loading buses...</Text>
      ) : (
        <FlatList
          data={buses}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.image}
                resizeMode="cover"
              />

              <View style={styles.topRow}>
                <View>
                  <Text style={styles.busName}>{item.busName}</Text>
                  <Text style={styles.busNumber}>{item.busNumber}</Text>
                </View>

                <Text style={styles.price}>LKR {item.price}</Text>
              </View>

              <View style={styles.routeBox}>
                <Text style={styles.route}>
                  {item.routeFrom} → {item.routeTo}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Info label="Departure" value={item.departureTime} />
                <Info label="Arrival" value={item.arrivalTime || "N/A"} />
                <Info label="Seats" value={String(item.totalSeats)} />
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() =>
                    Alert.alert("Coming Soon", "Edit bus feature next")
                  }
                >
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.bookingsButton}
                  onPress={() =>
                    Alert.alert("Coming Soon", "Owner bookings feature next")
                  }
                >
                  <Text style={styles.bookingsText}>Bookings</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() =>
                    Alert.alert("Coming Soon", "Delete bus feature next")
                  }
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

function Info({ label, value }: any) {
  return (
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
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
  },

  back: {
    fontSize: 42,
    color: "#071A2F",
    fontWeight: "900",
  },

  title: {
    color: "#071A2F",
    fontSize: 24,
    fontWeight: "900",
  },

  add: {
    color: "#1457D9",
    fontSize: 36,
    fontWeight: "900",
  },

  subtitle: {
    color: "#667085",
    fontSize: 15,
    marginTop: 8,
    marginBottom: 22,
  },

  loading: {
    textAlign: "center",
    marginTop: 40,
    color: "#667085",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },

  image: {
    width: "100%",
    height: 175,
    borderRadius: 22,
    marginBottom: 16,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  busName: {
    color: "#071A2F",
    fontSize: 21,
    fontWeight: "900",
  },

  busNumber: {
    color: "#667085",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },

  price: {
    color: "#1457D9",
    fontSize: 18,
    fontWeight: "900",
  },

  routeBox: {
    backgroundColor: "#E8F1FF",
    padding: 14,
    borderRadius: 18,
    marginTop: 16,
  },

  route: {
    color: "#071A2F",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  infoLabel: {
    color: "#667085",
    fontSize: 12,
    fontWeight: "700",
  },

  infoValue: {
    color: "#071A2F",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 5,
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },

  editButton: {
    flex: 1,
    backgroundColor: "#1457D9",
    padding: 13,
    borderRadius: 15,
    alignItems: "center",
  },

  editText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  bookingsButton: {
    flex: 1,
    backgroundColor: "#071A2F",
    padding: 13,
    borderRadius: 15,
    alignItems: "center",
  },

  bookingsText: {
    color: "#FFD447",
    fontWeight: "900",
  },

  deleteButton: {
    flex: 1,
    backgroundColor: "#FFE8E8",
    padding: 13,
    borderRadius: 15,
    alignItems: "center",
  },

  deleteText: {
    color: "#E53935",
    fontWeight: "900",
  },
});