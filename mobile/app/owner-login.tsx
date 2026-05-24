import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useColorScheme,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";
import { Colors } from "../constants/colors";

export default function OwnerLogin() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark"
    ? Colors.dark
    : Colors.light;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOwnerLogin = async () => {

    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {

      const response = await API.post(
        "/owners/login",
        {
          email,
          password,
        }
      );

      // SAVE OWNER TOKEN
      await AsyncStorage.setItem(
        "ownerToken",
        response.data.token
      );

      Alert.alert(
        "Success",
        "Owner login successful"
      );

      router.push("/owner-dashboard");

    } catch (error: any) {

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Login failed"
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <Text
        style={[
          styles.logo,
          { color: theme.tint },
        ]}
      >
        HighwayGo LK
      </Text>

      <Text
        style={[
          styles.title,
          { color: theme.text },
        ]}
      >
        Owner Login 🚌
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: theme.icon },
        ]}
      >
        Login to manage your buses
      </Text>

      <View
        style={[
          styles.card,
          { backgroundColor: theme.background },
        ]}
      >

        <Text
          style={[
            styles.label,
            { color: theme.text },
          ]}
        >
          Email
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              color: theme.text,
              borderColor: theme.icon,
            },
          ]}
          placeholder="Enter email"
          placeholderTextColor={theme.icon}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text
          style={[
            styles.label,
            { color: theme.text },
          ]}
        >
          Password
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              color: theme.text,
              borderColor: theme.icon,
            },
          ]}
          placeholder="Enter password"
          placeholderTextColor={theme.icon}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.tint },
          ]}
          onPress={handleOwnerLogin}
        >
          <Text style={styles.buttonText}>
            Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push("/owner-register")
          }
        >
          <Text
            style={[
              styles.linkText,
              { color: theme.tint },
            ]}
          >
            Don't have an owner account?
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
    paddingTop: 90,
  },

  logo: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
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
    marginBottom: 35,
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
    marginBottom: 18,
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