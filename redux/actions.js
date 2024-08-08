import { GET_LOGINUSERID, STORE_DEVICE_FCM_TOKEN } from "./actionType";

export const getLoginUserId = result =>({

    type: GET_LOGINUSERID,
    payload: result
});

export const getDeviceFCMToken = token => ({
    type: STORE_DEVICE_FCM_TOKEN,
    payload: token
});