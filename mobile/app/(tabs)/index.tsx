import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>

      <Text style={styles.logo}>HighwayGo LK 🚍</Text>

      <Text style={styles.subtitle}>
        Sri Lanka Highway Bus Booking App
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.outlineButton}
        onPress={() => router.push("/register")}
      >
        <Text style={styles.outlineText}>Register</Text>
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
    fontSize: 34,
    fontWeight: "bold",
    color: "#FFD447",
    marginBottom: 15,
  },

  subtitle: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 50,
    textAlign: "center",
  },

  button: {
    backgroundColor: "#FFD447",
    width: "100%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "#0B1E3D",
    fontSize: 18,
    fontWeight: "bold",
  },

  outlineButton: {
    borderWidth: 2,
    borderColor: "#FFD447",
    width: "100%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  outlineText: {
    color: "#FFD447",
    fontSize: 18,
    fontWeight: "bold",
  },
});