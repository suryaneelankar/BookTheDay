import React from "react";
import { View, Dimensions, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import ImageZoom from "react-native-image-pan-zoom";

const ZoomImage = ({ visible, onClose, images, initialIndex, tokenIs }) => {
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;

    return (
        <Modal
            isVisible={visible}
            onBackdropPress={onClose}
            style={{ margin: 0,flex:1 }}
        >
            <View style={{ flex: 1, backgroundColor: "white", margin: 20, padding: 20, borderRadius: 20 }}>
                <SwiperFlatList
                    index={initialIndex}
                    paginationDefaultColor='lightgray'
                    paginationActiveColor='gray'
                    data={images}
                    showPagination={true}
                    paginationStyle={{ bottom: "30%" }}
                    paginationStyleItem={{ alignSelf: 'center' }}
                    paginationStyleItemInactive={{ width: 7, height: 7 }}
                    paginationStyleItemActive={{ width: 12, height: 12 }}
                    style={{ flex: 1, alignSelf: "center", }}
                    renderItem={({ item }) => (
                        <View style={styles.imageContainer}>
                            <ImageZoom
                                cropWidth={screenWidth}
                                cropHeight={screenHeight - 80}
                                imageWidth={screenWidth}
                                imageHeight={screenHeight - 150}
                            >
                                <Image
                                    source={{
                                        uri: item,
                                        headers: { Authorization: `Bearer ${tokenIs}` }
                                    }}
                                    style={styles.image}
                                    resizeMode="contain"
                                />
                            </ImageZoom>
                        </View>
                    )}
                />
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                >
                    <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height - 80,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: Dimensions.get("window").width - 40,
        height: Dimensions.get("window").height - 200,
    },
    closeButton: {
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    closeText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default ZoomImage;
