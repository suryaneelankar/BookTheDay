import {Pressable, Text,View,StyleSheet} from 'react-native'
import themevariable from '../utils/themevariable'

const ChooseFileField = (props)=>{
    const {label,placeholder,isRequired} = props
    return(
        <View style={styles.root}>
            <Text style={styles.label}>
                {label}
                {isRequired && <Text style={styles.isRequired}>*</Text>}
            </Text>
            <View style={styles.fieldContainer}>
                <Text style={styles.placeholder }>{placeholder}</Text>
                <Pressable style={styles.buttonContainer}>
                    <Text style={styles.text}>Choose File</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default ChooseFileField

const styles=StyleSheet.create({
    root:{
        marginBottom:20
    },
    label:{
        fontFamily:'ManropeRegular',
        fontWeight:'bold',
        color:themevariable.Color_000000,
        fontSize:18,
    },
    isRequired:{
        color:themevariable.Color_E73626,
    },
    fieldContainer:{
        marginTop:10,
        borderWidth:1,
        borderColor:themevariable.Color_C8C8C6,
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal:12,
        height:50,
        borderRadius:5
    },
    placeholder:{
        alignSelf:'center',
        color:themevariable.Color_D9D9D9,
        fontWeight:'500',
    },
    buttonContainer:{
        width:110,
        backgroundColor:themevariable.Color_FD813B,
        borderRadius:18,
        padding:5,
        height:32,
        alignSelf:'center'
    },
    text:{
        fontSize:15,
        color:themevariable.Color_FFFFFF,
        alignSelf:'center'
    }
})