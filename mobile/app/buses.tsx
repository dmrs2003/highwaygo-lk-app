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
};

export default function Buses() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBuses = async () => {
    try {
      const res = await API.get("/buses");
      setBuses(res.data);
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to load buses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Buses 🚍</Text>

      {loading ? (
        <Text style={styles.loading}>Loading buses...</Text>
      ) : (
        <FlatList
          data={buses}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.busName}>{item.busName}</Text>
              <Text style={styles.busNumber}>{item.busNumber}</Text>

              <Text style={styles.route}>
                {item.routeFrom} → {item.routeTo}
              </Text>

              <Text style={styles.info}>Departure: {item.departureTime}</Text>
              <Text style={styles.info}>Arrival: {item.arrivalTime || "N/A"}</Text>
              <Text style={styles.price}>LKR {item.price}</Text>
              <Text style={styles.info}>Seats: {item.totalSeats}</Text>

              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/home")}>
        <Text style={styles.backText}>Back Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1E3D",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    color: "#FFD447",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  loading: {
    color: "#fff",
    textAlign: "center",
    marginTop: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
  },
  busName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0B1E3D",
  },
  busNumber: {
    color: "#555",
    marginBottom: 10,
  },
  route: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0B1E3D",
    marginBottom: 10,
  },
  info: {
    fontSize: 15,
    color: "#333",
    marginBottom: 5,
  },
  price: {
    fontSize: 18,
    color: "#0B1E3D",
    fontWeight: "bold",
    marginVertical: 8,
  },
  button: {
    backgroundColor: "#FFD447",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#0B1E3D",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    borderWidth: 1,
    borderColor: "#FFD447",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  backText: {
    color: "#FFD447",
    fontWeight: "bold",
  },
});