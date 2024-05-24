import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, FlatList, Pressable } from 'react-native';
import BASE_URL from "../../apiconfig";
import Icon from 'react-native-vector-icons/FontAwesome';
import SwiperFlatList from 'react-native-swiper-flatlist';
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
import { formatAmount } from '../../utils/GlobalFunctions';
import SearchIcon from '../../assets/svgs/searchIcon.svg';
import FilterIcon from '../../assets/svgs/filter.svg';
import TentHouseIcon from '../../assets/svgs/TentHouseIcon.svg';

const Events = () => {
    const navigation = useNavigation();
    const [eventsData, setEventsData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const suggestions = ['Events', 'Function Hall', 'Food', 'Catering', 'Tent House', 'Decoration', 'Halls'];
    const Cats = [TentHouseIcon, TentHouseIcon, TentHouseIcon, TentHouseIcon];

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

    const renderItem = ({ item }) => {

        const scrollToFirstonEnd = (index) => {
            console.log(index, item?.subImages?.length - 1, 'lenths aree')

            if (index == 2) {
                setCurrentIndex(0);
            }
        }

        const onPressEventImage = () => {
            navigation.navigate('ViewEvents', { categoryId: item?._id });
        }

        return (
            <View style={{ marginBottom: 15 }}>
                <View style={styles.container}>
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
                            <TouchableOpacity style={[{ backgroundColor: item, alignSelf: 'center', borderRadius: 15, width: Dimensions.get('window').width - 50, justifyContent: 'center', height: 220 }]}
                                onPress={() => onPressEventImage()}
                            >
                                <Image source={{ uri: item }} style={styles.image}
                                    resizeMethod="resize"
                                    resizeMode="cover" />
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ViewEvents', { categoryId: item?._id })}
                    style={{ width: Dimensions.get('window').width - 50, alignSelf: 'center' }}>
                    <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', }}>
                        <View>
                            <Text style={{ fontWeight: '600', color: 'black', fontSize: 17 }}>{item?.name}</Text>
                            <Text style={{ fontWeight: '500', color: '#696969', fontSize: 13, marginTop: 5 }}>Madhapur,Hyderabad</Text>
                        </View>
                        <View>
                            <Text style={{ fontWeight: '600', color: 'black', fontSize: 18 }}>{formatAmount(item?.price)}<Text style={{ color: "gray", fontSize: 16 }}>/day</Text></Text>
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                                <Text style={styles.strickedoffer}>₹20000</Text>
                                <Text style={styles.off}> 20% off</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: 10, flexDirection: 'row' }}>

                        {/* <Text style={{ fontWeight: '600', color: '#696969', fontSize: 12, width: '100%' }}>{item?.description}</Text> */}
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "50%" }}>

                        <View style={{ backgroundColor: item?.available ? "#dcfcf0" : "#ff6347", flexDirection: 'row', alignSelf: "center", alignItems: "center", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
                            <Image source={require('../../assets/available.png')} style={{ width: 15, height: 15 }} />
                            {item?.available ?
                                <Text style={{ fontWeight: '600', color: 'black', fontSize: 12, marginHorizontal: 5 }}>Available</Text>
                                :
                                <Text style={{ fontWeight: '600', color: 'black', fontSize: 12, marginHorizontal: 5 }}>Booked</Text>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: "center", alignItems: "center", marginHorizontal: 5 }}>
                            <Image source={require('../../assets/people.png')} style={{ width: 25, height: 25 }} />
                            <Text style={{ marginHorizontal: 2 }}> 300-500</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.searchContainer}>
                <View style={styles.searchProduct}>
                    <View style={styles.searchProHeader}>
                        <SearchIcon style={{ marginLeft: 10 }} />
                        <TextInput
                            placeholder="Search by products"
                            style={styles.textInput} />
                    </View>
                </View>
                <View style={styles.filterView}>
                    <FilterIcon />
                </View>
            </View>
            <View style={{ flexDirection: 'row',backgroundColor:'#FFEFC0' }}>
                {Cats.map((IconComponent, index) => (
                    <TouchableOpacity>
                        <IconComponent key={index} width={100} height={100} />
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={filteredSuggestions}
                contentContainerStyle={{}}
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
    searchContainer: {
        marginHorizontal: 20,
        flexDirection: "row",
        marginVertical: 10,
        justifyContent: "space-between",
        borderColor: '#E3E3E7',
        borderWidth: 1,
        borderRadius: 22,
        backgroundColor: '#F2F2F3'
    },
    searchProduct: {
        height: 45,
        width: "85%",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
    },
    searchProHeader: {
        flexDirection: "row",
        alignSelf: "center",
        alignItems: "center"
    },
    textInput: {
        marginLeft: 10,
        alignSelf: "center"
    },
    filterView: {
        height: 45,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        flex: 1,
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
