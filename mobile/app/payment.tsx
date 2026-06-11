import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  View,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

export default function Payment() {
  const { busId, seats, date, amount } = useLocalSearchParams<{
    busId: string;
    seats: string;
    date: string;
    amount: string;
  }>();

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paying, setPaying] = useState(false);

  const seatList = seats ? seats.split(",").map(Number) : [];

  const handleFakePayment = async () => {
    if (!cardName || !cardNumber || !expiry || !cvv) {
      Alert.alert("Error", "Please fill card details");
      return;
    }

    try {
      setPaying(true);

      const token = await AsyncStorage.getItem("token");

      const res = await API.post(
        "/bookings/book",
        {
          busId,
          seatNumbers: seatList,
          travelDate: date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const bookingId = res.data.booking?._id;

      Alert.alert("Success", "Payment successful");

      router.replace(
        `/booking-success?bookingId=${bookingId}&seats=${seats}&date=${date}&amount=${amount}` as any
      );
    } catch (error: any) {
      Alert.alert(
        "Payment Failed",
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Payment failed"
      );
    } finally {
      setPaying(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Secure Payment 💳</Text>

      <Text style={styles.subtitle}>
        Demo sandbox payment — no real money will be charged.
      </Text>

      <View style={styles.amountCard}>
        <Text style={styles.amountLabel}>Total Amount</Text>
        <Text style={styles.amount}>LKR {amount || "0"}</Text>

        <InfoRow label="Seats" value={seats || "N/A"} />
        <InfoRow label="Passengers" value={String(seatList.length)} />
        <InfoRow label="Travel Date" value={date || "N/A"} />
      </View>

      <View style={styles.cardPreview}>
        <View>
          <Text style={styles.cardSmall}>HIGHWAYGO LK</Text>

          <Text style={styles.cardNumber}>
            {cardNumber || "4242 4242 4242 4242"}
          </Text>
        </View>

        <View style={styles.cardBottom}>
          <Text style={styles.cardName}>{cardName || "CARD HOLDER"}</Text>
          <Text style={styles.cardExpiry}>{expiry || "12/28"}</Text>
        </View>
      </View>

      <View style={styles.formCard}>
        <Input
          label="Card Holder Name"
          value={cardName}
          setValue={setCardName}
          placeholder="Enter Name as on card"
        />

        <Input
          label="Card Number"
          value={cardNumber}
          setValue={setCardNumber}
          placeholder="4242 4242 4242 4242"
          keyboardType="numeric"
        />

        <View style={styles.row}>
          <View style={styles.half}>
            <Input
              label="Expiry"
              value={expiry}
              setValue={setExpiry}
              placeholder="12/28"
            />
          </View>

          <View style={styles.half}>
            <Input
              label="CVV"
              value={cvv}
              setValue={setCvv}
              placeholder="123"
              keyboardType="numeric"
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.payButton, paying && styles.disabledButton]}
          onPress={handleFakePayment}
          disabled={paying}
        >
          {paying ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.payText}>Pay & Confirm Booking ›</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} disabled={paying}>
          <Text style={styles.backText}>Back to Seat Selection</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }: any) {
  return (
    <View style={styles.ticketRow}>
      <Text style={styles.ticketLabel}>{label}</Text>
      <Text style={styles.ticketValue}>{value}</Text>
    </View>
  );
}

function Input({
  label,
  value,
  setValue,
  placeholder,
  keyboardType = "default",
  secureTextEntry = false,
}: any) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#8A98AA"
        value={value}
        onChangeText={setValue}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F4F8FF",
    padding: 24,
    paddingTop: 65,
  },

  title: {
    color: "#071A2F",
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    color: "#667085",
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 22,
  },

  amountCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 22,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },

  amountLabel: {
    color: "#667085",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  amount: {
    color: "#1457D9",
    fontSize: 38,
    fontWeight: "900",
    textAlign: "center",
    marginVertical: 12,
  },

  ticketRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  ticketLabel: {
    color: "#667085",
    fontSize: 14,
    fontWeight: "700",
  },

  ticketValue: {
    color: "#071A2F",
    fontSize: 15,
    fontWeight: "900",
  },

  cardPreview: {
    height: 190,
    borderRadius: 28,
    backgroundColor: "#071A2F",
    padding: 24,
    justifyContent: "space-between",
    marginBottom: 20,
  },

  cardSmall: {
    color: "#FFD447",
    fontSize: 15,
    fontWeight: "900",
  },

  cardNumber: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 2,
    marginTop: 28,
  },

  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  cardExpiry: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },

  label: {
    color: "#071A2F",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1.5,
    borderColor: "#D8E2F0",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#071A2F",
    backgroundColor: "#F8FBFF",
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  half: {
    flex: 1,
  },

  payButton: {
    backgroundColor: "#1457D9",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 8,
  },

  disabledButton: {
    opacity: 0.7,
  },

  payText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  backText: {
    color: "#1457D9",
    textAlign: "center",
    marginTop: 22,
    fontSize: 15,
    fontWeight: "900",
  },
});