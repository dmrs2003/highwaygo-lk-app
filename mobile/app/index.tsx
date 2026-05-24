import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useColorScheme,
  ScrollView,
} from "react-native";
import { Colors } from "../constants/colors";

export default function Index() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={require("../assets/images/ChatGPT Image May 6, 2026, 08_39_26 AM.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={[styles.title, { color: theme.text }]}>
        HighwayGo LK
      </Text>

      <Text style={[styles.subtitle, { color: theme.icon }]}>
        Smart highway bus booking, seat selection and live tracking for Sri Lanka.
      </Text>

      <View style={styles.badgeRow}>
        <View style={[styles.badge, { backgroundColor: theme.tint }]}>
          <Text style={styles.badgeText}>🎫 Seat Booking</Text>
        </View>

        <View style={[styles.badge, { backgroundColor: theme.tint }]}>
          <Text style={styles.badgeText}>📍 Live Tracking</Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.background }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Continue as Passenger
        </Text>

        <Text style={[styles.cardText, { color: theme.icon }]}>
          Search buses, select seats and manage your tickets.
        </Text>

        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.tint }]}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.primaryButtonText}>Passenger Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.outlineButton, { borderColor: theme.tint }]}
          onPress={() => router.push("/register")}
        >
          <Text style={[styles.outlineText, { color: theme.tint }]}>
            Create Passenger Account
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: theme.background }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Bus Owner Portal
        </Text>

        <Text style={[styles.cardText, { color: theme.icon }]}>
          Add buses, manage routes and view bookings after admin approval.
        </Text>

        <TouchableOpacity
          style={[styles.ownerButton, { backgroundColor: "#0E2A47" }]}
          onPress={() => router.push("/owner-login")}
        >
          <Text style={styles.ownerButtonText}>Owner Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/owner-register")}>
          <Text style={[styles.ownerLink, { color: theme.tint }]}>
            Register as Bus Owner
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.footer, { color: theme.icon }]}>
        Fast • Secure • Smart Travel
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 55,
    alignItems: "center",
  },

  logo: {
    width: 170,
    height: 170,
    marginBottom: 5,
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 18,
  },

  badgeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },

  badgeText: {
    color: "#071A2F",
    fontWeight: "bold",
    fontSize: 12,
  },

  card: {
    width: "100%",
    borderRadius: 24,
    padding: 22,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.25)",
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },

  cardText: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },

  primaryButton: {
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },

  primaryButtonText: {
    color: "#071A2F",
    fontSize: 17,
    fontWeight: "bold",
  },

  outlineButton: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: "center",
  },

  outlineText: {
    fontSize: 15,
    fontWeight: "bold",
  },

  ownerButton: {
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 14,
  },

  ownerButtonText: {
    color: "#FFD447",
    fontSize: 17,
    fontWeight: "bold",
  },

  ownerLink: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
  },

  footer: {
    marginTop: 6,
    marginBottom: 20,
    fontSize: 13,
    fontWeight: "600",
  },
});