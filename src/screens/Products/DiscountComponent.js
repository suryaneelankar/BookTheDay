import {Text,View,FlatList,StyleSheet,Image} from "react-native"
import FilterIcon from '../../assets/svgs/filter.svg';
import { formatAmount } from "../../utils/GlobalFunctions";
import themevariable from '../../utils/themevariable'

const DiscountComponent=({data})=>{
    const Item = ({product}) => {
    return(
        <View style={styles.productContainer}>
            <View style={styles.firstContainer}>
                <View style={styles.imageContainer}>
                    {/* <Text style={styles.productDiscount}>
                        {product.productDiscount}%
                    </Text> */}
                    <Image style={styles.productImage} source={product.imageUrl} resizeMode="contain" />
                </View>
            </View>
            <Text style={styles.productName}>{product.productName}</Text>
        <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatAmount(product.productPrice)}</Text>
            <Text style={styles.discount}>{formatAmount(product.productDiscount)}</Text>
        </View>
        </View>
    )
    }

    return(
        <View style={styles.rootContainer}>
        <View style={styles.topContainer}>
            <Text style={styles.productText}>Products You may Like</Text>
            <FilterIcon width={20} height={20} />
        </View>
        <FlatList
            data={data}
            renderItem={({item}) => <Item product={item} />}
            keyExtractor={item => item.id}
            horizontal={false}
            numColumns={2}
        />
        </View>
    )
}
export default DiscountComponent

const styles = StyleSheet.create({
    rootContainer:{
        marginTop:30,
        marginHorizontal:20,
    },
    topContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginBottom:11,
    },
    productContainer:{
        height:250,
        width:170,
        marginHorizontal:5,
        marginVertical:10,
        borderRadius:10,
    },
    productText:{
        fontFamily:'ManropeRegular',
        fontWeight:'700',
        fontSize:18,
        color:themevariable.Color_202020
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
        backgroundColor:themevariable.Color_FFFFFF,
        borderRadius:7,
    },
    imageContainer:{
    },
    productImage:{
        alignSelf:'center',
        marginBottom:8,
        borderRadius:10,        
    },
    productName:{
        fontFamily:'ManropeRegular',
        color:'black',
        marginVertical:5,
        marginHorizontal:3,
    },
    priceContainer:{
        flexDirection:'row',
        marginLeft:5
        
    },
    price:{
        color:themevariable.Color_202020,
        fontWeight:'bold',
        fontSize:20
    },
    discount:{
        color:themevariable.Color_ECA73C99,
        fontWeight:'bold',
        fontSize:18,
        textAlignVertical:'center',
        marginLeft:8,
        textDecorationLine:'line-through'
    },
})