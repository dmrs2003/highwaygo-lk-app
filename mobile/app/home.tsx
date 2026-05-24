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
import { darkTheme, lightTheme } from "@/constants/colors";
export default function Home() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.bg },
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

      <Text style={[styles.subtitle, { color: theme.muted }]}>
        Book highway buses across Sri Lanka with smart seat booking and live tracking.
      </Text>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.primary }]}>
          Where are you going today?
        </Text>

        <Text style={[styles.cardText, { color: theme.muted }]}>
          Find buses, select seats, and confirm your trip easily.
        </Text>

        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.primary }]}
          onPress={() => router.push("/buses")}
        >
          <Text style={styles.primaryButtonText}>View Buses 🚍</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <View style={[styles.smallCard, { backgroundColor: theme.card }]}>
          <Text style={styles.icon}>🎫</Text>
          <Text style={[styles.smallTitle, { color: theme.text }]}>Bookings</Text>
          <Text style={[styles.smallText, { color: theme.muted }]}>Your tickets</Text>
        </View>

        <View style={[styles.smallCard, { backgroundColor: theme.card }]}>
          <Text style={styles.icon}>📍</Text>
          <Text style={[styles.smallTitle, { color: theme.text }]}>Tracking</Text>
          <Text style={[styles.smallText, { color: theme.muted }]}>Live bus GPS</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.outlineButton, { borderColor: theme.primary }]}
        onPress={() => router.replace("/login")}
      >
        <Text style={[styles.outlineText, { color: theme.primary }]}>
          Logout
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 22,
    paddingTop: 60,
    alignItems: "center",
  },

  logo: {
    width: 170,
    height: 170,
    marginBottom: 10,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 28,
  },

  card: {
    width: "100%",
    borderRadius: 22,
    padding: 22,
    marginBottom: 18,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  cardText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },

  primaryButton: {
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#071A2F",
    fontSize: 17,
    fontWeight: "bold",
  },

  grid: {
    width: "100%",
    flexDirection: "row",
    gap: 14,
    marginBottom: 18,
  },

  smallCard: {
    flex: 1,
    borderRadius: 18,
    padding: 18,
  },

  icon: {
    fontSize: 28,
    marginBottom: 10,
  },

  smallTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  smallText: {
    marginTop: 5,
    fontSize: 13,
  },

  outlineButton: {
    width: "100%",
    padding: 14,
    borderRadius: 15,
    borderWidth: 1.5,
    alignItems: "center",
    marginTop: 10,
  },

  outlineText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});