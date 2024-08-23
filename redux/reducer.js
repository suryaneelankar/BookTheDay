
const initialState = {
    userId: '',
    deviceFCMToken: '',
    vendorLoggedInMobileNum: '',
    userLoggedInMobileNum: ''
}
export const commonReducer = (state = initialState, action) => {
    switch (action.type) {
            case 'GET_LOGINUSERID':
            return {
                ...state,
                userId: action.payload,
               
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
        default:
            return state;
    }

};