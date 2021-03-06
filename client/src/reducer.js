

export default function reducer(state, {type, payload}) {    
    switch(type) {

        case "SET_CURRENT_LOCATION": 
            return {
                ...state,
                currentLocation: payload,
            }
        case "LOGIN_USER": 
            return {
                ...state,
                currentUser: payload
            }

        case "IS_LOGGED_IN": 
            return {
                ...state,
                isAuth: payload
            }

        case "SIGNOUT_USER": 
            return {
                ...state,
                isAuth: false,
                currentUser: null
            }

        case "CREATE_DRAFT": 
            return {
                ...state,
                currentPin: null,
                draft: { ...state.currentLocation}
            }
            
        case "DELETE_DRAFT": 
            return {
                ...state,
                draft: null
            }
        

        case "DELETE_PIN" : 
            const remainingPins = state.pins.filter(pin => pin._id !== payload._id);

            console.log("before and after", payload, state.pins.length, remainingPins.length);

            return {
                ...state,
                pins: remainingPins,
                checkedin: false,
                currentPin: null,
                draft: null
            }

        case "GET_PINS": 
            
            // handle local conversion of today date 
            // Filter only those posted today as local time
            // convert the createdAt date pin to local time first then filter
            const currentDate = new Date();
            const todayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
            var todayPosts = payload.filter(pin => pin.createdAt >= todayDate.valueOf());

            const myPin = todayPosts.find(pin => pin.author._id === state.currentUser._id);

            return {
                ...state,
                pins: todayPosts,
                currentPin: myPin,
                draft: myPin !== undefined ? null : {...state.currentLocation},
                checkedin: myPin !== undefined
            }
         
        case "CREATE_PIN": 
            const newPin = payload
            const prevPins = state.pins.filter(pin => pin._id !== newPin._id)

            return {
                ...state,
                pins: [...prevPins, newPin],
                currentPin: payload,
                checkedin: true,
                draft: null
            }

        case "SET_PIN": 
            return {
                ...state,
                currentPin: payload,
                draft: null
            }

        case "CREATE_COMMENT": 
            const updatedCurrentPin = payload;

            const updatedPins = state.pins.map(pin => 
                pin._id === updatedCurrentPin._id ? updatedCurrentPin : pin
            )

            return {
                ...state,
                pins: updatedPins,
                currentPin: updatedCurrentPin
            }

        case "EDIT_PIN": 
            const editPin = payload;
            return {
                ...state,
                draft: editPin,
            }

        case "CLOSE_CURRENT_PIN": {
            return {
                ...state,
                currentPin: null,
            }
        }
        
        default: 
            return state;        
    }
}