import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>

      {/* LOGO IMAGE */}
      <Image
        source={require("../assets/images/ChatGPT Image May 6, 2026, 08_39_26 AM.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* TITLE */}
      <Text style={styles.title}>Welcome to HighwayGo LK 🚍</Text>

      {/* DESCRIPTION */}
      <Text style={styles.subtitle}>
        Your one-stop solution for booking highway buses across Sri Lanka
      </Text>

      <Text style={styles.subtitle2}>
        Book highway buses easily and travel smarter with live tracking and
        real-time updates.
      </Text>

      {/* VIEW BUSES BUTTON */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/buses")}
      >
        <Text style={styles.buttonText}>View Buses</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1E3D",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  logo: {
    width: 220,
    height: 220,
    marginBottom: 20,
  },

  title: {
    color: "#FFD447",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },

  subtitle: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 28,
  },

  subtitle2: {
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },

  button: {
    backgroundColor: "#FFD447",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    elevation: 5,
  },

  buttonText: {
    color: "#0B1E3D",
    fontSize: 18,
    fontWeight: "bold",
  },
});