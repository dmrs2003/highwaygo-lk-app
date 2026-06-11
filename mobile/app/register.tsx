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
} from "react-native";
import { router } from "expo-router";
import API from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [nic, setNic] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !name.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !nic.trim() ||
      !address.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/register", {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        nic: nic.trim(),
        address: address.trim(),
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Image
        source={require("../assets/images/index-bus.png")}
        style={styles.heroImage}
        resizeMode="cover"
      />

      <Text style={styles.logo}>
        HighwayGo <Text style={styles.logoBlue}>LK</Text>
      </Text>

      <Text style={styles.title}>Create Account 🚍</Text>

      <Text style={styles.subtitle}>
        Register as a passenger and start booking highway buses easily.
      </Text>

      <View style={styles.card}>
        <Input label="Full Name" value={name} setValue={setName} placeholder="Ramindu Sulakkana" />
        <Input label="Phone Number" value={phone} setValue={setPhone} keyboardType="phone-pad" placeholder="07XXXXXXXX" />
        <Input label="Email" value={email} setValue={setEmail} keyboardType="email-address" placeholder="example@email.com" />
        <Input label="NIC Number" value={nic} setValue={setNic} placeholder="2003XXXXXXX" />
        <Input label="Address" value={address} setValue={setAddress} placeholder="Your address" />

        <Input
          label="Password"
          value={password}
          setValue={setPassword}
          placeholder="Enter password"
          secureTextEntry
        />

        <Input
          label="Confirm Password"
          value={confirmPassword}
          setValue={setConfirmPassword}
          placeholder="Confirm password"
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryText}>Create Account ›</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => router.push("/login")}
          disabled={loading}
        >
          <Text style={styles.outlineText}>Already have an account? Login</Text>
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
  secureTextEntry = false,
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
        secureTextEntry={secureTextEntry}
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
    paddingBottom: 32,
  },

  heroImage: {
    width: "100%",
    height: 220,
    borderBottomLeftRadius: 38,
    borderBottomRightRadius: 38,
    marginBottom: 22,
  },

  logo: {
    fontSize: 26,
    fontWeight: "900",
    color: "#071A2F",
    marginBottom: 8,
  },

  logoBlue: {
    color: "#1457D9",
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
    paddingHorizontal: 32,
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