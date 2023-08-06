import { configureStore } from '@reduxjs/toolkit'
import userReducer from './module/userInfo'


  const store = configureStore( {

    reducer:{
      userReducer,
    }
  })


  export default store
