import { GET_LOGINUSERID } from "./actionType";

export const getLoginUserId = result =>({

    type: GET_LOGINUSERID,
    payload: result
});