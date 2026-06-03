import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import API from "../services/api";
import PremiumLoader from "../components/PremiumLoader";

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
  const { from, to, date, passengers } = useLocalSearchParams<{
    from?: string;
    to?: string;
    date?: string;
    passengers?: string;
  }>();

  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState<"default" | "low" | "high">(
    "default"
  );

  const travelDate = date || new Date().toISOString().split("T")[0];
  const passengerCount = passengers || "1";

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/buses");
      setBuses(res.data);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to load buses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();

    if (from || to) {
      setSearch(`${from || ""} ${to || ""}`.trim());
    }
  }, []);

  const filteredBuses = useMemo(() => {
    let result = buses.filter((bus) => {
      const allText = `${bus.busName} ${bus.busNumber} ${bus.routeFrom} ${bus.routeTo}`.toLowerCase();

      const searchText = search.toLowerCase();

      const matchesSearch = allText.includes(searchText);

      const matchesFrom = from
        ? bus.routeFrom.toLowerCase().includes(String(from).toLowerCase())
        : true;

      const matchesTo = to
        ? bus.routeTo.toLowerCase().includes(String(to).toLowerCase())
        : true;

      return matchesSearch && matchesFrom && matchesTo;
    });

    if (sortType === "low") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sortType === "high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [buses, search, sortType, from, to]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Available Buses</Text>

        <TouchableOpacity onPress={fetchBuses}>
          <Text style={styles.filter}>↻</Text>
        </TouchableOpacity>
      </View>

      {(from || to) && (
        <View style={styles.routeBox}>
          <View>
            <Text style={styles.routeLabel}>From</Text>
            <Text style={styles.routeValue}>{from || "Any"}</Text>
          </View>

          <Text style={styles.routeArrow}>→</Text>

          <View>
            <Text style={styles.routeLabel}>To</Text>
            <Text style={styles.routeValue}>{to || "Any"}</Text>
          </View>
        </View>
      )}

      <View style={styles.tripInfoRow}>
        <View style={styles.tripInfoCard}>
          <Text style={styles.tripInfoLabel}>Date</Text>
          <Text style={styles.tripInfoValue}>{travelDate}</Text>
        </View>

        <View style={styles.tripInfoCard}>
          <Text style={styles.tripInfoLabel}>Passengers</Text>
          <Text style={styles.tripInfoValue}>{passengerCount}</Text>
        </View>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search route, bus name, number..."
          placeholderTextColor="#8A98AA"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filterRow}>
        <FilterChip
          label="Default"
          active={sortType === "default"}
          onPress={() => setSortType("default")}
        />

        <FilterChip
          label="Low Price"
          active={sortType === "low"}
          onPress={() => setSortType("low")}
        />

        <FilterChip
          label="High Price"
          active={sortType === "high"}
          onPress={() => setSortType("high")}
        />
      </View>

      <Text style={styles.countText}>
        {loading ? "Loading..." : `${filteredBuses.length} Buses Found`}
      </Text>

      {loading ? (
        <PremiumLoader />
      ) : (
        <FlatList
          data={filteredBuses}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 110 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No buses found</Text>
          }
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
                      <Text style={styles.duration}>Express</Text>
                      <View style={styles.line} />
                    </View>

                    <View>
                      <Text style={styles.time}>
                        {item.arrivalTime || "N/A"}
                      </Text>
                      <Text style={styles.place}>{item.routeTo}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.bottomInfo}>
                <View>
                  <Text style={styles.amenityTitle}>Amenities</Text>
                  <Text style={styles.amenities}>❄️  💺  📶  🔌</Text>
                </View>

                <Text style={styles.price}>LKR {item.price}</Text>
              </View>

              <TouchableOpacity
                style={styles.selectButton}
                onPress={() =>
                  router.push(
                    `/seat-selection?busId=${item._id}&passengers=${passengerCount}&date=${travelDate}` as any
                  )
                }
              >
                <Text style={styles.selectText}>Select Seats</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <View style={styles.bottomNav}>
        <NavItem icon="🏠" label="Home" onPress={() => router.push("/home")} />

        <NavItem
          icon="🎫"
          label="Bookings"
          onPress={() => router.push("/my-bookings" as any)}
        />

        <NavItem icon="🏷️" label="Offers" />

        <NavItem
          icon="👤"
          label="Profile"
          onPress={() => router.push("/profile")}
        />
      </View>
    </View>
  );
}

function FilterChip({ label, active, onPress }: any) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.activeChip]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, active && styles.activeChipText]}>
        {label}
      </Text>
    </TouchableOpacity>
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
    fontSize: 26,
    color: "#1457D9",
    fontWeight: "900",
  },

  routeBox: {
    backgroundColor: "#1457D9",
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  routeLabel: {
    color: "#CFE0FF",
    fontSize: 12,
    fontWeight: "800",
  },

  routeValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 4,
  },

  routeArrow: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
  },

  tripInfoRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },

  tripInfoCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
  },

  tripInfoLabel: {
    color: "#667085",
    fontSize: 12,
    fontWeight: "800",
  },

  tripInfoValue: {
    color: "#071A2F",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 5,
  },

  searchBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#071A2F",
    fontWeight: "700",
  },

  filterRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8E2F0",
  },

  activeChip: {
    backgroundColor: "#1457D9",
    borderColor: "#1457D9",
  },

  chipText: {
    color: "#667085",
    fontSize: 13,
    fontWeight: "900",
  },

  activeChipText: {
    color: "#FFFFFF",
  },

  countText: {
    color: "#071A2F",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 14,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#667085",
    fontWeight: "800",
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
    backgroundColor: "#E8F1FF",
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
    opacity: 0.75,
  },

  navText: {
    color: "#667085",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "700",
  },
});