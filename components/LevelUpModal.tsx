import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LevelUpModalProps {
  visible: boolean;
  level: number;
  onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ visible, level, onClose }) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
    }
  }, [visible]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient
            colors={colors.gradients.primary}
            style={styles.modalContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Animated.View style={{ transform: [{ rotate }] }}>
              <Ionicons name="trophy" size={80} color="#FFD700" />
            </Animated.View>

            <Text style={styles.levelUpText}>LEVEL UP!</Text>
            <Text style={styles.levelText}>Level {level}</Text>

            <View style={styles.sparkles}>
              <Ionicons name="sparkles" size={24} color="#FFD700" />
              <Ionicons name="sparkles" size={24} color="#FFD700" />
              <Ionicons name="sparkles" size={24} color="#FFD700" />
            </View>

            <Text style={styles.congratsText}>Congratulations! Keep up the great work!</Text>

            <TouchableOpacity onPress={onClose} activeOpacity={0.8}>
              <LinearGradient colors={["#FFD700", "#FFA500"]} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    borderRadius: 24,
    overflow: "hidden",
  },
  modalContent: {
    padding: 32,
    alignItems: "center",
  },
  levelUpText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    marginTop: 20,
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  levelText: {
    fontSize: 48,
    fontWeight: "900",
    color: "#FFD700",
    marginTop: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  sparkles: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    marginBottom: 16,
  },
  congratsText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.9,
  },
  closeButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default LevelUpModal;
