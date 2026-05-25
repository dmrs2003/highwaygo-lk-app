import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  View,
  Image,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

export default function AddBus() {
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
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../assets/images/index-bus.png")}
        style={styles.heroImage}
        resizeMode="cover"
      />

      <Text style={styles.title}>Add New Bus 🚌</Text>

      <Text style={styles.subtitle}>
        Add route, timing, seats, price and bus image details.
      </Text>

      <View style={styles.card}>
        <Input label="Bus Name" value={busName} setValue={setBusName} />
        <Input label="Bus Number" value={busNumber} setValue={setBusNumber} />

        <View style={styles.row}>
          <View style={styles.half}>
            <Input label="Route From" value={routeFrom} setValue={setRouteFrom} />
          </View>

          <View style={styles.half}>
            <Input label="Route To" value={routeTo} setValue={setRouteTo} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Input
              label="Departure"
              value={departureTime}
              setValue={setDepartureTime}
              placeholder="08:00 AM"
            />
          </View>

          <View style={styles.half}>
            <Input
              label="Arrival"
              value={arrivalTime}
              setValue={setArrivalTime}
              placeholder="11:30 AM"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Input
              label="Price"
              value={price}
              setValue={setPrice}
              keyboardType="numeric"
              placeholder="1500"
            />
          </View>

          <View style={styles.half}>
            <Input
              label="Seats"
              value={totalSeats}
              setValue={setTotalSeats}
              keyboardType="numeric"
              placeholder="40"
            />
          </View>
        </View>

        <Input
          label="Bus Image URL"
          value={imageUrl}
          setValue={setImageUrl}
          placeholder="https://example.com/bus.jpg"
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleAddBus}>
          <Text style={styles.primaryText}>Add Bus ›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => router.push("/owner-dashboard")}
        >
          <Text style={styles.outlineText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function Input({
  label,
  value,
  setValue,
  keyboardType = "default",
  placeholder,
}: any) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={styles.input}
        placeholder={placeholder || `Enter ${label}`}
        placeholderTextColor="#8A98AA"
        value={value}
        onChangeText={setValue}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F4F8FF",
    alignItems: "center",
    paddingBottom: 30,
  },

  heroImage: {
    width: "100%",
    height: 220,
    borderBottomLeftRadius: 38,
    borderBottomRightRadius: 38,
    marginBottom: 22,
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
    lineHeight: 22,
    paddingHorizontal: 30,
    marginTop: 8,
    marginBottom: 24,
  },

  card: {
    width: "90%",
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
    padding: 15,
    marginBottom: 16,
    fontSize: 15,
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

  primaryButton: {
    backgroundColor: "#1457D9",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },

  primaryText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  outlineButton: {
    borderWidth: 1.5,
    borderColor: "#1457D9",
    padding: 15,
    borderRadius: 18,
    alignItems: "center",
  },

  outlineText: {
    color: "#1457D9",
    fontSize: 15,
    fontWeight: "900",
  },
});