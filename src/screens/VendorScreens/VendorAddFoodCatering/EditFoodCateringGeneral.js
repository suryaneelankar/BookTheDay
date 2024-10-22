import {View,Text,ScrollView,StyleSheet} from 'react-native';
import themevariable from '../../../utils/themevariable';
import GeneralDetails from './GeneralDetails';
import LinearGradient from 'react-native-linear-gradient';
import EditAddFoodCatering from './EditAddFoodCatering';

const EditAddFoodCateringGeneral = () => {
  return(
    <ScrollView style={styles.root}>

       <View style={styles.subContainer}>
        <EditAddFoodCatering />
       </View>
    </ScrollView>
  )
}

export default EditAddFoodCateringGeneral;

const styles=StyleSheet.create({
  root:{
    // backgroundColor: "#EBEDF3", 
    // paddingHorizontal: 10
    // backgroundColor:themevariable.Color_E1E1E2,
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
    color:themevariable.Color_000000,
    marginHorizontal:20
},
})