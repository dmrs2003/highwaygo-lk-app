import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  View,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

export default function OwnerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOwnerLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const response = await API.post("/owners/login", { email, password });

      await AsyncStorage.setItem("ownerToken", response.data.token);

      Alert.alert("Success", "Owner login successful");
      router.push("/owner-dashboard");
    } catch (error: any) {
      console.log("OWNER LOGIN ERROR:", error.response?.data || error.message);

      Alert.alert(
        "Owner Login Failed",
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Owner login failed"
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../assets/images/auth-bus.png")}
        style={styles.heroImage}
        resizeMode="cover"
      />

      <Text style={styles.logo}>HighwayGo LK</Text>

      <Text style={styles.title}>Owner Login 🚌</Text>

      <Text style={styles.subtitle}>
        Login to manage buses, routes and passenger bookings.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter owner email"
          placeholderTextColor="#8A98AA"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor="#8A98AA"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.ownerButton} onPress={handleOwnerLogin}>
          <Text style={styles.ownerButtonText}>Owner Login ›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => router.push("/owner-register")}
        >
          <Text style={styles.outlineText}>Register as Bus Owner</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.passengerLink}>Login as Passenger</Text>
      </TouchableOpacity>
    </ScrollView>
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
    height: 240,
    borderBottomLeftRadius: 38,
    borderBottomRightRadius: 38,
    marginBottom: 22,
  },
  logo: {
    fontSize: 38,
    fontWeight: "900",
    color: "#071A2F",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#071A2F",
  },
  subtitle: {
    color: "#4B5B73",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 30,
    marginTop: 8,
    marginBottom: 22,
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
    padding: 16,
    marginBottom: 18,
    fontSize: 16,
    color: "#071A2F",
    backgroundColor: "#F8FBFF",
  },
  ownerButton: {
    backgroundColor: "#071A2F",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 6,
    marginBottom: 12,
  },
  ownerButtonText: {
    color: "#FFD447",
    fontSize: 17,
    fontWeight: "900",
  },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: "#F5A400",
    padding: 15,
    borderRadius: 18,
    alignItems: "center",
  },
  outlineText: {
    color: "#F5A400",
    fontSize: 15,
    fontWeight: "900",
  },
  passengerLink: {
    color: "#1457D9",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 22,
  },
});