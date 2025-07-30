import {View,ScrollView,StyleSheet} from 'react-native'
import GeneralDetails from './GeneralDetails'
import LinearGradient from 'react-native-linear-gradient'

const AddFunctionalHall =({route})=>{
  const {isAadharUpdate} = route.params;
  return(
    <ScrollView style={styles.root}>
      <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#FFF7E7', '#FFF7E7', '#FFFFFF']} style={{ flex: 1 }}>
       <View style={styles.subContainer}>
        <GeneralDetails  isAadharUpdate={isAadharUpdate}/>
       </View>
      </LinearGradient>
    </ScrollView>
  )
}

export default AddFunctionalHall;

const styles=StyleSheet.create({
  root:{
    flex:1,
  },
  subContainer:{
    // marginHorizontal:10,
  },
})