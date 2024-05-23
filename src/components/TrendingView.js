import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import TrendingBgImg from '../assets/svgs/TrendingBgImg.svg';
import TrendingShirtImg from '../assets/svgs/shirtTrending.svg';
import Trusted from '../assets/svgs/trusted.svg'

const TrendingView = ({ }) => {
    return (
        <View style={styles.container}>
            <TrendingBgImg
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
            />
            <TouchableOpacity style={{ backgroundColor: '#FFF0F0', alignSelf: 'center', borderRadius: 8,flexDirection:'row',alignItems:'center',marginTop:30}}>
                <Trusted style={{marginHorizontal:5}}/>
                <Text style={{fontFamily: 'ManropeRegular', fontWeight: '800', fontSize: 12, color: '#B92D3D',padding:5}}>Trusted Lender</Text>
            </TouchableOpacity>
            <Text style={{ fontFamily: 'ManropeRegular', fontWeight: '800', color: '#FAFAFA', fontSize: 24,alignSelf:'center',textAlign:'center',marginTop:10 }} numberOfLines={2}>Levi's Full-Sleeve Blue Shirt</Text>
            <TrendingShirtImg />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width:'60%',
        marginHorizontal:20,
        marginTop:20
    },
});

export default TrendingView;
