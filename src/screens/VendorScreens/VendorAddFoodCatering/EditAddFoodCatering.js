import { useState } from 'react';
import { Text, View, StyleSheet, FlatList, Dimensions, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import themevariable from '../../../utils/themevariable';
import BASE_URL from '../../../apiconfig';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { getVendorAuthToken } from '../../../utils/StoreAuthToken';
import FoodMenu from '../../../components/VendorAddOwnCombo';
import CustomModal from '../../../components/AlertModal';
import { useNavigation } from '@react-navigation/native';

const EditAddFoodCatering = () => {
    const [comboModalSuccess, setcomboModalSuccess] = useState(false);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);
    const [finalCombomenu, setFinalComboMenu] = useState([]);

    const onPressSaveAndPost = async () => {
        if (finalCombomenu?.length === 0) {
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
            vendorMobileNumber: vendorMobileNumber,
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
                    [{ text: "Ok", onPress: () => navigation.goBack() }],
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
    };

    const renderMenuItem = ({ item }) => (
        <View style={styles.menuItemContainer}>
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.menuSubtitle}>Combo Includes</Text>
            <Text style={styles.menuItems}>{item.items.join(', ')}</Text>
            <Text style={styles.menuPrice}>Per Plate Price: {item.perPlateCost}</Text>
            <Text style={styles.menuOrder}>Min Order: {item.minOrder}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="orange" />
                </View>
            ) : (
                <View>
                    <Text style={styles.title}>Add Menu Items</Text>
                    <View style={styles.mainContainer}>
                        <FoodMenu
                            onSaveClick={(menuItems) => {
                                setcomboModalSuccess(true);
                                setFinalComboMenu((prevMenu) => [...prevMenu, ...menuItems]);
                            }}
                        />
                    </View>

                    <CustomModal
                        visible={comboModalSuccess}
                        message={'Combo Successfully Added'}
                        onClose={() => setcomboModalSuccess(false)}
                    />

                    {finalCombomenu?.length > 0 && (
                        <View style={styles.mainContainer}>
                            <Text style={styles.addedCombosTitle}>Added Combos</Text>
                            <FlatList
                                data={finalCombomenu.filter((item) => item.items?.length > 0)}
                                renderItem={renderMenuItem}
                                keyExtractor={(item, index) => index.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    )}

                    <TouchableOpacity onPress={onPressSaveAndPost} style={styles.saveButton}>
                        <Text style={styles.saveButtonText}> Save & Post </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default EditAddFoodCatering;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        alignSelf: 'center',
        flex: 1,
        width: '100%',
        height: Dimensions.get('window').height,
        justifyContent: 'center',
    },
    mainContainer: {
        backgroundColor: themevariable.Color_FFFFFF,
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 6,
        marginTop: 15,
        flex: 1,
    },
    title: {
        fontFamily: 'ManropeRegular',
        fontWeight: 'bold',
        color: themevariable.Color_000000,
        fontSize: 18,
        marginTop: 10,
        marginHorizontal: 20,
    },
    addedCombosTitle: {
        color: "black",
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 5,
        marginHorizontal: 8,
    },
    menuItemContainer: {
        marginHorizontal: 5,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    menuTitle: {
        color: "black",
        fontSize: 14,
        fontWeight: "700",
        fontFamily: 'ManropeRegular',
    },
    menuSubtitle: {
        marginTop: 5,
        color: "black",
        fontSize: 10,
        fontWeight: "200",
        fontFamily: 'ManropeRegular',
    },
    menuItems: {
        marginTop: 2,
        color: "black",
        fontSize: 12,
        fontWeight: "400",
        fontFamily: 'ManropeRegular',
        width: "60%",
    },
    menuPrice: {
        marginTop: 5,
        color: "#FE8235",
        fontSize: 12,
        fontWeight: "400",
        fontFamily: 'ManropeRegular',
    },
    menuOrder: {
        marginTop: 5,
        color: "#FE8235",
        fontSize: 12,
        fontWeight: "400",
        fontFamily: 'ManropeRegular',
    },
    saveButton: {
        padding: 10,
        backgroundColor: '#FFF5E3',
        alignSelf: 'center',
        borderRadius: 5,
        borderColor: '#ECA73C',
        borderWidth: 2,
        marginTop: 40,
        marginBottom: 20,
    },
    saveButtonText: {
        color: '#ECA73C',
    },
});
