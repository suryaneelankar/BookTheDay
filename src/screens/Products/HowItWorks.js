import {View,Text,FlatList,StyleSheet} from "react-native"
import HatIcon from '../../assets/svgs/hatIcon.svg'
import TickIcon from '../../assets/svgs/tickIcon.svg'
import UserIcon from '../../assets/svgs/userIcon.svg'
import DetailsCardIcon from '../../assets/svgs/detailsCardIcon.svg'
import { LinearGradient } from "react-native-linear-gradient"
import themevariable from "../../utils/themevariable"

const Data = [
    {
        id: 0,
        header: 'Select Your Product',
        text: 'Choose from our exclusive collection of jewelry and clothing for your special day.',
        icon: UserIcon
    },
    {
        id: 1,
        header: 'Book your date & time',
        text: 'Schedule the rental date and time to secure your selected items.',
        icon: TickIcon
    },
    {
        id: 2,
        header: 'Receive Rental Confirmation',
        text: 'Get confirmation and rental details for your jewelry and clothing.',
        icon: DetailsCardIcon
    },
    {
        id: 3,
        header: 'Enjoy Your Special Day',
        text: 'Wear the rented jewelry and clothes and make your event memorable.',
        icon: HatIcon
    },
];


const Item =({item})=>{
    return(
        <View style={styles.listContainer}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#FFE39D', '#FCFCFC']} style={styles.iconContainer}> 
                <item.icon style={styles.icon}/>
            </LinearGradient>
            <View style={styles.infoContainer}>
                <Text style={styles.itemHeader}>{item.header}</Text>
                <Text style={styles.itemText}>{item.text}</Text>
            </View>
        </View>
    )
}
const HowItWorks=()=>{
    return(
        <View style={styles.rootContainer}>
        <View style={styles.topContainer}>
            <Text style={styles.worksText}>How it Works?</Text>
            <Text style={styles.simpleText}>Simple 4 steps</Text>
        </View>
        <FlatList
            data={Data}
            renderItem={({item}) => <Item item={item} />}
            keyExtractor={item => item.id}
            horizontal={false}
            style={styles.stepsContainer}
        />
        </View>
    )
}

export default HowItWorks

const styles=StyleSheet.create({
    rootContainer:{
        marginHorizontal:20,
    },
    topContainer:{
        marginVertical:20,
    },
    worksText:{
        color:themevariable.Color_333333,
        fontFamily:'ManropeRegular',
        fontWeight:'700',
        fontSize:18,

    },
    simpleText:{
        color:themevariable.Color_7D7F88,
        fontFamily:'ManropeRegular'
    },
    stepsContainer:{
        backgroundColor:themevariable.Color_FDF9EE,
        paddingBottom:20,
        paddingLeft:10,
        paddingRight:20,
        borderRadius:15

    },
    listContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
    },
    iconContainer:{
        borderRadius:100/2,
        alignSelf:'center',
        padding:10,
        marginRight:10,
    },
    icon:{
        width:25,
        height:25,
    },
    infoContainer:{
        borderBottomWidth:1,
        borderBottomColor:themevariable.Color_F5E7B6,
        padding:15
    },
    itemHeader:{
        color:themevariable.Color_131313,
        fontFamily:'ManropeRegular',
        fontWeight:'bold',
        fontSize:15,
        marginBottom:5

    },
    itemText:{
        color: themevariable.Color_13131380,
    },
})