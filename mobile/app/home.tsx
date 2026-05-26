import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

export default function Home() {
  return (
    <View style={styles.wrapper}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.logo}>
            HighwayGo{" "}
            <Text style={styles.logoBlue}>LK</Text>
          </Text>

          <Text style={styles.bell}>🔔</Text>
        </View>

        {/* HERO IMAGE */}

        <Image
          source={require("../assets/images/index-bus.png")}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* GREETING */}

        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greeting}>
              Hello, Passenger 👋
            </Text>

            <Text style={styles.subGreeting}>
              Where would you like to travel today?
            </Text>
          </View>

          <TouchableOpacity
            style={styles.profileCircle}
            onPress={() => router.push("/profile")}
          >
            <Text style={styles.profileIcon}>
              👤
            </Text>
          </TouchableOpacity>
        </View>

        {/* SEARCH CARD */}

        <View style={styles.searchCard}>
          <InfoRow
            icon="📍"
            label="From"
            value="Colombo"
          />

          <View style={styles.divider} />

          <InfoRow
            icon="📍"
            label="To"
            value="Kandy"
          />

          <View style={styles.divider} />

          <View style={styles.grid}>
            <InfoBox
              icon="📅"
              label="Journey Date"
              value="24 May 2026"
            />

            <InfoBox
              icon="👤"
              label="Passengers"
              value="1 Passenger"
            />
          </View>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={() =>
              router.push("/buses")
            }
          >
            <Text style={styles.searchText}>
              🔍 Search Buses
            </Text>
          </TouchableOpacity>
        </View>

        {/* POPULAR ROUTES */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Popular Routes
          </Text>

          <Text style={styles.viewAll}>
            View All
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <RouteCard
            from="Colombo"
            to="Kandy"
            price="LKR 1,250"
          />

          <RouteCard
            from="Colombo"
            to="Kurunegala"
            price="LKR 1,100"
          />

          <RouteCard
            from="Kandy"
            to="Galle"
            price="LKR 1,450"
          />
        </ScrollView>

        {/* FEATURES */}

        <Text style={styles.sectionTitle}>
          Why Choose Us?
        </Text>

        <View style={styles.featureRow}>
          <FeatureCard
            icon="🛡️"
            title="Secure"
            text="Safe booking"
          />

          <FeatureCard
            icon="⏱️"
            title="Fast"
            text="Quick seats"
          />

          <FeatureCard
            icon="📍"
            title="Tracking"
            text="Live GPS"
          />
        </View>
      </ScrollView>

      {/* BOTTOM NAV */}

      <View style={styles.bottomNav}>
        <NavItem
          icon="🏠"
          label="Home"
          active
          onPress={() =>
            router.push("/home")
          }
        />

        <NavItem
          icon="🎫"
          label="Bookings"
          onPress={() =>
            router.push("/my-bookings" as any)
          }
        />

        <NavItem
          icon="🏷️"
          label="Offers"
        />

        <NavItem
          icon="👤"
          label="Profile"
          onPress={() =>
            router.push("/profile")
          }
        />
      </View>
    </View>
  );
}

/* ================= COMPONENTS ================= */

function InfoRow({
  icon,
  label,
  value,
}: any) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Text>{icon}</Text>
      </View>

      <View>
        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text style={styles.infoValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: any) {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.boxIcon}>
        {icon}
      </Text>

      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value}
      </Text>
    </View>
  );
}

function RouteCard({
  from,
  to,
  price,
}: any) {
  return (
    <View style={styles.routeCard}>
      <Image
        source={require("../assets/images/index-bus.png")}
        style={styles.routeImage}
        resizeMode="cover"
      />

      <Text style={styles.routeTitle}>
        {from} → {to}
      </Text>

      <Text style={styles.rating}>
        ⭐ 4.6
      </Text>

      <Text style={styles.routePrice}>
        From {price}
      </Text>
    </View>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: any) {
  return (
    <View style={styles.featureCard}>
      <Text style={styles.featureIcon}>
        {icon}
      </Text>

      <Text style={styles.featureTitle}>
        {title}
      </Text>

      <Text style={styles.featureText}>
        {text}
      </Text>
    </View>
  );
}

function NavItem({
  icon,
  label,
  active,
  onPress,
}: any) {
  return (
    <TouchableOpacity
      style={styles.navItem}
      onPress={onPress}
    >
      <Text
        style={
          active
            ? styles.navIconActive
            : styles.navIcon
        }
      >
        {icon}
      </Text>

      <Text
        style={
          active
            ? styles.navTextActive
            : styles.navText
        }
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F4F8FF",
    paddingTop: 55,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    fontSize: 24,
    fontWeight: "900",
    color: "#071A2F",
  },

  logoBlue: {
    color: "#1457D9",
  },

  bell: {
    fontSize: 24,
  },

  heroImage: {
    width: "100%",
    height: 210,
    borderRadius: 28,
    marginTop: 22,
  },

  greetingRow: {
    marginTop: 26,
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greeting: {
    fontSize: 26,
    fontWeight: "900",
    color: "#071A2F",
  },

  subGreeting: {
    color: "#667085",
    marginTop: 5,
  },

  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: "#E8F1FF",
    alignItems: "center",
    justifyContent: "center",
  },

  profileIcon: {
    fontSize: 22,
  },

  searchCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
    marginBottom: 26,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  infoIcon: {
    width: 44,
    height: 44,
    backgroundColor: "#E8F1FF",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  infoLabel: {
    color: "#667085",
    fontSize: 12,
    fontWeight: "700",
  },

  infoValue: {
    color: "#071A2F",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5EAF2",
    marginVertical: 16,
  },

  grid: {
    flexDirection: "row",
    gap: 14,
    marginTop: 4,
  },

  infoBox: {
    flex: 1,
    backgroundColor: "#F8FBFF",
    borderRadius: 18,
    padding: 15,
  },

  boxIcon: {
    fontSize: 22,
    marginBottom: 8,
  },

  searchButton: {
    backgroundColor: "#1457D9",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 18,
  },

  searchText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    color: "#071A2F",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 16,
  },

  viewAll: {
    color: "#1457D9",
    fontWeight: "800",
  },

  routeCard: {
    width: 155,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 12,
    marginRight: 14,
    marginBottom: 28,
  },

  routeImage: {
    width: "100%",
    height: 95,
    borderRadius: 15,
    marginBottom: 10,
  },

  routeTitle: {
    color: "#071A2F",
    fontWeight: "900",
    fontSize: 14,
  },

  rating: {
    color: "#F5A400",
    marginTop: 6,
    fontSize: 12,
  },

  routePrice: {
    color: "#667085",
    fontSize: 12,
    marginTop: 8,
  },

  featureRow: {
    flexDirection: "row",
    gap: 12,
    paddingBottom: 110,
  },

  featureCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
  },

  featureIcon: {
    fontSize: 28,
    marginBottom: 8,
  },

  featureTitle: {
    color: "#071A2F",
    fontWeight: "900",
    fontSize: 14,
  },

  featureText: {
    color: "#667085",
    fontSize: 12,
    marginTop: 4,
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    height: 78,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  navItem: {
    alignItems: "center",
  },

  navIcon: {
    fontSize: 22,
    opacity: 0.55,
  },

  navIconActive: {
    fontSize: 24,
  },

  navText: {
    color: "#667085",
    fontSize: 12,
    marginTop: 4,
  },

  navTextActive: {
    color: "#1457D9",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "900",
  },
});