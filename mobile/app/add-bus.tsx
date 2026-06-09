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
  ActivityIndicator,
  Switch,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
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

  const [isReturnRoute, setIsReturnRoute] = useState(false);
  const [returnDepartureTime, setReturnDepartureTime] = useState("");
  const [returnArrivalTime, setReturnArrivalTime] = useState("");

  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permission Required", "Please allow gallery access");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.3,
        base64: true,
      });

      if (!result.canceled) {
        const asset = result.assets[0];

        if (!asset.base64) {
          Alert.alert("Error", "Could not read image");
          return;
        }

        setImageUrl(`data:image/jpeg;base64,${asset.base64}`);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to pick image");
    }
  };

  const handleAddBus = async () => {
    if (
      !busName.trim() ||
      !busNumber.trim() ||
      !routeFrom.trim() ||
      !routeTo.trim() ||
      !departureTime.trim() ||
      !arrivalTime.trim() ||
      !price.trim() ||
      !totalSeats.trim() ||
      !imageUrl
    ) {
      Alert.alert("Error", "Please fill all main bus fields");
      return;
    }

    if (isReturnRoute && (!returnDepartureTime.trim() || !returnArrivalTime.trim())) {
      Alert.alert("Error", "Please fill return departure and arrival time");
      return;
    }

    const token = await AsyncStorage.getItem("ownerToken");

    if (!token) {
      Alert.alert("Login Required", "Please login again");
      router.replace("/owner-login");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post(
        "/buses/add",
        {
          busName: busName.trim(),
          busNumber: busNumber.trim(),
          routeFrom: routeFrom.trim(),
          routeTo: routeTo.trim(),
          departureTime: departureTime.trim(),
          arrivalTime: arrivalTime.trim(),
          price: Number(price),
          totalSeats: Number(totalSeats),
          imageUrl,
          isReturnRoute,
          returnDepartureTime: returnDepartureTime.trim(),
          returnArrivalTime: returnArrivalTime.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", res.data?.message || "Bus added successfully");
      router.push("/owner-dashboard");
    } catch (error: any) {
      console.log("ADD BUS ERROR:", error.response?.data || error.message);

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to add bus"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={
          imageUrl
            ? { uri: imageUrl }
            : require("../assets/images/index-bus.png")
        }
        style={styles.heroImage}
        resizeMode="cover"
      />

      <Text style={styles.title}>Add New Bus 🚌</Text>

      <Text style={styles.subtitle}>
        Add going route, return route, timings, seats, price and bus image.
      </Text>

      <View style={styles.card}>
        <Input
          label="Bus Name"
          value={busName}
          setValue={setBusName}
          placeholder="Highway Express"
        />

        <Input
          label="Bus Number"
          value={busNumber}
          setValue={setBusNumber}
          placeholder="NC-1010"
        />

        <Text style={styles.sectionTitle}>Going Route</Text>

        <View style={styles.row}>
          <View style={styles.half}>
            <Input
              label="From"
              value={routeFrom}
              setValue={setRouteFrom}
              placeholder="Elpitiya"
            />
          </View>

          <View style={styles.half}>
            <Input
              label="To"
              value={routeTo}
              setValue={setRouteTo}
              placeholder="Colombo"
            />
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

        <View style={styles.returnSwitchBox}>
          <View>
            <Text style={styles.returnTitle}>Add Return Route</Text>
            <Text style={styles.returnSub}>
              {routeTo || "Destination"} → {routeFrom || "Departure"}
            </Text>
          </View>

          <Switch
            value={isReturnRoute}
            onValueChange={setIsReturnRoute}
            trackColor={{ false: "#D8E2F0", true: "#BFD4FF" }}
            thumbColor={isReturnRoute ? "#1457D9" : "#FFFFFF"}
          />
        </View>

        {isReturnRoute && (
          <View style={styles.returnCard}>
            <Text style={styles.sectionTitle}>Return Route</Text>

            <View style={styles.returnRouteBox}>
              <Text style={styles.returnRouteText}>
                {routeTo || "Destination"} → {routeFrom || "Departure"}
              </Text>
            </View>

            <View style={styles.row}>
              <View style={styles.half}>
                <Input
                  label="Return Departure"
                  value={returnDepartureTime}
                  setValue={setReturnDepartureTime}
                  placeholder="05:00 PM"
                />
              </View>

              <View style={styles.half}>
                <Input
                  label="Return Arrival"
                  value={returnArrivalTime}
                  setValue={setReturnArrivalTime}
                  placeholder="08:30 PM"
                />
              </View>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Bus Details</Text>

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

        <TouchableOpacity
          style={styles.imageButton}
          onPress={pickImage}
          disabled={loading}
        >
          <Text style={styles.imageButtonText}>
            {imageUrl ? "Change Bus Image" : "Select Bus Image from Gallery"}
          </Text>
        </TouchableOpacity>

        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.previewImage}
            resizeMode="cover"
          />
        ) : null}

        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.disabledButton]}
          onPress={handleAddBus}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryText}>
              {isReturnRoute ? "Add Bus + Return Route ›" : "Add Bus ›"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => router.push("/owner-dashboard")}
          disabled={loading}
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

  sectionTitle: {
    color: "#071A2F",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 12,
    marginTop: 6,
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

  returnSwitchBox: {
    backgroundColor: "#F8FBFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  returnTitle: {
    color: "#071A2F",
    fontSize: 16,
    fontWeight: "900",
  },

  returnSub: {
    color: "#667085",
    fontSize: 13,
    marginTop: 4,
    fontWeight: "700",
  },

  returnCard: {
    backgroundColor: "#F8FBFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
  },

  returnRouteBox: {
    backgroundColor: "#E8F1FF",
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
  },

  returnRouteText: {
    color: "#071A2F",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },

  imageButton: {
    backgroundColor: "#071A2F",
    padding: 15,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 14,
  },

  imageButtonText: {
    color: "#FFD447",
    fontSize: 15,
    fontWeight: "900",
  },

  previewImage: {
    width: "100%",
    height: 170,
    borderRadius: 22,
    marginBottom: 16,
  },

  primaryButton: {
    backgroundColor: "#1457D9",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },

  disabledButton: {
    opacity: 0.7,
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