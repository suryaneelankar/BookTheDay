import { StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native'
import themevariable from '../../utils/themevariable'
import FunctionHallVendorImg from '../../assets/vendorIcons/functionHallVendorImgs.svg';
import ClothVendorImg from '../../assets/vendorIcons/clothVendorImg.svg';
import CateringVendorImg from '../../assets/vendorIcons/cateringVendorImg.svg';
import { getVendorAuthToken } from '../../utils/StoreAuthToken';
import LinearGradient from 'react-native-linear-gradient';
import { useEffect, useState } from 'react';
import BASE_URL from '../../apiconfig';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { getCurrentVendorLoggedInUserName } from '../../../redux/actions';
import { useDispatch } from 'react-redux';

const VendorCategoryScreen = ({ navigation }) => {
    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);
    const [profileData, setProfileData] = useState();
    const dispatch = useDispatch();

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
              dispatch(getCurrentVendorLoggedInUserName(response?.data?.data?.fullName));

          console.log("profile vendor res:::", response?.data?.data?.aadharImage?.url);
             
          } catch (error) {
              console.log("profile::::::::::", error);
          }
      }
      
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
    ]

    const renderItem = ({ item }) => {
        // console.log('item dats is ::>>', item);
        return (
            <TouchableOpacity style={{ marginVertical:30,alignSelf: 'center' }} 
            onPress={() => { 
                 if(item?.catType == 'caterings'){
                   if (profileData?.posts?.length > 0){
                      navigation.navigate('EditAddFoodCateringGeneral', {isAadharUpdate : profileData?.aadharImage?.url  ? true : false})
                    // navigation.navigate(item?.navScreen)
                   }else{
                    navigation.navigate(item?.navScreen,{isAadharUpdate : profileData?.aadharImage?.url  ? true : false})
                   }
                 }else{
                navigation.navigate(item?.navScreen, {isAadharUpdate : profileData?.aadharImage?.url  ? true : false})
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

export default VendorCategoryScreen;