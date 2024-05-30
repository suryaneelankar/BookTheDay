import {Text,View,FlatList,StyleSheet,Image, TouchableOpacity, Dimensions} from "react-native"
import { useState } from "react"
import BackButton from '../../assets/svgs/backButton.svg'
import { formatAmount } from "../../utils/GlobalFunctions"
import themevariable from '../../utils/themevariable'
import Svg, { Path } from 'react-native-svg';
import { horizontalScale, verticalScale } from "../../utils/scalingMetrics"

const TrendingNow=({data,discountList, textHeader})=>{
    const [selectedDiscount,setSelectedDiscount] = useState('All')



    const Item = ({product}) => {
    return(
        <View style={styles.productContainer}>
            <View style={styles.firstContainer}>
                <View style={styles.imageContainer}>
                    <Image style={styles.productImage} source={product.imageUrl} resizeMode="contain" />
                </View>
            </View>
            <Text style={styles.productName}>{product.productName}</Text>
            <Text style={styles.price}>{formatAmount(product.productPrice)}</Text>
        </View>
    )
    }

    const DiscountItem=({item})=>{
        return(
            <TouchableOpacity 
            onPress={()=>{setSelectedDiscount(selectedDiscount == item?.value ? '' : item?.value)}}
            style={selectedDiscount == item?.value ? styles.selectedDiscountContainer : styles.discountFlatList}>
               {selectedDiscount === item?.value && (
                 <Svg height="6" width="12" style={styles.arrow}>
                 <Path d="M0 0 L6 6 L12 0" fill="#CE423D" />
                 </Svg>
               )}
                <Text style={selectedDiscount == item?.value ? styles.selectedDiscountValue : styles.discountValue}>
                    {item?.value}
                </Text>
            </TouchableOpacity>
        )
    }

    const renderOfferDetails = ({ item }) => {

        return (
            <View style={{}}>
                <TouchableOpacity
                    style={{ width: Dimensions.get('window').width /2.8, alignSelf: 'center', borderRadius: 8, backgroundColor: 'white', height: 'auto',marginLeft:16}}>
                    <Image source={{ uri: item?.catImageUrl }} style={{ borderTopLeftRadius:8,borderTopRightRadius:8,width: '90%',alignSelf:"center",marginTop:5, height:Dimensions.get('window').height/5 }}
                    />
                    <View style={{ marginTop: 15,marginHorizontal:6 }}>
                            <Text numberOfLines={2} style={{ fontWeight: '600', color: '#000000', fontSize: 12, fontFamily: 'ManropeRegular' }}>{item?.productName}</Text>
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5,marginBottom:10 }}>
                            {/* <Text style={{ fontWeight: '700', color:'#202020', fontSize: 14, fontFamily: 'ManropeRegular' }}>{formatAmount(item?.price)}/day</Text> */}
                            <Text style={{ fontWeight: '700', color:'#202020', fontSize: 14, fontFamily: 'ManropeRegular' }}>{formatAmount('700')}</Text>
 
                                <Text style={styles.strickedoffer}>{formatAmount(900 + 1000)}</Text>
                            </View>   
                                              
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    return(
        <View style={styles.rootContainer}>
        <View style={styles.subContainer}>
        <View style={styles.topContainer}>
            <Text style={styles.trendingText}>{textHeader}</Text>
            <View style={styles.sellAllContainer}>
                <Text style={styles.seeAllText}>See All</Text>
                <BackButton width={20} height={20} style={styles.backButton}/>
            </View>
        </View>
        <View style={styles.discountContainer}>
        <FlatList
            data={discountList}
            renderItem={({item}) => <DiscountItem item={item} />}
            keyExtractor={item => item.id}
            horizontal={true}
            // numColumns={2}
        />
        </View>
        </View>
        <FlatList
        horizontal
        data={data}
        contentContainerStyle={{paddingVertical:verticalScale(20),marginLeft:horizontalScale(5)}}
        renderItem={renderOfferDetails}
        showsHorizontalScrollIndicator={false}
        />
        {/* <FlatList
            data={data}
            renderItem={({item}) => <Item product={item} />}
            keyExtractor={item => item.id}
            horizontal={true}
            // numColumns={2}
        /> */}
       
        </View>
    )
}
export default TrendingNow

const styles = StyleSheet.create({
    rootContainer:{
        backgroundColor:themevariable.Color_FEF8D8,
        marginTop:30
    },
    subContainer:{
        marginHorizontal:20,
    },
    topContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginVertical:20,
    },
    discountContainer:{
        backgroundColor:'white',
        borderRadius:10,
        width:"97%",
    },
    discountFlatList:{
        paddingVertical:3,
        paddingHorizontal:10
       
    },
    arrow: {
        // position: 'absolute',
        top: -2,
        alignSelf:"center"
      },
    selectedDiscountContainer:{
        borderColor:'#CE423D',
        borderWidth:3,
        borderRadius:25,
        fontFamily:'ManropeRegular',
        color:themevariable.Color_000000,
        fontWeight:'bold',
        // marginHorizontal:10,
        justifyContent:'center',
        paddingHorizontal:10
    },
    selectedDiscountValue:{
        color:'#CE423D',
        marginHorizontal:5,
        fontWeight:'bold',
    },
    strickedoffer: {
        fontSize: 14,
        color: "#9A2143",
        fontWeight: "700",
        fontFamily:'ManropeRegular',
        marginLeft: 4,
        textDecorationLine: 'line-through'
    },
    trendingText:{
        fontFamily:'ManropeRegular',
        fontWeight:'700',
        fontSize:18,
        color:themevariable.Color_202020
    },
    sellAllContainer:{
        flexDirection:'row',
    },
    seeAllText:{
        fontWeight:'700',
        fontSize:18,
        color:themevariable.Color_202020,
        fontFamily:'ManropeRegular',
    },
    backButton:{
        marginLeft:12,
        alignSelf:'center'
    },
    discountValue:{
        fontFamily:'ManropeRegular',
        color:themevariable.Color_000000,
        fontWeight:'bold',
        marginHorizontal:5,
        marginVertical:5,
    },

    productContainer:{
        height:215,
        width:170,
        marginBottom:23,
        marginRight:12,
        borderRadius:15,
        backgroundColor:themevariable.Color_FFFFFF,
    },
    productDiscount:{
        alignSelf:'flex-end',
        width:40,
        backgroundColor:themevariable.Color_B46609,
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
        borderBottomLeftRadius:5,
        color:'white',
        fontWeight:'bold',
        textAlign:'center'
    },
    firstContainer:{
        height:130,
        width:150,
        borderRadius:7,
    },
    imageContainer:{
        marginBottom:5,
        backgroundColor:'red'
    },
    productImage:{
        position:'absolute',
        alignItems:'center',
        height:120,
        width:130,
        borderRadius:8,
        
    },
    productName:{
        fontFamily:'ManropeRegular',
        color:'#000000',
        marginLeft:10,
        marginRight:10,
        marginBottom:5
    },
    priceContainer:{
        flexDirection:'row',
        marginLeft:10
        
    },
    price:{
        marginLeft:10,
        color:"black",
        fontWeight:'bold',
        fontSize:20
    },
    discount:{
        color:'#FF00006E',
        fontWeight:'bold',
        fontSize:18,
        textAlignVertical:'center',
        marginLeft:8,
        textDecorationLine:'line-through'
    },
})