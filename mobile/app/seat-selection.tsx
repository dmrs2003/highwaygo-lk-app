import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  useColorScheme,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";
import { darkTheme, lightTheme } from "../constants/Colors";

export default function SeatSelection() {
  const { busId } = useLocalSearchParams<{ busId: string }>();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  const [totalSeats, setTotalSeats] = useState(0);
  const [lastRowSeats, setLastRowSeats] = useState(5);
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  const travelDate = "2026-05-24";
  const ticketPrice = 1500;

  const fetchSeats = async () => {
    try {
      const res = await API.get(`/bookings/seats/${busId}/${travelDate}`);
      setTotalSeats(res.data.totalSeats);
      setLastRowSeats(res.data.lastRowSeats);
      setBookedSeats(res.data.bookedSeats);
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to load seats");
    }
  };

  useEffect(() => {
    fetchSeats();
  }, []);

  const toggleSeat = (seatNo: number) => {
    if (selectedSeats.includes(seatNo)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNo));
    } else {
      setSelectedSeats([...selectedSeats, seatNo]);
    }
  };

  const handleBookSeats = async () => {
    if (selectedSeats.length === 0) {
      Alert.alert("Error", "Please select at least one seat");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      await API.post(
        "/bookings/book",
        { busId, seatNumbers: selectedSeats, travelDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Success", "Seats booked successfully");
      router.push("/home");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Booking failed");
    }
  };

  const SeatBox = ({ seatNo }: { seatNo: number }) => {
    const isBooked = bookedSeats.includes(seatNo);
    const isSelected = selectedSeats.includes(seatNo);

    return (
      <TouchableOpacity
        disabled={isBooked}
        onPress={() => toggleSeat(seatNo)}
        style={[
          styles.seat,
          { borderColor: theme.green, backgroundColor: theme.green + "33" },
          isBooked && { borderColor: theme.muted, backgroundColor: theme.muted + "22" },
          isSelected && { borderColor: theme.primary, backgroundColor: theme.primary },
        ]}
      >
        <Text
          style={[
            styles.seatText,
            { color: theme.green },
            isBooked && { color: theme.muted },
            isSelected && { color: "#071A2F" },
          ]}
        >
          {seatNo}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSeatRows = () => {
    const rows = [];
    let seatNo = 1;

    while (seatNo <= totalSeats) {
      const remainingSeats = totalSeats - seatNo + 1;
      const isLastRow = remainingSeats <= lastRowSeats;

      if (isLastRow) {
        const lastRow = [];

        for (let i = 0; i < lastRowSeats && seatNo <= totalSeats; i++) {
          lastRow.push(<SeatBox key={seatNo} seatNo={seatNo} />);
          seatNo++;
        }

        rows.push(
          <View key="last-row" style={styles.lastRow}>
            {lastRow}
          </View>
        );
      } else {
        rows.push(
          <View key={`row-${seatNo}`} style={styles.row}>
            <View style={styles.seatPair}>
              <SeatBox seatNo={seatNo++} />
              <SeatBox seatNo={seatNo++} />
            </View>

            <View style={styles.aisle} />

            <View style={styles.seatPair}>
              <SeatBox seatNo={seatNo++} />
              <SeatBox seatNo={seatNo++} />
            </View>
          </View>
        );
      }
    }

    return rows;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.card }]} onPress={() => router.back()}>
          <Text style={[styles.iconText, { color: theme.text }]}>‹</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.text }]}>Select Seat</Text>

        <View style={[styles.iconButton, { backgroundColor: theme.card }]}>
          <Text style={[styles.locationText, { color: theme.primary }]}>⌖</Text>
        </View>
      </View>

      <View style={[styles.tripCard, { backgroundColor: theme.card }]}>
        <View>
          <Text style={[styles.brand, { color: theme.primary }]}>🚌 HIGHWAYGO</Text>
          <Text style={[styles.routeMain, { color: theme.text }]}>Colombo</Text>
          <Text style={[styles.routeSub, { color: theme.muted }]}>Kandy</Text>
          <Text style={[styles.via, { color: theme.primary }]}>Via Kurunegala</Text>
        </View>

        <View style={styles.tripRight}>
          <Text style={[styles.time, { color: theme.text }]}>08:30 PM</Text>
          <Text style={[styles.date, { color: theme.primary }]}>{travelDate}</Text>
        </View>
      </View>

      <View style={[styles.frontBox, { backgroundColor: theme.card }]}>
        <Text style={[styles.frontText, { color: theme.muted }]}>FRONT</Text>
      </View>

      <View style={styles.legend}>
        <Text style={[styles.legendText, { color: theme.text }]}>🟢 Available</Text>
        <Text style={[styles.legendText, { color: theme.text }]}>🟡 Selected</Text>
        <Text style={[styles.legendText, { color: theme.text }]}>🔴 Booked</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.busBody}>{renderSeatRows()}</View>
      </ScrollView>

      <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
        <View>
          <Text style={[styles.summaryLabel, { color: theme.text }]}>
            Selected Seats ({selectedSeats.length})
          </Text>
          <Text style={[styles.summarySeats, { color: theme.primary }]}>
            {selectedSeats.length ? selectedSeats.join(", ") : "None"}
          </Text>
        </View>

        <View>
          <Text style={[styles.total, { color: theme.primary }]}>
            LKR {selectedSeats.length * ticketPrice}
          </Text>
          <Text style={[styles.totalLabel, { color: theme.muted }]}>Total</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.confirmButton, { backgroundColor: theme.primary }]} onPress={handleBookSeats}>
        <Text style={styles.confirmText}>Confirm Seats →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 55 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  iconText: { fontSize: 34, fontWeight: "bold" },
  locationText: { fontSize: 24 },

  title: { fontSize: 24, fontWeight: "bold" },

  tripCard: {
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  brand: { fontSize: 17, fontWeight: "bold", marginBottom: 14 },
  routeMain: { fontSize: 20, fontWeight: "bold" },
  routeSub: { fontSize: 16, marginTop: 3 },
  via: { fontSize: 13, marginTop: 6 },

  tripRight: { alignItems: "flex-end", justifyContent: "center" },
  time: { fontSize: 20, fontWeight: "bold" },
  date: { fontSize: 13, marginTop: 10 },

  frontBox: {
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },

  frontText: { fontWeight: "bold", fontSize: 15 },

  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },

  legendText: { fontSize: 12, fontWeight: "600" },

  busBody: { alignItems: "center", paddingBottom: 20 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  seatPair: { flexDirection: "row" },

  aisle: { width: 70 },

  lastRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 14,
  },

  seat: {
    width: 54,
    height: 54,
    marginHorizontal: 5,
    borderRadius: 14,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
  },

  seatText: { fontSize: 18, fontWeight: "bold" },

  summaryCard: {
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  summaryLabel: { fontSize: 14, fontWeight: "bold" },
  summarySeats: { fontSize: 15, fontWeight: "bold", marginTop: 6 },
  total: { fontSize: 18, fontWeight: "bold" },
  totalLabel: { textAlign: "right", marginTop: 4 },

  confirmButton: {
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  confirmText: {
    color: "#071A2F",
    fontSize: 18,
    fontWeight: "bold",
  },
});