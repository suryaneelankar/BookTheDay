import { GET_LOGINUSERID, STORE_DEVICE_FCM_TOKEN, GET_LOGGED_IN_VENDOR_MOBILE_NUM , GET_USERLOCATION, GET_LOGGED_IN_USER_MOBILE_NUM, STORE_USER_CURRENT_LOCATION,GET_LOGGED_IN_USER_NAME} from "./actionType";

export const getLoginUserId = result =>({

    type: GET_LOGINUSERID,
    payload: result
});

export const getDeviceFCMToken = token => ({
    type: STORE_DEVICE_FCM_TOKEN,
    payload: token
});

export const getCurrentLoggedInVendorMobileNum = num => ({
    type: GET_LOGGED_IN_VENDOR_MOBILE_NUM,
    payload: num
});

export const getUserLocation = result =>({

    type: GET_USERLOCATION,
    payload: result
});

export const getCurrentLoggedInUserMobileNum = num => ({
    type: GET_LOGGED_IN_USER_MOBILE_NUM,
    payload: num
});

export const getCurrentLoggedInUserName = result => ({
    type: GET_LOGGED_IN_USER_NAME,
    payload: result
})

export const setUserCurrentLocation = location => ({
    type: STORE_USER_CURRENT_LOCATION,
    payload: location
})
