import {Text,View,TextInput,StyleSheet} from 'react-native'
import themevariable from '../utils/themevariable'
const TextField = (props)=>{
    const {placeholder,onChangeHandler,keyboardType,value,label,isRequired} = props
    return(
        <View style={styles.inputContainer}>
            <Text style={styles.label}>
                {label}
                {isRequired && <Text style={styles.isRequired}>*</Text>}
            </Text>
            <TextInput
                style={styles.input}
                onChangeText={onChangeHandler}
                value={value}
                placeholder={placeholder}
                keyboardType={keyboardType}
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
        fontSize:18,
    },
    isRequired:{
        color:themevariable.Color_E73626,
    },
    input:{
        borderWidth:1,
        marginTop:10,
        borderColor:themevariable.Color_C8C8C6,
        paddingHorizontal:12,
        height:50,
        borderRadius:5,
    }
})