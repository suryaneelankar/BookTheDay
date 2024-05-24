import React from 'react';
import {  Text, StyleSheet, TouchableOpacity ,FlatList,Dimensions} from 'react-native';
import TrendingBgImg from '../assets/svgs/TrendingBgImg.svg';
import Trusted from '../assets/svgs/trusted.svg'

const TrendingView = ({data }) => {
  
    const trendingList = ({ item }) => {
        return (
          <TrendingItem
            name={item?.name}
            image={item?.image}
          />
        );
      };

    const TrendingItem = ({ name, image: ImageComponent,}) => {
        return (
            <TouchableOpacity style={styles.container}>
                <TrendingBgImg
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                />
                <TouchableOpacity style={styles.trustedContainer}>
                    <Trusted style={styles.trustedIcon}/>
                    <Text style={styles.trustedText}>Trusted Lender</Text>
                </TouchableOpacity>
                <Text style={styles.trendingName} numberOfLines={2}>{name}</Text>
                <ImageComponent style={{bottom:10}}/>
            </TouchableOpacity>
        );
    };
    return (
           <FlatList
           horizontal
           showsHorizontalScrollIndicator={true}
           indicatorStyle="red"
           scrollIndicatorInsets={'red'}
           data={data}
           renderItem={trendingList}
           />
    );
};

const styles = StyleSheet.create({
    container: {
        width:Dimensions.get('window').width/2 + 40,
        marginHorizontal:20,
        marginTop:20,
    },
    trustedContainer:{ 
        backgroundColor: '#FFF0F0', 
        alignSelf:"center", 
        borderRadius: 8,
        flexDirection:'row',
        alignItems:'center',
        marginTop:30
    },
    trustedIcon:{
        marginHorizontal:5
    },
    trustedText:{
        fontFamily: 'ManropeRegular', 
        fontWeight: '800', 
        fontSize: 12, 
        color: '#B92D3D',
        padding:5
    },
    trendingName:{
        marginHorizontal:10,
        fontFamily: 'ManropeRegular', 
        fontWeight: '800', 
        color: '#FAFAFA', 
        fontSize: 24,
        alignSelf:'center',
        textAlign:'center',
        marginTop:10 
    }
});

export default TrendingView;
