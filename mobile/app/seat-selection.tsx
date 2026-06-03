import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import API from "../services/api";

export default function SeatSelection() {
  const { busId, passengers, date } = useLocalSearchParams<{
    busId: string;
    passengers?: string;
    date?: string;
  }>();

  const passengerCount = Number(passengers || 1);
  const travelDate = date || new Date().toISOString().split("T")[0];

  const [totalSeats, setTotalSeats] = useState(0);
  const [lastRowSeats, setLastRowSeats] = useState(5);
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [ticketPrice, setTicketPrice] = useState(0);

  const [busName, setBusName] = useState("");
  const [routeFrom, setRouteFrom] = useState("");
  const [routeTo, setRouteTo] = useState("");
  const [departureTime, setDepartureTime] = useState("");

  const fetchSeats = async () => {
    try {
      const res = await API.get(`/bookings/seats/${busId}/${travelDate}`);

      setTotalSeats(res.data.totalSeats);
      setLastRowSeats(res.data.lastRowSeats);
      setBookedSeats(res.data.bookedSeats);
      setTicketPrice(res.data.price);

      setBusName(res.data.busName);
      setRouteFrom(res.data.routeFrom);
      setRouteTo(res.data.routeTo);
      setDepartureTime(res.data.departureTime);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to load seats"
      );
    }
  };

  useEffect(() => {
    fetchSeats();
  }, []);

  const toggleSeat = (seatNo: number) => {
    if (selectedSeats.includes(seatNo)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNo));
      return;
    }

    if (selectedSeats.length >= passengerCount) {
      Alert.alert(
        "Seat Limit",
        `You can select only ${passengerCount} seat(s)`
      );
      return;
    }

    setSelectedSeats([...selectedSeats, seatNo]);
  };

  const goToPayment = () => {
    if (selectedSeats.length !== passengerCount) {
      Alert.alert(
        "Select Seats",
        `Please select exactly ${passengerCount} seat(s)`
      );
      return;
    }

    const amount = selectedSeats.length * ticketPrice;

    router.push(
      `/payment?busId=${busId}&seats=${selectedSeats.join(
        ","
      )}&date=${travelDate}&amount=${amount}` as any
    );
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
          isBooked && styles.bookedSeat,
          isSelected && styles.selectedSeat,
        ]}
      >
        <Text
          style={[
            styles.seatText,
            isBooked && styles.bookedSeatText,
            isSelected && styles.selectedSeatText,
          ]}
        >
          {seatNo}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderRows = () => {
    const rows = [];
    let seatNo = 1;

    while (seatNo <= totalSeats) {
      const remaining = totalSeats - seatNo + 1;
      const isLastRow = remaining <= lastRowSeats;

      if (isLastRow) {
        const lastSeats = [];

        for (let i = 0; i < lastRowSeats && seatNo <= totalSeats; i++) {
          lastSeats.push(<SeatBox key={seatNo} seatNo={seatNo} />);
          seatNo++;
        }

        rows.push(
          <View key="last-row" style={styles.lastRow}>
            {lastSeats}
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Select Seat</Text>

        <Text style={styles.location}>📍</Text>
      </View>

      <View style={styles.tripCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.busName}>{busName || "HighwayGo Bus"}</Text>

          <Text style={styles.route}>
            {routeFrom || "From"} → {routeTo || "To"}
          </Text>
        </View>

        <View>
          <Text style={styles.time}>{departureTime || "Time"}</Text>
          <Text style={styles.date}>{travelDate}</Text>
        </View>
      </View>

      <View style={styles.passengerInfo}>
        <Text style={styles.passengerInfoText}>
          Passengers: {passengerCount}
        </Text>

        <Text style={styles.passengerInfoText}>
          Select exactly {passengerCount} seat(s)
        </Text>
      </View>

      <View style={styles.frontBox}>
        <Text style={styles.frontText}>FRONT</Text>
      </View>

      <View style={styles.legend}>
        <Text style={styles.legendText}>🟢 Available</Text>
        <Text style={styles.legendText}>🟡 Selected</Text>
        <Text style={styles.legendText}>⚪ Booked</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.busBody}>{renderRows()}</View>
      </ScrollView>

      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryLabel}>
            Selected Seats ({selectedSeats.length}/{passengerCount})
          </Text>

          <Text style={styles.summarySeats}>
            {selectedSeats.length ? selectedSeats.join(", ") : "None"}
          </Text>
        </View>

        <View>
          <Text style={styles.total}>
            LKR {selectedSeats.length * ticketPrice}
          </Text>
          <Text style={styles.totalLabel}>Total</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={goToPayment}>
        <Text style={styles.confirmText}>Continue to Payment ›</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8FF",
    paddingTop: 55,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  back: {
    fontSize: 42,
    color: "#071A2F",
    fontWeight: "900",
  },

  title: {
    color: "#071A2F",
    fontSize: 22,
    fontWeight: "900",
  },

  location: {
    fontSize: 22,
  },

  tripCard: {
    backgroundColor: "#1457D9",
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 10,
  },

  busName: {
    color: "#CFE0FF",
    fontSize: 14,
    fontWeight: "800",
  },

  route: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 6,
  },

  time: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "right",
  },

  date: {
    color: "#CFE0FF",
    fontSize: 12,
    marginTop: 8,
    fontWeight: "700",
    textAlign: "right",
  },

  passengerInfo: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  passengerInfoText: {
    color: "#071A2F",
    fontSize: 13,
    fontWeight: "900",
  },

  frontBox: {
    backgroundColor: "#E8F1FF",
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 15,
  },

  frontText: {
    color: "#667085",
    fontWeight: "900",
  },

  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 18,
  },

  legendText: {
    color: "#4B5B73",
    fontSize: 13,
    fontWeight: "800",
  },

  busBody: {
    alignItems: "center",
    paddingBottom: 25,
  },

  row: {
    flexDirection: "row",
    marginBottom: 13,
    alignItems: "center",
  },

  seatPair: {
    flexDirection: "row",
  },

  aisle: {
    width: 70,
  },

  lastRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 15,
  },

  seat: {
    width: 54,
    height: 54,
    marginHorizontal: 5,
    borderRadius: 14,
    backgroundColor: "#CFF4E4",
    borderWidth: 2.5,
    borderColor: "#00A86B",
    alignItems: "center",
    justifyContent: "center",
  },

  selectedSeat: {
    backgroundColor: "#FFD447",
    borderColor: "#F5A400",
  },

  bookedSeat: {
    backgroundColor: "#E8EDF4",
    borderColor: "#CAD2DF",
  },

  seatText: {
    color: "#008C5A",
    fontSize: 18,
    fontWeight: "900",
  },

  selectedSeatText: {
    color: "#071A2F",
  },

  bookedSeatText: {
    color: "#B3BBC8",
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },

  summaryLabel: {
    color: "#071A2F",
    fontSize: 14,
    fontWeight: "900",
  },

  summarySeats: {
    color: "#1457D9",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 6,
  },

  total: {
    color: "#1457D9",
    fontSize: 18,
    fontWeight: "900",
  },

  totalLabel: {
    color: "#667085",
    textAlign: "right",
    marginTop: 4,
  },

  confirmButton: {
    backgroundColor: "#1457D9",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 18,
  },

  confirmText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
});