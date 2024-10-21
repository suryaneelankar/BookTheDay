import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';
import themevariable from '../utils/themevariable';
import CheckIconGreen from '../assets/vendorIcons/checkIconGreen.svg';
import CrossIconRed from '../assets/vendorIcons/crossIconRed.svg';
import { getVendorAuthToken } from '../utils/StoreAuthToken';
import axios from 'axios';
import BASE_URL from '../apiconfig';

const FoodMenu = ({ onSaveClick }) => {
    const [menuList, setMenuList] = useState([]);
    const [perPlateCost, setPerPlatePrice] = useState(''); // State for per plate price
    const [minOrder, setMinOrderMembers] = useState(''); // State for minimum order members
    const [showCustomTextInput, setShowCustomTextInput] = useState(false); // Show/hide custom item input
    const [customItemVal, setCustomItemVal] = useState(''); // State for custom item value
    const [customItems, setCustomItems] = useState([]); // Track added custom items
    const [title, setcomboTitle] = useState(''); // Combo title
    const [foodCategories, setFoodCategories] = useState([]); // Holds categories like Main Course, Roti
    const [selectedItemsByCategory, setSelectedItemsByCategory] = useState({}); // Track selected items per category

    useEffect(() => {
        getFoodMenuItems();
    }, []);

    const getFoodMenuItems = async () => {
        const token = await getVendorAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/getAllFoodItems`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const foodItemsRes = response?.data?.data;
            if (foodItemsRes && foodItemsRes.length > 0) {
                setFoodCategories(foodItemsRes); // Store categories and items
            }
        } catch (error) {
            console.error('Error fetching food items:', error);
        }
    };

    const handleSaveMenu = () => {
        if (!minOrder || !perPlateCost || !title) {
            Alert.alert('Please fill all fields');
            return;
        }

        const selectedItems = Object.values(selectedItemsByCategory).flat();

        if (selectedItems.length > 0 || customItems.length > 0) {
            const newMenu = {
                items: [...selectedItems, ...customItems], // Include both selected and custom items
                perPlateCost,
                minOrder,
                title,
            };
            setMenuList([...menuList, newMenu]);
            setSelectedItemsByCategory({}); // Reset selected items for the next combo
            setCustomItems([]); // Reset custom items for the next combo
            setPerPlatePrice(''); // Reset price
            setMinOrderMembers(''); // Reset members
            setcomboTitle('');
            onSaveClick([newMenu]);
        }
    };

    const handleCategorySelection = (categoryName, items) => {
        setSelectedItemsByCategory({
            ...selectedItemsByCategory,
            [categoryName]: items,
        });
    };

    const handleAddCustomItem = () => {
        if (customItemVal.trim()) {
            setCustomItems([...customItems, customItemVal.trim()]); // Add new custom item
            setCustomItemVal(''); // Clear the input field
            setShowCustomTextInput(false); // Hide custom input field
        }
    };

    const handleRemoveItem = (item) => {
        // Remove from selected items per category
        const updatedSelection = { ...selectedItemsByCategory };
        Object.keys(updatedSelection).forEach((category) => {
            updatedSelection[category] = updatedSelection[category].filter((i) => i !== item);
        });
        setSelectedItemsByCategory(updatedSelection);

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

            {foodCategories.map((category) => (
                <View key={category.category} style={styles.categoryContainer}>
                    <Text style={styles.subHeading}>Select {category.category}</Text>

                    <MultiSelect
                        style={styles.dropdown}
                        data={category.items}
                        labelField="name"
                        valueField="name"
                        placeholder={`Select ${category.category}`}
                        value={selectedItemsByCategory[category.category] || []}
                        onChange={(items) => handleCategorySelection(category.category, items)}
                        selectedTextStyle={styles.selectedText}
                        placeholderStyle={styles.placeholderStyle}
                        search
                        searchPlaceholder={`Search ${category.category.toLowerCase()}...`}
                    />
                </View>
            ))}

            <View style={styles.selectedItemsContainer}>
                {customItems.map((item, index) => (
                    <View key={index} style={styles.selectedItem}>
                        <Text style={styles.selectedText}>{item}</Text>
                        <TouchableOpacity onPress={() => handleRemoveItem(item)}>
                            <Text style={styles.crossIcon}>✗</Text>
                        </TouchableOpacity>
                    </View>
                ))}
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
                            style={[styles.input, { width: '80%' }]}
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
                style={styles.saveButton}
                onPress={handleSaveMenu}
                disabled={
                    Object.values(selectedItemsByCategory).flat().length === 0 && customItems.length === 0
                }
            >
                <Text style={styles.saveButtonText}>Save Combo</Text>
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
    itemContainer: {
        padding: 10,
        backgroundColor: '#fff', // Default background for items
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    selectedItemContainer: {
        backgroundColor: '#FD813B', // Custom background for selected items
    },
    itemText: {
        color: 'black',
    },
    selectedItemText: {
        color: 'white', // Change text color for selected items
    },
    selectedText: {
        color: 'black', // Default selected text color in the main component
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
