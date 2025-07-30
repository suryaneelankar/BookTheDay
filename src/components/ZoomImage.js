import React, { useEffect, useState } from "react";
import { View, Dimensions, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import ImageZoom from "react-native-image-pan-zoom";
import RightSideIcon from '../assets/profilesvgs/zoomRight.svg';
import LeftSideIcon from '../assets/profilesvgs/zoomLeft.svg';
import CloseIcon from '../assets/profilesvgs/zoomClose.svg';

const ZoomImage = ({ visible, onClose, images, initialIndex, tokenIs }) => {
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;
    const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);
    useEffect(() => {
        setCurrentIndex(initialIndex || 0);
    }, [initialIndex]);

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
        <Modal backdropColor="rgba(0,0,0,0.7)" isVisible={visible} onBackdropPress={onClose} style={{ margin: 0, flex: 1,}}>
            <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", marginVertical: 60 }}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <CloseIcon />
                </TouchableOpacity>

                <View style={styles.imageContainer}>
                    <TouchableOpacity style={styles.arrowLeft} onPress={handlePrevious} disabled={currentIndex === 0}>
                            <LeftSideIcon />
                    </TouchableOpacity>
                    <ImageZoom
                        cropWidth={screenWidth}
                        cropHeight={screenHeight}
                        imageWidth={screenWidth}
                        imageHeight={screenHeight}
                    >
                        <Image
                            source={{
                                uri: images[currentIndex],
                                // headers: { Authorization: `Bearer ${tokenIs}` }
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
                            <RightSideIcon />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        justifyContent: "center",
    },
    image: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
    arrowLeft: {
        position: "absolute",
        left: 10,
        zIndex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 10,
        borderRadius: 20,
        top: "50%",
        transform: [{ translateY: -20 }],
        justifyContent: "center",
        alignItems: "center",
        width: 40,
        height: 40,
        opacity: 0.7,
        borderColor: "white",
        borderWidth: 1,
    },
    arrowRight: {
        position: "absolute",
        right: 10,
        zIndex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 10,
        borderRadius: 20,
        top: "50%",
        transform: [{ translateY: -20 }],
        justifyContent: "center",
        alignItems: "center",
        width: 40,
        height: 40,
        opacity: 0.7,
        borderColor: "white",
        borderWidth: 1,
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
        top: "10%",
        right: 10,
        zIndex: 2,
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        backgroundColor: "rgba(0,0,0,0.5)",
        opacity: 0.7,
        borderColor: "white",
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 10,
        padding: 5,
    },
});

export default ZoomImage;
