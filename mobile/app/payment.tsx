import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  useColorScheme,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";
import { Colors } from "../constants/colors";

export default function Payment() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

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

  const handleFakePayment = async () => {
    if (!cardName || !cardNumber || !expiry || !cvv) {
      Alert.alert("Error", "Please fill card details");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      await API.post(
        "/bookings/book",
        {
          busId,
          seatNumbers: seats.split(",").map(Number),
          travelDate: date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Payment successful and seats booked");

      router.push(`/booking-success?seats=${seats}&date=${date}`);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Payment failed"
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: theme.text }]}>
        Secure Payment 💳
      </Text>

      <Text style={[styles.subtitle, { color: theme.icon }]}>
        Demo payment mode — no real money will be charged.
      </Text>

      <View style={[styles.amountCard, { backgroundColor: theme.background }]}>
        <Text style={[styles.amountLabel, { color: theme.icon }]}>
          Total Amount
        </Text>

        <Text style={[styles.amount, { color: theme.tint }]}>
          LKR {amount || "0"}
        </Text>

        <Text style={[styles.seats, { color: theme.text }]}>
          Seats: {seats}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.background }]}>
        <Input
          label="Card Holder Name"
          value={cardName}
          setValue={setCardName}
          theme={theme}
        />

        <Input
          label="Card Number"
          value={cardNumber}
          setValue={setCardNumber}
          theme={theme}
          keyboardType="numeric"
          placeholder="4242 4242 4242 4242"
        />

        <View style={styles.row}>
          <View style={styles.half}>
            <Input
              label="Expiry"
              value={expiry}
              setValue={setExpiry}
              theme={theme}
              placeholder="12/28"
            />
          </View>

          <View style={styles.half}>
            <Input
              label="CVV"
              value={cvv}
              setValue={setCvv}
              theme={theme}
              keyboardType="numeric"
              placeholder="123"
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.tint }]}
          onPress={handleFakePayment}
        >
          <Text style={styles.buttonText}>Pay & Confirm Booking</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backText, { color: theme.tint }]}>
            Back to Seats
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function Input({
  label,
  value,
  setValue,
  theme,
  keyboardType = "default",
  placeholder,
  secureTextEntry = false,
}: any) {
  return (
    <View>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>

      <TextInput
        style={[
          styles.input,
          {
            color: theme.text,
            borderColor: theme.icon,
          },
        ]}
        placeholder={placeholder || `Enter ${label}`}
        placeholderTextColor={theme.icon}
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
    padding: 24,
    paddingTop: 70,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 26,
  },

  amountCard: {
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.25)",
    alignItems: "center",
  },

  amountLabel: {
    fontSize: 14,
  },

  amount: {
    fontSize: 34,
    fontWeight: "bold",
    marginVertical: 8,
  },

  seats: {
    fontSize: 16,
    fontWeight: "600",
  },

  card: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.25)",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 15,
    marginBottom: 16,
    fontSize: 16,
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  half: {
    flex: 1,
  },

  button: {
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#071A2F",
    fontSize: 17,
    fontWeight: "bold",
  },

  backText: {
    textAlign: "center",
    marginTop: 22,
    fontSize: 15,
    fontWeight: "700",
  },
});