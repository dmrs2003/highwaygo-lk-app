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
import API from "../services/api";

export default function OwnerRegister() {
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [nic, setNic] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessRegNo, setBusinessRegNo] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleOwnerRegister = async () => {
    if (
      !ownerName ||
      !phone ||
      !email ||
      !nic ||
      !businessName ||
      !businessRegNo ||
      !address ||
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
      const res = await API.post("/owners/register", {
        ownerName,
        phone,
        email,
        nic,
        businessName,
        businessRegNo,
        address,
        password,
        confirmPassword,
      });

      Alert.alert(
        "Success",
        res.data.message || "Owner registered successfully"
      );

      router.push("/owner-login");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Owner registration failed"
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

      <Text style={styles.title}>Owner Registration 🚌</Text>

      <Text style={styles.subtitle}>
        Register your bus business and wait for admin approval.
      </Text>

      <View style={styles.card}>
        <Input label="Owner Name" value={ownerName} setValue={setOwnerName} />
        <Input label="Phone Number" value={phone} setValue={setPhone} keyboardType="phone-pad" />
        <Input label="Email" value={email} setValue={setEmail} keyboardType="email-address" />
        <Input label="NIC Number" value={nic} setValue={setNic} />
        <Input label="Business Name" value={businessName} setValue={setBusinessName} />
        <Input label="Business Reg No" value={businessRegNo} setValue={setBusinessRegNo} />
        <Input label="Address" value={address} setValue={setAddress} />
        <Input label="Password" value={password} setValue={setPassword} secureTextEntry />
        <Input label="Confirm Password" value={confirmPassword} setValue={setConfirmPassword} secureTextEntry />

        <TouchableOpacity style={styles.ownerButton} onPress={handleOwnerRegister}>
          <Text style={styles.ownerButtonText}>Register Owner ›</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/owner-login")}>
          <Text style={styles.loginLink}>Already have an owner account? Login</Text>
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
  secureTextEntry = false,
}: any) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={`Enter ${label}`}
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
    paddingBottom: 30,
  },
  heroImage: {
    width: "100%",
    height: 210,
    borderBottomLeftRadius: 38,
    borderBottomRightRadius: 38,
    marginBottom: 20,
  },
  logo: {
    fontSize: 36,
    fontWeight: "900",
    color: "#071A2F",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#071A2F",
    textAlign: "center",
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
    marginBottom: 16,
    fontSize: 16,
    color: "#071A2F",
    backgroundColor: "#F8FBFF",
  },
  ownerButton: {
    backgroundColor: "#071A2F",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 8,
  },
  ownerButtonText: {
    color: "#FFD447",
    fontSize: 17,
    fontWeight: "900",
  },
  loginLink: {
    color: "#F5A400",
    textAlign: "center",
    marginTop: 22,
    fontSize: 15,
    fontWeight: "900",
  },
});