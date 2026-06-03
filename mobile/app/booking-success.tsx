import { router, useLocalSearchParams } from "expo-router";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
  Linking,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

export default function BookingSuccess() {
  const { bookingId, seats, date, amount } = useLocalSearchParams<{
    bookingId?: string;
    seats?: string;
    date?: string;
    amount?: string;
  }>();

  const downloadReceipt = async () => {
    if (!bookingId) {
      Alert.alert("Error", "Booking ID not found");
      return;
    }

    try {
      const receiptUrl = `${API.defaults.baseURL}/bookings/receipt/${bookingId}`;
      await Linking.openURL(receiptUrl);
    } catch (error) {
      Alert.alert("Error", "Failed to open receipt");
    }
  };

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

        <InfoRow label="Booking ID" value={bookingId || "N/A"} />
        <InfoRow label="Seats" value={seats || "N/A"} />
        <InfoRow label="Travel Date" value={date || "N/A"} />
        <InfoRow label="Payment" value={`LKR ${amount || "0"}`} />

        <View style={styles.qrBox}>
          <Text style={styles.qrText}>▦ ▦ ▦ ▦ ▦</Text>
          <Text style={styles.qrSub}>Show this ticket before boarding</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.downloadButton} onPress={downloadReceipt}>
        <Text style={styles.downloadText}>Download PDF Receipt</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.replace("/my-bookings" as any)}
      >
        <Text style={styles.homeText}>Go to My Bookings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.outlineButton}
        onPress={() => router.replace("/home")}
      >
        <Text style={styles.outlineText}>Back to Home</Text>
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
    marginBottom: 20,
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

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 16,
  },

  label: {
    color: "#667085",
    fontSize: 14,
    fontWeight: "700",
  },

  value: {
    color: "#071A2F",
    fontSize: 14,
    fontWeight: "900",
    flex: 1,
    textAlign: "right",
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

  homeButton: {
    width: "100%",
    backgroundColor: "#071A2F",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 12,
  },

  homeText: {
    color: "#FFD447",
    fontSize: 17,
    fontWeight: "900",
  },

  outlineButton: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#1457D9",
    padding: 15,
    borderRadius: 18,
    alignItems: "center",
  },

  outlineText: {
    color: "#1457D9",
    fontSize: 16,
    fontWeight: "900",
  },
});