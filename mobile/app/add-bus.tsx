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
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";
import { Colors } from "../constants/colors";

export default function AddBus() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  const [busName, setBusName] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [routeFrom, setRouteFrom] = useState("");
  const [routeTo, setRouteTo] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [price, setPrice] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleAddBus = async () => {
    if (
      !busName ||
      !busNumber ||
      !routeFrom ||
      !routeTo ||
      !departureTime ||
      !arrivalTime ||
      !price ||
      !totalSeats ||
      !imageUrl
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("ownerToken");

      await API.post(
        "/buses/add",
        {
          busName,
          busNumber,
          routeFrom,
          routeTo,
          departureTime,
          arrivalTime,
          price: Number(price),
          totalSeats: Number(totalSeats),
          imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Bus added successfully");
      router.push("/owner-dashboard");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to add bus"
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
      <Text style={[styles.title, { color: theme.text }]}>Add New Bus 🚌</Text>

      <Text style={[styles.subtitle, { color: theme.icon }]}>
        Add your bus details and route information
      </Text>

      <View style={[styles.card, { backgroundColor: theme.background }]}>
        <Input label="Bus Name" value={busName} setValue={setBusName} theme={theme} />
        <Input label="Bus Number" value={busNumber} setValue={setBusNumber} theme={theme} />
        <Input label="Route From" value={routeFrom} setValue={setRouteFrom} theme={theme} />
        <Input label="Route To" value={routeTo} setValue={setRouteTo} theme={theme} />
        <Input label="Departure Time" value={departureTime} setValue={setDepartureTime} theme={theme} />
        <Input label="Arrival Time" value={arrivalTime} setValue={setArrivalTime} theme={theme} />
        <Input label="Ticket Price" value={price} setValue={setPrice} theme={theme} keyboardType="numeric" />
        <Input label="Total Seats" value={totalSeats} setValue={setTotalSeats} theme={theme} keyboardType="numeric" />
        <Input label="Bus Image URL" value={imageUrl} setValue={setImageUrl} theme={theme} />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.tint }]}
          onPress={handleAddBus}
        >
          <Text style={styles.buttonText}>Add Bus</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/owner-dashboard")}>
          <Text style={[styles.backText, { color: theme.tint }]}>
            Back to Dashboard
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
        placeholder={`Enter ${label}`}
        placeholderTextColor={theme.icon}
        value={value}
        onChangeText={setValue}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 22,
    paddingTop: 60,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 15,
    marginTop: 8,
    marginBottom: 24,
  },

  card: {
    borderRadius: 24,
    padding: 22,
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

  button: {
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#071A2F",
    fontSize: 18,
    fontWeight: "bold",
  },

  backText: {
    textAlign: "center",
    marginTop: 22,
    fontSize: 15,
    fontWeight: "600",
  },
});