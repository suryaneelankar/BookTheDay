import {View,Text,FlatList,StyleSheet} from "react-native"

const Tags=()=>{
    const DATA = [
        {
          id: 0,
          title: 'All',
        },
        {
          id: 1,
          title: 'Wedding dress',
        },
        {
          id: 2,
          title: 'Designer coats',
        },
      ];

    const Item = ({title}) => (
    <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
    </View>
    );

    return(
        <FlatList
            data={DATA}
            renderItem={({item}) => <Item title={item.title} />}
            keyExtractor={item => item.id}
            horizontal={true}
            style={styles.tagsList}
        />
    )
}
export default Tags

const styles = StyleSheet.create({
    item:{
        borderWidth:0.7,
        borderColor:"#E3E3E7",
        backgroundColor:'#FFFFFF',
        margin:10,
        padding:8,
       
        
        borderRadius:25,
        fontFamily:'Manrope'
    },
    title:{
        paddingLeft:10,
        paddingRight:10,
    },
    tagsList:{
        
    }
})