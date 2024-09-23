import {Text,View,TextInput,StyleSheet} from 'react-native'
import themevariable from '../utils/themevariable'
const TextField = (props)=>{
    const { placeholder,onChangeHandler,keyboardType,value,label,isRequired, isDescriptionField = false} = props
    return(
        <View style={styles.inputContainer}>
            <Text style={styles.label}>
                {label}
                {isRequired && <Text style={styles.isRequired}>*</Text>}
            </Text>
            <TextInput
                style={[styles.input,{height: isDescriptionField ? 100 : 50,textAlignVertical: isDescriptionField ? 'top' : 'center'}]}
                onChangeText={onChangeHandler}
                value={value}
                placeholder={placeholder}
                keyboardType={keyboardType}
                multiline={true}
                numberOfLines={4}
                
        />
        </View>
    )
}

export default TextField

const styles= StyleSheet.create({
    inputContainer:{},
    label:{
        fontFamily:'ManropeRegular',
        fontWeight:'bold',
        color:themevariable.Color_000000,
        fontSize:15,
        marginTop:15
    },
    isRequired:{
        color:themevariable.Color_E73626,
    },
    input:{
        borderWidth:1,
        marginTop:10,
        borderColor:themevariable.Color_C8C8C6,
        paddingHorizontal:12,
        borderRadius:5,
    }
})