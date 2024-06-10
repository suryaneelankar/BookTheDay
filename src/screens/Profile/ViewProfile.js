import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const ViewProfile = () => {
    const navigation = useNavigation()
    const ProfileDetail = ({ label, value }) => (
        <View style={styles.detailContainer}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
      );

    return (
        <LinearGradient start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }} colors={['#FFF3CD', '#FFDB7E', '#FFDB7E', '#FFDB7E']} style={{ flex: 1 }}>
            <View style={styles.profileContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                <Text style={{textAlign:"right", fontSize:14, fontWeight:"600", color:"#000000",fontFamily: 'ManropeRegular'}}>Edit Profile</Text>
                </TouchableOpacity>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/150' }}
                        style={styles.profileImage}
                    />
                </View>
                <Text style={styles.profileName}>Donye Collins</Text>
                <Text style={styles.profileEmail}>iamcollinsdonye@gmail.com</Text>
            </View>

            <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
                    <ProfileDetail label="Full Name" value="Dummy Name" />
                    <ProfileDetail label="Contact Number" value="+91-6564368993" />
                    <ProfileDetail label="Email Address" value="emailaddress@gmail.com" />
                    <ProfileDetail label="Address" value="23, First Cross, Laprote Street, India 60349" />
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    profileContainer: {
        // alignItems: 'center',
        padding: 10,
    },
    profileImageContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        alignSelf:"center"
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    profileName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#121826',
        fontFamily: 'ManropeRegular',
        alignSelf:"center"
    },
    profileEmail: {
        fontSize: 12,
        color: '#121826',
        fontFamily: 'ManropeRegular',
        fontWeight: "400",
        alignSelf:"center"

    },
    menuContainer: {
        paddingTop: 50,
        borderRadius: 10,
        backgroundColor: "white",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal:20
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    detailContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#000000',
        fontWeight: '700',
        fontFamily: 'ManropeRegular',
        marginBottom:2

    },
    value: {
        fontSize: 14,
        color: '#1F1F1F',
        fontWeight: '500',
        fontFamily: 'ManropeRegular',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 8,
    },
});

export default ViewProfile;
