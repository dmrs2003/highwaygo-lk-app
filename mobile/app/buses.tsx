import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Available Buses</Text>

        <Text style={styles.filter}>🔎</Text>
      </View>

      <View style={styles.routeBox}>
        <View>
          <Text style={styles.routeCity}>Colombo</Text>
          <Text style={styles.routeSmall}>Western Province</Text>
        </View>

        <Text style={styles.arrow}>→</Text>

        <View>
          <Text style={styles.routeCity}>Kandy</Text>
          <Text style={styles.routeSmall}>Central Province</Text>
        </View>
      </View>

      <Text style={styles.countText}>
        {loading ? "Loading..." : `${buses.length} Buses Found`}
      </Text>

      <FlatList
        data={buses}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.topRow}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.busImage}
                resizeMode="cover"
              />

              <View style={styles.busInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.busName}>{item.busName}</Text>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>⭐ 4.6</Text>
                  </View>
                </View>

                <Text style={styles.busType}>
                  AC Seater • {item.totalSeats} Seats
                </Text>

                <View style={styles.timeRow}>
                  <View>
                    <Text style={styles.time}>{item.departureTime}</Text>
                    <Text style={styles.place}>{item.routeFrom}</Text>
                  </View>

                  <View style={styles.lineBox}>
                    <Text style={styles.duration}>3h 30m</Text>
                    <View style={styles.line} />
                  </View>

                  <View>
                    <Text style={styles.time}>{item.arrivalTime || "N/A"}</Text>
                    <Text style={styles.place}>{item.routeTo}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.bottomInfo}>
              <View>
                <Text style={styles.amenityTitle}>Amenities</Text>
                <Text style={styles.amenities}>❄️  💺  📶  🔌  🖥️</Text>
              </View>

              <Text style={styles.price}>LKR {item.price}</Text>
            </View>

            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => router.push(`/seat-selection?busId=${item._id}`)}
            >
              <Text style={styles.selectText}>Select Seats</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.bottomNav}>
        <NavItem icon="🏠" label="Home" onPress={() => router.push("/home")} />
        <NavItem icon="🎫" label="Bookings" />
        <NavItem icon="🏷️" label="Offers" />
        <NavItem icon="👤" label="Profile" />
      </View>
    </View>
  );
}

function NavItem({ icon, label, onPress }: any) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Text style={styles.navIcon}>{icon}</Text>
      <Text style={styles.navText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8FF",
    paddingTop: 55,
    paddingHorizontal: 18,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  back: {
    fontSize: 42,
    color: "#071A2F",
    fontWeight: "900",
  },

  title: {
    fontSize: 22,
    color: "#071A2F",
    fontWeight: "900",
  },

  filter: {
    fontSize: 22,
  },

  routeBox: {
    backgroundColor: "#1457D9",
    borderRadius: 22,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  routeCity: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  routeSmall: {
    color: "#CFE0FF",
    fontSize: 12,
    marginTop: 4,
  },

  arrow: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
  },

  countText: {
    color: "#071A2F",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 14,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 14,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },

  topRow: {
    flexDirection: "row",
  },

  busImage: {
    width: 110,
    height: 120,
    borderRadius: 18,
    marginRight: 14,
  },

  busInfo: {
    flex: 1,
  },

  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },

  busName: {
    color: "#071A2F",
    fontSize: 17,
    fontWeight: "900",
    flex: 1,
  },

  ratingBadge: {
    backgroundColor: "#FFF3D6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    height: 28,
  },

  ratingText: {
    color: "#F5A400",
    fontSize: 12,
    fontWeight: "900",
  },

  busType: {
    color: "#667085",
    fontSize: 13,
    marginTop: 6,
    fontWeight: "700",
  },

  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },

  time: {
    color: "#071A2F",
    fontSize: 15,
    fontWeight: "900",
  },

  place: {
    color: "#667085",
    fontSize: 12,
    marginTop: 3,
  },

  lineBox: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 8,
  },

  duration: {
    color: "#667085",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 5,
  },

  line: {
    width: "100%",
    height: 2,
    backgroundColor: "#D8E2F0",
  },

  bottomInfo: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  amenityTitle: {
    color: "#667085",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },

  amenities: {
    fontSize: 18,
  },

  price: {
    color: "#1457D9",
    fontSize: 20,
    fontWeight: "900",
  },

  selectButton: {
    backgroundColor: "#1457D9",
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 16,
  },

  selectText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 78,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navItem: {
    alignItems: "center",
  },

  navIcon: {
    fontSize: 22,
  },

  navText: {
    color: "#667085",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "700",
  },
});