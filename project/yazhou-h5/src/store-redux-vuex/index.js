import { configureStore } from '@reduxjs/toolkit'
import menuReducer from './module/menu'
import matchReducer from './module/match'

import betInfoReducer from './module/betInfo'
import userInfoReducer from './module/userinfo'
  const store = configureStore( {
    reducer:{
      betInfoReducer,
      userInfoReducer,
      menuReducer,
      matchReducer
    }
  })
  export default store
