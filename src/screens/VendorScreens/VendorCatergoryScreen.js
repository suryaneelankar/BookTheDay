import { View, Text, ScrollView, StyleSheet, FlatList, Touchable, TouchableOpacity } from 'react-native'
import themevariable from '../../utils/themevariable'
import DriverVendorImg from '../../assets/vendorIcons/DriverVendorImgs.svg';
import ChefVendorImg from '../../assets/vendorIcons/chefVendorImg.svg';
import FunctionHallVendorImg from '../../assets/vendorIcons/functionHallVendorImgs.svg';
import TentHouseVendorImg from '../../assets/vendorIcons/TentHouseVendorImgs.svg';
import ClothVendorImg from '../../assets/vendorIcons/clothVendorImg.svg';
import DecorVendorImg from '../../assets/vendorIcons/decorVendorImg.svg';
import CateringVendorImg from '../../assets/vendorIcons/cateringVendorImg.svg';

const VendorCategoryScreen = ({ navigation }) => {

    {/* HireChefOrDriverForm */ }
    {/* RentOnProducts */ }
    {/* AddTentHouse */ }
    {/* AddFunctionalHall */ }
    {/* AddFoodCatering */ }
    {/* AddDecorations */ }

    const categoriesData = [
        {
            id: 1,
            CatImg: FunctionHallVendorImg,
            navScreen: 'AddFunctionalHall'
        },
        {
            id: 1,
            CatImg: TentHouseVendorImg,
            navScreen: 'AddTentHouse'
        },
        {
            id: 1,
            CatImg: CateringVendorImg,
            navScreen: 'AddFoodCatering'
        },
        {
            id: 1,
            CatImg: DecorVendorImg,
            navScreen: 'AddDecorations'
        },
        {
            id: 1,
            CatImg: ClothVendorImg,
            navScreen: 'RentOnProducts'
        },
        {
            id: 1,
            CatImg: DriverVendorImg,
            navScreen: 'HireChefOrDriverForm'
        },
        {
            id: 1,
            CatImg: ChefVendorImg,
            navScreen: 'HireChefOrDriverForm'
        }
    ]

    const renderItem = ({ item }) => {
        // console.log('item dats is ::>>', item);
        return (
            <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => { navigation.navigate(item.navScreen) }}>
                <item.CatImg />
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.root}>
            <Text style={styles.mainHeading}>Select Your Service</Text>
            <FlatList
                data={categoriesData}
                renderItem={renderItem}
            />

        </View>
    )
}

export default VendorCategoryScreen

const styles = StyleSheet.create({
    root: {
        backgroundColor: themevariable.Color_E1E1E2,
        alignSelf: 'center',
        // alignItems:'center',
        flex: 1,
    },
    mainHeading: {
        // marginTop:20,
        fontWeight: 'bold',
        fontSize: 20,
        color: themevariable.Color_000000,
        alignSelf: 'center',
        padding: 20
    },
    // subContainer: {
    //     marginHorizontal: 10,
    // },
    // mainHeading: {
    //     marginTop: 20,
    //     fontWeight: 'bold',
    //     fontSize: 20,
    //     color: themevariable.Color_000000
    // },
})