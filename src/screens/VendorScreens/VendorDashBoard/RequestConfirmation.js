import React,{ useEffect, useState } from "react";
import { View, Text } from 'react-native';
import BASE_URL from "../../../apiconfig";
import axios from "axios";

const RequestConfirmation = ({navigation,route}) => {
    const { productId } = route?.params;

    const [productDetails,setProductDetails] = useState([]);
    
    useEffect(() => {
        getProductDetails();
    }, [])


    const getProductDetails = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/getClothJewelsById/${productId}`);
            console.log("getClothJewelsById::::::::::", response?.data);
            setProductDetails(response?.data)
        } catch (error) {
            console.log("categories::::::::::", error);
        }
    }


     return(
        <View>
            <Text>Request Details Screen {productId}</Text>

        </View>
     )
}

export default RequestConfirmation;