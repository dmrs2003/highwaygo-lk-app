import { useEffect, useState } from "react";
import { router } from "expo-router";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  View,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const token = await AsyncStorage.getItem("token");
    const ownerToken = await AsyncStorage.getItem("ownerToken");

    if (token) {
      router.replace("/home");
      return;
    }

    if (ownerToken) {
      router.replace("/owner-dashboard");
      return;
    }

    setChecking(false);
  };

  if (checking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1457D9" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Image
        source={require("../assets/images/index-bus.png")}
        style={styles.heroImage}
        resizeMode="cover"
      />

      <Text style={styles.title}>HighwayGo LK</Text>

      <Text style={styles.subtitle}>
        Smart highway bus booking with modern seat selection and secure travel experience.
      </Text>

      <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/login")}>
        <Text style={styles.primaryText}>Passenger Login ›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.ownerButton} onPress={() => router.push("/owner-login")}>
        <Text style={styles.ownerText}>Owner Login ›</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F4F8FF",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexGrow: 1,
    backgroundColor: "#F4F8FF",
    paddingBottom: 25,
    alignItems: "center",
  },
  heroImage: {
    width: "100%",
    height: 260,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    marginBottom: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: "#071A2F",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 17,
    color: "#4B5B73",
    textAlign: "center",
    lineHeight: 26,
    paddingHorizontal: 28,
    marginBottom: 22,
  },
  primaryButton: {
    width: "90%",
    backgroundColor: "#1457D9",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 14,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
  ownerButton: {
    width: "90%",
    backgroundColor: "#071A2F",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  ownerText: {
    color: "#FFD447",
    fontWeight: "900",
    fontSize: 16,
  },
});