import React, { useState } from 'react'
import { Pressable, Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import themevariable from '../utils/themevariable'
import VegIcon from '../assets/svgs/foodtype/veg.svg';
import NonVegIcon from '../assets/svgs/foodtype/NonVeg.svg';

const ChooseMenuField = (props) => {
    const { label, placeholder, isRequired, onPressChooseFile, IconName, onChangeTextValue } = props

    const [textValue, setTextValue] = useState('');

    const handleTextChange = (text) => {
        setTextValue(text);
        onChangeTextValue(text); // Call the parent function to update the value
    };

    return (
        <View style={styles.root}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.label}>
                    {label}
                    {isRequired && <Text style={styles.isRequired}>*</Text>}
                </Text>
                {IconName === 'veg' && <VegIcon style={{ marginHorizontal: 5, marginTop: 5 }} />}
                {IconName === 'non-veg' &&
                    <NonVegIcon style={{ marginHorizontal: 5, marginTop: 5 }} />}
                <Text style={[styles.label, { fontWeight: "800", color: "#FD813B" }]}>{textValue && `₹ ${textValue}/-`}</Text>
            </View>
            <View style={styles.fieldContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder={placeholder}
                    placeholderTextColor="#939393"
                    keyboardType='numeric' // Assuming this is a numeric input
                    value={textValue} // Bind the input value to a state variable
                    onChangeText={handleTextChange} // Update the state when the text changes
                />
                {/* <Text style={styles.placeholder}>{placeholder}</Text> */}
                <TouchableOpacity style={styles.buttonContainer}
                    onPress={onPressChooseFile}
                >
                    <Text style={styles.text}>Choose File</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ChooseMenuField

const styles = StyleSheet.create({
    textInput: {
        // borderWidth: 1,
        // borderColor: '#ECA73C',
        borderRadius: 5,
        padding: 10,
        fontSize: 14,
        color: '#333333',
        // marginTop: 5,
        flex: 1, // Ensures it takes up available space
    },
    root: {
        marginBottom: 20,
        marginTop: 10,
    },
    label: {
        fontFamily: 'ManropeRegular',
        fontWeight: 'bold',
        color: themevariable.Color_000000,
        fontSize: 18,
    },
    isRequired: {
        color: themevariable.Color_E73626,
    },
    fieldContainer: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: themevariable.Color_C8C8C6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        height: 50,
        borderRadius: 5
    },
    placeholder: {
        alignSelf: 'center',
        color: themevariable.Color_D9D9D9,
        fontWeight: '500',
    },
    buttonContainer: {
        width: 110,
        backgroundColor: themevariable.Color_FD813B,
        borderRadius: 18,
        padding: 5,
        height: 32,
        alignSelf: 'center'
    },
    text: {
        fontSize: 15,
        color: themevariable.Color_FFFFFF,
        alignSelf: 'center'
    }
})