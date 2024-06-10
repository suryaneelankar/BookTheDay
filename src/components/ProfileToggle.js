import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';

const CustomToggle = ({ value, onValueChange }) => {
    const [animation] = useState(new Animated.Value(value ? 1 : 0));

    const toggleSwitch = () => {
        const toValue = value ? 0 : 1;
        Animated.timing(animation, {
            toValue,
            duration: 300,
            useNativeDriver: false,
        }).start();
        onValueChange(!value);
    };

    const backgroundColor = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['#FFF2CF', '#FFF2CF'],
    });

    const thumbPosition = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 26],
    });

    return (
        <TouchableOpacity onPress={toggleSwitch} style={styles.switchContainer}>
            <Animated.View style={[styles.switchBackground, { backgroundColor }]} />
            <Animated.View style={[styles.switchThumb, { transform: [{ translateX: thumbPosition }] }]} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    switchContainer: {
        width: Dimensions.get('window').width/8,
        height: Dimensions.get('window').height/35,
        borderRadius: 13,
        justifyContent: 'center',
        // padding: 2,
        borderColor:'#ECA73C',
        borderWidth:1
    },
    switchBackground: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 10,
    },
    switchThumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#ECA73C',
    },
});

export default CustomToggle;
