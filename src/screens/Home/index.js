import React, {useEffect, useState} from "react";
import { View, Text, Dimensions, ImageBackground, StyleSheet, Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import Wedding from '../../assets/wedding.png';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from "../../apiconfig";
import axios from "axios";

const HomeDashboard = () => {
    const [categories,setCategories] = useState([])


    useEffect(()=>{
        getCategories();
    },[]);

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
    const images = [
        require('../../assets/wedding.png'),
        require('../../assets/furniture.jpg'),
        require('../../assets/decoration.jpg'),
    ];
    const editsData = [
        { image: require('../../assets/cameraIcon.jpeg'), name: 'Sardha cameras', status: 'Available' },
        { image: require('../../assets/men.jpeg'), name: 'fashionstore', status: 'Available' },
        { image: require('../../assets/jwellery.jpg'), name: 'trendnow', status: 'Available' },
    ]


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView style={{marginBottom:70}} >
                <View style={{ height: 65, width: "100%", paddingVertical: 10, borderBottomColor: "#e0dede", borderBottomWidth: 1, elevation: 1 }}>
                    <View style={{ flexDirection: "row", width: "95%", alignSelf: "center", alignItems: "center", borderRadius: 10, borderColor: "#f7f5f5", backgroundColor: "#f7f5f5", borderWidth: 1, }}>
                        <Image source={require('../../assets/searchIcon.png')}
                            style={{ height: 15, width: 15, marginLeft: 10, alignSelf: "center" }}
                        />
                        <TextInput
                            placeholder="Browse requirements"
                            style={{ marginLeft: 15, alignSelf: "center", }} />
                    </View>
                </View>
                <View style={styles.container}>
                    <SwiperFlatList
                        autoplay
                        autoplayDelay={2}
                        autoplayLoop
                        index={2}
                        showPagination
                        data={images}
                        style={{ flex: 1 }}
                        renderItem={({ item }) => (
                            <View style={[{ backgroundColor: item, width, justifyContent: 'center', height: 300 }]}>
                                <Image source={item} style={styles.image}
                                    resizeMethod="resize"
                                    resizeMode="stretch" />
                            </View>
                        )}
                    />
                </View>

                <View style={{marginTop:20}}>
                    <View style={{ flexDirection: "row" , alignSelf:"center",justifyContent:"space-between",width:"90%"}}>
                        <Text style={{color:"black", fontSize:14, fontWeight:"400"}}>Trending Now</Text>
                        <Text style={{color:"black", fontSize:12, fontWeight:"400"}}>View All {'>'}</Text>
                    </View>
                    <ScrollView horizontal style={{marginHorizontal:10,}} showsHorizontalScrollIndicator={false}>
                        {categories.filter(item => item.type === 'Trending Now').map((item, index) => (
                            <TouchableOpacity
                            onPress={() => navigation.navigate('ViewTrendingDetails',{categoryId: item?._id})}
                             key={index} style={styles.card}>
                                <Image source={{ uri: item.catImageUrl }} style={{
                                    width: 100,
                                    height: 150,
                                    resizeMode:"contain",
                                }} />
                                <Text style={styles.title}>{item?.name}</Text>
                                <Text style={[styles.status,{color:item?.rented ?  "#a85705" : "white", backgroundColor:item?.rented ? "#fabdb6" :"green"}]}>{item?.rented ? 'Out of Stock' : 'Available'}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                </View>

                <View style={{marginTop:20}}>
                    <View style={{ flexDirection: "row" , alignSelf:"center",justifyContent:"space-between",width:"90%"}}>
                        <Text style={{color:"black", fontSize:14, fontWeight:"400"}}>Brand New</Text>
                        <Text style={{color:"black", fontSize:12, fontWeight:"400"}}>View All {'>'}</Text>
                    </View>
                    <ScrollView horizontal style={{marginHorizontal:10,}} showsHorizontalScrollIndicator={false}>
                        {categories.filter(item => item.type === 'Brand New').map((item, index) => (
                            <TouchableOpacity
                            onPress={() => navigation.navigate('ViewTrendingDetails',{categoryId: item?._id})}
                             key={index} style={styles.card}>
                                <Image source={{ uri: item.catImageUrl }} style={{
                                    width: 100,
                                    height: 150,
                                    resizeMode:"contain"
                                }} />
                                <Text style={styles.title}>{item?.name}</Text>
                                <Text style={[styles.status,{color:item?.rented ?  "#a85705" : "white" , backgroundColor:item?.rented ? "#fabdb6" :"green" }]}>{item?.rented ? 'Out of Stock' : 'Available'}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                </View>
                        <View style={{marginTop:30}}>
                        {editsData.map((item, index) => (
                            <View key={index} style={styles.listcard}>
                                <Image source={item.image} style={{
                                    width: "100%",
                                    height: 120,
                                    borderRadius: 10,
                                    // marginBottom: 10,
                                }}/>
                                
                                 <Text style={{position:"absolute", left:20, top:30, color:"black"}}>{item?.name}</Text>
                            </View>
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
    container: { flex: 1, backgroundColor: 'white' },
    text: { fontSize: 12, textAlign: 'center' },
    title: {
        fontSize: 12,
        fontWeight: "400",
        alignSelf:"center",
        textAlign:"center",
        marginTop:5
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
        width: '100%',
        height: "95%",
        resizeMode: 'cover',
    },
});

export default HomeDashboard;

