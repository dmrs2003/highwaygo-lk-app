import { router } from "expo-router";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useColorScheme,
  ScrollView,
  View,
} from "react-native";
import { Colors } from "../constants/colors";

export default function Index() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: "#F4F8FF" },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={require("../assets/images/index-bus.png")}
        style={styles.heroImage}
        resizeMode="cover"
      />

      <Text style={styles.title}>HighwayGo LK</Text>

      <Text style={styles.subtitle}>
        Smart highway bus booking with modern seat selection and secure travel experience.
      </Text>

      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🎫 Smart Booking</Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>📍 Live Tracking</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardIcon}>👤</Text>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Passenger Portal</Text>
          <Text style={styles.cardText}>
            Search buses, select seats, make payments and manage bookings.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.primaryText}>Passenger Login ›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.outlineText}>Create Passenger Account ›</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.ownerIcon}>🚌</Text>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Bus Owner Portal</Text>
          <Text style={styles.cardText}>
            Add buses, manage routes and track passenger bookings.
          </Text>

          <TouchableOpacity
            style={styles.ownerButton}
            onPress={() => router.push("/owner-login")}
          >
            <Text style={styles.ownerText}>Owner Login ›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ownerOutline}
            onPress={() => router.push("/owner-register")}
          >
            <Text style={styles.ownerOutlineText}>Register as Bus Owner ›</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.features}>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🛡️</Text>
          <Text style={styles.featureTitle}>Fast</Text>
          <Text style={styles.featureText}>Quick and easy booking</Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🔒</Text>
          <Text style={styles.featureTitle}>Secure</Text>
          <Text style={styles.featureText}>Safe payments</Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>📍</Text>
          <Text style={styles.featureTitle}>Smart</Text>
          <Text style={styles.featureText}>Live tracking</Text>
        </View>
      </View>

      <Text style={styles.footer}>© 2026 HighwayGo LK</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 25,
    alignItems: "center",
  },

  heroImage: {
    width: "100%",
    height: 260,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    marginBottom: 24,
  },

  title: {
    fontSize: 42,
    fontWeight: "900",
    color: "#071A2F",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 17,
    color: "#4B5B73",
    textAlign: "center",
    lineHeight: 26,
    paddingHorizontal: 28,
    marginBottom: 22,
  },

  badgeRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },

  badge: {
    backgroundColor: "#E8F1FF",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 30,
  },

  badgeText: {
    color: "#0B4FD8",
    fontSize: 14,
    fontWeight: "800",
  },

  card: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 22,
    marginBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },

  cardIcon: {
    fontSize: 58,
    backgroundColor: "#E8F1FF",
    padding: 18,
    borderRadius: 60,
    marginRight: 18,
  },

  ownerIcon: {
    fontSize: 52,
    backgroundColor: "#FFF1B8",
    padding: 18,
    borderRadius: 60,
    marginRight: 18,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#071A2F",
    marginBottom: 8,
  },

  cardText: {
    fontSize: 14,
    color: "#4B5B73",
    lineHeight: 21,
    marginBottom: 14,
  },

  primaryButton: {
    backgroundColor: "#1457D9",
    padding: 14,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 10,
  },

  primaryText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 15,
  },

  outlineButton: {
    borderWidth: 1.5,
    borderColor: "#1457D9",
    padding: 13,
    borderRadius: 15,
    alignItems: "center",
  },

  outlineText: {
    color: "#1457D9",
    fontWeight: "900",
    fontSize: 14,
  },

  ownerButton: {
    backgroundColor: "#071A2F",
    padding: 14,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 10,
  },

  ownerText: {
    color: "#FFD447",
    fontWeight: "900",
    fontSize: 15,
  },

  ownerOutline: {
    borderWidth: 1.5,
    borderColor: "#F5A400",
    padding: 13,
    borderRadius: 15,
    alignItems: "center",
  },

  ownerOutlineText: {
    color: "#F5A400",
    fontWeight: "900",
    fontSize: 14,
  },

  features: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 24,
  },

  featureItem: {
    width: "30%",
    alignItems: "center",
  },

  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },

  featureTitle: {
    color: "#071A2F",
    fontSize: 16,
    fontWeight: "900",
  },

  featureText: {
    color: "#4B5B73",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },

  footer: {
    color: "#667085",
    fontSize: 13,
    fontWeight: "600",
  },
});