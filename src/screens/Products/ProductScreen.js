import { Text, View, ScrollView, StyleSheet } from 'react-native'
import Tags from "./Tags"
import DiscountComponent from './DiscountComponent'
import TrendingNow from './TrendingNow'
import shirtImg from '../../assets/shirt.png'

const ProductScreen = () => {
    const DATA = [
        {
          id: 0,
          productName: 'Trail Running Jacket Nike Windrunner',
          productPrice:700,
          productDiscount:20,
          discountPercentage:20,
          imageUrl:shirtImg
        },
        {
          id: 1,
          productName: 'Trail Running Jacket Nike Windrunner',
          productPrice:700,
          productDiscount:20,
          discountPercentage:20,
          imageUrl:shirtImg,
        },
        {
          id: 2,
          productName: 'Trail Running Jacket Nike Windrunner',
          productPrice:700,
          productDiscount:20,
          discountPercentage:20,
          imageUrl:shirtImg,
        },
        {
            id:3,
            productName: 'Trail Running Jacket Nike Windrunner',
            productPrice:700,
            productDiscount:20,
            discountPercentage:20,
            imageUrl:shirtImg,
        },
        {
            id:4,
            productName: 'Trail Running Jacket Nike Windrunner',
            productPrice:700,
            productDiscount:20,
            discountPercentage:20,
            imageUrl:shirtImg,
        },
        {
            id:5,
            productName: 'Trail Running Jacket Nike Windrunner',
            productPrice:700,
            productDiscount:20,
            discountPercentage:20,
            imageUrl:shirtImg,
        }
      ];
      const discountList = [
        {
          id: 0,
          value: 'All',
        },
        {
          id: 1,
          value: '10%',
        },
        {
          id: 2,
          value: '20%',
        },
        {
            id:3,
            value: '30%',
        },
        {
            id:4,
            value: '40%',
        },
        {
            id:5,
            value: '50%',
        },
      ];
    return (
        <ScrollView style={styles.root}>
            <Tags />
            <DiscountComponent data={DATA}/>
            <TrendingNow data={DATA} discountList={discountList}/>
        </ScrollView>
    )
}

export default ProductScreen

const styles=StyleSheet.create({
    root:{
        
        marginLeft:20,
        marginRight:20
    }
})