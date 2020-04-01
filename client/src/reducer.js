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

        case "GET_PINS": 
            
            const myPin = payload.find(pin => pin.author._id === state.currentUser._id);
            
            return {
                ...state,
                pins: payload,
                currentPin: myPin,
                checkedin: myPin !== undefined
            }
         
        case "CREATE_PIN": 
            const newPin = payload
            const prevPins = state.pins.filter(pin => pin._id !== newPin._id)

            return {
                ...state,
                pins: [...prevPins, newPin],
                currentPin: payload
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
        
        default: 
            return state;        
    }
}