import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from "react-native";
import { darkTheme, lightTheme } from "../constants/colors";

export default function OwnerDashboard() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.bg }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: theme.text }]}>Owner Dashboard 🚌</Text>

      <Text style={[styles.subtitle, { color: theme.muted }]}>
        Manage your buses and bookings
      </Text>

      <View style={[styles.heroCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.heroTitle, { color: theme.primary }]}>
          Welcome, Bus Owner
        </Text>

        <Text style={[styles.heroText, { color: theme.muted }]}>
          Add buses, manage schedules, and track passenger bookings.
        </Text>

        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.primary }]}
          onPress={() => router.push("/add-bus")}
        >
          <Text style={styles.primaryButtonText}>Add New Bus +</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={styles.icon}>🚌</Text>
          <Text style={[styles.statNumber, { color: theme.text }]}>0</Text>
          <Text style={[styles.statLabel, { color: theme.muted }]}>Buses</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={styles.icon}>🎫</Text>
          <Text style={[styles.statNumber, { color: theme.text }]}>0</Text>
          <Text style={[styles.statLabel, { color: theme.muted }]}>Bookings</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={styles.icon}>💰</Text>
          <Text style={[styles.statNumber, { color: theme.text }]}>LKR 0</Text>
          <Text style={[styles.statLabel, { color: theme.muted }]}>Revenue</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={styles.icon}>⭐</Text>
          <Text style={[styles.statNumber, { color: theme.text }]}>4.8</Text>
          <Text style={[styles.statLabel, { color: theme.muted }]}>Rating</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.menuCard, { backgroundColor: theme.card }]}
        onPress={() => router.push("/add-bus")}
      >
        <Text style={[styles.menuText, { color: theme.text }]}>➕ Add Bus</Text>
        <Text style={[styles.menuArrow, { color: theme.primary }]}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.menuCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.menuText, { color: theme.text }]}>📋 My Buses</Text>
        <Text style={[styles.menuArrow, { color: theme.primary }]}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.menuCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.menuText, { color: theme.text }]}>🎫 Owner Bookings</Text>
        <Text style={[styles.menuArrow, { color: theme.primary }]}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.logoutButton, { borderColor: theme.primary }]}
        onPress={() => router.replace("/login")}
      >
        <Text style={[styles.logoutText, { color: theme.primary }]}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 22,
    paddingTop: 60,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 15,
    marginTop: 8,
    marginBottom: 24,
  },

  heroCard: {
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
  },

  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },

  heroText: {
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 20,
  },

  primaryButton: {
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#071A2F",
    fontSize: 17,
    fontWeight: "bold",
  },

  grid: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 14,
  },

  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
  },

  icon: {
    fontSize: 26,
    marginBottom: 10,
  },

  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
  },

  statLabel: {
    fontSize: 13,
    marginTop: 4,
  },

  menuCard: {
    borderRadius: 18,
    padding: 18,
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  menuText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  menuArrow: {
    fontSize: 30,
    fontWeight: "bold",
  },

  logoutButton: {
    marginTop: 24,
    padding: 15,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: "center",
  },

  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});