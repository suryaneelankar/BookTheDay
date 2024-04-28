import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, FlatList } from 'react-native';
import BASE_URL from "../../apiconfig";
import Icon from 'react-native-vector-icons/FontAwesome';
import SwiperFlatList from 'react-native-swiper-flatlist';
import axios from "axios";
import { useNavigation } from '@react-navigation/native';


const Events = () => {
    const navigation = useNavigation();
    const [eventsData, setEventsData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const suggestions = ['Events', 'Function Hall', 'Food', 'Catering', 'Tent House', 'Decoration', 'Halls'];

    useEffect(() => {
        getAllEvents();
    }, []);

    const [text, setText] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    const filterSuggestions = (inputText) => {
        const filtered = suggestions.filter(
            (item) => item.toLowerCase().indexOf(inputText.toLowerCase()) !== -1
        );
        setFilteredSuggestions(filtered);
    };

    const handleTextChange = (inputText) => {
        setText(inputText);
        filterSuggestions(inputText);
    };

    const handleSuggestionPress = (item) => {
        setText(item);
        setFilteredSuggestions([]);
    };

    const getAllEvents = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/all-events`);
            setEventsData(response?.data?.data)
        } catch (error) {
            console.log("events data error>>::", error);
        }
    }

    function formatAmount(amount) {
        const amountStr = `${amount}`;
        const [integerPart, decimalPart] = amountStr.split('.');
        const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const formattedAmount = decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
        return `₹${formattedAmount}`;
    }

    const renderItem = ({ item }) => {

        const scrollToFirstonEnd = (index) => {
            console.log(index, item?.subImages?.length - 1, 'lenths aree')

            if (index == 2) {
                setCurrentIndex(0);
            }
        }

        return (
            <View style={{ marginBottom: 15 }}>
                <View
                    style={styles.container}>
                    <SwiperFlatList
                        index={currentIndex}
                        showPagination
                        paginationDefaultColor='white'
                        paginationActiveColor='white'
                        paginationStyle={{ bottom: 5 }}
                        paginationStyleItem={{ alignSelf: 'center' }}
                        paginationStyleItemInactive={{ width: 7, height: 7 }}
                        paginationStyleItemActive={{ width: 10, height: 10 }}
                        data={item?.subImages}
                        style={{ borderRadius: 15 }}
                        onChangeIndex={({ index, prevIndex }) => scrollToFirstonEnd(index)}
                        renderItem={({ item }) => (
                            <View style={[{ backgroundColor: item, alignSelf: 'center', borderRadius: 15, width: Dimensions.get('window').width - 50, justifyContent: 'center', height: 220 }]}>
                                <Image source={{ uri: item }} style={styles.image}
                                    resizeMethod="resize"
                                    resizeMode="cover" />
                            </View>
                        )}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ViewEvents', { categoryId: item?._id })}
                    style={{ width: Dimensions.get('window').width - 50, alignSelf: 'center' }}>
                    <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', }}>
                        <View>
                            <Text style={{ fontWeight: '600', color: 'black', fontSize: 16 }}>{item?.name}</Text>
                            <Text style={{ fontWeight: '600', color: '#696969', fontSize: 12,marginTop:5 }}>Madhapur,Hyderabad</Text>
                        </View>
                        <View>
                            <Text style={{ fontWeight: '600', color: 'black', fontSize: 18 }}>{formatAmount(item?.price)}<Text style={{ color: "gray", fontSize: 16 }}>/day</Text></Text>
                            <View style={{ flexDirection: "row", alignItems: "center" , marginTop:4}}>
                                <Text style={styles.strickedoffer}>₹20000</Text>
                                <Text style={styles.off}> 20% off</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: 10, flexDirection: 'row' }}>

                        {/* <Text style={{ fontWeight: '600', color: '#696969', fontSize: 12, width: '100%' }}>{item?.description}</Text> */}
                    </View>
                    <View style={{  flexDirection: 'row', justifyContent: 'space-between', width: "50%" }}>
                       
                        <View style={{ backgroundColor:"#dcfcf0",flexDirection: 'row', alignSelf: "center", alignItems: "center" , borderRadius:10, paddingHorizontal:10, paddingVertical:2}}>
                            <Image source={require('../../assets/available.png')} style={{ width: 15, height: 15 }} />
                            <Text style={{ fontWeight: '600', color: '#696969', fontSize: 12,}}  >{item?.available ? 'Available' : 'Not Available'}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: "center", alignItems: "center" }}>
                            <Image source={require('../../assets/people.png')} style={{ width: 25, height: 25 }} />
                            <Text > 300-500</Text>
                        </View>



                        {/* <Text style={{ fontWeight: '600', color: '#696969', fontSize: 12, width: '50%' }}>{item?.location}</Text> */}
                        {/* <Text numberOfLines={2} style={{ fontWeight: '600', color: '#696969', fontSize: 14, width: '25%', textAlign: 'right' }}>Incl. tax for 1 night</Text> */}
                    </View>
                    {/* <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: '600', color: '#696969', fontSize: 12, width: '50%' }}>{item?.available ? 'Available' : 'Rented'}</Text>
                    </View> */}
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ height: 65, width: "100%", paddingVertical: 10, borderBottomColor: "#e0dede", borderBottomWidth: 1, elevation: 1 }}>
                <View style={{ flexDirection: "row", width: "95%", alignSelf: "center", alignItems: "center", borderRadius: 10, borderColor: "#f7f5f5", backgroundColor: "#f7f5f5", borderWidth: 1, }}>
                    <Image source={require('../../assets/searchIcon.png')}
                        style={{ height: 15, width: 15, marginLeft: 10, alignSelf: "center" }}
                    />
                    <TextInput
                        placeholder="Browse requirements"
                        style={{ marginLeft: 15, alignSelf: "center", }}
                        value={text}
                        onChangeText={handleTextChange} />
                </View>
            </View>

            <FlatList
                data={filteredSuggestions}
                contentContainerStyle={{ marginBottom: 20 }}
                renderItem={({ item }) => (
                    <Text style={{ padding: 10, backgroundColor: "pink", borderBottomColor: "#e0dede", borderBottomWidth: 1 }}
                        onPress={() => handleSuggestionPress(item)}
                    >
                        {item}
                    </Text>
                )}
                keyExtractor={(item) => item}
                style={{ maxHeight: 200 }}
            />

            <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity style={{ backgroundColor: '#FFF2F8F8', borderRadius: 10, padding: 10 }}>
                    <Text>Price <Icon name="chevron-down" size={15} color="grey" /></Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#FFF2F8F8', borderRadius: 10, padding: 10 }}>
                    <Text>Rating <Icon name="chevron-down" size={15} color="grey" /></Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#FFF2F8F8', borderRadius: 10, padding: 10 }}>
                    <Text>Popular <Icon name="chevron-down" size={15} color="grey" /></Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#FFF2F8F8', borderRadius: 10, padding: 10 }}>
                    <Text>Location <Icon name="chevron-down" size={15} color="grey" /></Text>
                </TouchableOpacity>
            </View>
            {/* <Text style={{ padding: 15, marginHorizontal: 10 }}>Showing 38 matching results</Text> */}
            <FlatList
                data={eventsData}
                renderItem={renderItem}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    calendarViewStyle: {
        width: '70%',
        height: 'auto',
        padding: 10,
        backgroundColor: '#FFF2F1F7',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    strickedoffer: {
        fontSize: 12,
        color: "black",
        fontWeight: "200",
        marginLeft: 7,
        textDecorationLine: 'line-through'
    },
    container: {
        flex: 1,
        // padding: 20,
        // borderColor: 'red',
        // borderWidth: 2,
        alignSelf: 'center',
        width: Dimensions.get('window').width - 50,
        backgroundColor: 'white',
    },
    image: {
        width: '100%',
        height: "95%",
        resizeMode: 'cover',
        borderRadius: 4
    },
    off: {
        fontSize: 13,
        color: "#ed890e",
        fontWeight: "bold"
    },
})

export default Events;
