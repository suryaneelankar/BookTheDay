
const initialState = {
    userId: '',
}
export const ApiResponse = (state = initialState, action) => {
    switch (action.type) {
            case 'GET_LOGINUSERID':
            return {
                ...state,
                userId: action.payload,
               
            };

        default:
            return state;
    }

};