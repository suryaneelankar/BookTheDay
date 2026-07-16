import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Dimensions } from 'react-native';
import { MultiSelect, Dropdown } from 'react-native-element-dropdown';
import themevariable from '../utils/themevariable';
import CheckIconGreen from '../assets/vendorIcons/checkIconGreen.svg';
import CrossIconRed from '../assets/vendorIcons/crossIconRed.svg';
import { getVendorAuthToken } from '../utils/StoreAuthToken';
import axios from 'axios';
import BASE_URL from '../apiconfig';
import VegIcon from '../assets/svgs/foodtype/veg.svg';
import NonVegIcon from '../assets/svgs/foodtype/NonVeg.svg';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import BookDatesButton from './GradientButton';
import LinearGradient from "react-native-linear-gradient";

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
    const [selectedFoodTypes, setSelectedFoodTypes] = useState(["veg", "non-veg"]);
    const [comboNames, setComboNames] = useState();

    const foodTypes = [
        { name: 'veg', icon: VegIcon },
        { name: 'non-veg', icon: NonVegIcon },
    ]

    const RentalFoodTypeList = () => {

        const onSelectFoodType = (name) => {
            setSelectedFoodTypes(prevSelected => {
                if (prevSelected.includes(name)) {
                    return prevSelected.filter(item => item !== name);
                } else {
                    return [...prevSelected, name];
                }
            });
        };

        return (
            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                {foodTypes.map((item, index) => {
                    const IconImage = item?.icon;
                    const isSelected = selectedFoodTypes.includes(item.name); // Check if the item is selected

                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.item}
                            onPress={() => { onSelectFoodType(item?.name) }}
                        >
                            <View style={{ borderColor: 'green', borderWidth: 2, width: 20, height: 20, borderRadius: 5 }}>
                                {isSelected ? (
                                    <FontAwesome5 style={{ marginHorizontal: 1 }} name={'check'} size={14} color={'green'} />
                                ) : null}
                            </View>
                            <View style={{ flexDirection: 'row', marginHorizontal: 5, alignItems: "center" }}>
                                <IconImage style={{ marginHorizontal: 2 }} />
                                <Text style={styles.itemText}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

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
                const filteredByComboName = foodItemsRes.filter(item => item.category === 'combonames');
                const remainingData = foodItemsRes.filter(item => item.category !== 'combonames');

                const comboItems = filteredByComboName[0].items.map(item => ({
                    label: item.name,
                    value: item.name,
                }));
                setComboNames(comboItems);

                setFoodCategories(remainingData); // Store categories and items
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

    const filteredCategories = foodCategories.filter(category => {
        const categoryName = category.category.toLowerCase();

        // Check for veg and non-veg categories
        const isVegCategory = categoryName.includes('veg') && !categoryName.includes('non-veg');
        const isNonVegCategory = categoryName.includes('non-veg');

        // If no food type is selected, show only categories not including 'veg' or 'non-veg'
        if (selectedFoodTypes.length === 0) {
            return !isVegCategory && !isNonVegCategory; // Show categories that are neither veg nor non-veg
        }

        // If both 'veg' and 'non-veg' are selected, return all categories
        if (selectedFoodTypes.includes('veg') && selectedFoodTypes.includes('non-veg')) {
            return true; // Show all categories
        }

        // If 'veg' is selected, show veg categories and other categories not including 'non-veg'
        if (selectedFoodTypes.includes('veg')) {
            return isVegCategory || (!isNonVegCategory); // Show veg categories and others
        }

        // If 'non-veg' is selected, show non-veg categories and other categories not including 'veg'
        if (selectedFoodTypes.includes('non-veg')) {
            return isNonVegCategory || (!isVegCategory); // Show non-veg categories and others
        }

        return false;
    });

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

    const cleanCategoryName = (categoryName) => {
        // Check if categoryName is a valid string
        if (typeof categoryName !== 'string') {
            console.log('Invalid category name:', categoryName); // Log a warning if it's not a string
            return ''; // Return an empty string for invalid input
        }

        // Use regular expressions to remove 'veg' or 'non-veg' and surrounding spaces
        return categoryName
            .replace(/\s*non-veg\s*/i, '') // Remove 'non-veg' and surrounding spaces
            .replace(/\s*veg\s*/i, '')      // Remove 'veg' and surrounding spaces
            .replace(/\bnon-/i, '')         // Remove 'non-' prefix if present
            .trim();                        // Trim any leading or trailing whitespace
    };



    return (
        <View style={styles.container}>
            {/* <Text style={styles.title}>Select Food Items</Text> */}
            <Text style={styles.comboTitle}>Select veg/non-veg to add the combos.</Text>
            {RentalFoodTypeList()}

            <Text style={[styles.label, { marginTop: 15 }]}>
                Combo Name <Text style={styles.asterisk}>*</Text>
            </Text>

            {/* <TextInput
                style={styles.dropdown}
                placeholder="Enter Combo Name"
                value={title}
                onChangeText={setcomboTitle}
                placeholderTextColor={'#333333'}
                placeholderStyle={styles.placeholderStyle}
                keyboardType="default"
            /> */}

            <Dropdown
                style={styles.dropdown}
                data={comboNames || []}
                labelField="label"
                valueField="value"
                placeholder={`Select Combo Name`}
                value={title}
                onChange={(item) => {
                    setcomboTitle(item.value);
                }}
                selectedTextStyle={styles.selectedTextStyle}
                placeholderStyle={styles.placeholderStyle}
                containerStyle={styles.dropdownContainer}
                placeholderTextColor={"#7E8389"}
           />

            {filteredCategories.map((category) => (
                <View key={category.category} style={styles.categoryContainer}>
                    <Text style={styles.subHeading}>{cleanCategoryName(category?.category)}</Text>

                    <MultiSelect
                        style={styles.dropdown}
                        data={category.items}
                        labelField="name"
                        valueField="name"
                        // confirmSelectItem
                        // confirmUnSelectItem
                        // onConfirmSelectItem={(item) => {
                        //   Alert.alert('Confirm', 'Message confirm', [
                        //     {
                        //       text: 'Cancel',
                        //       onPress: () => {},
                        //     },
                        //     {
                        //       text: 'Confirm',
                        //       onPress: () => {
                        //         // setSelected(item);
                        //         handleCategorySelection(category.category, item)
                        //       },
                        //     },
                        //   ]);
                        // }}
                        selectedStyle={{ backgroundColor: '#FFF3CD', borderRadius: 10, borderColor: "#666666", borderWidth: 1 }}
                        placeholder={`Select ${category.category}`}
                        value={selectedItemsByCategory[category.category] || []}
                        onChange={(items) => handleCategorySelection(category.category, items)}
                        selectedTextStyle={styles.selectedText}
                        placeholderStyle={styles.placeholderStyle}
                        search
                        searchPlaceholder={`Search ${category.category.toLowerCase()}...`}
                        searchPlaceholderTextColor='#333333'
                        itemTextStyle={{ color: "#333333", backgroundColor: "#fff9e7" }}
                        containerStyle={{ borderColor: "lightgray", borderWidth: 1, borderRadius: 10, }}
                        // itemContainerStyle={{backgroundColor:"#fff9e7"}}
                        renderItem={(item) => {
                            const isSelected = selectedItemsByCategory[category.category]?.includes(item.name);
                            return (
                                <View
                                    style={[
                                        styles.itemContainerDropdown,
                                        isSelected && styles.selectedItemContainerDropDown,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.itemTextdropDown,
                                            isSelected && styles.selectedItemTextdropDown,
                                        ]}
                                    >
                                        {item?.name}
                                    </Text>
                                </View>
                            );
                        }}
                    />
                </View>
            ))}

            <View style={styles.selectedItemsContainer}>
                {customItems.map((item, index) => (
                    <View key={index} style={styles.selectedItem} >
                        <Text style={styles.selectedText}>{item}</Text>
                        <TouchableOpacity onPress={() => handleRemoveItem(item)} style={{marginHorizontal: 8}}>
                            {/* <Text style={styles.crossIcon}>✗</Text> */}
                            <CrossIconRed width={15} height={15}/>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            <Text style={styles.label}>
                Per Plate Cost <Text style={styles.asterisk}>*</Text>
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Enter per plate Combo price"
                value={perPlateCost}
                onChangeText={setPerPlatePrice}
                keyboardType="numeric"
                placeholderTextColor={"#7E8389"}

            />

            <Text style={[styles.label, { marginTop: 10 }]}>
                Minimum Orders <Text style={styles.asterisk}>*</Text>
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Enter min Order members"
                value={minOrder}
                onChangeText={setMinOrderMembers}
                keyboardType="numeric"
                placeholderTextColor={"#7E8389"}

            />

            {showCustomTextInput && (
                <View style={styles.inputContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            style={[styles.input, { width: '80%' }]}
                            value={customItemVal}
                            onChangeText={(text) => setCustomItemVal(text)}
                            placeholder="Add Custom Item"
                            placeholderTextColor={"#7E8389"}
                        />
                        <TouchableOpacity style={styles.iconButton} onPress={handleAddCustomItem}>
                            <CheckIconGreen />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton} onPress={() => { setCustomItemVal(''), setShowCustomTextInput(!showCustomTextInput) }}>
                            <CrossIconRed />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* <TouchableOpacity
                style={styles.customButton}
                onPress={() => setShowCustomTextInput(!showCustomTextInput)}
            >
                <Text style={styles.customButtonText}>Add Your Customized Food Item</Text>
            </TouchableOpacity> */}

            <TouchableOpacity style={{ marginTop: 20 }} onPress={() => setShowCustomTextInput(!showCustomTextInput)}>
                <LinearGradient
                    colors={['#ECA73C', '#ECA73C']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.buttonView, {
                        width: Dimensions.get('window').width - 50, borderRadius: 10,
                        alignItems: "center", padding: 12, alignSelf: 'center'
                    }]}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={styles.buttonText}>Add Your Customized Food Item</Text>
                    </View>
                </LinearGradient>
            </TouchableOpacity>

            {/* <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveMenu}
                disabled={
                    Object.values(selectedItemsByCategory).flat().length === 0 && customItems.length === 0
                }
            >
                <Text style={styles.customButtonText}>Save Combo</Text>
            </TouchableOpacity> */}
            <BookDatesButton
                onPress={handleSaveMenu}
                text={'Save Combo'}
                padding={10}
                showIcon={false}
                // disabled={
                //     Object.values(selectedItemsByCategory).flat().length === 0 && customItems.length === 0
                // }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        borderRadius: 10,
        // bottom:5
    },
    title: {
        fontFamily: 'ManropeRegular',
        fontWeight: 'bold',
        color: themevariable.Color_000000,
        fontSize: 15,
        marginTop: 5
    },
    comboTitle: {
        fontFamily: 'ManropeRegular',
        fontWeight: '400',
        color: themevariable.Color_000000,
        fontSize: 15,
    },
    subHeading: {
        fontFamily: 'ManropeRegular',
        fontWeight: '700',
        color: themevariable.Color_000000,
        fontSize: 15,
        marginTop: 10
    },
    buttonText: {
        color: "#333333",
        fontSize: 14,
        fontWeight: "600",
        fontFamily: "ManropeRegular",
        textAlign: "center"
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 5
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
        color: 'white',
        backgroundColor: "pink"
    },
    dropdown: {
        height: 50,
        borderColor: "#FD813B",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginTop: 10
    },
    selectedItemsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
        marginTop: 10
    },
    selectedItem: {
        borderColor: '#666666',
        borderWidth: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderRadius: 10,
        marginHorizontal: 5
    },
    placeholderStyle: {
        fontFamily: 'ManropeRegular',
        fontWeight: '500',
        color: "#333333",
        fontSize: 14,
    },
    selectedText: {
        fontFamily: 'ManropeRegular',
        fontWeight: '500',
        color: "#333333",
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
        borderColor: '#ECA73C',
        paddingHorizontal: 12,
        borderRadius: 4,
        color: themevariable.Color_000000,
    },
    iconButton: {
        marginHorizontal: 5,
        marginTop: 10
    },
    saveButton: {
        backgroundColor: "green",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginTop: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'ManropeRegular',
        marginTop: 5
    },
    asterisk: {
        color: 'red',
    },
    itemContainerDropdown: {
        padding: 15,
        backgroundColor: '#ffffff',
    },
    selectedItemContainerDropDown: {
        backgroundColor: '#FFF3CD', // Background for selected items
    },
    itemTextdropDown: {
        color: '#333333',
        fontSize: 15
    },
    selectedItemTextdropDown: {
        color: '#333333',
        fontSize: 15
    },
    selectedTextStyle: {
        color: '#333333',
        fontSize: 16,
    },
    dropdownContainer: {
        borderColor: 'lightgray',
        borderRadius: 10,
    },
});

export default FoodMenu;
