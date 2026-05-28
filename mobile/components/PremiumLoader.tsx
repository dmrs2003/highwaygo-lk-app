import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export default function PremiumLoader() {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      {[1, 2, 3].map((item) => (
        <Animated.View key={item} style={[styles.card, animatedStyle]}>
          <View style={styles.image} />
          <View style={styles.lineLarge} />
          <View style={styles.lineSmall} />
          <View style={styles.button} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
  },
  image: {
    height: 120,
    borderRadius: 18,
    backgroundColor: "#E8F1FF",
    marginBottom: 14,
  },
  lineLarge: {
    height: 18,
    width: "70%",
    borderRadius: 10,
    backgroundColor: "#D8E2F0",
    marginBottom: 10,
  },
  lineSmall: {
    height: 14,
    width: "45%",
    borderRadius: 10,
    backgroundColor: "#D8E2F0",
    marginBottom: 16,
  },
  button: {
    height: 45,
    borderRadius: 14,
    backgroundColor: "#D8E2F0",
  },
});
