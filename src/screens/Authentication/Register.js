import {View,Text,Image, StyleSheet,Platform,TextInput,Button, Pressable,TouchableOpacity} from 'react-native'
import { useState } from 'react';
import GlobaColors from '../../utils/GlobaColors';

const Login=()=>{
    const [phoneNumber, setPhoneNumber] = useState('')
    const [isFocused,setIsFocused] = useState(false)
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
                <Text style={styles.welComeText}>Create Account</Text>
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
            <Text style={styles.labelText}>Password</Text>
            <View style={styles.phoneContainer}>
            <TextInput
                style={styles.input}
                keyboardType="alpha-numberic" 
                value={phoneNumber}
                placeholder='Enter your Password'
                onChangeText={handlePhoneNumber}
                maxLength={15} 
                
            />
            </View>
            <Text style={styles.labelText}>Confirm Password</Text>
            <View style={styles.phoneContainer}>
            <TextInput
                style={styles.input}
                keyboardType="alpha-numberic" 
                value={phoneNumber}
                placeholder='Confirm your Password'
                onChangeText={handlePhoneNumber}
                maxLength={15} 
                
            />
            </View>
            <TouchableOpacity style={styles.loginContainer}>
                <Text style={styles.loginText}>Register</Text>
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
        marginBottom:30,
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