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
import API from "../services/api";
import { darkTheme, lightTheme } from "../constants/colors";

export default function Register() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [nic, setNic] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !phone || !email || !nic || !address || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const res = await API.post("/auth/register", {
        name,
        phone,
        email,
        nic,
        address,
        password,
        confirmPassword,
      });

      Alert.alert("Success", res.data.message || "Registration successful");
      router.push("/login");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Registration failed"
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.bg }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.logo, { color: theme.primary }]}>HighwayGo LK</Text>

      <Text style={[styles.title, { color: theme.text }]}>
        Create Account 🚍
      </Text>

      <Text style={[styles.subtitle, { color: theme.muted }]}>
        Register and start booking highway buses
      </Text>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        {[
          ["Full Name", name, setName, "default", false],
          ["Phone Number", phone, setPhone, "phone-pad", false],
          ["Email", email, setEmail, "email-address", false],
          ["NIC Number", nic, setNic, "default", false],
          ["Address", address, setAddress, "default", false],
        ].map(([label, value, setter, keyboardType, secure]: any) => (
          <View key={label}>
            <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.muted }]}
              placeholder={`Enter ${label}`}
              placeholderTextColor={theme.muted}
              value={value}
              onChangeText={setter}
              keyboardType={keyboardType}
              secureTextEntry={secure}
            />
          </View>
        ))}

        <Text style={[styles.label, { color: theme.text }]}>Password</Text>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.muted }]}
          placeholder="Enter Password"
          placeholderTextColor={theme.muted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={[styles.label, { color: theme.text }]}>Confirm Password</Text>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.muted }]}
          placeholder="Confirm Password"
          placeholderTextColor={theme.muted}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={[styles.linkText, { color: theme.primary }]}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },

  logo: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 28,
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

  linkText: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 15,
    fontWeight: "600",
  },
});