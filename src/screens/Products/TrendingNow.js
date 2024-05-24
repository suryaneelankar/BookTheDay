import {Text,View,FlatList,StyleSheet,Image} from "react-native"
import BackButton from '../../assets/svgs/backButton.svg'

const TrendingNow=({data,discountList})=>{
    const Item = ({product}) => {
    return(
        <View style={styles.productContainer}>
            <View style={styles.firstContainer}>
                <View style={styles.imageContainer}>
                    <Image style={styles.productImage} source={product.imageUrl} resizeMode="contain" />
                </View>
            </View>
            <Text style={styles.productName}>{product.productName}</Text>
       
            <Text style={styles.price}>{product.productPrice}</Text>
        
        </View>
    )
    }

    const DiscountItem=({item})=>{
        return(
            <View style={styles.discountFlatList}>
                <Text style={styles.discountValue}>{item.value}</Text>
            </View>
        )
    }

    return(
        <View style={styles.rootContainer}>
        <View style={styles.topContainer}>
            <Text>Trending Now</Text>
            <View style={styles.sellAllContainer}>
                <Text>See All</Text>
                <BackButton width={20} height={20} style={styles.backButton}/>
            </View>
        </View>

        <FlatList
            data={discountList}
            renderItem={({item}) => <DiscountItem item={item} />}
            keyExtractor={item => item.id}
            horizontal={true}
            // numColumns={2}
        />

        <FlatList
            data={data}
            renderItem={({item}) => <Item product={item} />}
            keyExtractor={item => item.id}
            horizontal={true}
            // numColumns={2}
        />
        </View>
    )
}
export default TrendingNow

const styles = StyleSheet.create({
    rootContainer:{
        backgroundColor:'#FEF8D8',
    },
    topContainer:{
        marginTop:50,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    discountFlatList:{
        backgroundColor:'white'
    },
    sellAllContainer:{
        flexDirection:'row',
    },
    backButton:{
        marginLeft:8,
    },
    discountValue:{
        color:'black',
        fontWeight:'400',
        marginHorizontal:10,
        marginVertical:5,
    },

    productContainer:{
        height:200,
        width:170,
        margin:10,
        borderRadius:10,
        backgroundColor:'#ffffff',
    },
    productDiscount:{
        alignSelf:'flex-end',
        width:40,
        backgroundColor:'#B46609',
        marginRight:10,
        marginTop:10,
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
        marginBottom:5
    },
    productImage:{
        alignItems:'center',
        height:120,
        width:130,
        marginLeft:8,
        borderRadius:8,
        
    },
    productName:{
        fontWeight:'Manrope',
        color:'black',
        paddingLeft:10,
        paddingRight:10,
    },
    priceContainer:{
        flexDirection:'row',
        marginLeft:10
        
    },
    price:{
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