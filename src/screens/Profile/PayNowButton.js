import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import { moderateScale, verticalScale } from "../../utils/scalingMetrics";

const PayNowButton = ({ onPress, text, disabled, }) => {

    const [loading, setLoading] = useState(false);

    const handlePress = async () => {
        if (loading) return; // Prevent multiple clicks
        setLoading(true);

        try {
            await onPress(); // Ensure `onPress` is an async function
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableOpacity onPress={handlePress} style={[styles.container]} disabled={disabled} activeOpacity={0.5}>
            <LinearGradient
                colors={['#D2453B', '#A0153E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                    styles.buttonView,
                    { alignSelf: 'center' },
                    disabled && { opacity: 0.5 } // Add this line
                ]}
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {loading ? (
                        <ActivityIndicator color="#F4F4F6" />
                    ) : (
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", flexDirection: "row", position: "relative" }}>
                            <Text style={styles.buttonText}>
                                {text}
                            </Text>
                        </View>
                    )}
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

export default PayNowButton;

const styles = StyleSheet.create({
    container: {
        // backgroundColor: "white",
        paddingVertical: verticalScale(15),
        width: 120,
        alignSelf: "center"
    },
    buttonView: {
        padding: 8,
        borderRadius: moderateScale(4),
        alignItems: "center",

    },
    buttonText: {
        color: "#F4F4F6",
        fontSize: 14,
        fontWeight: "600",
        fontFamily: "ManropeRegular",
        textAlign: "center"
    },
    SubmitbuttonText: {
        color: "#F4F4F6",
        fontSize: 16,
        fontWeight: "600",
        fontFamily: "ManropeRegular",
        textAlign: "center"
    }
})
