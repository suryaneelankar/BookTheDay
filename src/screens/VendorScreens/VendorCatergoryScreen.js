import { View, Text, ScrollView, StyleSheet, FlatList, Touchable, TouchableOpacity, SafeAreaView } from 'react-native'
import themevariable from '../../utils/themevariable'
import DriverVendorImg from '../../assets/vendorIcons/DriverVendorImgs.svg';
import ChefVendorImg from '../../assets/vendorIcons/chefVendorImg.svg';
import FunctionHallVendorImg from '../../assets/vendorIcons/functionHallVendorImgs.svg';
import TentHouseVendorImg from '../../assets/vendorIcons/TentHouseVendorImgs.svg';
import ClothVendorImg from '../../assets/vendorIcons/clothVendorImg.svg';
import DecorVendorImg from '../../assets/vendorIcons/decorVendorImg.svg';
import CateringVendorImg from '../../assets/vendorIcons/cateringVendorImg.svg';
import { getVendorAuthToken } from '../../utils/StoreAuthToken';
import LinearGradient from 'react-native-linear-gradient';
import { useEffect, useState } from 'react';
import BASE_URL from '../../apiconfig';
import axios from 'axios';
import { useSelector } from 'react-redux';

const VendorCategoryScreen = ({ navigation }) => {
    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);
    const [profileData, setProfileData] = useState();



    const vendorToken = async () => {
        const token = await getVendorAuthToken();
        if (token) {
          // Use the token, e.g., include it in API requests
          console.log('Using vendor token:', token);
        } else {
          console.log('No vendor token found');
        }
      };

      useEffect(()=>{
        getProfileData();
      },[]);
  
      const getProfileData = async() => {
          const token = await getVendorAuthToken();
          try {
            console.log("vendou num:", vendorLoggedInMobileNum)
              const response = await axios.get(`${BASE_URL}/vendor/getVendorProfile/${vendorLoggedInMobileNum}`,{
                  headers: {
                      Authorization: `Bearer ${token}`,
                    },
              });
              setProfileData(response?.data?.data);
          console.log("profile vendor res:::", response?.data?.data?.posts?.length);
             
          } catch (error) {
              console.log("profile::::::::::", error);
          }
      }
      
    // vendorToken();

    const categoriesData = [
        {
            id: 1,
            CatImg: FunctionHallVendorImg,
            navScreen: 'AddFunctionalHall',
            catType:'functionalHalls'
        },
        {
            id: 1,
            CatImg: ClothVendorImg,
            navScreen: 'RentOnProducts',
            catType: 'clothesJewels'
        },
        
        {
            id: 1,
            CatImg: CateringVendorImg,
            navScreen: 'AddFoodCatering',
            catType : 'caterings'
        },
        // {
        //     id: 1,
        //     CatImg: TentHouseVendorImg,
        //     navScreen: 'AddTentHouse'
        // },
      
        // {
        //     id: 1,
        //     CatImg: DecorVendorImg,
        //     navScreen: 'AddDecorations'
        // },
        // {
        //     id: 1,
        //     CatImg: DriverVendorImg,
        //     navScreen: 'HireChefOrDriverForm'
        // },
        // {
        //     id: 1,
        //     CatImg: ChefVendorImg,
        //     navScreen: 'HireChefOrDriverForm'
        // }
    ]

    const renderItem = ({ item }) => {
        // console.log('item dats is ::>>', item);
        return (
            <TouchableOpacity style={{ marginVertical:30,alignSelf: 'center' }} 
            onPress={() => { 
                 if(item?.catType == 'caterings'){
                   if (profileData?.posts?.length > 0){
                      navigation.navigate('EditAddFoodCateringGeneral')
                    // navigation.navigate(item?.navScreen)
                   }else{
                    navigation.navigate(item?.navScreen)
                   }
                 }else{
                navigation.navigate(item?.navScreen)
                 }
              }}>
                <item.CatImg />
            </TouchableOpacity>
        )
    };

    return (
        <SafeAreaView style={{flex:1}}>
           <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#FFF7E7', '#FFF7E7', '#FFFFFF']} style={{ flex: 1 }}>
            <FlatList
                data={categoriesData}
                renderItem={renderItem}
            />

        </LinearGradient>
        </SafeAreaView>
       
    )
}

export default VendorCategoryScreen

const styles = StyleSheet.create({
    root: {
        backgroundColor: "#EBEDF3", 
        alignSelf: 'center',
        // alignItems:'center',
        flex: 1,
        marginBottom:"15%",
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