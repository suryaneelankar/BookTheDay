import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';

export default function VendorApprovalPending({ navigation, route }) {
  const mobileNumber = route.params?.mobileNumber || '';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <IonIcon name="time-outline" size={34} color="#A7603C" />
        </View>
        <Text style={styles.title}>Verification pending</Text>
        <Text style={styles.description}>
          Your vendor registration was received. BookTheDay will verify your details before enabling venue access.
        </Text>
        {!!mobileNumber && (
          <Text style={styles.mobile}>Registered mobile: {mobileNumber}</Text>
        )}
        <View style={styles.note}>
          <IonIcon name="call-outline" size={17} color="#7A5F52" />
          <Text style={styles.noteText}>Our team may call this number to confirm venue ownership.</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.buttonText}>Back to login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#FFF9F5' },
  card: { padding: 22, borderWidth: 1, borderColor: '#EAD8CC', borderRadius: 20, backgroundColor: '#FFFFFF' },
  iconWrap: { width: 64, height: 64, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', borderRadius: 32, backgroundColor: '#FBEDE4' },
  title: { marginTop: 16, color: '#3E2D25', fontSize: 21, fontWeight: '800', textAlign: 'center' },
  description: { marginTop: 9, color: '#76635A', fontSize: 13, lineHeight: 20, textAlign: 'center' },
  mobile: { marginTop: 13, color: '#59453B', fontSize: 13, fontWeight: '700', textAlign: 'center' },
  note: { flexDirection: 'row', alignItems: 'center', marginTop: 18, padding: 12, borderRadius: 12, backgroundColor: '#FFF6EF' },
  noteText: { flex: 1, marginLeft: 8, color: '#715C51', fontSize: 12, lineHeight: 17 },
  button: { alignItems: 'center', marginTop: 20, paddingVertical: 13, borderRadius: 13, backgroundColor: '#A75C36' },
  buttonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});
