import {View, Text,StyleSheet, Button} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import ProfileListContainer from "./ListContainer";
import { verticalScale } from '../../utils/scalingMetrics';

const ProfileMainScreen = ({navigation}) =>{
    return(
        
        <View style={styles.root}>
            <View style={styles.topContainer}>
                <View style={styles.imageContainer}>
                    <Icon name="user" color="#ffffff" size={80} style={styles.image}/>
                </View>
                
                <View style={styles.textContainer}>
                    <Text style={styles.userName}>Guest</Text>
                    <Text style={styles.phoneNumber}>+91-7661991537</Text>
                </View>
            </View>
            <View style={styles.buttonsContainer}>
                <View style={styles.loginContainer}>
                    <Button title="Login" style={styles.loginButton} onPress={()=>navigation.navigate('Login')}/>
                </View>
                <View style={styles.registerContainer}>
                    <Button title="Register" style={styles.registorButton}  onPress={()=>navigation.navigate('Register')}/>
                </View>
            </View>
            <View style={styles.listContainer}>
                <ProfileListContainer/>
            </View>
        </View>
        
    )
}

export default ProfileMainScreen;

const styles=StyleSheet.create({
    root:{
        flex:1,
        // marginBottom: verticalScale(70)
    },
    topContainer:{
        flexDirection:'row'
    },
    imageContainer:{
        width:100,
        height:100,
        backgroundColor:'#D3D3D3',
        borderRadius:100 / 2,
        marginTop:40,
        marginLeft:20,
    },
    image:{
        marginLeft:20,
        marginTop:20,
    },
    userName:{
      fontWeight:'bold',
      fontSize:20,
      color:'black',
    },
    phoneNumber:{
        color:'#676767',
        fontWeight:'500',
        fontSize:18,
    },
    textContainer:{
        flexDirection:'column',
        justifyContent:'center',
        marginLeft:10,
        marginTop:4,
        
    },
    buttonsContainer:{
        width:"30%",
        marginLeft:20,
        marginTop:20,
    },
    loginContainer:{
        marginBottom:20,
        // textTransform:'uppercase'
    },
    loginButton:{
        // verticalAlign:10
        
    },
    registerContainer:{

    },
    registorButton:{
        margin:20,
    },
    listContainer:{
        flex:1,
        marginTop:40,
    }
})
