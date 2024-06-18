import React,{useEffect, useState} from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import BASE_URL, { LocalHostUrl } from '../../apiconfig';
import axios from 'axios';

const data = [
  { id: '1', name: 'Mr. Riya Trivedi', role: 'Chef - Accord', rating: 4.5, status: 'Requested', image: 'chef-image-url' },
  { id: '2', name: 'Mr. Riya Trivedi', role: 'Price', rating: 4.5, status: 'Approved', image: 'price-image-url' },
  { id: '3', name: 'Mr. Riya Trivedi', role: 'Chef - Accord', rating: 4.5, status: 'Requested', image: 'chef-image-url' },
  { id: '4', name: 'Mr. Riya Trivedi', role: 'Chef - Accord', rating: 4.5, status: 'Rejected', image: 'rejected-image-url' },
];

const ongoingRental = {
  productName: 'Product Name',
  rentDays: 3,
  returnDate: '3 June',
  balanceDue: 200,
  image: 'jacket-image-url',
  status: 'Deposit Paid',
};



const ViewMyBookings = () => {
  const [myBookings, setMyBookings] = useState();


  useEffect(() => {
    getMyBookings();
  }, []);

  const getMyBookings = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/getUserBookings`);
        console.log("BOOKINGS RES:::::::::", JSON.stringify(response?.data))
        setMyBookings(response?.data?.data)
    } catch (error) {
        console.log("My Bookings data error>>::", error);
    }
};


  const renderItem = ({ item }) =>  {
    const updatedImgUrl = item?.professionalImage?.url ? item?.professionalImage?.url.replace('localhost', LocalHostUrl) : item?.professionalImage?.url;

    return(
    <View style={styles.card}>
      <Image resizeMode='contain' source={{ uri: updatedImgUrl }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item?.productName}</Text>
        <Text style={styles.cardTitle}>{item?.totalAmount}</Text>

        <Text style={styles.cardTitle}> Start Date: {item?.startDate}</Text>
        <Text style={styles.cardTitle}> End Date: {item?.endDate}</Text>
        <Text style={styles.cardTitle}>{item?.accepted ? 'Booking Confirmed' : 'Rejected'}</Text>

        <Text style={styles.cardSubtitle}>{item.role}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardRating}>{item.rating}</Text>
          <Text style={[styles.cardStatus, getStatusStyle(item.status)]}>{item.status}</Text>
        </View>
      </View>
    </View>
  )};

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Requested':
        return { backgroundColor: '#FFD580' };
      case 'Approved':
        return { backgroundColor: '#98FB98' };
      case 'Rejected':
        return { backgroundColor: '#FFC0CB' };
      default:
        return { backgroundColor: '#FFD580' };
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={myBookings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        // ListHeaderComponent={() => <Text style={styles.sectionHeader}>Ongoing Rentals</Text>}
        // ListFooterComponent={() => (
        //   <View style={styles.ongoingRentalCard}>
        //     <Image source={{ uri: ongoingRental.image }} style={styles.ongoingRentalImage} />
        //     <View style={styles.ongoingRentalContent}>
        //       <Text style={styles.ongoingRentalTitle}>{ongoingRental.productName}</Text>
        //       <Text style={styles.ongoingRentalDetails}>Rent Days: {ongoingRental.rentDays}</Text>
        //       <Text style={styles.ongoingRentalDetails}>Return date: {ongoingRental.returnDate}</Text>
        //       <Text style={styles.ongoingRentalDetails}>Balance Due: ₹{ongoingRental.balanceDue}</Text>
        //       <View style={styles.ongoingRentalFooter}>
        //         <Text style={styles.ongoingRentalStatus}>{ongoingRental.status}</Text>
        //         <TouchableOpacity style={styles.payNowButton}>
        //           <Text style={styles.payNowButtonText}>Pay Now</Text>
        //         </TouchableOpacity>
        //       </View>
        //     </View>
        //   </View>
        // )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F3F5FB',
},
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    marginRight: 16,
    flex: 1,
  },
  cardImage: {
    height: 120,
    width: '100%',
  },
  cardContent: {
    padding: 8,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color:"#333333",
    fontFamily: 'ManropeRegular'
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555555',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  cardRating: {
    fontSize: 14,
    color: '#FFA500',
  },
  cardStatus: {
    padding: 4,
    borderRadius: 4,
    color: '#FFFFFF',
    fontSize: 12,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ongoingRentalCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  ongoingRentalImage: {
    height: 80,
    width: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  ongoingRentalContent: {
    flex: 1,
  },
  ongoingRentalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ongoingRentalDetails: {
    fontSize: 14,
    color: '#555555',
  },
  ongoingRentalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  ongoingRentalStatus: {
    fontSize: 14,
    color: '#32CD32',
  },
  payNowButton: {
    backgroundColor: '#FF6347',
    padding: 8,
    borderRadius: 4,
  },
  payNowButtonText: {
    color: '#FFFFFF',
  },
});

export default ViewMyBookings;
