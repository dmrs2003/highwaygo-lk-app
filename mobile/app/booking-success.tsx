import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from "react-native";
import { Colors } from "../constants/colors";

export default function BookingSuccess() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  const { seats, date } = useLocalSearchParams<{
    seats?: string;
    date?: string;
  }>();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <View style={styles.successCircle}>
        <Text style={styles.check}>✓</Text>
      </View>

      <Text style={[styles.title, { color: theme.text }]}>
        Booking Confirmed!
      </Text>

      <Text style={[styles.subtitle, { color: theme.icon }]}>
        Your HighwayGo LK ticket has been successfully booked.
      </Text>

      <View style={[styles.ticketCard, { backgroundColor: theme.background }]}>
        <Text style={[styles.ticketTitle, { color: theme.tint }]}>
          🎫 Digital Ticket
        </Text>

        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.icon }]}>Seats</Text>
          <Text style={[styles.value, { color: theme.text }]}>
            {seats || "N/A"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.icon }]}>Travel Date</Text>
          <Text style={[styles.value, { color: theme.text }]}>
            {date || "N/A"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.icon }]}>Status</Text>
          <Text style={[styles.status]}>Confirmed</Text>
        </View>

        <View style={styles.divider} />

        <Text style={[styles.note, { color: theme.icon }]}>
          A receipt will be available for download and can be sent to your email.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: theme.tint }]}
        onPress={() => router.push("/home")}
      >
        <Text style={styles.primaryText}>Back to Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.outlineButton, { borderColor: theme.tint }]}
        onPress={() => router.push("/buses")}
      >
        <Text style={[styles.outlineText, { color: theme.tint }]}>
          Book Another Bus
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 80,
    alignItems: "center",
  },

  successCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#00C853",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
  },

  check: {
    color: "#fff",
    fontSize: 60,
    fontWeight: "bold",
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 28,
  },

  ticketCard: {
    width: "100%",
    borderRadius: 26,
    padding: 24,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.25)",
  },

  ticketTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 22,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  label: {
    fontSize: 15,
  },

  value: {
    fontSize: 16,
    fontWeight: "bold",
  },

  status: {
    color: "#00C853",
    fontSize: 16,
    fontWeight: "bold",
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(150,150,150,0.25)",
    marginVertical: 14,
  },

  note: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },

  primaryButton: {
    width: "100%",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 14,
  },

  primaryText: {
    color: "#071A2F",
    fontSize: 17,
    fontWeight: "bold",
  },

  outlineButton: {
    width: "100%",
    padding: 15,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: "center",
  },

  outlineText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});