import {View,Text,ScrollView,StyleSheet} from 'react-native'
import GeneralDetails from './RentOnProducts/GeneralDetails'
import themevariable from '../../utils/themevariable'
import LinearGradient from 'react-native-linear-gradient'

const RentOnProducts =({route})=>{
  const {isAadharUpdate} = route.params;
  console.log("aadhar upload status:::::::", isAadharUpdate)
  return(
    <ScrollView style={styles.root}>

       <View style={styles.subContainer}>
       <Text style={styles.mainHeading}>General Details </Text>
        <GeneralDetails isAadharUpdate={isAadharUpdate}/>
       </View>
    </ScrollView>
  )
}

export default RentOnProducts

const styles=StyleSheet.create({
  root:{
    flex:1,
    backgroundColor:'#EBEDF3'

  },
  subContainer:{
    marginHorizontal:10,
  },
  mainHeading:{
    marginTop:20,
    fontWeight:'bold',
    fontSize:20,
    color:themevariable.Color_000000,
    marginHorizontal:10
},
})