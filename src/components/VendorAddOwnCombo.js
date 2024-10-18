import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';
import themevariable from '../utils/themevariable';
import CheckIconGreen from '../assets/vendorIcons/checkIconGreen.svg';
import CrossIconRed from '../assets/vendorIcons/crossIconRed.svg';
import { getVendorAuthToken } from '../utils/StoreAuthToken';
import axios from 'axios';
import BASE_URL from '../apiconfig';

const FoodMenu = ({ onSaveClick, }) => {
    const [selectedItems, setSelectedItems] = useState([]); // Ensure this is an array
    const [menuList, setMenuList] = useState([]);
    const [perPlateCost, setPerPlatePrice] = useState(''); // State for per plate price
    const [minOrder, setMinOrderMembers] = useState(''); // State for minimum order members
    const [showCustomTextInput, setShowCustomTextInput] = useState(false); // Show/hide custom item input
    const [customItemVal, setCustomItemVal] = useState(''); // State for custom item value
    const [customItems, setCustomItems] = useState([]); // Track added custom items
    const [title, setcomboTitle] = useState(''); // State for per plate price
    const [mainCourseItems, setMainCourseItems] = useState([]);
    const [rotiItems, setRotiItems] = useState([]);

    const foodItems = [
        { label: 'Pizza', value: 'pizza' },
        { label: 'Burger', value: 'burger'},
        { label: 'Pasta', value: 'pasta' },
        { label: 'Salad', value: 'salad' },
        { label: 'Sushi', value: 'sushi' },
        { label: 'Tacos', value: 'tacos' },
        { label: 'Steak', value: 'steak' },
        { label: 'Fries', value: 'fries' }
    ];

    useEffect(() => {
        getFoodMenuItems()
    }, [])

    const getFoodMenuItems = async () => {

        const token = await getVendorAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/getAllFoodItems`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const foodItemsRes = response?.data?.data;
            if (foodItemsRes && foodItemsRes?.length > 0) {
                // Find the main course category and roti category from data
                const mainCourse = foodItemsRes.find(category => category?.category === "Main Course");
                const roti = foodItemsRes.find(category => category?.category === "Roti");

                // Store the respective items in state
                if (mainCourse) {
                    setMainCourseItems(mainCourse?.items);
                }
                if (roti) {
                    setRotiItems(roti?.items);
                }
            }
            console.log("FOOD MENU LIST ::::::", JSON.stringify(response?.data))

        } catch (error) {
            console.error('Error fetching function halls:', error);
        }
    }

    const handleSaveMenu = () => {
        if(!minOrder || !perPlateCost || !title ){
            Alert.alert("Please fill all Fields");
            return;
        }
        if (selectedItems.length > 0 || customItems.length > 0) {
            const newMenu = {
                // id: Date.now(), 
                items: [...selectedItems, ...customItems], // Include both selected and custom items
                perPlateCost,
                minOrder,
                title
            };
            setMenuList([...menuList, newMenu]);
            setSelectedItems([]); // Reset selected items for the next combo
            setCustomItems([]); // Reset custom items for the next combo
            setPerPlatePrice(''); // Reset price
            setMinOrderMembers(''); // Reset members
            setCustomItemVal(''); // Reset custom item input field
            setcomboTitle('');
            onSaveClick([newMenu]);
        }

    };

    const handleAddCustomItem = () => {
        if (customItemVal.trim()) {
            setCustomItems([...customItems, customItemVal.trim()]); // Add new custom item
            setCustomItemVal(''); // Clear the input field
            setShowCustomTextInput(false); // Hide custom input field
        }
    };

    const handleRemoveItem = (item) => {
        // Remove from selected food items
        setSelectedItems(selectedItems.filter((i) => i !== item));
        // Remove from custom items if applicable
        setCustomItems(customItems.filter((i) => i !== item));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Food Items</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter Combo Name"
                value={title}
                onChangeText={setcomboTitle}
                keyboardType="default"
            />

            <MultiSelect
                style={styles.dropdown}
                data={foodItems}
                labelField="label"
                valueField="value"
                placeholder="Select food items"
                value={selectedItems} // Make sure this is an array
                onChange={(item) => {
                    setSelectedItems(item); // Handle selection as an array
                }}
                selectedTextStyle={styles.selectedText}
                placeholderStyle={styles.placeholderStyle}
                search
                searchPlaceholder="Search food..."
            />
            <Text style={styles.subHeading}>Select Main Course</Text>

            <MultiSelect
                style={styles.dropdown}
                data={mainCourseItems}
                labelField="name"
                valueField="name"
                placeholder="Select Main course"
                value={selectedItems} // Make sure this is an array
                onChange={(item) => {
                    setSelectedItems(item); // Handle selection as an array
                }}
                selectedTextStyle={styles.selectedText}
                placeholderStyle={styles.placeholderStyle}
                search
                searchPlaceholder="Search chicken..."
            />
            <Text style={styles.subHeading}>Select Rotis</Text>

            <MultiSelect
                style={styles.dropdown}
                data={rotiItems}
                labelField="name"
                valueField="name"
                placeholder="Select Rotis"
                value={selectedItems} // Make sure this is an array
                onChange={(item) => {
                    setSelectedItems(item); // Handle selection as an array
                }}
                selectedTextStyle={styles.selectedText}
                placeholderStyle={styles.placeholderStyle}
                search
                searchPlaceholder="Search food..."
            />
            <View style={styles.selectedItemsContainer}>

                {customItems ?
                    <>
                        {customItems.map((item, index) => (
                            <View key={index} style={styles.selectedItem}>
                                <Text style={styles.selectedText}>{item}</Text>
                                <TouchableOpacity onPress={() => handleRemoveItem(item)}>
                                    <Text style={styles.crossIcon}>✗</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </> : null}
            </View>

            <TextInput
                style={styles.input}
                placeholder="Enter per plate Combo price"
                value={perPlateCost}
                onChangeText={setPerPlatePrice}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Enter min Order members"
                value={minOrder}
                onChangeText={setMinOrderMembers}
                keyboardType="numeric"
            />

            {showCustomTextInput && (
                <View style={styles.inputContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            style={[styles.input, { width: "80%" }]}
                            value={customItemVal}
                            onChangeText={(text) => setCustomItemVal(text)}
                            placeholder="Add Custom Item"
                        />
                        <TouchableOpacity style={styles.iconButton} onPress={handleAddCustomItem}>
                            <CheckIconGreen />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton} onPress={() => setCustomItemVal('')}>
                            <CrossIconRed />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <TouchableOpacity
                style={styles.customButton}
                onPress={() => setShowCustomTextInput(!showCustomTextInput)}
            >
                <Text style={styles.customButtonText}>Add Your Customized Item</Text>
            </TouchableOpacity>





            <TouchableOpacity
                style={{ marginTop: 10, backgroundColor: "green", alignItems: "center", alignSelf: "center", width: "100%", paddingVertical: 10, borderRadius: 10 }}
                onPress={handleSaveMenu} disabled={selectedItems.length === 0 && customItems.length === 0} >
                <Text style={{
                    color: "white",
                    fontFamily: 'ManropeRegular',
                    fontWeight: 'bold',
                    fontSize: 14
                }}>Save Combo</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF4E1',
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 10
        // padding: 20
    },
    title: {
        fontFamily: 'ManropeRegular',
        fontWeight: 'bold',
        color: themevariable.Color_000000,
        fontSize: 15,
        marginTop: 15
    },
    subHeading: {
        fontFamily: 'ManropeRegular',
        fontWeight: '400',
        color: themevariable.Color_000000,
        fontSize: 15,
        marginTop: 10
    },
    dropdown: {
        height: 50,
        borderColor: themevariable.Color_C8C8C6,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginTop: 10
    },
    selectedItemsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10
    },
    selectedItem: {
        borderColor: 'gray',
        borderWidth: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 8
    },
    placeholderStyle: {
        fontFamily: 'ManropeRegular',
        fontWeight: '500',
        color: "gray",
        fontSize: 14,
    },
    selectedText: {
        fontFamily: 'ManropeRegular',
        fontWeight: '500',
        color: "black",
        fontSize: 14,
    },
    crossIcon: {
        marginLeft: 10,
        color: 'red',
        fontSize: 16
    },
    subtitle: {
        fontSize: 16,
        marginTop: 20
    },
    menuItem: {
        padding: 10,
        backgroundColor: '#f8f8f8',
        marginVertical: 5
    },
    customButton: {
        backgroundColor: '#D2453B',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20
    },
    customButtonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    inputContainer: {
        marginTop: 10
    },
    input: {
        borderWidth: 1,
        marginTop: 10,
        borderColor: themevariable.Color_C8C8C6,
        paddingHorizontal: 12,
        borderRadius: 4,
    },
    iconButton: {
        marginHorizontal: 5,
        marginTop: 10
    }
});

export default FoodMenu;
