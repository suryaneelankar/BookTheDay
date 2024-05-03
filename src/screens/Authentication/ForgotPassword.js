import {View,Text,Image, StyleSheet,Platform,TextInput,Button, Pressable,TouchableOpacity} from 'react-native'
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import GlobaColors from '../../utils/GlobaColors';

const Login=()=>{
    const [phoneNumber, setPhoneNumber] = useState('')
    const [isFocused,setIsFocused] = useState(false)
    const navigation =useNavigation()
    const handlePhoneNumber=(number)=>{
        setPhoneNumber(number)
        console.log("number",number)
    }
    const handleOnFocus=()=>{
        setIsFocused(true)
    }
    return(
        <View style={styles.rootContainer}>
            <View style={styles.topContainer}>
                <Image source={require('../../assets/logo.webp')} style={styles.logo} resizeMode='contain'/>
                <Text style={styles.welComeText}>Forgot Your Password?</Text>
                <Text style={styles.sentence}>Enter your email to reset password</Text>
            </View>
            <Text style={styles.labelText}>Email</Text>
            <View style={styles.phoneContainer}>
            <TextInput
                style={[styles.input]}
                keyboardType="alpha-numberic" 
                value={phoneNumber}
                placeholder='Enter your Email'
                onChange={handlePhoneNumber}
                maxLength={15} 
            />
            </View>
            <TouchableOpacity style={styles.loginContainer} onPress={()=>navigation.navigate('ResetPassword')}>
                <Text style={styles.loginText}>Submit</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Login
const os = Platform.OS;
const styles=StyleSheet.create({
    rootContainer:{
        width:'90%',
        alignSelf:'center'
    },
    topContainer:{
        alignItems:'center'
    },
    welComeText:{
        fontSize:28,
        fontWeight:'600',
        color:GlobaColors.BLACK500,
    },
    sentence:{
        fontSize:17,        
        textAlign:'center',
        fontWeight:'400',
        marginVertical:20,
    },
    logo:{
        width: 150,
        height: 100,
        marginTop: os === 'ios' ? 30 : 0,
    },
    labelText:{
        fontSize:15,
        fontWeight:'500',
        color:GlobaColors.BLACK400,
    },
    phoneContainer:{
        backgroundColor:GlobaColors.WHITE500,
        borderColor:GlobaColors.BLACK300,
        borderWidth:2,
        marginVertical:10,
        borderRadius:10,
    },
    input:{
        fontWeight:'400'
    },
    loginContainer:{
        marginTop:25,
        backgroundColor:GlobaColors.ORANGE300,
        height:45,
        borderRadius:7,
        alignItems:'center',
        justifyContent:'center'
    },
    loginText:{
        color:GlobaColors.WHITE500,
        fontSize:19,
        fontWeight:'600'
    }
})