import { router, useLocalSearchParams } from "expo-router";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
} from "react-native";

export default function BookingSuccess() {
  const { seats, date, amount } = useLocalSearchParams<{
    seats?: string;
    date?: string;
    amount?: string;
  }>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.successCircle}>
        <Text style={styles.check}>✓</Text>
      </View>

      <Text style={styles.title}>Booking Confirmed!</Text>

      <Text style={styles.subtitle}>
        Your HighwayGo LK ticket has been booked successfully.
      </Text>

      <View style={styles.ticketCard}>
        <View style={styles.ticketHeader}>
          <Text style={styles.ticketTitle}>🎫 Digital Ticket</Text>
          <Text style={styles.status}>CONFIRMED</Text>
        </View>

        <View style={styles.routeBox}>
          <View>
            <Text style={styles.city}>Colombo</Text>
            <Text style={styles.small}>From</Text>
          </View>

          <Text style={styles.arrow}>→</Text>

          <View>
            <Text style={styles.city}>Kandy</Text>
            <Text style={styles.small}>To</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <InfoRow label="Seats" value={seats || "N/A"} />
        <InfoRow label="Travel Date" value={date || "N/A"} />
        <InfoRow label="Payment" value={`LKR ${amount || "0"}`} />
        <InfoRow label="Booking ID" value="HG-LK-2026" />

        <View style={styles.qrBox}>
          <Text style={styles.qrText}>▦ ▦ ▦ ▦ ▦</Text>
          <Text style={styles.qrSub}>Show this ticket before boarding</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.downloadButton}>
        <Text style={styles.downloadText}>Download PDF Receipt</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.emailButton}>
        <Text style={styles.emailText}>Email Receipt</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.push("/home")}
      >
        <Text style={styles.homeText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoRow({ label, value }: any) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F4F8FF",
    padding: 24,
    paddingTop: 70,
    alignItems: "center",
  },

  successCircle: {
    width: 115,
    height: 115,
    borderRadius: 60,
    backgroundColor: "#00A86B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
    shadowColor: "#00A86B",
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },

  check: {
    color: "#FFFFFF",
    fontSize: 64,
    fontWeight: "900",
  },

  title: {
    color: "#071A2F",
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    color: "#667085",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 28,
  },

  ticketCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 24,
    marginBottom: 22,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },

  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  ticketTitle: {
    color: "#071A2F",
    fontSize: 22,
    fontWeight: "900",
  },

  status: {
    backgroundColor: "#E2F8EF",
    color: "#00A86B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    fontSize: 12,
    fontWeight: "900",
  },

  routeBox: {
    backgroundColor: "#1457D9",
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  city: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  small: {
    color: "#CFE0FF",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "700",
  },

  arrow: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5EAF2",
    marginVertical: 20,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  label: {
    color: "#667085",
    fontSize: 14,
    fontWeight: "700",
  },

  value: {
    color: "#071A2F",
    fontSize: 15,
    fontWeight: "900",
  },

  qrBox: {
    backgroundColor: "#F8FBFF",
    borderRadius: 22,
    padding: 20,
    alignItems: "center",
    marginTop: 14,
  },

  qrText: {
    color: "#071A2F",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 4,
  },

  qrSub: {
    color: "#667085",
    marginTop: 8,
    fontSize: 13,
    fontWeight: "700",
  },

  downloadButton: {
    width: "100%",
    backgroundColor: "#1457D9",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 12,
  },

  downloadText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  emailButton: {
    width: "100%",
    backgroundColor: "#071A2F",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 12,
  },

  emailText: {
    color: "#FFD447",
    fontSize: 17,
    fontWeight: "900",
  },

  homeButton: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#1457D9",
    padding: 15,
    borderRadius: 18,
    alignItems: "center",
  },

  homeText: {
    color: "#1457D9",
    fontSize: 16,
    fontWeight: "900",
  },
});