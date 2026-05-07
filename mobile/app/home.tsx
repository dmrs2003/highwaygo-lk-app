import { View, Text, StyleSheet } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Welcome to HighwayGo LK 🚍</Text>

      <img src="C:\Users\user\OneDrive\Desktop\highwaygo-lk-app\highwaygo-lk-app\mobile\assets\images\ChatGPT Image May 6, 2026, 08_39_26 AM.png" alt="HighwayGo LK" />

      <Text style={styles.subtitle}>
          Your one-stop solution for booking highway buses across Sri Lanka
          {"\n\n"}
      </Text>

      <Text style={styles.subtitle}>
        Book highway buses easily across Sri Lanka
      </Text>

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

  title: {
    color: "#FFD447",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  subtitle: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});