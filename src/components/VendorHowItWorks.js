import { View, Text, FlatList, StyleSheet } from "react-native";
import HatIcon from '../assets/svgs/hatIcon.svg';
import TickIcon from '../assets/svgs/tickIcon.svg';
import UserIcon from '../assets/svgs/userIcon.svg';
import DetailsCardIcon from '../assets/svgs/detailsCardIcon.svg';
import LinearGradient from "react-native-linear-gradient";
import themevariable from "../utils/themevariable";

const Data = [
    {
        id: 0,
        header: 'Step 1: Add Your Services',
        text: 'List your function halls, clothing, jewellery, or catering services on the platform.',
        icon: UserIcon
    },
    {
        id: 1,
        header: 'Step 2: Receive Bookings',
        text: 'Get notified when customers book your services and manage your listings easily.',
        icon: TickIcon
    },
    {
        id: 2,
        header: 'Step 3: Provide Services',
        text: 'Fulfill the bookings and grow your business with increased visibility and convenience.',
        icon: DetailsCardIcon,
    },
];

const Item = ({ item }) => {
    return (
        <View style={styles.listContainer}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#FFE39D', '#FCFCFC']} style={styles.iconContainer}>
                <item.icon style={styles.icon} />
            </LinearGradient>
            <View style={styles.infoContainer}>
                <Text style={styles.itemHeader}>{item.header}</Text>
                <Text style={styles.itemText}>{item.text}</Text>
            </View>
        </View>
    );
};

const VendorHowItWorks = () => {
    return (
        <View style={styles.rootContainer}>
            <Text style={styles.howItWorksHeader}>How It Works</Text>
            {Data.map((item) => (
                <View key={item.id} style={styles.howItWorksStep}>
                    <item.icon style={styles.icon} />
                    <View style={{marginHorizontal:10}}>
                    <Text style={styles.stepTitle}>{item.header}</Text>
                    <Text style={styles.stepDescription}>{item.text}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
};

export default VendorHowItWorks;

const styles = StyleSheet.create({
    rootContainer: {
        marginHorizontal: 20,
        marginBottom:40
    },
    howItWorksHeader: {
        color: themevariable.Color_333333,
        fontFamily: 'ManropeRegular',
        fontWeight: '700',
        fontSize: 18,
        marginVertical: 20,
    },
    howItWorksStep: {
        marginBottom: 20,
        flexDirection:"row",
        paddingHorizontal:5
    },
    stepTitle: {
        color: themevariable.Color_131313,
        fontFamily: 'ManropeRegular',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    stepDescription: {
        color: themevariable.Color_7D7F88,
        fontFamily: 'ManropeRegular',
        fontSize: 14,
    },
    listContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    iconContainer: {
        borderRadius: 50,
        alignSelf: 'center',
        padding: 10,
        marginRight: 10,
    },
    icon: {
        width: 25,
        height: 25,
    },
    infoContainer: {
        borderBottomWidth: 1,
        borderBottomColor: themevariable.Color_F5E7B6,
        padding: 15,
        flex: 1,
    },
    itemHeader: {
        color: themevariable.Color_131313,
        fontFamily: 'ManropeRegular',
        fontWeight: 'bold',
        fontSize: 15,
        marginBottom: 5,
    },
    itemText: {
        color: themevariable.Color_13131380,
    },
});
