import { configureStore } from '@reduxjs/toolkit'
import userReducer from './module/user-info'
import configReducer from './module/config'


  const store = configureStore( {

    reducer:{
      userReducer,
      configReducer
    }
  })


  export default store
