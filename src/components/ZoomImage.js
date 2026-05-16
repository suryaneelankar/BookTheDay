import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
} from "react-native";
import Modal from "react-native-modal";
import ImageZoom from "react-native-image-pan-zoom";
import LinearGradient from "react-native-linear-gradient";
import IonIcon from "react-native-vector-icons/Ionicons";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const ZoomImage = ({ visible, onClose, images, initialIndex, tokenIs }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setCurrentIndex(initialIndex || 0);
  }, [initialIndex]);

  const animateAndGo = (nextIndex) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
    setCurrentIndex(nextIndex);
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) animateAndGo(currentIndex + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) animateAndGo(currentIndex - 1);
  };

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === images.length - 1;

  return (
    <Modal
      isVisible={visible}
      backdropOpacity={1}
      backdropColor="#000"
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={{ margin: 0 }}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationInTiming={220}
      animationOutTiming={180}
      useNativeDriver
    >
      <StatusBar hidden />
      <View style={styles.container}>

        {/* ── TOP BAR ── */}
        <LinearGradient
          colors={["rgba(0,0,0,0.75)", "transparent"]}
          style={styles.topBar}
        >
          {/* counter pill */}
          <View style={styles.counterPill}>
            <IonIcon name="images-outline" size={13} color="rgba(255,255,255,0.7)" />
            <Text style={styles.counterText}>
              {currentIndex + 1} / {images.length}
            </Text>
          </View>

          {/* close button */}
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <IonIcon name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        {/* ── IMAGE ── */}
        <Animated.View style={[styles.imageWrapper, { opacity: fadeAnim }]}>
          <ImageZoom
            cropWidth={screenWidth}
            cropHeight={screenHeight * 0.78}
            imageWidth={screenWidth}
            imageHeight={screenHeight * 0.78}
            enableSwipeDown
            onSwipeDown={onClose}
          >
            <Image
              source={{ uri: images[currentIndex] }}
              style={styles.image}
              resizeMode="contain"
            />
          </ImageZoom>
        </Animated.View>

        {/* ── PREV / NEXT ARROWS ── */}
        <TouchableOpacity
          style={[styles.arrow, styles.arrowLeft, isFirst && styles.arrowDisabled]}
          onPress={handlePrevious}
          disabled={isFirst}
          activeOpacity={0.7}
        >
          <IonIcon name="chevron-back" size={22} color={isFirst ? "rgba(255,255,255,0.25)" : "#fff"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.arrow, styles.arrowRight, isLast && styles.arrowDisabled]}
          onPress={handleNext}
          disabled={isLast}
          activeOpacity={0.7}
        >
          <IonIcon name="chevron-forward" size={22} color={isLast ? "rgba(255,255,255,0.25)" : "#fff"} />
        </TouchableOpacity>

        {/* ── BOTTOM BAR ── */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.bottomBar}
        >
          {/* dot indicators */}
          <View style={styles.dotsRow}>
            {images.map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => animateAndGo(i)}
                hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              >
                <View
                  style={[
                    styles.dot,
                    i === currentIndex ? styles.dotActive : styles.dotInactive,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.swipeHint}>Pinch to zoom  ·  Swipe down to close</Text>
        </LinearGradient>

      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },

  // ── TOP BAR ──
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  counterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  counterText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "ManropeRegular",
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  // ── IMAGE ──
  imageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: screenWidth,
    height: screenHeight * 0.78,
  },

  // ── ARROWS ──
  arrow: {
    position: "absolute",
    top: "50%",
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
    transform: [{ translateY: -22 }],
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  arrowLeft: {
    left: 14,
  },
  arrowRight: {
    right: 14,
  },
  arrowDisabled: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: "rgba(255,255,255,0.06)",
  },

  // ── BOTTOM BAR ──
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 40,
    paddingHorizontal: 20,
    gap: 10,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: screenWidth - 80,
  },
  dot: {
    borderRadius: 4,
    height: 6,
  },
  dotActive: {
    width: 20,
    backgroundColor: "#FD813B",
  },
  dotInactive: {
    width: 6,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  swipeHint: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 11,
    fontFamily: "ManropeRegular",
    textAlign: "center",
  },
});

export default ZoomImage;
