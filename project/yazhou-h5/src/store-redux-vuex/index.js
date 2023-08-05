import { configureStore } from '@reduxjs/toolkit'
import menuReducer from './module/menu'
import betInfoReducer from './module/betInfo'
import userInfoReducer from './module/userinfo'
  const store = configureStore( {
    reducer:{
      betInfoReducer,
      userInfoReducer,
      menuReducer
    }
  })
  export default store
