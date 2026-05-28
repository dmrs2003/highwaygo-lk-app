import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.settings}>⚙️</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>

          <Text style={styles.name}>Passenger Account</Text>
          <Text style={styles.email}>HighwayGo LK User</Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>Verified Passenger</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Account</Text>

        <MenuItem
          icon="🎫"
          title="My Bookings"
          subtitle="View tickets and receipts"
          onPress={() => router.push("/my-bookings" as any)}
        />

        <MenuItem
          icon="🚌"
          title="Browse Buses"
          subtitle="Search highway buses"
          onPress={() => router.push("/buses")}
        />

        <MenuItem
          icon="💳"
          title="Payment Methods"
          subtitle="Demo sandbox cards"
        />

        <Text style={styles.sectionTitle}>Preferences</Text>

        <MenuItem icon="🌙" title="Theme" subtitle="Light mode enabled" />

        <MenuItem
          icon="🔔"
          title="Notifications"
          subtitle="Booking alerts and reminders"
        />

        <Text style={styles.sectionTitle}>Support</Text>

        <MenuItem icon="❓" title="Help Center" subtitle="Get support and FAQs" />

        <MenuItem
          icon="ℹ️"
          title="About HighwayGo LK"
          subtitle="Version 1.0.0"
        />

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>Fast • Secure • Smart Travel</Text>
      </ScrollView>

      <View style={styles.bottomNav}>
        <NavItem icon="🏠" label="Home" onPress={() => router.push("/home")} />

        <NavItem
          icon="🎫"
          label="Bookings"
          onPress={() => router.push("/my-bookings" as any)}
        />

        <NavItem icon="🏷️" label="Offers" />

        <NavItem icon="👤" label="Profile" active />
      </View>
    </View>
  );
}

function MenuItem({ icon, title, subtitle, onPress }: any) {
  return (
    <TouchableOpacity style={styles.menuCard} onPress={onPress}>
      <View style={styles.menuIconBox}>
        <Text style={styles.menuIcon}>{icon}</Text>
      </View>

      <View style={styles.menuTextBox}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSub}>{subtitle}</Text>
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

  title: {
    color: "#071A2F",
    fontSize: 32,
    fontWeight: "900",
  },

  settings: {
    fontSize: 26,
  },

  profileCard: {
    backgroundColor: "#1457D9",
    borderRadius: 30,
    padding: 26,
    alignItems: "center",
    marginTop: 22,
    marginBottom: 26,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  avatarText: {
    fontSize: 45,
  },

  name: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },

  email: {
    color: "#DCE9FF",
    marginTop: 6,
    fontSize: 14,
    fontWeight: "700",
  },

  badge: {
    backgroundColor: "#FFD447",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
  },

  badgeText: {
    color: "#071A2F",
    fontSize: 13,
    fontWeight: "900",
  },

  sectionTitle: {
    color: "#071A2F",
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 14,
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
    backgroundColor: "#FFE8E8",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 14,
    marginBottom: 18,
  },

  logoutText: {
    color: "#E53935",
    fontSize: 17,
    fontWeight: "900",
  },

  footer: {
    color: "#667085",
    textAlign: "center",
    marginBottom: 110,
    fontWeight: "700",
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