import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Animated,
} from "react-native";
import Modal from "react-native-modal";
import LinearGradient from "react-native-linear-gradient";
import IonIcon from "react-native-vector-icons/Ionicons";
import {
  PinchGestureHandler,
  PanGestureHandler,
  GestureHandlerRootView,
  State,
} from "react-native-gesture-handler";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const ZOOM_IN_SCALE = 2.5;

// ─── Single zoomable + pannable image page ────────────────────────────────────
const ZoomablePage = ({ uri, onZoomChange }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  // Scale state
  const baseScale = useRef(new Animated.Value(1)).current;
  const pinchScale = useRef(new Animated.Value(1)).current;
  const lastScale = useRef(1);
  const scale = Animated.multiply(baseScale, pinchScale);

  // Pan state
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastTranslateX = useRef(0);
  const lastTranslateY = useRef(0);
  const panX = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;
  const totalX = Animated.add(translateX, panX);
  const totalY = Animated.add(translateY, panY);

  const pinchRef = useRef(null);
  const panRef = useRef(null);

  const clampOffset = (offset, currentScale, dimension) => {
    const maxOffset = (dimension * (currentScale - 1)) / 2;
    return Math.min(Math.max(offset, -maxOffset), maxOffset);
  };

  const setZoom = useCallback((newScale) => {
    const zoomed = newScale > 1.05;
    setIsZoomed(zoomed);
    onZoomChange(zoomed);
  }, [onZoomChange]);

  const resetAll = useCallback(() => {
    lastScale.current = 1;
    lastTranslateX.current = 0;
    lastTranslateY.current = 0;
    pinchScale.setValue(1);
    panX.setValue(0);
    panY.setValue(0);
    Animated.parallel([
      Animated.spring(baseScale, { toValue: 1, useNativeDriver: true, friction: 5 }),
      Animated.spring(translateX, { toValue: 0, useNativeDriver: true, friction: 5 }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 5 }),
    ]).start();
    setIsZoomed(false);
    onZoomChange(false);
  }, [baseScale, translateX, translateY, pinchScale, panX, panY, onZoomChange]);

  // ── Pinch ──
  const onPinchEvent = Animated.event(
    [{ nativeEvent: { scale: pinchScale } }],
    { useNativeDriver: true }
  );
  const onPinchStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const newScale = Math.min(Math.max(lastScale.current * event.nativeEvent.scale, 1), 4);
      lastScale.current = newScale;
      pinchScale.setValue(1);
      baseScale.setValue(newScale);
      setZoom(newScale);
      if (newScale <= 1.05) {
        lastTranslateX.current = 0;
        lastTranslateY.current = 0;
        translateX.setValue(0);
        translateY.setValue(0);
      }
    }
  };

  // ── Pan — only active when zoomed ──
  const onPanEvent = Animated.event(
    [{ nativeEvent: { translationX: panX, translationY: panY } }],
    { useNativeDriver: true }
  );
  const onPanStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const newX = clampOffset(
        lastTranslateX.current + event.nativeEvent.translationX,
        lastScale.current, screenWidth
      );
      const newY = clampOffset(
        lastTranslateY.current + event.nativeEvent.translationY,
        lastScale.current, screenHeight
      );
      lastTranslateX.current = newX;
      lastTranslateY.current = newY;
      panX.setValue(0);
      panY.setValue(0);
      translateX.setValue(newX);
      translateY.setValue(newY);
    }
  };

  // ── Double-tap toggle ──
  const lastTap = useRef(null);
  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < 300) {
      if (lastScale.current > 1.05) {
        resetAll();
      } else {
        lastScale.current = ZOOM_IN_SCALE;
        pinchScale.setValue(1);
        Animated.spring(baseScale, { toValue: ZOOM_IN_SCALE, useNativeDriver: true, friction: 5 }).start();
        setIsZoomed(true);
        onZoomChange(true);
      }
    }
    lastTap.current = now;
  };

  return (
    <PanGestureHandler
      ref={panRef}
      onGestureEvent={onPanEvent}
      onHandlerStateChange={onPanStateChange}
      simultaneousHandlers={pinchRef}
      // KEY FIX: pan handler only active when zoomed in
      // At scale=1 it is disabled so FlatList receives the horizontal swipe
      enabled={isZoomed}
      minDist={5}
    >
      <Animated.View style={styles.page}>
        <PinchGestureHandler
          ref={pinchRef}
          onGestureEvent={onPinchEvent}
          onHandlerStateChange={onPinchStateChange}
          simultaneousHandlers={panRef}
        >
          <Animated.View
            style={[
              styles.pageTouchable,
              { transform: [{ translateX: totalX }, { translateY: totalY }, { scale }] },
            ]}
          >
            <TouchableOpacity activeOpacity={1} onPress={handleDoubleTap} style={styles.imageTouchable}>
              <Image source={{ uri }} style={styles.image} resizeMode="contain" />
            </TouchableOpacity>
          </Animated.View>
        </PinchGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const ZoomImage = ({ visible, onClose, images, initialIndex }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);
  const [zoomedPages, setZoomedPages] = useState({});
  const flatListRef = useRef(null);

  const isAnyZoomed = Object.values(zoomedPages).some(Boolean);

  const handleZoomChange = useCallback((index, zoomed) => {
    setZoomedPages(prev => ({ ...prev, [index]: zoomed }));
  }, []);

  useEffect(() => {
    if (!visible) return;
    const idx = initialIndex || 0;
    setCurrentIndex(idx);
    setZoomedPages({});
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: idx, animated: false });
    }, 80);
  }, [visible, initialIndex]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 51 }).current;

  const goTo = (index) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
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
      animationInTiming={200}
      animationOutTiming={160}
      useNativeDriver
    >
      <StatusBar hidden />
      <GestureHandlerRootView style={styles.container}>

        <FlatList
          ref={flatListRef}
          data={images}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item, index }) => (
            <ZoomablePage
              uri={item}
              onZoomChange={(zoomed) => handleZoomChange(index, zoomed)}
            />
          )}
          horizontal
          pagingEnabled
          // Disable FlatList scroll when zoomed — pan gesture handles movement
          scrollEnabled={!isAnyZoomed}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex || 0}
          getItemLayout={(_, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          decelerationRate="fast"
          bounces={false}
          disableIntervalMomentum
        />

        {/* ── TOP BAR ── */}
        <LinearGradient
          colors={["rgba(0,0,0,0.8)", "transparent"]}
          style={styles.topBar}
          pointerEvents="box-none"
        >
          <View style={styles.counterPill}>
            <IonIcon name="images-outline" size={13} color="rgba(255,255,255,0.8)" />
            <Text style={styles.counterText}>
              {currentIndex + 1} / {images.length}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
          >
            <IonIcon name="close" size={22} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Arrows hidden when zoomed */}
        {!isAnyZoomed && !isFirst && (
          <TouchableOpacity
            style={[styles.arrow, styles.arrowLeft]}
            onPress={() => goTo(currentIndex - 1)}
            activeOpacity={0.7}
          >
            <IonIcon name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
        )}
        {!isAnyZoomed && !isLast && (
          <TouchableOpacity
            style={[styles.arrow, styles.arrowRight]}
            onPress={() => goTo(currentIndex + 1)}
            activeOpacity={0.7}
          >
            <IonIcon name="chevron-forward" size={22} color="#fff" />
          </TouchableOpacity>
        )}

        {/* ── BOTTOM BAR ── */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.75)"]}
          style={styles.bottomBar}
          pointerEvents="box-none"
        >
          {images.length > 1 && !isAnyZoomed && (
            <View style={styles.dotsRow}>
              {images.map((_, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => goTo(i)}
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
          )}
          <Text style={styles.swipeHint}>
            {isAnyZoomed
              ? "Drag to pan  ·  Double-tap or pinch to reset"
              : "Swipe to browse  ·  Double-tap to zoom"}
          </Text>
        </LinearGradient>

      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  page: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  pageTouchable: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  imageTouchable: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: screenWidth,
    height: screenHeight * 0.85,
  },
  topBar: {
    position: "absolute", top: 0, left: 0, right: 0, zIndex: 20,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingTop: 48, paddingBottom: 28, paddingHorizontal: 20,
  },
  counterPill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  counterText: { color: "#fff", fontSize: 13, fontWeight: "700", fontFamily: "ManropeRegular" },
  closeBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center", alignItems: "center",
  },
  arrow: {
    position: "absolute", top: "50%", zIndex: 20,
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center", alignItems: "center",
    transform: [{ translateY: -22 }],
    borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
  },
  arrowLeft: { left: 14 },
  arrowRight: { right: 14 },
  bottomBar: {
    position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20,
    alignItems: "center", paddingTop: 32, paddingBottom: 44, paddingHorizontal: 20, gap: 10,
  },
  dotsRow: {
    flexDirection: "row", alignItems: "center", gap: 6,
    flexWrap: "wrap", justifyContent: "center", maxWidth: screenWidth - 80,
  },
  dot: { borderRadius: 4, height: 6 },
  dotActive: { width: 20, backgroundColor: "#FD813B" },
  dotInactive: { width: 6, backgroundColor: "rgba(255,255,255,0.35)" },
  swipeHint: {
    color: "rgba(255,255,255,0.4)", fontSize: 11,
    fontFamily: "ManropeRegular", textAlign: "center",
  },
});

export default ZoomImage;
