import {View,Text,FlatList} from "react-native"
import HatIcon from '../../assets/svgs/hatIcon.svg'
import TickIcon from '../../assets/svgs/tickIcon.svg'
import UserIcon from '../../assets/svgs/userIcon.svg'
import DetailsCardIcon from '../../assets/svgs/detailsCardIcon.svg'

const Data=[
    {
        id:0,
        header:'Select Your Product',
        text:'Your EcoFlex host will use it to identify you at pickup.',
        icon:UserIcon
    },
    {
        id:1,
        header:'Book your date & time',
        text:'We’ll send you a verification code to help secure your account',
        icon:TickIcon
    },
    {
        id:2,
        header:'Receive Chef contact details',
        text:'You must have a valid driver’s license to book on EcoFlex.',
        icon:DetailsCardIcon,
    },
    {
        id:3,
        header:'Have Chef in your Home',
        text:'You won’t be charged until you book your trip.',
        icon:HatIcon
    },
]

const Item =({item})=>{
    return(
        <View>
            <item.icon width={20} height={20}/>
            <View>
                <Text>{item.header}</Text>
                <Text>{item.text}</Text>
            </View>
        </View>
    )
}
const HowItWorks=()=>{
    return(
        <>
        <View>
            <Text>How it Works</Text>
            <Text>Simple 3 steps</Text>
        </View>
        <FlatList
            data={Data}
            renderItem={({item}) => <Item item={item} />}
            keyExtractor={item => item.id}
            horizontal={false}
        />
        </>
    )
}

export default HowItWorks