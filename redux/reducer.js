
const initialState = {
    userId: '',
    deviceFCMToken: ''
}
export const ApiResponse = (state = initialState, action) => {
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
        default:
            return state;
    }

};