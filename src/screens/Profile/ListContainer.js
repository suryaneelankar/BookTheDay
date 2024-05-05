import React from "react";
import {View, Text,FlatList, StyleSheet, Pressable} from 'react-native';
import ProfileData from "./ProfileData";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons"
import Entypo from "react-native-vector-icons/Entypo"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import AntDesign from "react-native-vector-icons/AntDesign"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useNavigation } from "@react-navigation/native";

const ProfileListContainer = () =>{
    const navigation = useNavigation()

    const getIconByName = (iconName, size, color) => {
        switch (iconName) {
            case 'user' || 'handshake-o' || 'phone':
                return <FontAwesome style={styles.icon} name={iconName} size={size} color={color} />;
            case 'calendar-sharp':
                return <Ionicons style={styles.icon} name={iconName} size={22} color={color} />;
            case 'location-pin':
                return <Entypo style={styles.icon} name={iconName} size={27} color={color} />; 
            case 'notifications':
                return <Ionicons style={styles.icon} name={iconName} size={25} color={color} />;
            case 'notification':
                return <AntDesign style={styles.icon} name={iconName} size={28} color={color} />;
            case 'exclamationcircle':
                return <AntDesign style={styles.icon} name={iconName} size={25} color={color} />;
            case 'privacy-tip':
                return <MaterialIcons style={styles.icon} name={iconName} size={25} color={color} />;
            case 'cash-refund':
                return <MaterialCommunityIcons style={styles.icon} name={iconName} size={25} color={color} />;
            case 'logout':
                return <MaterialCommunityIcons style={styles.icon} name={iconName} size={25} color={color} />;
            default:
                return <FontAwesome style={styles.icon} name={iconName} size={size} color={color} />; 
        }
    };

    const ListItem=({item})=>{
       return(
        <Pressable style={styles.listItem} onPress={()=>navigation.navigate(item.navigateScreen)} key={item.id}>
            <View style={styles.leftContainer}>
            {getIconByName(item.iconName, 30, '#676767')}
                <Text style={styles.displayName}>{item.displayName}</Text>
            </View >
            <MaterialIcons style={styles.rightArrow} name="arrow-forward-ios" color="black" size={20}/>
        </Pressable>
        )
    }

    return(
        <FlatList
            data={ProfileData}
            renderItem={ListItem}
            keyExtractor={item => item.id}
        />
    )
}
const styles=StyleSheet.create({
    listItem:{  
        flexDirection:'row', 
        justifyContent:'space-between', 
        borderBottomColor:'#D3D3D3',
        borderBottomWidth:1,  
        alignItems:'center'
    },
    leftContainer:{
        flexDirection:'row',
        alignItems:'center',
        height:60,
       
    },
    displayName:{
        fontSize:16,
        color:'black'
    },
    icon:{
        marginLeft:15,
        marginRight:10,
    },
    rightArrow:{
        marginRight:12,
    }
})

export default ProfileListContainer;
