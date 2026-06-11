import { useEffect, useState } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

export default function OwnerDashboard() {
  const [busCount, setBusCount] = useState(0);
  const [owner, setOwner] = useState<any>(null);

  useEffect(() => {
    fetchOwnerProfile();
    fetchOwnerBuses();
  }, []);

  const fetchOwnerProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("ownerToken");

      if (!token) {
        router.replace("/owner-login");
        return;
      }

      const res = await API.get("/owners/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOwner(res.data);
    } catch (error: any) {
      console.log("OWNER PROFILE ERROR:", error.response?.data || error.message);
    }
  };

  const fetchOwnerBuses = async () => {
    try {
      const token = await AsyncStorage.getItem("ownerToken");

      if (!token) {
        router.replace("/owner-login");
        return;
      }

      const res = await API.get("/buses/owner/my-buses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBusCount(res.data.length);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to load dashboard"
      );
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("ownerToken");
    router.replace("/owner-login");
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>
              HighwayGo <Text style={styles.logoBlue}>LK</Text>
            </Text>
            <Text style={styles.subtitle}>Owner Control Center</Text>
          </View>

          <TouchableOpacity
            style={styles.profileCircle}
            onPress={() => router.push("/owner-profile")}
          >
            <Text style={styles.profileIcon}>🚌</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={require("../assets/images/index-bus.png")}
          style={styles.heroImage}
          resizeMode="cover"
        />

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>
            Welcome, {owner?.name || "Owner"} 👋
          </Text>

          <Text style={styles.heroText}>
            Manage your buses, routes, bookings and revenue from one dashboard.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/add-bus")}
          >
            <Text style={styles.primaryText}>➕ Add New Bus</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Business Overview</Text>

        <View style={styles.grid}>
          <StatCard icon="🚌" value={String(busCount)} label="Total Buses" />
          <StatCard icon="🎫" value="0" label="Bookings" />
        </View>

        <View style={styles.grid}>
          <StatCard icon="💰" value="LKR 0" label="Revenue" />
          <StatCard icon="⭐" value="4.8" label="Rating" />
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <MenuCard
          icon="➕"
          title="Add Bus"
          text="Create new bus route and schedule"
          onPress={() => router.push("/add-bus")}
        />

        <MenuCard
          icon="📋"
          title="My Buses"
          text="View and manage your buses"
          onPress={() => router.push("/manage-buses")}
        />

        <MenuCard
          icon="🎫"
          title="Passenger Bookings"
          text="Check seats and passenger reservations"
          onPress={() => router.push("/owner-bookings")}
        />

        <MenuCard
          icon="📍"
          title="Live Location"
          text="Update location from manage buses"
          onPress={() => router.push("/manage-buses")}
        />

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomNav}>
        <NavItem icon="🏠" label="Home" active onPress={() => router.push("/owner-dashboard")} />
        <NavItem icon="🚌" label="Buses" onPress={() => router.push("/manage-buses")} />
        <NavItem icon="🎫" label="Bookings" onPress={() => router.push("/owner-bookings")} />
        <NavItem icon="👤" label="Profile" onPress={() => router.push("/owner-profile")} />
      </View>
    </View>
  );
}

function StatCard({ icon, value, label }: any) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MenuCard({ icon, title, text, onPress }: any) {
  return (
    <TouchableOpacity style={styles.menuCard} onPress={onPress}>
      <View style={styles.menuIconBox}>
        <Text style={styles.menuIcon}>{icon}</Text>
      </View>

      <View style={styles.menuTextBox}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSub}>{text}</Text>
      </View>

      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );
}

function NavItem({ icon, label, active, onPress }: any) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Text style={active ? styles.navIconActive : styles.navIcon}>{icon}</Text>
      <Text style={active ? styles.navTextActive : styles.navText}>{label}</Text>
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
    fontSize: 25,
    fontWeight: "900",
    color: "#071A2F",
  },
  logoBlue: {
    color: "#1457D9",
  },
  subtitle: {
    color: "#667085",
    fontSize: 13,
    marginTop: 4,
    fontWeight: "700",
  },
  profileCircle: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#E8F1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  profileIcon: {
    fontSize: 24,
  },
  heroImage: {
    width: "100%",
    height: 190,
    borderRadius: 28,
    marginTop: 22,
    marginBottom: 20,
  },
  heroCard: {
    backgroundColor: "#1457D9",
    borderRadius: 28,
    padding: 22,
    marginBottom: 26,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
  },
  heroText: {
    color: "#DCE9FF",
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 18,
  },
  primaryButton: {
    backgroundColor: "#FFD447",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  primaryText: {
    color: "#071A2F",
    fontSize: 16,
    fontWeight: "900",
  },
  sectionTitle: {
    color: "#071A2F",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  statValue: {
    color: "#071A2F",
    fontSize: 22,
    fontWeight: "900",
  },
  statLabel: {
    color: "#667085",
    marginTop: 4,
    fontSize: 13,
    fontWeight: "700",
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  menuIconBox: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: "#E8F1FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuIcon: {
    fontSize: 24,
  },
  menuTextBox: {
    flex: 1,
  },
  menuTitle: {
    color: "#071A2F",
    fontSize: 17,
    fontWeight: "900",
  },
  menuSub: {
    color: "#667085",
    fontSize: 13,
    marginTop: 4,
    fontWeight: "600",
  },
  menuArrow: {
    color: "#1457D9",
    fontSize: 34,
    fontWeight: "900",
  },
  logoutButton: {
    borderWidth: 1.5,
    borderColor: "#1457D9",
    padding: 15,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 110,
  },
  logoutText: {
    color: "#1457D9",
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
});