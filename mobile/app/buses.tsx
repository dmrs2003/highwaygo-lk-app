import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  useColorScheme,
} from "react-native";
import { router } from "expo-router";
import API from "../services/api";
import { darkTheme, lightTheme } from "../constants/colors";

type Bus = {
  _id: string;
  busName: string;
  busNumber: string;
  routeFrom: string;
  routeTo: string;
  departureTime: string;
  arrivalTime?: string;
  price: number;
  totalSeats: number;
  imageUrl: string;
};

export default function Buses() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBuses = async () => {
    try {
      const res = await API.get("/buses");
      setBuses(res.data);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to load buses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.bg },
      ]}
    >
      <Text style={[styles.title, { color: theme.text }]}>
        Available Buses 🚍
      </Text>

      {loading ? (
        <Text style={[styles.loading, { color: theme.text }]}>
          Loading buses...
        </Text>
      ) : (
        <FlatList
          data={buses}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                { backgroundColor: theme.card },
              ]}
            >
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.busImage}
                resizeMode="cover"
              />

              <View style={styles.topRow}>
                <View>
                  <Text
                    style={[
                      styles.busName,
                      { color: theme.text },
                    ]}
                  >
                    {item.busName}
                  </Text>

                  <Text
                    style={[
                      styles.busNumber,
                      { color: theme.muted },
                    ]}
                  >
                    {item.busNumber}
                  </Text>
                </View>

                <View
                  style={[
                    styles.priceBadge,
                    { backgroundColor: theme.primary },
                  ]}
                >
                  <Text style={styles.priceText}>
                    LKR {item.price}
                  </Text>
                </View>
              </View>

              <View style={styles.routeContainer}>
                <View>
                  <Text
                    style={[
                      styles.routeLabel,
                      { color: theme.muted },
                    ]}
                  >
                    From
                  </Text>

                  <Text
                    style={[
                      styles.routeText,
                      { color: theme.text },
                    ]}
                  >
                    {item.routeFrom}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.arrow,
                    { color: theme.primary },
                  ]}
                >
                  →
                </Text>

                <View>
                  <Text
                    style={[
                      styles.routeLabel,
                      { color: theme.muted },
                    ]}
                  >
                    To
                  </Text>

                  <Text
                    style={[
                      styles.routeText,
                      { color: theme.text },
                    ]}
                  >
                    {item.routeTo}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View>
                  <Text
                    style={[
                      styles.infoLabel,
                      { color: theme.muted },
                    ]}
                  >
                    Departure
                  </Text>

                  <Text
                    style={[
                      styles.infoValue,
                      { color: theme.text },
                    ]}
                  >
                    {item.departureTime}
                  </Text>
                </View>

                <View>
                  <Text
                    style={[
                      styles.infoLabel,
                      { color: theme.muted },
                    ]}
                  >
                    Arrival
                  </Text>

                  <Text
                    style={[
                      styles.infoValue,
                      { color: theme.text },
                    ]}
                  >
                    {item.arrivalTime || "N/A"}
                  </Text>
                </View>

                <View>
                  <Text
                    style={[
                      styles.infoLabel,
                      { color: theme.muted },
                    ]}
                  >
                    Seats
                  </Text>

                  <Text
                    style={[
                      styles.infoValue,
                      { color: theme.text },
                    ]}
                  >
                    {item.totalSeats}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: theme.primary },
                ]}
                onPress={() =>
                  router.push(
                    `/seat-selection?busId=${item._id}`
                  )
                }
              >
                <Text style={styles.buttonText}>
                  Select Seats 🎫
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={[
          styles.backButton,
          { borderColor: theme.primary },
        ]}
        onPress={() => router.push("/home")}
      >
        <Text
          style={[
            styles.backText,
            { color: theme.primary },
          ]}
        >
          Back Home
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 18,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },

  loading: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },

  card: {
    borderRadius: 24,
    marginBottom: 20,
    overflow: "hidden",
  },

  busImage: {
    width: "100%",
    height: 200,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 18,
  },

  busName: {
    fontSize: 22,
    fontWeight: "bold",
  },

  busNumber: {
    marginTop: 4,
    fontSize: 14,
  },

  priceBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    justifyContent: "center",
  },

  priceText: {
    color: "#071A2F",
    fontWeight: "bold",
    fontSize: 15,
  },

  routeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    marginTop: 22,
  },

  routeLabel: {
    fontSize: 13,
    marginBottom: 5,
  },

  routeText: {
    fontSize: 20,
    fontWeight: "bold",
  },

  arrow: {
    fontSize: 34,
    fontWeight: "bold",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    paddingHorizontal: 18,
  },

  infoLabel: {
    fontSize: 12,
    marginBottom: 5,
  },

  infoValue: {
    fontSize: 16,
    fontWeight: "bold",
  },

  button: {
    margin: 18,
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  buttonText: {
    color: "#071A2F",
    fontSize: 17,
    fontWeight: "bold",
  },

  backButton: {
    position: "absolute",
    bottom: 20,
    left: 18,
    right: 18,
    borderWidth: 2,
    padding: 15,
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: "transparent",
  },

  backText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});