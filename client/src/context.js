import {createContext} from 'react'

const context = createContext({
    currentUser: null,
    isAuth: false,
    draft: null, 
    pins: [],
    currentLocation: null,
    currentPin: null, 
    checkedin: false
})

export default context;