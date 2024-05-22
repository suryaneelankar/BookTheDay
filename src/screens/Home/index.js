import React, {useEffect, useState} from "react";
import { View, Text, Dimensions,FlatList, ImageBackground,PermissionsAndroid, Pressable,StyleSheet, Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity ,Platform, Alert} from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import Wedding from '../../assets/wedding.png';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native';
import BASE_URL from "../../apiconfig";
import axios from "axios";
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import GetLocation from 'react-native-get-location'
import { height, moderateScale } from "../../utils/scalingMetrics";
import Icon from 'react-native-vector-icons/FontAwesome';
import LocationMarkIcon from '../../assets/svgs/location.svg';
import SearchIcon from '../../assets/svgs/searchIcon.svg';
import HomeSwipper from '../../assets/svgs/homeswippers.svg';
import ArrowDown from '../../assets/svgs/arrowDown.svg';
import TentHouseIcon from '../../assets/svgs/categories/tentHouse.svg';
import FuntionalHall from '../../assets/svgs/categories/funtionHalls.svg';
import DecorationsIcon from '../../assets/svgs/categories/decorations.svg';
import CateringIcon from '../../assets/svgs/categories/catering.svg';
import DriversIcon from '../../assets/svgs/categories/drivers.svg';
import ChefIcon from '../../assets/svgs/categories/chefs.svg';
import JewelleryIcon from '../../assets/svgs/categories/jewellery.svg';
import ClothesIcon from '../../assets/svgs/categories/clothes.svg';
import SwipperOne from '../../assets/svgs/homeSwippers/swipperOne.svg';
import MoneyWavy from '../../assets/svgs/MoneyWavy.svg';
import Cloth from '../../assets/svgs/cloth.svg';
import Cheers from '../../assets/svgs/Cheers.svg';
import { LinearGradient } from 'react-native-linear-gradient';
import FilterIcon from '../../assets/svgs/filter.svg';
import Svg, { Circle } from 'react-native-svg';
import InfoBox from "../../components/InfoBox";

const HomeDashboard = () => {
    const [categories,setCategories] = useState([])
    const [address, setAddress] = useState('');
    const images = [SwipperOne,SwipperOne,SwipperOne]; //svg images for swipper  

 const newData =[{name:'Clothes',image:require('../../assets/clothesIcon.png')},
 {name:'Jewellery',image:require('../../assets/clothesIcon.png')},
 {name:'Chefs',image:require('../../assets/clothesIcon.png')},
 {name:'Driver',image:require('../../assets/clothesIcon.png')},
 {name:'Tent House',image:require('../../assets/clothesIcon.png')},
 {name:'Halls',image:require('../../assets/clothesIcon.png')},
 {name:'Decoration',image:require('../../assets/clothesIcon.png')},
 {name:'Catering',image:require('../../assets/clothesIcon.png')},
 ]

 useEffect(()=>{
    getPermissions();
    getCategories();
},[]);

    const getLocation = async() =>{
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
        })
        .then(location => {
            console.log("getting location",location);
            if (location) {
                fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`
                )
                  .then(response => response.json())
                  .then(data => {
                    console.log("address is::::::", data)
                    setAddress(data?.address);
                  })
                  .catch(error => {
                    console.error(error);
                  });
              }
        })
        .catch(error => {
            const { code, message } = error;
            console.warn(code, message);
        })

    }
    
    const getPermissions = async() =>{
      try{
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title:'APP location permission',
                message:'App needs location Permissions',
                buttonNeutral:'Ask Me Later',
                buttonNegative:'Cancel',
                buttonPositive:'OK'
            },
        );
        if(granted === PermissionsAndroid.RESULTS.GRANTED){
            getLocation()
        }else{
            Alert.alert("Location persmiion denied")
        }
      }catch (err){
        console.warn(err)
      }
    }

  

    const getCategories = async() =>{
        console.log("IAM CALLING API in home")
        try {
            const response = await axios.get(`${BASE_URL}/all-category`);  
            console.log("categories::::::::::", response?.data?.data);
            setCategories(response?.data?.data)
          } catch (error) {
            console.log("categories::::::::::", error);

    }
}

    const { width } = Dimensions.get('window');
    const navigation = useNavigation();  

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView style={{ marginBottom: 70 }} >
            <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 1}} colors={['#FFF7E7', '#FDFAF5', '#FFFFFF']} style={{flex:1}}>
            <View style={styles.topContainer}>
                    <View style={styles.locationContainer}>
                        <Text style={styles.currentLoc}>Your current location</Text>
                            <TouchableOpacity onPress={getLocation} style={styles.getLoc}>
                            <LocationMarkIcon/>
                            <Text style={styles.retrievedLoc}>{address?.neighbourhood}, {address?.city}</Text>
                            <ArrowDown/>
                            </TouchableOpacity>
                    </View>
                    <Pressable onPress={()=>navigation.navigate('ProfileScreen')}>
                    <FontAwesome name={"user-circle"} color={"#000000"} size={35} />
                    </Pressable>
                    
                </View>
                <View style={styles.searchContainer}>
                    <View style={styles.searchProduct}>
                        <View style={styles.searchProHeader}>
                        <SearchIcon style={{marginLeft:10}}/>
                        <TextInput
                            placeholder="Search by products,"
                            style={styles.textInput} />
                        </View>   
                    </View>
                    <View style={styles.filterView}>
                        <FilterIcon />
                    </View>
                </View>
                <View style={{width:"100%"}}>
                    <SwiperFlatList
                        autoplay
                        autoplayDelay={2}
                        autoplayLoop
                        index={2}
                        showPagination
                        paginationDefaultColor='#DDD4F3'
                        paginationActiveColor='#ECA73C'
                        paginationStyle={{ bottom: -20,}}
                        paginationStyleItem={{ backgroundColor:"red" }}
                        paginationStyleItemInactive={{ width: 8, height: 8}}
                        paginationStyleItemActive={{ height: 8,width:20 }}
                        data={images}
                        style={{}}
                        renderItem={({ item: Item }) => (
                            <View style={{width,flex:1,alignItems:"center"}}>
                            <Item  />  
                         </View>
                          
                        )}
                    />
                </View>

                <View style={styles.infoBoxContainer}>
                    
                    <InfoBox
                     IconComponent={MoneyWavy} 
                     mainText="100%" 
                     subText="Cost Efficient" 
                   />
                   <View style={styles.verticalLine}/>
                   <InfoBox
                     IconComponent={Cloth} 
                     mainText="1500+" 
                     subText="Products" 
                   />
                   <View style={styles.verticalLine}/>
                   <InfoBox
                     IconComponent={Cheers} 
                     mainText="1500+" 
                     subText="Events" 
                   />

                </View>

                <View style={{marginTop:10, marginHorizontal:20}}>
                    <Text style={{fontFamily:"ManropeRegular", fontWeight:"700", fontSize:16, color:'#202020'}}>Categories</Text>
                    <FlatList
                       data={newData}
                       renderItem={({item})=>{
                        return(
                          <View style={{padding:5,alignItems:"center",marginRight:20}} >
                                     <Image source={item.image}style={{height:60, width:60,borderRadius:30,elevation:2}} />
                               <Text style={{marginTop:5,fontSize:13, fontWeight:"500", color:'#202020',fontFamily:"ManropeRegular", }}>{item?.name}</Text>
                          </View>
                         )
                        }}
                      showsHorizontalScrollIndicator={false}
                      numColumns={4}
                    />
                </View>
             </LinearGradient>
        

                <View style={{marginTop:20}}>
                    <View style={{ flexDirection: "row" , alignSelf:"center",justifyContent:"space-between",width:"90%"}}>
                        <Text style={{color:"black", fontSize:14, fontWeight:"400"}}>Trending Now</Text>
                        {/* <Text style={{color:"black", fontSize:12, fontWeight:"400"}}>View All {'>'}</Text> */}
                    </View>
                    <ScrollView horizontal style={{marginHorizontal:10,marginTop:15}} showsHorizontalScrollIndicator={false}>
                        {categories.filter(item => item.type === 'Trending Now').map((item, index) => (
                            <TouchableOpacity
                            onPress={() => navigation.navigate('ViewTrendingDetails',{categoryId: item?._id})}
                             key={index} style={{width:moderateScale(140),marginLeft:10}}>
                                <Image source={{ uri: item.catImageUrl }} style={{
                                    width: "100%",
                                    height: 90,
                                    backgroundColor:"yellow",
                                    resizeMode:"cover",
                                }} />
                                <Text style={styles.title}>{item?.name}</Text>
                                {/* <Text style={[styles.status,{color:item?.rented ?  "#a85705" : "white", backgroundColor:item?.rented ? "#fabdb6" :"green"}]}>{item?.rented ? 'Out of Stock' : 'Available'}</Text> */}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                </View>

                <View style={{marginTop:20}}>
                    <View style={{ flexDirection: "row" , alignSelf:"center",justifyContent:"space-between",width:"90%"}}>
                        <Text style={{color:"black", fontSize:14, fontWeight:"400"}}>Brand New</Text>
                        {/* <Text style={{color:"black", fontSize:12, fontWeight:"400"}}>View All {'>'}</Text> */}
                    </View>
                    <ScrollView horizontal style={{marginHorizontal:10,marginTop:15}} showsHorizontalScrollIndicator={false}>
                        {categories.filter(item => item.type === 'Brand New').map((item, index) => (
                            <TouchableOpacity
                            onPress={() => navigation.navigate('ViewTrendingDetails',{categoryId: item?._id})}
                             key={index}style={{width:moderateScale(110),marginLeft:10}} >
                                <Image source={{ uri: item.catImageUrl }} style={{
                                    width: "100%",
                                    height: 200,
                                    resizeMode:"cover"
                                }} />
                                <Text style={styles.title}>{item?.name}</Text>
                                {/* <Text style={[styles.status,{color:item?.rented ?  "#a85705" : "white" , backgroundColor:item?.rented ? "#fabdb6" :"green" }]}>{item?.rented ? 'Out of Stock' : 'Available'}</Text> */}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                </View>

                <View style={{marginTop:20,marginBottom:"10%"}}>
                    <View style={{ flexDirection: "row" , alignSelf:"center",justifyContent:"space-between",width:"90%"}}>
                        <Text style={{color:"black", fontSize:14, fontWeight:"400"}}>Subcription</Text>
                        {/* <Text style={{color:"black", fontSize:12, fontWeight:"400"}}>View All {'>'}</Text> */}
                    </View>
                        {categories.filter(item => item.type === 'Trending Now').map((item, index) => (
                            <TouchableOpacity
                            onPress={() => navigation.navigate('ViewTrendingDetails',{categoryId: item?._id})}
                             key={index}style={{marginHorizontal:15,backgroundColor:"lightgray",paddingHorizontal:5,paddingVertical:10,flexDirection:"row",marginTop:10}} >
                                <Image source={{ uri: item.catImageUrl }} style={{
                                    width: "20%",
                                    height: 60,
                                    resizeMode:"cover"
                                }} />
                                <View style={{marginLeft:10, width:"59%"}}>
                                <Text style={{color:"black", fontSize:14, fontWeight:"800"}}>Cooking subscription</Text>
                                <Text style={{color:"black", fontSize:12, fontWeight:"300",marginTop:5}}>Cooking subscription lorem ispusm is simply dummy text to the prinitng</Text>
                                </View>

                                <TouchableOpacity style={{elevation:10,width:40, height:40, borderRadius:20, backgroundColor:"white",alignSelf:"center",alignItems:"center",justifyContent:"center"}}>
                                <Icon name="chevron-right" size={10} color="black" />
                                </TouchableOpacity>
                                
                                {/* <Text style={[styles.status,{color:item?.rented ?  "#a85705" : "white" , backgroundColor:item?.rented ? "#fabdb6" :"green" }]}>{item?.rented ? 'Out of Stock' : 'Available'}</Text> */}
                            </TouchableOpacity>
                        ))}

                </View>        

            </ScrollView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center', backgroundColor: "yellow",
        height: 200, // Adjust the height as needed
    },
    swiperContainer: { 
        flex: 1, 
        alignSelf:'center',
        backgroundColor: 'white',
        width:"90%", 
    },
    topContainer:{
        // alignSelf:'center',
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:15,
        marginHorizontal:20
        // paddingVertical:10,
        // width:"90%",
    },
    locationContainer: {
        flexDirection:'column',
        // marginLeft: 10,
    },
    locationSubContainer: {
        flexDirection: 'row',
        alignItems:"center",
        marginHorizontal:20, 
    },
    locationIcon: {
        marginRight: 8,
    },
    locationName: {
        fontWeight: '900',
        fontSize: 12,
        color: "#000000",
    },
    fullLocation:{
        width:200,
        fontSize:15,
        fontWeight:"400",
    },
    profileContainer:{

    },
    text: { fontSize: 12, textAlign: 'center' },
    title: {
        fontSize: 12,
        fontWeight: "400",
        alignSelf:"center",
        textAlign:"center",
        // marginTop:5,
        paddingHorizontal:10,
        paddingVertical:10
    },
    status: {
        fontSize: 10,
        padding:4,
        borderRadius:5,
        marginTop:5
    },
    card: {
        borderWidth:1, borderColor:"lightgray", borderRadius:10,paddingBottom:10,
        paddingHorizontal:5,
        marginTop:10,
        alignItems: 'center',
        margin:5,
        // backgroundColor:"#f7f5f5"
    },
    listcard: {
        marginTop:10,
        width:"90%",
        borderRadius:20, 
        alignSelf:"center",
        alignItems:"center" 
    },
    image: {
        width: '50%',
        height: "100%",
        resizeMode: 'cover',
    },
    currentLoc:{
        fontFamily:'ManropeRegular',
        color:'#7D7F88;',
        fontSize:12,
        fontWeight:'400'
    },
    getLoc:{
        flexDirection:'row',
        alignItems:'center',
        marginTop:5
    },
    retrievedLoc:{
        fontFamily:'ManropeRegular',
        color:'#1A1E25',
        fontSize:16,
        fontWeight:'400',
        marginHorizontal:5
    },
    searchContainer:{
        marginHorizontal:20,
        flexDirection:"row",
        marginVertical:10,
        justifyContent:"space-between"
    },
    searchProduct:{
        height:45,
        backgroundColor:"#FFFFFF",
        width:"85%",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        borderColor: "#FFFFFF",
        borderWidth: 0.8
    },
    searchProHeader:{
        flexDirection:"row",
        alignSelf:"center",
        alignItems:"center"
    },
    textInput:{ 
        marginLeft: 10,
        alignSelf: "center"
    },
    filterView:{
        height:45,
        backgroundColor:"#FFFFFF",
        padding:10,
        justifyContent:"center",
        alignItems: "center",
        borderRadius: 10, 
        borderColor: "#FFFFFF", 
        borderWidth: 0.8 
    },
    infoBoxContainer:{
        marginHorizontal:20,
        flexDirection:"row",
        justifyContent:"space-evenly",
        backgroundColor:"#FFFFFF",
        padding:8,
        marginVertical:25,
        borderRadius:10
    },
    verticalLine:{
        backgroundColor:"#EFAE1A",
        height:"80%",
        width:1,
        alignSelf:"center"
    },




});

export default HomeDashboard;

