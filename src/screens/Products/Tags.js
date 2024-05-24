import {View,Text,FlatList,StyleSheet,Image} from "react-native"
import shirtIcon from "../../assets/shirtIcon.png"

const Tags=()=>{
    const DATA = [
        {
          id: 0,
          title: 'product 1',
          imageUrl:shirtIcon
        },
        {
          id: 1,
          title: 'product 2',
          imageUrl:shirtIcon
        },
        {
          id: 2,
          title: 'product 3',
          imageUrl:shirtIcon
        },
        {
          id: 3,
          title: 'product 3',
          imageUrl:shirtIcon
        },
        {
          id: 4,
          title: 'product 3',
          imageUrl:shirtIcon
        },
        {
          id: 5,
          title: 'product 3',
          imageUrl:shirtIcon
        },
      ];

    const Item = ({item}) => (
    <View style={styles.item}>
      <Image style={styles.productImage} source={item.imageUrl} resizeMode="contain" />
        <Text style={styles.title}>{item.title}</Text>
    </View>
    );

    return(
      <>
      <Text>Categories ({DATA.length})</Text>
        <FlatList
            data={DATA}
            renderItem={({item}) => <Item item={item} />}
            keyExtractor={item => item.id}
            horizontal={true}
            style={styles.tagsList}
        />
      </>
    )
}
export default Tags

const styles = StyleSheet.create({
    item:{
        margin:10,
        borderRadius:25,
        fontFamily:'Manrope',
        alignItems:'center',
    },
    title:{
    },
    tagsList:{
        
    },
    productImage:{}
})