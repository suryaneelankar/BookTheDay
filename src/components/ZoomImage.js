import React, { useEffect, useState } from "react";
import { View, Dimensions, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import ImageZoom from "react-native-image-pan-zoom";

const ZoomImage = ({ visible, onClose, images, initialIndex, tokenIs }) => {
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;
   


    const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);
    useEffect(() => {
        setCurrentIndex(initialIndex || 0);
    }, [initialIndex]);

    console.log("initial index::::::", initialIndex);
    console.log("current index is::::", currentIndex);

    const handleNext = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };


    return (
        <Modal isVisible={visible} onBackdropPress={onClose} style={{ margin: 0, flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: "white", marginHorizontal: 20, borderRadius: 20, marginVertical: 20 }}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeText}>X</Text>
                </TouchableOpacity>

                <View style={styles.imageContainer}>
                    <TouchableOpacity style={styles.arrowLeft} onPress={handlePrevious} disabled={currentIndex === 0}>
                        <Text style={[styles.arrowText, currentIndex === 0 && styles.arrowDisabled]}>{"<"}</Text>
                    </TouchableOpacity>
                    <ImageZoom
                        cropWidth={screenWidth}
                        cropHeight={screenHeight - 80}
                        imageWidth={screenWidth}
                        imageHeight={screenHeight - 150}
                    >
                        <Image
                            source={{
                                uri: images[currentIndex],
                                headers: { Authorization: `Bearer ${tokenIs}` }
                            }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </ImageZoom>
                    <TouchableOpacity
                        style={styles.arrowRight}
                        onPress={handleNext}
                        disabled={currentIndex === images.length - 1}
                    >
                        <Text style={[styles.arrowText, currentIndex === images.length - 1 && styles.arrowDisabled]}>
                            {">"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        // width: Dimensions.get("window").width,
        // height: Dimensions.get("window").height - 80,
        justifyContent: "center",
        // alignItems: "center",
        // flexDirection: "row",
    },
    image: {
        width: Dimensions.get("window").width - 100,
        height: Dimensions.get("window").height - 200,
        marginHorizontal: 30
    },
    closeText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    arrowLeft: {
        position: "absolute",
        left: 10,
        zIndex: 1,
    },
    arrowRight: {
        position: "absolute",
        right: 10,
        zIndex: 1,
    },
    arrowText: {
        fontSize: 25,
        fontWeight: "bold",
        color: "black",
    },
    arrowDisabled: {
        color: "lightgray",
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 2,
        backgroundColor: "gray",
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
    },
    closeText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default ZoomImage;
