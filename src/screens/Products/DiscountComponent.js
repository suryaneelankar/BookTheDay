import {Text,View,FlatList,StyleSheet,Image} from "react-native"


const DiscountComponent=({data})=>{
    const Item = ({product}) => {
    return(
        <View style={styles.productContainer}>
            <View style={styles.firstContainer}>
                <View style={styles.imageContainer}>
                    <Text style={styles.productDiscount}>
                        {product.productDiscount}%
                    </Text>
                    <Image style={styles.productImage} source={product.imageUrl} resizeMode="contain" />
                </View>
            </View>
            <Text style={styles.productName}>{product.productName}</Text>
        <View style={styles.priceContainer}>
            <Text style={styles.price}>{product.productPrice}</Text>
            <Text style={styles.discount}>{product.productDiscount}</Text>
        </View>
        </View>
    )
    }

    return(
        <>
        <Text>20% Discount</Text>
        <FlatList
            data={data}
            renderItem={({item}) => <Item product={item} />}
            keyExtractor={item => item.id}
            horizontal={false}
            numColumns={2}
        />
        </>
    )
}
export default DiscountComponent

const styles = StyleSheet.create({
    productContainer:{
        height:200,
        width:170,
        margin:10,
        borderRadius:10,
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
        backgroundColor:'#ffffff',
        height:150,
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