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
import { Colors } from "../constants/colors";

export default function OwnerRegister() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

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
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.logo, { color: theme.tint }]}>HighwayGo LK</Text>

      <Text style={[styles.title, { color: theme.text }]}>
        Owner Register 🚌
      </Text>

      <Text style={[styles.subtitle, { color: theme.icon }]}>
        Register as a bus owner and wait for admin approval
      </Text>

      <View style={[styles.card, { backgroundColor: theme.background }]}>
        <Input label="Owner Name" value={ownerName} setValue={setOwnerName} theme={theme} />
        <Input label="Phone Number" value={phone} setValue={setPhone} theme={theme} keyboardType="phone-pad" />
        <Input label="Email" value={email} setValue={setEmail} theme={theme} keyboardType="email-address" />
        <Input label="NIC Number" value={nic} setValue={setNic} theme={theme} />
        <Input label="Business Name" value={businessName} setValue={setBusinessName} theme={theme} />
        <Input label="Business Reg No" value={businessRegNo} setValue={setBusinessRegNo} theme={theme} />
        <Input label="Address" value={address} setValue={setAddress} theme={theme} />

        <Input label="Password" value={password} setValue={setPassword} theme={theme} secureTextEntry />
        <Input label="Confirm Password" value={confirmPassword} setValue={setConfirmPassword} theme={theme} secureTextEntry />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.tint }]}
          onPress={handleOwnerRegister}
        >
          <Text style={styles.buttonText}>Register Owner</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/owner-login")}>
          <Text style={[styles.linkText, { color: theme.tint }]}>
            Already have an owner account? Login
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
        placeholder={`Enter ${label}`}
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