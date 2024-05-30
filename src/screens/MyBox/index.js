import React, {useState, useEffect} from "react";
import {View, Text, TouchableOpacity, Linking,StyleSheet, Platform, Alert, PermissionsAndroid, SafeAreaView, ScrollView, Dimensions, FlatList, Image} from 'react-native';
import ImagePicker, { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import BASE_URL from "../../apiconfig";
import axios from "axios";
import CustomSwitch from "../../components/CustomSwitch";
import FilterIcon from '../../assets/svgs/filterBlack.svg';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import Avatar from "../../components/NameAvatar";
import TruestedMarkGray from '../../assets/svgs/trustedMarkGray.svg';
import VegNonVegIcon from '../../assets/svgs/foodtype/vegNonveg.svg';
import VegIcon from '../../assets/svgs/foodtype/veg.svg';
import NonVegIcon from '../../assets/svgs/foodtype/NonVeg.svg';

import { formatAmount } from "../../utils/GlobalFunctions";
import HireIcon from '../../assets/svgs/hireIcon.svg';
import ClockIcon from '../../assets/svgs/clock.svg';
import RightArrow from '../../assets/svgs/rightarrowOrange.svg';
import TruestedMarkOrange from '../../assets/svgs/trustedOrange.svg';
import { useNavigation } from "@react-navigation/native";
import CarSteering from '../../assets/svgs/carSteering.svg';
import { SvgCss } from 'react-native-svg';
import HowItWorks from "../Products/HowItWorks";

const Hire = () =>{

    const [selectedImage, setSelectedImage] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const [selectToggle, setSelectToggle] = useState(false);
    const [chefListDetails, setChefListDetails] = useState([]);
    const [driverListDetails, setDriverListDetails] = useState([]);
    const navigation = useNavigation();
    const chefDetails =[{name:'Shruti Kedia', price: '600', cookingType:'North Indian', vareity:'Meals', experience:7,availability:'All Days',image:'https://t4.ftcdn.net/jpg/06/35/20/15/360_F_635201516_G2TFpFPoFA6utXYNgFlgPJGwU24mj6CJ.jpg'},
    {name:'Swetha Kedia', price: '700', cookingType:'South Indian', vareity:'Meals', experience:9,availability:'Weekends'},
    {name:'Mrs.Shruti', price: '400', cookingType:'North Indian', vareity:'Thali', experience:2,availability:'Weekends',image:'https://t4.ftcdn.net/jpg/06/35/20/15/360_F_635201516_G2TFpFPoFA6utXYNgFlgPJGwU24mj6CJ.jpg'},
    {name:'Surya', price: '800', cookingType:'South Indian', vareity:'Tiffins', experience:3,availability:'All Days',image:'https://t4.ftcdn.net/jpg/06/35/20/15/360_F_635201516_G2TFpFPoFA6utXYNgFlgPJGwU24mj6CJ.jpg'},
    {name:'Rrinivas Siva', price: '300', cookingType:'North Indian', vareity:'Meals', experience:9,availability:'All Days'},
    {name:'Mrs.Sujitha', price: '900', cookingType:'North Indian', vareity:'Meals', experience:10,availability:'All Days'},
    {name:'Mrs.Neha sharma', price: '800', cookingType:'North Indian', vareity:'Meals', experience:17,availability:'Weekends'},
    {name:'Mr.Neelankar', price: '700', cookingType:'South Indian', vareity:'Chinese', experience:6,availability:'Weekends'},
    {name:'Mrs.Shruti Kedia', price: '600', cookingType:'North Indian', vareity:'Snacks', experience:4,availability:'All Days'},
    {name:'Mrs.Shruti Kedia', price: '300', cookingType:'South Indian', vareity:'Meals', experience:8,availability:'Weekends'}
    ]

    const driverDetails =[{name:'Rahul', price: '60', carModal:'Hyundai',cookingType:'North Indian', vareity:'Meals', experience:7,availability:'All Days',image:'https://t4.ftcdn.net/jpg/06/35/20/15/360_F_635201516_G2TFpFPoFA6utXYNgFlgPJGwU24mj6CJ.jpg'},
    {name:'Kedia', price: '70', carModal:'Hyundai-Eeon',cookingType:'South Indian', vareity:'Meals', experience:9,availability:'Weekends'},
    {name:'Varadhi farms', price: '400',carModal:'Hyundai-creta', cookingType:'North Indian', vareity:'Thali', experience:2,availability:'Weekends',image:'https://t4.ftcdn.net/jpg/06/35/20/15/360_F_635201516_G2TFpFPoFA6utXYNgFlgPJGwU24mj6CJ.jpg'},
    {name:'Surya', price: '80',carModal:'Suzuki', cookingType:'South Indian', vareity:'Tiffins', experience:3,availability:'All Days',image:'https://t4.ftcdn.net/jpg/06/35/20/15/360_F_635201516_G2TFpFPoFA6utXYNgFlgPJGwU24mj6CJ.jpg'},
    {name:'Rrinivas Siva', price: '30',carModal:'Hyundai', cookingType:'North Indian', vareity:'Meals', experience:9,availability:'All Days'},
    {name:'Mrs.Sujitha', price: '90',carModal:'Hyundai', cookingType:'North Indian', vareity:'Meals', experience:10,availability:'All Days'},
    {name:'Mrs.Neha sharma', price: '80',carModal:'Hyundai', cookingType:'North Indian', vareity:'Meals', experience:17,availability:'Weekends'},
    {name:'Mr.Neelankar', price: '70', carModal:'Hyundai',cookingType:'South Indian', vareity:'Chinese', experience:6,availability:'Weekends'},
    {name:'Mrs.Shruti Kedia', price: '60',carModal:'Hyundai', cookingType:'North Indian', vareity:'Snacks', experience:4,availability:'All Days'},
    {name:'Mrs.Shruti Kedia', price: '30', carModal:'Hyundai',cookingType:'South Indian', vareity:'Meals', experience:8,availability:'Weekends'}
    ]

    useEffect(() => {
      getChefDriver();
        // requestGalleryPermission();
      }, []);
    
      const getChefDriver = async() =>{
        try {
          const response = await axios.get(`${BASE_URL}/getDriverChefs`);
          const filteredData = response?.data.filter(item => item?.serviceType === 'driver');
          const filteredChefData = response?.data.filter(item => item?.serviceType === 'chef');

          setDriverListDetails(filteredData);
          setChefListDetails(filteredChefData);
      } catch (error) {
          console.log("hire data error>>::", error);
      }
      }
      
      const requestGalleryPermission = async () => {
        if (Platform.OS === 'android') {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              {
                title: 'Gallery Permission',
                message: 'App needs access to your gallery to upload images.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                captureAndUpload()
              console.log('Gallery permission granted');
            } else {
              handlePermissionDenied()
              console.log('Gallery permission denied');
            }
          } catch (err) {
            console.warn(err);
          }
        } else {
          console.log('iOS does not require permission for gallery access');
        }
      };

      const handlePermissionDenied = () => {
        Alert.alert(
          'Permission Denied',
          'Please grant access to the gallery in order to proceed.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: openSettings },
          ],
        );
      };
      
      const openSettings = () => {
        Linking.openSettings();
      };

      const captureAndUpload =  () => {
       launchImageLibrary ({ mediaType: 'photo' }, (response)  => {
       console.log("image rseponse:::::", response)
       handleUpload(response)     
        });
      };


      const handleUpload = async (response) => {
        if (response) {
          const formData = new FormData();
          formData.append('file', {
            uri: response?.assets[0]?.uri,
            type: response?.assets[0]?.type,
            name: response?.assets[0]?.fileName,
          });
    
          try {
            const response = await axios.post('http://192.168.1.4:3000/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            if (response.status === 200) {
             console.log('Success', `uploaded successfully`);
              // Handle success response from server
            } else {
             console.log('Error', 'Failed to upload document');
            }
          } catch (error) {
            console.error('Error uploading document:', error);
           console.log('Error', 'Failed to upload document');
          }
        } else {
        //   alert(`Please Select ${documentType} File first`);
        }
      };

      const onSelectSwitch = index => {
        // Alert.alert('Selected index: ' + index);
        setSelectToggle(!selectToggle)
      };

      const chefsNear = ({item}) =>{
        return(
          <TouchableOpacity style={{borderRadius:5,backgroundColor:"white",paddingHorizontal:12,paddingBottom:10,marginLeft:10}}>
           <TruestedMarkOrange style={{
                        position: 'absolute',
                        top: 5,
                        // left: 0,
                        right: 5,
                        bottom: 0,
                    }}/>
          <View style={{alignSelf:"center",alignItems:"center",marginTop:12}}>
          <Avatar widthDyn={54} heightDyn={54} borderRadiusDyn={24} name={item?.name} imageUrl={item?.image} />
          <Text style={{marginTop:12,color:"#333333",fontSize:12, fontWeight:"600",fontFamily: "ManropeRegular",}}>{item?.name}</Text>
          {!selectToggle ?
           <Text style={{marginTop:3,color:"#A9A9A9",fontSize:10, fontWeight:"500",fontFamily: "ManropeRegular",}}>{formatAmount(item?.price)}<Text style={{color:"#A9A9A9",fontSize:10, fontWeight:"500",fontFamily: "ManropeRegular",}}>/hours</Text></Text>
           :
           <Text style={{marginTop:3,color:"#A9A9A9",fontSize:10, fontWeight:"500",fontFamily: "ManropeRegular",}}>{formatAmount(item?.price)}<Text style={{color:"#A9A9A9",fontSize:10, fontWeight:"500",fontFamily: "ManropeRegular",}}>/km</Text></Text>
          }
          </View>
         </TouchableOpacity>
        )
      }

      const renderHires = ({item}) =>{
        return(
          <TouchableOpacity onPress={() => navigation.navigate('ViewHireDetails',{Catid: item?._id})} style={{borderRadius:10,backgroundColor:"white",marginHorizontal:15,marginTop:10,paddingHorizontal:10,paddingVertical:10}}>
                   <View style={{flexDirection:"row"}}>
                   <Avatar  widthDyn={61} heightDyn={61} borderRadiusDyn={8} name={item?.name} imageUrl={item?.professionalImage?.url} />

                   <View style={{marginLeft:10,width:"50%"}}>
                    <Text style={{marginTop:5,color:"#101010",fontSize:14, fontWeight:"500",fontFamily: "ManropeRegular",}}>{item?.name}</Text>
                    {!selectToggle ? 
                    <Text style={{marginTop:0,color:"#A8A8A8",fontSize:12, fontWeight:"400",fontFamily: "ManropeRegular",}}>{item?.expertiseFood[0]} | {item?.vareity}</Text>
                    :
                    <Text style={{marginTop:0,color:"#A8A8A8",fontSize:12, fontWeight:"400",fontFamily: "ManropeRegular",}}>{item?.vehicleType}</Text>
                    }
                    <View style={{marginTop:5,flexDirection:"row",backgroundColor:"#F5F5F5",alignItems:"center",justifyContent:"center",paddingVertical:2,borderRadius:5,paddingHorizontal:5,width:57}}> 
                      <TruestedMarkGray style={{marginHorizontal:2}}/>
                      <Text style={{color:'#6B779A',fontSize:9, fontFamily: "ManropeRegular",fontWeight:"800"}}>Verified</Text>
                    </View>

                   </View>

                   <View style={{flexDirection:"row"}}>
                   {!selectToggle && (
                       item?.foodType === 'veg' ? (
                        <VegIcon />
                    ) : item?.foodType === 'nonveg' ? (
                       <NonVegIcon />
                    ) : item?.foodType === 'both' ? (
                       <VegNonVegIcon />
                     ) : null
                  )}
                    <Text style={{marginLeft: !selectToggle ? 5 :35,color:"#101010",fontSize:14, fontWeight:"800",fontFamily: "ManropeRegular",}}>{formatAmount(item?.price)}<Text style={{color:"#101010",fontSize:14, fontWeight:"400",fontFamily: "ManropeRegular",}}> /{!selectToggle ? 'hr' : 'km'}</Text></Text>
                   </View>
                   </View>

                   <View style={{flexDirection:"row",marginTop:7,marginLeft:5}}>
                      <View style={{flexDirection:"row",alignItems:"center",width:Dimensions.get('window').width/5.7,}}>
                        {!selectToggle ?
                        <HireIcon/>
                        : <CarSteering/> }
                        <Text style={{marginLeft:5,color:"#4A4A4A",fontSize:12, fontWeight:"400",fontFamily: "ManropeRegular",}}>{item?.experience} years</Text>
                      </View>
                      <View style={{flexDirection:"row",alignItems:"center",marginLeft:5,width:"50%"}}>
                        <ClockIcon />
                        <Text style={{marginLeft:5,color:"#4A4A4A",fontSize:12, fontWeight:"400",fontFamily: "ManropeRegular",}}>{item?.available ? 'Available' : 'Not Available'}</Text>
                      </View>
                      <TouchableOpacity style={{borderRadius:5,backgroundColor:"#FFF8F0",paddingHorizontal:15,paddingVertical:5}}>
                        <Text style={{color:"#FD813B",fontSize:12, fontWeight:"700",fontFamily: "ManropeRegular",}}>Book Now</Text>
                      </TouchableOpacity>
                   </View>


          </TouchableOpacity>
        )

      }
      // selectToggle ? 'Drivers': 'Chefs'
      const dataToShow = showAll 
      ? (selectToggle ? driverListDetails : chefListDetails) 
      : (selectToggle ? driverListDetails.slice(0, 4) : chefListDetails.slice(0, 4));  
      const remainingCount = selectToggle ?  driverListDetails?.length -4 : chefListDetails?.length - 4;
    
    return(
        <SafeAreaView style={{flex:1, }}>
          
          <View style={{backgroundColor:"white",}}>
          <CustomSwitch
          selectionMode={1}
          roundCorner={true}
          option1={'Hire Chef'}
          option2={'Hire Driver'}
          onSelectSwitch={onSelectSwitch}
          selectionColor={'#CC3F3C'}
          top={5}
        />

        <View style={{alignItems:"center",marginHorizontal:24,marginTop:20,marginBottom:10, flexDirection:"row",justifyContent:"space-between"}}>
          <View>
          <Text style={{fontSize:18, fontWeight:"700",color:"#333333",fontFamily: "ManropeRegular",}}>{selectToggle ?  'Drivers' : 'Chefs' } Near your location</Text>
          <Text style={{fontSize:13, fontWeight:"400",color:"#7D7F88",fontFamily: "ManropeRegular",}}>{selectToggle ? `${driverListDetails?.length} Drivers`:`${chefListDetails?.length} Chefs` } in Bangalore</Text>

          </View>
          <FilterIcon />
        </View>
         </View>

         <ScrollView style={{marginBottom:"15%"}}>
          <FlatList
          data={dataToShow}
          renderItem={renderHires}/>
         
         {remainingCount > 0 && !showAll && (
        <TouchableOpacity onPress={() => setShowAll(true)} style={styles.showMoreButton}>
          <Text style={styles.showMoreText}>{remainingCount} + Available</Text>
        </TouchableOpacity>
      )}

      {/* <View>
        <View style={{flexDirection:"row",marginHorizontal:20,marginTop:30,alignItems:"center"}}>
          <Text style={{width:"85%",color:"#333333",fontSize:18,fontWeight:"700",fontFamily: "ManropeRegular",}}>Feature Chef near You</Text>
          <TouchableOpacity style={{flexDirection:"row",alignItems:"center"}}>
            <Text style={{color:"#ECA73C", fontSize:12, fontWeight:"700",fontFamily: "ManropeRegular",}}>See all</Text>
            <RightArrow style={{marginLeft:4,marginTop:2}}/>
          </TouchableOpacity>
        </View>

        <FlatList
        horizontal
        data={ !selectToggle ? chefDetails : driverDetails}
        contentContainerStyle={{marginTop:15,marginLeft:5}}
        renderItem={chefsNear}/>
      </View> */} 
           <HowItWorks/>
      </ScrollView>      
        </SafeAreaView>
    )
}

export default Hire;

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    backgroundColor: "white",
    marginHorizontal: 15,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  row: {
    flexDirection: "row",
  },
  details: {
    marginLeft: 10,
    width: "50%",
  },
  name: {
    marginTop: 5,
    color: "#101010",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "ManropeRegular",
  },
  subDetails: {
    marginTop: 0,
    color: "#A8A8A8",
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "ManropeRegular",
  },
  verifiedContainer: {
    marginTop: 5,
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
    borderRadius: 5,
    paddingHorizontal: 5,
    width: 57,
  },
  icon: {
    marginHorizontal: 2,
  },
  verifiedText: {
    color: '#6B779A',
    fontSize: 9,
    fontFamily: "ManropeRegular",
    fontWeight: "800",
  },
  priceContainer: {
    flexDirection: "row",
  },
  price: {
    color: "#101010",
    fontSize: 14,
    fontWeight: "800",
    fontFamily: "ManropeRegular",
  },
  perHour: {
    color: "#101010",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "ManropeRegular",
  },
  additionalDetails: {
    flexDirection: "row",
    marginTop: 7,
    marginLeft: 5,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: Dimensions.get('window').width / 5.7,
  },
  infoText: {
    marginLeft: 5,
    color: "#4A4A4A",
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "ManropeRegular",
  },
  bookNowButton: {
    borderRadius: 5,
    backgroundColor: "#FFF8F0",
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  bookNowText: {
    color: "#FD813B",
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "ManropeRegular",
  },
  showMoreButton: {
    marginTop:8,
    padding: 10,
    marginHorizontal:17,
    borderColor: "#C5433E",
    borderWidth:1,
    borderRadius: 10,
    alignItems: "center",
  },
  showMoreText: {
    color: "#D0433C",
    fontSize: 14,
    fontWeight: "800",
    fontFamily: "ManropeRegular",
  },
});
