import {View,Text,ScrollView,StyleSheet} from 'react-native'
import GeneralDetails from './GeneralDetails'
import themevariable from '../../../utils/themevariable'

const AddTentHouse =()=>{
  return(
    <ScrollView style={styles.root}>
       <View style={styles.subContainer}>
       <Text style={styles.mainHeading}>General Details</Text>
        <GeneralDetails/>
       </View>
    </ScrollView>
  )
}

export default AddTentHouse

const styles=StyleSheet.create({
  root:{
    backgroundColor:themevariable.Color_E1E1E2,
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