import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import API from "../services/api";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Alert,
  Modal,
  FlatList,
} from "react-native";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [journeyDate, setJourneyDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [passengers, setPassengers] = useState(1);

  const [buses, setBuses] = useState<any[]>([]);
  const [routeModal, setRouteModal] = useState(false);
  const [selectType, setSelectType] = useState<"from" | "to">("from");

  useEffect(() => {
    loadUser();
    loadRoutes();
  }, []);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) return;

      const res = await API.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
    } catch (error) {
      console.log("USER LOAD ERROR:", error);
    }
  };

  const loadRoutes = async () => {
    try {
      const res = await API.get("/buses");
      setBuses(res.data);
    } catch (error) {
      console.log("ROUTES LOAD ERROR:", error);
    }
  };

  const departureList = [
    ...new Set(
      buses
        .filter((bus) => (to ? bus.routeTo === to : true))
        .map((bus) => bus.routeFrom)
        .filter((item) => item !== to)
    ),
  ];

  const destinationList = [
    ...new Set(
      buses
        .filter((bus) => (from ? bus.routeFrom === from : true))
        .map((bus) => bus.routeTo)
        .filter((item) => item !== from)
    ),
  ];

  const handleSearch = () => {
    if (!from || !to) {
      Alert.alert("Error", "Please select departure and destination");
      return;
    }

    router.push(
      `/buses?from=${from}&to=${to}&date=${
        journeyDate.toISOString().split("T")[0]
      }&passengers=${passengers}` as any
    );
  };

  const handleSelectRoute = (item: string) => {
    if (selectType === "from") {
      setFrom(item);

      if (to === item) {
        setTo("");
      }
    } else {
      setTo(item);

      if (from === item) {
        setFrom("");
      }
    }

    setRouteModal(false);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.logo}>
            HighwayGo <Text style={styles.logoBlue}>LK</Text>
          </Text>

          <Text style={styles.bell}>🔔</Text>
        </View>

        <Image
          source={require("../assets/images/index-bus.png")}
          style={styles.heroImage}
          resizeMode="cover"
        />

        <View style={styles.greetingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>
              Hello, {user?.name || "Passenger"} 👋
            </Text>

            <Text style={styles.subGreeting}>
              Where would you like to travel today?
            </Text>
          </View>

          <TouchableOpacity
            style={styles.profileCircle}
            onPress={() => router.push("/profile")}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchCard}>
          <TouchableOpacity
            style={styles.inputRow}
            onPress={() => {
              setSelectType("from");
              setRouteModal(true);
            }}
          >
            <View style={styles.infoIcon}>
              <Text>📍</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>From</Text>
              <Text style={styles.locationText}>
                {from || "Select Departure"}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.inputRow}
            onPress={() => {
              setSelectType("to");
              setRouteModal(true);
            }}
          >
            <View style={styles.infoIcon}>
              <Text>📍</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>To</Text>
              <Text style={styles.locationText}>
                {to || "Select Destination"}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.grid}>
            <TouchableOpacity
              style={styles.infoBox}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.boxIcon}>📅</Text>
              <Text style={styles.infoLabel}>Journey Date</Text>
              <Text style={styles.infoValue}>
                {journeyDate.toDateString()}
              </Text>
            </TouchableOpacity>

            <View style={styles.passengerBox}>
              <Text style={styles.boxIcon}>👤</Text>
              <Text style={styles.infoLabel}>Passengers</Text>

              <View style={styles.counterRow}>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() =>
                    setPassengers(Math.max(1, passengers - 1))
                  }
                >
                  <Text style={styles.counterText}>−</Text>
                </TouchableOpacity>

                <Text style={styles.passengerCount}>{passengers}</Text>

                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => setPassengers(passengers + 1)}
                >
                  <Text style={styles.counterText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={journeyDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              minimumDate={new Date()}
              themeVariant="light"
              textColor="#071A2F"
              accentColor="#1457D9"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);

                if (selectedDate) {
                  setJourneyDate(selectedDate);
                }
              }}
            />
          )}

          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchText}>🔍 Search Buses</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Why Choose Us?</Text>

        <View style={styles.featureRow}>
          <FeatureCard icon="🛡️" title="Secure" text="Safe booking" />
          <FeatureCard icon="⏱️" title="Fast" text="Quick seats" />
          <FeatureCard icon="📍" title="Tracking" text="Live GPS" />
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <NavItem
          icon="🏠"
          label="Home"
          active
          onPress={() => router.push("/home")}
        />

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

      <Modal visible={routeModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Select {selectType === "from" ? "Departure" : "Destination"}
            </Text>

            <FlatList
              data={selectType === "from" ? departureList : destinationList}
              keyExtractor={(item) => item}
              ListEmptyComponent={
                <Text style={styles.emptyRoute}>
                  No routes available
                </Text>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.routeItem}
                  onPress={() => handleSelectRoute(item)}
                >
                  <Text style={styles.routeItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setRouteModal(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function FeatureCard({ icon, title, text }: any) {
  return (
    <View style={styles.featureCard}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

function NavItem({ icon, label, active, onPress }: any) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Text style={active ? styles.navIconActive : styles.navIcon}>
        {icon}
      </Text>

      <Text style={active ? styles.navTextActive : styles.navText}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
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

  logo: {
    fontSize: 24,
    fontWeight: "900",
    color: "#071A2F",
  },

  logoBlue: {
    color: "#1457D9",
  },

  bell: {
    fontSize: 24,
  },

  heroImage: {
    width: "100%",
    height: 210,
    borderRadius: 28,
    marginTop: 22,
  },

  greetingRow: {
    marginTop: 26,
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greeting: {
    fontSize: 26,
    fontWeight: "900",
    color: "#071A2F",
  },

  subGreeting: {
    color: "#667085",
    marginTop: 5,
  },

  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: "#E8F1FF",
    alignItems: "center",
    justifyContent: "center",
  },

  profileIcon: {
    fontSize: 22,
  },

  searchCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
    marginBottom: 26,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  infoIcon: {
    width: 44,
    height: 44,
    backgroundColor: "#E8F1FF",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  infoLabel: {
    color: "#667085",
    fontSize: 12,
    fontWeight: "700",
  },

  locationText: {
    color: "#071A2F",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 4,
  },

  infoValue: {
    color: "#071A2F",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5EAF2",
    marginVertical: 16,
  },

  grid: {
    flexDirection: "row",
    gap: 14,
    marginTop: 4,
  },

  infoBox: {
    flex: 1,
    backgroundColor: "#F8FBFF",
    borderRadius: 18,
    padding: 15,
  },

  passengerBox: {
    flex: 1,
    backgroundColor: "#F8FBFF",
    borderRadius: 18,
    padding: 15,
  },

  boxIcon: {
    fontSize: 22,
    marginBottom: 8,
  },

  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 12,
  },

  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#1457D9",
    alignItems: "center",
    justifyContent: "center",
  },

  counterText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  passengerCount: {
    color: "#071A2F",
    fontSize: 20,
    fontWeight: "900",
  },

  searchButton: {
    backgroundColor: "#1457D9",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 18,
  },

  searchText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  sectionTitle: {
    color: "#071A2F",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 16,
  },

  featureRow: {
    flexDirection: "row",
    gap: 12,
    paddingBottom: 110,
  },

  featureCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
  },

  featureIcon: {
    fontSize: 28,
    marginBottom: 8,
  },

  featureTitle: {
    color: "#071A2F",
    fontWeight: "900",
    fontSize: 14,
  },

  featureText: {
    color: "#667085",
    fontSize: 12,
    marginTop: 4,
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    height: 78,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  navItem: {
    alignItems: "center",
  },

  navIcon: {
    fontSize: 22,
    opacity: 0.55,
  },

  navIconActive: {
    fontSize: 24,
  },

  navText: {
    color: "#667085",
    fontSize: 12,
    marginTop: 4,
  },

  navTextActive: {
    color: "#1457D9",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "900",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    maxHeight: "65%",
  },

  modalTitle: {
    color: "#071A2F",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 18,
  },

  routeItem: {
    backgroundColor: "#F4F8FF",
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
  },

  routeItemText: {
    color: "#071A2F",
    fontSize: 17,
    fontWeight: "900",
  },

  emptyRoute: {
    color: "#667085",
    textAlign: "center",
    marginVertical: 25,
    fontWeight: "800",
  },

  closeButton: {
    backgroundColor: "#1457D9",
    padding: 15,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 10,
  },

  closeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});