
const initialState = {
    userId: '',
    deviceFCMToken: '',
    vendorLoggedInMobileNum: '',
    userLocation:'',
    userLoggedInMobileNum: '',
    userCurrentLocation: '',
    userLoggedInName: ''
}
export const commonReducer = (state = initialState, action) => {
    switch (action.type) {
            case 'GET_LOGINUSERID':
            return {
                ...state,
                userId: action.payload,
               
            };
            case 'GET_USERLOCATION':
            return {
                ...state,
                userLocation: action.payload,
               
            };
            case 'STORE_DEVICE_FCM_TOKEN':
                return {
                    ...state,
                    deviceFCMToken: action.payload,
                }
            case 'GET_LOGGED_IN_VENDOR_MOBILE_NUM':
                return {
                    ...state,
                    vendorLoggedInMobileNum: action.payload,
                }
            case 'GET_LOGGED_IN_USER_MOBILE_NUM':
                return {
                    ...state,
                    userLoggedInMobileNum: action.payload
                }
            case 'GET_LOGGED_IN_USER_NAME':
                return {
                        ...state,
                        userLoggedInName: action.payload
                }
            case 'STORE_USER_CURRENT_LOCATION' :
                return {
                    ...state,
                    userCurrentLocation: action.payload
                }
        default:
            return state;
    }

};