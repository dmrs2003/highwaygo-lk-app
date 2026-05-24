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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const response = await API.post("/auth/login", { email, password });
      await AsyncStorage.setItem("token", response.data.token);

      Alert.alert("Success", "Login successful");
      router.push("/home");
    } catch (error: any) {
      console.log("LOGIN ERROR:", error.response?.data || error.message);

      Alert.alert(
        "Login Failed",
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Login failed"
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

      <Text style={styles.title}>Welcome Back 👋</Text>

      <Text style={styles.subtitle}>
        Login to book your highway journey across Sri Lanka.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
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

        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryText}>Passenger Login ›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.outlineText}>Create Passenger Account</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push("/owner-login")}>
        <Text style={styles.ownerLink}>Login as Bus Owner</Text>
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

  primaryButton: {
    backgroundColor: "#1457D9",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 6,
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

  ownerLink: {
    color: "#071A2F",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 22,
  },
});