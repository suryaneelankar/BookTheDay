import {Text,View,FlatList,StyleSheet,Image, TouchableOpacity, Pressable} from "react-native"
import { useState } from "react"
import BackButton from '../../assets/svgs/backButton.svg'
import { formatAmount } from "../../utils/GlobalFunctions"
import themevariable from '../../utils/themevariable'
import { useNavigation } from "@react-navigation/native"

const TrendingNow=({data,discountList})=>{
    const [selectedDiscount,setSelectedDiscount] = useState('')
    const navigation = useNavigation()



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
            onPress={()=>{setSelectedDiscount(selectedDiscount == item.value ? '' : item.value)}}
            style={selectedDiscount == item.value ? styles.selectedDiscountContainer : styles.discountFlatList}>
                <Text style={selectedDiscount == item.value ? styles.selectedDiscountValue : styles.discountValue}>
                    {item.value}
                </Text>
            </TouchableOpacity>
        )
    }

    return(
        <View style={styles.rootContainer}>
        <View style={styles.subContainer}>
        <View style={styles.topContainer}>
            <Text style={styles.trendingText}>Trending Now</Text>
            <View style={styles.sellAllContainer}>
                <Text style={styles.seeAllText}>See All</Text>
                <Pressable >
                    <BackButton width={20} height={20} style={styles.backButton}/>
                </Pressable>
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
        <FlatList
            data={data}
            renderItem={({item}) => <Item product={item} />}
            keyExtractor={item => item.id}
            horizontal={true}
            // numColumns={2}
        />
        </View>
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
        marginHorizontal:30,
    },
    topContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginVertical:20,
    },
    discountContainer:{
        backgroundColor:'white',
        borderRadius:10,
        width:280,
        marginBottom:10
    },
    discountFlatList:{
        padding:5,
    },
    selectedDiscountContainer:{
        borderColor:themevariable.Color_EB3C54,
        borderWidth:3,
        borderRadius:15,
        fontFamily:'ManropeRegular',
        color:themevariable.Color_000000,
        fontWeight:'bold',
        marginHorizontal:10,
        justifyContent:'center'
    },
    selectedDiscountValue:{
        color:'#EB3C54',
        marginHorizontal:5,
        fontWeight:'bold',
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
        color:themevariable.Color_202020
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