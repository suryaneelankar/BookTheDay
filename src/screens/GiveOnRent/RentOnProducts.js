import {View,Text,ScrollView,StyleSheet} from 'react-native'
import GeneralDetails from './RentOnProducts/GeneralDetails'
import themevariable from '../../utils/themevariable'
import LinearGradient from 'react-native-linear-gradient'

const RentOnProducts =()=>{
  return(
    <ScrollView style={styles.root}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#FFF7E7', '#FFF7E7', '#FFFFFF']} style={{ flex: 1 }}>

       <View style={styles.subContainer}>
       <Text style={styles.mainHeading}>General Details</Text>
        <GeneralDetails/>
       </View>
       </LinearGradient>
    </ScrollView>
  )
}

export default RentOnProducts

const styles=StyleSheet.create({
  root:{
    // backgroundColor: "#EBEDF3", 
    // backgroundColor:'green',
    flex:1,
  },
  subContainer:{
    marginHorizontal:10,
  },
  mainHeading:{
    marginTop:20,
    fontWeight:'bold',
    fontSize:20,
    color:themevariable.Color_000000
},
})