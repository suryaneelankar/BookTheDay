import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, Alert, TextInput, ScrollView, alert, ActivityIndicator, Modal, Button } from 'react-native';
import themevariable from '../../../utils/themevariable';
import BASE_URL from '../../../apiconfig';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import VegIcon from '../../../assets/svgs/foodtype/veg.svg';
import NonVegIcon from '../../../assets/svgs/foodtype/NonVeg.svg';
import { useSelector } from 'react-redux';
import { getVendorAuthToken } from '../../../utils/StoreAuthToken';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FoodMenu from '../../../components/VendorAddOwnCombo';
import CustomModal from '../../../components/AlertModal';
import { useNavigation } from '@react-navigation/native';

const EditAddFoodCatering = () => {
    const [comboModalSuccess, setcomboModalSuccess] = useState(false);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [selectedFoodTypes, setSelectedFoodTypes] = useState([]);


    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);

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
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
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

    const [finalCombomenu, setFinalComboMenu] = useState([]);

    const onPressSaveAndPost = async () => {
        if (finalCombomenu?.length === 0
        ) {
            Alert.alert('Please fill Mandatory fields');
            return;
        }

        finalCombomenu.forEach((obj) => {
            if (obj?.minOrder === 0 && obj?.perPlateCost === 0) {
                Alert.alert('Please fill Mandatory fields', `Details missing for: ${obj.title}`);
                return;
            }
        });


        const vendorMobileNumber = vendorLoggedInMobileNum;
        let payload = {
            newFoodItems: finalCombomenu,
            vendorMobileNumber: vendorMobileNumber

        };
        const token = await getVendorAuthToken();
        console.log("payload is::::::", JSON.stringify(payload));
        setLoading(true);
        try {
            const response = await axios.patch(`${BASE_URL}/updateExistingFoodCateringItems/ByVendorMobileNumber`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setLoading(false);
                console.log('Success', `uploaded successfully`);
                Alert.alert(
                    "Confirmation",
                    "Your product posted successfully",
                    [
                        { text: "Ok", onPress: () => navigation.goBack() }
                    ],
                    { cancelable: false }
                );
            } else {
                setLoading(false);
                console.log('Error', 'Failed to upload document');
            }
        } catch (error) {
            console.error('Error uploading document:', error);
            setLoading(false);
            console.log('Error', 'Failed to upload document');
        }
    }

    const renderMenuItem = ({ item }) => (
        <View style={{ marginHorizontal: 5, backgroundColor: "white", borderWidth: 1, borderColor: "lightgray", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 10 }}>
            <Text style={{ color: "black", fontSize: 14, fontWeight: "700", fontFamily: 'ManropeRegular' }}>{item.title}</Text>
            <Text style={{ marginTop: 5, color: "black", fontSize: 10, fontWeight: "200", fontFamily: 'ManropeRegular' }}>Combo Includes</Text>
            <Text style={{ marginTop: 2, color: "black", fontSize: 12, fontWeight: "400", fontFamily: 'ManropeRegular', width: "60%" }}>{item.items.join(', ')}</Text>
            <Text style={{ marginTop: 5, color: "#FE8235", fontSize: 12, fontWeight: "400", fontFamily: 'ManropeRegular' }}>Per Plate Price: {item.perPlateCost}</Text>
            <Text style={{ marginTop: 5, color: "#FE8235", fontSize: 12, fontWeight: "400", fontFamily: 'ManropeRegular' }}>Min Order: {item.minOrder}</Text>

        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            {loading ? (
                <View style={{ alignSelf: 'center', flex: 1, width: '100%', height: Dimensions.get('window').height, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="orange" />
                </View>
            ) :
                <View>
                    {/* <Text style={styles.labelText}>Food Type</Text> */}
                    {/* {RentalFoodTypeList()} */}

                    <Text style={styles.title}>Add Menu Items</Text>
                    <View style={styles.mainContainer}>
                        <FoodMenu onSaveClick={(menuItems) => {
                            setcomboModalSuccess(true);
                            setFinalComboMenu(prevMenu => [...prevMenu, ...menuItems]);

                        }} />
                    </View>

                    <CustomModal
                        visible={comboModalSuccess}
                        message={'Combo Successfully Added'}
                        onClose={() => setcomboModalSuccess(false)}
                    />

                    {finalCombomenu?.length > 0 ?
                        <View style={styles.mainContainer}>
                            <Text style={{ color: "black", fontSize: 14, fontWeight: "500", marginBottom: 5, marginHorizontal: 8 }}>Added Combos</Text>
                            <FlatList
                                data={finalCombomenu.filter(item => item.items?.length > 0)}
                                renderItem={renderMenuItem}
                                keyExtractor={(item, index) => index.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
                        </View> :
                        null}

                    <TouchableOpacity onPress={() => { onPressSaveAndPost() }} style={{ padding: 10, backgroundColor: '#FFF5E3', alignSelf: 'center', borderRadius: 5, borderColor: '#ECA73C', borderWidth: 2, marginTop: 40, bottom: 20 }}>
                        <Text style={{ color: '#ECA73C' }}> Save & Post </Text>
                    </TouchableOpacity>

                </View>
            }

        </View>
    )
}

export default EditAddFoodCatering

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: themevariable.Color_FFFFFF,
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 6,
        marginTop: 15,
        flex: 1
    },
    detailsContainer: {
        // backgroundColor: themevariable.Color_FFFFFF,
        backgroundColor: 'red',
        borderRadius: 10,

    },
    title: {
        fontFamily: 'ManropeRegular',
        fontWeight: 'bold',
        color: themevariable.Color_000000,
        fontSize: 18,
        marginTop: 10,
        marginHorizontal: 20
    },
    labelText: {
        fontFamily: 'ManropeRegular',
        fontWeight: 'bold',
        color: themevariable.Color_000000,
        fontSize: 15,
        padding: 10,
        marginHorizontal: 10
    },
    subTitle: {
        fontFamily: 'ManropeRegular',
        color: themevariable.Color_000000,
        fontSize: 13,
        marginTop: 7,
        marginBottom: 10,
    },
    image: {
        // marginLeft: 15,
        // marginRight: 7,
        // marginTop: 5,
        // backgroundColor:'red'
    },
    imageContainer: {
        alignSelf: 'center',

    },
    dropdown: {
        height: 50,
        width: 350,
        borderWidth: 1,
        marginTop: 10,
        borderColor: themevariable.Color_C8C8C6,
        paddingHorizontal: 12,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    container: {
        justifyContent: 'space-around',
        borderRadius: 5,
        flexDirection: 'row'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#FFD7B5',
        borderRadius: 5,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    amenitiesContainer: {
        flex: 1,
        padding: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        margin: 5,
        alignItems: 'center',
        backgroundColor: '#FFF5E3',
        padding: 10,
        borderRadius: 5
    },
    itemButton: {
        // padding: 10,
        borderRadius: 10,
    },
    itemText: {
        marginHorizontal: 5,
    },
    input: {
        borderWidth: 1,
        marginTop: 10,
        borderColor: themevariable.Color_C8C8C6,
        paddingHorizontal: 12,
        borderRadius: 5,
        flex: 1,
    },
    inputContainer: {
        // flexDirection: 'row',
        // alignItems: 'center',
        marginBottom: 10,
    },
    itemsContainer: {
        marginTop: 10,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    icon: {
        marginRight: 10,
    },
    itemText: {
        fontSize: 14,
        marginHorizontal: 10
    },
    textInputlabel: {
        fontFamily: 'ManropeRegular',
        fontWeight: 'bold',
        color: themevariable.Color_000000,
        fontSize: 15,
        marginTop: 15
    },
    textTnputView: {
        borderWidth: 1,
        marginTop: 10,
        borderColor: themevariable.Color_C8C8C6,
        // paddingHorizontal:12,
        borderRadius: 5,
    }
})