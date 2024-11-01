import {View,Text,ScrollView,StyleSheet} from 'react-native';
import themevariable from '../../../utils/themevariable';
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